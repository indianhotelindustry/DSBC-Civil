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

Record these once; do not file them.

| Observation | Why it happens |
|---|---|
| **`permission-denied` in the console on every page load**, for `test/connection` | `src/lib/firebase.ts:43-53` runs `testConnection()` on module load, reading `test/connection`. There is no `match /test/...` block in the rules, so it is denied by default. The app catches and ignores it, but the **Firebase SDK logs it anyway**. Harmless. *(A one-line cleanup is possible — recommendation only, it is application code)* |
| Alerts bell empty; no daily summaries | `dailyJobs` runs at **08:00 Asia/Kolkata**. Both collections stay empty until it has run once. Client writes are denied by design (`allow create: if false`) |
| Slow first load | Single JS chunk, 2.12 MB / 563 kB gzipped. Known performance item |
| CSS `@import` warning at build | Google Fonts `@import` in `src/index.css:5` must precede other rules. Cosmetic, pre-existing |
| ~15 buttons with no handler | Known (TECH-DEBT G-4). **Do record which ones** — that list is useful |
| Missing font / broken Google icon | External CDN fetches (Google Fonts, `gstatic.com`) blocked by network or an ad-blocker. Cosmetic |

Full register: [`DEFECT_LOG.md`](./DEFECT_LOG.md) §4.

## Step 8 · Common first-run failures

| Symptom | Cause | Fix |
|---|---|---|
| Sign-in popup opens then closes, nothing happens | Hosting domain not in **Authorized domains** | Provisioning §4.4 |
| `auth/operation-not-allowed` | Provider not enabled | Enable Google / Email-Password |
| **App loads completely blank — white page, no error UI at all** | `VITE_FIREBASE_*` unset → config falls back to the empty placeholders in `firebase-applet-config.json`. **Verified 2026-07-31 by running the app:** `getAuth(app)` (`src/lib/firebase.ts:34`) throws `Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)` at **module-evaluation time**, so `<div id="root">` stays empty and React never mounts. `ErrorBoundary` **cannot** catch this — it happens before React renders anything | Set all 7 `VITE_FIREBASE_*` in `.env.local`, then **restart the dev server / rebuild**. Confirm with devtools console: the only Firebase error should be the benign `test/connection` one in §7 |
| Everything denied for a valid, approved user | Client on a **named** Firestore DB while functions use `(default)`, or `users/{uid}` missing/`PENDING` | Unset `VITE_FIREBASE_FIRESTORE_DATABASE_ID` (**D-3**); check `status: ACTIVE` |
| `CONFIG_REQUIRED` on work-order create | WO Number Series not configured | Step 3 |
| Privileged ops fail with "secure service is temporarily unavailable" | Functions not deployed, or the rewrite is wrong | **Correct fail-loud behaviour.** Deploy functions; verify 6.1 |
| Privileged op *succeeds* but no `/api/secure/*` request in the network tab | `VITE_ALLOW_CLIENT_FALLBACK` is `"true"` — the weaker client path ran | Set `"false"`, **rebuild**, redeploy. Any QA done in this state is invalid |
| 429 "Too many requests" for one user caused by another | **P0 regression** — D-1 fix not effective | Stop, report immediately |
| `Could not spawn java -version` on `npm run test:rules` | JDK absent from `PATH` | Environment setup §1 |

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
