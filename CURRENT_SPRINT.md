# CURRENT SPRINT

> **Sprint:** Platform Stabilization **v1.1**
> **Phase:** Engineering Phase 2 (see [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md))
> **Opened:** 2026-07-08 · **Status:** ACTIVE
> **Theme:** Make every financially-material action authoritatively enforced in production. This is the North-Star metric of the platform (Constitution §1.4) and the closure of the audit's CRITICAL findings.

This file is the single source of truth for *what the team is doing now*. It is updated each sprint. Historical sprints roll into [`RELEASES.md`](./RELEASES.md).

---

## Sprint objective

Turn the "safe for a single trusted operator" platform into one whose money paths are enforced by a deployed, transactional, audited boundary — without redesigning the domain. Every objective below is a *continuation* of existing code, per the prime directive.

## Objectives

| # | Objective | Continues from | Closes | Est. |
|---|---|---|---|---|
| O1 | **Deploy the secure backend** as Firebase Cloud Functions | [`server/secureRoutes.ts`](./server/secureRoutes.ts) (already written) | AUDIT SECURITY C-1 | L |
| O2 | **Remove the `secureApi` client fallback** in production (invert to fail-loud) | [`src/services/secureApi.ts`](./src/services/secureApi.ts) | AUDIT SECURITY C-1/C-2/C-3 | M |
| O3 | **Cloud Functions authoritative** — the 4 privileged ops run transactionally; rules tightened so money transitions are function-only | `secureRoutes.ts` + [`firestore.rules`](./firestore.rules) | SECURITY C-2/C-3/H-4 | L |
| O4 | **FinancialCalculationService** — extract the single shared money math (`computeWorkOrderFinancials`, `outflowCeiling`, `recalculateBillTotals`) into pure `src/lib/` modules imported by UI + functions | [`src/lib/financialCalcs.ts`](./src/lib/financialCalcs.ts), [`WorkOrderForm.tsx`](./src/components/WorkOrderForm.tsx) | AUDIT TECH-DEBT D-1/D-2 | M |
| O5 | **Posting Engine (foundation)** — chart of accounts + immutable `journalEntries` collection + posting on bill-approve/payment-release, reconciled against derived ledgers | Constitution §10 (designed) | ARCHITECTURE §5 gap | XL |
| O6 | **Accounting Core foundation** — retention & TDS modelled as tracked liabilities with release transactions | Constitution §9 FIN-4 | AUDIT TECH-DEBT D-4 | L |

> **Sequencing:** O1 → O2 → O3 are one dependency chain (the enforcement spine) and come first. O4 lands alongside O3 (functions need the shared math). O5/O6 begin once O1–O4 make transitions trustworthy — you cannot post reliably on transitions that aren't yet authoritative.

## Definition of success (sprint exit criteria)

The sprint is complete when **all** hold, verified:
1. A direct client-SDK attempt to release an over-payable payment or mark a bill PAID without a payment is **rejected by `firestore.rules`** (rules-unit-test proves it — NN-29-style deny test).
2. The production build contains **no code path** that performs a money transition without the authoritative check (O2 done; `secureApi` fails loud).
3. The four privileged operations run as deployed Cloud Functions with transactional cross-document validation, each emitting an audit entry (Constitution WF-3).
4. Every money formula has exactly **one** implementation in `src/lib/`, imported by both UI and functions (NN-4); the VO-approval financial divergence is gone (a test pins form == function).
5. Money mutations for receipts/schedules use atomic increments/transactions (NN-5/NN-23); a concurrent-receipt test proves no lost money.
6. **(Stretch)** A first `journalEntries` posting exists for bill-approve and payment-release, and a reconciliation check shows Tier-3 == Tier-2 on a fixture dataset (NN-24 correlation id present).

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
| O1 deploy | Firebase project topology decision (staging project, functions region) + Admin SDK credentials | Confirm Firebase project(s) and credentials before coding |
| O5 posting map | Accountant sign-off on the debit/credit posting map (Constitution §10.4) | Schedule review with finance stakeholder |
| Custom-claims role migration (supports O3) | Decision to adopt custom claims now vs later | ADR required (Amendment Article VII #4) |

> Blocked items require a decision recorded as an ADR before the dependent work starts. Do not work around a block silently.

## Governance for this sprint

- Each objective touching `firestore.rules`, `server/`, `secureApi`, financial formulas, or deployment topology is an **ADR-mandatory** change (Amendment Article VII). Write the ADR first.
- Every PR passes the **merge gate** ([`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md), NN-28) including a rules-unit-test for any rules change (NN-29 for scoped data).
- Work proceeds on branches per [`docs/GIT_STRATEGY.md`](./docs/GIT_STRATEGY.md): `platform/stabilization-v1.1` integration branch, `feature/*` per objective.

## Next sprint (preview)

**Accounting Core v1.2** — complete the posting engine (O5) to trial-balance readiness, finish retention/TDS liability lifecycle (O6), add the reconciliation alarm, and begin per-company book segmentation (`companyId` on financial collections, Constitution MC-1). See [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md) and [`RELEASES.md`](./RELEASES.md).
