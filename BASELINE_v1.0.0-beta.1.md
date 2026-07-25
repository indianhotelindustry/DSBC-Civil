# BASELINE — DSBC Civil v1.0.0-beta.1

**Date:** 2026-07-09 · **Tag (planned):** `v1.0.0-beta.1` · **Validation:** `tsc --noEmit` clean · 199/199 Vitest tests · production build green

This is the state of the platform at its first commercial baseline. It condenses the source-verified forensic audit ([`audit/`](./audit/README.md), anchored to the same codebase) — consult [`audit/MODULE_AUDIT.md`](./audit/MODULE_AUDIT.md) for per-module evidence. Completion percentages are the audit's engineering estimates.

## Completed modules (✅ ≥ 90–95%)

Projects · Contractors · Customers · Plot/Unit Inventory (SubLocations) · Number Series · Terms Templates · Work Categories · Budget/Analytics Dashboard · Version History

## Partially completed modules (🟡)

| Module | ~ | Main gap |
|---|---|---|
| Work Orders (embedded BOQ, financials, approvals, print) | 90% | BOQ edit ergonomics; approval edge cases |
| Payment Requests (WO-based) | 90% | — minor |
| Sales / Booking | 90% | lifecycle edge cases |
| Sale Receipts + FIFO Schedules | 88% | atomicity moves server-side in v1.1 |
| Authentication | 85% | custom claims not yet used (rules read `users/{uid}`) |
| Bill Approval Workflow | 85% | server-authoritative approve pending (v1.1) |
| Customer Ledger · Recovery Dashboard | 85% | — minor |
| RBAC / Role Management | 80% | boundary-enforced company scoping pending |
| Billing / Partial Billing | 80% | overbilling guard unified in v1.1 |
| Variation Orders · BOQ | 80% | VO approval is server-authoritative (deployed backend pending) |
| Payment Workflow | 80% | release is server-authoritative (same) |
| Dashboard (CEO/Accounts routers) | 75% | CEO dashboard has display-only actions |
| Contractor Ledger | 65% | `ledgerUtils` untested/mixed concerns |
| Vendor / Material / Stores / Vehicles | 55–60% | **masters only** — no transactions |
| Audit Trail | 60% | append-only but coverage gaps |
| Retention · Alerts · Daily Summaries | 40% | liability lifecycle / server generation pending |

## Not built (🔴 0–5%) — deliberately deferred

Voucher engine · Journal / double-entry posting · Cash/Bank book · Purchase Requests/Orders/GRN · Inventory transactions & stock ledger · Inter-store transfer · Material consumption · Measurement book · Document management · Asset management · Activity timeline · Formal reports · Sale adjustments (type reserved)

## Known limitations (honest status)

1. **Derived financial reporting, not double-entry accounting.** The posting engine is designed (Constitution §10) but not built. No accounting claim is made until it ships (NN-7).
2. **The authoritative backend is not yet deployed.** `server/` runs only under `npm run dev`; `functions/` exists but is not live. Until Phase 2/3 completes, financially-material server routes are absent in production and `secureApi` fail-loud behavior governs (`VITE_ALLOW_CLIENT_FALLBACK=false`).
3. **Company/project scoping is client-side after a full read.** `firestore.rules` grants collection-wide reads to authenticated users; PM scoping is UI-enforced (Constitution §23 charters the boundary-enforced fix).
4. **Unscoped, unpaginated queries** — acceptable at current data volume; chartered for RC hardening (P1.5).
5. **Single-operator trust model today.** Safe for a trusted operator; hardening to untrusted multi-tenant commercial deployment is precisely the roadmap.
6. **No visual brand assets** — favicon/logo/manifest do not exist yet (never did).

## Deferred work

- All 🔴 modules above (chartered in [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md) P0.6–P2.1).
- App Check, Analytics initialization (config surface ready; see [`docs/FIREBASE_MIGRATION.md`](./docs/FIREBASE_MIGRATION.md) §7).
- ESLint configuration (CI step stubbed, COD-2) and `tests/rules` emulator suite (NN-29/TEST-3).
- Legacy-data migration from the retired Firebase project (optional; migration doc §8).

## Open engineering items (v1.1 sprint — [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md))

Deploy `functions/` · remove client fallback · tighten money-transition rules · single FinancialCalculationService (divergent-math closure, TECH-DEBT D-1/D-2) · atomic money mutations · posting-engine foundation. Security closures tracked as SECURITY C-1/C-2/C-3/H-1/H-4.

## Current production readiness

**Beta.** Ready for: new GitHub repository, new Firebase project, and a first commercial **beta** deployment operated by trusted users. Not yet ready for: untrusted multi-tenant production (blocked on Phase 2/3 enforcement spine + Phase 8 hardening). Score at rebranding: **7/10 for commercial beta** ([`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md)).
