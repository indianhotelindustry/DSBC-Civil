# PLATFORM STABILIZATION v1.1 — Implementation Specifications (Critical Tasks T1–T4)

> **Status:** SPECIFICATION FOR APPROVAL — **no code has been modified; no ADRs written.** Coding begins only after sign-off; ADRs are authored at that point.
> **Companion to:** [`../PLATFORM_STABILIZATION_v1.1.md`](../PLATFORM_STABILIZATION_v1.1.md) (inspection & task list). This document adds implementation-grade detail for the four Critical tasks.
> **Principle:** strengthen the existing implementation. Every target below **reuses** existing code; nothing is redesigned. Illustrative target snippets are labelled and are specification, not applied changes.

## Conventions & global sequencing

- Effort: **S** ≤ ½ day · **M** ≤ 2 d · **L** ≤ 1 wk · **XL** > 1 wk.
- Each task is delivered on its own `feature/*` branch off `platform/stabilization-v1.1`, passing the merge gate ([`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md)).

**Dependency & order (hard):**
```
T4 (single financial math) ──┐
                             ├─► T1 (deploy backend) ──► T2 (remove fallback) ──► T3 (tighten rules)
T4 lands with/before T1 so the deployed functions carry the CORRECT formula.
T2 MUST NOT merge before T1 is verified live (else the production app breaks).
T3 lands immediately after T1 (writes now originate from Admin SDK, which bypasses rules).
```

---

# T1 — Deploy the authoritative backend as a Firebase Function

**Priority:** Critical · **Effort:** L–XL

## 1.1 Current implementation
- The authoritative logic is an Express app assembled in [`server.ts:24-77`](../server.ts#L24-L77): `express.json` → `/api/health` → unauthenticated `/api/admin/*` ([`:37-45`](../server.ts#L37-L45)) → `/api/secure` router ([`:48`](../server.ts#L48)) → node-cron ([`:51-54`](../server.ts#L51-L54)) → Vite (dev) / static (prod) → `app.listen`.
- Secure routes: [`secureRoutes.ts:245-268`](../server/secureRoutes.ts#L245-L268) `createSecureRoutes()` returns a `Router` with 4 POST routes, each `requireAuth → requireRole → withAudit(handler)`. Handlers use `db.runTransaction` (e.g. releasePayment [`:137-187`](../server/secureRoutes.ts#L137-L187)).
- Auth: [`authMiddleware.ts:21-75`](../server/authMiddleware.ts#L21-L75) — `verifyIdToken`, role from `users/{uid}`.
- Admin SDK: [`firebaseAdmin.ts:16-25`](../server/firebaseAdmin.ts#L16-L25) — `initializeApp({ projectId })` (ADC), reads `firebase-applet-config.json` from `cwd`.
- **Deployment:** none. `firebase.json` ships hosting + rules only. Under `npm run dev` the app runs locally; in production the routes 404 and the client falls back.

## 1.2 Target implementation
Deploy the **existing Express app** as one HTTPS Cloud Function behind a Hosting rewrite. This reuses `secureRoutes.ts`, `authMiddleware.ts`, `auditLog.ts`, `apiResponse.ts` **verbatim** — the minimal-change path.

1. **Refactor `server.ts` to separate app-building from serving** (no logic change):
   - Extract `export function createApp(): Express` that builds the app with `express.json`, `/api/health`, `/api/admin/*` (now auth-gated, see T6), and `/api/secure`. It does **not** call `listen` or mount Vite.
   - `startServer()` (dev) calls `createApp()`, then adds Vite middleware + `listen` + cron (unchanged dev behavior).
2. **New `functions/` package** (standard Firebase Functions TS setup):
   - *Illustrative target:*
     ```ts
     // functions/src/index.ts
     import * as functions from "firebase-functions/v2/https";
     import { onSchedule } from "firebase-functions/v2/scheduler";
     import { createApp } from "../../server/app";           // shared builder
     import { runAlertEngine, runSummaryGenerator } from "../../server/backgroundJobs";
     export const api = functions.onRequest({ region: "asia-south1" }, createApp());
     export const dailyJobs = onSchedule("0 8 * * *", async () => {
       await runAlertEngine(); await runSummaryGenerator();
     });
     ```
   - Admin SDK in functions uses default credentials: `admin.initializeApp()` (the function's service account). Adjust `firebaseAdmin.ts` to fall back to `initializeApp()` when the config file is absent (functions runtime) — keep the local-file path for dev.
3. **`firebase.json`** — add functions + a Hosting rewrite so the client's existing `fetch('/api/secure/...')` resolves to the function:
   ```jsonc
   "hosting": { "rewrites": [
     { "source": "/api/secure/**", "function": "api" },
     { "source": "/api/health",    "function": "api" },
     { "source": "**", "destination": "/index.html" }   // existing SPA fallback (order matters: api rewrites first)
   ]},
   "functions": { "source": "functions" }
   ```
4. **Idempotency (money ops):** the handlers are already status-idempotent (a replayed release sees `RELEASED` and throws `RECORD_LOCKED`). Add a lightweight idempotency guard for retry-safety: accept an optional `idempotencyKey` (paymentId+transition) and short-circuit to success if the transition already occurred. Full keyed idempotency lands with the posting engine (T7).
5. **Retry:** rely on Functions' platform retry for the scheduled jobs; make jobs idempotent (they already upsert by deterministic ids). HTTPS `api` is not auto-retried (client-driven).

## 1.3 Files affected
- **Refactor:** [`server.ts`](../server.ts) → split into `server/app.ts` (new, `createApp`) + `server.ts` (dev harness). No handler logic changes.
- **Adjust:** [`server/firebaseAdmin.ts`](../server/firebaseAdmin.ts) (credential fallback for functions runtime).
- **New:** `functions/` (package.json, tsconfig, `src/index.ts`), `firestore.indexes.json`.
- **Edit:** [`firebase.json`](../firebase.json) (functions + rewrites). Read first per edit rules.
- **Unchanged:** `secureRoutes.ts`, `authMiddleware.ts`, `auditLog.ts`, `apiResponse.ts`, `backgroundJobs.ts`, and **all** `src/` client code (secureApi keeps its fetch path).

## 1.4 Migration strategy
1. Refactor `createApp` (behavior-preserving; verify dev still works).
2. Scaffold `functions/`; resolve the `.ts`-extension ESM imports (server code imports use explicit `.ts`; the functions build compiles TS → JS, so either adjust specifiers via a build alias or import from a compiled `server/` output). Decide the shared-build approach in the ADR.
3. Deploy to a **staging** Firebase project (`firebase deploy --only functions,hosting,firestore:rules` to staging).
4. Smoke-test each op end-to-end in staging via the real UI (the client is unchanged; `secureApi` should now report mode `server`).
5. Deploy to production; **feature-flag** the cutover (a client flag that, when on, treats a missing-server response as an error — see T2).

## 1.5 Rollback strategy
- **Functions:** `firebase functions:delete api` or redeploy the previous version; the Hosting rewrite without a function falls through to the SPA (restoring today's behavior). Because T2 is not yet merged, the client still has its fallback during T1, so removing the function is non-breaking.
- **Hosting:** `firebase hosting:rollback`.
- **Config:** revert `firebase.json` from source control.
- No data migration in T1 → rollback is deploy-only, near-instant.

## 1.6 Risks
- **Credentials/topology** (H): functions need the correct service account + region; ADC differs from the local config-file path. *Mitigation:* `admin.initializeApp()` default creds in functions; document in the ADR; verify in staging.
- **ESM/.ts import build** (M): server code uses `tsx`-style `.ts` imports; the functions build must resolve them. *Mitigation:* compile server code into the functions bundle or a shared build; decided in the ADR.
- **Cold starts** (L): first call latency. *Mitigation:* min-instances if needed; not a correctness issue.
- **Regression to dev flow** (M): the `createApp` split must preserve `npm run dev`. *Mitigation:* dev smoke test in the same PR.

## 1.7 Test plan
- **Unit:** none new for handlers (logic unchanged); a test that `createApp()` mounts the 4 routes + health.
- **Integration (staging, emulator where possible):** each of verify/approve/release/VO-approve succeeds for an authorized role and is rejected (403) for an unauthorized role; a released-then-replayed call is a typed no-op/error, not a double effect.
- **Scheduled jobs:** trigger `dailyJobs` in staging; confirm `alerts`/`dailySummaries` populate.
- **Admin endpoints:** confirm they now require auth (T6 dependency).
- **Manual E2E:** drive bill verify→approve→payment release in the staging UI; confirm `secureApi.getSecureMode() === 'server'`.

## 1.8 Dependencies
- **T4** (deploy the corrected single formula) — land with/before.
- Staging Firebase project + Functions credentials/region (Founder/DevOps decision).
- `firestore.indexes.json` for any composite queries the jobs use.

## 1.9 Estimated effort
**L–XL** (functions scaffolding + build resolution + staging verification dominate; handler logic is reused).

---

# T2 — Invert `secureApi` to fail-loud; remove production client fallback

**Priority:** Critical · **Effort:** M

## 2.1 Current implementation
[`secureApi.ts`](../src/services/secureApi.ts): `tryServerCall` ([`:57-96`](../src/services/secureApi.ts#L57-L96)) POSTs `fetch('/api/secure'+path)`; on non-JSON (SPA HTML) or any error it calls `setMode('client-fallback')` and returns `null`. Exports ([`:216-238`](../src/services/secureApi.ts#L216-L238)) then invoke `clientVerifyBill`/`clientApproveBill`/`clientReleasePayment`/`clientApproveVariationOrder` ([`:102-210`](../src/services/secureApi.ts#L102-L210)) — direct Firestore writes with weaker validation (e.g. `clientApproveBill` [`:120-136`](../src/services/secureApi.ts#L120-L136) performs no cumulative-billing check; `clientReleasePayment` [`:152-174`](../src/services/secureApi.ts#L152-L174) sums-by-query then batch-writes, non-atomic).

## 2.2 Target implementation
- After T1, the production `fetch` returns real JSON → `setMode('server')` → fallback never triggers on the happy path. T2 makes that guarantee **enforced**, not incidental:
  - In `tryServerCall`, when the response is non-JSON or errors **and the build is production**, throw a typed `BusinessRuleError` (surfaced as a toast) instead of returning `null`.
  - Guard the four `clientXxx` functions and their dispatch behind `import.meta.env.DEV` so they are **dead-code-eliminated from the production bundle** (Vite sets `import.meta.env.DEV=false` in `vite build`; no config change needed).
- *Illustrative target:*
  ```ts
  export async function secureReleasePayment(paymentId: string): Promise<void> {
    const result = await tryServerCall(`/payments/${paymentId}/release`);
    if (result) return;                       // server handled it
    if (import.meta.env.DEV) return clientReleasePayment(paymentId);  // local dev only
    throw new BusinessRuleError('RECORD_LOCKED', 'Secure service unavailable. Please retry.');
  }
  ```
- `getSecureMode`/`onSecureModeChange` and the Layout indicator remain — useful for observability.

## 2.3 Files affected
- [`src/services/secureApi.ts`](../src/services/secureApi.ts) only. No change to `billService`/`paymentService`/`variationOrderService` (they call the same exported functions). No UI change (same toasts).

## 2.4 Migration strategy
1. Land **after T1 is verified live** in production.
2. Add the `import.meta.env.DEV` guards and the production throw.
3. Feature-flag the "throw vs fallback" behavior for one release so it can be toggled off instantly if the functions misbehave (NN-27), then remove the flag once stable.

## 2.5 Rollback strategy
- Flip the feature flag back to "fallback" (instant), or revert the `secureApi.ts` PR. Because the `clientXxx` functions remain in the dev build and behind the flag, rollback restores exact prior behavior. No data change.

## 2.6 Risks
- **Premature merge** (Critical if mishandled): merging before T1 is live removes the only working production path. *Mitigation:* hard dependency gate; the throw is flag-guarded.
- **Transient function outage becomes a user-visible error** (M): acceptable and correct (fail-loud), but should show a clear retry message. *Mitigation:* good toast copy; functions min-instances.

## 2.7 Test plan
- **Unit:** with `import.meta.env.DEV=false` (production mode test), a forced non-JSON/`throw` from `tryServerCall` makes each export **throw**, and `clientXxx` is not invoked. With `DEV=true`, the fallback still runs.
- **Bundle check:** confirm `clientReleasePayment` et al. are absent from the production build output (tree-shaken).
- **E2E (staging):** normal flow works via server; simulate function down → UI shows the typed error, no Firestore write occurs.

## 2.8 Dependencies
- **T1 live in production.** (Absolute.)

## 2.9 Estimated effort
**M.**

---

# T3 — Tighten Firestore rules so money transitions are function-only

**Priority:** Critical · **Effort:** M

## 3.1 Current implementation
[`firestore.rules`](../firestore.rules):
- Payments: client may transition APPROVED→RELEASED with only `onlyFieldsChanged(['status'])` ([`:299-301`](../firestore.rules#L299-L301)).
- Bills: client may transition APPROVED/PARTIALLY_PAID→PAID/PARTIALLY_PAID with `onlyFieldsChanged(['status','paidBy','paidAt'])` ([`:253-259`](../firestore.rules#L253-L259)).
- Work orders: VO-approval branch on APPROVED WOs has **no** `onlyFieldsChanged` ([`:208-209`](../firestore.rules#L208-L209)) — arbitrary financial fields writable by CEO/Admin.
- Audit: `create: if isAuthenticated()` with no `userId` check ([`:350`](../firestore.rules#L350)).

## 3.2 Target implementation
After T1, the release/approve/mark-paid writes originate from the **Admin SDK inside the function**, which **bypasses Firestore rules entirely**. So the client rule for these transitions can be **denied** without breaking the authoritative path:
- **Payments:** remove the client `APPROVED→RELEASED` allowance ([`:299-301`](../firestore.rules#L299-L301)). Keep client create (PENDING) and CEO approve (PENDING→APPROVED) — those remain client operations for now, or are also moved to functions in a later task. (v1.1 scope: deny only the money-releasing transition.)
- **Bills:** remove the client `→PAID/PARTIALLY_PAID` allowance ([`:253-259`](../firestore.rules#L253-L259)); the function performs it. Keep client DRAFT edits and PM/CEO verify/approve transitions as today (verify/approve already route through the function via secureApi; the rules may also tighten these in a follow-up).
- **Work orders:** add `onlyFieldsChanged(['status','amount','financials','billing','approvedBy','approvedAt'])`-style scoping to the VO branch ([`:208-209`](../firestore.rules#L208-L209)) — restrict to the fields VO approval legitimately changes. Since VO approval routes through the function, the tightest option is to deny this client branch entirely and let the function write it.
- **Audit:** add `&& request.resource.data.userId == request.auth.uid` to the `auditLogs` create rule ([`:350`](../firestore.rules#L350)) (this is T6 but co-located in the rules PR).

## 3.3 Files affected
- [`firestore.rules`](../firestore.rules) (the four blocks above).
- **New:** `tests/rules/` — rules-unit-tests (`@firebase/rules-unit-testing`).
- [`firebase.json`](../firebase.json) already deploys rules.

## 3.4 Migration strategy
1. Land **after T1** so the function path exists before the client path is denied.
2. Write allow+deny rules-unit-tests first (TDD).
3. Deploy rules to staging with the functions; verify the UI still works (writes go via function) and direct-SDK attempts are denied.
4. Promote to production with the T1 deploy set.

## 3.5 Rollback strategy
- Re-deploy the previous `firestore.rules` from source control (instant, no data change). Because rules and functions deploy as a set, roll them back together.

## 3.6 Risks
- **Denying a transition the client still legitimately performs** (H): if any client path still needs a denied transition, the app breaks. *Mitigation:* the rules-unit-tests + staging UI E2E confirm every legitimate transition now goes through the function before denying the client branch. Deny **only** the release/mark-paid/VO-financial transitions in v1.1; leave create/verify/approve client paths intact unless verified moved.
- **Rules test infra not yet present** (M): `tests/rules/` is new. *Mitigation:* stand it up as part of this task (also serves T-future).

## 3.7 Test plan
- **Rules-unit-tests (mandatory, NN-29/TEST-3):**
  - DENY: a client (role ACCOUNTS) direct write payment `APPROVED→RELEASED` → **denied**.
  - DENY: a client direct write bill `APPROVED→PAID` → **denied**.
  - DENY: a client write to WO `financials` on an APPROVED WO → **denied** (or field-scoped).
  - DENY: `auditLogs` create with `userId != auth.uid` → **denied**.
  - ALLOW: unchanged legitimate transitions (bill DRAFT edit by ACCOUNTS, PM verify, CEO approve) still **allowed**.
- **E2E (staging):** full bill→payment→release cycle works entirely through the function; the mode indicator shows `server`.

## 3.8 Dependencies
- **T1 live** (functions perform the now-denied transitions).

## 3.9 Estimated effort
**M** (rules edits are small; the rules-test harness is the bulk).

---

# T4 — FinancialCalculationService (single source of money math)

**Priority:** Critical · **Effort:** M

## 4.1 Current implementation (duplication & drift — verified)
- **WO financials, 3 copies, divergent:**
  - Form [`WorkOrderForm.tsx:214-218`](../src/components/WorkOrderForm.tsx#L214-L218): `subtotal = totalAmount − advance`; `gst = subtotal × pct`; `retention = totalAmount × pct`; `grandTotal = subtotal + gst + otherCharges − retention`.
  - VO server [`secureRoutes.ts:220-234`](../server/secureRoutes.ts#L220-L234): `subtotal = newTotal + otherCharges`; `gst = newTotal × pct`; `grandTotal = subtotal + gst` (**omits advance and retention subtraction**).
  - VO client [`secureApi.ts:192-196`](../src/services/secureApi.ts#L192-L196): same as VO server.
- **Bill totals, 2 copies (identical):** `billService.recalculateBillTotals` [`:21-33`](../src/services/billService.ts#L21-L33) and `Bills.tsx:131-143`.
- **Overbilling ceiling, 3 definitions:** client create gross BOQ [`billService.ts:82-91`](../src/services/billService.ts#L82-L91); server approve net grandTotal [`secureRoutes.ts:115-124`](../server/secureRoutes.ts#L115-L124); WO edit net [`workOrderService.ts:121-131`](../src/services/workOrderService.ts#L121-L131).

## 4.2 Target implementation
Create one pure module (React/Firebase-free, per Constitution §4, so both the client and the Cloud Functions import it):
- **New:** `src/lib/financialCalculationService.ts`
  - *Illustrative signatures:*
    ```ts
    export const MONEY_EPSILON = 0.01;
    export function round2(n: number): number { return Math.round(n * 100) / 100; }

    export interface WorkOrderFinancialsInput {
      items: { amount: number }[]; advance: number; otherCharges: number;
      gstPercentage: number; retentionPercentage: number;
    }
    export interface WorkOrderFinancialsResult {
      totalAmount: number; subtotal: number; gstAmount: number;
      retentionAmount: number; grandTotal: number;
    }
    // CANONICAL = the WorkOrderForm formula (authored intent, what users see).
    export function computeWorkOrderFinancials(i: WorkOrderFinancialsInput): WorkOrderFinancialsResult;

    export function recalculateBillTotals(i: {...}): {...};   // moved from billService

    // ONE ceiling. Constitution FIN-3 designates GROSS BOQ for work-done.
    export function outflowCeiling(wo: WorkOrder): number;     // = woGrossValue(wo)
    ```
  - `computeWorkOrderFinancials` implements the **form's** formula exactly (no behavior change for the form). The VO path is changed to compute `newTotalAmount = financials.totalAmount + vo.amount`, then call `computeWorkOrderFinancials` with the new items/total + existing advance/otherCharges/percentages — so VO now matches the form and stops inflating `grandTotal`.
- **Rewire callers to import the service:**
  - `WorkOrderForm.tsx` — replace inline `:214-218` with `computeWorkOrderFinancials`.
  - VO server `secureRoutes.ts:220-234` and VO client `secureApi.ts:192-196` — replace with the service.
  - `billService.ts` — re-export/move `recalculateBillTotals` to the service; `Bills.tsx:131-143` imports it (delete the UI copy).
  - Overbilling: `billService.create`, `billService.update` (add the missing re-check), `secureRoutes.approveBill`, `workOrderService.update` — all call `outflowCeiling(wo)`.
- **Decision needed (accountant sign-off):** the canonical formula preserves the form's semantics, including **GST computed on `(totalAmount − advance)`** and retention subtracted from `grandTotal`. Confirm this is the intended accounting treatment before rewiring the VO/ceiling paths (this is the one behavior-affecting change: WOs with advances/deductions that previously went through VO approval will recompute to a *lower, correct* `grandTotal`).

## 4.3 Files affected
- **New:** `src/lib/financialCalculationService.ts` + `src/lib/financialCalculationService.test.ts`.
- **Edit:** [`WorkOrderForm.tsx`](../src/components/WorkOrderForm.tsx), [`billService.ts`](../src/services/billService.ts), [`Bills.tsx`](../src/pages/Bills.tsx), [`workOrderService.ts`](../src/services/workOrderService.ts), [`secureRoutes.ts`](../server/secureRoutes.ts), [`secureApi.ts`](../src/services/secureApi.ts).
- **Reference:** existing `financialCalcs.ts` (`woGrossValue`) — `outflowCeiling` delegates to it; do not duplicate.

## 4.4 Migration strategy
1. Create the service with tests (including a test that pins `form == VO` result — proving the divergence is gone).
2. Rewire the form first (pure UI, no behavior change — the extracted function equals the inline code).
3. Rewire the bill-total UI copy (identical formula — safe).
4. Rewire the VO paths and the ceiling call-sites (behavior-affecting) **behind the accountant confirmation**, with regression tests capturing before/after on representative WOs.
5. Land with/before T1 so the functions deploy the corrected formula.

## 4.5 Rollback strategy
- Pure code change, no data migration. Revert the PR to restore the prior (divergent) formulas. **Note:** any WO financials *recomputed* after the fix are corrected values; a rollback would revert the code but not re-inflate already-stored values — acceptable, since the corrected values are the intended ones. If a WO's stored `grandTotal` must be recomputed for consistency, a one-off recompute script (idempotent, `legacyDataCleanup` pattern) can be provided — but is not required for rollback.

## 4.6 Risks
- **Behavior change on advance/retention WOs** (H): the VO/ceiling unification changes computed values. *Mitigation:* accountant sign-off + regression tests + a report of which existing WOs would recompute (read-only scan before rollout).
- **Ceiling change blocks/permits different bills** (M): moving everything to gross BOQ changes which bills validate. *Mitigation:* the constitution already designates gross BOQ (FIN-3); test both accept and reject cases; communicate to Accounts.
- **Shared module imported by functions** (M): requires the `src/lib` module to be consumable by the functions build (same constraint as T1's shared build). *Mitigation:* resolved by T1's build approach.

## 4.7 Test plan
- **Unit (mandatory):**
  - `computeWorkOrderFinancials` matches the current form output on a fixture set (no form regression).
  - VO approval via the service equals a fresh `computeWorkOrderFinancials` on the post-VO totals (**pins the divergence fix**).
  - `recalculateBillTotals` unchanged (existing `financialCalcs`/bill tests stay green).
  - `outflowCeiling` returns gross BOQ; applied ceiling rejects an over-gross bill and accepts an at-limit bill (failure + happy path, TEST-4).
  - Rounding: `round2`/`MONEY_EPSILON` applied.
- **Regression:** the full existing Vitest suite (199 tests) stays green.
- **Manual:** create a WO with advance + retention, approve a VO, confirm `grandTotal` is the corrected (form-consistent) value.

## 4.8 Dependencies
- Accountant confirmation of the canonical formula + ceiling (Founder decision).
- Coordinates with T1 (functions import the service).

## 4.9 Estimated effort
**M.**

---

## Cross-task integration & combined rollout

1. **T4** merges first (or with T1): the single formula exists and is tested.
2. **T1** deploys the backend (carrying T4's formula) to staging → verify → production behind a flag.
3. **T3** deploys the tightened rules with the T1 set (functions now perform the denied transitions).
4. **T2** flips production to fail-loud once T1 is confirmed stable; the dev fallback remains guarded.
5. **T6** (security: admin-endpoint auth, audit `userId`) rides the T1/T3 PRs.

**Combined rollback:** each layer rolls back independently and instantly (functions delete/redeploy, rules re-deploy, `secureApi` flag flip, T4 code revert). No step performs a data migration, so there is no irreversible state in v1.1's critical path (the posting engine T7, which does add persisted records, is separately gated and out of this Critical set).

## Approval checklist (what sign-off unblocks)

- [ ] **Canonical WO formula & ceiling confirmed** (accountant) → unblocks T4 rewiring.
- [ ] **Deployment target confirmed** (staging project, functions region, credentials) → unblocks T1.
- [ ] **Feature-flag mechanism chosen** for the T2 cutover.
- [ ] On approval: author **ADR-0001 (deploy backend)**, **ADR-0002 (FinancialCalculationService)**, **ADR-0003 (rules tightening)** before coding each (NN-25), then implement on `platform/stabilization-v1.1` branches under the merge gate.

*No code has been modified and no ADRs written. Awaiting implementation approval.*
