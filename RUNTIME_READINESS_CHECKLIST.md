# RUNTIME READINESS CHECKLIST — DSBC Civil

**Date:** 2026-07-30 · **Audited at:** `release/1.0.0-beta.2` @ `b7d9237`
**Method:** source-verified. Every row below was established by reading code or running a
command — not inferred from documentation. Where something could not be verified, it says so.

> **This is the master register.** The four companion guides
> ([provisioning](./FIREBASE_PROVISIONING_GUIDE.md) · [environment](./ENVIRONMENT_SETUP_GUIDE.md)
> · [first run](./FIRST_RUN_PLAYBOOK.md) · [staging deploy](./STAGING_DEPLOYMENT_PLAN.md))
> tell you *how*. This one tells you *what* and *whether*.

---

## 0. Go / No-Go

| | |
|---|---|
| **Repository readiness** | ✅ **GO** — no engineering blocker; five gates green; 381 automated tests |
| **Runtime readiness (understood & documented)** | ✅ **GO** — every external dependency, secret, API, billing prerequisite and manual step is now enumerated below |
| **Can the application run today?** | ❌ **NO** — 6 infrastructure prerequisites are unmet. All require your Google/Firebase account |
| **Merge `release/1.0.0-beta.2` → `main`?** | ✅ **RECOMMEND PROCEED** — see §11 |

**Two corrections to earlier statements of mine are recorded in §7.1 and §7.2.** Both were
found by this audit, and one materially changes the effort estimate I gave you.

---

## 1. Environment variables — complete inventory

Every `import.meta.env` / `process.env` reference in the repository. Nothing here is guessed.

### 1.1 Client (`VITE_*`) — baked at **build** time, not read at runtime

| Variable | Required | Read at | Effect if wrong/missing |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | ✅ **Yes** | `src/lib/firebase.ts:20,22` | **Gate variable.** If falsy, the whole config branch falls back to `firebase-applet-config.json`, which ships **empty placeholders** → app cannot reach Firebase at all |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ Yes | `firebase.ts:23` | Sign-in popup fails |
| `VITE_FIREBASE_PROJECT_ID` | ✅ Yes | `firebase.ts:24` | Wrong/absent project target |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ Yes | `firebase.ts:25` | `getStorage()` misconfigured (currently unused) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ Yes | `firebase.ts:26` | Part of the config contract |
| `VITE_FIREBASE_APP_ID` | ✅ Yes | `firebase.ts:27` | Part of the config contract |
| `VITE_FIREBASE_MEASUREMENT_ID` | ⬜ Optional | `firebase.ts:28` | Analytics only; **`getAnalytics` is never called**, so it has no effect today |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | ⚠️ **Leave UNSET** | `firebase.ts:29,36-39` | Setting it makes the **client** use a named database while **Cloud Functions always use `(default)`** → split-brain. See §7.3 (blocker D-3) |
| `VITE_ALLOW_CLIENT_FALLBACK` | ✅ Set to `"false"` | `src/services/secureApi.ts:77` | If `"true"`, fail-loud is **disabled** and privileged ops silently degrade to weaker client writes. Emergency rollback only |
| `VITE_ENABLE_DEV_LOGIN` | ⬜ Dev only | `Login.tsx:187`, `auth.ts:266` | Shows an anonymous dev-login button. Requires Anonymous auth enabled. Gated by `import.meta.env.DEV`, so it cannot appear in a production build |
| `VITE_USE_FIREBASE_EMULATOR` | 🚫 **Keep `"false"`** | `auth.ts:18` | **Half-wired and harmful** — see §7.1 |
| `MODE` / `DEV` | — | `appVersion.ts:8`, `Login.tsx`, `auth.ts`, `secureApi.ts` | Vite built-ins; no action |

> **Critical property:** `VITE_*` values are **substituted into the bundle at build time**.
> Changing one requires a **rebuild and redeploy** — there is no runtime configuration.
> Set them in the *build* environment (CI or local shell), not on the server.

### 1.2 Server / Functions

| Variable | Required | Read at | Notes |
|---|---|---|---|
| `PORT` | ⬜ Optional | `server.ts:32` | Local dev harness only; defaults to `3000` |
| `NODE_ENV` | ⬜ Optional | `server.ts:41` | Selects Vite middleware vs static serving. Not used by the deployed function |
| `FIRESTORE_EMULATOR_HOST` | ⬜ Auto | `tests/rules/helpers.ts:68-69` | Injected by `firebase emulators:exec`. Tests only |
| *(Admin credentials)* | ✅ **Implicit** | `server/firebaseAdmin.ts:24-27` | **No env var.** `admin.initializeApp(undefined)` → **Application Default Credentials**. In Cloud Functions this is the runtime service account, automatically. Locally it needs ADC (see §6.2) |

> **There are no secrets to configure for the backend.** No API keys, no service-account JSON,
> no `GOOGLE_APPLICATION_CREDENTIALS` in the deployed path. This is a genuine strength — verify
> that no one "helpfully" adds a key file later.

---

## 2. Firebase project configuration

| Item | Required value | Current state | Blocker |
|---|---|---|---|
| Firebase project | A real project ID | `.firebaserc` = `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` | ⛔ **I-1** |
| Staging project (DEP-2) | Separate from production | Does not exist | ⛔ **I-2** |
| Billing plan | **Blaze** (pay-as-you-go) | n/a | ⛔ **B-1** — Functions v2 cannot deploy on Spark |
| Region | `asia-south1` | Declared in `firebase.json` rewrites + `functions/index.ts:20` | Must match at creation; **permanent** |
| Firestore database | **`(default)`** | n/a | ⚠️ A named DB triggers **D-3** |
| `firebase-applet-config.json` | Empty placeholders | Empty — correct | ✅ Leave as-is |

## 3. Authentication

| Requirement | Source of truth | State |
|---|---|---|
| **Google** provider | `auth.ts:22` `GoogleAuthProvider` + `signInWithPopup` | ⛔ Must be enabled in console |
| **Email/Password** provider | `auth.ts:7-8` `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` | ⛔ Must be enabled |
| **Anonymous** provider | `auth.ts:10` `signInAnonymously` | ⬜ Only if `VITE_ENABLE_DEV_LOGIN=true` |
| **Authorized domains** | Firebase Auth requirement | ⛔ Must include `localhost` + hosting domains, or sign-in fails |
| Custom claims | **Not used** — roles come from `users/{uid}` (`authMiddleware.ts:38`, `firestore.rules` `getUserData()`) | ✅ Nothing to configure. Migration chartered for P1.5 |
| First admin | `users/{uid}` → `role: ADMIN`, `status: ACTIVE` | ⛔ **Manual console edit** — the only one required (**I-6**) |

## 4. Firestore

| Item | State | Notes |
|---|---|---|
| **Rules** | ✅ Committed — 635 lines, `firebase.json` → `firestore.rules` | **Deploy FIRST.** 177 tests prove behaviour. Inert until deployed |
| **Indexes** | ✅ Committed — `firestore.indexes.json`, wired via `firestore.indexes` | Exactly one composite index: `alerts(type▲ relatedId▲ timestamp▲)`. Verified as the only one required |
| Collections | ~30, created on first write | No migration or seeding script exists; masters are seeded through the UI |
| Database mode | Native, **production mode** (locked) | Never leave test-mode open rules in place |
| `test/connection` read on boot | ⚠️ See §7.4 | Produces a benign console error on **every** app load |

## 5. Storage, Functions, Hosting

| Service | State | Action |
|---|---|---|
| **Storage** | `getStorage()` initialised (`firebase.ts:40`) but **never used**. **No `storage.rules` exists** | 🚫 **Do not enable.** Enabling it without rules means permissive defaults (**S-1**) |
| **Cloud Functions** | ✅ Builds — 1.3 MB ESM, exports `api` (HTTPS) + `dailyJobs` (scheduled `0 8 * * *` Asia/Kolkata) | Requires Blaze + 5 GCP APIs (§6.1). `engines.node: "20"` — verify still supported (**N-1**) |
| **Hosting** | ✅ Configured — `dist/`, SPA rewrite, `/api/secure/**` + `/api/health` → function `api` | Deploy **last**. `curl /api/health` is the acceptance test |
| **App Check** | Not initialised anywhere | ⬜ Future (`FIREBASE_MIGRATION.md` §7). Not a blocker |
| **Analytics** | `getAnalytics` never called | ⬜ Config surface only |

## 6. Prerequisites

### 6.1 Required Google Cloud APIs

Derived from what the code actually uses. The first `firebase deploy --only functions` will
prompt to enable most of these — accept all.

| API | Why |
|---|---|
`identitytoolkit.googleapis.com` | Firebase Auth
`firestore.googleapis.com` | Firestore
`firebasehosting.googleapis.com` | Hosting
`cloudfunctions.googleapis.com` | Functions
`run.googleapis.com` | Functions **v2** runs on Cloud Run
`cloudbuild.googleapis.com` | Builds the function container
`artifactregistry.googleapis.com` | Stores the built image
`eventarc.googleapis.com` | v2 event plumbing
`cloudscheduler.googleapis.com` | `dailyJobs` (`onSchedule`)
`pubsub.googleapis.com` | Backs v2 scheduled functions
`storage.googleapis.com` | Only if Storage is enabled

### 6.2 Local development prerequisites

| Tool | Required | Verified locally | Notes |
|---|---|---|---|
| Node.js | **20.x** | ✅ `v20.20.2` | ⚠️ Root `package.json` declares **no `engines`** — see §7.5 |
| npm | 10.x | ✅ `10.8.2` | |
| **JDK** | **17+** | ✅ Temurin `21.0.11` | **Required for `npm run test:rules`** — the Firestore emulator is a Java process |
| firebase-tools | current | ✅ `15.22.4` | `npm i -g firebase-tools` |
| Git | any recent | ✅ `2.55.0` | |
| **ADC** (local Admin SDK) | for `npm run dev` | ❓ **Not verified** | `gcloud auth application-default login`. Without it the local Express secure routes cannot reach Firestore |

### 6.3 External runtime dependencies

Fetched by the browser at runtime — **not bundled**:

| Dependency | Location | Impact if blocked |
|---|---|---|
| Google Fonts (`Inter`) | `src/index.css:5` `@import` | Falls back to system fonts. Cosmetic. Also the source of the known CSS `@import`-order build warning |
| `gstatic.com` Google logo SVG | `src/pages/Login.tsx:178` | Broken image on the sign-in button. Cosmetic |
| Firebase SDK endpoints | runtime | **Functional** — the app cannot work offline |

> No other third-party service, webhook, payment gateway, email/SMS provider or analytics
> vendor is contacted. Verified by sweeping every `http(s)://` literal in `src/`.

---

## 7. Findings — gaps, and two corrections to my earlier claims

### 7.1 ⚠️ CORRECTION — emulator support is **half-wired**, not "not implemented"

**I previously told you emulator mode was not implemented. That was wrong, and the truth is
worse.**

| Verified fact | Location |
|---|---|
| `connectAuthEmulator(auth, 'http://localhost:9099')` **IS** wired, gated on `DEV && VITE_USE_FIREBASE_EMULATOR === 'true'` | `src/services/auth.ts:18-20` |
| **No** `connectFirestoreEmulator` call exists anywhere in `src/` | swept `src/` |
| `firebase.json` declares **only** the `firestore` emulator (port 8085) — **no `auth` emulator** | `firebase.json:57-66` |

So setting the flag `true` yields one of two broken states:
1. **Nothing listening on 9099** → sign-in fails with a connection error.
2. **Auth emulator started manually** → you authenticate as an emulator user whose uid does
   not exist in the **real** Firestore `users` collection. Every rule resolves roles via
   `get(/users/$(request.auth.uid))`; that read finds nothing; **every role-gated operation is
   denied.** The app appears completely broken for a reason that has nothing to do with the code.

**Why this correction matters to you:** completing emulator support is a **smaller** job than I
implied — Auth is already done. It needs `connectFirestoreEmulator` in `firebase.ts`, an `auth`
entry in `firebase.json`, and port alignment. **Recorded as a RECOMMENDATION only — not
implemented, per your instruction.** `.env.example` now carries the full warning.

### 7.2 ⚠️ CORRECTION — the D-1 "one-line fix" I originally recommended was wrong

`DEPLOYMENT_READINESS_REPORT.md` originally proposed `app.set('trust proxy', 1)` as the D-1
fix. Reading `express-rate-limit@8.5.2` showed a hop count cannot be verified without a
deployed environment, so it could have *appeared* to fix D-1 while leaving every user in one
bucket. The shipped fix keys the limiter on the verified uid instead — correct regardless of
proxy topology. Already corrected in-repo; repeated here so the register is complete.

### 7.3 ⚠️ D-3 — functions ignore the named-database setting

`server/firebaseAdmin.ts:31-33` resolves the database from `firebase-applet-config.json`,
which is **not deployed** with the functions package. So functions always bind to `(default)`.
**Mitigation: use `(default)`.** No code change needed.

### 7.4 ℹ️ Expect a benign `permission-denied` in the console on every app load

`src/lib/firebase.ts:43-53` runs `testConnection()` on module load:
`getDocFromServer(doc(db, 'test', 'connection'))`. There is **no `match /test/...` block** in
`firestore.rules`, so it is denied by default. The `catch` only surfaces offline errors, so the
app ignores it — but the **Firebase SDK logs the failure to the console anyway**.

**This will look like a defect during QA and is not one.** Recorded in
[`DEFECT_LOG.md`](./DEFECT_LOG.md) §4 so it is not filed. *(A one-line cleanup is possible but
touches application code — recommendation only.)*

### 7.5 ⚠️ Misconfiguration produces a silent blank page — **verified by running the app**

The app was launched on 2026-07-31 (`npm run dev`, no `.env.local`) to test this rather than
reason about it. Result:

| Layer | Outcome |
|---|---|
| Express harness | ✅ **Started.** `GET /api/health` → `{"success":true,"message":"ok"}` |
| Express routing / `createApp()` | ✅ **Verified locally** |
| `requireAuth` hoisted above the limiter (**D-1**) | ✅ **Verified.** No header → `401 UNAUTHENTICATED "Missing or invalid Authorization header."`; garbage token → `401 "Invalid or expired auth token."` |
| Vite middleware / SPA HTML | ✅ Served |
| **React SPA** | ❌ **Never mounted.** `<div id="root">` empty; screenshot is a blank white page |

**Exact cause, from the browser console:**
```
Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)
  source: firebase_auth.js
```
`getAuth(app)` (`src/lib/firebase.ts:34`) throws at **module-evaluation time** because
`VITE_FIREBASE_API_KEY` is unset and the config falls back to the empty placeholders in
`firebase-applet-config.json`. Because the throw happens while the module graph is being
evaluated — before React renders — **`ErrorBoundary` cannot catch it.** The operator sees a
blank page with no message.

**Recommendation (NOT implemented — application code, needs approval):** validate the Firebase
config at startup and render a plain configuration-error page instead of throwing. A missing
env var is the single most likely first-run failure, and it currently produces the least
diagnosable symptom possible.

Also confirmed in the same run: the background jobs failed with *"Unable to detect a Project Id
in the current environment"* (no ADC) but were **caught and logged without crashing the
server** — the blanket `catch` in `runAlertEngine` behaving exactly as documented in D-2.

### 7.6 ℹ️ No `engines` field in the root `package.json`

Nothing prevents a contributor building on Node 18 or 22. `functions/package.json` pins
`"node": "20"`; the root declares nothing. **Recommendation:** add
`"engines": { "node": ">=20 <21" }`. Not implemented — it is a repository-config change.

### 7.7 Placeholder inventory — complete

| Placeholder | File | Intent | Action |
|---|---|---|---|
| `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` | `.firebaserc` | Fail-loud guard | Replace at provisioning |
| Empty strings ×7 | `firebase-applet-config.json` | Force env-var config | **Leave empty** |
| — | `package.json` / `README` / `PROJECT_IDENTITY` repo URL | — | ✅ Resolved to `indianhotelindustry/DSBC-Civil` |

No other placeholder, `TODO`, or `FIXME` blocks runtime. (The two
`TODO: Finance Approval Required` markers in `financialCalculationService.ts` are deliberate
policy flags, not runtime gaps.)

---

## 8. Blocker summary

| ID | Blocker | Class | Owner |
|---|---|---|---|
| **B-1** | Blaze billing plan not enabled | Infrastructure | You |
| **I-1** | Firebase project does not exist | Infrastructure | You |
| **I-2** | No staging project (DEP-2) | Infrastructure | You |
| **I-3** | 7 `VITE_FIREBASE_*` values unset | Configuration | You |
| **I-4** | Auth providers + authorized domains not configured | Infrastructure | You |
| **I-5** | Firestore not created; rules/indexes not deployed | Infrastructure | You |
| **I-6** | No first ADMIN user; WO Number Series unconfigured | Manual bootstrap | You |
| **N-1** | Node 20 runtime acceptance unverified | Conditional | Verify at deploy |
| **S-1** | No `storage.rules` | Conditional | Keep Storage off |
| **D-3** | Named-database split-brain | Conditional | Use `(default)` |

**Engineering blockers: 0.** Everything above is provisioning, configuration or a deliberate
conditional.

---

## 9. Manual QA readiness

| Prerequisite | State |
|---|---|
| QA plan exists | ✅ [`MANUAL_QA_PLAN.md`](./MANUAL_QA_PLAN.md) — 9 suites, P0–P2 |
| Defect register exists | ✅ [`DEFECT_LOG.md`](./DEFECT_LOG.md) — empty and honestly marked BLOCKED |
| Known-findings register (avoid re-diagnosing) | ✅ `DEFECT_LOG.md` §4 + `MANUAL_QA_PLAN.md` §5 |
| Regression-test tiers | 🟡 3 of 6 exist (`src/lib`, `tests/rules`, `tests/config`). `tests/service`, `tests/functions`, `tests/e2e` **do not** |
| Environment to test against | ❌ **Blocked** on §8 |
| **Local QA via emulators** | ❌ **Not possible** — §7.1 |

**QA can begin the moment [`FIRST_RUN_PLAYBOOK.md`](./FIRST_RUN_PLAYBOOK.md) Step 8 passes.**

---

## 10. What is verified vs. assumed (NN-7)

**Verified by execution or source reading:**
every env var and its read site · all external HTTP references · Firebase services initialised
· the functions bundle builds and exports `api` + `dailyJobs` · rules and indexes committed and
wired · local toolchain versions · the emulator half-wiring · the `test/connection` boot read ·
five validation gates green.

**NOT verified — cannot be, without a project:**
that the Hosting rewrite actually reaches the function · that Node 20 is still accepted · the
`trust proxy` hop count · that the composite index is *sufficient* (the emulator does not
enforce indexes) · that ADC works on this machine · any end-to-end user workflow.

**Everything in the second list is checked in
[`STAGING_DEPLOYMENT_PLAN.md`](./STAGING_DEPLOYMENT_PLAN.md) §4.**

---

## 11. Merge recommendation

**✅ RECOMMEND PROCEEDING** with `release/1.0.0-beta.2` → `main` and the annotated
`v1.0.0-beta.2` tag, once GitHub protections are enabled.

**Why the runtime audit does not block the merge:** every unmet prerequisite is
*infrastructure or configuration*, not code. The repository is internally consistent, five
gates are green, 381 tests pass, no secrets are committed, and every runtime input is now
documented. Nothing discovered in this audit requires a code change before merging — the two
corrections in §7.1–7.2 are documentation fixes, and the three recommendations (§7.1, §7.4,
§7.5) are deliberately **not** implemented pending your approval.

**Conditions, unchanged:**
1. Branch protection on `main` enabled **first** (required PR + CI checks, no force-push).
2. Tag `v*` protection enabled.
3. The release is labelled an **interim increment** — **not** "Platform Stabilization v1.1
   complete." Four of six exit criteria remain open.

