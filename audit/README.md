# DSBC Civil (formerly SIPL Work Orders) — Forensic Audit (Baseline)

**Date:** 2026-07-07 · **Codebase version:** 0.9.0 (`v0.9-test-deployment`)

> ## ⚠️ HISTORICAL RECORD — read this first
>
> **This folder is a frozen snapshot of v0.9.0, dated 2026-07-07. It is deliberately NOT
> updated as the code moves.** Its *findings and reasoning* remain the accepted baseline
> and the roadmap of record; its *inventory figures* are as-of that date and some have
> since changed. Do not "fix" the numbers here — correct the living documents instead
> (NN-21/NN-22). For current state, read
> [`docs/PROGRAM_STATE.md`](../docs/PROGRAM_STATE.md) and
> [`BASELINE_v1.0.0-beta.1.md`](../BASELINE_v1.0.0-beta.1.md).
>
> ### Superseded inventory figures (verified 2026-07-29 @ v1.0.0-beta.1)
>
> | Stated in this folder | Current source truth | Where changed |
> |---|---|---|
> | 194 passing tests across 8 files | **199 across 9 files** | `financialCalculationService.test.ts` added by Platform Stabilization v1.1 |
> | `firestore.rules` is 614 lines | **606 lines** | Money transitions removed from client-writable branches (v1.1) |
> | "there is no `functions/` directory" (EXECUTIVE_SUMMARY §3) | **`functions/` exists and is wired** in `firebase.json` — still **not deployed** | `functions/index.ts` + `server/app.ts` added by v1.1 |
> | "the client silently falls back to direct Firestore writes" | **`secureApi` now fails loud**; the fallback is gated behind `VITE_ALLOW_CLIENT_FALLBACK` (default `false`) | `src/services/secureApi.ts` (v1.1) |
> | Rules permit payment→RELEASED / bill→PAID (C-2/C-3 evidence) | **Those branches no longer exist** — the transitions are Admin-SDK-only | `firestore.rules` (v1.1) |
>
> **The underlying CRITICAL finding still stands:** the authoritative backend is written
> and wired but **not deployed**, so the four privileged operations do not execute in a
> production deployment. C-1 is not closed — it is one `firebase deploy` away, blocked on
> project provisioning. See
> [`DEPLOYMENT_READINESS_REPORT.md`](../DEPLOYMENT_READINESS_REPORT.md).

This folder is the definitive, source-verified baseline for future development. It was produced by reading the code, not the documentation. Where the two disagreed, the code won. No application code was modified during the audit.

## Documents
1. **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** — project health, maturity, production readiness, top risks & strengths. Start here.
2. **[MODULE_AUDIT.md](MODULE_AUDIT.md)** — every module with status (✅/🟡/🟠/🔴) and completion %.
3. **[TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)** — prioritized debt register (P0-P3) with effort estimates.
4. **[SECURITY_AUDIT.md](SECURITY_AUDIT.md)** — findings by severity (CRITICAL→LOW) with recommendations.
5. **[PERFORMANCE_AUDIT.md](PERFORMANCE_AUDIT.md)** — scale ceiling and optimization roadmap.
6. **[ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md)** — current architecture, strengths/weaknesses, the accounting verdict, recommended evolution.
7. **[NEXT_DEVELOPMENT_PLAN.md](NEXT_DEVELOPMENT_PLAN.md)** — the roadmap of record. Ordered, dependency-aware, continues from current code.

## The three things every future contributor must know
1. **In production there is no server in the request path.** The Express "secure" backend exists in the repo but `firebase.json` never deploys it; the client silently falls back to direct Firestore writes. `firestore.rules` is the entire production security/integrity boundary. (SECURITY C-1)
2. **Accounting is derived reporting, not double-entry.** No vouchers, journal, chart of accounts, or posting engine exist in code. Ledgers are computed on render. The system is not trial-balance ready. (ARCHITECTURE §5)
3. **Business math is duplicated across layers and has drifted** — most importantly the overbilling ceiling and the variation-order financial formula. Unify before extending. (TECHNICAL_DEBT D-1, D-2)

## Verification note
Findings were produced by parallel specialist passes (backend/security, services, UI, accounting, docs/deployment) and cross-checked against firsthand reads of the load-bearing files ([firestore.rules](../firestore.rules), [App.tsx](../src/App.tsx), [secureApi.ts](../src/services/secureApi.ts), [secureRoutes.ts](../server/secureRoutes.ts)). The test suite (194 tests, 8 files) passes. The repository has no git history (not a git repo), so provenance could not be examined; all findings are from a static snapshot.
