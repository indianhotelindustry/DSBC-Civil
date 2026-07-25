# DSBC Civil (formerly SIPL Work Orders) — Forensic Audit (Baseline)

**Date:** 2026-07-07 · **Codebase version:** 0.9.0 (`v0.9-test-deployment`)

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
