# RUNTIME VALIDATION EVIDENCE — DSBC Civil

**Template opened:** 2026-08-01 · **Phase:** D1 Deployment Transition · **Status:** ⏳ **BLANK — nothing validated yet**

> **This is a capture sheet, not a register.** It records **one specific validation run** against
> **one deployed environment**. [`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md) remains the
> single authoritative diagnostics register; this file feeds it. Findings flow **one way**:
> a failure here becomes a row *there* (and a [`DEFECT_LOG.md`](./DEFECT_LOG.md) entry if it is a
> product defect). Never copy diagnostic rows back into this file.
>
> **Copy this file per run** — `RUNTIME_VALIDATION_<env>_<date>.md` — or fill it in and commit it
> as the record of that deployment. Do not overwrite a completed run.

---

## 0. Rules of evidence (NN-7)

**Every "Actual" cell must contain captured output — never a description of expected behaviour.**

| Classification | Means | Required to claim it |
|---|---|---|
| ✅ **Runtime Proven** | Personally reproduced against the deployed environment | Verbatim console output, HTTP response body, log line, or screenshot reference |
| 🔍 **Source Proven** | Confirmed from source, **not executed** | Exact `file:line` |
| ⏳ **Pending Validation** | Not yet checked | — (the default for every row in a blank sheet) |

**Promotion is one-directional and requires proof.** ⏳ → ✅ **never** happens by reasoning, by
analogy with a similar check, or because a later step succeeded. If evidence was not captured,
the checkpoint is ⏳ — even if you are confident it passed.

**Forbidden phrasings in an Actual cell:** *"should return"*, *"presumably"*, *"looks correct"*,
*"same as above"*, *"works"*. Paste the bytes.

**A blocked checkpoint is not a failed one.** If a prerequisite layer failed, mark downstream
rows `⏳ BLOCKED — depends on RV-nn` and stop. Do not guess.

---

## 1. Run header — fill in before starting

| Field | Value |
|---|---|
| Environment | `staging` |
| Firebase Project ID | *(pending provisioning)* |
| Hosting URL | `https://<project>.web.app` |
| Functions region | `asia-south1` |
| Git commit (SHA) | |
| Git tag / branch | `release/1.0.0-beta.2` |
| Build produced by | `npm run build` — record the `dist/assets/index-*.js` hash |
| Operator | |
| Run started (ISO 8601) | |
| Run completed (ISO 8601) | |

> Record the **built asset hash**. `VITE_*` values are baked at build time, so "which build is
> live" is not answerable from the repo alone — and B-1 (client fallback active) is a *build*
> property, not a runtime one.

---

## 2. Deployment layer checkpoints

**Sequence is non-negotiable: rules → indexes → functions → hosting.** Do not start a layer
until the previous one is ✅.

### RV-01 · Firestore Rules deployed

| | |
|---|---|
| **Command** | `npm run deploy:rules` |
| **Expected** | CLI reports success; Firebase console → Firestore → Rules shows a new version, **635 lines**, published timestamp matching this run |
| **Why it is first** | The boundary must never lag the application. All of ADR-0001 and ADR-0002 live here and do nothing until deployed |
| **Actual** | |
| **Evidence** | |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-02 · Firestore Indexes deployed and **Enabled**

| | |
|---|---|
| **Command** | `npm run deploy:indexes` |
| **Expected** | Console → Firestore → Indexes → Composite shows `alerts` (`type ▲`, `relatedId ▲`, `timestamp ▲`) with status **Enabled** — not *Building* |
| **Gate** | **Do not proceed while status is *Building*.** A declared-but-building index fails queries exactly like a missing one |
| **Actual** | |
| **Evidence** | |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-03 · Cloud Functions deployed

| | |
|---|---|
| **Command** | `npm run deploy:functions` |
| **Expected** | Two functions deployed in `asia-south1`: **`api`** (HTTP, v2/Cloud Run) and **`dailyJobs`** (scheduled `0 8 * * *`, `Asia/Kolkata`) — `functions/index.ts:20,24,27-28` |
| **Watch for** | Node 20 runtime rejection (blocker **N-1**) → stop, fix as a PR, do not patch in place. API-enablement prompts → accept |
| **Actual** | |
| **Evidence** | |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-04 · Hosting deployed

| | |
|---|---|
| **Command** | `npm run deploy:hosting` (builds first) |
| **Expected** | Deploy succeeds; hosting URL returned; console shows a new release |
| **Actual** | |
| **Evidence** | |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

---

## 3. Runtime checkpoints

### RV-05 · React mounts

| | |
|---|---|
| **Check** | Open the hosting URL. Inspect `<div id="root">` in DevTools → Elements |
| **Expected** | `#root` contains a rendered tree; the login page is visible |
| **Failure mode** | **Empty `#root`, blank white page, no error UI** = diagnostic **A-1** (✅ Runtime Proven locally). Cause: missing/blank `VITE_FIREBASE_*` baked into the build. `getAuth(app)` throws at `src/lib/firebase.ts:34` at **module-evaluation time**, before React renders, so `ErrorBoundary` cannot catch it |
| **If it fails** | Do not debug React. Check the console for `auth/invalid-api-key`, fix `.env`, **rebuild** and redeploy |
| **Actual** | |
| **Evidence** | Screenshot + post-JS DOM dump of `#root` |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-06 · Firebase SDK initializes

| | |
|---|---|
| **Check** | Browser console during initial load |
| **Expected** | **No** `auth/invalid-api-key`. **No** `FirebaseError` during module evaluation |
| **Known benign** | `permission-denied` on path **`test/connection`** = diagnostic **C-1**. `testConnection()` (`src/lib/firebase.ts:43-53`) reads a path with no `match` block. **Expected once config is valid. Do not file as a defect** |
| **Actual** | |
| **Evidence** | Full console text, including benign lines |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-07 · Authentication initializes and sign-in succeeds

| | |
|---|---|
| **Check** | Click Google sign-in; complete the flow |
| **Expected** | Popup opens, resolves, app transitions to an authenticated state |
| **Failure modes** | Popup opens then closes with nothing → **A-8**, hosting domain missing from **Authorized domains**. `auth/operation-not-allowed` → **A-9**, provider not enabled (`src/services/auth.ts:32` maps it to *"Authentication method is not enabled"*) |
| **Note** | First sign-in creates a `users/{uid}` doc in a **PENDING** state. Everything stays denied until it is promoted to `role: ADMIN`, `status: ACTIVE` — that is **I-6**, expected, not a defect |
| **Actual** | |
| **Evidence** | Screenshot of authenticated state + console |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-08 · Firestore connectivity

| | |
|---|---|
| **Check** | After promoting your user to `ADMIN`/`ACTIVE`, load a list page. Network tab → Firestore channel |
| **Expected** | Documents read; lists populate |
| **Failure mode** | **Everything denied** for a valid approved user = **A-5**. Either `users/{uid}` is missing/`PENDING`, or the client is on a **named** database while functions use `(default)` (**D-3**). Confirm `VITE_FIREBASE_FIRESTORE_DATABASE_ID` is **unset** |
| **Actual** | |
| **Evidence** | Network trace + screenshot of populated data |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-09 · `/api/health` — the Hosting → Function rewrite

| | |
|---|---|
| **Command** | `curl https://<project>.web.app/api/health` |
| **Expected — exact** | `{"success":true,"message":"ok"}` (`server/app.ts:38`) |
| **Interpretation** | **HTML or 404 means the rewrite did not reach the function** — the SPA catch-all `**` → `/index.html` served it instead. This single check validates the whole rewrite path |
| **Actual** | |
| **Evidence** | Full response body **and** status code |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-10 · Protected API rejects unauthenticated calls

| | |
|---|---|
| **Commands** | `curl -i -X POST https://<project>.web.app/api/secure/bills/test/verify`<br>then repeat with `-H "Authorization: Bearer garbage"` |
| **Expected — exact** | No header → **401** `UNAUTHENTICATED` *"Missing or invalid Authorization header."*<br>Garbage token → **401** *"Invalid or expired auth token."*<br>(Both ✅ Runtime Proven locally 2026-07-31; this confirms the ordering survived deployment) |
| **Why it matters** | Proves **D-1** middleware ordering in the deployed topology: rate limiting sits *after* authentication, and a no-header request costs zero `verifyIdToken` |
| **Actual** | |
| **Evidence** | Both full responses with status lines |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-11 · The four privileged operations execute **server-side** — closes C-1

**This is the single most important checkpoint in this document.** It is sprint criterion 3.

Exercise each through the UI, with the **Network tab open**:

| # | Operation | Endpoint (`server/secureRoutes.ts`) |
|---|---|---|
| a | Bill verify | `POST /api/secure/bills/:id/verify` (`:281`) |
| b | Bill approve | `POST /api/secure/bills/:id/approve` (`:285`) |
| c | Payment release | `POST /api/secure/payments/:id/release` (`:289`) |
| d | Variation-order approve | `POST /api/secure/variation-orders/:id/approve` (`:293`) |

| | |
|---|---|
| **Expected — both must hold, per operation** | **(i)** a request to the `/api/secure/*` endpoint appears in the Network tab and returns JSON; **(ii)** a new `auditLogs` document exists carrying **`source: 'server'`** (`server/auditLog.ts:22`) with matching `userId`, `action`, `entity`, `entityId`, `outcome` |
| **🟠 Silent-Danger** | If the operation **succeeds with no `/api/secure/*` request**, that is **B-1**: the weaker client fallback ran because `VITE_ALLOW_CLIENT_FALLBACK` was `"true"` **at build time**. **All QA performed in this state is invalid and must be re-run** after setting `"false"` and rebuilding. The `source` field is the tell-tale — a client-path write will not carry `source: 'server'` |
| **Actual — a** | |
| **Actual — b** | |
| **Actual — c** | |
| **Actual — d** | |
| **Evidence** | Per operation: network entry (URL, status, response) **+** the `auditLogs` document |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

### RV-12 · The boundary denies what it should

From the **Firebase console** (not the app), so the client SDK is bypassed. **Every one must be denied** — a success here is a **P0 stop-everything** finding.

| # | Direct write attempt | Closes | Denied? | Evidence |
|---|---|---|---|---|
| a | payment `APPROVED → RELEASED` | AUDIT C-2 · criterion 1 | ⏳ | |
| b | bill `APPROVED → PAID` | AUDIT C-3 | ⏳ | |
| c | work order `PENDING → APPROVED` as a PM | ADR-0001 / R-1 | ⏳ | |
| d | bill `DRAFT → VERIFIED` as ACCOUNTS | ADR-0001 / R-2 | ⏳ | |
| e | `auditLogs` entry with someone else's `userId` | ADR-0002 / H-3 | ⏳ | |

| | |
|---|---|
| **Timestamp** | |
| **Classification** | ⏳ Pending Validation |

### RV-13 · Scheduled job produces output — the real D-2 check

| | |
|---|---|
| **Check** | Wait for `dailyJobs` (08:00 `Asia/Kolkata`) or trigger manually. Then inspect the `alerts` and `dailySummaries` collections |
| **Expected** | Documents appear |
| **🟠 Silent-Danger** | *"Ran successfully, produced nothing"* is **B-2** and is **indistinguishable from having nothing to alert about**. `runAlertEngine` wraps its body in a blanket `catch` (`server/backgroundJobs.ts:89-91`), so a missing index or permission failure reports success. **Check the function log for `FAILED_PRECONDITION` before concluding "no alerts to raise"** |
| **Note** | Empty **before** the first scheduled run is **C-3**, benign. Empty **after** a confirmed run is B-2 |
| **Actual** | |
| **Evidence** | Collection contents **and** the function execution log |
| **Timestamp** | |
| **Reference** | |
| **Classification** | ⏳ Pending Validation |

---

## 4. Capture protocol

Evidence is worthless if it cannot be re-read later. Capture **before** interpreting.

| Source | How | Store as |
|---|---|---|
| **Browser console** | DevTools → Console → right-click → *Save as…* Preserve log across navigation. **Include benign lines** — filtering hides context | `console_<RV-id>_<timestamp>.log` |
| **Network trace** | DevTools → Network → *Preserve log* **on** → right-click → *Save all as HAR*. **A HAR can contain bearer tokens — treat as secret; do not commit** | `network_<RV-id>_<timestamp>.har` |
| **Server / function logs** | Firebase console → Functions → Logs, or `firebase functions:log`. Capture a window covering the action, not just the error line | `functions_<RV-id>_<timestamp>.log` |
| **Screenshots** | Full window including the URL bar — the URL proves *which environment* | `screen_<RV-id>_<timestamp>.png` |
| **Firestore documents** | Console → document → copy JSON. For `auditLogs`, capture the **whole** document; `source` is the field that matters | inline in the Actual cell |

**Never paste secrets into this file.** Report configuration as present/absent, never by value —
same rule as APP-001's acceptance criteria. Redact bearer tokens and API keys from any excerpt.

---

## 5. Final summary

| Layer | Checkpoints | Result |
|---|---|---|
| Deployment | RV-01 … RV-04 | ⏳ |
| Application runtime | RV-05 … RV-08 | ⏳ |
| API boundary | RV-09 … RV-11 | ⏳ |
| Security boundary | RV-12 | ⏳ |
| Scheduled jobs | RV-13 | ⏳ |

**Overall verdict:** ⏳ **NOT RUN**

> **The verdict is PASS only if every checkpoint is ✅ Runtime Proven with captured evidence.**
> Any ⏳ makes the verdict **INCOMPLETE**, not PASS. Any ❌ makes it **FAIL**.
> An INCOMPLETE run must not be described as a successful deployment (**NN-7**).

### What each outcome closes

| If PASS | Consequence |
|---|---|
| RV-11 fully ✅ | **AUDIT C-1 closes** and **sprint criterion 3 is met** — the first of the four open criteria. Update `CURRENT_SPRINT.md` and `STABILIZATION_v1.1_RELEASE_REVIEW.md` §5 **with the evidence reference** |
| RV-12 fully ✅ | The deployed boundary is confirmed, not merely emulator-confirmed |
| RV-10 ✅ | D-1 ordering confirmed in the deployed topology |

**Still not met even on a full PASS:** criterion 2 (Workstream D), criterion 4 (F-1/F-2, business),
criterion 5 (T5). **A green run here does not close v1.1.**

---

## 6. On failure

1. **Stop at the failing layer.** Do not deploy the next one.
2. Add a row to [`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md) in the correct register
   (`A-` blocking, `B-` silent-danger, `C-` benign), with severity, evidence level and the exact
   verification check — per its §7.
3. If it is a **product defect** rather than a diagnostic, also open a
   [`DEFECT_LOG.md`](./DEFECT_LOG.md) entry and follow the defect lifecycle.
4. If it is a **non-blocking improvement**, add it to [`BACKLOG.md`](./BACKLOG.md) —
   **do not implement it.**
5. Rollback options per layer: [`STAGING_DEPLOYMENT_PLAN.md`](./STAGING_DEPLOYMENT_PLAN.md) §5.

**Already-known findings — record figures and move on, do not re-diagnose:** **B-4** (VO inflates
`grandTotal` — F-1), **B-5** (bill blocked at a different step than created — F-2), **B-6**
(concurrent receipts lose money — F-4 / T5), **C-1**, **C-3** … **C-8**. These are owned
elsewhere. Capturing exact figures for B-4 and B-5 **is** valuable — they inform the ADRs.
