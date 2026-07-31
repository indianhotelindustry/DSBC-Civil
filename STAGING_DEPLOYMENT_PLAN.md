# STAGING DEPLOYMENT PLAN — DSBC Civil v1.0.0-beta.2

**Date:** 2026-07-30 · **Target:** `dsbc-civil-staging` · **Scope:** deployment sequence, verification, rollback
**Prerequisites:** [provisioning](./FIREBASE_PROVISIONING_GUIDE.md) and [environment setup](./ENVIRONMENT_SETUP_GUIDE.md) complete

> **PRODUCTION IS OUT OF SCOPE.** Nothing here touches a production project.
> *(Supersedes the deployment half of the earlier `STAGING_SETUP_RUNBOOK.md`, now removed.)*

---

## 1. Pre-deployment gate

Run from the repository root, on `release/1.0.0-beta.2` (or `main` after the merge). **All five
must pass before deploying anything:**

```bash
npm run lint                        # → 0 errors
npm test                            # → 204 passed
npm run test:rules                  # → 177 passed   (needs JDK on PATH)
npm run build                       # → 3,759 modules
npm run build --prefix functions    # → lib/index.js ~1.3 MB
```

Then confirm you are pointed at staging — **this is the step that prevents a production accident:**

```bash
firebase use     # → Active Project: staging (dsbc-civil-staging)
```

| | Gate |
|---|---|
| ⬜ | Five validation gates green |
| ⬜ | `firebase use` reports **staging** |
| ⬜ | `.env.local` has all 7 `VITE_FIREBASE_*`, `VITE_ALLOW_CLIENT_FALLBACK="false"` |
| ⬜ | `VITE_FIREBASE_FIRESTORE_DATABASE_ID` **unset** |
| ⬜ | Working tree clean (`git status`) |

---

## 2. Deployment order — not a preference

**The boundary must exist before any data. The functions must exist before the app that calls
them.** Deploying hosting first would put a live application in front of an unenforced database —
precisely the condition audit finding **C-1** describes.

```
1. Firestore Rules      ← the trust boundary, first, always
2. Firestore Indexes    ← queries must be servable before jobs run
3. Cloud Functions       ← the authoritative money path
4. Hosting               ← the app that calls all of the above, last
```

### 2.1 Firestore Rules

```bash
npm run deploy:rules
```

**Expect:** `+  Deploy complete!`
**Verify:** console → Firestore → Rules shows **635 lines** and contains a `statusUnchanged()`
helper (that function is ADR-0001; its presence proves the current rules shipped).

> This single step is what makes 177 passing tests mean anything in a real environment. Until
> now the boundary existed only locally.

### 2.2 Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

**Expect:** the `alerts` composite index created.
**Verify:** console → Firestore → Indexes → Composite shows
`alerts` · `type ▲ relatedId ▲ timestamp ▲` · state **Enabled** (building takes a few minutes
even on an empty collection).

> This is blocker **D-2** closing for real. Note that the emulator cannot enforce composite
> indexes, so this console check is the **first actual proof** the index definition is correct.

### 2.3 Cloud Functions

```bash
npm run build --prefix functions
firebase deploy --only functions
```

> **Run `firebase deploy` from the repository root**, not from `functions/` — `firebase.json`
> lives at the root.

The first deploy prompts to enable **Cloud Build, Artifact Registry, Cloud Run, Eventarc and
Cloud Scheduler**. Accept all; it can take several minutes.

**Expect:** two functions in `asia-south1`:

| Function | Type | Trigger |
|---|---|---|
| `api` | HTTPS (v2 `onRequest`) | Hosting rewrites `/api/secure/**` and `/api/health` |
| `dailyJobs` | Scheduled (v2 `onSchedule`) | `0 8 * * *`, `Asia/Kolkata` |

**If the runtime is rejected** (blocker **N-1**): bump `functions/package.json` →
`engines.node`, `npm install --prefix functions`, rebuild, redeploy — **as a PR**, not an
in-place patch.

### 2.4 Hosting — last

```bash
npm run deploy:hosting     # runs vite build, then deploys
```

**Then, before anything else:**

```bash
curl -s https://<project>.web.app/api/health
# → {"success":true,"message":"ok"}
```

**This curl is the single most important verification in the whole plan.** JSON proves
Hosting → rewrite → Cloud Function → Express routing works end to end. Anything else — HTML, a
404, a 500 — means the rewrite or the function is misconfigured, and **no QA may start.**

---

## 3. Post-deployment verification

| # | Check | Pass |
|---|---|---|
| 3.1 | `curl .../api/health` | `{"success":true,"message":"ok"}` |
| 3.2 | Rules deployed | 635 lines, `statusUnchanged()` present |
| 3.3 | Index state | `alerts` composite **Enabled** |
| 3.4 | Functions listed | `api` + `dailyJobs`, `asia-south1` |
| 3.5 | Hosting serves the SPA | login page renders |
| 3.6 | Version | Version History shows **`v1.0.0-beta.2`** |
| 3.7 | Bundle has no fallback flag enabled | privileged ops must hit `/api/secure/*` (see 4.2) |

Then run [`FIRST_RUN_PLAYBOOK.md`](./FIRST_RUN_PLAYBOOK.md) to bootstrap the admin, the number
series and the seed data.

---

## 4. The claims this deployment finally verifies

Everything below was **impossible to verify locally**. `RUNTIME_READINESS_CHECKLIST.md` §10
lists them as unverified; this is where they get settled. Record each result.

### 4.1 C-1 — are the privileged operations actually server-authoritative?

Perform each of the four with the network tab open. Each must produce a **JSON** response from
its `/api/secure/*` route:

| Operation | Route | Role |
|---|---|---|
| Bill verify | `POST /api/secure/bills/:id/verify` | PM or ADMIN |
| Bill approve | `POST /api/secure/bills/:id/approve` | CEO or ADMIN |
| Payment release | `POST /api/secure/payments/:id/release` | ACCOUNTS or ADMIN |
| VO approve | `POST /api/secure/variation-orders/:id/approve` | CEO or ADMIN |

Also confirm each wrote an `auditLogs` entry with **`source: 'server'`** (Constitution WF-3).
`source: 'server'` is written only by `server/auditLog.ts` — it is the proof the server, not the
client, performed the transition.

**If all four pass, C-1 is closed on staging** — the sprint's central unverified claim.

### 4.2 Fail-loud actually fails loud

Block `/api/secure/*` in devtools (Network → block request URL), then attempt an approval.
**Expect** a clear typed error toast. **A silent success means `VITE_ALLOW_CLIENT_FALLBACK` was
`"true"` at build time and every QA result is invalid.**

### 4.3 D-1 — per-user rate limiting under a real proxy

Two different users each make ~20 privileged calls within one minute.
**Expect:** neither throttles the other. A 429 for user B caused by user A is a **P0
regression** — the D-1 fix was ineffective.

### 4.4 The `trust proxy` hop count

Inspect a function log for the client IP. `app.set('trust proxy', 1)` is a documented guess and
is **decorative** — the limiter keys on the uid, not the IP — but if the logged IP is a Google
front-end address rather than a real client, note it. Adjust the hop count only as a separate PR.

### 4.5 D-2 — the alert engine actually produces alerts

Create a bill with a past `billDate` (so it is overdue), then wait for the **08:00
Asia/Kolkata** `dailyJobs` run — or trigger it manually from the console.
**Expect:** documents appear in `alerts` and `dailySummaries`.

**This is the real D-2 regression check.** `runAlertEngine` swallows errors in a blanket
`catch`, so a missing or wrong index shows up as *"ran successfully, produced nothing"* — the
exact failure mode the index was committed to prevent.

### 4.6 The boundary denies what it should

From the **Firebase console** (not the app), attempt these direct writes. **Every one must be
denied:**

| Attempt | Closes |
|---|---|
| payment `APPROVED → RELEASED` | AUDIT C-2 · sprint criterion 1 |
| bill `APPROVED → PAID` | AUDIT C-3 |
| work order `PENDING → APPROVED` as a PM | ADR-0001 / R-1 |
| bill `DRAFT → VERIFIED` as ACCOUNTS | ADR-0001 / R-2 |
| `auditLogs` entry with someone else's `userId` | ADR-0002 / H-3 |

---

## 5. Rollback

| Layer | Rollback | Speed |
|---|---|---|
| **Rules** | `git checkout <prev-tag> -- firestore.rules && npm run deploy:rules`. Console also keeps rules history | Immediate |
| **Indexes** | Deletion is safe but slow to rebuild — generally leave in place | n/a |
| **Functions** | Redeploy the previous tag. Stateless; nothing to unwind | Minutes |
| **Hosting** | One-click rollback to a prior release in the console | Immediate |
| **Data** | Staging is disposable. Before any future *migration*: export Firestore first (NN-25) | — |

**Emergency financial-ops fallback:** `VITE_ALLOW_CLIENT_FALLBACK=true` + rebuild + redeploy
exists as a documented last resort. It **weakens** enforcement to client-side writes — use only
per the warning in `.env.example`, and never leave it on.

> Staging is disposable by design. If it reaches a confusing half-configured state, delete the
> project and re-run provisioning. That is cheaper than debugging it.

---

## 6. Explicit non-goals

This deployment does **not**:

| Not achieved | Why |
|---|---|
| Complete Platform Stabilization v1.1 | Satisfies exit criterion **3** only. Criteria 2, 4, 5 remain open |
| Fix **NN-5** | Concurrent receipts can still lose money (**F-4**). Untouched |
| Resolve the finance formulas | **F-1/F-2** remain open business decisions. QA will *observe* the VO divergence, not fix it |
| Deploy to production | Separate project, separate decision |
| Make the platform multi-tenant-safe | Company scoping is still client-side (Constitution §23) |
| Deliver double-entry accounting | Still derived reporting (**NN-7**) |

**What it does achieve:** the enforcement boundary becomes real, the authoritative backend
actually executes, and manual QA can begin against a genuine deployed system.
