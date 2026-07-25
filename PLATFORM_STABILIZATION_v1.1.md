# PLATFORM STABILIZATION v1.1 — Inspection & Implementation Plan

> **Sprint:** Platform Stabilization v1.1 (Engineering Phase 2, P0) · **Repo:** DSBC Civil
> **Status:** INSPECTION & PLAN — **no code has been modified.** This document reports the current implementation, the risks, and a migration plan for approval. Implementation begins only after sign-off.
> **Governed by:** the Architecture Constitution, [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md), [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md), and the accepted forensic audit ([`audit/`](./audit/README.md)). Every finding below references existing implementation. No architecture is redesigned; the plan **strengthens** what exists.

---

## 0. Executive inspection summary

DSBC Civil already contains a correctly-written server-authoritative layer ([`server/secureRoutes.ts`](./server/secureRoutes.ts)) — **it is simply not deployed**, and the client silently falls back to direct Firestore writes ([`secureApi.ts`](./src/services/secureApi.ts)). Every P0 finding traces to that one fact plus the drift it allowed. The stabilization is therefore **continuation, not construction**: deploy what exists, invert the fallback, unify the drifted math, make money atomic, and begin the posting engine.

**Scope honesty:** the P0-1 brief lists *Inventory Posting, Purchase Approval, Stock Transfer, Ledger Posting* as candidate operations. Verified: **none of these exist in code today** — there is no inventory-transaction, purchase-order, stock, or posting module (only procurement *masters*). There is nothing to migrate for them; they are future work (P1/P2). The privileged financial operations that **do** exist and need stabilization are: **Bill Verify, Bill Approve, Payment Release, Variation Order Approve** (the four `secureApi` ops) plus the **pure-client creates** (bill, payment, payment request, sale, receipt, schedule).

---

## P0-1 · Server Authority — client-executed financial operations

### Current implementation
Two classes of privileged operation execute wholly or partly on the client:

**Class A — "secure" ops with a client fallback** (should be server-only; currently degrade to client):
| Operation | Client entry | Server route (undeployed) | Client fallback |
|---|---|---|---|
| Bill Verify | [`billService.ts:151`](./src/services/billService.ts#L151) → `secureVerifyBill` | `secureRoutes.ts` verifyBill | `secureApi.ts:102-118` |
| Bill Approve | [`billService.ts:159`](./src/services/billService.ts#L159) → `secureApproveBill` | `secureRoutes.ts` approveBill (`:96-131`) | `secureApi.ts:120-136` |
| Payment Release | [`paymentService.ts:96`](./src/services/paymentService.ts#L96) → `secureReleasePayment` | [`secureRoutes.ts:137-187`](./server/secureRoutes.ts#L137-L187) | `secureApi.ts:138-176` |
| VO Approve | [`variationOrderService.ts:65`](./src/services/variationOrderService.ts#L65) → `secureApproveVariationOrder` | `secureRoutes.ts:193-239` | `secureApi.ts:178-210` |

**Class B — pure-client writes with no server path at all** (validated only client-side + Firestore rules):
- Bill create ([`billService.ts:51`](./src/services/billService.ts#L51)) — overbilling checked client-side only.
- Payment create ([`paymentService.ts:44`](./src/services/paymentService.ts#L44)) — overpayment checked client-side only.
- Payment Request lifecycle ([`paymentRequestService.ts`](./src/services/paymentRequestService.ts)) — ceiling client-side only.
- Sale / Receipt / Schedule writes ([`saleService.ts`](./src/services/saleService.ts), [`saleReceiptService.ts`](./src/services/saleReceiptService.ts), [`saleScheduleService.ts`](./src/services/saleScheduleService.ts)) — non-atomic cache updates (see P0-4/P0-2).

### Current security risks
- In production (hosting-only, `firebase.json`), **all Class-A ops run as the client fallback** — the server's transactional cross-document checks never run (AUDIT SECURITY C-1).
- Rules permit the money transitions directly: payment→RELEASED ([`firestore.rules:299-301`](./firestore.rules#L299-L301)), bill→PAID ([`:253-259`](./firestore.rules#L253-L259)), so a crafted client can bypass even the fallback (C-2/C-3).
- Class-B creates set financial amounts with no server validation (H-1).

### Recommended server implementation
Deploy the **existing** `secureRoutes.ts` handlers as **Firebase Cloud Functions (callable)** — the logic is already written and transactional. Add server paths for the highest-risk Class-B ops (bill create ceiling, payment create ceiling) as the same functions or as validated callable wrappers. No handler is rewritten; they are re-hosted.

### Migration strategy
1. Stand up a `functions/` package that imports the existing handler bodies (shared, not copied).
2. Deploy to a **staging** project first; verify each op end-to-end.
3. Point `secureApi` at the callable functions (P0-2).
4. Tighten rules so money transitions are function-only (P0-6).
5. Cut over production behind a feature flag; keep the client fallback only under `import.meta.env.DEV`.

---

## P0-2 · Remove Client Financial Authority (the `secureApi` fallback)

### Current implementation
[`secureApi.ts:57-96`](./src/services/secureApi.ts#L57-L96) (`tryServerCall`) POSTs to `/api/secure/*`; if it receives non-JSON (the SPA HTML rewrite) or any error, it calls `setMode('client-fallback')` and returns `null`. The exported ops ([`:216-238`](./src/services/secureApi.ts#L216-L238)) then run the `clientXxx` implementations ([`:102-210`](./src/services/secureApi.ts#L102-L210)) — direct Firestore writes with client-side validation.

### Why it exists
It was a deliberate resilience shim: the Express server runs under `npm run dev` but is **not deployed** to Firebase Hosting, so in production the routes 404 and the app must still function. The fallback keeps the app working without the server.

### Whether it is still required
**In production: no — it must be removed** once P0-1/P0-3 deploy the authoritative functions. **In local dev: keep**, gated, so offline development still works. The fallback's client-side checks are strictly weaker (e.g. `clientApproveBill` at [`secureApi.ts:120-136`](./src/services/secureApi.ts#L120-L136) performs **no** cumulative-billing check; `clientReleasePayment` re-sums by query then batch-writes, non-atomic, [`:152-174`](./src/services/secureApi.ts#L152-L174)).

### How it should be removed / migration
- Invert `tryServerCall` to **fail loud**: on unreachable/failed server, throw a typed `BusinessRuleError` (surface a toast), do **not** fall through to a client write.
- Wrap the `clientXxx` functions in an `import.meta.env.DEV` guard so they compile out of production builds (Constitution DEP-4).
- Sequence strictly after functions are live (P0-1/P0-3) and behind a feature flag so the cutover is reversible (NN-27). **Do not remove the fallback before the functions are deployed** — that would break the live app.

### Do-not-break guarantee
The happy path is unchanged for users: same service calls, same toasts. Only the *degraded* path changes from "silently write weakly" to "fail with a clear error," and only in production.

---

## P0-3 · Cloud Functions

### Current state (inspected)
- **No `functions/` directory exists** (verified) — **zero Cloud Functions have been written or deployed.**
- The authoritative layer is an **Express app** ([`server.ts`](./server.ts) + [`server/`](./server/)) that runs only under `npm run dev`. `firebase.json` deploys **hosting + rules only** — no functions/run config.
- **Existing routes** (Express, 4): bill verify, bill approve, payment release, VO approve — [`secureRoutes.ts`](./server/secureRoutes.ts), registered under `/api/secure` with a 30 req/min rate limiter (`:24-30`).
- **Authentication:** real Firebase ID-token verification in [`authMiddleware.ts`](./server/authMiddleware.ts) (`verifyIdToken`).
- **Authorization:** `requireRole(...)`, role loaded **from the `users/{uid}` Firestore doc**, not custom claims.
- **Transactions:** yes — handlers use `db.runTransaction` with in-transaction precondition re-checks (e.g. [`secureRoutes.ts:137-187`](./server/secureRoutes.ts#L137-L187)).
- **Atomicity:** correct within a handler (release updates payment + bill atomically).
- **Idempotency:** partial — handlers re-assert current status, so a replayed "release" on an already-RELEASED payment throws rather than double-effecting; but there is **no idempotency key**.
- **Retry strategy:** none.
- **Unauthenticated admin endpoints:** `/api/admin/run-alerts` and `/api/admin/run-summary` have **no auth** ([`server.ts:37-45`](./server.ts#L37-L45)) — must be gated before any deploy.

### Missing functions (to add by re-hosting existing logic)
- 4 callable functions wrapping the existing handlers.
- 2 scheduled functions (Cloud Scheduler) for the existing `backgroundJobs.ts` alert/summary generators (today they never run in production).
- (Optional, P0-4) posting trigger functions.

### Recommendation
- Create `functions/` importing the shared handler bodies; deploy as callable v2 functions.
- Keep auth via ID token; **plan custom-claims migration** (P0-6) but not required for v1.1 cutover.
- Add an **idempotency key** (source doc id + transition) to money functions (NN-23).
- Rely on Cloud Functions' built-in retry for triggers; make triggers idempotent (EVT-2).
- Gate the two admin endpoints behind auth + admin role before deploy.

---

## P0-4 · Financial Posting Engine

### Current state (inspected)
- **No posting engine exists.** Repo-wide search for voucher/journal/chartOfAccounts/trialBalance returns only cosmetic string hits (AUDIT ARCHITECTURE §5).
- Financial "truth" is **derived reporting**: `LedgerEntry` is a transient view-model built on render by [`ledgerUtils.ts`](./src/lib/ledgerUtils.ts) and `customerLedgerCalcs.ts`. Nothing is posted or persisted as a journal.
- Retention and TDS are **arithmetic deductions** with no liability record ([`billService.ts:21-33`](./src/services/billService.ts#L21-L33)).

### Assessment
Missing, not partial. Per the brief, **design integration WITHOUT redesigning existing modules.**

### Recommended integration (additive, no module rewrite)
- Add a `journalEntries` collection (immutable) + `accounts` (chart of accounts), per Constitution §10.
- Introduce a **PostingService** invoked by the authoritative functions on each financial transition (bill approve, payment release, VO approve, receipt) — posting runs **inside** the transition's transaction (Constitution POST-5).
- The existing derived ledgers become the **reconciliation checksum** (Tier-2 vs Tier-3, POST-6) — no existing ledger code is removed.
- **The PostingService becomes the ONLY writer** of ledger/journal/voucher/cost/inventory-financial entries. Operational modules keep creating bills/payments exactly as now; posting is an automatic consequence, not a new data-entry surface.

### Scope note for v1.1
Full posting is large (XL). For v1.1, land the **foundation**: collection + PostingService + posting on bill-approve and payment-release, with reconciliation. Retention/TDS liabilities and full coverage complete in v1.2 (Accounting Core).

---

## P0-5 · FinancialCalculationService — consolidation

### Current state (inspected — duplication and drift confirmed)
| Calculation | Locations found | Problem |
|---|---|---|
| **WO financials** (subtotal/gst/retention/grandTotal) | Form [`WorkOrderForm.tsx:214-218`](./src/components/WorkOrderForm.tsx#L214-L218); VO server [`secureRoutes.ts:220-234`](./server/secureRoutes.ts#L220-L234); VO client [`secureApi.ts:192-196`](./src/services/secureApi.ts#L192-L196) | **Divergent formulas.** Form subtracts advance in `subtotal` and subtracts retention in `grandTotal`; the VO paths do **neither** and redefine `subtotal = newTotal + otherCharges`. After each approved VO, `grandTotal` inflates. |
| **Bill totals** (tds/retention/netPayable) | Service [`billService.ts:21-33`](./src/services/billService.ts#L21-L33); UI [`Bills.tsx:131-143`](./src/pages/Bills.tsx#L131-L143) | Same formula copied twice; risk of drift. |
| **Overbilling ceiling** | Client create: gross BOQ [`billService.ts:82-91`](./src/services/billService.ts#L82-L91); server approve: net grandTotal [`secureRoutes.ts:115-124`](./server/secureRoutes.ts#L115-L124); WO edit: net [`workOrderService.ts:121-131`](./src/services/workOrderService.ts#L121-L131) | **Three different ceilings** on the same WO. |
| **Payment/outflow** | `paymentService.ts:19-26` counts RELEASED only; `paymentRequestService.ts` counts a broader outflow via `getTotalFinancialOutflow` ([`paymentRequestCalcs.ts:136`](./src/lib/paymentRequestCalcs.ts#L136)); Bills path ignores payment requests | Two payables paths, inconsistent ceilings. |
| **Derived KPIs / gross value** | `financialCalcs.ts` (`woGrossValue`, `woRemainingAmount`, no rounding) | No `round2`; float drift. |

### Consolidation plan (every formula in exactly one service)
Create `src/lib/financialCalculationService.ts` (pure, React/Firebase-free per Constitution §4, so functions and UI share it) exporting the single implementations:
- `computeWorkOrderFinancials(items, financials)` — **one** WO formula; replaces the three copies.
- `recalculateBillTotals(...)` — move the existing `billService` function here; `Bills.tsx` imports it (removes the UI copy).
- `outflowCeiling(wo)` — **one** authoritative ceiling; the constitution designates **gross BOQ** for work-done (FIN-3). Applied at bill create, bill update, bill approve, and both payment paths.
- Adopt a shared `round2` and `MONEY_EPSILON` constant.
Then: UI, the Cloud Functions, and tests all import this service. Add unit tests pinning `form == function` for VO to prove the divergence is gone.

**Do-not-break:** the bill formula is already identical in both copies — consolidating is safe. The WO/ceiling consolidation *changes behavior* on WOs with advances/deductions, so it ships with regression tests and an accountant confirmation (see risk register).

---

## P0-6 · Security Validation

### Firestore rules (the production boundary — inspected)
- **Money transitions client-writable:** payment→RELEASED ([`:299-301`](./firestore.rules#L299-L301)) and bill→PAID ([`:253-259`](./firestore.rules#L253-L259)) allowed with only `onlyFieldsChanged(['status',...])` — no amount/payable enforcement (rules cannot cross-query). **Fix:** make these function-only after P0-3 (writes come from Admin SDK, which bypasses rules; client is denied).
- **Unscoped WO-financial branch:** [`:208-209`](./firestore.rules#L208-L209) lacks `onlyFieldsChanged` — CEO/Admin can rewrite arbitrary WO financial fields (H-4). **Fix:** add field scoping.
- **DRAFT bill amounts fully writable** ([`:242`](./firestore.rules#L242)) — validated only at approve (undeployed) (H-1).
- **Audit log forgeable:** `auditLogs` create is `if isAuthenticated()` with no `userId==auth.uid` check ([`:350`](./firestore.rules#L350)) (H-3). **Fix:** add the equality check.

### API authorization / roles
- Server: token verified; role from `users` doc, **not custom claims** (M-1). Works, but a `get()` per check and a client-readable trust anchor. **Recommend** custom-claims migration (can follow v1.1).
- Two admin endpoints unauthenticated ([`server.ts:37-45`](./server.ts#L37-L45)) (H-2) — gate before deploy.

### Company / project isolation
- Scoping is **client-side after a full read** ([`userAccess.ts`](./src/lib/userAccess.ts)); a scoped user downloads other companies' data then filters (M-4). Boundary-enforced scoping is P1.5, but v1.1 must not regress it.

### Privilege escalation
- Self role/status change correctly blocked in rules; SUPER_ADMIN bypass is intentional. No new escalation introduced by this plan.

### Remaining risks after v1.1 (to carry to P1)
Custom-claims roles; boundary-enforced company scoping; required `companyId` on financial aggregates. These are P1.5, explicitly out of v1.1 scope but recorded.

---

## P0-7 · Repository Improvements

### Inspected
- **Folder/service/feature organization:** clean and consistent (post-consolidation of Governance Phase 1). One service per collection; governance/audit/docs isolated.
- **Duplicate utilities:** the financial-formula duplication (P0-5); `loadSaleOrThrow` ×3; `normName` ×2; released-total ×2; 7 near-identical master CRUD pages; status-color helpers repeated (AUDIT TECH-DEBT G-8).
- **Dead code:** `billService.markAsPaid/markAsPartiallyPaid` (unused), `SkeletonCard`, many unused service getters, ~15 handler-less buttons, unreachable branch [`subLocationService.ts:103`](./src/services/subLocationService.ts#L103) (G-11).
- **Temporary code:** the `secureApi` client fallback (intentional, addressed in P0-2); `void serverTimestamp` lint-suppression in `numberSeriesService.ts`.
- **TODO/FIXME:** **none** in `src/` (verified) — only prose "extended in R3/R5/R6" future-work markers in the procurement master services.
- **Tooling:** no ESLint (only `tsc`); no CI (the CI workflow scaffold added in Phase-1 prep enables this).

### Recommendation
Fold the low-risk cleanups (dead code, duplicate utilities, ESLint/CI enablement) into v1.1 as parallel, non-blocking tasks (they carry no architectural risk). Defer the 7-page master-CRUD generalization to P1 (larger, not P0).

---

## Implementation order & dependencies

```
Task 1 (functions/ + deploy) ──► Task 2 (secureApi fail-loud) ──► Task 3 (rules tighten)
        │                                                              ▲
        └── Task 4 (FinancialCalculationService) ──────────────────────┘ (functions import it)
Task 5 (atomic money) ── parallel, before/with Task 6
Task 6 (posting foundation) ── after Tasks 1 & 4
Task 7 (security fixes: admin auth, audit userId, field-scope) ── with Task 3
Task 8 (repo hygiene: ESLint/CI, dead code) ── parallel throughout
```

**Hard rule:** Task 2 (remove fallback) must NOT merge before Task 1 (functions live) — else the production app breaks. Task 4 (unify math) should land with/before Task 1 so the functions deploy the *correct* single formula.

## Estimated effort (aggregate)

| Area | Effort |
|---|---|
| P0-1/P0-3 Functions deploy + admin auth | L–XL |
| P0-2 Remove fallback | M |
| P0-5 FinancialCalculationService | M |
| P0-4 Posting foundation | XL (foundation only in v1.1; full in v1.2) |
| P0-6 Security fixes (rules + audit + admin) | M |
| P0-7 Hygiene (ESLint/CI, dead code) | S–M |
| **Sprint total** | **~3–5 weeks** (posting foundation dominates; may spill to v1.2) |

---

# ENGINEERING TASK LIST — Platform Stabilization v1.1

Priority: **Critical** (blocks safe production) · **High** · **Medium** · **Low**.

### CRITICAL

**T1 · Deploy the authoritative backend as Cloud Functions**
- **Description:** Create `functions/` re-hosting the existing `secureRoutes.ts` handlers as callable functions; migrate `backgroundJobs.ts` to scheduled functions; add idempotency keys to money ops.
- **Affected files:** new `functions/`; import from `server/secureRoutes.ts`, `server/backgroundJobs.ts`, `server/authMiddleware.ts`; `firebase.json` (add functions), `firestore.indexes.json` (new).
- **Dependencies:** staging Firebase project; Admin SDK/ADC credentials; T4 (deploy the correct math).
- **Effort:** L–XL.
- **Acceptance:** all 4 ops execute as deployed functions with transactional validation and an audit entry; alerts/summaries run on schedule in staging; replayed release is a typed no-op.

**T2 · Invert `secureApi` to fail-loud; remove production client fallback**
- **Description:** On unreachable/failed server, throw a typed error instead of writing client-side; guard `clientXxx` behind `import.meta.env.DEV`.
- **Affected files:** [`src/services/secureApi.ts`](./src/services/secureApi.ts).
- **Dependencies:** **T1 live** (do not merge before); feature-flag cutover.
- **Effort:** M.
- **Acceptance:** production build contains no client money-write path; a forced server outage surfaces a clear error, no weak write; local dev still works offline.

**T3 · Tighten Firestore rules so money transitions are function-only**
- **Description:** Deny client payment→RELEASED and bill→PAID/PARTIALLY_PAID; add `onlyFieldsChanged` to the WO-financial branch; keep read access unchanged.
- **Affected files:** [`firestore.rules`](./firestore.rules) (`:208-209`, `:253-259`, `:299-301`); new `tests/rules/`.
- **Dependencies:** T1 (writes now come from Admin SDK).
- **Effort:** M.
- **Acceptance:** rules-unit-tests prove a direct client attempt to release an over-payable payment or mark a bill PAID is **denied**; the function path still succeeds.

**T4 · FinancialCalculationService (single source of money math)**
- **Description:** Create `src/lib/financialCalculationService.ts` with one `computeWorkOrderFinancials`, one `recalculateBillTotals`, one `outflowCeiling` (gross BOQ); import from UI + functions; add `round2`/`MONEY_EPSILON`. Remove the three divergent WO copies and the duplicate bill copy.
- **Affected files:** new `src/lib/financialCalculationService.ts`; [`WorkOrderForm.tsx:214-218`](./src/components/WorkOrderForm.tsx#L214-L218), [`secureRoutes.ts:220-234`](./server/secureRoutes.ts#L220-L234), [`secureApi.ts:192-196`](./src/services/secureApi.ts#L192-L196), [`billService.ts:21-33,82-91`](./src/services/billService.ts#L21-L33), [`Bills.tsx:131-143`](./src/pages/Bills.tsx#L131-L143), [`workOrderService.ts:121-131`](./src/services/workOrderService.ts#L121-L131); new tests.
- **Dependencies:** accountant confirmation of the canonical WO formula and ceiling.
- **Effort:** M.
- **Acceptance:** a test pins `form == function` for VO approval (no inflation); one ceiling applied at all four sites; all existing financial tests still green + new regression tests.

### HIGH

**T5 · Make money mutations atomic & idempotent**
- **Description:** Convert `sale.totalReceived` and schedule `paidAmount` to `runTransaction`/`increment`; count PENDING/APPROVED payments in the ceiling.
- **Affected files:** [`saleReceiptService.ts:96,138,213`](./src/services/saleReceiptService.ts#L96), [`saleScheduleService.ts`](./src/services/saleScheduleService.ts), [`paymentService.ts:19-26`](./src/services/paymentService.ts#L19-L26).
- **Dependencies:** none (independent of T1); align with T4 constants.
- **Effort:** M.
- **Acceptance:** a concurrent-receipt test proves no lost money; ceiling test counts pending payments.

**T6 · Security hardening (pre-deploy)**
- **Description:** Gate `/api/admin/*` behind auth+admin role; add `userId == auth.uid` to `auditLogs` create rule; reduce PII in the `db.ts` error log.
- **Affected files:** [`server.ts:37-45`](./server.ts#L37-L45), [`firestore.rules:350`](./firestore.rules#L350), [`src/services/db.ts`](./src/services/db.ts) (~:70).
- **Dependencies:** T3 (rules PR).
- **Effort:** S–M.
- **Acceptance:** admin endpoints reject unauthenticated calls; a forged-`userId` audit write is denied by rules; no PII in logs.

**T7 · Posting Engine foundation**
- **Description:** Add `accounts` + immutable `journalEntries`; a PostingService invoked in-transaction by the bill-approve and payment-release functions; reconciliation report vs derived ledgers.
- **Affected files:** new `src/lib/postingService.ts`, new collections + rules blocks; hook into T1 functions.
- **Dependencies:** T1, T4; accountant sign-off on the posting map (Constitution §10.4).
- **Effort:** XL (foundation in v1.1; full coverage v1.2).
- **Acceptance:** bill-approve and payment-release post balanced, immutable entries with a correlation id; reconciliation shows Tier-3 == Tier-2 on a fixture.

### MEDIUM

**T8 · Enable ESLint + CI gate**
- **Description:** Add ESLint config and script; wire the CI workflow to run `tsc` + ESLint + tests on PRs.
- **Affected files:** `package.json`, new `.eslintrc`, `.github/workflows/ci.yml` (already scaffolded).
- **Dependencies:** none.
- **Effort:** S.
- **Acceptance:** CI blocks a PR that fails type-check, lint, or tests.

**T9 · Remove dead code / duplicate utilities (low-risk)**
- **Description:** Delete `billService.markAsPaid/markAsPartiallyPaid`, `SkeletonCard`, unused getters, unreachable branch; extract `loadSaleOrThrow`/`normName`/released-total to shared helpers.
- **Affected files:** per AUDIT TECH-DEBT G-8/G-11 (billService, several services, components).
- **Dependencies:** none.
- **Effort:** M.
- **Acceptance:** no dead exports; duplicated helpers reduced to one; tests green.

### LOW

**T10 · Add `firestore.indexes.json` + `ledgerUtils` tests**
- **Description:** Commit composite indexes needed by existing multi-clause queries; add the missing `ledgerUtils.test.ts` (the most accounting-like, currently untested module).
- **Affected files:** new `firestore.indexes.json`, `firebase.json`; new `src/lib/ledgerUtils.test.ts`.
- **Dependencies:** none.
- **Effort:** S–M.
- **Acceptance:** indexes deploy with rules; ledger construction covered by tests.

---

## Governance note

Per the Amendment Protocol, the ADR-mandatory tasks (T1 deploy topology, T3 rules, T4 financial formula, T7 posting engine) require an ADR before implementation ([`governance/adr/`](./governance/adr/), NN-25). Every task passes the merge gate ([`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md), NN-28). This document is a **plan for approval** — no code will change until sign-off.
