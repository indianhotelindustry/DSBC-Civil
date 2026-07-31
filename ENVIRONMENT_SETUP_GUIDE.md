# ENVIRONMENT SETUP GUIDE — DSBC Civil

**Date:** 2026-07-30 · **Scope:** the developer/QA machine — tools, dependencies, configuration
**Companions:** [provisioning](./FIREBASE_PROVISIONING_GUIDE.md) · [first run](./FIRST_RUN_PLAYBOOK.md) · [staging deploy](./STAGING_DEPLOYMENT_PLAN.md) · [register](./RUNTIME_READINESS_CHECKLIST.md)

---

## 1. Prerequisites

| Tool | Required | Verify | Notes |
|---|---|---|---|
| **Node.js** | **20.x** | `node --version` → `v20.20.2` ✅ | Root `package.json` declares no `engines` — nothing stops you using 18 or 22, but 20 is what CI and the functions runtime use |
| **npm** | 10.x | `npm --version` → `10.8.2` ✅ | Ships with Node 20 |
| **JDK** | **17+** | `java -version` → `21.0.11` ✅ | **Required for `npm run test:rules`** — the Firestore emulator is a Java process. Installed here at `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot` |
| **firebase-tools** | current | `firebase --version` → `15.22.4` ✅ | `npm i -g firebase-tools` |
| **gcloud CLI** | for local `npm run dev` | `gcloud --version` | Only needed for ADC (§4) |
| **Git** | recent | `git --version` → `2.55.0` ✅ | |

> ⚠️ **Windows/PowerShell note:** `java` may be installed but absent from `PATH` in a given
> shell. If `npm run test:rules` reports *"Could not spawn `java -version`"*, set it for the
> session:
> ```powershell
> $env:JAVA_HOME = "$env:ProgramFiles\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
> $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
> ```
> Add both permanently via System Properties → Environment Variables to avoid repeating it.

## 2. Clone and install

```bash
git clone https://github.com/indianhotelindustry/DSBC-Civil.git
cd DSBC-Civil
npm install                    # root
npm install --prefix functions # Cloud Functions package (separate node_modules)
```

> `functions/` has its **own** `package.json` and lockfile. Forgetting the second install is
> why `npm run build --prefix functions` fails with unresolved imports.

**Verify without any Firebase config** — these four work offline:

```bash
npm run lint                   # tsc --noEmit  → 0 errors
npm test                       # 204 passed
npm run build                  # 3,759 modules
npm run build --prefix functions   # lib/index.js ~1.3 MB
```

Then, with a JDK on `PATH`:

```bash
npm run test:rules             # 177 passed (starts/stops the Firestore emulator)
```

If all five pass, the toolchain is correct. **None of them need a Firebase project** — that is
deliberate, and it is why the repository can be validated before provisioning.

## 3. Client configuration — `.env.local`

```bash
cp .env.example .env.local
```

Fill from Firebase console → **Project settings → General → Your apps → Web app**:

```
VITE_FIREBASE_API_KEY="…"
VITE_FIREBASE_AUTH_DOMAIN="dsbc-civil-staging.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="dsbc-civil-staging"
VITE_FIREBASE_STORAGE_BUCKET="dsbc-civil-staging.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="…"
VITE_FIREBASE_APP_ID="…"
VITE_FIREBASE_MEASUREMENT_ID=""

VITE_ALLOW_CLIENT_FALLBACK="false"
VITE_ENABLE_DEV_LOGIN="false"
VITE_USE_FIREBASE_EMULATOR="false"
```

### Rules that matter

| Rule | Why |
|---|---|
| **All 7 `VITE_FIREBASE_*` must be set** | `VITE_FIREBASE_API_KEY` is the gate: if falsy, config falls back to `firebase-applet-config.json`, which ships **empty placeholders** → the app cannot reach Firebase |
| **Leave `VITE_FIREBASE_FIRESTORE_DATABASE_ID` unset** | Setting it points the client at a named DB while functions use `(default)` → split-brain (**D-3**) |
| **`VITE_ALLOW_CLIENT_FALLBACK` must be `"false"`** | `"true"` disables fail-loud; privileged ops silently degrade to weaker client writes |
| **`VITE_USE_FIREBASE_EMULATOR` must stay `"false"`** | Half-wired — see §5 |
| **`.env.local` is gitignored — never commit real values** | `.gitignore` covers `.env*` except `.env.example` |
| **These are baked at BUILD time** | Changing one requires a rebuild + redeploy. There is no runtime config |

## 4. Application Default Credentials — for `npm run dev` only

The local Express harness (`server/`) uses the **Admin SDK**, which authenticates via ADC:

```bash
gcloud auth application-default login
gcloud config set project dsbc-civil-staging
```

Without ADC, `npm run dev` still serves the SPA, but the four privileged routes under
`/api/secure/*` fail when they touch Firestore. The client will surface a typed error rather
than degrade — that is fail-loud working correctly, not a bug.

> **Not needed** for `npm test`, `npm run test:rules`, `npm run build`, or for the deployed
> functions (which get credentials from their runtime service account automatically).

## 5. Emulator support — half-wired, leave it off

**Verified 2026-07-30.** Do not set `VITE_USE_FIREBASE_EMULATOR=true`.

| | State |
|---|---|
| Auth emulator | ✅ **Wired** — `src/services/auth.ts:18-20`, `connectAuthEmulator(auth, 'http://localhost:9099')` |
| Firestore emulator | ❌ **Not wired** — no `connectFirestoreEmulator` anywhere in `src/` |
| `firebase.json` emulators block | ⚠️ declares **`firestore` only** (port 8085). **No `auth` emulator**, so nothing ever listens on 9099 |

Setting the flag `true` gives you one of two broken states:
1. Nothing on 9099 → sign-in fails with a connection error.
2. Auth emulator started manually → you authenticate as an emulator user whose uid does not
   exist in the **real** Firestore `users` collection. Every rule resolves roles via
   `get(/users/$(request.auth.uid))`, that read finds nothing, and **every role-gated
   operation is denied.** The app looks catastrophically broken for reasons unrelated to code.

**Consequence:** local end-to-end QA against emulators is **not possible**. QA needs the
provisioned staging project.

**Recommendation (not implemented — needs approval):** add `connectFirestoreEmulator` beside
the existing Auth call, add an `auth` entry to `firebase.json` → `emulators`, and align ports.
Small and self-contained, but it is application code.

> Unaffected: `npm run test:rules` talks to the Firestore emulator directly via
> `@firebase/rules-unit-testing` and ignores this flag entirely.

## 6. Running locally

```bash
npm run dev      # tsx server.ts — Express + Vite middleware on :3000
```

This serves the SPA **and** the local `/api/secure/*` routes, so it is the only mode where the
privileged operations run without deployed Cloud Functions. Requires `.env.local` + ADC.

```bash
npm run build && npm run preview   # verify the production bundle locally
```

| Script | Purpose |
|---|---|
| `npm run dev` | Express + Vite dev server (includes the local secure API) |
| `npm run lint` | `tsc --noEmit` |
| `npm test` | 204 hermetic unit/config tests |
| `npm run test:rules` | 177 rules tests (needs JDK) |
| `npm run test:all` | both suites |
| `npm run build` | production SPA build |
| `npm run deploy:rules` | rules only — **the first deploy of any release** |
| `npm run deploy:hosting` | build + deploy hosting |

## 7. External runtime dependencies

The browser fetches two things that are **not** bundled:

| Dependency | Source | If blocked |
|---|---|---|
| Google Fonts (`Inter`) | `src/index.css:5` `@import` | Falls back to system fonts (cosmetic). Also the source of the known CSS `@import`-order build warning |
| Google logo SVG | `src/pages/Login.tsx:178` (`gstatic.com`) | Broken icon on the sign-in button (cosmetic) |

No other third-party service is contacted — verified by sweeping every `http(s)://` literal in
`src/`. The app cannot work fully offline (it needs Firebase endpoints).

## 8. Verification checklist

| | Check | Expected |
|---|---|---|
| ⬜ | `node --version` | `v20.x` |
| ⬜ | `java -version` | 17+ |
| ⬜ | `firebase --version` | present |
| ⬜ | `npm install` + `npm install --prefix functions` | both clean |
| ⬜ | `npm run lint` | 0 errors |
| ⬜ | `npm test` | 204 passed |
| ⬜ | `npm run test:rules` | 177 passed |
| ⬜ | `npm run build` | 3,759 modules |
| ⬜ | `npm run build --prefix functions` | ~1.3 MB bundle |
| ⬜ | `.env.local` exists, 7 keys set, `VITE_ALLOW_CLIENT_FALLBACK=false` | not committed |
| ⬜ | `gcloud auth application-default login` | only for `npm run dev` |

**Next:** [`FIRST_RUN_PLAYBOOK.md`](./FIRST_RUN_PLAYBOOK.md).
