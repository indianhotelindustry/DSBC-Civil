# FIRST RUN PLAYBOOK — DSBC Civil

**Date:** 2026-07-30 · **Scope:** taking a freshly-provisioned environment to a working, QA-ready application
**Prerequisites:** [provisioning](./FIREBASE_PROVISIONING_GUIDE.md) and [environment setup](./ENVIRONMENT_SETUP_GUIDE.md) complete

> An empty Firebase project plus this codebase does **not** produce a usable app. Four
> bootstrap actions are required, and one of them is a manual database edit that cannot be
> automated (it is the chicken-and-egg of the first admin). This playbook is that sequence.

---

## Step 1 · Sign in once to create your user document

Open the app (local `http://localhost:3000` or the staging hosting URL) and **sign in with
Google**.

**What happens:** `authService` creates `users/{your-uid}` with
`role: 'PROJECT_MANAGER'`, `status: 'PENDING'`.

**Expected result: you are BLOCKED** with an "awaiting approval" message. **This is correct.**
Self-signup cannot grant itself access — `firestore.rules` permits self-creation only as
`PROJECT_MANAGER`/`PENDING`, and a user may never change their own `role` or `status`.

## Step 2 · Promote yourself to ADMIN — the one manual edit

Firebase console → Firestore → `users` → your uid document:

| Field | Set to |
|---|---|
| `role` | `ADMIN` |
| `status` | `ACTIVE` |

Reload the app. You now have admin access.

> **Why this is manual and cannot be scripted:** the rules deliberately forbid self-elevation,
> and there is no seed script or bootstrap function. The first admin must be created out-of-band.
> This is the **only** manual database edit in the entire setup — every later user is approved
> in-app via Admin → Users.

## Step 3 · Configure the Work Order Number Series — mandatory

**Masters → Work Order Number Series.** Set prefix (e.g. `WO`), year, next number, padding.

**This is not optional.** `workOrderService.create` calls `reserveNextWorkOrderNumber()` and
**hard-fails** with `CONFIG_REQUIRED` if the series document is absent:

> *"Work Order Number Series is not configured. Please set it in Masters → WO Number Series
> before creating Work Orders."*

There is **no timestamp fallback** — it was deliberately removed because it let concurrent
creates race past it and issue duplicate numbers. Miss this step and every work-order test in
QA fails immediately for a reason that looks like a bug.

## Step 4 · Seed the minimum viable dataset

In dependency order — each depends on the one above:

| # | Entity | Where | Notes |
|---|---|---|---|
| 4.1 | **Company** | Masters → Companies | Code `SIPL`, `businessType: CONSTRUCTION`. The construction workflows and the sales module are both SIPL-scoped |
| 4.2 | **Project** | Projects | Set a `budget` — the budget dashboard divides by it |
| 4.3 | **Contractor** | Masters → Contractors | Required for every work order |
| 4.4 | **Work Category** | Masters → Work Categories | Seeded automatically if empty; verify the dropdown is populated |
| 4.5 | **Terms Template** | Masters → Terms Templates | Optional, but exercises the WO print view |
| 4.6 | **Sub-location / Unit** | Projects → Sub-locations | Needed for unit-level WOs **and** the entire sales pipeline |
| 4.7 | **Customer** | Customers | Needed for sales/booking |

## Step 5 · Create the QA role accounts

For each of **CEO**, **PROJECT_MANAGER**, **ACCOUNTS**:

1. Sign up (incognito window, or Admin → Users → pre-register the email).
2. As ADMIN: **Admin → Users** → approve → set the role → `status: ACTIVE`.

Separation of duties is enforced at the boundary, so **you cannot test the approval workflows
with one account.** Specifically: ACCOUNTS creates bills but cannot verify them (ADR-0001);
CEO approves but cannot initiate; PM cannot self-approve work orders.

> Pre-registration flow: an admin-created placeholder lives at `users/{lowercase-email}` with
> `uid: ''`, and is claimed on first sign-in. Both paths are permitted by the rules.

---

## Step 6 · Smoke gate — do not start QA until all six pass

| # | Check | Pass criterion |
|---|---|---|
| 6.1 | **`curl <host>/api/health`** *(staging only)* | `{"success":true,"message":"ok"}` |
| 6.2 | Version History page | shows **`v1.0.0-beta.2`** |
| 6.3 | Sign in as each of the 4 roles | each reaches a role-appropriate dashboard; no white screens |
| 6.4 | Create a work order end to end | succeeds; WO number comes from the series (e.g. `WO-2026-0001`), **not** a random suffix |
| 6.5 | CEO approves that work order | succeeds; `approvedBy`/`approvedAt` populate |
| 6.6 | Create a bill, then **verify it as PM while watching the network tab** | a request to `/api/secure/bills/:id/verify` returning **JSON** |

**6.1 and 6.6 are the two that matter most.** Together they prove Hosting → rewrite → Cloud
Function → Express routing works, i.e. that privileged operations are genuinely
server-authoritative. If 6.6 shows no `/api/secure/*` request, or returns HTML instead of JSON,
the functions are not wired — **stop and fix before QA.** That symptom is exactly audit finding
**C-1**.

---

## Step 7 · Expected noise — not defects

Several things look wrong on a first run and are not. **Read
[Step 8 §C](#c--benign--expected-do-not-file-as-defects) before QA begins** — it lists each one
with the exact console signature, so time is not spent filing a `permission-denied` that the
rules are supposed to produce.

The short version: a `test/connection` permission error on every page load, an empty alerts
bell until `dailyJobs` has run, a CSS `@import` build warning, a slow first load, ~15 dead
buttons, and — if a CDN is blocked — a missing font and a broken Google icon.

Known-and-accepted business findings (the VO `grandTotal` divergence, ceiling behaviour,
concurrent-receipt totals) are separate and live in [`DEFECT_LOG.md`](./DEFECT_LOG.md) §4.

## Step 8 · Known First-Run Diagnostics

The fastest path from a symptom to a cause. **Check the Verification column before acting** —
several of these look alike from the outside (a blank page and a denied-everything page have
completely different causes).

### Evidence status

Each row is marked with how much we actually know:

| Mark | Meaning |
|---|---|
| ✅ **Observed** | Reproduced on this codebase, with the exact message captured. Trust the string |
| ◻ **Derived** | Predicted from source (file:line given), **not yet observed**. The cause is sound; the exact wording may differ |

Stated this way deliberately (NN-7): a troubleshooting table that implies everything was
tested, when it wasn't, sends people down wrong paths with false confidence.

### A · Blocking failures — the app does not work

| Symptom | Likely cause | Verification | Resolution |
|---|---|---|---|
| ✅ **White screen. No UI, no error, nothing.** `<div id="root">` empty | Missing/invalid Firebase API key. `VITE_FIREBASE_*` unset → config falls back to the empty placeholders in `firebase-applet-config.json` | Browser console: **`Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)`** from `firebase_auth.js`. Thrown by `getAuth(app)` at [`src/lib/firebase.ts:34`](./src/lib/firebase.ts) at **module-evaluation time** — before React renders, which is why `ErrorBoundary` cannot catch it and why there is no error UI | Complete [Firebase provisioning](./FIREBASE_PROVISIONING_GUIDE.md), populate all 7 `VITE_FIREBASE_*` in `.env.local` ([env setup §3](./ENVIRONMENT_SETUP_GUIDE.md)), then **restart the dev server / rebuild** — these are baked at build time |
| ✅ **Server starts, but every Admin-SDK call fails** | Missing Application Default Credentials | **Server log** (not the browser): `Unable to detect a Project Id in the current environment`, raised from `GoogleAuth.findAndCacheProjectId`. Appears from `[background] Alert Engine failed:` and from `requireAuth` at [`server/authMiddleware.ts:34`](./server/authMiddleware.ts) | `gcloud auth application-default login` and `gcloud config set project <staging-id>` ([env setup §4](./ENVIRONMENT_SETUP_GUIDE.md)). Only needed for `npm run dev`; deployed functions get credentials from their runtime service account automatically |
| ◻ Sign-in popup opens, closes, nothing happens | Hosting domain not in Firebase **Authorized domains** | Console shows an unauthorized-domain auth error; sign-in never resolves | Add `localhost` + both hosting domains ([provisioning §4.4](./FIREBASE_PROVISIONING_GUIDE.md)) |
| ◻ `auth/operation-not-allowed` on sign-in | Auth provider not enabled in the console | The error code itself; `auth.ts:32` maps it to *"Authentication method is not enabled"* | Enable **Google** and **Email/Password** ([provisioning §4](./FIREBASE_PROVISIONING_GUIDE.md)) |
| ◻ **Everything denied** for a valid, approved user | Either the client is on a **named** Firestore DB while functions use `(default)` (**D-3**), or `users/{uid}` is missing / still `PENDING` | Firestore console: does `users/{your-uid}` exist with `status: ACTIVE`? Then check whether `VITE_FIREBASE_FIRESTORE_DATABASE_ID` is set — it must be **unset**. Every rule resolves the role via `get(/users/$(request.auth.uid))`, so a missing doc denies everything | Unset the database-ID variable and rebuild; set `role`/`status` per Step 2 |
| ◻ `CONFIG_REQUIRED` on work-order create | WO Number Series not configured | The typed error: *"Work Order Number Series is not configured…"* from `workOrderService.create` | Step 3. **There is no timestamp fallback** — this is deliberate |
| ◻ Privileged ops fail: *"The secure service is temporarily unavailable"* | Functions not deployed, or the Hosting rewrite is wrong | `curl <host>/api/health` — HTML or 404 instead of JSON confirms it. Network tab: `/api/secure/*` returns non-JSON | **This is correct fail-loud behaviour, not a bug.** Deploy functions ([staging plan §2.3](./STAGING_DEPLOYMENT_PLAN.md)) and re-verify §6.1 |
| ✅ `Could not spawn 'java -version'` on `npm run test:rules` | No JDK on `PATH` — the Firestore emulator is a Java process | The message itself, from firebase-tools | Install a JDK 17+ and set `JAVA_HOME`/`PATH` ([env setup §1](./ENVIRONMENT_SETUP_GUIDE.md)) |
| ✅ `Could not start Firestore Emulator, port taken` | Another process holds the emulator port | `Get-NetTCPConnection -LocalPort 8085 -State Listen` (on this machine, port **8080** was held by Apache `httpd`, which is why `firebase.json` uses **8085**) | Free the port, or change `firebase.json` → `emulators.firestore.port` **and** the fallback in `tests/rules/helpers.ts` |

### B · Silent-danger failures — it *looks* fine but the result is invalid

**These are the dangerous ones.** Nothing appears broken, so QA proceeds and produces results
that mean nothing.

| Symptom | Likely cause | Verification | Resolution |
|---|---|---|---|
| ◻ A privileged op **succeeds**, but there is **no `/api/secure/*` request** in the network tab | `VITE_ALLOW_CLIENT_FALLBACK` was `"true"` at build time — the weaker client-side path ran instead of the server | Network tab during bill-verify/approve or payment-release. Also check the `auditLogs` entry: a server-performed transition carries **`source: 'server'`** | Set `VITE_ALLOW_CLIENT_FALLBACK="false"`, **rebuild**, redeploy. **Any QA performed in this state is invalid and must be re-run** |
| ◻ `dailyJobs` reports success but `alerts` / `dailySummaries` stay empty | Missing composite index (**D-2**) — `runAlertEngine` swallows the error in a blanket `catch`, so a failure is indistinguishable from "nothing to alert about" | Firestore console → Indexes → Composite: is `alerts(type▲ relatedId▲ timestamp▲)` **Enabled**? Then check the function log for a `FAILED_PRECONDITION` | `firebase deploy --only firestore:indexes` ([staging plan §2.2](./STAGING_DEPLOYMENT_PLAN.md)) |
| ◻ **429 "Too many requests"** hits user B because user A was busy | **P0 regression** — the D-1 per-user rate-limit key is not in effect | Two users, ~20 privileged calls each within a minute ([staging plan §4.3](./STAGING_DEPLOYMENT_PLAN.md)) | **Stop QA and report immediately.** Do not work around it |

### C · Benign — expected, do not file as defects

| Symptom | Likely cause | Verification | Resolution |
|---|---|---|---|
| ◻ `permission-denied` for **`test/connection`** in the console on every page load | Expected under the current rules. `testConnection()` at [`src/lib/firebase.ts:43-53`](./src/lib/firebase.ts) reads `test/connection` on module load; there is **no `match /test/...` block**, so it is denied by default. The app catches and ignores it — but the Firebase SDK logs it anyway | Browser console. The path is always `test/connection`, and nothing in the UI misbehaves | **Ignore during QA.** Recorded in [`DEFECT_LOG.md`](./DEFECT_LOG.md) §4. A one-line cleanup is a documented follow-up — it is application code and needs approval. *(Not yet observed directly: `getAuth` throws first at line 34, so with an unconfigured project this read never runs. Expect it once config is valid.)* |
| ✅ Build warning: `@import must precede all other statements` | Google Fonts `@import` at [`src/index.css:5`](./src/index.css) sits after other rules | Appears in `vite build` and dev-server output | Cosmetic, pre-existing. Ignore |
| ◻ Alerts bell empty; no daily summaries | `dailyJobs` runs at **08:00 Asia/Kolkata** and has not run yet. Client writes are denied by design (`allow create: if false`) | Firestore: `alerts` / `dailySummaries` empty; function has no execution yet | Wait for the scheduled run, or trigger it manually. If it runs and still produces nothing, see §B |
| ◻ Missing font / broken Google icon on the sign-in button | External CDN fetch blocked (network policy or ad-blocker) — Google Fonts and a `gstatic.com` SVG are the **only** two external runtime dependencies | Network tab: failed requests to `fonts.googleapis.com` / `gstatic.com` | Cosmetic. Ignore |
| ◻ Slow first load | Single JS chunk, 2.12 MB / 563 kB gzipped | Network tab | Known performance item, tracked in `audit/PERFORMANCE_AUDIT.md` |
| ◻ ~15 buttons with no handler | Known dead controls (TECH-DEBT G-4) | Clicking does nothing, no console error | Expected. **Do record which ones** — that list is useful |

---

## Completion

| | |
|---|---|
| ⬜ | Signed in; user document created as `PENDING` |
| ⬜ | Promoted to `ADMIN` / `ACTIVE` |
| ⬜ | WO Number Series configured |
| ⬜ | Company, project, contractor, sub-location, customer seeded |
| ⬜ | CEO / PM / ACCOUNTS accounts created and approved |
| ⬜ | **All six smoke checks pass** (esp. 6.1 and 6.6) |
| ⬜ | Expected-noise list reviewed so it is not filed as defects |

**When every box is ticked, begin [`MANUAL_QA_PLAN.md`](./MANUAL_QA_PLAN.md) at QA-1** and log
findings in [`DEFECT_LOG.md`](./DEFECT_LOG.md).

Under the QA partnership model: you execute and capture evidence (steps, role, console, network,
screenshots); I reproduce from that evidence, trace root cause through the codebase, propose the
smallest safe fix, implement after confirming anything that changes behaviour, add a regression
test where a tier exists, flag the gap where none does, and validate all four gates before the PR.
