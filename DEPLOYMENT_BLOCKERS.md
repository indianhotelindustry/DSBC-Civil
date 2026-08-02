# DEPLOYMENT BLOCKERS — DSBC Civil

**Date:** 2026-07-30 · **Assessed at:** `platform/stabilization-v1.1` @ `21b3ee8`
**Scope:** only items that **genuinely prevent** a first deployment, or that a decision-maker
must knowingly accept before one. Nice-to-haves are in
[`RELEASE_CANDIDATE_CHECKLIST.md`](./RELEASE_CANDIDATE_CHECKLIST.md).

> **⚠️ SUPERSEDED IN PART — 2026-08-02.** The claim below that there are "no remaining
> engineering blockers" **is no longer true.** The first real deployment attempt found
> **defect D-1: the Cloud Functions bundle cannot load** (`Dynamic require of "path" is not
> supported` — diagnostic **A-10**). It is a genuine engineering blocker, and it blocks
> criterion 3 and AUDIT C-1. See §A below.
>
> This is exactly what the "builds ≠ deploys" distinction was warning about, and it was only
> ever going to be found by deploying. The original text is kept for the record:

> **Bottom line:** there are **no remaining engineering blockers**. Every blocker is either
> **infrastructure** (provisioning, which requires the owner's Firebase account) or
> **business-policy** (decisions only the business can make). D-1 and D-2 — the two
> engineering blockers found during the readiness review — are **closed, merged and
> validated**.

---

## A · ENGINEERING BLOCKERS

### ❌ One outstanding — **defect D-1** (found 2026-08-02, first real deploy attempt)

| Blocker | Status | Detail |
|---|---|---|
| **Defect D-1** — the Cloud Functions bundle **cannot be loaded by Node**. `firebase deploy --only functions` fails at the codebase-analysis step | ❌ **OPEN — awaiting approval to fix** | ESM output with inlined CommonJS deps; `depd` calls `require('path')` at module scope and ESM has no `require`. Diagnostic **A-10**; defect **D-1** in `DEFECT_LOG.md` |

**Blocks:** RV-03, RV-04, AUDIT **C-1**, sprint **criterion 3**, and every privileged operation.

**Gate weakness that hid it:** `npm run build --prefix functions` only proves esbuild *emitted*
a file. It never loads it. The bundle has never successfully loaded in any environment, yet was
recorded as ✅ Runtime Proven since 2026-07-29.

### Previously closed (unchanged)

| Former blocker | Status | Closed by |
|---|---|---|
| **D-1** — rate limiter keyed on the proxy IP; every user shared one 30/min bucket, taking the money path down at the 31st org-wide request | ✅ **CLOSED** | `fix/trust-proxy-rate-limit-key` → keys on the verified uid. Merge `e239e61` |
| **D-2** — `alerts` composite index missing and no `firestore.indexes.json`; the alert engine would report success while producing nothing | ✅ **CLOSED** | `fix/firestore-indexes` → index committed, wired into `firebase.json`, test-pinned. Merge `692174f` |
| **R-1 / R-2** — PM could self-approve a work order; ACCOUNTS could self-verify a bill | ✅ **CLOSED** | ADR-0001 |
| **H-3** — audit-log authorship forgeable (NN-12) | ✅ **CLOSED** | ADR-0002. Merge `21b3ee8` |
| **Functions package never built** | ✅ **CLOSED** | Verified: 1.3 MB ESM bundle exporting `api` + `dailyJobs` |

All five gates green on the integrated branch: `tsc` 0 errors · 204/204 unit · 177/177 rules
· build 3,759 modules · functions bundle builds.

### Conditional — becomes a blocker only under a specific choice

| ID | Item | Becomes blocking if… | Resolution |
|---|---|---|---|
| **D-3** | Cloud Functions resolve the Firestore database only from `firebase-applet-config.json`, which is not deployed with the functions package — so they always bind to `(default)` | …the project is created with a **named** (non-default) Firestore database. Client and functions would then read different databases and every privileged operation would 404 | **Use the `(default)` database** (already the recommendation in `docs/FIREBASE_MIGRATION.md` §3.1). Decide at provisioning; no code change needed if `(default)` is used |
| **N-1** | `functions/package.json` pins `engines.node: "20"` | ⏱️ **NOW DATED — verified at deploy 2026-08-02.** Google's own warning, captured verbatim: *"Runtime Node.js 20 was deprecated on 2026-04-30 and will be decommissioned on **2026-10-30**, after which you will not be able to deploy without upgrading."* **Deploys are still accepted today** — this did not cause defect D-1 — but there is a hard ~3-month clock | Plan the runtime bump before 2026-10-30, as a governed PR. Also flagged at deploy: `firebase-functions` (6.1.1) is outdated and *"there will be breaking changes when you upgrade"* — do **not** bundle that upgrade with the D-1 fix |
| **S-1** | No `storage.rules` committed; `getStorage()` is initialized but unused | …Firebase Storage is **enabled** at provisioning — it would run on permissive defaults | Leave Storage **disabled** until a feature needs it, or commit least-privilege rules first |

---

## B · INFRASTRUCTURE BLOCKERS

**These are the real blockers. All require the repository owner's Google/Firebase account —
they cannot be performed from this repository.**

| ID | Blocker | Effect until resolved | Owner action |
|---|---|---|---|
| **I-1** | **Firebase project does not exist.** `.firebaserc` = `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` | **Every** `firebase deploy` command fails immediately. This is the intended fail-loud guard against deploying to the wrong project | Create the project(s) per `docs/FIREBASE_MIGRATION.md` §1; set `.firebaserc` |
| **I-2** | **No staging project.** Constitution **DEP-2** requires one | First deploy would be straight to production, with no rehearsal of the money path | Create `dsbc-civil-staging` alongside prod; deploy and smoke-test there first |
| **I-3** | **`VITE_FIREBASE_*` not set** (7 keys). `firebase-applet-config.json` holds empty placeholders by design | The built SPA cannot reach Firebase at all. Values are **baked at build time**, so they must exist in the *build* environment | Populate `.env.local` locally and CI/build secrets for deploys |
| **I-4** | **Auth providers not enabled**; hosting domains not in the authorized list | Nobody can sign in; the app is unusable even if deployed | Enable Google + Email/Password; add hosting domains to Authorized domains |
| **I-5** | **Firestore database not created**; rules and indexes never deployed | No data layer, and — critically — **no trust boundary**. All the enforcement work in this sprint lives in `firestore.rules`, which does nothing until deployed | Create `(default)` database, then `npm run deploy:rules` **before any data exists** |
| **I-6** | **No first ADMIN user; WO Number Series unconfigured** | The app deploys but is inoperable: `workOrderService.create` hard-blocks without a configured series | Sign in once → promote that `users/{uid}` to `role: ADMIN`, `status: ACTIVE` in the console → configure Masters → WO Number Series |

**Ordering constraint (non-negotiable):** deploy **rules and indexes before hosting**. The
boundary must never lag the application. `RELEASE_CANDIDATE_CHECKLIST.md` encodes the order.

---

## C · BUSINESS-POLICY BLOCKERS

**These do not prevent the deploy mechanically. They are decisions the business must take
knowingly — and two of them create data that may later need restating.**

| ID | Decision | Why it matters before first deployment | Status |
|---|---|---|---|
| **F-1** | **Variation-Order approval formula** — unify with the WO form formula, or ratify the current divergence as intentional? | The VO path omits the advance and retention subtractions the form applies, so an approved VO **inflates the stored `grandTotal`** — which is also the bill-approval ceiling. **Deploying first means production WOs with approved VOs are created under a formula that may later change, requiring restatement.** | ⛔ **Awaiting business approval.** ADR-mandatory (AMENDMENT-001 Art. VII #6) |
| **F-2** | **The one authoritative overbilling ceiling** — gross BOQ or net `grandTotal`? | Three ceilings currently apply to the same work order. Direction of error is **parameter-dependent**: a bill can pass creation then be blocked at approval, *or* be approved beyond gross contract value. Historical bills may validate differently under whichever is chosen | ⛔ **Awaiting business approval.** Must be decided **together with F-1** — F-1 changes the value F-2's ceiling reads |
| **F-3** | **Accept the single-operator trust model for beta?** | Company/project scoping is **client-side after a full collection read**; roles come from a client-readable `users/{uid}` document, not custom claims. Safe for a trusted team; **not** safe for untrusted multi-tenant use | ⚠️ Decision: restrict beta to trusted operators (the documented posture) |
| **F-4** | **Accept NN-5 exposure (non-atomic money mutations) for beta?** | Sprint criterion 5 is **not met**. `sales.totalReceived` and `saleSchedules.paidAmount` use read-modify-write, so **two concurrent receipts on one sale can silently lose money**. Low likelihood at beta volume with few operators; the consequence is a wrong balance | ⚠️ **Genuine open risk.** Either accept knowingly for beta, or land T5 first |
| **F-5** | **npm advisory disposition** — 1 critical, 6 high, 10 moderate, 2 low | `react-router-dom` (high, RSC-mode CSRF) is a **runtime** dependency in the shipped bundle. The advisory concerns RSC mode, which this app does not use, so exposure is likely nil — **but that needs stating explicitly, not assuming** | ⚠️ Record a per-advisory disposition before deploy. Do **not** run `npm audit fix --force` — it would move `react-router-dom` and `vite` majors outside a governed change |

---

## D · Explicitly NOT blockers

Recorded so they are not mistaken for blockers later:

| Item | Why it is not a blocker |
|---|---|
| Platform Stabilization v1.1 criteria 3–6 open | Criterion 3 *is* the deployment. 4 is business-gated (F-1/F-2). 5 is F-4. 6 was always a stretch goal |
| Client fallback code present in the production bundle | Unreachable at runtime — `handleServerUnavailable()` throws. Bundle hygiene and a latent-regression risk, not a live hole |
| `trust proxy = 1` hop count unverified | Decorative. Affects only `req.ip` in logs; the limiter keys on the uid |
| `/api/admin/*` endpoints unauthenticated | Not exposed by the Hosting rewrites (`/api/secure/**` and `/api/health` only), so unreachable in the deployed topology. Must be gated **before** that rewrite is ever widened |
| Alert-engine failures still silent | Degrades observability, does not prevent deployment. Needs the un-awaited call sites fixed with the handler |
| No `develop` branch | Process gap, not a deployment gap |
| Single 2.12 MB JS chunk | Pre-existing performance item, tracked in `audit/PERFORMANCE_AUDIT.md` |
| No favicon / logo / manifest | Cosmetic; commission before public exposure |
| No ESLint config | Chartered (COD-2); `tsc` + tests + rules tests gate CI today |
| `server/` has no test tier | Real coverage gap, chartered as `tests/functions/`. Does not prevent deployment |

---

## E · Summary

| Category | Count | Who resolves |
|---|---|---|
| **Engineering blockers** | **0** | — |
| Engineering, conditional | 3 (D-3, N-1, S-1) | Engineering, at provisioning time |
| **Infrastructure blockers** | **6** (I-1 … I-6) | **Repository owner** — requires the Firebase account |
| **Business-policy decisions** | **5** (F-1 … F-5) | **Business owner**; F-1 + F-2 are ADR-mandatory and must be taken together |

**The critical path to first deployment runs entirely through §B.** Engineering has no
remaining work that blocks a deploy. The two decisions that most deserve attention before
data exists are **F-1/F-2** — because production records created under the current VO
formula may later require restatement — and **F-4**, the one genuinely open money-integrity
risk (NN-5).
