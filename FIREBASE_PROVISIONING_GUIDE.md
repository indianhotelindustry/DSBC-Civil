# FIREBASE PROVISIONING GUIDE — DSBC Civil staging

**Date:** 2026-07-30 · **Target:** `dsbc-civil-staging` · **Scope:** console/cloud work only
**Companions:** [environment setup](./ENVIRONMENT_SETUP_GUIDE.md) · [first run](./FIRST_RUN_PLAYBOOK.md) · [staging deploy](./STAGING_DEPLOYMENT_PLAN.md) · [register](./RUNTIME_READINESS_CHECKLIST.md)

> **Executed by the repository owner.** Every step needs Google account + billing authority,
> which cannot be exercised from the repository. **Production is out of scope.**
> *(Supersedes the earlier `STAGING_SETUP_RUNBOOK.md`, now removed to avoid duplicate docs.)*

---

## Three things that will block you — read first

1. **Cloud Functions requires the Blaze plan.** The Spark free tier cannot deploy functions.
   `functions/index.ts` uses Functions **v2** (`onRequest`, `onSchedule`), which runs on Cloud
   Run. **Set a budget alert immediately after upgrading** — staging traffic is negligible, but
   an unbounded plan on an unwatched project is a real risk.
2. **Use the `(default)` Firestore database — not a named one.** `server/firebaseAdmin.ts`
   resolves the database from `firebase-applet-config.json`, which is *not* deployed with the
   functions package, so functions always bind to `(default)`. A named database would make the
   client and functions read **different databases**, and every privileged operation would 404
   on documents the user can see. This is blocker **D-3**; `(default)` avoids it with no code change.
3. **Do not enable Firebase Storage.** No `storage.rules` exists (blocker **S-1**), so enabling
   it would run on permissive defaults. `getStorage()` is initialised but unused — leaving
   Storage off costs nothing.

---

## Step 1 · Create the project

| # | Action |
|---|---|
| 1.1 | Firebase console → **Add project** → `dsbc-civil-staging`. **Disable** Google Analytics (`getAnalytics` is never called). |
| 1.2 | Upgrade to **Blaze**. Then Google Cloud Billing → **Budgets & alerts** → set a cap (e.g. ₹500/month) with email alerts at 50/90/100%. |
| 1.3 | Copy the **Project ID** exactly — it often differs from the display name (e.g. `dsbc-civil-staging-a1b2c`). Everything downstream uses the ID. |

## Step 2 · Point the repo at staging — safely

Use an **alias**, so an accidental bare `firebase deploy` can only ever hit staging.

```bash
firebase login
firebase use --add        # pick the staging project → alias it:  staging
firebase use              # → Active Project: staging (dsbc-civil-staging)
```

Resulting `.firebaserc` — **commit it**; project IDs are not secrets:

```json
{
  "projects": {
    "default": "dsbc-civil-staging",
    "staging": "dsbc-civil-staging"
  }
}
```

> Deliberately **no `production` alias**. You cannot deploy to a target that isn't configured —
> that is the guard.

## Step 3 · Enable the Google Cloud APIs

The first `firebase deploy --only functions` prompts for most of these — accept all. To
pre-empt, enable in the Cloud console → APIs & Services:

| API | Needed for |
|---|---|
| `identitytoolkit` | Firebase Auth |
| `firestore` | Firestore |
| `firebasehosting` | Hosting |
| `cloudfunctions` | Functions |
| `run` | Functions **v2** runs on Cloud Run |
| `cloudbuild` | Builds the function container |
| `artifactregistry` | Stores the built image |
| `eventarc` | v2 event plumbing |
| `cloudscheduler` | The `dailyJobs` scheduled function |
| `pubsub` | Backs v2 scheduled functions |

Skip `storage` (Step 6).

## Step 4 · Authentication

| # | Action | Why |
|---|---|---|
| 4.1 | Authentication → **Get started** | |
| 4.2 | Enable **Google** | `auth.ts:22` — primary sign-in |
| 4.3 | Enable **Email/Password** | `auth.ts:7-8` — the "Request Access" flow |
| 4.4 | **Authorized domains** → confirm `localhost`, `<project>.web.app`, `<project>.firebaseapp.com` | **The most common first-deploy failure.** Sign-in fails confusingly without it |
| 4.5 | *(Skip unless needed)* Enable **Anonymous** | Only for `VITE_ENABLE_DEV_LOGIN=true` in dev builds |

> **Do not configure custom claims.** Roles come from the `users/{uid}` document
> (`authMiddleware.ts:38`, `firestore.rules` `getUserData()`). Custom-claims migration is
> chartered for P1.5 — adding claims now would change nothing and confuse the model.

## Step 5 · Firestore

| # | Action | Why |
|---|---|---|
| 5.1 | Firestore Database → **Create database** | |
| 5.2 | Select **`(default)`** | Gotcha #2 / blocker **D-3** |
| 5.3 | Location **`asia-south1`** | Must match `firebase.json` rewrites and `functions/index.ts:20`. **Permanent — cannot be changed later** |
| 5.4 | Start in **production mode** (locked) | The repo's 635-line rules are deployed in the deployment plan and are the real boundary. **Never leave test-mode open rules in place** |

Do **not** create indexes by hand — `firestore.indexes.json` is committed and deployed.

## Step 6 · Storage — deliberately skipped

**Do not enable.** No `storage.rules` exists (**S-1**); `getStorage()` is initialised but no
feature uploads anything. Revisit only when a document-management feature lands, and commit
least-privilege rules *before* enabling.

## Step 7 · Service accounts and credentials

| Item | Action |
|---|---|
| Functions runtime identity | **Nothing to do.** `admin.initializeApp(undefined)` uses Application Default Credentials — in Cloud Functions that is the runtime service account, granted automatically |
| Service-account JSON key | **Do not create one. Do not ever commit one.** The repository is currently key-free and verified so |
| Local Admin SDK (for `npm run dev`) | `gcloud auth application-default login` — see [environment setup](./ENVIRONMENT_SETUP_GUIDE.md) §4 |

> If anyone later adds a `serviceAccountKey.json`, that is a security regression. `.gitignore`
> does **not** currently name that pattern — worth adding, but it is a repo-config change and
> is therefore a recommendation, not something changed here.

## Step 8 · Node runtime check (blocker N-1)

`functions/package.json` pins `"engines": { "node": "20" }`. Confirm Cloud Functions still
accepts Node 20 at deploy time. If it is rejected, bump to the lowest supported LTS, run
`npm install --prefix functions`, rebuild, and redeploy — **as a PR, not an in-place patch.**

---

## Completion checklist

| | Item |
|---|---|
| ⬜ | Project created; **Project ID recorded** |
| ⬜ | **Blaze** enabled **and a budget alert set** |
| ⬜ | `firebase use` reports the staging alias |
| ⬜ | `.firebaserc` updated and committed (no `production` alias) |
| ⬜ | 10 APIs enabled (Storage skipped) |
| ⬜ | Google + Email/Password enabled |
| ⬜ | Authorized domains include `localhost` **and** both hosting domains |
| ⬜ | Firestore **`(default)`**, `asia-south1`, production mode |
| ⬜ | Storage **left disabled** |
| ⬜ | `VITE_FIREBASE_FIRESTORE_DATABASE_ID` **left unset** |
| ⬜ | No service-account key created |

**Next:** [`ENVIRONMENT_SETUP_GUIDE.md`](./ENVIRONMENT_SETUP_GUIDE.md) to wire your machine.
