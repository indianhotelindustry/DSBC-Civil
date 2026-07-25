# ENGINEERING PHASE 2 — The Official Engineering Roadmap

> **Status:** ACTIVE (opened 2026-07-08) · **Supersedes ad hoc planning** · **Governed by** the Constitution ([`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md)) and [`AMENDMENT-001`](./governance/amendments/AMENDMENT-001.md).
>
> This is the ordered engineering roadmap for DSBC following the freeze of Governance Phase 1. It continues from the current implementation — **no redesign, no rewrite** — and is fully aligned with [`audit/NEXT_DEVELOPMENT_PLAN.md`](./audit/NEXT_DEVELOPMENT_PLAN.md), which it operationalizes into sprints. The active sprint is always [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md).

---

## Guiding rule

Every item below is a **continuation of an existing seam**. Where a component already exists (the Express secure backend, the derive-on-read calc core, the master-data foundation), Phase 2 *deploys, unifies, hardens, or extends* it. Nothing here authorizes replacing the domain model, the UI framework, or the rules. Each governed item requires an ADR (Amendment Article VII) before work starts, and each PR passes the merge gate ([`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md)).

---

## P0 — The enforcement & accounting spine (Platform Stabilization v1.1 → Accounting Core v1.2)

These are non-negotiable prerequisites for a commercially deployable platform. Until they land, DSBC is "safe for a single trusted operator only."

### P0.1 — Deploy the secure backend
Deploy the four privileged operations (`verifyBill`, `approveBill`, `releasePayment`, `approveVariationOrder`) as **Firebase Cloud Functions**, reusing the transactional bodies already written in [`server/secureRoutes.ts`](./server/secureRoutes.ts). Migrate the node-cron jobs to Cloud Scheduler so alerts/summaries run in production.
- **Continues:** `server/`, `docs/CLOUD_FUNCTIONS_PLAN.md`. **Closes:** SECURITY C-1. **Risk:** H (deploy topology, credentials). **Deps:** staging Firebase project; Admin SDK/ADC setup. **ADR:** required (deploy topology).

### P0.2 — Remove the `secureApi` fallback
Invert [`src/services/secureApi.ts`](./src/services/secureApi.ts) from silent-degrade to **fail-loud**; keep client fallbacks only behind an `import.meta.env.DEV` guard. Production must contain no path that performs a money transition without the authoritative check.
- **Closes:** SECURITY C-1/C-2/C-3. **Risk:** M (cutover window). **Deps:** P0.1 live. **Guard:** feature-flag the cutover (NN-27).

### P0.3 — Cloud Functions authoritative + rules tightened
Make the functions the sole path for money transitions; tighten [`firestore.rules`](./firestore.rules) so payment→RELEASED, bill→PAID, and WO-financial-rewrite are function-only, and add `onlyFieldsChanged` to the unscoped VO-approval branch.
- **Closes:** SECURITY C-2/C-3/H-4. **Risk:** M. **Deps:** P0.1. **Test:** rules-unit-tests proving deny (NN-29 style).

### P0.4 — FinancialCalculationService (single source of truth)
Extract the canonical money math into pure `src/lib/` modules — `computeWorkOrderFinancials`, `outflowCeiling`, `recalculateBillTotals` — imported by the UI, the functions, and tests. Resolve the gross-vs-net ceiling to one definition; fix the VO-approval formula divergence.
- **Continues:** [`src/lib/financialCalcs.ts`](./src/lib/financialCalcs.ts). **Closes:** TECH-DEBT D-1/D-2. **Risk:** M (behavior shift on deductions). **Test:** pin form == function.

### P0.5 — Atomic money mutations
Convert receipt/schedule/payment totals to `runTransaction`/`FieldValue.increment`; count pending payments against the ceiling.
- **Continues:** [`src/services/saleReceiptService.ts`](./src/services/saleReceiptService.ts), `paymentService`. **Closes:** TECH-DEBT D-6/D-8. **Risk:** M. **Test:** concurrent-receipt "no lost money."

### P0.6 — Financial Posting Engine
Add a chart of accounts (`accounts`), an immutable `journalEntries` collection, and posting functions that emit balanced entries on each financial transition, reconciled against the existing derived ledgers (Tier-2 as checksum).
- **Continues:** Constitution §10 (designed). **Closes:** ARCHITECTURE §5. **Risk:** H (new subsystem). **Deps:** P0.1–P0.4; accountant sign-off on the posting map. **ADR:** required.

### P0.7 — Accounting Core foundation (retention & TDS liabilities)
Model retention and TDS as tracked liabilities with explicit, guarded release transitions; base "Retention Held" on actual withheld.
- **Continues:** Constitution §9 FIN-4. **Closes:** TECH-DEBT D-4. **Risk:** M. **Deps:** P0.6.

**P0 exit → the platform is enforceable and books are real (trial-balance ready).**

---

## P1 — Complete the construction vertical (Construction ERP Beta → RC)

### P1.1 — Inventory posting & stock ledger
Stock ledger per store/material; consumption against work orders; posting on movements.
- **Continues:** master-data foundation (`materials`, `stores`). **New:** transactional inventory. **Deps:** P0.6 (posting).

### P1.2 — Purchase engine (Purchase Requests → Purchase Orders → GRN)
Requisition → PO → goods-receipt, reusing the approval-workflow and number-series patterns; GRN feeds inventory.
- **Continues:** vendor/material masters (the R2 foundation, anticipated in service comments). **Deps:** P1.1.

### P1.3 — CRM completion
Sale adjustments/refunds (the reserved `SaleAdjustment` type), recovery Phase 2B, cancelled-sale receipt reversal; fix the customer-ledger listener leak and add the missing delete guards.
- **Continues:** Sales module. **Closes:** TECH-DEBT D-9, G-2. **Deps:** P0.5.

### P1.4 — Platform hardening (parallel to P1)
Referential-integrity delete guards; contractor-ledger fixes + tests; unified rounding; dead-control/dead-code cleanup; ESLint + CI; the 404 route.
- **Closes:** TECH-DEBT D-3, D-9, G-1…G-21. **Continuous** throughout P1.

### P1.5 — Performance & scale
Shared data layer (dedupe the ~10 dashboard listeners); server-side company-scoped, paginated queries on high-cardinality collections; committed `firestore.indexes.json`; custom-claims role migration.
- **Continues:** the subscription model. **Closes:** PERFORMANCE §1-2-5, SECURITY M-1. **Deps:** indexes before scoped queries.

---

## P2 — Intelligence, reporting, and new verticals (RC → v1.0 and beyond)

### P2.1 — Reporting engine
Exportable, formal reports over the posting engine and operational data (beyond dashboards): trial balance, statements, statutory (GST/TDS) reports, project P&L. **Deps:** P0.6.

### P2.2 — CEO Intelligence
Wire the CEO executive dashboard's currently-dead actions into real approve/report/drill capabilities; risk and exposure analytics over real books. **Continues:** `CEODashboard`. **Closes:** UI dead-control findings.

### P2.3 — AI Layer
Product-AI as **advisory only** (Constitution §22): anomaly flagging, natural-language search over scoped data, draft narratives, approval-queue summaries. Never an authoritative financial actor; scope- and audit-respecting. **Deps:** P0 (trustworthy data), P1.5 (custom claims for scoped retrieval).

### P2.4 — New verticals (Hospitality, Manufacturing)
Delivered as **config packs over the unchanged core** (Constitution §24). Hospitality first (partially modelled already), then Manufacturing (reuses procurement/inventory). **Never forks.**

---

## Priority summary

| Priority | Theme | Milestone |
|---|---|---|
| **P0** | Enforcement spine + real accounting | v1.1 Stabilization → v1.2 Accounting Core |
| **P1** | Complete construction vertical + scale | v1.3 Beta → v1.4 RC |
| **P2** | Reporting, intelligence, AI, new verticals | v1.5 v1.0 → v1.6/v1.7 |

## The line that must not be crossed

Do not build P1 or P2 features on top of an unenforced money core. Every financial feature added before P0 is complete inherits the same production bypass. **P0 first — always.** This is the direct instruction of the audit's `NEXT_DEVELOPMENT_PLAN.md` and the Constitution's North-Star metric (§1.4).

---

*This roadmap is a living engineering document, updated as sprints complete. It does not override the Constitution; where they touch, the Constitution governs. Material changes to this roadmap's priority order require an ADR.*
