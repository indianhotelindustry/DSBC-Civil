# REPOSITORY HEALTH — DSBC Civil

**Date:** 2026-07-29 · **Version:** `1.0.0-beta.1` · **Canonical repo:** https://github.com/indianhotelindustry/DSBC-Civil
**Assessed at:** `platform/stabilization-v1.1` @ `9370c3c`

> Scored per the platform's own honesty principle (NN-7). Every score is justified by
> evidence, not impression. This is not a new audit — it is a health snapshot of the
> repository as published.

---

## 1. Overall engineering health: **7.5 / 10**

| Dimension | Score | One-line verdict |
|---|---|---|
| Repository structure | **9 / 10** | Clean, layered, governed; no orphans or leakage |
| Documentation | **9 / 10** | Unusually strong; drift corrected; history preserved |
| Test health | **7 / 10** | 369 tests, excellent calc + rules coverage; service/function tiers absent |
| Security | **7 / 10** | Boundary proven and tightened; H-3 open; dependency advisories grown |
| Technical debt | **6 / 10** | Well-catalogued and bounded, but P0 items still open |
| Deployment readiness | **6 / 10** | Code ready and verified; 2 silent-failure blockers + provisioning |
| Governance maturity | **9 / 10** | Constitution, amendment, ADR process now genuinely in use |

**Interpretation.** This is a **healthy, unusually well-governed beta** with one dominant
structural gap: *the authoritative money path is written and proven at the boundary but not
deployed.* That single fact caps several scores and is the whole point of the current
sprint. The forensic audit scored **7/10 for commercial beta** at rebranding; the delta
since is real but modest — the rules boundary is now proven and tightened (+), 170 rules
tests exist (+), the functions bundle is verified buildable (+), documentation drift is
closed (+), while the deploy gap, the posting engine and two finance decisions remain open (−).

---

## 2. Repository structure — 9/10

**206 tracked files** on the stabilization branch (190 on `main`).

| Area | Files | Notes |
|---|---|---|
| `src/` | 121 | pages 29 · services 30 · lib 27 (9 test files) · components 30 · context/App/types/css |
| `governance/` | 14 | Constitution, amendment, 3 ADR files, checklists, lifecycle, reliability, compliance |
| `server/` | 7 | Express secure API + shared `createApp()` |
| `tests/` | 8 | rules suite (7) + README |
| `audit/` | 8 | Frozen v0.9.0 forensic baseline |
| `docs/` | 7 | Program state, git strategy, migration, functions plan, finance decisions, specs |
| `.github/` | 4 | CI workflow + PR/issue templates |
| `functions/` | 3 | `index.ts`, `package.json`, lockfile |
| `scripts/` | 1 | |

**Strengths.** One service per Firestore collection (NN-8). `src/lib/` is pure — no React,
no Firebase (NN-11) — which is *why* the server and Cloud Functions can share the money math
verbatim; the functions bundle build proves it empirically. Governance, audit and
engineering docs are cleanly separated.

**Deductions.** `functions/` is excluded from the root `tsconfig`, so it is never
type-checked (mitigated by the new CI `functions-build` job, but esbuild does not
type-check). No `firestore.indexes.json` despite a server query requiring one.

---

## 3. Documentation health — 9/10

| Metric | Result |
|---|---|
| Markdown files | 51 |
| **Broken cross-references** | **0** |
| Version triple in sync (`VERSION` / `package.json` / `appVersion.ts`) | ✅ all `1.0.0-beta.1` |
| Historical documents preserved | ✅ marked, not rewritten |

**Strengths.** `START_HERE.md` gives a genuine ordered onboarding path. The Constitution
(25 sections, NN-1…NN-30) is actually referenced by code comments and enforced in review.
Drift was corrected *toward source* this pass (NN-21): the Constitution's stale test counts,
the "no `functions/` directory" claim, the `secureApi` fallback description, and the
`financialCalcs.ts` header that contradicted its own code.

Crucially, **history was preserved rather than edited**: `audit/` carries a
superseded-figures banner and `PLATFORM_STABILIZATION_v1.1.md` a task-status banner, with
the original findings intact. A reader can still see what was true in July 2026 and why.

**Deductions.** The volume of root-level markdown (≈20 files) is high enough that a new
contributor needs `START_HERE.md` to navigate — acceptable, but near the limit. Some
governance prose still describes target state in the present tense.

---

## 4. Test health — 7/10

| Tier | Location | Count | Status |
|---|---|---|---|
| **Unit (pure)** | `src/lib/*.test.ts` | **199** | ✅ 9 files |
| **Rules** | `tests/rules/*.test.ts` | **170** | ✅ 6 files |
| Service | `tests/service/` | 0 | ❌ absent |
| Function | `tests/functions/` | 0 | ❌ absent |
| E2E | `tests/e2e/` | 0 | ❌ absent |
| **Total** | | **369** | |

**Strengths.** The calculation core is genuinely well covered — the schedule engine (33) and
access matrix (39) are exemplary, with injectable clocks for hermeticity (TEST-5). The new
rules suite asserts **both** allow and deny (TEST-3); a deny-only suite would pass against
`allow read, write: if false` and prove nothing. `npm test` is scoped to `src/**` so the
pure suite stays hermetic and never depends on an emulator.

**Gaps (stated plainly).**
- **`ledgerUtils.ts` still has zero tests** — the most accounting-like module in the repo
  (Constitution TEST-1 says this MUST be covered before further ledger change).
- **No service or function tests.** Cross-document money invariants — cumulative billing
  ceilings, over-payable release checks, transactional atomicity — are exactly what rules
  *cannot* express, and they have no automated coverage at all.
- **Sales collections are untested at the rules layer** — the broadest write grants in
  `firestore.rules` (`sales`, `saleReceipts`, `saleSchedules`) with integrity enforced only
  in `saleService`.
- **No multi-company isolation test** (NN-29) — not the suite's fault: company scoping is
  client-side, so there is no boundary behaviour to assert yet.

---

## 5. Security health — 7/10

**Credentials: clean.** No service-account JSON, no private keys, no `AIzaSy…` keys, no live
Firebase domains, no `.env` files. Placeholders fail loud by design.

**The boundary is now proven.** 170 emulator-backed tests confirm every financially-material
transition is denied to **every** client role:

| Transition | ADMIN | CEO | ACCOUNTS | PM |
|---|---|---|---|---|
| payment `APPROVED → RELEASED` | ❌ | ❌ | ❌ | ❌ |
| bill `VERIFIED → APPROVED` | ❌ | ❌ | ❌ | ❌ |
| bill `→ PAID` / `PARTIALLY_PAID` | ❌ | ❌ | ❌ | ❌ |
| variationOrder `DRAFT → APPROVED` | ❌ | ❌ | ❌ | ❌ |

**Closed this pass (ADR-0001):** PM work-order self-approval (R-1) and ACCOUNTS bill
self-verification (R-2) — both were unscoped branches silently subsuming the field-scoped
approval gates beside them (NN-9, NN-3).

**Open.**
- **H-3 — forgeable audit-log authorship.** `auditLogs` create lacks
  `userId == request.auth.uid` (`firestore.rules:341`). Entries are immutable once written,
  so this is an authorship-integrity failure, not tampering. **Last unmitigated NN violation
  in the rules.** Pinned by a characterization test; needs its own ADR.
- **C-1 — the authoritative backend is not deployed.** Rules deny the money transitions; the
  handlers meant to perform them are not live. Rules cannot check amounts or cumulative sums.
- **Dependency advisories: 1 critical, 6 high, 10 moderate, 2 low (19).** Drift since the
  2026-07-09 gate (which recorded 9, "none in the runtime path") — **not** caused by any
  package added this pass, verified. `react-router-dom` (high, RSC CSRF) is a *runtime*
  dependency and needs an explicit disposition, not an assumption.
- **Company scoping is client-side** after a full collection read (chartered, §23).
- **Roles resolve from `users/{uid}`, not custom claims** — a client-readable trust anchor.
- **`/api/admin/*` endpoints unauthenticated** — latent only; not exposed by the Hosting
  rewrites, but must be gated before that rewrite is ever widened.

---

## 6. Technical debt — 6/10

Debt is **well-catalogued and bounded**, which is itself a health signal — but the P0 items
are still open.

| ID | Item | Status |
|---|---|---|
| D-0 | Secure backend not deployed | ⛔ Open — the dominant item |
| D-1 | Three divergent overbilling ceilings | ⛔ Open — **finance decision required** |
| D-2 | VO-approval formula diverges from the WO form | ⛔ Open — **finance decision required** |
| D-3 | `ledgerUtils` untested, mixed concerns | ⛔ Open |
| D-4 | Retention deducted but never tracked or released | ⛔ Open |
| D-6 | Read-then-write races on money totals | ⛔ Open (NN-5) |
| D-7 | Bill `update` re-runs no ceiling check | ⛔ Open |
| G-* | ~20 hygiene items (dead controls, listener leak, rounding, ESLint) | ⛔ Mostly open |
| — | Documentation drift | ✅ **Closed this pass** |
| — | Rules unproven | ✅ **Closed this pass** |
| — | R-1 / R-2 rule gaps | ✅ **Closed this pass** |

**Not built (deliberately deferred):** posting engine, journal/double-entry, voucher engine,
cash/bank book, purchase requests/orders/GRN, inventory transactions and stock ledger,
material consumption, measurement book, document management, formal reports.

**The platform is honest about this** — it explicitly refuses to claim double-entry
accounting until a posting engine ships (NN-7). That honesty is worth a point on its own.

---

## 7. Remaining ADRs

| # | Subject | Priority | Blocks |
|---|---|---|---|
| ✅ 0001 | Field-scope status-transition branches | — | **Accepted & implemented** |
| — | **H-3** — bind `auditLogs.userId` to `auth.uid` | **High** | NN-12 compliance |
| — | **VO-approval formula** (finance) | **High** | Sprint exit #4 |
| — | **Overbilling ceiling** (finance) | **High** | Sprint exit #4, D-1 |
| — | Deploy topology (staging project, functions region) | High | P0.1 |
| — | Custom-claims role migration | Medium | P1.5, boundary scoping |
| — | `journalEntries` + chart of accounts | Medium | P0.6, needs accountant sign-off |

> The two finance ADRs **must be decided together** — the VO formula changes the
> `grandTotal` that the bill-approval ceiling reads.

---

## 8. Deployment readiness — 6/10

| Gate | Status |
|---|---|
| `firebase.json` structure, rewrites, region | ✅ Verified |
| `functions/` builds | ✅ Verified — 1.3 MB bundle, `api` + `dailyJobs` |
| `createApp()` shared dev/prod, handlers not duplicated | ✅ Verified |
| Express routing under the rewrite | ✅ Consistent |
| Environment variable surface | ✅ Complete + documented |
| CI covers lint, unit, rules, build, functions | ✅ Wired this pass |
| Firebase project provisioned | ⛔ No |
| Rate limiting behind proxy (**D-1**) | ⛔ Broken |
| Firestore composite indexes (**D-2**) | ⛔ Missing, fails silently |
| Staging environment (DEP-2) | ⛔ None |
| Idempotency keys on money ops (NN-23) | ⚠️ Absent |
| `storage.rules` | ⚠️ Absent (Storage initialized but unused) |

**Score rationale:** the code and topology are genuinely deploy-ready and now *proven* to
build — a real step up. But two blockers would each fail **silently** in production (a
throttled money path; a dead alert engine reporting success), and no environment exists yet.
6/10 reflects "ready to deploy once two small fixes and provisioning land," not "ready now."

---

## 9. Summary

**What is strong:** governance that is actually practised rather than decorative; a pure,
well-tested calculation core; a trust boundary that is now *proven* rather than asserted;
documentation that tells the truth about its own limitations and preserves its own history.

**What holds the score down:** the authoritative backend is not deployed, so the platform's
own North-Star metric (fraction of financially-material transitions authoritatively enforced
in production) remains low. Two finance decisions block the money-math unification. The
service and function test tiers are empty. Retention is deducted but never tracked.

**Trust posture:** safe for a **single trusted operator or small trusted team**. Not yet
safe for untrusted multi-tenant commercial deployment — which is precisely what the
Engineering Phase 2 roadmap is driving toward, in the correct order.

**The line that must not be crossed** (`ENGINEERING_PHASE_2.md`): do not build P1 or P2
features on top of an unenforced money core. **P0 first — always.**
