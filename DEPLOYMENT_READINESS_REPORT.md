# DEPLOYMENT READINESS REPORT — DSBC Civil v1.0.0-beta.1

**Date:** 2026-07-29 · **Scope:** Platform Stabilization v1.1, P3 — *verification only*
**Reviewer:** Deployment readiness pass (Claude Opus 5)
**Mandate:** confirm `firebase.json`, `functions/`, hosting rewrites, `createApp()`, the HTTPS
function wrapper, Express routing, environment variables and placeholder project IDs.

> ## ⚠️ NOTHING WAS DEPLOYED
> No `firebase deploy` was run. No Firebase project was created or contacted. The only
> commands executed against `functions/` were `npm install` and `npm run build`, locally,
> to verify the package compiles. Build artifacts (`functions/lib/`, `functions/node_modules/`)
> are gitignored.

---

## 1. Verdict

**🟡 CONDITIONAL GO — code and configuration are deploy-ready; provisioning is not.**

The deployment topology is **correct and verified working**. For the first time, the
Cloud Functions package was actually installed and built: it produces a valid 1.3 MB ESM
bundle exporting both expected symbols. Nothing in the code or config blocks a deploy.

What blocks it is **provisioning and four concrete pre-deploy fixes**, listed below. Two
of those (D-1, D-2) are not documented anywhere in the existing deployment docs and would
have caused silent production failures.

| Gate | Status |
|---|---|
| `firebase.json` structure, rewrites, region | ✅ Verified correct |
| `functions/` builds | ✅ **Verified — 1.3 MB bundle, `api` + `dailyJobs` exported** |
| `createApp()` shared by dev harness and function | ✅ Verified — handlers reused verbatim, not copied |
| Express routing under the rewrite | ✅ Verified consistent |
| Environment variable surface | ✅ Complete and documented |
| Placeholder project IDs | ⛔ **Present by design — deploy fails loud until replaced** |
| Rate limiting behind the proxy | ⛔ **Broken — see D-1** |
| Firestore composite indexes | ⛔ **Missing — see D-2** |
| Named-database support in functions | ⚠️ **Silent mismatch risk — see D-3** |
| Dependency advisories | ⚠️ **1 critical / 6 high — see D-5** |

---

## 2. What was verified working

### 2.1 The function build — first time actually exercised

`functions/` had **no lockfile and no `node_modules`**; the esbuild bundle had never been
run in this repository. Both now verified:

```
> esbuild index.ts --bundle --platform=node --target=node20 --format=esm
  --outfile=lib/index.js --external:firebase-functions --external:firebase-admin
  lib\index.js  1.3mb
  Done in 454ms
```

Bundle tail confirms the expected surface:
```js
export { api, dailyJobs };
```

Cross-package imports resolve correctly: `functions/index.ts` → `../server/app.ts` →
`./secureRoutes.ts` → `../src/lib/financialCalculationService.ts`. The pure-calc rule
(NN-11: `src/lib/` imports neither React nor Firebase) is what makes this work — the
financial math bundles cleanly into the server artifact. **The architecture's central
claim is verified by the build itself.**

`firebase-admin` and `firebase-functions` are correctly marked `--external` and are
runtime dependencies of `functions/package.json`. Output is ESM, matching
`"type": "module"` and `"main": "lib/index.js"`.

### 2.2 Topology consistency

| Element | Value | Consistent? |
|---|---|---|
| `firebase.json` → `functions.source` | `functions` | ✅ |
| Hosting rewrite `/api/secure/**` → | function `api`, region `asia-south1` | ✅ |
| Hosting rewrite `/api/health` → | function `api`, region `asia-south1` | ✅ |
| `functions/index.ts` `REGION` | `asia-south1` | ✅ matches both rewrites |
| Express mount point | `app.use("/api/secure", createSecureRoutes())` | ✅ matches rewrite path |
| Client call site | `fetch('/api/secure/...')` in `secureApi.ts` | ✅ same-origin, no CORS needed |
| SPA catch-all | `**` → `/index.html`, declared **after** the API rewrites | ✅ correct precedence |

Firebase Hosting preserves the original path when rewriting to a function, so Express
sees `/api/secure/bills/:id/verify` and the router matches. **Verified by inspection;
not exercised against a live project.**

### 2.3 `createApp()` — genuinely shared, not duplicated

[`server/app.ts`](./server/app.ts) builds the app with no listener and no Vite. Two
callers consume it:
- [`server.ts`](./server.ts) — adds Vite middleware, node-cron, `app.listen` (dev only)
- [`functions/index.ts`](./functions/index.ts) — `onRequest({ region }, createApp())`

The four privileged handlers exist in exactly one place
([`server/secureRoutes.ts`](./server/secureRoutes.ts)). This satisfies the P0.1 mandate
("re-host, don't rewrite") and NN-19.

### 2.4 Auth path

`requireAuth` verifies a real Firebase ID token via `admin.auth().verifyIdToken()` and
loads the role from `users/{uid}`. In the Cloud Functions runtime,
`server/firebaseAdmin.ts` finds no `firebase-applet-config.json`, falls through its
try/catch, and calls `admin.initializeApp(undefined)` — Application Default Credentials,
i.e. the function's own service account. **This is correct and intentional.**

### 2.5 Environment variables

`.env.example` documents all 7 `VITE_FIREBASE_*` keys plus 3 dev flags, and
`docs/FIREBASE_MIGRATION.md` carries a complete reference table. `VITE_*` values are baked
at build time, so they must be set in the **build** environment (CI), not at runtime — this
is correctly documented. `VITE_ALLOW_CLIENT_FALLBACK` defaults to `false`, so the four
privileged operations fail loud rather than degrading. **No server-side secrets are
required** — the functions runtime uses ADC.

---

## 3. Blockers and findings

### ⛔ D-1 · The rate limiter will throttle every user as one — `trust proxy` is not set

**New finding. Not previously documented.**

[`server/secureRoutes.ts:25-31`](./server/secureRoutes.ts#L25-L31) applies
`express-rate-limit` (v8.3.2) at **30 requests/minute**, keyed by `req.ip`.
[`server/app.ts`](./server/app.ts) never calls `app.set('trust proxy', …)` — verified by
search; there is no occurrence anywhere in `server/`.

Behind Firebase Hosting → Cloud Functions, every request arrives via the Google Front End.
Without `trust proxy`, Express ignores `X-Forwarded-For` and reports the **proxy's** IP as
`req.ip`. Consequences:

1. **All users share a single 30 req/min bucket.** The 31st privileged request per minute
   *across the entire organisation* gets HTTP 429. For a CEO approving a batch of bills,
   this is a hard outage of the money path.
2. `express-rate-limit` v7+ ships a validation check (`ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`)
   that logs an error when `X-Forwarded-For` is present but trust proxy is unconfigured —
   expect noisy function logs from the first request onward.

This is invisible in local dev (no proxy, so `req.ip` is the real client) — which is
exactly why it has not been caught.

**Fix (one line, in `createApp()` before the routes):**
```ts
app.set('trust proxy', 1);   // Hosting → GFE → function: exactly one hop
```
Do **not** use `true` (trusts every hop, allowing header spoofing to defeat the limiter).
Requires re-verifying the limiter still keys on the real client IP after the change.

---

### ⛔ D-2 · The alert engine needs a composite index that is not committed — and it will fail silently

**New finding. Not previously documented.**

[`server/backgroundJobs.ts:20-25`](./server/backgroundJobs.ts#L20-L25) runs:

```ts
db.collection("alerts")
  .where("type", "==", …)
  .where("relatedId", "==", …)
  .where("timestamp", ">=", todayStr)
  .limit(1)
```

Two equality filters plus a range filter on a third field **requires a composite index**
on `alerts(type ASC, relatedId ASC, timestamp ASC)`. Firestore rejects the query with
`FAILED_PRECONDITION` until it exists.

The failure mode is the dangerous part: `runAlertEngine` wraps its body in
`try { … } catch { console.error(…) }` ([`:89-91`](./server/backgroundJobs.ts#L89-L91)).
The scheduled function will therefore **report success while producing zero alerts** —
identical, from the outside, to "there is nothing to alert about."

Compounding this:
- **No `firestore.indexes.json` exists in the repository**, and `firebase.json` has no
  `firestore.indexes` key — so `firebase deploy` will never create indexes.
- `RELEASE_READINESS.md` §4 step 5 states *"Indexes: none required at baseline (queries
  are unfiltered single-collection)."* That is true of the **client** queries but **not**
  of this server query. That line is now known to be incomplete.

**Fix:** commit a `firestore.indexes.json` containing the `alerts` composite index and add
`"firestore": { "rules": …, "indexes": "firestore.indexes.json" }` to `firebase.json`.
Consider also removing the blanket `catch` so index failures surface loudly (NN-14: no
silent failure).

> `fetchActiveBills` uses a single `where("status", "in", [...])` — a single-field query
> that needs no composite index. Only the `alerts` query is affected.

---

### ⚠️ D-3 · Functions ignore `VITE_FIREBASE_FIRESTORE_DATABASE_ID` — split-brain risk on a named database

**New finding.**

The client supports a **named** (non-default) Firestore database via
`VITE_FIREBASE_FIRESTORE_DATABASE_ID` ([`src/lib/firebase.ts:36-39`](./src/lib/firebase.ts#L36-L39)),
and `docs/FIREBASE_MIGRATION.md` lists it as a supported option.

The server resolves the database only from `firebase-applet-config.json`
([`server/firebaseAdmin.ts:31-33`](./server/firebaseAdmin.ts#L31-L33)) — a file that is
**not deployed with the functions package**. In the functions runtime `firebaseConfig`
is always `{}`, so `admin.firestore()` always binds to **`(default)`**.

**If the project uses a named database, the client and the functions will read and write
different databases.** Every privileged operation would 404 on documents the user can see.

**Mitigation:** either use the `(default)` database (as
`docs/FIREBASE_MIGRATION.md` §3.1 already recommends), or add an explicit env var for the
functions runtime (e.g. `FIRESTORE_DATABASE_ID`) and read it in `firebaseAdmin.ts`.
**Recommendation: use `(default)` for the beta** and record the constraint.

---

### ⚠️ D-4 · `functions/` is not type-checked by the lint gate

`tsconfig.json` sets `"exclude": ["node_modules", "dist", "functions"]`, so
`npm run lint` (`tsc --noEmit`) **never type-checks `functions/index.ts`**. A type error
there would not fail the merge gate; it would surface at deploy time.

**Mitigated in this pass:** a `functions-build` job was added to
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) that runs
`npm ci --prefix functions && npm run build --prefix functions` on every PR. esbuild does
not type-check, but it does catch import-resolution and syntax failures — which are the
realistic breakages for a 30-line wrapper. A dedicated `tsconfig` for `functions/` remains
the fuller fix.

**Action required:** `functions/package-lock.json` was generated during this verification
and **must be committed** — `npm ci --prefix functions` (CI and reproducible deploys)
fails without it. It is not currently gitignored, so it will be picked up.

---

### ⚠️ D-5 · Dependency advisories have grown to 1 critical / 6 high

`RELEASE_READINESS.md` R-3 recorded **9 advisories (1 low, 8 moderate), none in the
runtime financial path**. Current `npm audit`:

| Severity | Count |
|---|---|
| Critical | 1 |
| High | 6 |
| Moderate | 10 |
| Low | 2 |
| **Total** | **19** |

This is **advisory-database drift, not new dependencies** — verified that none of the
advisories resolve through `@firebase/rules-unit-testing`, the only package added in this
pass. Notable, because the earlier "none in the runtime path" assessment no longer holds:

- **`websocket-driver` — critical** (resource-limit bypass; transitive, dev/tooling path)
- **`react-router-dom` / `react-router` — high** (RSC-mode CSRF bypass). **This is a
  runtime production dependency** shipped in the SPA bundle. The advisory concerns RSC
  mode, which this app does not use, so exposure is likely nil — **but it needs an
  explicit assessment, not an assumption.**
- **`postcss`, `brace-expansion`, `fast-uri`, `fast-xml-parser` — high** (build/tooling)

**Action:** run `npm audit` before deploying and record a per-advisory disposition.
Do not blanket-run `npm audit fix --force` — it would move major versions of
`react-router-dom` and `vite` outside a governed change.

---

### ⛔ D-6 · Placeholders — deploy fails loud by design (expected, not a defect)

| Placeholder | File | Effect |
|---|---|---|
| `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` | [`.firebaserc`](./.firebaserc) | **All** `firebase deploy` commands fail until replaced |
| Empty strings | [`firebase-applet-config.json`](./firebase-applet-config.json) | Client cannot reach Firebase unless `VITE_FIREBASE_*` are set |
| ~~`YOUR-ORG/dsbc-civil`~~ | [`package.json`](./package.json), `README.md`, `PROJECT_IDENTITY.md` | ✅ **RESOLVED 2026-07-29** — set to `indianhotelindustry/DSBC-Civil` at first publication |

This is the intended guard (`RELEASE_READINESS.md` R-5) against deploying to the wrong
project. **Leave as-is until the real project exists.**

---

### ℹ️ D-7 · Observations, not blockers

- **Unauthenticated admin triggers.** `/api/admin/run-alerts` and `/api/admin/run-summary`
  have no auth ([`server/app.ts:30-38`](./server/app.ts#L30-L38)). They are **not exposed**
  by the Hosting rewrites (only `/api/secure/**` and `/api/health` are), so they are
  unreachable in the deployed topology. **They must be gated before that rewrite is ever
  widened** (AUDIT SECURITY H-2). Currently latent, not live.
- **No idempotency keys** on the money operations (NN-23). Handlers re-assert status
  inside the transaction, so a replayed release throws rather than double-paying — safe,
  but not idempotent in the strict sense.
- **Node 20 runtime** (`functions/package.json` → `engines.node`). Verify it is still an
  accepted Cloud Functions runtime at deploy time; Node 20 is late in its support window.
- **No staging project** (Constitution DEP-2 requires one). Deploy to staging first.
- **Roles come from `users/{uid}`, not custom claims** — one Firestore read per
  privileged call. Works; custom-claims migration is chartered for P1.5.
- **Bundle size** — 2.12 MB / 563 kB gzipped single chunk. Pre-existing, tracked in
  `audit/PERFORMANCE_AUDIT.md`. Not a blocker.
- **Storage has no `storage.rules`.** `getStorage()` is initialized but unused. If Storage
  is enabled at provisioning, it will use default rules — lock it down or leave it disabled.

---

## 4. Corrected deploy sequence

Supersedes `RELEASE_READINESS.md` §4 step 5 (indexes) and adds the D-1/D-2 fixes.

1. **Fix D-1** — `app.set('trust proxy', 1)` in `createApp()`.
2. **Fix D-2** — commit `firestore.indexes.json` with the `alerts` composite index; add the
   `firestore.indexes` key to `firebase.json`.
3. **Commit `functions/package-lock.json`.**
4. Create the Firebase project(s) — **staging first** (Constitution DEP-2). Use the
   **`(default)`** Firestore database (D-3).
5. Set `.firebaserc` to the real project ID.
6. Enable Auth providers (Google + Email/Password); add hosting domains to authorized domains.
7. **Deploy rules first** — `npm run deploy:rules`. The trust boundary precedes all data.
8. **Deploy indexes** — `firebase deploy --only firestore:indexes`.
9. **Deploy functions** — `cd functions && npm ci && npm run deploy`. Verify
   `GET /api/health` returns `{success:true}` through the Hosting rewrite.
10. Set `VITE_FIREBASE_*` in the build environment; `npm run deploy:hosting`.
11. **Smoke-test the money path end to end**: create WO → approve → create bill → verify →
    approve → create payment → approve → release. Confirm each privileged step is served by
    the function (not a client fallback) and writes an `auditLogs` entry.
12. Confirm `VITE_ALLOW_CLIENT_FALLBACK` is unset/`false` in the production build.
13. Wait for the 08:00 Asia/Kolkata `dailyJobs` run; confirm `alerts`/`dailySummaries`
    populate — this is the D-2 regression check.
14. Bootstrap: promote the first user to `ADMIN`/`ACTIVE`; configure WO Number Series;
    record the deployment in Version History.

---

## 5. Summary of actionable findings

| ID | Finding | Severity | Blocks deploy? | Fix effort |
|---|---|---|---|---|
| **D-1** | `trust proxy` unset → global 30 req/min throttle on the money path | **High** | **Yes** | 1 line |
| **D-2** | Missing `alerts` composite index; no `firestore.indexes.json`; failure is silent | **High** | **Yes** | S |
| **D-3** | Functions ignore named-database config → client/server split-brain | Medium | Only if a named DB is used | S |
| **D-4** | `functions/` excluded from `tsc`; lockfile was missing | Medium | No (CI job added) | Done / S |
| **D-5** | 1 critical + 6 high advisories, incl. runtime `react-router-dom` | Medium | No — needs disposition | S |
| **D-6** | Project-ID placeholders | By design | **Yes** (intentionally) | Provisioning |
| **D-7** | Admin triggers unauthed (latent), no idempotency keys, no staging | Low–Medium | No | M |

**C-1 (the audit's original CRITICAL — "the secure layer is not deployed") remains open.**
It is now purely a provisioning task: the code is written, wired, and verified to build.
Fix D-1 and D-2 first, or the first deploy will ship a throttled money path and a silently
dead alert engine.
