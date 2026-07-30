# STAGING SETUP RUNBOOK — DSBC Civil

**Date:** 2026-07-30 · **Target:** first staging environment for `v1.0.0-beta.2`
**Constitution:** DEP-2 requires a staging environment separate from production.

> **Who executes this:** the repository owner. Every step needs Google/Firebase console
> access and billing authority, which cannot be exercised from the repository. Commands are
> given verbatim so they can be pasted; expected output is given so each step is verifiable.
>
> **PRODUCTION IS OUT OF SCOPE.** Nothing here touches a production project.

---

## ⚠️ Read before starting — three things that will block you

1. **Cloud Functions requires the Blaze (pay-as-you-go) plan.** The Spark free tier cannot
   deploy functions at all. `functions/index.ts` uses Functions **v2** (`onRequest`,
   `onSchedule`), which runs on Cloud Run and needs Blaze. Set a **budget alert** immediately
   after upgrading — staging traffic is negligible, but an unbounded plan on an unwatched
   project is a real risk.
2. **Use the `(default)` Firestore database.** Not a named one. `server/firebaseAdmin.ts`
   resolves the database from `firebase-applet-config.json`, which is *not* deployed with the
   functions package — so functions always bind to `(default)`. A named database would make
   the client and the functions read **different databases**, and every privileged operation
   would 404 on documents the user can see. This is blocker **D-3**; using `(default)` avoids
   it entirely with no code change.
3. **Do not enable Firebase Storage.** No `storage.rules` exists in the repository (blocker
   **S-1**), so enabling Storage would run it on permissive defaults. `getStorage()` is
   initialised but unused, so leaving Storage off costs nothing.

---

## Step 1 — Create the staging project

| # | Action |
|---|---|
| 1.1 | Firebase console → **Add project** → name `dsbc-civil-staging`. Disable Google Analytics (not used; `getAnalytics` is never initialised). |
| 1.2 | Upgrade to **Blaze**, then set a **budget alert** (e.g. ₹500/month) under Google Cloud Billing. |
| 1.3 | Note the **Project ID** exactly — it may differ from the display name (e.g. `dsbc-civil-staging-a1b2c`). |

## Step 2 — Point the repository at staging (safely)

Use **aliases** rather than editing `default` to a bare value. This makes an accidental bare
`firebase deploy` hit *staging*, never production.

```bash
firebase login
firebase use --add          # select the staging project → alias it:  staging
```

`.firebaserc` should end up like this. **Commit it** — project IDs are not secrets:

```json
{
  "projects": {
    "default": "dsbc-civil-staging",
    "staging": "dsbc-civil-staging"
  }
}
```

> Add a `"production"` alias only when a production project exists. Leaving it absent is a
> deliberate guard: you cannot deploy to a target that isn't configured.

**Verify:**
```bash
firebase use            # → "Active Project: staging (dsbc-civil-staging)"
```

## Step 3 — Authentication

| # | Action |
|---|---|
| 3.1 | Console → **Authentication → Get started**. |
| 3.2 | Enable **Google** (primary sign-in) and **Email/Password** (the "Request Access" flow). |
| 3.3 | **Authorized domains** → confirm `localhost` and `<project>.web.app` / `<project>.firebaseapp.com` are listed. **Sign-in fails silently-ish without this** — it is the most common first-deploy stumble. |
| 3.4 | *(Optional)* Enable **Anonymous** only if you want the dev-login button (`VITE_ENABLE_DEV_LOGIN=true`, dev builds only). Not needed for QA. |

## Step 4 — Firestore

| # | Action |
|---|---|
| 4.1 | Console → **Firestore Database → Create database**. |
| 4.2 | Choose **`(default)`** (see gotcha #2). Region: **`asia-south1`** to match `firebase.json` and `functions/index.ts`. **The region is permanent.** |
| 4.3 | Start in **production mode** (locked). The repository's rules are deployed in Step 6 and are the real boundary — never leave test-mode open rules in place. |

## Step 5 — Client environment variables

Console → **Project settings → General → Your apps → Add app → Web** (nickname
`dsbc-civil-staging-web`). Copy the config values into a **local, untracked** `.env.local`:

```bash
cp .env.example .env.local
```

Fill all seven. `.env*` is gitignored (except `.env.example`) — **never commit real values**:

```
VITE_FIREBASE_API_KEY="…"
VITE_FIREBASE_AUTH_DOMAIN="dsbc-civil-staging.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="dsbc-civil-staging"
VITE_FIREBASE_STORAGE_BUCKET="dsbc-civil-staging.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="…"
VITE_FIREBASE_APP_ID="…"
VITE_FIREBASE_MEASUREMENT_ID=""
VITE_ALLOW_CLIENT_FALLBACK="false"
```

- **Leave `VITE_FIREBASE_FIRESTORE_DATABASE_ID` unset** (gotcha #2).
- **`VITE_ALLOW_CLIENT_FALLBACK` must be `false`.** If it is `true`, fail-loud is disabled and
  QA test 4.12 is invalid.
- `VITE_USE_FIREBASE_EMULATOR` has **no effect** — not implemented (see `.env.example`).
- These are **baked at build time**. Changing them requires a rebuild + redeploy.

## Step 6 — Deploy, in this exact order

**The order is not a preference.** The trust boundary must exist before any data, and the
functions must exist before the app that calls them.

### 6.1 Firestore Rules — first, always

```bash
npm run deploy:rules
```
**Expected:** `+  Deploy complete!` · **Verify:** console → Firestore → Rules shows 635 lines
and a `statusUnchanged()` helper.

### 6.2 Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```
**Expected:** the `alerts` composite index created. · **Verify:** console → Firestore →
Indexes → Composite lists `alerts` with `type ▲ relatedId ▲ timestamp ▲`, state **Enabled**
(building can take a few minutes on an empty collection). This is blocker **D-2** closing for real.

### 6.3 Cloud Functions

```bash
npm run build --prefix functions
firebase deploy --only functions
```

> **Run `firebase deploy` from the repository root**, not from `functions/`. `firebase.json`
> lives at the root. (`npm run deploy --prefix functions` bundles both steps but runs with
> `cwd=functions/`, which is a needless risk on a first deploy.)

**First deploy will prompt to enable APIs** — accept all: **Cloud Build**, **Artifact
Registry**, **Cloud Run**, **Eventarc** and **Cloud Scheduler** (the last is required by the
`dailyJobs` scheduled function). This can take several minutes.

**Expected:** two functions deployed — `api` (HTTPS) and `dailyJobs` (scheduled,
`0 8 * * *`, Asia/Kolkata), both in `asia-south1`.

**If the runtime is rejected** (blocker **N-1**): `functions/package.json` → `engines.node`
is `"20"`. Bump to the lowest currently-supported LTS, re-run `npm install --prefix functions`,
rebuild, redeploy. One-line change — raise it as a PR, don't patch in place.

### 6.4 Hosting — last

```bash
npm run deploy:hosting     # runs `vite build` then deploys
```
**Expected:** a hosting URL. **Verify the rewrite works before anything else:**

```bash
curl -s https://<project>.web.app/api/health
# → {"success":true,"message":"ok"}
```

**This single curl is the most important verification in the runbook.** A `{"success":true}`
proves Hosting → rewrite → Cloud Function → Express routing works end to end. Anything else —
HTML, 404, 500 — means the rewrite or the function is misconfigured, and **no QA should start
until it returns JSON.**

## Step 7 — Bootstrap the application

| # | Action |
|---|---|
| 7.1 | Open the hosting URL, sign in once with Google. A `users/{uid}` document is created as `PROJECT_MANAGER` / `PENDING`. |
| 7.2 | Console → Firestore → `users/{your-uid}` → set `role: "ADMIN"` and `status: "ACTIVE"`. **This is the only manual database edit in the whole process.** |
| 7.3 | Re-load the app. You now have admin access. |
| 7.4 | **Masters → Work Order Number Series** — configure it. `workOrderService.create` hard-blocks without it (`CONFIG_REQUIRED`); there is no timestamp fallback by design. |
| 7.5 | Seed: one company (**SIPL**, `CONSTRUCTION`), one project, one contractor, one customer, one sub-location/unit. |
| 7.6 | Create the QA role accounts (CEO, PROJECT_MANAGER, ACCOUNTS) — sign each up, then approve and set roles from Admin → Users. |

## Step 8 — Pre-QA smoke gate

**Do not start `MANUAL_QA_PLAN.md` until all five pass.**

| # | Check | Pass |
|---|---|---|
| 8.1 | `curl .../api/health` | `{"success":true,"message":"ok"}` |
| 8.2 | Version History page | shows **`v1.0.0-beta.2`** |
| 8.3 | Sign in as each of the 4 roles | each lands on a role-appropriate dashboard, no white screens |
| 8.4 | Create a work order end to end | succeeds with a series-issued WO number |
| 8.5 | Verify a bill and watch the network tab | request goes to `/api/secure/bills/:id/verify` and returns JSON — **proves the privileged path is server-served, not a client fallback** |

If 8.5 shows no `/api/secure/*` request, or returns HTML, the functions are not wired —
**stop and fix before QA.** That symptom is exactly audit finding C-1.

---

## What this does and does not prove

**Proves, once complete:**
- **C-1 closes on staging** — the four privileged operations execute server-side,
  transactionally, with audit entries. This is the sprint's central unverified claim.
- **D-2 closes for real** — the composite index exists; the alert engine can dedupe.
- The rules boundary is live, not just tested locally.
- The Hosting → Function → Express topology works.

**Does not prove:**
- Anything about **production** — a separate project, deployed separately.
- **NN-5** is fixed. It is not. Concurrent receipts can still lose money (`F-4`).
- The **finance formulas** are correct. F-1/F-2 remain open business decisions; QA will
  *observe* the VO divergence, not resolve it.
- That **v1.1 is complete.** Deploying satisfies exit criterion 3 only. Criteria 2, 4, 5
  remain open.

## Rollback

| Layer | Rollback |
|---|---|
| Rules | `git checkout <prev-tag> -- firestore.rules && npm run deploy:rules`. Console also retains rules history |
| Indexes | Deleting an index is safe but slow to rebuild; generally leave in place |
| Functions | Redeploy the previous tag. Stateless — nothing to unwind |
| Hosting | One-click rollback to a prior release in the console |
| Data | Staging is disposable. **Before any future migration:** export Firestore first (NN-25) |

Staging is disposable by design: if it gets into a confusing state, delete the project and
re-run this runbook. That is cheaper than debugging a half-configured environment.
