# EXECUTIVE SUMMARY — DSBC Civil (formerly SIPL Work Orders) Forensic Audit

**Audit date:** 2026-07-07
**Codebase version:** 0.9.0 (self-labelled build `v0.9-test-deployment`)
**Method:** Source-only forensic verification. Every claim below is backed by file:line evidence in the companion documents. Where documentation and implementation disagreed, implementation was treated as truth. No code was modified.
**Snapshot caveat:** The folder is not a git repository (no `.git`), so no history, authorship, or commit dates could be examined. Findings reflect a static snapshot only. Runtime behaviour (live Firestore project, deployed hosting) was not exercised — conclusions about production are inferred from configuration files.

---

## 1. What this project actually is

A **real, working, multi-role Construction/Real-Estate ERP** built as a React 19 + TypeScript single-page app on Firebase/Firestore, with an Express "secure" backend for privileged operations. It is substantially more real than its own documentation suggests. Verified inventory:

- **28 page components**, 15 routes + login, all role-gated; 13 master pages hosted as tabs.
- **30 client services** across ~28 Firestore collections.
- **8 user roles** with a genuine multi-stage approval workflow (Work Orders, Bills, Payments, Variation Orders, Payment Requests).
- **A functional Sales/CRM module** (units/plots, bookings, receipts, installment schedules, auto-distribution, customer ledgers, recovery dashboard).
- **194 passing unit tests** across 8 files (financial calcs, schedules, access control, master validations).
- **A sophisticated `firestore.rules`** (614 lines, ~30 collections) enforcing per-collection role access and status state-machines with field-level diff guards.

This is **not** a prototype in the "throwaway demo" sense. The core construction and sales workflows are wired end-to-end and used realistically.

---

## 2. Overall project health: **🟡 Functional but not production-safe**

The application *works* for a trusted single-operator/small-team setting. It is **not safe for untrusted multi-tenant commercial deployment** in its current state because of a fundamental architecture/deployment gap and several money-path integrity defects.

### Current maturity by layer
| Layer | Maturity | Note |
|---|---|---|
| UI / pages | 🟡 85% | Rich, consistent, mobile-aware; ~15 dead buttons, 1 broken link, 1 leak |
| Client services | 🟡 80% | Comprehensive; validation is client-side and race-prone |
| Firestore rules | 🟡 75% | Strong role/status gating; cannot enforce cross-document financial invariants |
| Express secure backend | 🟠 code-complete but **not deployed** | Correctly written; unreachable in production |
| Accounting | 🟠 derived reporting only | No vouchers/journal/double-entry exist |
| Documentation | 🔴 misleading | README is unrelated boilerplate; blueprint is 2 generations stale |
| Deployment / DevOps | 🔴 incomplete | No CI, no functions deploy, no indexes, no backend host |

---

## 3. The single most important finding

**The "server-authoritative" security layer does not run in production.**

`firebase.json` deploys only static hosting (`dist/`) and Firestore rules — there is no `functions/` directory, no Cloud Run, no App Hosting, and no deploy script that ships `server.ts`. The Express secure API therefore exists only on a developer's laptop under `npm run dev`.

The client is explicitly designed to cope with this: [secureApi.ts:57-96](../src/services/secureApi.ts#L57-L96) detects the non-JSON SPA response, flips to `client-fallback` mode, and silently re-runs each privileged operation as a **direct client-side Firestore write** ([secureApi.ts:216-238](../src/services/secureApi.ts#L216-L238)). In production, all transaction-safe cross-document validation (overbilling ceilings, cumulative-payment checks, atomic bill/payment updates) collapses to whatever `firestore.rules` alone can enforce — and by design the rules cannot cross-query collections to check sums.

**Consequence:** a user with the ACCOUNTS role (or anyone who obtains it) can, via direct Firestore writes the rules permit:
- release payments that exceed the bill's payable amount (rules only check `onlyFieldsChanged(['status'])`, [firestore.rules:299-301](../firestore.rules#L299-L301));
- mark bills PAID with no linked payment ([firestore.rules:253-259](../firestore.rules#L253-L259));
- set arbitrary financial amounts on DRAFT bills ([firestore.rules:242](../firestore.rules#L242)).

Additionally, background alerting and daily summaries (node-cron in the Express process) **never run in production**, so the `alerts` and `dailySummaries` collections stay permanently empty for deployed users.

---

## 4. Major risks (ranked)

1. **CRITICAL — Financial invariants unenforced in production.** The money-movement guarantees advertised in `CLOUD_FUNCTIONS_PLAN.md` live only in undeployed server code and skippable client fallbacks. See SECURITY_AUDIT C-1/C-2/C-3.
2. **CRITICAL — No real accounting.** There is no voucher, journal, chart of accounts, or double-entry posting anywhere in the codebase. All ledgers are transient view-models recomputed on render. The system is not trial-balance ready and cannot produce audited financial statements. See ARCHITECTURE_REVIEW §5.
3. **HIGH — Inconsistent overbilling ceilings.** Client bill-create checks against gross BOQ value; server bill-approve checks against net grandTotal; work-order edit checks against net; the Bills module and PaymentRequests module don't count each other's outflow. Different limits fire on the same work order. See TECHNICAL_DEBT D-1.
4. **HIGH — Variation-order approval corrupts work-order financials.** The VO-approval math ([secureRoutes.ts:220-234](../server/secureRoutes.ts#L220-L234) and its client fallback) omits the advance and retention subtractions the WO form applies, inflating `grandTotal` after every approved VO. See TECHNICAL_DEBT D-2.
5. **HIGH — Retention is deducted but never tracked or released.** Money withheld as retention disappears from every ledger; there is no retention-payable record and no release flow. See TECHNICAL_DEBT D-4.
6. **HIGH — Pervasive read-then-write races on money.** `sales.totalReceived` and schedule paid-amounts use read-modify-write instead of atomic increments; concurrent receipts silently lose money. Payment release, overbilling, and all uniqueness checks share this pattern. See PERFORMANCE_AUDIT §3 / TECHNICAL_DEBT D-6.
7. **MEDIUM — Scale ceiling.** Every screen loads entire collections via real-time listeners with client-side filtering and zero pagination; up to ~10 concurrent full-collection listeners on the admin dashboard. Fine for hundreds of documents, painful at tens of thousands. See PERFORMANCE_AUDIT §1.
8. **MEDIUM — Forgeable audit log.** Any authenticated user can write `auditLogs` entries with arbitrary `userId`/`action` ([firestore.rules:350](../firestore.rules#L350)); entries are immutable but their integrity of authorship is not guaranteed.
9. **MEDIUM — Committed live Firebase config + misleading docs.** `firebase-applet-config.json` (live web API key, low-secrecy by design) ships in every bundle; README describes a different product entirely.

---

## 5. Major strengths

- **Genuine role-based approval workflows** with status state-machines enforced in three places (rules, server, client) — the *intent* is sound and mostly consistent.
- **`firestore.rules` are unusually thorough** — status-transition gating with `onlyFieldsChanged` field-diffing per collection; the `paymentRequests` block is exemplary. This is the real production backstop and it does a lot of correct work.
- **Strong domain modelling** in `src/types.ts` — 22 typed business-rule error codes, explicit status enums, documented deprecations, and a clean derive-on-read financial philosophy that avoids stale cached rollups.
- **Well-tested calculation core** — 194 passing tests; the schedule engine (33 tests) and access-control matrix (39 tests) are excellent.
- **Correct concurrency where it matters most for identity** — work-order number reservation uses a real Firestore transaction, preventing duplicate WO numbers.
- **The Sales/receipt engine is the most mature module** — atomic batches, FIFO auto-distribution, allocation back-compat, sticky waive/cancel semantics.
- **Consistent, deliberate UI** — mobile drawer nav, responsive grids, print views, error boundaries, skeleton loaders, toast notifications.

---

## 6. Production-readiness verdict

**Not production-ready for untrusted or multi-tenant use.** Blocking items:

1. Deploy (or replace with real Cloud Functions) the secure backend, **or** remove the client fallback and harden Firestore rules so the deployed app enforces financial invariants. Today neither is true in production.
2. Reconcile the three divergent overbilling ceilings into one authoritative rule.
3. Fix the VO-approval financial formula.
4. Convert money read-modify-writes to atomic transactions/increments.
5. Decide the accounting strategy: keep derived reporting (and document that limitation honestly) **or** build a posting engine. Do not ship "ERP accounting" claims until one exists.

**Acceptable today for:** a single trusted operator or a small, fully-trusted internal team running the local dev server, with the understanding that alerts/summaries require the dev process running and that financial integrity depends on user discipline.

The codebase is a solid foundation — the gap is deployment topology and financial-integrity enforcement, not a rewrite. See NEXT_DEVELOPMENT_PLAN.md for the ordered roadmap that continues from the current implementation.
