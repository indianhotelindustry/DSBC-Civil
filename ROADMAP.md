# ROADMAP — DSBC Civil

High-level engineering roadmap. This summarizes — and defers to — the governed planning documents: [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md) (the official roadmap), [`RELEASES.md`](./RELEASES.md) (milestone timeline), and [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md) (active work). Where they disagree, those documents win.

| Phase | Scope | Status | Maps to |
|---|---|---|---|
| **1 — Commercial Rebranding** | SIPL Work Orders → DSBC Civil; repository & Firebase identity externalized; v1.0.0-beta.1 baseline | ✅ **Done** (2026-07-09) | [`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md) |
| **2 — Platform Stabilization** | Deploy the authoritative backend, remove the `secureApi` client fallback, tighten money-transition rules, single FinancialCalculationService, atomic money mutations | ▶ In progress | v1.1 · [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md), P0.1–P0.5 |
| **3 — Cloud Functions** | `functions/` (package `dsbc-functions`) live in production as the only privileged compute path; Express dev harness demoted to local-dev-only | ▶ Part of Stabilization exit criteria | P0.1–P0.3 |
| **4 — Financial Posting Engine** | Chart of accounts, immutable `journalEntries`, posting on every financial transition, retention/TDS liability lifecycle, reconciliation | ⏳ Planned | v1.2 “Accounting Core” · P0.6–P0.7 |
| **5 — Inventory Engine** | Inventory transactions, stock ledger, inter-store transfer, material consumption (masters already exist) | ⏳ Planned | v1.3-beta · P1.1 |
| **6 — Procurement** | Purchase Requests → Purchase Orders → GRN, vendor workflow on the existing procurement masters | ⏳ Planned | v1.3-beta · P1.2 |
| **7 — Reports** | Formal reporting engine beyond dashboards (statements, registers, exports) | ⏳ Planned | v1.4-rc → v1.5 · P2.1 |
| **8 — Production Release** | Hardening, performance (scoped queries + pagination), security closure (custom claims, boundary-enforced scoping), e2e coverage → first production-grade multi-tenant release | ⏳ Planned | v1.5 “Construction ERP v1.0” · P1.4–P1.5 |

Beyond Phase 8: Hospitality and Manufacturing verticals as config packs over the unchanged core (Constitution §24; `RELEASES.md` v1.6/v1.7).

> **The line that must not be crossed** (from `ENGINEERING_PHASE_2.md`): no feature phase may ship ahead of the enforcement/accounting spine it depends on.
