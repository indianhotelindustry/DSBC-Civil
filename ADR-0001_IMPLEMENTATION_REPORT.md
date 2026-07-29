# ADR-0001 IMPLEMENTATION REPORT

**ADR:** [0001 — Field-scope the unscoped status-transition branches in `firestore.rules`](./governance/adr/0001-scope-status-transition-branches-in-firestore-rules.md)
**Status:** Accepted 2026-07-29 → **Implemented 2026-07-29**
**Sprint:** Platform Stabilization v1.1 (Engineering Phase 2, P0.3 / O3)
**Non-Negotiables closed:** NN-9 (field-scoped transition branches), NN-3 (approve ≠ initiate)

> **Scope discipline:** only `firestore.rules` and `tests/rules/` changed. **No business
> logic, no financial calculation, no workflow state, no service, no component, and no
> collection was touched.** The two pending finance decisions remain untouched and
> unresolved.

---

## 1. Result

| Gate | Before | After |
|---|---|---|
| `tsc --noEmit` | 0 errors | **0 errors** |
| `npm test` (unit) | 199/199 | **199/199** — unchanged |
| `npm run test:rules` | 161/161 | **170/170** (+9) |
| `npm run build` | green, 3,759 modules | **green, 3,759 modules** |
| `npm run build --prefix functions` | 1.3 MB bundle | **1.3 MB bundle** |

**Nothing regressed.** `firestore.rules`: 606 → **623 lines** (+21 / −4; most of the growth
is explanatory comment).

Two attack paths are now closed at the production trust boundary:

| Previously possible | Now |
|---|---|
| A **PROJECT_MANAGER** writing `status: 'APPROVED'` directly onto their own PENDING work order, bypassing the CEO gate | **Denied** |
| **ACCOUNTS** writing `status: 'VERIFIED'` onto a DRAFT bill it created, bypassing PM verification | **Denied** |

---

## 2. The change

### 2.1 New helper — `firestore.rules:66-76`

```
// ADR-0001. A branch that grants BROAD edit rights within a state must not
// also permit a status change — otherwise it silently subsumes the narrow,
// field-scoped transition branches sitting beside it, and the documented
// approval gates stop being enforced (NN-9, NN-3).
//
// Use this on "role X may edit while in state S" branches. Transitions get
// their own branch, scoped with isStatusTransitionTo + onlyFieldsChanged.
function statusUnchanged() {
  return request.resource.data.status == resource.data.status;
}
```

This is the one deviation from ADR §2, which wrote the conjunct inline twice. Expressing it
as a named helper matches the file's existing idiom (`currentStatus`, `isStatusTransitionTo`,
`onlyFieldsChanged`), makes the discipline greppable for future rules work, and is
**behaviourally identical**. Recorded in the ADR's implementation record.

### 2.2 R-1 — `workOrders` update, `firestore.rules:207`

```diff
- // PM can edit any field while WO is PENDING
- || (isPM() && currentStatus() == 'PENDING')
+ // PM can edit any field while WO is PENDING — EXCEPT status.
+ // ADR-0001: without statusUnchanged() this branch also permitted
+ // status → APPROVED, letting a PM self-approve and bypass the CEO
+ // gate below. Rejection has its own scoped branch further down.
+ || (isPM() && currentStatus() == 'PENDING' && statusUnchanged())
```

### 2.3 R-2 — `bills` update, `firestore.rules:262`

```diff
- // Accounts/Admin can edit DRAFT bills (all fields)
- ((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT')
+ // Accounts/Admin can edit DRAFT bills (all fields) — EXCEPT status.
+ // ADR-0001: without statusUnchanged() this branch also permitted
+ // status → VERIFIED, letting ACCOUNTS verify the very bills it
+ // creates and bypass the PM verification gate below.
+ ((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT' && statusUnchanged())
```

**No branch was added or removed. No role gained a permission.** Every write permitted
after this change was permitted before it — this is strictly a tightening.

---

## 3. Pre-merge verification (ADR §6) — completed BEFORE the rules changed

The ADR made this mandatory because the realistic way to break the app is a client that
writes an edit and a transition in one `updateDoc`. Every write path to these two
collections was audited:

| Path | Payload written | Verdict |
|---|---|---|
| [`workOrderService.approve`](./src/services/workOrderService.ts#L145) | exactly `{status, approvedBy, approvedAt}` | ✅ matches the scoped CEO branch |
| [`workOrderService.reject`](./src/services/workOrderService.ts#L163) | exactly `{status: 'REJECTED'}` | ✅ matches the scoped PM-reject branch |
| [`workOrderService.update`](./src/services/workOrderService.ts#L135) | caller-supplied partial | ✅ **[`WorkOrders.tsx:209`](./src/pages/WorkOrders.tsx#L209) explicitly destructures `status` out before calling** |
| [`WorkOrderForm.tsx:228`](./src/components/WorkOrderForm.tsx#L228) | `status: 'PENDING'` | ✅ create only |
| [`Bills.tsx:202`](./src/pages/Bills.tsx#L202) DRAFT edit | full form payload **including `status: bill.status`** | ✅ status echoed **unchanged** → equality holds |
| [`Bills.tsx:227`](./src/pages/Bills.tsx#L227) reject | exactly `{status: 'REJECTED'}` | ✅ matches the scoped reject branch |
| `billService.verify` → `secureVerifyBill` | server route (Admin SDK) or dev fallback `{status, verifiedBy, verifiedAt}` | ✅ Admin SDK bypasses rules; fallback matches the PM branch |

**Key subtlety:** `statusUnchanged()` compares *values* — it does not forbid `status` being
*present* in the payload. This matters because `Bills.tsx` sends the entire form object,
`status` included, on every DRAFT edit. Had the conjunct been written as an
`onlyFieldsChanged`-style exclusion, that path would have broken. Two regression tests now
pin this explicitly (§4).

**No client path issues a combined edit+transition write.** Verified before implementing.

---

## 4. Test changes — `tests/rules/` 161 → 170

### Flipped from characterization to genuine denial (3)

The three tests that previously *recorded* the defect now *forbid* it. They were written to
fail loudly the moment the rule was fixed — exactly what happened, which is the proof the
tightening took effect.

| Test | Before | After |
|---|---|---|
| PM self-approves their own PENDING WO | `assertSucceeds` | **`assertFails`** |
| PM rejects while also editing another field | `assertSucceeds` | **`assertFails`** |
| ACCOUNTS self-verifies a DRAFT bill | `assertSucceeds` | **`assertFails`** |

### New denials (5)

Closing the obvious variants rather than only the exact reported path:

- PM setting `status: 'APPROVED'` **alone** (no approval metadata)
- PM jumping a PENDING work order straight to `COMPLETED`
- ACCOUNTS setting `status: 'VERIFIED'` **alone**
- ACCOUNTS jumping a DRAFT bill straight to `APPROVED`
- ACCOUNTS jumping a DRAFT bill straight to `PAID`

### New regression guards protecting legitimate workflows (3)

These are the tests that prove this is a tightening and not a lockout:

- **PM edits a PENDING WO while echoing the unchanged status back** in the payload → still allowed
- **ACCOUNTS edits a DRAFT bill while echoing the unchanged status back** → still allowed
- **ADMIN edits a DRAFT bill while echoing the unchanged status back** → still allowed

### Deliberately pinned consequence (1)

- **ADMIN can no longer verify a bill from the client.** ADMIN's client-side verify flowed
  through the same broad DRAFT branch and is removed with it. **No supported workflow
  regresses:** the sanctioned ADMIN verify path is
  [`server/secureRoutes.ts` `verifyBill`](./server/secureRoutes.ts#L256) (`requireRole('PROJECT_MANAGER','ADMIN')`),
  which writes via the Admin SDK and bypasses rules entirely. Only a direct client-SDK
  write is blocked — and in production the client fallback is disabled anyway
  (`VITE_ALLOW_CLIENT_FALLBACK=false`). Pinned by a test so the trade-off is explicit
  rather than discovered later.

### Still-passing ALLOW coverage (unchanged, the real regression guard)

CEO approves a PENDING WO · PM rejects a WO with status only · CEO marks APPROVED →
COMPLETED · PM edits non-status fields on a PENDING WO · ADMIN override preserving identity ·
ACCOUNTS creates and edits DRAFT bills · PM verifies a DRAFT bill · PM/CEO reject DRAFT and
VERIFIED bills. **All green.**

---

## 5. Anti-pattern sweep

R-1 and R-2 were the same shape: *a broad "edit while in state S" branch beside narrow
field-scoped transition branches, silently swallowing them.* Every remaining
`currentStatus() == '…'` branch in the file was checked for it:

| Collection | Broad branch | Guarded? |
|---|---|---|
| `payments` (`:303`) | ACCOUNTS/ADMIN edit while PENDING | ✅ `isStatusTransitionTo('PENDING')` — same guarantee, different spelling |
| `variationOrders` (`:342`) | PM/ADMIN edit while DRAFT | ✅ `isStatusTransitionTo('DRAFT')` |
| `paymentRequests` | CEO / ACCOUNTS branches | ✅ every branch `hasOnly`-scoped (the constitution's exemplar) |
| `users` | self-update | ✅ `role` and `status` both pinned |
| `numberSeries`, `alerts` | PM bump / mark-read | ✅ `hasOnly`-scoped |
| `workOrders`, `bills` | — | ✅ **fixed by this ADR** |

**No further instances remain.** Collections without a status state machine in rules
(`sales`, `subLocations`, masters, …) cannot exhibit the pattern — there are no transition
branches to subsume.

The `isAdmin()` full-override branches on `workOrders` and `paymentRequests` are retained
deliberately as the documented emergency escape hatch; `workOrders`' remains constrained by
`workOrderIdentityUnchanged()`.

---

## 6. What this does and does not achieve

**Does:**
- The CEO work-order approval gate and the PM bill-verification gate are now **enforced at
  the boundary**, not merely documented in a comment.
- NN-9 holds across `workOrders` and `bills`; NN-3 (approve ≠ initiate) is enforced for the
  two stages that previously lacked it.
- The rule comments and the rule behaviour now agree — they did not before.

**Does not:**
- **Change anything in production.** The rules are versioned in-repo and **not deployed** —
  no Firebase project is provisioned. This ships with the next `npm run deploy:rules`.
- Close **H-3** (forgeable `auditLogs` authorship, `firestore.rules:341`) — still open, still
  pinned by a characterization test, still needs its own ADR. **Last unmitigated NN
  violation in the rules.**
- Close **C-1**. The authoritative backend is still not deployed. Rules deny the money
  transitions; the handlers meant to perform them are not live.
- Touch the two finance decisions, which remain blocked on business approval.

---

## 7. Files changed

| File | Change |
|---|---|
| `firestore.rules` | +21 / −4 — `statusUnchanged()` helper; applied to 2 branches |
| `tests/rules/workOrders.rules.test.ts` | 28 → 31 tests (2 flipped, 3 new) |
| `tests/rules/bills.rules.test.ts` | 32 → 38 tests (1 flipped, 6 new) |
| `governance/adr/0001-…-field-scoping.md` | Proposed → **Accepted**, implementation record added |
| `governance/adr/README.md` | Index status updated |
| `RULES_TEST_REPORT.md` | R-1/R-2 marked closed; counts updated; supersession banner |
| `docs/PROGRAM_STATE.md` | Thread 2 closed; gate counts and rules line count updated |

---

## 8. Deployment note

**The rules change is not yet live.** When the first deploy happens, order matters:

```bash
npm run deploy:rules      # the trust boundary FIRST
```

Deploy rules **before or with** hosting so the boundary is never behind the application.
Rules deploys are independent of the functions deploy and are instantly reversible via
`git checkout <prev> -- firestore.rules && npm run deploy:rules` (Firebase also retains
rules history).

Post-deploy smoke test — confirm both directions:
1. As CEO, approve a PENDING work order → **succeeds**.
2. As PM, edit a PENDING work order's title → **succeeds**.
3. As ACCOUNTS, edit a DRAFT bill's amount → **succeeds**.
4. As PM, verify a DRAFT bill → **succeeds**.

The two deployment blockers from
[`DEPLOYMENT_READINESS_REPORT.md`](./DEPLOYMENT_READINESS_REPORT.md) (**D-1** `trust proxy`,
**D-2** missing `alerts` composite index) are unaffected by this change and still stand.
