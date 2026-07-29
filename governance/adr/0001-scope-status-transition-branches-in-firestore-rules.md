# ADR-0001: Field-scope the unscoped status-transition branches in `firestore.rules`

| Field | Value |
|---|---|
| **ADR** | 0001 |
| **Title** | Field-scope the unscoped status-transition branches in `firestore.rules` |
| **Status** | **Accepted** — in force as of 2026-07-29. Implemented; see [`ADR-0001_IMPLEMENTATION_REPORT.md`](../../ADR-0001_IMPLEMENTATION_REPORT.md). |
| **Date** | 2026-07-29 |
| **Author(s)** | Platform Stabilization v1.1 — rules-unit-test pass (Claude Opus 5) |
| **Deciders** | Repository owner (approved 2026-07-29) |
| **Non-Negotiables touched** | NN-9 (field-scoped transition branches), NN-3 (approve ≠ initiate), NN-1 (boundary is the only trust), NN-29/TEST-3 (rules tests) |
| **Supersedes** | none |

---

## 1. Context

The `tests/rules/` suite added by Platform Stabilization v1.1 (161 tests, all passing)
exercised `firestore.rules` against the Firestore emulator for the first time. It
confirmed that every **money** transition is correctly denied to all client roles —
payment→RELEASED, bill→APPROVED, bill→PAID/PARTIALLY_PAID, and VO→APPROVED have no
client branch at all (AUDIT SECURITY C-2/C-3 closed at the boundary).

It also exposed **two previously undocumented gaps** of the same structural shape.
In both collections, a broad *"role X may edit anything while the document is in state
S"* branch sits alongside narrow, field-scoped transition branches — and the broad
branch **subsumes** the narrow ones, because `status` is just another field it permits.

**Gap R-1 — a PROJECT_MANAGER can self-approve a work order.**
[`firestore.rules:193`](../../firestore.rules#L193):
```
|| (isPM() && currentStatus() == 'PENDING')      // no onlyFieldsChanged guard
```
This permits `status: 'APPROVED'`, making the field-scoped CEO branch at
[`:195-197`](../../firestore.rules#L195-L197) and the PM-reject branch at
[`:199-201`](../../firestore.rules#L199-L201) redundant. An APPROVED work order is the
precondition for raising bills against it (`billService.create` requires
`APPROVED`/`COMPLETED`), so this defeats the documented CEO approval gate.
Verified by `tests/rules/workOrders.rules.test.ts`
("CHARACTERIZATION (NEW GAP R-1): a PM can self-APPROVE their own PENDING work order").

**Gap R-2 — ACCOUNTS can self-verify a bill.**
[`firestore.rules:245`](../../firestore.rules#L245):
```
((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT')   // no onlyFieldsChanged guard
```
This permits `status: 'VERIFIED'`, making the field-scoped PM-verify branch at
[`:247-249`](../../firestore.rules#L247-L249) redundant. ACCOUNTS both **creates** bills
and can then **verify** them. Verified by `tests/rules/bills.rules.test.ts`
("CHARACTERIZATION (NEW GAP R-2): ACCOUNTS can self-VERIFY a DRAFT bill").

**Forces at play:**
- Both gaps violate **NN-9**: *"Every status-transition rule branch scopes its writable
  fields with `onlyFieldsChanged`."* The intent is already written in the rule comments
  ("PM verifies: DRAFT → VERIFIED", "CEO can approve") — only the enforcement is missing.
- Both violate **NN-3** (separation of duties: approve ≠ initiate).
- **Severity is bounded.** Neither gap moves money. Bill APPROVE, payment RELEASE and
  VO APPROVE remain denied to every client role, so no cash can leave and no bill can be
  marked paid. The blast radius is *workflow-stage integrity*, not funds.
- **Reachability is client-SDK-only.** The application's own paths are stricter: the
  server route `verifyBill` requires `PROJECT_MANAGER`/`ADMIN`
  ([`server/secureRoutes.ts:256`](../../server/secureRoutes.ts#L256)), and the WO
  approval UI is CEO-gated. A user must bypass the app and write with the Firestore SDK
  directly — which is exactly the threat model NN-1 exists to address.
- Today's deployment is single-operator/trusted-team beta, which is why this has not
  bitten; it is squarely blocking for untrusted multi-tenant operation.

## 2. Decision

**We will add `onlyFieldsChanged` guards so that no rule branch permits a `status`
change except a branch written specifically for that transition.**

Concretely, in [`firestore.rules`](../../firestore.rules):

1. **`workOrders` (`:193`)** — constrain the broad PM branch so it cannot touch `status`:
   ```
   || (isPM() && currentStatus() == 'PENDING'
       && request.resource.data.status == resource.data.status)
   ```
   The existing field-scoped CEO-approve, PM-reject and CEO-complete branches then become
   the *only* routes to a status change, as their comments already claim.

2. **`bills` (`:245`)** — constrain the broad ACCOUNTS/ADMIN DRAFT branch identically:
   ```
   || ((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT'
       && request.resource.data.status == resource.data.status)
   ```
   The PM-verify and PM/CEO-reject branches remain the only status routes.

This **continues from the current implementation** (NN-19). No branch is added or
removed, no role gains a permission, no collection or schema changes. Each edit adds one
conjunct to an existing branch, applying the field-scoping discipline already used by the
`paymentRequests` block — the constitution's own exemplar — to two branches that were
written before that discipline was settled. It is strictly a **tightening**: every write
permitted after this change was permitted before it.

**Deliberately NOT in scope of this ADR:**
- The `isAdmin()` full-override branch on `workOrders` (`:191`) is retained as the
  documented emergency escape hatch; it is already constrained by
  `workOrderIdentityUnchanged()`.
- The `auditLogs` forgery gap (AUDIT H-3 / NN-12) is a separate defect with a separate
  fix (`request.resource.data.userId == request.auth.uid`) and warrants its own ADR.

## 3. Alternatives considered

| Alternative | Pros | Cons | Rejected because |
|---|---|---|---|
| **A. Do nothing** — accept both gaps, document them | Zero risk of breaking a working beta; no rules deploy needed | Leaves two NN-9 and NN-3 violations in the only production trust layer; blocks untrusted multi-tenant operation; the rule comments actively misdescribe the enforcement | The platform's North-Star metric (§1.4) is the fraction of transitions authoritatively enforced. Knowingly shipping a boundary that contradicts its own comments fails NN-7 (honesty) as well |
| **B. Move WO approval and bill verify to server-authoritative routes** (like approve/release) | Strongest possible enforcement; matches how the money transitions were closed; enables cross-document checks | Much larger change: two new function endpoints, client rewiring, cutover risk; verify/approve of a *work order* is not money-material, so the transactional machinery is disproportionate | Over-engineered for the risk. Field-scoping achieves the separation-of-duties guarantee with a two-conjunct rules change. Revisit only if WO approval later gains financial side-effects |
| **C. Field-scope via `onlyFieldsChanged` allow-lists on the broad branches** (enumerate every editable field) | Most explicit | The editable-field set on a DRAFT bill and a PENDING WO is large and will drift with the schema; an allow-list would need updating on every field addition, and omissions silently break the app | Brittle. Pinning `status` equality expresses the actual invariant ("this branch may not transition") without coupling to the schema |
| **D. Chosen: pin `status` unchanged on the broad branches** | Minimal, schema-stable, expresses the real invariant, strictly tightening | Does not stop a PM editing *other* fields on a PENDING WO — but that is intended behaviour, not a gap | — |

## 4. Consequences

- **Positive:** NN-9 holds across `workOrders` and `bills`. The CEO approval gate and the
  PM verification gate become real at the boundary rather than aspirational. The rule
  comments become accurate. Separation of duties (NN-3) is enforced for the two stages
  that previously lacked it. Existing rules tests flip from CHARACTERIZATION to genuine
  deny assertions.
- **Negative / trade-offs:** A client that today performs a combined "edit + transition"
  write in a single `updateDoc` will start receiving `PERMISSION_DENIED` and must split
  it into two writes. **This must be verified against the UI before merge** — see
  §6. A rules deploy is required, which is independent of the (still pending) functions
  deploy.
- **Enforcement impact (SEC-11):** No invariant *moves* between layers. Two invariants
  that were documented-only become boundary-enforced. The service layer and server routes
  are unchanged and remain the stricter path.

## 5. Migration

- **Migration required:** No. This is a permission tightening only — no data shape
  changes, no backfill, no collection changes. Existing documents in any status are
  unaffected.
- **Tool / steps:** `npm run deploy:rules` (rules deploy is independent of hosting and
  functions). Deploy rules to staging first and exercise the WO-approval and
  bill-verify UI journeys before production.
- **Rollback plan:** `firestore.rules` is versioned in-repo and the Firebase console
  retains rules history. Rollback = redeploy the prior revision (`git checkout
  <prev-tag> -- firestore.rules && npm run deploy:rules`). Stateless and immediate.

## 6. Testing

- **New/changed tests:** the three CHARACTERIZATION tests added on 2026-07-29 flip to
  `assertFails` and are renamed to plain DENIES assertions:
  - `tests/rules/workOrders.rules.test.ts` — "a PM can self-APPROVE their own PENDING work order"
  - `tests/rules/workOrders.rules.test.ts` — "a PM may reject AND edit other fields in one write"
  - `tests/rules/bills.rules.test.ts` — "ACCOUNTS can self-VERIFY a DRAFT bill"
- **Rules-unit-tests (TEST-3, allow AND deny):** the suite already proves the ALLOW side
  (CEO approves a PENDING WO; PM verifies a DRAFT bill; ACCOUNTS edits DRAFT bill fields;
  PM edits a PENDING WO). Those must all remain green — they are the regression guard
  proving this change is a tightening and not a lockout.
- **Pre-merge UI verification (required):** confirm no client path issues a combined
  edit+transition write. Audit `src/pages/Bills.tsx` (verify action),
  `src/pages/WorkOrders.tsx` and `src/services/workOrderService.ts` (approve/reject
  actions) for `updateDoc` calls that set `status` alongside other fields.
- **Reconciliation impact:** none — no financial formula, ceiling or posting is touched.

## 7. Approval

- **Approved by:** Repository owner
- **Date accepted:** 2026-07-29
- **Linked PR(s):** *(uncommitted at time of writing — see implementation report)*
- **Checklist gate passed:** [x] Architecture Review · [x] Security · [x] Financial *(N/A — no formula or ceiling changes)*

### Implementation record

Implemented 2026-07-29 exactly as decided in §2, with one addition for readability: the
conjunct is expressed as a named helper `statusUnchanged()` alongside the file's existing
helpers (`currentStatus`, `isStatusTransitionTo`, `onlyFieldsChanged`) rather than being
inlined twice. Behaviour is identical to the §2 text.

- `firestore.rules:66-76` — new `statusUnchanged()` helper (definition at `:74`)
- `firestore.rules:207` — `workOrders` PM-while-PENDING branch (R-1)
- `firestore.rules:262` — `bills` ACCOUNTS/ADMIN-while-DRAFT branch (R-2)

Diff: **21 insertions, 4 deletions**; file grows 606 → 623 lines (the bulk is explanatory
comment). No other branch, collection or helper was touched.

The §6 pre-merge UI verification was completed before the change and found **no client
path that issues a combined edit+transition write** — see the implementation report §3.

Rules suite: **170/170 passing** (was 161; +9 tests). The three characterization tests
were flipped to genuine deny assertions as required by §6. Full validation: `tsc` clean,
199/199 unit, 170/170 rules, production build green.

> This ADR is now **Accepted and immutable**. A future reversal must be a new ADR that
> supersedes it.
