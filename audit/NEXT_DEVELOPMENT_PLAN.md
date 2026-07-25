# NEXT DEVELOPMENT PLAN — DSBC Civil (formerly SIPL Work Orders)

**This is the roadmap of record.** It continues from the current implementation — **no rewrite, no rebuild**. Every item references the concrete code and the audit finding it resolves. Ordering is by dependency and risk: stabilize the money paths and the production trust model first, then unlock scale, then build the greenfield modules.

**Legend:** Priority P0-P3 · Business Value H/M/L · Technical Risk H/M/L · Effort S/M/L/XL (S ≤ ½ day, M ≤ 2 d, L ≤ 1 wk, XL > 1 wk).

**How to read the sequence:** R1 is the keystone — most CRITICAL/HIGH security and correctness findings resolve through it. R2-R5 harden financial correctness. R6-R7 unlock scale and integrity. R8 is cleanup that should run continuously. R9-R12 are the unbuilt commercial modules, gated on the foundation being sound.

---

## PHASE 1 — Make production trustworthy (do first, in order)

### R1 · Make one enforcement path authoritative in production
**Priority P0 · Value H · Risk H · Effort L-XL · Resolves: SECURITY C-1/C-2/C-3/H-1/H-4, TECHNICAL_DEBT D-0**
Deploy the four privileged operations (`verify`, `approve`, `release`, VO-approve) as **Firebase Cloud Functions (callable)** — the design already exists in `CLOUD_FUNCTIONS_PLAN.md` and the logic already exists in [server/secureRoutes.ts](../server/secureRoutes.ts). Point `secureApi.ts` at the callable functions and **remove the silent client fallback** (or gate it behind an explicit `import.meta.env.DEV` flag for local dev only). Then tighten `firestore.rules` so clients can no longer flip payment→RELEASED, bill→PAID, or WO financials directly ([firestore.rules:253-259,299-301,208-209](../firestore.rules#L253)) — those transitions become function-only.
**Dependencies:** none (keystone). **Acceptance:** a direct client SDK write attempting an over-payable release or an unlinked bill-PAID flip is rejected by rules; the happy path works through the function.
**Note:** also migrate the two node-cron jobs to **Cloud Scheduler → function** so alerts/daily summaries actually run in production (fixes SECURITY L-2, MODULE #29-30). Gate the `/api/admin/*` triggers behind auth first (SECURITY H-2).

### R2 · Single source of truth for business math
**Priority P0 · Value H · Risk M · Effort M · Resolves: TECHNICAL_DEBT D-1, D-2**
Extract three shared pure functions used by UI, functions, and tests:
- `computeWorkOrderFinancials(inputs)` — the one true grandTotal formula (fixes the VO-approval divergence [secureRoutes.ts:220-234](../server/secureRoutes.ts#L220) vs [WorkOrderForm.tsx:215-218]).
- `outflowCeiling(wo)` — one authoritative overbilling limit (resolve gross-BOQ vs net-grandTotal; recommend gross BOQ for work-done tracked separately from the payment ceiling).
- Reuse existing `recalculateBillTotals`.
Add unit tests pinning the formulas. **Dependencies:** none; do alongside R1. **Acceptance:** approving a VO then billing the WO uses identical figures everywhere; a bill valid at create cannot be blocked at approve for ceiling reasons.

### R3 · Make money mutations atomic
**Priority P0 · Value H · Risk M · Effort M-L · Resolves: TECHNICAL_DEBT D-6, D-8**
Wrap receipt/schedule/payment mutations in `runTransaction`; use `FieldValue.increment` for `sales.totalReceived` and `saleSchedules.paidAmount` ([saleReceiptService.ts:138,213](../src/services/saleReceiptService.ts#L138)). Count PENDING/APPROVED payments against the ceiling, not just RELEASED ([paymentService.ts:19-26](../src/services/paymentService.ts#L19)). Once R1 lands, the release/approve transactions live in functions (already transactional server-side) — this item covers the receipt/schedule paths that stay client-or-function side. **Acceptance:** two concurrent receipts on one sale never lose money.

---

## PHASE 2 — Financial correctness & integrity

### R4 · Fix the Contractor Ledger and wire adjustments
**Priority P1 · Value H · Risk M · Effort M · Resolves: TECHNICAL_DEBT D-3, D-5, G-4(part)**
In [ledgerUtils.ts](../src/lib/ledgerUtils.ts): decide the advance representation so the ledger reconciles with its KPIs; exclude (or mark provisional) DRAFT bills; handle rejected-WO payments symmetrically; base "Retention Held" on actual withheld, not planned. Add `ledgerUtils.test.ts` (currently zero tests). Build the "Add Adjustment" UI so `adjustmentService.create` has a caller (or remove the dependent KPI). **Acceptance:** ledger header totals equal the sum of ledger rows; a new adjustment appears in the ledger.

### R5 · Retention & liability tracking — and the accounting decision
**Priority P1 · Value H · Risk H · Effort L-XL · Resolves: TECHNICAL_DEBT D-4, ARCHITECTURE_REVIEW §5**
First, a **business decision**: keep derived reporting (and market it honestly as MIS) **or** build a real posting engine. If building:
- Model retention and TDS as tracked liabilities with explicit release transactions.
- Add a chart of accounts and immutable, balanced journal/voucher documents.
- Implement a posting engine as a Firestore-trigger function on the existing state transitions (bill approved, payment released, receipt, sale, VO).
- Add company segmentation (`companyId` on Bill/Payment/Adjustment), opening balances, period close.
This bolts onto the current state machine without disturbing the operational model. **Dependencies:** R1-R3 (need trustworthy transitions before posting on them). **Acceptance:** a trial balance that ties; retention withheld is later releasable.

### R6 · Referential integrity on delete
**Priority P1 · Value M · Risk L · Effort M · Resolves: TECHNICAL_DEBT D-9, D-7**
Add missing delete guards: sublocation↔active sale, customer↔sale, WO↔paymentRequests, terms/material/store/vehicle/vendor reference checks. Re-run the overbilling ceiling on bill `update`. Add reconcile/repair tooling for cached totals (reuse the project-companyId-backfill pattern). **Acceptance:** deleting a parent with live children is blocked with a precise error.

---

## PHASE 3 — Scale & platform hygiene

### R7 · Shared data layer + pagination + indexes
**Priority P1 · Value M · Risk M · Effort L · Resolves: PERFORMANCE §1-2-5**
Introduce a shared subscription/cache layer (React Query or a memoized-subscription context) so each collection has one listener. Add server-side company scoping + `orderBy`/`limit`/cursor pagination on high-cardinality collections (bills, payments, sales, saleReceipts, subLocations, auditLogs). Commit `firestore.indexes.json`. Move roles to **custom claims** (removes rule `get()`s, closes the forgeable-role surface, SECURITY M-1/H-3). **Acceptance:** dashboard opens with a handful of scoped, paginated queries instead of ~10 full-collection listeners.

### R8 · Continuous cleanup (run in parallel throughout)
**Priority P2 · Value M · Risk L · Effort M (spread) · Resolves: TECHNICAL_DEBT G-1,G-2,G-4..G-21, SECURITY M-4/L-4**
Batch of low-risk fixes, each S: add a `*` 404 route + fix the `/contractors` link (G-1); fix the CustomerLedger listener leak (G-2, do early — it's a leak); wire or remove the 15 dead buttons (G-4); add delete confirms (G-5); standardize rounding (G-6); dedupe the copy-pasted logic and the 7 master pages into one generic component (G-8); replace misused error codes (G-10); remove dead code, PII logging, unused imports (G-11/G-13); add ESLint + CI (G-20); delete/replace the misleading README, blueprint, and metadata (G-21). Restrict `users` read exposure (SECURITY M-4). **Acceptance:** no dead controls, no leak, CI green, docs reflect reality.

---

## PHASE 4 — Greenfield commercial modules (gated on Phases 1-2)

These do not exist in code today (MODULE_AUDIT #32-44). The master-data foundation for procurement (vendors, materials, UOMs, stores, vehicles) **is** built; the transactional layers are not. Build only after the money core is trustworthy.

### R9 · Procurement transactions (Purchase Requests → Purchase Orders → GRN)
**Priority P2 · Value H · Risk M · Effort XL**
The R2 masters and the PURCHASE_MANAGER role already anticipate this (service comments say "extended in R3 when Purchase Orders reference vendors"). Build requisition → PO → goods-receipt, reusing the existing approval-workflow and number-series patterns. **Dependencies:** R1 (functions), R6 (delete guards on masters).

### R10 · Inventory / Stock Ledger / Inter-Store Transfer / Material Consumption
**Priority P2 · Value H · Risk H · Effort XL**
Stock ledger per store/material, transfers, consumption against work orders. **Dependencies:** R9 (GRN feeds stock), R5 (if consumption must post to accounts).

### R11 · Sale Adjustments, refunds & recovery Phase 2B
**Priority P2 · Value M · Risk M · Effort L**
The `SaleAdjustment` type is reserved but unbuilt; cancelled-sale receipts are currently neither refunded nor reversed. Build the adjustment/refund workflow the Recovery and Customer Ledger pages already reference as "future phase." **Dependencies:** R3, R5.

### R12 · Document management, formal reports, activity timeline
**Priority P3 · Value M · Risk L · Effort L-XL**
Firebase Storage is initialized but unused — build document upload/attachment (needs `storage.rules`, currently absent). Add an exportable report engine (beyond dashboards) and an activity timeline over the audit log (which needs a read UI — it's write-only today). **Dependencies:** R7 (audit-log read/pagination), R1 (trusted audit writes).

---

## Sequencing summary

```
R1 ─┬─► R2 ─► R4 ─► R5 ─────────────► R9 ─► R10 ─► R11
    ├─► R3 ─────────► R6                      │
    └─► (rules hardening)                     │
R7  ── independent, after R1 ──────────► R12 ◄┘
R8  ── continuous, throughout ──────────────────►
```

**The gate:** Phase 1 (R1-R3) is what turns this from "works for one trusted operator" into "safe for real commercial deployment." Do not build Phase 4 modules on top of an unenforced money core — every new financial feature would inherit the same production bypass. Everything after Phase 1 is normal forward development on a genuinely solid foundation.

---

## Effort roll-up (rough)
| Phase | Items | Aggregate effort |
|---|---|---|
| 1 — Trust & correctness | R1-R3 | ~2-4 weeks |
| 2 — Financial integrity | R4-R6 | ~2-5 weeks (R5 dominates if posting engine chosen) |
| 3 — Scale & hygiene | R7-R8 | ~2-3 weeks (R8 spread) |
| 4 — Commercial modules | R9-R12 | months, staged |

A new architect can pick up R1 today with no further context: the server code to deploy is in [server/secureRoutes.ts](../server/secureRoutes.ts), the fallback to remove is in [secureApi.ts](../src/services/secureApi.ts), and the rules to tighten are the payment/bill/WO transitions in [firestore.rules](../firestore.rules).
