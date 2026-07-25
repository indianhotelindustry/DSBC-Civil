# FIREBASE MIGRATION — DSBC Civil

Checklist for provisioning the **new Firebase account/project** for DSBC Civil. The repository intentionally ships with **no Firebase identity**: `.firebaserc` holds a placeholder, `firebase-applet-config.json` holds empty placeholders, and the app reads its configuration exclusively from `VITE_FIREBASE_*` environment variables.

> The legacy project (`work-orders-4436d`, old account) is **not** referenced anywhere in this repository. Data migration from it, if desired, is a separate exercise (Firestore export/import — see §8).

## 1. Create the project

1. In the new Firebase account, create a project (suggested ID: `dsbc-civil-prod`; per Constitution DEP-2 also create `dsbc-civil-staging`).
2. Add a **Web App** to the project and copy its config values.
3. Put the project ID in [`.firebaserc`](../.firebaserc) (replace `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`).

## 2. Authentication

- Enable **Google** sign-in (primary flow) and **Email/Password** (used by the "Request Access" registration flow).
- Add the production hosting domain(s) to **Authorized domains**.
- Optional dev-only: Anonymous auth if `VITE_ENABLE_DEV_LOGIN=true` is used locally.

## 3. Firestore

1. Create the **(default)** Firestore database (region: match your users; the legacy deployment used `asia-south1`).
2. Deploy rules from this repo — they are the production trust boundary and were **not** modified during rebranding:
   ```bash
   npm run deploy:rules
   ```
3. First-run bootstrap: sign in once, then have that user's `users/{uid}` document promoted to `role: 'ADMIN'`, `status: 'ACTIVE'` (via console). Admin then seeds companies/masters from the Masters page.
4. Configure the **WO Number Series** in Masters before creating Work Orders (hard requirement of `workOrderService.create`).

## 4. Storage

- Enable Firebase Storage (the client initializes `getStorage`). Apply least-privilege rules before storing anything.

## 5. Hosting

- `firebase.json` already defines hosting (SPA rewrites + `/api/secure/**` → function `api` in `asia-south1`). Adjust the region if the new project uses a different one.
- Deploy: `npm run deploy:hosting`.
- Set the `VITE_FIREBASE_*` values in your CI/build environment — the production bundle bakes them in at build time.

## 6. Functions

- `functions/` (package `dsbc-functions`) deploys the server-authoritative financial API:
  ```bash
  cd functions && npm install && npm run deploy
  ```
- Until functions are deployed, keep `VITE_ALLOW_CLIENT_FALLBACK` unset/false and expect secure operations to fail loud (per Platform Stabilization v1.1 doctrine).

## 7. App Check & Analytics (future)

- **App Check:** register the web app with reCAPTCHA v3/Enterprise, then wire `initializeAppCheck` in `src/lib/firebase.ts` and enforce for Firestore/Functions. Not yet wired — enable in monitor-only mode first.
- **Analytics:** `measurementId` is already part of the config surface (`VITE_FIREBASE_MEASUREMENT_ID`); `getAnalytics` is not yet initialized anywhere — a deliberate future step.

## 8. Data migration from the legacy project (optional)

- `gcloud firestore export` on the legacy project → `gcloud firestore import` on the new one (requires billing + a GCS bucket on both).
- Collections are unchanged by the rebranding, so an import is drop-in.
- Re-create users in Auth (UIDs change unless you use `firebase auth:export/import` with password hashes), then reconcile `users/{uid}` documents.

## Environment variable reference

| Variable | Required | Notes |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | ✅ | Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | `<project>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | New project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | `<project>.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | |
| `VITE_FIREBASE_APP_ID` | ✅ | |
| `VITE_FIREBASE_MEASUREMENT_ID` | optional | Analytics (future) |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | optional | Only for a named (non-default) database |
