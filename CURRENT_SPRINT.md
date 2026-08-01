# CURRENT SPRINT

> **Sprint:** Platform Stabilization **v1.1**
> **Phase:** **D1 — Deployment Transition** (engineering frozen)
> **Opened:** 2026-07-08 · **Status:** ACTIVE — **engineering frozen, deployment active**
> **Last updated:** 2026-08-01 · **Build:** `v1.0.0-beta.2` @ `release/1.0.0-beta.2`
> **Theme:** Make every financially-material action authoritatively enforced in production. This is the North-Star metric of the platform (Constitution §1.4) and the closure of the audit's CRITICAL findings.

This file is the single source of truth for *what the team is doing now*. It is updated each sprint. Historical sprints roll into [`RELEASES.md`](./RELEASES.md).

---

## ⛔ Engineering freeze — active as of 2026-08-01

**The repository is no longer the product. The running application is the product.**

Engineering for the v1.0.0-beta.2 release candidate is complete. All five gates are green
(`tsc` 0 errors · 204 unit · 177 rules · production build · functions bundle) and there are
**zero engineering blockers**. Every remaining blocker is infrastructure provisioning or a
business decision — see [`DEPLOYMENT_BLOCKERS.md`](./DEPLOYMENT_BLOCKERS.md).

**Deferred under this freeze — do NOT start without explicit approval:**

| Deferred | Where it is tracked |
|---|---|
| **T5 atomic money mutations** (O-new, criterion 5) | [`NEXT_MILESTONE.md`](./NEXT_MILESTONE.md) Workstream B |
| **TEST-004** `ledgerUtils.test.ts` · APP-001 · REPO-002 · all backlog items | [`BACKLOG.md`](./BACKLOG.md) — improvements only, approval-gated |
| **O5 Posting Engine · O6 Accounting Core** | v1.2, chartered `ENGINEERING_PHASE_2.md` P0.6–P0.7 |
| **Finance ADR implementation** (F-1 / F-2) | Business decision first — [`docs/FINANCE_DECISIONS_PENDING.md`](./docs/FINANCE_DECISIONS_PENDING.md) |
| **New ERP modules** (R3 Material Requests, Procurement, Inventory, HR, Reporting) | Gated behind P0 — `NEXT_MILESTONE.md` §3 |

**The active work is deployment**, in this non-negotiable order — never continue until the
previous layer is validated:

> Firestore Rules → *validate* → Indexes → *validate* → Cloud Functions → *validate* → Hosting → *validate*

Then runtime validation, then manual QA as the primary development driver. Runtime findings go
to [`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md) (the single authoritative register);
defects follow [`DEFECT_LOG.md`](./DEFECT_LOG.md).

**NN-7 governs this phase.** Never claim deployment without deployment, runtime success without
captured evidence, or bug resolution without validation. Evidence promotion (⏳ → 🔍 → ✅) is
one-directional and requires proof.

---

## Sprint objective

Turn the "safe for a single trusted operator" platform into one whose money paths are enforced by a deployed, transactional, audited boundary — without redesigning the domain. Every objective below is a *continuation* of existing code, per the prime directive.

## Objectives

| # | Objective | Status (2026-08-01) | Closes | Est. |
|---|---|---|---|---|
| O1 | **Deploy the secure backend** as Firebase Cloud Functions | 🟡 **Code complete, NOT deployed.** Bundle verified: 1.3 MB ESM exporting `api` + `dailyJobs`. Blocked on provisioning (I-1…I-6) | AUDIT SECURITY C-1 | L |
| O2 | **Remove the `secureApi` client fallback** in production (invert to fail-loud) | 🟡 **Behaviour done, compile-out not.** `handleServerUnavailable()` throws; but fallback bodies still ship in the bundle. Residual = Workstream D | AUDIT SECURITY C-1/C-2/C-3 | M |
| O3 | **Cloud Functions authoritative** — the 4 privileged ops run transactionally; rules tightened so money transitions are function-only | 🟡 **Rules half DONE and proven** (177 tests; ADR-0001, ADR-0002; R-1/R-2/H-3 closed). Functions half blocked with O1 | SECURITY C-2/C-3/H-4 | L |
| O4 | **FinancialCalculationService** — single shared money math imported by UI + functions | 🟡 **Centralized, divergence preserved.** One module, but the VO divergence is deliberately pinned by test pending **F-1**. Not engineering-blocked | AUDIT TECH-DEBT D-1/D-2 | M |
| O5 | **Posting Engine (foundation)** — chart of accounts + immutable `journalEntries` | ⛔ **DEFERRED to v1.2.** Was always a stretch goal | ARCHITECTURE §5 gap | XL |
| O6 | **Accounting Core foundation** — retention & TDS as tracked liabilities | ⛔ **DEFERRED to v1.2** | AUDIT TECH-DEBT D-4 | L |

> **Sequencing:** O1 → O2 → O3 are one dependency chain (the enforcement spine) and come first. O4 lands alongside O3 (functions need the shared math). O5/O6 begin once O1–O4 make transitions trustworthy — you cannot post reliably on transitions that aren't yet authoritative.
>
> **Where the chain actually stands:** everything that can be built without a Firebase project
> *has been* built and validated. O1/O3 now converge on a single external dependency —
> provisioning. That is why the sprint is in a deployment phase rather than an engineering one.

## Definition of success (sprint exit criteria)

The sprint is complete when **all** hold, verified.
**Scorecard verdict as of 2026-08-01: 1 met · 1 partial · 4 open.** Full evidence in
[`STABILIZATION_v1.1_RELEASE_REVIEW.md`](./STABILIZATION_v1.1_RELEASE_REVIEW.md) §5.

| # | Criterion (abbreviated) | Status | Closed by |
|---|---|---|---|
| 1 | Client-SDK money transitions **rejected by `firestore.rules`**, proven by rules-unit-test | ✅ **MET — exceeded** (177 tests; transitions denied for every role and amount) | — |
| 2 | Production build contains **no code path** performing a money transition without the authoritative check | 🟡 **PARTIAL** — behaviour correct, but fallback bodies still ship (not tree-shaken) | Workstream D |
| 3 | Four privileged ops run as **deployed** Cloud Functions, each emitting an audit entry | ❌ **NOT MET** — nothing deployed. This is **C-1** | **This phase (D1)** |
| 4 | One implementation per money formula; VO divergence gone; test pins form == function | ❌ **NOT MET** — divergence deliberately preserved pending business approval | **F-1 + F-2** |
| 5 | Atomic money mutations; concurrent-receipt test proves no lost money | ❌ **NOT STARTED** — NN-5 open (**F-4**) | Workstream B (T5) |
| 6 | *(Stretch)* First `journalEntries` posting reconciled Tier-3 == Tier-2 | ❌ **NOT STARTED** — correctly out of scope | v1.2 |

> **⚠️ NN-7:** this sprint **must not** be described as complete, and no branch or tag may be
> labelled "Platform Stabilization v1.1 complete." Criterion 3 closes only when the platform is
> deployed and verified with captured runtime evidence — which is the whole point of Phase D1.

Each item is gated by [`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md) at merge.

## Current risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Cloud Functions deploy needs Firebase config/credentials not yet documented | Blocks O1 | Medium | Document Admin SDK / ADC setup as first task; see [`docs/CLOUD_FUNCTIONS_PLAN.md`](./docs/CLOUD_FUNCTIONS_PLAN.md) |
| Removing the fallback (O2) breaks the currently-deployed hosting-only app until functions are live | User-facing outage window | Medium | Deploy functions (O1) and verify before merging O2; feature-flag the cutover (NN-27) |
| Divergent ceilings (gross vs net) may change which historical bills would validate | Data/behavior shift | Medium | Reconcile with an accountant; add regression tests before changing the ceiling (O4) |
| Posting engine (O5) is net-new and large; scope creep risk | Sprint overrun | High | Treat O5/O6 as stretch; land O1–O4 first; O5 may span into v1.2 (Accounting Core) |
| No staging environment yet | Risky prod cutover | Medium | Stand up a staging Firebase project as part of O1 (Constitution DEP-2) |

## Blocked items

| Item | Blocked on | Owner action |
|---|---|---|
| **O1 / O3 deploy — THE critical path** | **Firebase project does not exist.** `.firebaserc` is still `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` (a deliberate fail-loud guard). Blockers **I-1 … I-6** | **Provision staging first (DEP-2)**, then deploy in the mandated order. See `FIREBASE_PROVISIONING_GUIDE.md` |
| **Criterion 4 — F-1 + F-2** | **Business approval.** ADR-mandatory; must be decided **together** | Route to the business **now** — there is a data-restatement clock: every production WO with an approved VO created under the current formula is a potential restatement |
| Branch protection on `main` | Owner action; **status unverified** — `gh` is not installed on this machine | Confirm/enable in the GitHub UI (+ tag protection, Dependabot, CodeQL) |
| O5 posting map | Accountant sign-off on the debit/credit posting map (Constitution §10.4) | Schedule review with finance stakeholder — v1.2, not now |
| Custom-claims role migration (supports O3) | Decision to adopt custom claims now vs later | ADR required (Amendment Article VII #4). P1.5, after deployment |

> Blocked items require a decision recorded as an ADR before the dependent work starts. Do not work around a block silently.

## Governance for this sprint

- Each objective touching `firestore.rules`, `server/`, `secureApi`, financial formulas, or deployment topology is an **ADR-mandatory** change (Amendment Article VII). Write the ADR first.
- Every PR passes the **merge gate** ([`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md), NN-28) including a rules-unit-test for any rules change (NN-29 for scoped data).
- Work proceeds on branches per [`docs/GIT_STRATEGY.md`](./docs/GIT_STRATEGY.md): `platform/stabilization-v1.1` integration branch, `feature/*` per objective.

## Next sprint (preview)

**Accounting Core v1.2** — complete the posting engine (O5) to trial-balance readiness, finish retention/TDS liability lifecycle (O6), add the reconciliation alarm, and begin per-company book segmentation (`companyId` on financial collections, Constitution MC-1). See [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md) and [`RELEASES.md`](./RELEASES.md).
