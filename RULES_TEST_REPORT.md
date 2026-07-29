# RULES TEST REPORT — DSBC Civil v1.0.0-beta.1

**Date:** 2026-07-29 · **Sprint:** Platform Stabilization v1.1 (Engineering Phase 2, P0.3)
**Objective:** O3 — prove that `firestore.rules` enforces the intended security model
**Mandate:** NN-29 / TEST-3 (every rules change ships tests proving **allow AND deny**),
`CURRENT_SPRINT.md` Definition-of-Success #1
**Rules under test:** [`firestore.rules`](./firestore.rules) — 623 lines, ~30 collections

> **Superseded in part — updated 2026-07-29 (later same day).** This report was first
> written against `firestore.rules` at 606 lines with **no rules modified**; it recorded
> findings R-1 and R-2 as open, pinned by characterization tests. **ADR-0001 has since
> been Accepted and implemented**, closing both. §4 below is updated accordingly; the
> findings are retained in full because they are the evidence for the change. See
> [`ADR-0001_IMPLEMENTATION_REPORT.md`](./ADR-0001_IMPLEMENTATION_REPORT.md).

---

## 1. Result

| | |
|---|---|
| **Tests** | **170 passed / 170** |
| **Test files** | 6 |
| **Runtime** | 23.30 s |
| **Runner** | Vitest 3.2.7 + `@firebase/rules-unit-testing` 5.0.1 |
| **Emulator** | Firebase Firestore emulator (firebase-tools 15.22.4), JDK 21.0.11 |
| **Rules modified** | ADR-0001 only (2 branches + 1 helper) |

```
 ✓ tests/rules/bills.rules.test.ts             (38 tests)
 ✓ tests/rules/workOrders.rules.test.ts        (31 tests)
 ✓ tests/rules/payments.rules.test.ts          (30 tests)
 ✓ tests/rules/paymentRequests.rules.test.ts   (26 tests)
 ✓ tests/rules/auditAndServerOnly.rules.test.ts(23 tests)
 ✓ tests/rules/variationOrders.rules.test.ts   (22 tests)

 Test Files  6 passed (6)
      Tests  170 passed (170)
```

*(Initial run, before ADR-0001: 161 tests. The +9 are the flipped deny assertions and the
regression guards protecting the legitimate edit paths.)*

Run it with:

```bash
npm run test:rules      # firebase emulators:exec --only firestore  →  vitest (rules config)
npm run test:all        # unit suite (199) + rules suite (161)
```

> **Prerequisite:** a JDK on `PATH` — the Firestore emulator is a Java process.
> Temurin JDK 21 was installed on the development machine for this run; CI installs it
> via `actions/setup-java` (see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

---

## 2. The headline: every money transition is denied at the boundary

`CURRENT_SPRINT.md` exit criterion #1 requires that *"a direct client-SDK attempt to
release an over-payable payment or mark a bill PAID without a payment is rejected by
`firestore.rules`."* **Verified — and the guarantee is stronger than the criterion asks.**

The rules do not merely reject *over-payable* releases; they reject **the RELEASE
transition itself, for every role and every amount**, because no client branch for it
exists. The same holds for bill approval, bill mark-paid, and VO approval.

| Money transition | ADMIN | CEO | ACCOUNTS | PM | Enforced by |
|---|---|---|---|---|---|
| payment `APPROVED → RELEASED` | ❌ | ❌ | ❌ | ❌ | no client branch |
| bill `VERIFIED → APPROVED` | ❌ | ❌ | ❌ | ❌ | no client branch |
| bill `APPROVED → PAID` / `PARTIALLY_PAID` | ❌ | ❌ | ❌ | ❌ | no client branch |
| variationOrder `DRAFT → APPROVED` | ❌ | ❌ | ❌ | ❌ | no client branch |
| WO financial rewrite on an APPROVED WO | ⚠️ admin-only | ❌ | ❌ | ❌ | status/role gating |
| `adjustments` create/update | ❌ | ❌ | ❌ | ❌ | `allow … : if false` |
| `dailySummaries` create | ❌ | ❌ | ❌ | ❌ | `allow … : if false` |

Each of these is Admin-SDK-only — reachable exclusively through the transactional
handlers in [`server/secureRoutes.ts`](./server/secureRoutes.ts). This closes **AUDIT
SECURITY C-2 and C-3 at the boundary layer** (C-1 remains open until those handlers are
actually deployed — see [`DEPLOYMENT_READINESS_REPORT.md`](./DEPLOYMENT_READINESS_REPORT.md)).

**Why rules cannot check the amount, and why that is acceptable here:** Firestore rules
cannot cross-query the `payments` collection to sum cumulative released against the bill's
`netPayable`. Rather than approximating that check, the boundary removes the transition
from client reach entirely, and the amount arithmetic lives in the server transaction
(`releasePayment`, `server/secureRoutes.ts:168-178`). Denying the whole transition is a
strictly stronger guarantee than an amount check would have been.

---

## 3. Coverage

161 assertions across the five workflows named in the sprint scope, plus the audit trail
and the server-only collections. Both directions are covered throughout — a deny-only
suite would pass against `allow read, write: if false` and prove nothing.

| Area | Tests | Allow-side covered | Deny-side covered |
|---|---|---|---|
| **Bills** | 32 | ACCOUNTS/ADMIN create DRAFT · ACCOUNTS edits DRAFT · PM verifies · PM/CEO reject DRAFT & VERIFIED · ADMIN deletes | PM/CEO create · non-DRAFT birth status · non-numeric `netPayable` · non-string `workOrderId` · **approve (all roles)** · **mark PAID / PARTIALLY_PAID (all roles)** · amount edits once VERIFIED/APPROVED · reopening a PAID bill · unauthenticated read · non-admin delete |
| **Payments** | 30 | ACCOUNTS/ADMIN create PENDING · ACCOUNTS edits PENDING · CEO approves · CEO/ADMIN reject · ADMIN deletes PENDING | PM/CEO create · birth at APPROVED/RELEASED · zero/negative/non-numeric amount · null `billId` · ACCOUNTS self-approve · PENDING→RELEASED skip · **release (all roles)** · over-payable release · amount edit once APPROVED · RELEASED immutable · RELEASED undeletable |
| **Work Orders** | 28 | PM/ADMIN create PENDING · PM edits PENDING · CEO approves (scoped) · CEO APPROVED→COMPLETED · ADMIN override preserving identity · ADMIN deletes | ACCOUNTS/CEO create · birth at APPROVED · CEO approve + financial rewrite · PENDING→COMPLETED skip · ACCOUNTS approve · PM/ACCOUNTS edit after approval · CEO financial rewrite post-approval · **`woNumber`/`createdAt`/`createdBy` rotation by ADMIN** · non-admin delete · profile-less user |
| **Payment Requests** | 26 | PM/ADMIN raise · CEO approves (scoped) · CEO rejects with reason · ACCOUNTS pays (scoped) · ADMIN override on PAID · ADMIN deletes | ACCOUNTS/CEO raise · CEO approve + amount inflation · CEO retargets `workOrderId` · PM self-approve · ACCOUNTS approve · stage skip (PENDING→PAID) · PM/CEO mark PAID · revert APPROVED→PENDING · **re-pay a PAID request (double-payment)** · PM/CEO delete |
| **Variation Orders** | 22 | PM/ADMIN create DRAFT · PM/ADMIN edit DRAFT · CEO rejects (scoped) · ADMIN deletes DRAFT | ACCOUNTS/CEO create · birth at APPROVED · non-string `workOrderId` · ACCOUNTS edit · CEO reject + amount change · PM reject · **approve (all roles)** · edit/revert once APPROVED · **delete an APPROVED VO** |
| **Audit trail & server-only** | 23 | authenticated append · ADMIN/CEO read · adjustments read | unauthenticated append · **update or delete an entry (immutability)** · PM/ACCOUNTS read the trail · adjustments create/update (all roles) · `dailySummaries` create (all roles) · PM reads summaries · **self role escalation** · self status activation · ADMIN changing own role · deleting a real user doc |

**Cross-cutting negative case:** an authenticated user with **no `users/{uid}` profile**
(the `outsider` persona) is denied everywhere a role is required. This matters because
the rules resolve roles by `get()`ing the user document rather than from a custom claim —
a missing profile makes the lookup error, which Firestore treats as denial.

### Not covered (stated for honesty, per NN-7)

- **Sales / receipts / schedules** (`sales`, `saleReceipts`, `saleSchedules`,
  `saleAdjustments`) — outside the five workflows named in this sprint's scope.
  These grant broad ADMIN/PM/ACCOUNTS write access with cross-document integrity
  enforced only in `saleService`; they deserve their own pass.
- **R2 procurement masters** (`materials`, `vendors`, `stores`, `vehicles`, `uoms`,
  `materialCategories`) — masters only, no money transitions.
- **Multi-company isolation (NN-29)** — not testable today: `firestore.rules` grants
  collection-wide reads to any authenticated user and company scoping is client-side
  (`BASELINE` known limitation #3). There is no boundary behaviour to assert until
  Constitution §23 lands. **This is a genuine coverage gap and it is the rules', not the
  suite's.**
- **Server-side behaviour** — Admin SDK writes bypass rules by design, so the
  transactional handlers need `tests/functions/` (emulator), still pending.

---

## 4. Findings

The suite exposed **two previously undocumented defects**. Both were found by assertions
that failed on first run; both were then verified against the rule text before being
classified.

> **Status update.** At the time of discovery no rule was changed: `firestore.rules` is a
> governed surface, and per `CURRENT_SPRINT.md` ("Governance for this sprint") and
> AMENDMENT-001 Article VII #7, any change altering who may perform a transition is
> **ADR-mandatory**. The gaps were pinned by characterization tests pending a decision.
>
> **[`ADR-0001`](./governance/adr/0001-scope-status-transition-branches-in-firestore-rules.md)
> was subsequently Accepted and implemented — R-1 and R-2 are CLOSED.** The
> characterization tests are now genuine deny assertions. H-3 remains open.

### R-1 · A PROJECT_MANAGER can self-approve a work order — NN-9, NN-3 — ✅ **CLOSED by ADR-0001**

[`firestore.rules:193`](./firestore.rules#L193)
```
|| (isPM() && currentStatus() == 'PENDING')     // ← no onlyFieldsChanged guard
```
The branch permits **any** field change while the WO is PENDING — including `status`. It
therefore subsumes the field-scoped CEO-approval branch at `:195-197`, which is rendered
redundant. A PM can write `status: 'APPROVED'` directly and bypass the CEO gate.

**Impact:** Defeats separation of duties (NN-3, "approve ≠ initiate"). An APPROVED work
order is the precondition for raising bills (`billService.create` requires
`APPROVED`/`COMPLETED`), so a PM can unlock the billing pipeline unilaterally.
**No money moves** — bill approve and payment release remain denied to every role.

### R-2 · ACCOUNTS can self-verify a bill — NN-9, NN-3 — ✅ **CLOSED by ADR-0001**

[`firestore.rules:245`](./firestore.rules#L245)
```
((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT')   // ← no onlyFieldsChanged guard
```
Same shape: any field on a DRAFT bill is writable, `status` included, subsuming the
field-scoped PM-verify branch at `:247-249`. ACCOUNTS both creates bills and can verify
them.

**Impact:** Defeats the documented "PM verifies" control. The server route still requires
`PROJECT_MANAGER`/`ADMIN` ([`secureRoutes.ts:256`](./server/secureRoutes.ts#L256)), so
this is reachable only by a direct client-SDK write — precisely the threat NN-1 addresses.
**No money moves** — the APPROVE step remains denied to all roles.

### H-3 (pre-existing, re-confirmed) · The audit log is forgeable — NN-12

[`firestore.rules:341`](./firestore.rules#L341) — `allow create: if isAuthenticated()`
with no `userId == request.auth.uid` check. Any signed-in user can author an entry
attributed to anyone. Entries remain immutable once written (update/delete are denied,
verified), so this is an **authorship-integrity** failure, not a tamper failure.
Already recorded as AUDIT SECURITY H-3 and `PLATFORM_STABILIZATION_v1.1.md` T6; pinned
here by a characterization test. Fix is one conjunct; it warrants its own ADR.

### Severity assessment

| Finding | Money at risk | Reachable via the app UI | Reachable via direct SDK | Severity | Status |
|---|---|---|---|---|---|
| R-1 PM self-approves WO | No | No | ~~Yes~~ **No** | **Medium** | ✅ Closed (ADR-0001) |
| R-2 ACCOUNTS self-verifies bill | No | No | ~~Yes~~ **No** | **Medium** | ✅ Closed (ADR-0001) |
| H-3 forgeable audit authorship | No | No | Yes | **Medium** (pre-existing) | ⛔ **Open** |

All three were **Medium**, not High: none moves money, none is reachable through the
application's own code paths, and today's beta runs under a single-operator trust model.
All three are **blocking for untrusted multi-tenant operation**, which is exactly the
posture v1.1 → RC is driving toward. R-1 and R-2 are now closed at the boundary; **H-3 is
the last unmitigated NN violation in the rules.**

### Structural observation

R-1 and R-2 are the same anti-pattern: *a broad "edit while in state S" branch placed
beside narrow field-scoped transition branches, silently swallowing them.* The
`paymentRequests` block — the constitution's cited exemplar — does not have this problem
because **every** branch there is field-scoped.

ADR-0001 addresses the shape, not just the two instances: it introduces a named
`statusUnchanged()` helper (`firestore.rules:74`) so the discipline is expressible and
greppable. Any future "role X may edit while in state S" branch should carry it. Worth
adding to the security checklist in `governance/CHECKLISTS.md`.

A sweep for other instances of the shape found **none remaining** — `payments`,
`variationOrders` and `paymentRequests` already pin their broad branches with
`isStatusTransitionTo(<same status>)`, which achieves the same guarantee by a different
spelling.

---

## 5. What the suite proves, and what it does not

**Proves:**
- Every financially-material transition is denied to every client role at the boundary.
- Role gating, status gating and field-diff scoping behave as documented on the four
  approval workflows.
- Identity fields on a work order are immutable for every role, including ADMIN.
- Audit entries cannot be modified or deleted once written.
- Privilege escalation via self-edit of `role`/`status` is blocked.

**Does not prove:**
- That the deployed system is safe — **rules are one of two enforcement layers, and the
  other one is not deployed** (C-1 open). Rules cannot check amounts, cumulative sums or
  cross-document invariants; those live in the undeployed server handlers.
- Anything about company/project isolation (no boundary behaviour exists to test).
- Anything about the Sales module or the procurement masters.

---

## 6. Files added

| File | Purpose |
|---|---|
| `tests/rules/helpers.ts` | Test environment, 10 role personas, fixed clock, domain fixtures |
| `tests/rules/bills.rules.test.ts` | 32 tests |
| `tests/rules/payments.rules.test.ts` | 30 tests |
| `tests/rules/workOrders.rules.test.ts` | 28 tests |
| `tests/rules/paymentRequests.rules.test.ts` | 26 tests |
| `tests/rules/auditAndServerOnly.rules.test.ts` | 23 tests |
| `tests/rules/variationOrders.rules.test.ts` | 22 tests |
| `vitest.rules.config.ts` | Separate vitest project (emulator-backed, serialized) |
| `governance/adr/0001-…-field-scoping.md` | **Proposed** fix for R-1 / R-2 |

Changed: `package.json` (`test:rules`, `test:all` scripts; `@firebase/rules-unit-testing`
devDependency), `vite.config.ts` (scopes `npm test` to `src/**` so the unit suite stays
hermetic), `firebase.json` (emulator config, port 8085), `.github/workflows/ci.yml`
(rules job with JDK 21 + emulator caching).

**`npm test` is unaffected: still 199/199 across 9 files.** The rules suite is a separate
project by design — it needs an emulator, so it must never gate the pure unit tests.

---

## 7. Recommended next actions

1. **Review and accept (or reject) [`ADR-0001`](./governance/adr/0001-scope-status-transition-branches-in-firestore-rules.md).** Two conjuncts close R-1 and R-2. Before merging, audit the UI for combined edit+transition writes (ADR §6).
2. **Open an ADR for H-3** (`auditLogs.userId == request.auth.uid`) — the last unmitigated NN violation in the rules.
3. **Extend coverage to the Sales collections** — the largest untested rules surface, and the one with the broadest write grants.
4. **Add `tests/functions/`** once the backend is deployed, to cover what rules structurally cannot: amounts, cumulative ceilings, and transactional atomicity.
5. **Do not treat C-1 as closed.** The boundary now denies the money transitions, but the authoritative handlers that are supposed to perform them are still not deployed. Until then, those four operations fail loud rather than executing.
