# MODULE AUDIT — DSBC Civil (formerly SIPL Work Orders)

**Method:** Each module verified from source. Status legend:
✅ Production Ready · 🟡 Functional but incomplete · 🟠 Prototype · 🔴 Planned only

Completion % is an engineering estimate of "distance to production-ready for that module's stated scope," not a measure of code volume. Production-readiness here is gated by the system-wide backend-deployment and financial-integrity issues in SECURITY_AUDIT.md and TECHNICAL_DEBT.md; module scores reflect the module's own code.

---

## Module scoreboard

| # | Module | Status | Completion |
|---|---|---|---|
| 1 | Authentication | 🟡 | 85% |
| 2 | Role Management / RBAC | 🟡 | 80% |
| 3 | Dashboard | 🟡 | 75% |
| 4 | Projects | ✅ | 95% |
| 5 | Contractors | ✅ | 95% |
| 6 | Work Orders | 🟡 | 90% |
| 7 | BOQ (embedded) | 🟡 | 80% |
| 8 | Variation Orders | 🟡 | 80% |
| 9 | Billing / Partial Billing | 🟡 | 80% |
| 10 | Retention | 🟠 | 40% |
| 11 | Bill Approval Workflow | 🟡 | 85% |
| 12 | Payment Workflow (Bills→Payments) | 🟡 | 80% |
| 13 | Payment Requests (WO-based) | 🟡 | 90% |
| 14 | Customers | ✅ | 95% |
| 15 | Plot / Unit Inventory (SubLocations) | ✅ | 95% |
| 16 | Sales / Booking | 🟡 | 90% |
| 17 | Sale Receipts + Schedules | 🟡 | 88% |
| 18 | Customer Ledger | 🟡 | 85% |
| 19 | Recovery Dashboard | 🟡 | 85% |
| 20 | Contractor Ledger | 🟡 | 65% |
| 21 | Budget / Analytics Dashboard | ✅ | 90% |
| 22 | Vendor Management | 🟡 | 60% (masters only) |
| 23 | Material / Inventory Masters | 🟡 | 55% (masters only) |
| 24 | Stores / Vehicles Masters | 🟡 | 55% (masters only) |
| 25 | Number Series | ✅ | 95% |
| 26 | Terms Templates | ✅ | 95% |
| 27 | Work Categories | ✅ | 95% |
| 28 | Audit Trail | 🟡 | 60% |
| 29 | Alerts / Notifications | 🟠 | 40% |
| 30 | Daily Summaries | 🟠 | 40% |
| 31 | Version History | ✅ | 95% |
| 32 | Finance: Voucher Engine | 🔴 | 0% |
| 33 | Finance: Journal / Double-Entry / Ledger posting | 🔴 | 0% |
| 34 | Finance: Cash Book / Bank Book | 🔴 | 0% |
| 35 | Purchase Requests / Purchase Orders | 🔴 | 0% |
| 36 | Inventory Transactions / Stock Ledger | 🔴 | 0% |
| 37 | Inter-Store Transfer | 🔴 | 0% |
| 38 | Material Consumption | 🔴 | 0% |
| 39 | Measurements / Measurement Book | 🔴 | 0% |
| 40 | Document Management | 🔴 | 0% (Storage initialized, unused) |
| 41 | Asset Management | 🔴 | 0% |
| 42 | Activity Timeline | 🔴 | 0% |
| 43 | Reports (formal) | 🔴 | 5% (dashboards only) |
| 44 | Sale Adjustments (refund/penalty/write-off) | 🔴 | 5% (type reserved) |

---

## Detailed module findings

### 1. Authentication — 🟡 85%
**Implemented:** Google sign-in, email registration, triple-guarded dev anonymous login; Firebase Auth session; `onAuthStateChanged` → live profile subscription ([auth.ts:224-300](../src/services/auth.ts#L224-L300), [AuthContext.tsx](../src/context/AuthContext.tsx)). Pre-registration "claim" flow via email-keyed placeholder docs.
**Missing:** Email/password *sign-in* branch is dead (form only renders in register mode, [Login.tsx:88-92](../src/pages/Login.tsx#L88-L92)). No password reset, no email verification enforcement, no MFA.
**Bugs:** Claim flow does two sequential unbatched writes ([auth.ts:169-173](../src/services/auth.ts#L169-L173)) — a crash between them leaves a duplicate user doc.
**Security:** Roles come from the Firestore `users/{uid}` doc, not custom claims — see SECURITY_AUDIT M-1. Default new-user role is `PROJECT_MANAGER` (write-capable), mitigated by `PENDING` status gate.
**Debt:** Hardcoded emulator URL, `dev@sipl.local`.
**Next:** Harden claim flow to a batch; decide on custom claims; add password reset.

### 2. Role Management / RBAC — 🟡 80%
**Implemented:** 8 roles ([types.ts:5-6](../src/types.ts#L5)); `AdminUsers.tsx` approve/activate/deactivate/role-change with sensitive-role double-confirm; multi-company assignment; last-active-admin guard ([userService.ts:54-67](../src/services/userService.ts#L54-L67)); self-sensitive-field guard. `ProtectedRoute` gates every page; SUPER_ADMIN bypasses all guards.
**Missing:** "Assign Stores" dialog is an explicit placeholder that never queries the (now-existing) stores collection ([AdminUsers.tsx:606-629](../src/pages/AdminUsers.tsx#L606-L629)). No role for STORE_KEEPER in any nav.
**Bugs:** Last-admin guard is read-then-write (two simultaneous demotions could zero admins).
**Next:** Wire store assignment; move role changes server-side.

### 3. Dashboard — 🟡 75%
**Implemented:** Role-router → CEO/Accounts/PM dashboards ([Dashboard.tsx:135-148](../src/pages/Dashboard.tsx#L135)). PM dashboard fully functional (95%). Accounts dashboard sophisticated action-required engine (85%).
**Missing / dead:** CEODashboard has 9 handler-less buttons (entire "Executive Actions" card, Approval Queue "Review" buttons, "View All") — the executive cockpit is largely display-only (~70%). AccountsDashboard has 3 dead buttons + unused `PaymentCalendar` import.
**Note:** Depends on `dailySummaries`, which is empty in production (see #30).
**Next:** Wire or remove dead executive actions; the queue should link to the real approval pages.

### 4. Projects — ✅ 95%
Full CRUD, company tabs, unassigned filter, delete-guarded by active WOs ([projectService.ts](../src/services/projectService.ts)). No validation on create/update (empty names allowed). Rendered as a Masters tab.

### 5. Contractors — ✅ 95%
Full CRUD + ledger link, delete-guarded by non-REJECTED WOs. No duplicate-name check (unlike customers/vendors). Masters tab.

### 6. Work Orders — 🟡 90%
**Implemented:** Full create/edit via `WorkOrderForm` (889 lines) with BOQ items, financials, GST/retention/advance; transactional number reservation; approve/reject; print/PDF; multi-company scoping; financial-reduction-below-billed guard ([workOrderService.ts:121-131](../src/services/workOrderService.ts#L121-L131)).
**Bugs / debt:** Delete has **no confirmation dialog** ([WorkOrders.tsx:451](../src/pages/WorkOrders.tsx#L451)), unlike every other page. WO ceiling uses net grandTotal while Bills use gross BOQ — see TECHNICAL_DEBT D-1. Delete doesn't check paymentRequests (orphans them). Print crashes on legacy WOs missing `financials` (no optional chaining, caught by ErrorBoundary).
**Next:** Add delete confirm; unify ceiling; guard paymentRequest orphans.

### 7. BOQ — 🟡 80%
Embedded in Work Orders (`boqItems[]`, [types.ts:401](../src/types.ts#L401)), rendered in form and print. No standalone BOQ module, no measurement linkage, no rate library. Adequate for current WO-costing use; not a full BOQ subsystem.

### 8. Variation Orders — 🟡 80%
**Implemented:** Create + approve/reject; approve updates WO financials; approved VOs locked from edit/delete.
**Critical bug:** Approval recomputes WO `grandTotal` with a formula that **omits advance and retention subtraction**, diverging from the WO form and inflating value after each VO — see TECHNICAL_DEBT D-2. **This is a correctness defect in a money path.**
**Missing:** No VO edit/delete UI (service methods exist but unused).

### 9. Billing / Partial Billing — 🟡 80%
**Implemented:** Multi-bill-per-WO partial billing; auto-derived previous-billed; TDS/retention/net auto-calc; 3-stage approval timeline; print. Overbilling guard on create (gross BOQ).
**Bugs:** `update` skips the overbilling re-check ([billService.ts:109-145](../src/services/billService.ts#L109-L145)) — a DRAFT bill's amount can be raised past the ceiling. Form doesn't require a WO be selected before submit. Delete has no confirmation. Bill numbers client-generated, unique per-WO only. Negative `netPayable` possible (no floor).
**Next:** Re-check ceiling on update; add validation + confirm.

### 10. Retention — 🟠 40%
Retention is computed and deducted per bill, and a planned retention sits on the WO. **There is no retention-payable ledger, no release flow, and no tracking of withheld money** — it simply vanishes from `netPayable`. "Retention Held" KPI shows the *planned* WO figure, not actual withheld ([ledgerUtils.ts:151](../src/lib/ledgerUtils.ts#L151)). See TECHNICAL_DEBT D-4. Functionally incomplete for real construction retention management.

### 11. Bill Approval Workflow — 🟡 85%
DRAFT→VERIFIED (PM)→APPROVED (CEO), enforced in rules, server, and client fallback. Strong status gating. Weakened in production by the client-fallback path skipping the server's cumulative check (see SECURITY_AUDIT C-1).

### 12. Payment Workflow (Bills→Payments) — 🟡 80%
PENDING→APPROVED (CEO)→RELEASED (Accounts), with partial/full bill status update on release. Overpayment guarded on create and release. **In production the release runs client-side** (secureApi fallback) and rules permit a direct RELEASED flip with no amount check — see SECURITY_AUDIT C-2. `paymentService.create` counts only RELEASED totals, so multiple pending payments can jointly oversubscribe.

### 13. Payment Requests (WO-based) — 🟡 90%
The newer, best-guarded outflow path. PM→CEO→Accounts lifecycle; forced advance amounts; duplicate-advance guard; reason discipline; cross-module ceiling that counts PAID requests + released bill-payments. Best `firestore.rules` block in the system. Coexists with the legacy Bills/Payments path — **two parallel payment systems** (see ARCHITECTURE_REVIEW §4). `StatBlock` ignores its icon prop (cosmetic).

### 14. Customers — ✅ 95%
Full CRUD, live duplicate detection on normalized (name, phone) per company, delete-guarded by unit ownership. **Gap:** delete doesn't check `sales.customerId` — a customer with a BOOKED sale can be deleted.

### 15. Plot / Unit Inventory (SubLocations) — ✅ 95%
Largest page (1259 lines). CRUD + bulk-add (range/list/paste with dedup preview) + admin drift-repair tools + manual-SOLD migration. Manual-SOLD blocked (Sales module is sole path to SOLD). **Gap:** delete doesn't check active sales (orphans Sale docs).

### 16. Sales / Booking — 🟡 90%
BOOKED→SOLD→POSSESSION_GIVEN / CANCELLED lifecycle; strict `finalSaleValue = agreementValue − discount` identity; atomic sale+unit batch; cancel reverts unit and ownership. **Gaps:** one-active-sale-per-unit check is non-transactional (concurrent double-book possible); cancel doesn't reverse receipts/schedules; no post-BOOKED price edit (Phase 2).

### 17. Sale Receipts + Schedules — 🟡 88%
Atomic receipt batches; FIFO auto-distribution; allocation back-compat; sticky waive/cancel; delete-blocked-if-paid on schedules. **Critical:** `totalReceived` and schedule `paidAmount` use read-then-write, not atomic increment — concurrent receipts lose money (TECHNICAL_DEBT D-6). Overpayment allowed by policy.

### 18. Customer Ledger — 🟡 85%
SALE/RECEIPT/CANCELLED transaction stream, per-unit breakdown, schedules. **No running balance column.** Cancelled sales keep their debit with no reversing entry (stream never ties to summary — acknowledged Phase-2). **Listener leak:** `customerService.getAll` unsubscribe discarded ([CustomerLedger.tsx:78](../src/pages/CustomerLedger.tsx#L78)).

### 19. Recovery Dashboard — 🟡 85%
Read-only SIPL recovery analytics; per-sale outstanding vs overpaid kept mutually exclusive; receipt trends. Self-labels "Phase 2A active, 2B pending." No interest/penalty accrual.

### 20. Contractor Ledger — 🟡 65% (weakest routed page)
**Implemented:** Derived ledger (bills credit, payments debit, adjustments), KPIs, project-summary tab.
**Dead:** "Export Ledger" and "Add Adjustment" buttons have no handlers ([ContractorLedger.tsx:169-176](../src/pages/ContractorLedger.tsx#L169-L176)); Documents tab is a pure placeholder. **Broken back-navigation** to nonexistent `/contractors` route → blank screen.
**Correctness:** DRAFT bills post to the ledger; advances counted in KPIs but dropped from ledger rows (can't reconcile); retention KPI shows planned not withheld. **Zero tests** for `ledgerUtils.ts`. See TECHNICAL_DEBT D-3.

### 21. Budget / Analytics Dashboard — ✅ 90%
Read-only analytics over derived financials. Functional; inherits the no-rounding concern of `financialCalcs.ts`.

### 22–24. Vendors / Materials / Stores / Vehicles Masters — 🟡 55-60%
Full master CRUD with validation (GSTIN/PAN/IFSC on vendors, registration normalization on vehicles, code/symbol uniqueness). **But these are masters with no transactions** — no purchase orders, no GRN, no stock ledger, no consumption. Delete guards are largely unimplemented ("extended in R3/R5/R6"). `vendorService.create` may write `undefined` optional fields (Firestore rejects — unverified runtime bug). This is the foundation of an unbuilt procurement module.

### 25. Number Series — ✅ 95%
The one place with a real Firestore transaction. Atomic increment, year rollover, admin config. Risk: admin can set `nextNumber` backwards (mitigated by random-tail collision handler).

### 26-27. Terms Templates / Work Categories — ✅ 95%
Solid CRUD with uniqueness. Work categories link to WOs by **name string** not id, so renaming orphans the delete-guard linkage ([workCategoryService.ts:90](../src/services/workCategoryService.ts#L90)).

### 28. Audit Trail — 🟡 60%
`db.logAction` writes to `auditLogs` throughout; append-only in rules. **But** entries are forgeable (any auth user can write arbitrary `userId`/`action`, [firestore.rules:350](../firestore.rules#L350)), the server-side audit path never runs in production, and there is **no UI to read the log**. Write-only from the app's perspective.

### 29-30. Alerts / Daily Summaries — 🟠 40%
Both are written only by the Express node-cron background jobs, which **never run in production** (backend not deployed). AlertBell and Dashboard read them, so in the deployed app they are permanently empty. In-app only — no push/email/FCM.

### 31. Version History — ✅ 95%
Manual deployment log to `appVersions`, append-only. Version constants in sync (0.9.0). Honest design (relies on admin clicking "Log Deployment").

### 32-44. Finance engine, Procurement transactions, Inventory, Measurements, Documents, Assets, Timeline, Reports — 🔴 0-5%
**None of these exist as code.** Verified by repo-wide search:
- No voucher/journal/chartOfAccounts/trialBalance/cashbook/bankbook code (only two cosmetic string hits). Accounting is **derived reporting** — see ARCHITECTURE_REVIEW §5.
- No purchaseOrder / GRN / requisition / stock-ledger / transfer / consumption code anywhere.
- No measurement-book module (only UOM masters).
- Firebase Storage is initialized ([firebase.ts:37](../src/lib/firebase.ts#L37)) but **never used** — no document/asset upload anywhere.
- No activity-timeline feature.
- "Reports" = the read-only dashboards; no formal/exportable report engine.
- `SaleAdjustment` (refund/penalty/write-off) is a reserved type with no service, collection writer, or UI.

These are the genuine greenfield areas. The blueprint and role set (PURCHASE_MANAGER, STORE_MANAGER, STORE_KEEPER) anticipate them, but only the master-data foundation (module 22-24) has been laid.
