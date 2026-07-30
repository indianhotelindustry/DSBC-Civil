# RELEASE CANDIDATE CHECKLIST — DSBC Civil first deployment

**Date:** 2026-07-30 · **Candidate:** `platform/stabilization-v1.1` @ `21b3ee8`
**Purpose:** every remaining action before the first commercial beta deployment, in
dependency order. Nothing here is optional unless marked so.

**Legend:** 🔧 engineering · 🏗️ infrastructure (owner's Firebase/GitHub account) ·
💼 business decision · ✅ already done

---

## Stage 0 — Already complete (do not redo)

| ✅ | Item | Evidence |
|---|---|---|
| ✅ | Canonical repository published, baseline tagged `v1.0.0-beta.1` (annotated) | `FIRST_PUSH_REPORT.md` |
| ✅ | Three fix branches reviewed, validated, merged into the milestone branch | `STABILIZATION_v1.1_RELEASE_REVIEW.md` |
| ✅ | D-1 closed — limiter keys on the authenticated uid | merge `e239e61` |
| ✅ | D-2 closed — `alerts` composite index committed + wired + test-pinned | merge `692174f` |
| ✅ | ADR-0001 + ADR-0002 accepted and implemented; **no unmitigated NN violation left in the rules** | `governance/adr/` |
| ✅ | Rules boundary proven — 177 emulator tests, allow **and** deny | `RULES_TEST_REPORT.md` |
| ✅ | Cloud Functions package builds — 1.3 MB ESM, exports `api` + `dailyJobs` | verified |
| ✅ | CI validates tsc · unit · rules (JDK 21) · build · functions bundle | `.github/workflows/ci.yml` |
| ✅ | No secrets, credentials, or API keys committed | `FIRST_PUSH_REPORT.md` §6 |
| ✅ | Documentation cross-references resolve (0 broken across all markdown) | verified |

---

## Stage 1 — Repository governance (do this **first**)

Merging to a public `main` with no protection sets a precedent that is hard to undo.

| | Action | Notes |
|---|---|---|
| 🏗️ | **Enable branch protection on `main`** | Require a PR; require the `verify`, `rules` and `functions-build` checks to pass; **prevent force-push**; prevent deletion. This is what makes `GIT_STRATEGY.md` §1 real rather than aspirational |
| 🏗️ | **Protect tags matching `v*`** | Releases must be immutable. Prevents an accidental retag of `v1.0.0-beta.1` |
| 🏗️ | Require at least 1 PR review | Honors NN-28. If working solo, at minimum require the CI checks |
| 🏗️ | Enable **Dependabot** alerts + security updates | 1 critical / 6 high advisories currently outstanding |
| 🏗️ | Enable **CodeQL** (JavaScript/TypeScript) | Free for this repo; complements the rules tests |
| 🏗️ | *(Optional)* Enable secret scanning + push protection | Belt-and-braces; the repo is currently clean |
| 🔧 | Decide the `main` promotion path — **Option A** (create `develop`, keep `main` at baseline) or **Option B** (cut `release/1.0.0-beta.2`, tag an interim increment) | See `STABILIZATION_v1.1_RELEASE_REVIEW.md` §7. **Do not label either as "v1.1 complete."** |

---

## Stage 2 — Business decisions (needed before *data* exists, not before the deploy)

Deploying first is possible; these decide whether early production data will later need
restating.

| | Action | Consequence of deferring |
|---|---|---|
| 💼 | **Resolve F-1 — the Variation-Order approval formula** (ADR-mandatory) | Every WO with an approved VO gets an inflated `grandTotal`, which is also the bill-approval ceiling. Deferring means possible **restatement** of real records later |
| 💼 | **Resolve F-2 — the one authoritative overbilling ceiling** (ADR-mandatory) | Three ceilings apply to the same WO. **Must be decided together with F-1** — F-1 changes the value F-2 reads |
| 💼 | **Accept or reject F-4 — NN-5 exposure** (non-atomic money mutations) | Two concurrent receipts on one sale can silently lose money. Low likelihood at beta volume; if unacceptable, land T5 first |
| 💼 | **Confirm F-3** — beta restricted to trusted operators | Company scoping is client-side; roles are client-readable. Not safe for untrusted multi-tenant use |
| 💼 | **Record F-5** — a per-advisory disposition for the 1 critical + 6 high npm advisories | `react-router-dom` is a runtime dep. Do **not** `npm audit fix --force` |

---

## Stage 3 — Firebase provisioning 🏗️

| | Action | Reference |
|---|---|---|
| 🏗️ | Create **staging** project (`dsbc-civil-staging`) — Constitution **DEP-2** | `docs/FIREBASE_MIGRATION.md` §1 |
| 🏗️ | Create **production** project (`dsbc-civil-prod`) | same |
| 🏗️ | Use the **`(default)`** Firestore database, region matched to users (legacy used `asia-south1`) | Avoids blocker **D-3** entirely |
| 🏗️ | Set `.firebaserc` to the real project ID | Replaces `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` |
| 🏗️ | Enable Auth: **Google** + **Email/Password** | `FIREBASE_MIGRATION.md` §2 |
| 🏗️ | Add hosting domains to **Authorized domains** | Sign-in fails without this |
| 🏗️ | Populate the 7 `VITE_FIREBASE_*` values in `.env.local` **and** the CI/build environment | Baked at **build** time, not runtime |
| 🏗️ | Leave **Storage disabled** unless needed — no `storage.rules` exists (blocker S-1) | Or commit least-privilege rules first |
| 🔧 | Confirm Cloud Functions still accepts the **Node 20** runtime (blocker N-1) | `functions/package.json` → `engines.node` |

---

## Stage 4 — Staging deployment and rehearsal 🏗️

**Do the whole sequence on staging before production. This is the rehearsal of the money path.**

| | Action | Why the order matters |
|---|---|---|
| 🏗️ | `npm run deploy:rules` | **The trust boundary precedes all data.** Everything this sprint built lives here and does nothing until deployed |
| 🏗️ | `firebase deploy --only firestore:indexes` | Closes D-2 in reality. Without it the alert engine silently produces nothing |
| 🏗️ | `cd functions && npm ci && npm run deploy` | Deploys `api` + `dailyJobs` to `asia-south1`. **This is what finally closes C-1** |
| 🏗️ | Verify `GET /api/health` returns `{success:true}` **through the Hosting rewrite** | Proves the rewrite → function path works end to end |
| 🏗️ | `npm run deploy:hosting` | Env vars must already be in the build environment |
| 🏗️ | Bootstrap: sign in once → promote that user to `role: ADMIN`, `status: ACTIVE` | Blocker I-6 |
| 🏗️ | Configure **Masters → WO Number Series** | `workOrderService.create` hard-blocks without it |
| 🏗️ | Seed companies and masters | Masters page |

### Stage 4b — Mandatory smoke tests (the evidence that C-1 is closed)

| | Test | Pass criterion |
|---|---|---|
| 🔧 | **Money path end to end**: create WO → CEO approve → create bill → PM verify → CEO approve → create payment → CEO approve → ACCOUNTS release | Every privileged step succeeds **and is served by the function**, not a client fallback |
| 🔧 | Confirm each privileged step wrote an `auditLogs` entry with `source: 'server'` | Constitution WF-3 |
| 🔧 | **Negative test — the whole point of the sprint:** with the Firebase console/SDK directly, attempt payment `APPROVED → RELEASED`, and bill `APPROVED → PAID` | **Both must be DENIED** by rules |
| 🔧 | **ADR-0001 negative:** as a PM, attempt to set a PENDING work order to `APPROVED` | Must be **DENIED** |
| 🔧 | **ADR-0001 positive:** as CEO approve a WO; as PM edit a PENDING WO's title; as ACCOUNTS edit a DRAFT bill amount; as PM verify a DRAFT bill | All must **SUCCEED** (proves tightening ≠ lockout) |
| 🔧 | **ADR-0002 negative:** write an `auditLogs` entry with someone else's `userId` | Must be **DENIED** |
| 🔧 | **D-1 verification:** have two different users each make ~20 privileged calls in one minute | Neither is throttled by the other — proves per-user keying works behind the real proxy |
| 🔧 | Inspect a function log for the real client IP; confirm `trust proxy = 1` resolves sensibly | If wrong, adjust the hop count. Nothing security-critical depends on it |
| 🔧 | Wait for the 08:00 Asia/Kolkata `dailyJobs` run | `alerts` and `dailySummaries` **populate** — the real D-2 regression check |
| 🔧 | Confirm `VITE_ALLOW_CLIENT_FALLBACK` is unset/`false` in the production build | Fail-loud must be active |

---

## Stage 5 — Production deployment 🏗️

| | Action |
|---|---|
| 🏗️ | Repeat Stage 4 against the production project, in the same order |
| 🏗️ | Re-run the full Stage 4b smoke suite against production |
| 🔧 | Record the deployment in **Version History** (`appVersions`) |
| 🔧 | Tag the release (annotated) and publish GitHub release notes from `CHANGELOG.md` |
| 🔧 | Update `RELEASES.md` + `CHANGELOG.md`; refresh `docs/PROGRAM_STATE.md` |
| 💼 | Confirm operators are the trusted set agreed in F-3 |

---

## Stage 6 — Post-deployment engineering follow-ups 🔧

Not blockers, but each closes a known gap. Ordered by value.

| | Item | Closes |
|---|---|---|
| 🔧 | **T5 — atomic money mutations** (`runTransaction` / `FieldValue.increment`) + concurrent-receipt test | NN-5, sprint criterion 5, blocker F-4 |
| 🔧 | Compile out the client fallback behind `import.meta.env.DEV` | Sprint criterion 2, DEP-4 |
| 🔧 | Add a coarse IP-keyed limiter **in front of** `requireAuth` | D-1 residual risk (invalid-token floods) |
| 🔧 | `tests/functions/` — cover amounts, cumulative ceilings, transactional atomicity | The largest coverage gap; rules structurally cannot test these |
| 🔧 | Make alert-engine failures loud (fix the un-awaited `server.ts` call sites **with** the handler) | NN-14 |
| 🔧 | Gate `/api/admin/*` behind auth + admin role | AUDIT SECURITY H-2 (latent) |
| 🔧 | `ledgerUtils.test.ts` — zero tests today | Constitution TEST-1, TECH-DEBT D-3 |
| 🔧 | Extend rules tests to the Sales collections | Largest untested rules surface |
| 🔧 | ESLint config + enable the CI step | COD-2 |
| 🔧 | Idempotency keys on the money operations | NN-23 |

---

## Go / No-Go

**Engineering: GO.** Zero engineering blockers. Five gates green, 381 automated tests, two
governed ADRs implemented and validated, functions bundle verified.

**Deployment: NO-GO until Stage 3 completes.** Six infrastructure blockers, all requiring the
owner's Firebase account.

**Recommended sequence:** Stage 1 (governance) → Stage 2 (F-1/F-2 at minimum) → Stage 3 →
Stage 4 on **staging** → Stage 5.

**The one thing not to shortcut:** deploy **rules and indexes before hosting**, on both
projects. Every enforcement guarantee this sprint produced lives in `firestore.rules` and is
inert until deployed — an application live ahead of its boundary is the exact condition the
audit's C-1 finding describes.
