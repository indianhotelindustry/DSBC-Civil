# ADR-0002: Bind audit-log authorship to the authenticated caller

| Field | Value |
|---|---|
| **ADR** | 0002 |
| **Title** | Bind audit-log authorship to the authenticated caller |
| **Status** | **Accepted** — 2026-07-29 (Engineering Continuation Directive, Priority 3: *"Resolve forgeable auditLogs authorship. This is the final outstanding NN violation."*) |
| **Date** | 2026-07-29 |
| **Author(s)** | Platform Stabilization v1.1 (Claude Opus 5) |
| **Deciders** | Repository owner |
| **Non-Negotiables touched** | **NN-12** (audit create validates `userId == auth.uid`), NN-1 (boundary is the only trust), NN-9 |
| **Supersedes** | none |

---

## 1. Context

`firestore.rules:358` currently reads:

```
match /auditLogs/{logId} {
  allow read: if isAdmin() || isSuperAdmin() || isCEO();
  allow create: if isAuthenticated();          // ← no authorship binding
  allow update, delete: if false;
}
```

Any authenticated user may create an audit entry carrying **any** `userId`. A
PROJECT_MANAGER can write an entry attributed to the CEO. Because entries are immutable
once written (`update, delete: if false` — verified by tests), this is an
**authorship-integrity** failure, not a tampering failure: the trail cannot be altered, but
it can be **poisoned at the point of creation**.

This is a direct violation of **NN-12**, which states in full:

> *"`auditLogs` create validates `userId == auth.uid`; entries are immutable; every
> transition emits an audit entry. (§14 AUD-1/AUD-3, §8 SEC-6)"*

The first clause has never been implemented. The other two hold.

**Provenance.** Originally raised as AUDIT SECURITY **H-3** (2026-07-07, v0.9.0) and carried
as task **T6** in `PLATFORM_STABILIZATION_v1.1.md`. Re-confirmed on 2026-07-29 by the rules
test suite, which pins the current permissive behaviour with an explicit characterization
test (`tests/rules/auditAndServerOnly.rules.test.ts`). After ADR-0001 closed R-1 and R-2,
**this is the last unmitigated Non-Negotiable violation in `firestore.rules`.**

**Why it matters disproportionately.** Constitution §2.8 states *"the audit trail is a
first-class product, not a side effect."* An audit trail whose authorship cannot be trusted
is worse than no audit trail: it invites reliance on evidence that will not survive
scrutiny. For a construction ERP moving real money, the trail is the artefact an auditor or
a court would examine.

**Severity is bounded.** Reachable only by a direct client-SDK write — the application's own
`logAction()` always writes the caller's own uid. No money moves. Today's beta runs a
single-operator trust model. It is nonetheless **blocking for untrusted multi-tenant
operation**, and it is a one-conjunct fix.

## 2. Decision

**We will require that a client-created audit entry names its own author.**

In [`firestore.rules`](../../firestore.rules), the `auditLogs` create rule becomes:

```
allow create: if isAuthenticated()
              && request.resource.data.userId == request.auth.uid;
```

Nothing else changes. Read access, immutability (`update, delete: if false`), and every
other collection are untouched.

This **continues from the current implementation** (NN-19): one conjunct is added to an
existing branch. It is strictly a **tightening** — every write permitted afterwards was
permitted before. No role gains a capability; no collection, schema or service changes.

### Why no legitimate writer breaks — verified before deciding

| Writer | Path | `userId` written | Effect |
|---|---|---|---|
| Client `logAction()` | [`src/services/db.ts`](../../src/services/db.ts) | `auth.currentUser.uid` — the caller's own uid | ✅ Satisfies the new conjunct |
| Server `writeAuditLog()` | [`server/auditLog.ts`](../../server/auditLog.ts) | caller's uid from the verified ID token | ✅ Writes via the **Admin SDK** (`firebaseAdmin.ts`), which **bypasses rules entirely** |

Those are the only two writers in the repository. The server path is unaffected by rules by
construction, which is also why the server may legitimately continue to attribute an entry
to the acting user during a privileged operation.

### Deliberately NOT in scope

- **Field validation** (requiring `action`, `entity`, `timestamp` to be present/typed).
  Real, but a separate concern from authorship, and the server writes a richer shape
  (`outcome`, `source`, `errorCode`) than the client. Constraining the shape now risks
  breaking one writer to tidy the other.
- **Server-side-only audit writes.** The genuinely strongest posture — clients never write
  the trail at all — but it requires every client `logAction()` call site to move behind a
  deployed function. That is a large change gated on C-1 (backend deployment) and is
  chartered separately.
- **Broadening read access.** Unchanged: ADMIN, SUPER_ADMIN, CEO.

## 3. Alternatives considered

| Alternative | Pros | Cons | Rejected because |
|---|---|---|---|
| **A. Do nothing** | Zero risk | Leaves the final NN violation open in the only production trust layer; §2.8 calls the trail a first-class product | The fix is one conjunct with a verified-empty blast radius. Leaving it open cannot be justified on cost |
| **B. Deny all client audit writes; server-only** | Strongest possible integrity — the trail becomes wholly server-authored | Requires the backend deployed (C-1, still open) and every client `logAction()` re-routed through a function. Until then it would **silently stop audit logging altogether** — strictly worse than a forgeable trail | Correct long-term target, wrong now. Blocked on C-1. Recorded as the chartered follow-up |
| **C. Bind authorship *and* validate the entry shape** | Catches malformed entries too | Client and server write different shapes; a shared schema would have to be agreed first, and a wrong guess breaks one writer | Scope creep beyond the stated defect. Shape validation can follow once the trail is server-authored (alternative B) |
| **D. Chosen: bind `userId` to `auth.uid`** | One conjunct, closes NN-12, zero legitimate breakage, strictly tightening | Does not stop a user writing a *truthful* entry with a misleading `action`/`details` | — |

> **On D's residual gap:** a user can still author a self-attributed entry with arbitrary
> `action` text. That is bounded — the entry is correctly attributed to them, so the trail
> stays *honest about who wrote it*. Alternative B closes it fully.

## 4. Consequences

- **Positive:** NN-12 is satisfied; the last unmitigated NN violation in the rules closes.
  Every client-written audit entry is provably attributed to its actual author. The rule
  matches the Constitution's text rather than contradicting it.
- **Negative / trade-offs:** A client that wrote an entry on behalf of another user would
  now be denied. **Verified: no such caller exists.** Entry *content* beyond `userId`
  remains unvalidated (alternative C).
- **Enforcement impact (SEC-11):** No invariant moves layer. An invariant that was
  documented-only (NN-12) becomes boundary-enforced. Server behaviour is unchanged —
  the Admin SDK bypasses rules by design.

## 5. Migration

- **Migration required:** **No.** Permission tightening only. No data shape change, no
  backfill. Existing `auditLogs` documents are unaffected — the rule governs `create`, and
  `update`/`delete` remain denied to everyone, so historical entries cannot be touched
  either way.
- **Historical data caveat (honesty, NN-7):** entries written *before* this change carry no
  guarantee of authorship. This ADR fixes the trail going forward; it cannot retroactively
  authenticate what is already stored. Anyone auditing pre-2026-07-29 entries should treat
  authorship as unverified.
- **Tool / steps:** `npm run deploy:rules`. Independent of the functions deploy.
- **Rollback plan:** `firestore.rules` is versioned in-repo and Firebase retains rules
  history. Rollback = `git checkout <prev> -- firestore.rules && npm run deploy:rules`.
  Stateless, immediate.

## 6. Testing

- **Rules-unit-tests (TEST-3, allow AND deny)** in `tests/rules/auditAndServerOnly.rules.test.ts`:
  - The existing H-3 characterization test (*"a forged userId is currently ALLOWED"*) flips
    to a genuine **deny** assertion. It was written to fail loudly the moment the rule was
    fixed — that failure is the proof the change took effect.
  - **Deny:** a PM writing an entry attributed to the CEO; a PM attributed to ADMIN; an
    entry with a missing/empty `userId`.
  - **Allow (regression guard):** every persona writing a correctly self-attributed entry —
    this is what proves the change is a tightening and not a lockout, and that
    `logAction()` keeps working for all roles.
  - **Unchanged:** immutability (update/delete denied), read gating (ADMIN/SUPER_ADMIN/CEO
    allow; PM/ACCOUNTS deny).
- **Reconciliation impact:** none — no financial formula, ceiling or posting is touched.

## 7. Approval

- **Approved by:** Repository owner — Engineering Continuation Directive, Priority 3
- **Date accepted:** 2026-07-29
- **Linked PR(s):** branch `fix/audit-log-authorship` (PR pending review)
- **Checklist gate passed:** [x] Architecture Review · [x] Security · [x] Financial *(N/A — no formula or ceiling changes)*

> Implemented on branch `fix/audit-log-authorship`; **not merged and not deployed**. `main`
> is protected — this reaches production only via PR review and a subsequent
> `npm run deploy:rules`.
