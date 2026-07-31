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

**Moved.** The diagnostics register now lives in one authoritative place:
**[`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md)**.

It carries every symptom with its likely cause, the exact verification step, and the
resolution — classified by **severity** (🔴 Blocking · 🟠 Silent-Danger · 🟢 Benign) and by
**evidence level** (✅ Runtime Proven · 🔍 Source Proven · ⏳ Pending Validation).

| If you are… | Go to |
|---|---|
| Stuck on a startup failure | [Register A — Blocking](./RUNTIME_DIAGNOSTICS.md#2-register-a--🔴-blocking) |
| About to trust a QA result | [Register B — Silent-Danger](./RUNTIME_DIAGNOSTICS.md#3-register-b--🟠-silent-danger) |
| Wondering whether to file something | [Register C — Benign](./RUNTIME_DIAGNOSTICS.md#4-register-c--🟢-benign) |

> Kept as a single register deliberately: three overlapping troubleshooting tables previously
> existed across this playbook, `MANUAL_QA_PLAN.md` and `DEFECT_LOG.md`. Duplicated tables drift,
> and a drifted troubleshooting table is worse than none. **Add rows to `RUNTIME_DIAGNOSTICS.md`,
> never here.**

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
