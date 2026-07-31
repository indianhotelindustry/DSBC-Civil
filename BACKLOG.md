# BACKLOG — DSBC Civil

**Opened:** 2026-07-31 · **Purpose:** non-blocking improvements identified during audit,
release and runtime validation.

> **Nothing here is implemented without explicit approval.** These are recorded so they are not
> lost and not silently actioned. Each was found while doing something else — none is
> speculative, and none blocks the release.

**What does NOT belong here:**
- **v1.1 exit criteria** — tracked in [`NEXT_MILESTONE.md`](./NEXT_MILESTONE.md). Notably **T5
  atomic money mutations** (NN-5 / criterion 5) is sprint work, not backlog.
- **Deployment blockers** — [`DEPLOYMENT_BLOCKERS.md`](./DEPLOYMENT_BLOCKERS.md).
- **Finance decisions F-1 / F-2** — business decisions, [`docs/FINANCE_DECISIONS_PENDING.md`](./docs/FINANCE_DECISIONS_PENDING.md).
- **QA defects** — [`DEFECT_LOG.md`](./DEFECT_LOG.md), which follows the defect lifecycle.

**Status:** `PROPOSED` (awaiting approval) · `APPROVED` · `IN_PROGRESS` · `DONE` · `REJECTED`

---

## Application

### APP-001 — Friendly runtime configuration validation
**Priority:** High · **Effort:** S · **Status:** PROPOSED · **Origin:** RUNTIME_DIAGNOSTICS **A-1** (✅ Runtime Proven)

Missing Firebase configuration currently produces the **least diagnosable possible symptom**: a
completely blank white page with no error UI. `getAuth(app)` (`src/lib/firebase.ts:34`) throws
`auth/invalid-api-key` at module-evaluation time, before React renders, so `ErrorBoundary`
cannot catch it. This is the single most likely first-run failure.

**Acceptance criteria**
- Detect missing/blank Firebase configuration **before** SDK initialisation.
- Render a clear configuration-error screen naming which variables are absent.
- **Never expose secret values** — report presence/absence only, never contents.
- Behaviour unchanged when configuration is valid.
- Automated tests for the validation function (pure logic → `src/lib/`, tier exists).

**Notes:** touches app startup. Keep it a guard before `initializeApp`, not a redesign of
`firebase.ts`.

### APP-002 — Complete Firebase emulator support
**Priority:** Medium · **Effort:** S · **Status:** PROPOSED · **Origin:** RUNTIME_READINESS_CHECKLIST §7.1

Emulator support is **half-wired and actively harmful**. `connectAuthEmulator` exists
(`src/services/auth.ts:18-20`) but there is no `connectFirestoreEmulator` anywhere, and
`firebase.json` declares only the *firestore* emulator — nothing listens on 9099. Setting
`VITE_USE_FIREBASE_EMULATOR=true` therefore either fails to connect, or authenticates you as an
emulator user whose uid is absent from the real Firestore `users` collection, denying
everything.

**Acceptance criteria**
- Add `connectFirestoreEmulator` alongside the existing Auth call, same flag and DEV guard.
- Add an `auth` entry to `firebase.json` → `emulators`; align ports with the code.
- Document a seeding path for emulator `users/{uid}` docs, or the role lookup still fails.
- `.env.example` warning replaced with working instructions.

**Value:** unblocks local end-to-end QA with no cloud account. **Does not** replace staging —
it cannot verify the deployed-function path (C-1).

### APP-003 — Make alert-engine failures loud
**Priority:** Medium · **Effort:** S–M · **Status:** PROPOSED · **Origin:** RUNTIME_DIAGNOSTICS **B-2**

`runAlertEngine` wraps its body in a blanket `catch` (`server/backgroundJobs.ts:89-91`), so a
missing index or permission failure reports **success while producing nothing** — externally
identical to "nothing to alert about". Violates NN-14 (no silent failure).

**Acceptance criteria**
- Failures surface as a failed function execution (visible in Cloud Functions logs/alerting).
- **`server.ts` call sites fixed in the same change** — they call `runAlertEngine()`
  un-awaited at startup, so on Node 20 an unhandled rejection would crash the dev server. This
  is why the `catch` was not simply removed during D-2.

### APP-004 — Compile out the client fallback in production builds
**Priority:** Medium · **Effort:** S · **Status:** PROPOSED · **Origin:** STABILIZATION_v1.1_RELEASE_REVIEW §5 criterion 2

Bundle inspection found the fallback bodies still ship: the strings
`"must be DRAFT to verify"` and `"would exceed remaining payable"` are present in
`dist/assets/index-*.js`. Function names are minified, not tree-shaken. Unreachable at runtime
(`handleServerUnavailable` throws), but it would **reactivate silently** if that ever returned
`null` again.

**Acceptance criteria**
- `clientXxx` implementations guarded so they are eliminated from production builds (DEP-4).
- Verified by bundle inspection: neither string present after `npm run build`.
- Dev fallback still works.

> **This is v1.1 exit criterion 2.** Listed here because it is small and self-contained; it is
> tracked as sprint work in `NEXT_MILESTONE.md`.

### APP-005 — Remove or guard the `test/connection` boot read
**Priority:** Low · **Effort:** XS · **Status:** PROPOSED · **Origin:** RUNTIME_DIAGNOSTICS **C-1**

`testConnection()` (`src/lib/firebase.ts:43-53`) reads `test/connection` on module load. No
`match /test/...` block exists, so it is denied by default and the Firebase SDK logs a
`permission-denied` on **every page load**. Harmless, but it trains operators to ignore
permission errors — which is the opposite of what this platform wants.

**Acceptance criteria:** remove it, or point it at a readable path. No new console noise.

---

## Repository & tooling

### REPO-001 — Declare `engines` in the root `package.json`
**Priority:** Low · **Effort:** XS · **Status:** PROPOSED · **Origin:** RUNTIME_READINESS_CHECKLIST §7.6

`functions/package.json` pins `"node": "20"`; the root declares nothing, so a contributor can
build on 18 or 22 with no warning.
**Acceptance:** `"engines": { "node": ">=20 <21" }` matching CI and the functions runtime.

### REPO-002 — Add service-account key patterns to `.gitignore`
**Priority:** Medium · **Effort:** XS · **Status:** PROPOSED · **Origin:** FIREBASE_PROVISIONING_GUIDE §7

The repository is currently key-free and verified so, and the deployed path needs **no**
service-account JSON (ADC only). But `.gitignore` does not name the common patterns, so an
accidental commit would not be caught.
**Acceptance:** ignore `*serviceAccount*.json`, `*-firebase-adminsdk-*.json`, `gha-creds-*.json`.

### REPO-003 — Enable the ESLint CI step
**Priority:** Low · **Effort:** S · **Status:** PROPOSED · **Origin:** Constitution COD-2

ESLint is chartered but unconfigured; the CI step is commented out in
`.github/workflows/ci.yml`. Today `tsc` + 381 tests gate CI.
**Acceptance:** config added, `npm run lint:eslint` script, CI step enabled, zero errors on a clean tree.

---

## Security

### SEC-001 — Gate the `/api/admin/*` trigger endpoints
**Priority:** Medium · **Effort:** S · **Status:** PROPOSED · **Origin:** AUDIT SECURITY H-2

`/api/admin/run-alerts` and `/api/admin/run-summary` have no auth (`server/app.ts:30-38`).
**Currently latent** — the Hosting rewrites expose only `/api/secure/**` and `/api/health`, so
they are unreachable in the deployed topology.
**Acceptance:** `requireAuth` + `requireRole('ADMIN')` applied. **Must land before that rewrite
is ever widened.**

### SEC-002 — Coarse IP-keyed limiter ahead of `requireAuth`
**Priority:** Medium · **Effort:** S · **Status:** PROPOSED · **Origin:** STABILIZATION_v1.1_RELEASE_REVIEW §3.1 Concern 1

The D-1 fix moved rate limiting after authentication, so invalid-token floods are no longer
throttled and cost one `verifyIdToken` each. Bounded (no-header requests still 401 with zero
crypto) but real.
**Acceptance:** a high-threshold IP-keyed limiter before `requireAuth`, using the library's
`ipKeyGenerator`; per-user limiting unchanged; documented interaction with `trust proxy`.

### SEC-003 — Dispose of the outstanding npm advisories
**Priority:** Medium · **Effort:** S · **Status:** PROPOSED · **Origin:** REPOSITORY_HEALTH §5

1 critical, 6 high, 10 moderate, 2 low. `react-router-dom` (high, RSC-mode CSRF) is a
**runtime** dependency; the app does not use RSC mode, so exposure is likely nil — **but that
needs stating explicitly, not assuming**.
**Acceptance:** per-advisory disposition recorded. **Do not** run `npm audit fix --force` — it
would move `react-router-dom` and `vite` majors outside a governed change.

---

## Test tiers

Three of six tiers do not exist. Each blocks regression coverage for a whole class of defect —
see `RUNTIME_DIAGNOSTICS.md` §7 and `MANUAL_QA_PLAN.md` §6.

### TEST-001 — `tests/service/` (Firestore emulator)
**Priority:** Medium · **Effort:** M · **Status:** PROPOSED
Service-layer and cross-document rules — overbilling ceilings, payment ceilings, receipt cache
atomicity. Today a defect here has nowhere to get a regression test.

### TEST-002 — `tests/functions/` (emulator)
**Priority:** **High** · **Effort:** M · **Status:** PROPOSED
**The largest coverage gap.** Rules structurally cannot test amounts, cumulative ceilings or
transactional atomicity — only function tests can. Also the answer to D-1's "verified by review,
not tests" weakness. Becomes possible once functions are deployable.

### TEST-003 — `tests/e2e/` (Playwright)
**Priority:** Low · **Effort:** M–L · **Status:** PROPOSED
Critical approval/payment journeys. Until this exists, a UI-only defect found in manual QA has
no automated regression test.

### TEST-004 — `src/lib/ledgerUtils.test.ts`
**Priority:** **High** · **Effort:** S · **Status:** PROPOSED · **Origin:** TECH-DEBT D-3
`ledgerUtils.ts` is the most accounting-like module in the repository and has **zero tests**.
Constitution **TEST-1** states it MUST be covered before any further ledger change. The tier
already exists, so this is the cheapest high-value item in the backlog.

---

## Summary

| Area | Items | Highest priority |
|---|---|---|
| Application | APP-001 … APP-005 | **APP-001** (blank-screen diagnosability) |
| Repository | REPO-001 … REPO-003 | REPO-002 (key patterns) |
| Security | SEC-001 … SEC-003 | SEC-002 / SEC-003 |
| Test tiers | TEST-001 … TEST-004 | **TEST-004** (cheapest high-value), **TEST-002** (largest gap) |

**Recommended first three, if capacity appears:** **TEST-004** (small, closes a Constitution
requirement), **APP-001** (removes the worst first-run experience), **REPO-002** (prevents a
credential leak that is currently only prevented by discipline).

**None is a blocker. None will be implemented without approval.**
