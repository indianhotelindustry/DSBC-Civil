# TECHNICAL DEBT REGISTER — DSBC Civil (formerly SIPL Work Orders)

Every item is verified from source. **Priority** = P0 (blocks safe production) · P1 (high, fix before scale/commercial use) · P2 (medium) · P3 (low/cosmetic). **Effort** is a rough engineering estimate (S ≤ half-day, M ≤ 2 days, L ≤ 1 week, XL > 1 week).

Items prefixed **D-** are the load-bearing defects; **G-** are structural/cleanliness debt.

---

## P0 — Blocks safe production

### D-0 · Secure backend is not deployed; production silently uses weaker client writes
**Priority P0 · Effort L–XL**
`firebase.json` deploys only hosting + rules; no `functions/`, Cloud Run, or backend host exists. [secureApi.ts:57-96](../src/services/secureApi.ts#L57-L96) falls back to direct client Firestore writes when the server 404s. All server-side transactional validation is absent in production. Also disables alerts/daily summaries (node-cron never runs). **This is the root cause of D-1, C-1, C-2, C-3.**
**Fix path:** migrate the four secure routes to Firebase Cloud Functions (callable) and the two cron jobs to Cloud Scheduler — the plan already exists in `CLOUD_FUNCTIONS_PLAN.md` but was never built; **or** remove the fallback and push all invariants into hardened rules (limited — rules can't cross-query sums). See NEXT_DEVELOPMENT_PLAN R1.

### D-1 · Three divergent overbilling ceilings
**Priority P0 · Effort M**
- Client bill-create checks cumulative `workDoneAmount` ≤ **gross BOQ** (`woGrossValue`, [billService.ts:82-91](../src/services/billService.ts#L82-L91)).
- Server bill-approve checks ≤ **net grandTotal** ([secureRoutes.ts:115-124](../server/secureRoutes.ts#L115-L124)).
- WO edit-guard checks new grandTotal ≥ billed using **net** ([workOrderService.ts:121-131](../src/services/workOrderService.ts#L121-L131)).
- Bills module and PaymentRequests module don't count each other's outflow.
The client's own comment flags the net ceiling as a historical bug, yet the server still uses it. On any WO with advance/retention/GST these produce different limits; a bill valid at create can be blocked at approve, or combined channels can over-commit a WO.
**Fix:** define one authoritative ceiling (recommend gross BOQ for work-done, tracked separately from payment ceiling), apply it in create, update, approve, and both payment paths.

### D-2 · Variation-order approval corrupts WO financials
**Priority P0 · Effort S–M**
VO approval recomputes `grandTotal = subtotal + gstAmount` with `subtotal = newTotalAmount + otherCharges`, **omitting** the advance and retention subtractions the WO form applies ([secureRoutes.ts:220-234](../server/secureRoutes.ts#L220-L234); identical bug in client fallback [secureApi.ts:192-208](../src/services/secureApi.ts#L192-L208) vs form [WorkOrderForm.tsx:215-218]). After each approved VO, `grandTotal` is inflated by `advance + retention`, which then feeds the (already wrong) approval ceiling and every `woRemainingAmount` display.
**Fix:** extract one shared `computeWorkOrderFinancials()` used by the form, the server, and the fallback.

### D-6 · Money mutations use read-then-write instead of atomic operations
**Priority P0 · Effort M–L**
- `sales.totalReceived` and `saleSchedules.paidAmount` are read then written, not `FieldValue.increment` ([saleReceiptService.ts:138,213,96](../src/services/saleReceiptService.ts#L138)). Concurrent receipts silently lose money in cached totals.
- Payment over-release: query-sum-then-batch in client fallback ([secureApi.ts:152-174](../src/services/secureApi.ts#L152-L174)).
- One-active-sale-per-unit, bill overbilling, payment-request ceiling: all query-then-write.
**Fix:** wrap money mutations in `runTransaction`; use `increment()` for cached counters. (Server routes already do this correctly — another reason to deploy them, D-0.)

---

## P1 — High

### D-3 · Contractor Ledger cannot reconcile and is untested
**Priority P1 · Effort M**
[ledgerUtils.ts](../src/lib/ledgerUtils.ts): advances are counted in KPIs ([:137-139](../src/lib/ledgerUtils.ts#L137)) but dropped from ledger rows (bill-lookup fails for the `billId==workOrderId` advance convention, [:43-44](../src/lib/ledgerUtils.ts#L43)); DRAFT bills post to the ledger ([:16](../src/lib/ledgerUtils.ts#L16)); released payments on rejected-WO bills appear as unbalanced debits; "Retention Held" shows planned not actual ([:151](../src/lib/ledgerUtils.ts#L151)). **Zero tests** for the most accounting-like module in the repo. "Add Adjustment"/"Export Ledger" buttons are dead.
**Fix:** decide advance representation, exclude DRAFT (or mark provisional), add a `ledgerUtils.test.ts` suite, wire or remove the dead buttons.

### D-4 · Retention withheld but never tracked or released
**Priority P1 · Effort L**
Retention is deducted from `netPayable` per bill but there is no retention-payable record and no release flow anywhere (verified: only computation/display sites exist). Withheld money disappears from every ledger permanently.
**Fix:** model retention as a tracked liability with an explicit release transaction; see NEXT_DEVELOPMENT_PLAN R5.

### D-5 · `adjustments` collection is read but has no writer
**Priority P1 · Effort S–M**
`adjustmentService.create/update/delete` have zero callers; the "Add Adjustment" UI button has no handler. Yet `advanceOutstanding` KPIs subtract RECOVERY adjustments ([financialCalcs.ts](../src/lib/financialCalcs.ts)). Adjustments can only enter via external console writes — a broken feature loop.
**Fix:** build the adjustment-entry UI or remove the dependent KPI logic.

### D-7 · Bill `update` skips the overbilling ceiling re-check
**Priority P1 · Effort S**
[billService.ts:109-145](../src/services/billService.ts#L109-L145) recalculates totals but never re-runs the cumulative check, so a DRAFT/VERIFIED bill's `workDoneAmount` can be raised past the WO limit after creation.

### D-8 · `paymentService.create` counts only RELEASED against the ceiling
**Priority P1 · Effort S**
Comment says "released + pending approved," code counts only RELEASED ([paymentService.ts:19-26,61](../src/services/paymentService.ts#L19-L26)). Multiple PENDING/APPROVED payments can jointly exceed `netPayable`, failing only at release.

### D-9 · Referential-integrity gaps on delete
**Priority P1 · Effort M**
- `subLocationService.delete` doesn't check active sales (orphans Sale docs).
- `customerService.delete` doesn't check `sales.customerId` (BOOKED-sale customer deletable).
- `workOrderService.delete` doesn't check paymentRequests (orphans them).
- `termsTemplate/material/store/vehicle/vendor.delete` have no reference guards.
- `paymentRequestService.delete` deletes even PAID requests with zero guards (currently unused, but exposed in the service).

### G-1 · Broken navigation + no 404 route
**Priority P1 · Effort S**
`ContractorLedger.tsx:142,152` navigate to nonexistent `/contractors` → blank screen (no catch-all route in [App.tsx](../src/App.tsx)). Add a `*` route and fix the target to `/masters`.

### G-2 · Listener leak in Customer Ledger
**Priority P1 · Effort S**
[CustomerLedger.tsx:78](../src/pages/CustomerLedger.tsx#L78) discards the `customerService.getAll` unsubscribe; each visit to a different customer leaks a full-collection listener.

---

## P2 — Medium

### G-3 · Two parallel payment systems
**Priority P2 · Effort L (decision) / XL (consolidation)**
Legacy Bills→Payments (`paymentService`) and WO-based PaymentRequests (`paymentRequestService`) coexist, acknowledged in code comments. They enforce different ceilings and don't see each other's outflow (root of part of D-1). Decide one canonical outflow path and deprecate the other, or make them share a single outflow-accounting function.

### G-4 · Dead executive/action UI (15 handler-less buttons)
**Priority P2 · Effort M**
CEODashboard: 9 (all "Executive Actions", Approval Queue "Review", "View All"). AccountsDashboard: 3. ContractorLedger: 3 (Export/Add Adjustment/Upload). Either wire them or remove them — dead controls read as "done" and mislead this very audit's future readers.

### G-5 · Unconfirmed destructive deletes
**Priority P2 · Effort S**
WorkOrders ([:451](../src/pages/WorkOrders.tsx#L451)) and Bills ([:364](../src/pages/Bills.tsx#L364)) delete without `window.confirm`, inconsistent with every other page.

### G-6 · No rounding in `financialCalcs.ts` / `ledgerUtils.ts`
**Priority P2 · Effort S**
Raw float accumulation across all reduces (unlike the sale-side modules which use `round2`). UI rounds to whole rupees so drift is hidden, but exported/summed figures can carry paise error. Standardize on a shared `round2`.

### G-7 · "Overdue" is bill-date-based, not due-date-based
**Priority P2 · Effort M**
There is no due-date/credit-period field on `Bill`; a bill is "overdue" the day after it is dated ([financialCalcs.ts:290](../src/lib/financialCalcs.ts#L290)). Add a due-date/payment-terms field and base overdue on it.

### G-8 · Duplicated logic (extraction candidates)
**Priority P2 · Effort M**
- `loadSaleOrThrow` ×3, `normName` ×2, released-total-for-bill ×2, verify/approve/release logic ×3 (server, fallback, dead billService methods).
- 7 near-identical `assert*Unique` in services while `lib/masterValidations.ts` already ships pure equivalents.
- 7 copy-pasted master CRUD pages (~1,500 lines collapsible to one generic component).
- Status→color ternaries and `getWorkOrderTitle/Number` helpers repeated across most pages.
- Sale status badge ×3, `SummaryCard` ×2, `subscribeAllReceipts` ×2, `FUNDING_OPTIONS` ×2.

### G-9 · Firestore caches trusted without reconciliation
**Priority P2 · Effort M**
`sale.totalReceived`, `saleSchedules.paidAmount/balanceAmount`, deprecated `wo.billing.*` are caches; divergence from derived truth would go undetected. Add a reconcile/repair tool (pattern already exists for project companyId backfill).

### G-10 · Misused business-rule error codes
**Priority P2 · Effort S**
`WORK_ORDER_NOT_FOUND` for missing sales/companies/units; `PAYMENT_INVALID_AMOUNT` for name/email validation; `DELETE_BLOCKED` for duplicates; etc. (many sites). Harmless to logic, misleading to operators and logs. Add precise codes.

---

## P3 — Low / cosmetic

- **G-11** Dead code: email/password sign-in branch (Login), `billService.markAsPaid/markAsPartiallyPaid`, `SkeletonCard`, many unused service getters, unused imports (AccountsDashboard icons, `PaymentCalendar`), dead `workOrderService` import in variationOrderService, unreachable branch [subLocationService.ts:103](../src/services/subLocationService.ts#L103). **Effort S.**
- **G-12** `StatBlock` ignores its `icon` prop, always renders `Wallet` ([PaymentRequests.tsx:585](../src/pages/PaymentRequests.tsx#L585)). **S.**
- **G-13** PII in console: [db.ts:70](../src/services/db.ts#L70) logs full auth context (email, provider) on Firestore errors. **S.**
- **G-14** `BudgetDashboard`/`ContractorLedger` set `loading=false` synchronously so skeletons flash off before data. **S.**
- **G-15** `vendorService.create` may write `undefined` optional fields (Firestore rejects) — unverified runtime bug. **S.**
- **G-16** Hardcoded magic values: ₹50,000 advance threshold, 0.01 epsilons, batch chunk 400 / limit 500, emulator URL, WO series defaults. Centralize as named constants. **S.**
- **G-17** Nav hides `/masters` from PURCHASE_MANAGER/STORE_MANAGER despite route + tab support ([Layout.tsx:52](../src/components/Layout.tsx#L52) vs [App.tsx:45](../src/App.tsx#L45)). **S.**
- **G-18** Payments page feeds unscoped bills/workOrders to PaymentCalendar while scoping its own tables ([Payments.tsx:135](../src/pages/Payments.tsx#L135)). **S.**
- **G-19** Work-category→WO linkage by name string, not id — renaming orphans the delete-guard ([workCategoryService.ts:90](../src/services/workCategoryService.ts#L90)). **M.**
- **G-20** No ESLint (only `tsc --noEmit`); no CI; `clean` script uses `rm -rf` (non-portable on Windows cmd). **S.**
- **G-21** Obsolete artifacts: `README.md` (AI Studio boilerplate), `firebase-blueprint.json` (2 generations stale), `metadata.json` (applet manifest), dead `GEMINI_API_KEY`/`APP_URL`/`DISABLE_HMR` config. Remove or replace with real docs. **S.**

---

## Debt summary by priority
| Priority | Count | Theme |
|---|---|---|
| P0 | 4 | Backend deployment + financial-integrity correctness |
| P1 | 9 | Ledger/retention/reconciliation, delete integrity, nav/leak |
| P2 | 10 | Duplication, rounding, dead UI, caches |
| P3 | 11 | Cleanup, cosmetics, tooling, docs |

**The P0 cluster is the gate.** Everything else is normal maturation debt for a v0.9 product; the P0 items are why this is not yet safe for untrusted commercial deployment.
