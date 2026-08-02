# RUNTIME DIAGNOSTICS — DSBC Civil

**The single authoritative diagnostics register.** Last updated 2026-07-31 · Build `v1.0.0-beta.2`

> **One register, no duplicates.** `FIRST_RUN_PLAYBOOK.md`, `MANUAL_QA_PLAN.md` and
> `DEFECT_LOG.md` all point here. Do not copy rows into them — add rows here instead.
>
> **Companion:** [`RUNTIME_VALIDATION_EVIDENCE.md`](./RUNTIME_VALIDATION_EVIDENCE.md) is the
> per-deployment **capture sheet** (checkpoints RV-01 … RV-13, one run per copy). It is not a
> second register: evidence flows **one way**, from a failed checkpoint there into a new row
> here. This file stays cumulative and permanent; a capture sheet is a point-in-time record.

---

## 1. Classification standard

Every entry carries **both** a severity and an evidence level. They answer different questions:
*how bad is it* and *how much do we actually know*.

### Severity

| | Meaning | Response |
|---|---|---|
| 🔴 **Blocking** | The application does not work | Fix before proceeding |
| 🟠 **Silent-Danger** | It *looks* fine; the result is invalid | **Most dangerous class.** Verify explicitly — it will not announce itself |
| 🟢 **Benign** | Expected behaviour that looks like a fault | Do not file as a defect |

### Evidence level

| | Meaning | Requirement |
|---|---|---|
| ✅ **Runtime Proven** | Personally reproduced, with evidence captured | Log, screenshot, console output or network trace — quoted verbatim |
| 🔍 **Source Proven** | Deterministically confirmed from source, **not executed** | Exact `file:line` cited |
| ⏳ **Pending Validation** | Expected behaviour awaiting runtime confirmation | Names the check that would promote it |

**Promotion is one-directional and requires evidence:** ⏳ → 🔍 requires a source citation;
🔍 → ✅ requires captured output. **Inference is never recorded as observation.** If a row's
evidence level changes, the evidence goes in the row.

**Current register state:** 8 ✅ Runtime Proven · 8 🔍 Source Proven · 8 ⏳ Pending Validation.

> **⚠️ Demoted 2026-08-02 (NN-21 / NN-7).** "Cloud Functions bundle builds — 1.3 MB ESM
> exporting `api` + `dailyJobs`" was recorded in §5 as ✅ Runtime Proven. **That claim was
> measuring the wrong thing.** esbuild emitting a file says nothing about Node being able to
> load it — and it cannot (**A-10**). The row has been corrected rather than deleted, because
> how a false ✅ survived is worth remembering: *a gate that never executes the artifact cannot
> prove the artifact runs.*

---

## 2. Register A — 🔴 Blocking

| # | Symptom | Evidence | Likely cause | Verification | Resolution |
|---|---|---|---|---|---|
| **A-1** | **White screen. No UI, no error, nothing.** `<div id="root">` stays empty | ✅ **Runtime Proven** — reproduced 2026-07-31, screenshot + post-JS DOM dump captured | Missing/invalid Firebase API key. `VITE_FIREBASE_*` unset → config falls back to the empty placeholders in `firebase-applet-config.json` | Browser console: `Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)` from `firebase_auth.js`. Thrown by `getAuth(app)` at `src/lib/firebase.ts:34` at **module-evaluation time** — before React renders, which is why `ErrorBoundary` cannot catch it and there is no error UI | Provision Firebase, populate all 7 `VITE_FIREBASE_*` in `.env.local`, **restart/rebuild** (baked at build time). Backlog **APP-001** proposes a friendly error screen |
| **A-2** | Server starts, but every Admin-SDK call fails | ✅ **Runtime Proven** — server log captured 2026-07-31 | Missing Application Default Credentials | **Server log**, not the browser: `Unable to detect a Project Id in the current environment`, from `GoogleAuth.findAndCacheProjectId`. Seen from `[background] Alert Engine failed:` and from `requireAuth` at `server/authMiddleware.ts:34` | `gcloud auth application-default login`; `gcloud config set project <staging-id>`. Only for `npm run dev` — deployed functions use their runtime service account |
| **A-3** | `Could not spawn 'java -version'` on `npm run test:rules` | ✅ **Runtime Proven** — reproduced 2026-07-29 | No JDK on `PATH`; the Firestore emulator is a Java process | The firebase-tools message itself | Install JDK 17+, set `JAVA_HOME`/`PATH` |
| **A-4** | `Could not start Firestore Emulator, port taken` | ✅ **Runtime Proven** — reproduced 2026-07-29 | Another process holds the emulator port | `Get-NetTCPConnection -LocalPort 8085 -State Listen`. On this machine port **8080** was held by Apache `httpd` — which is why `firebase.json` uses **8085** | Free the port, or change `firebase.json` → `emulators.firestore.port` **and** the fallback in `tests/rules/helpers.ts` |
| **A-5** | **Everything denied** for a valid, approved user | 🔍 **Source Proven** — `firestore.rules` `getUserData()`; `server/firebaseAdmin.ts:31-33` | Either the client is on a **named** Firestore DB while functions use `(default)` (**D-3**), or `users/{uid}` is missing / still `PENDING` | Firestore console: does `users/{uid}` exist with `status: ACTIVE`? Is `VITE_FIREBASE_FIRESTORE_DATABASE_ID` set? It must be **unset**. Every rule resolves the role via `get(/users/$(request.auth.uid))` — a missing doc denies everything | Unset the database-ID variable, rebuild; set `role`/`status` per `FIRST_RUN_PLAYBOOK.md` Step 2 |
| **A-6** | `CONFIG_REQUIRED` on work-order create | 🔍 **Source Proven** — `src/services/workOrderService.ts:61-67` | WO Number Series not configured | The typed error: *"Work Order Number Series is not configured…"* | Configure Masters → WO Number Series. **There is no timestamp fallback** — removed deliberately to prevent duplicate WO numbers under concurrency |
| **A-7** | Privileged ops fail: *"The secure service is temporarily unavailable"* | 🔍 **Source Proven** — `src/services/secureApi.ts:80-83` | Functions not deployed, or the Hosting rewrite is misconfigured | `curl <host>/api/health` — HTML or 404 instead of JSON confirms it | **Correct fail-loud behaviour, not a bug.** Deploy functions; re-verify. This is audit finding **C-1** |
| **A-8** | Sign-in popup opens, closes, nothing happens | ⏳ **Pending Validation** | Hosting domain absent from Firebase **Authorized domains** | Console shows an unauthorized-domain auth error; sign-in never resolves | Add `localhost` + both hosting domains |
| **A-10** | **`firebase deploy --only functions` fails: `Error: Functions codebase could not be analyzed successfully`**, preceded by `Dynamic require of "path" is not supported` | ✅ **Runtime Proven** — 2026-08-02, reproduced in the deploy **and** twice locally | **The functions bundle cannot load — it never could.** `functions/package.json:4` sets `"type": "module"` and `:10` builds `--format=esm`, but esbuild **inlines CommonJS dependencies** (express → body-parser → `depd`). `depd` calls `require('path')` at module scope; ESM has no `require`, so esbuild's shim throws at `functions/lib/index.js:11`. `createApp()` runs at module evaluation (`functions/index.ts:24`), so the failure is unavoidable at cold start | `cd functions && node --input-type=module -e "import('./lib/index.js')"` → `LOAD FAILED: Dynamic require of "path" is not supported`. **⚠️ `node -e` WITHOUT `--input-type=module` reports a FALSE PASS** — that script runs as CommonJS, where `require` exists in scope and the shim silently delegates to it | ✅ **FIXED 2026-08-02** (defect **D-1**, approved). `--banner:js` injects `createRequire`, so esbuild's shim delegates to a real `require`. A new `verify:bundle` step now loads the artifact as part of `build` — **proven to exit 1 on the broken bundle and 0 on the fixed one**. Deploy re-verification (RV-03) still pending |
| **A-9** | `auth/operation-not-allowed` on sign-in | ⏳ **Pending Validation** — mapping exists at `src/services/auth.ts:32` | Auth provider not enabled in console | The error code; the app maps it to *"Authentication method is not enabled"* | Enable **Google** and **Email/Password** |

## 3. Register B — 🟠 Silent-Danger

**Nothing here announces itself.** Each must be checked deliberately, or QA produces results
that look valid and are not.

| # | Symptom | Evidence | Likely cause | Verification | Resolution |
|---|---|---|---|---|---|
| **B-1** | A privileged op **succeeds**, but there is **no `/api/secure/*` request** in the network tab | 🔍 **Source Proven** — `src/services/secureApi.ts:77` | `VITE_ALLOW_CLIENT_FALLBACK` was `"true"` at build time — the weaker client-side path ran instead of the server | Network tab during bill verify/approve or payment release. Cross-check the `auditLogs` entry: a server-performed transition carries **`source: 'server'`** (`server/auditLog.ts:22`) | Set `"false"`, **rebuild**, redeploy. **All QA performed in this state is invalid and must be re-run** |
| **B-2** | `dailyJobs` reports success, but `alerts` / `dailySummaries` stay empty | 🔍 **Source Proven** — `server/backgroundJobs.ts:89-91` blanket `catch` | Missing composite index (**D-2**). The error is swallowed, so failure is indistinguishable from "nothing to alert about" | Firestore console → Indexes → Composite: is `alerts(type▲ relatedId▲ timestamp▲)` **Enabled**? Then check the function log for `FAILED_PRECONDITION` | `firebase deploy --only firestore:indexes`. Making the failure loud is backlog **APP-003** |
| **B-3** | **429 "Too many requests"** hits user B because user A was busy | ⏳ **Pending Validation** — requires a real proxy; cannot be reproduced locally | **P0 regression** — the D-1 per-user rate-limit key is not in effect | Two users, ~20 privileged calls each within one minute | **Stop QA and report immediately.** Do not work around it |
| **B-4** | An approved VO inflates the WO `grandTotal` by more than the VO amount | 🔍 **Source Proven** — `src/lib/financialCalculationService.ts:129-138`; pinned by a passing test at `financialCalculationService.test.ts:74-95` | **Known finance divergence F-1** — the VO path omits the advance and retention subtractions the WO form applies. `grandTotal` is also the bill-approval ceiling | Record the WO `grandTotal` before and after VO approval | **Do not diagnose or fix.** Awaiting business decision. Record exact figures — they inform the ADR |
| **B-5** | A bill passes creation, then is blocked at approval (or vice versa) | 🔍 **Source Proven** — `billService.ts:68` (gross) vs `server/secureRoutes.ts:116` (net) | **Known finance divergence F-2** — three different ceilings apply to the same WO. Direction is parameter-dependent | Record the exact amounts and which step blocked | **Do not diagnose or fix.** Awaiting business decision; must be decided **with** F-1 |
| **B-6** | Two concurrent receipts on one sale produce a wrong `totalReceived` | 🔍 **Source Proven** — `saleReceiptService` read-modify-write, not atomic | **Known open defect F-4 / NN-5.** Sprint criterion 5 is not met | Two browser tabs recording a receipt on the same sale simultaneously | **Known. Record and move on.** Fix is T5 (atomic mutations) — a v1.1 exit criterion, tracked in `NEXT_MILESTONE.md`, not backlog |

## 4. Register C — 🟢 Benign

**Do not file these as defects.**

| # | Symptom | Evidence | Likely cause | Verification | Resolution |
|---|---|---|---|---|---|
| **C-1** | `permission-denied` for **`test/connection`** on every page load | 🔍 **Source Proven** — `src/lib/firebase.ts:43-53` + no `match /test/...` block in `firestore.rules`. **Not yet observed**: `getAuth` throws first at line 34, so with an unconfigured project this read never executes. Expect it once config is valid | Expected under current rules. `testConnection()` reads `test/connection` on module load; denied by default. The app catches and ignores it — the Firebase SDK logs it anyway | Browser console; path is always `test/connection`; nothing in the UI misbehaves | **Ignore during QA.** Removal/guarding is backlog **APP-005** |
| **C-2** | Build warning: `@import must precede all other statements` | ✅ **Runtime Proven** — observed in both `vite build` and dev-server output | Google Fonts `@import` at `src/index.css:5` sits after other rules | Appears during build | Cosmetic, pre-existing. Ignore |
| **C-3** | Alerts bell empty; no daily summaries | ⏳ **Pending Validation** | `dailyJobs` runs at **08:00 Asia/Kolkata** and has not run yet. Client writes denied by design (`allow create: if false`) | `alerts` / `dailySummaries` empty; no function execution yet | Wait for the scheduled run or trigger manually. If it runs and still produces nothing → **B-2** |
| **C-4** | Missing font / broken Google icon on the sign-in button | ⏳ **Pending Validation** | External CDN fetch blocked. Google Fonts (`src/index.css:5`) and a `gstatic.com` SVG (`src/pages/Login.tsx:178`) are the **only** two external runtime dependencies — verified by sweeping every `http(s)://` literal in `src/` | Network tab: failed requests to `fonts.googleapis.com` / `gstatic.com` | Cosmetic. Ignore |
| **C-5** | Slow first load | ⏳ **Pending Validation** | Single JS chunk, 2.12 MB / 563 kB gzipped | Network tab | Known performance item (`audit/PERFORMANCE_AUDIT.md`) |
| **C-6** | ~15 buttons with no handler | ⏳ **Pending Validation** — count from `audit/TECHNICAL_DEBT.md` G-4, not re-verified | Known dead controls | Clicking does nothing, no console error | Expected. **Record which ones** — that list is useful |
| **C-7** | Contractor ledger header totals ≠ sum of rows | 🔍 **Source Proven** — `src/lib/ledgerUtils.ts`, zero test coverage | Known **TECH-DEBT D-3**; mixed concerns in `ledgerUtils` | Compare header against row sum | Known. Fix requires `ledgerUtils.test.ts` first (Constitution **TEST-1**) — backlog **TEST-004** |
| **C-8** | Retention deducted but appears in no ledger as a liability | 🔍 **Source Proven** — no retention-liability record exists anywhere | Known **TECH-DEBT D-4** — retention is arithmetic only | Trace a bill's retention amount | Known. v1.2 Accounting Core scope |

---

## 5. Runtime facts confirmed working

Recorded so they are not re-tested, and so a later regression is obvious.

| Fact | Evidence |
|---|---|
| Express harness starts; `GET /api/health` → `{"success":true,"message":"ok"}` | ✅ Runtime Proven 2026-07-31 |
| `createApp()` and Express routing work outside a deployment | ✅ Runtime Proven 2026-07-31 |
| **D-1 middleware ordering** — no auth header → `401 UNAUTHENTICATED "Missing or invalid Authorization header."`; garbage token → `401 "Invalid or expired auth token."` | ✅ Runtime Proven 2026-07-31 |
| Vite middleware serves the SPA shell | ✅ Runtime Proven 2026-07-31 |
| Background jobs fail on absent ADC but are caught and logged **without crashing the server** | ✅ Runtime Proven 2026-07-31 |
| ~~Cloud Functions bundle builds — 1.3 MB ESM exporting `api` + `dailyJobs`~~ **← DEMOTED 2026-08-02** | ❌ **Withdrawn.** esbuild *emits* the 1.3 MB file, but Node **cannot load it** — see **A-10**. The bundle has never been successfully loaded, in any environment. Do not cite this as evidence of anything |
| 381 automated tests pass (204 unit/config + 177 rules) | ✅ Runtime Proven 2026-07-31 |

## 6. Not yet verifiable — requires a deployed environment

Stated explicitly so nothing here is mistaken for a passing check.

| Claim | Promotes when |
|---|---|
| The Hosting rewrite reaches the Cloud Function | `curl <host>/api/health` returns JSON in staging |
| The four privileged ops execute server-side (**C-1 closure**) | Each returns JSON from `/api/secure/*` **and** writes an `auditLogs` entry with `source: 'server'` |
| The boundary denies direct console writes | The five negative tests in `STAGING_DEPLOYMENT_PLAN.md` §4.6 all deny |
| **D-1** per-user limiting works behind a real proxy | **B-3** check passes |
| The `trust proxy` hop count is correct | Function log shows a real client IP |
| The composite index is **sufficient** (not merely declared) | Alerts populate after a `dailyJobs` run — the emulator cannot enforce indexes |
| Node 20 runtime still accepted | `firebase deploy --only functions` succeeds |
| ADC works on this machine | `npm run dev` reaches Firestore without the A-2 error |

---

## 7. Adding an entry

1. Assign the next ID in the correct register (`A-`, `B-`, `C-`).
2. Set **severity** and **evidence level** honestly. New rows are ⏳ unless you have a source
   citation or captured output.
3. Fill **Verification** with the exact check — a command, console string, or console location.
   This column is the point of the register.
4. If it is a **defect** rather than a diagnostic, also open a `DEFECT_LOG.md` entry and a
   GitHub issue, and follow the defect lifecycle.
5. If it is a non-blocking improvement, add it to `BACKLOG.md` — **do not implement it**.

**Diagnostic vs defect:** a diagnostic explains a symptom an operator will meet and how to
resolve it. A defect is something that must change in the product. B-4, B-5 and B-6 are
deliberately in both worlds — they are real defects, but they are *known and owned elsewhere*,
so they are listed here to stop QA re-diagnosing them.
