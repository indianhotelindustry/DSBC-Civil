# STABILIZATION v1.1 — RELEASE REVIEW

**Date:** 2026-07-30 · **Role:** Release Manager · **Branch reviewed:** `platform/stabilization-v1.1` @ `21b3ee8`
**Canonical repo:** https://github.com/indianhotelindustry/DSBC-Civil

> **Reviewer's disclosure (NN-7).** The three fix branches under review were authored in
> earlier sessions of this same engagement. They have been reviewed adversarially — looking
> for defects rather than confirming intent — and this review records **three concerns and
> one materially incorrect prior claim** found in the process. An independent human
> maintainer should still gate the merge to `main`.

---

## 1. Headline

**All three fix branches are reviewed, validated and merged into
`platform/stabilization-v1.1`. All five gates are green.**

**But Platform Stabilization v1.1 is NOT complete by its own Definition of Success.** Of the
six exit criteria in `CURRENT_SPRINT.md`, **one is fully met, one is partially met, and four
are not met.** See §5. Recommending this branch to `main` as "v1.1 complete" would be false.

---

## 2. Validation evidence

Run on the integrated branch after all three merges (JDK 21.0.11, firebase-tools 15.22.4):

| Gate | Command | Result |
|---|---|---|
| TypeScript | `tsc --noEmit` | ✅ **0 errors** |
| Unit tests | `npm test` | ✅ **204 / 204** (10 files) |
| Rules tests | `npm run test:rules` | ✅ **177 / 177** (6 files) |
| Production build | `npm run build` | ✅ 3,759 modules |
| Functions bundle | `npm run build --prefix functions` | ✅ 1.3 MB ESM |

**Total automated tests: 381.** Full validation was also run after **each** merge
individually, not only at the end:

| After merge | tsc | Unit | Rules | Build | Functions |
|---|---|---|---|---|---|
| 1 — D-1 | ✅ | ✅ 199 | ✅ 170 | ✅ | ✅ |
| 2 — D-2 | ✅ | ✅ **204** | ✅ 170 | ✅ | — |
| 3 — ADR-0002 | ✅ | ✅ 204 | ✅ **177** | ✅ | ✅ |

Rules-suite composition at `21b3ee8`: bills 38 · workOrders 31 · payments 30 ·
auditAndServerOnly 30 · paymentRequests 26 · variationOrders 22.

---

## 3. Branch reviews

All three branched from the same base (`cdedd1b`), are independent, and required no rebase.
Merged with `--no-ff` so each branch's history is preserved and auditable — no published
history was rewritten, nothing squashed.

### 3.1 `fix/trust-proxy-rate-limit-key` (`e3d5596`) — **APPROVED with a documented residual risk**

**Change:** the secure-route limiter keys on the authenticated uid instead of `req.ip`;
`requireAuth` hoisted to router level; per-route duplicates removed;
`app.set('trust proxy', 1)` added.

**Verified**
- *Middleware ordering* — `requireAuth` → `secureLimiter` → `requireRole` → handler.
  Correct: `req.uid` must exist before the limiter reads it.
- *No authorization regression* — every one of the four routes already carried
  `requireAuth`; hoisting is behaviour-preserving. `requireRole` still applied per route
  with unchanged role sets (PM/ADMIN, CEO/ADMIN, ACCOUNTS/ADMIN, CEO/ADMIN).
- *Key correctness* — `req.uid` comes from `admin.auth().verifyIdToken()`, so it is
  unspoofable and independent of proxy topology.
- *The rejected alternative is genuinely rejected* — confirmed against installed
  `express-rate-limit@8.5.2` source: `trust proxy: true` throws
  `ERR_ERL_PERMISSIVE_TRUST_PROXY`. Evidence, not assumption.
- *Tests remain valid* — no test asserted IP-based limiting; nothing became stale.

**⚠️ CONCERN 1 — DoS posture regression (accepted, not a blocker).**
Rate limiting now happens *after* token verification, so a flood of syntactically valid but
invalid tokens is **no longer rate-limited** and costs one `verifyIdToken()` each.
Previously such a flood was capped at 30/min — but only because of the very bug being
fixed (one global bucket). Requests with **no** `Authorization` header still short-circuit
to 401 with zero crypto, and the Firestore `users/{uid}` read happens only after a token
verifies, so the exposure is bounded to signature verification with a cached JWKS.
**Recommendation:** add a coarse IP-keyed limiter *in front* of `requireAuth` (high
threshold, using the library's `ipKeyGenerator`) as a follow-up. Not required for first
deployment — Google's edge absorbs volumetric floods and the routes are not yet live.

**⚠️ CONCERN 2 — dead fallback in the key generator (cosmetic).**
`?? 'unauthenticated'` is unreachable, because `requireAuth` guarantees `uid`. Harmless,
but note that *if* it ever became reachable it would bucket all anonymous callers together —
the exact shared-bucket bug in miniature. Prefer failing closed if the ordering ever changes.

**⚠️ CONCERN 3 — zero automated coverage.**
`server/` has no test tier. This security-relevant change is verified only by `tsc`, the
bundle build, and reasoning. Real gap; it is the strongest argument for `tests/functions/`.

**Note:** `trust proxy = 1` is now **decorative** — it affects only `req.ip` in logs, since
the limiter no longer reads it. The hop count is still unverified. That is correctly
documented in the code, and nothing security-critical depends on it.

### 3.2 `fix/firestore-indexes` (`d809585`) — **APPROVED**

**Change:** adds `firestore.indexes.json` (one composite index), wires
`firestore.indexes` into `firebase.json`, adds 5 hermetic tests, extends the `npm test`
include to `tests/config/**`.

**Verified**
- *Index correctness* — `alerts(type ASC, relatedId ASC, timestamp ASC)`. Matches the query
  in `server/backgroundJobs.ts:20-25` exactly: two equality filters first, range filter
  last. All ASCENDING, correct for a `>=` filter with implicit `orderBy timestamp ASC`.
- *`queryScope: "COLLECTION"`* — correct. The query is `db.collection("alerts")`, a single
  collection, not a collection group.
- *No unnecessary indexes* — **confirmed by a full sweep** of every Firestore query in
  `server/` and `src/services/`. Every other query is single-field equality, served by
  automatic single-field indexes. `bills.where("status","in",[…])` is single-field and needs
  no composite. **Exactly one composite index is required, and exactly one is declared.**
- *`firebase.json` integration* — the `rules` pointer is preserved alongside `indexes`; they
  deploy as a set. Pinned by a test.
- *Alert-engine compatibility* — the index is derived from the query, not guessed.

**⚠️ Known limitation (correctly disclosed in the code and the test file):** the Firestore
emulator does **not** enforce composite indexes — it serves any query. The committed tests
therefore prove the index is **declared**, not **sufficient**. Only a real deploy proves
sufficiency. This is a limitation of the tooling, not of the change.

**Not fixed, and correctly disclosed:** `runAlertEngine` still swallows errors in a blanket
`catch`, so an index problem would still surface as "success with zero alerts". The commit
explains why making it throw is unsafe today — `server.ts` calls it un-awaited at startup, so
on Node 20 a rejection would terminate the dev server. Fixing it requires the call sites and
the handler together. Correctly deferred rather than half-done.

### 3.3 `fix/audit-log-authorship` (`41ee995`) — **APPROVED — implementation matches ADR-0002 exactly**

**Change:** `auditLogs` create now requires
`request.resource.data.userId == request.auth.uid`.

**Verified against ADR-0002 §2**
- The diff adds **exactly** the one approved conjunct. Nothing else in the block changed:
  read gating (`isAdmin() || isSuperAdmin() || isCEO()`) and immutability
  (`update, delete: if false`) are byte-identical.
- **Scope discipline confirmed** — the ADR explicitly excluded entry-shape validation,
  server-only audit writes, and read-access changes. None were touched. No scope creep.
- *Client write path* — independently re-verified: `src/services/db.ts:227` `logAction()` is
  the **only** client writer, and it writes `userId: auth.currentUser.uid`. Satisfies the
  new conjunct for every role.
- *Admin SDK behaviour* — `server/auditLog.ts` writes via `db` from `firebaseAdmin.ts`
  (Admin SDK), which **bypasses rules entirely**. Server audit writes cannot regress, and
  the server may still legitimately attribute an entry to the acting user.
- *Audit integrity* — immutability unchanged and still test-covered. The change closes the
  *authorship* hole; entries remain untamperable.
- *Tests* — the H-3 characterization test flipped to a genuine denial (it was built to fail
  the moment the rule was fixed — that failure is the proof). Plus 3 further denials
  (cross-attribution, empty `userId`, missing `userId`) and 4 allow-side guards proving
  `logAction()` still works for PM/ACCOUNTS/CEO/ADMIN.

**Honest caveat, correctly recorded in the ADR:** entries written before this change carry
no authorship guarantee. The fix is forward-only and cannot retroactively authenticate
stored entries.

**Outcome:** with ADR-0001 already merged, **no unmitigated Non-Negotiable violation remains
in `firestore.rules`.**

---

## 4. A materially incorrect prior claim, now corrected

`DEPLOYMENT_READINESS_REPORT.md` D-1 (written by me in an earlier session) recommended:

> *"Fix (one line, in `createApp()` before the routes): `app.set('trust proxy', 1);`"*

**That recommendation was wrong**, and reviewing the installed library source is what showed
it. A numeric hop count cannot be verified without a deployed environment, so it could have
*appeared* to fix D-1 while silently leaving every user in one bucket. The implemented fix
(keying on the verified uid) is correct regardless of proxy topology. The report has been
superseded by the implementation and this review; the original text remains as the record of
what was believed at the time.

**Lesson for the register:** a "one-line fix" in a deployment report is a hypothesis until
the library's actual behaviour is read.

---

## 5. Sprint Definition of Success — honest scorecard

From `CURRENT_SPRINT.md` §"Definition of success (sprint exit criteria)". **The sprint is
complete only when all six hold.** They do not.

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | A direct client-SDK attempt to release an over-payable payment or mark a bill PAID without a payment is **rejected by `firestore.rules`**, proven by a rules-unit-test | ✅ **MET — exceeded** | 177 rules tests. The boundary denies the RELEASE and PAID *transitions themselves*, for every role and every amount — stronger than an amount check |
| 2 | The production build contains **no code path** that performs a money transition without the authoritative check | 🟡 **PARTIALLY MET** | Behaviour is correct (`secureApi` fails loud). But **the fallback code still ships**: bundle inspection found the string literals `"must be DRAFT to verify"` and `"would exceed remaining payable"` in `dist/assets/index-*.js`. Function names are minified, not tree-shaken. `T2`'s `import.meta.env.DEV` compile-out guard (Constitution DEP-4) was never applied |
| 3 | The four privileged operations run as **deployed Cloud Functions** with transactional validation, each emitting an audit entry | ❌ **NOT MET** | Nothing deployed. Firebase unprovisioned. This is **C-1** |
| 4 | Every money formula has exactly **one** implementation in `src/lib/` imported by UI + functions; **the VO-approval divergence is gone**; a test pins form == function | ❌ **NOT MET** | Formulas are centralized, but the VO divergence is deliberately **preserved**. The test pins that the divergence *exists* (`viaVo.grandTotal > viaForm.grandTotal`), the opposite of "form == function". Blocked on finance approval, not engineering |
| 5 | Money mutations for receipts/schedules use atomic increments/transactions; a concurrent-receipt test proves no lost money | ❌ **NOT STARTED** | T5 untouched. `sales.totalReceived` and `saleSchedules.paidAmount` still read-modify-write (NN-5 violation) |
| 6 | *(Stretch)* A first `journalEntries` posting for bill-approve and payment-release, reconciled Tier-3 == Tier-2 | ❌ **NOT STARTED** | Explicitly a stretch goal; correctly out of scope |

**Verdict: 1 met, 1 partial, 4 open.** What this branch represents is a **well-validated
increment** of Platform Stabilization v1.1 — the enforcement boundary and the deployment
blockers — not the completed sprint. Criteria 3 and 5 are real engineering work; criterion 4
is a business decision; criterion 2 is a small, genuine gap.

---

## 6. Phase 4 checklist — objective verification

| Objective | Status | Evidence |
|---|---|---|
| **Boundary enforcement** | ✅ Verified | 177 rules tests; all four money transitions denied to every client role; R-1/R-2/H-3 closed |
| **Fail-loud behaviour** | ✅ Verified (runtime) · 🟡 not compile-time | `handleServerUnavailable()` throws unless explicitly flagged; but the fallback bodies still ship (§5 #2) |
| **Cloud Functions build** | ✅ Verified | 1.3 MB ESM bundle exporting `api` + `dailyJobs`; cross-package imports resolve |
| **Firestore Rules** | ✅ Verified | 623 → 635 lines; two accepted ADRs; no unmitigated NN violation remains |
| **Rules test suite** | ✅ Verified | 177/177, allow **and** deny, 10 role personas, fixed clock |
| **Documentation** | ✅ Verified | 0 broken cross-references across all markdown; historical documents marked, not rewritten |
| **Deployment readiness** | 🟡 Engineering-ready, infrastructure-blocked | D-1 and D-2 closed; provisioning outstanding. See `DEPLOYMENT_BLOCKERS.md` |
| **Atomic money mutations** | ❌ Not started | NN-5 still violated in the sales/receipt path |
| **Single money formula** | ❌ Blocked on business | Two finance ADRs outstanding |

---

## 7. Phase 5 — PR review: `platform/stabilization-v1.1` → `main`

Reviewed as an independent maintainer would.

**Commit history — clean.** Three `--no-ff` merge commits over three single-purpose fix
commits, on top of two publication commits. Conventional Commits throughout. Every governed
change carries a `Refs: ADR-000N` trailer as `GIT_STRATEGY.md` §2 requires. No rewritten
history, no force-push, nothing squashed.

**Merge cleanliness — clean.** Zero conflicts. All three branches shared one base and
touched disjoint files.

**Documentation — synchronized.** Every superseded claim is marked rather than deleted;
`audit/` remains a frozen v0.9.0 snapshot with a superseded-figures table.

**ADR references — complete.** ADR-0001 and ADR-0002 are Accepted, indexed, and each carries
an implementation record. Both were preceded by a documented pre-merge impact analysis.

**Validation evidence — complete.** Five gates, after every individual merge and again on
the integrated result.

### Recommendation

**⚠️ DO NOT merge to `main` labelled as "Platform Stabilization v1.1 complete."** That claim
would be false (§5).

Two defensible paths — **the choice is the owner's, not mine**:

**Option A — recommended: keep `main` at the baseline; open `develop`.**
`GIT_STRATEGY.md` §1 states `main` accepts merges *"only from `release/*` or `hotfix/*`"* and
that milestone branches are promoted *"to `develop`/`release`"*. There is no `develop` branch
yet. Creating it and merging the milestone branch there follows the documented flow exactly,
keeps `main` genuinely releasable, and defers the `main` merge until v1.1 actually closes.
*Cost:* the GitHub default branch keeps showing the baseline.

**Option B — acceptable: promote as an interim increment, not as v1.1.**
Cut `release/1.0.0-beta.2` from `21b3ee8`, merge that to `main`, and tag
**`v1.0.0-beta.2`** — an honest "validated increment" label. This makes `main` reflect
reality, which has real value now that the repository is public and canonical.
**Conditions:** (a) branch protection configured on `main` **first** — merging to an
unprotected `main` on day two sets the wrong precedent; (b) the release notes state
explicitly that criteria 2–6 remain open; (c) it is **not** tagged `v1.1`.

**On engineering grounds the code is approved for merge:** it is strictly an improvement,
fully validated, minimal in scope, and every change is reviewed and documented. The
reservation is about **labelling and process**, not about code quality.

---

## 8. Residual risks

| Risk | Severity | Mitigation / status |
|---|---|---|
| Invalid-token floods no longer rate-limited (§3.1 Concern 1) | Medium | Follow-up: coarse IP limiter before `requireAuth`. Not live yet |
| `server/` has **zero** automated tests | Medium | `tests/functions/` chartered; D-1's correctness rests on review, not tests |
| Composite-index sufficiency unproven locally | Medium | Emulator cannot enforce indexes. Post-deploy verification is mandatory |
| Alert-engine failures still silent | Medium | Blanket `catch` retained deliberately; needs call-site fix too |
| Client fallback code still in the bundle (§5 #2) | Low–Medium | Unreachable at runtime, but reactivates silently if `handleServerUnavailable` ever returns null again |
| `trust proxy = 1` hop count unverified | Low | Decorative only; nothing security-critical depends on it |
| NN-5 violated — money read-modify-write | **High (open)** | T5 not started. Concurrent receipts can still lose money |
| 1 critical + 6 high npm advisories | Medium | Per-advisory disposition still outstanding |
| `/api/admin/*` unauthenticated | Low (latent) | Not exposed by the Hosting rewrites; must be gated before that ever widens |

---

## 9. Summary

- **3 / 3 fix branches reviewed, validated, merged.** Three concerns raised, all documented;
  none blocking.
- **All five gates green**; 381 automated tests; validated after each merge and on the
  integrated result.
- **One prior claim of mine corrected** — the recommended D-1 fix was wrong.
- **Platform Stabilization v1.1 remains OPEN**: criteria 3, 4, 5 (and stretch 6) are not met,
  and criterion 2 is only partially met.
- **`main` merge: approved on code, gated on labelling.** Do not call this v1.1 complete.
