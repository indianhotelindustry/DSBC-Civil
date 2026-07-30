# NEXT MILESTONE — after Platform Stabilization v1.1

**Date:** 2026-07-30 · **Defined at:** `platform/stabilization-v1.1` @ `21b3ee8`
**Governed by:** `ENGINEERING_PHASE_2.md` · `governance/ERP_ARCHITECTURE_BIBLE.md`

---

## 0. First, a correction of framing

Platform Stabilization v1.1 is **not finished**. Four of its six exit criteria are open
(`STABILIZATION_v1.1_RELEASE_REVIEW.md` §5). So the next milestone is **not a new sprint** —
it is **closing v1.1**.

`ENGINEERING_PHASE_2.md` is unambiguous about what must not happen next:

> *"Do not build P1 or P2 features on top of an unenforced money core. Every financial
> feature added before P0 is complete inherits the same production bypass. **P0 first —
> always.**"*

So: no Material Requests, no Procurement, no Inventory, no HR, no Posting Engine, no
Reporting. Not because they lack value, but because each would inherit an unenforced core.

---

## 1. Milestone: **v1.1 Completion** (close the sprint, then deploy)

**Goal:** satisfy the remaining Definition-of-Success criteria and complete the first
commercial beta deployment.

**Exit condition:** all six of `CURRENT_SPRINT.md`'s criteria hold, verified — not four of six.

### Workstream A — Deploy the enforcement spine *(closes criterion 3, and C-1)*

The single highest-value action available. Everything this sprint built is inert until it runs.

| Step | Owner | Notes |
|---|---|---|
| Repository governance (branch protection, tag protection, Dependabot, CodeQL) | Owner | `RELEASE_CANDIDATE_CHECKLIST.md` Stage 1 |
| Provision staging + production Firebase (DEP-2) | Owner | Stage 3 |
| Deploy rules → indexes → functions → hosting, on staging first | Owner + Eng | **Order is non-negotiable** |
| Full smoke suite, including the negative boundary tests | Eng | Stage 4b |

**Only after this does the platform's North-Star metric (§1.4) move off the floor.** Until
then, the fraction of financially-material transitions authoritatively enforced *in
production* is zero, because production does not exist.

### Workstream B — T5: atomic money mutations *(closes criterion 5, NN-5, blocker F-4)*

**The only remaining open money-integrity defect.** `sales.totalReceived` and
`saleSchedules.paidAmount` use read-modify-write, so two concurrent receipts on one sale can
**silently lose money**.

- Convert to `runTransaction` / `FieldValue.increment` in `saleReceiptService`,
  `saleScheduleService`, `paymentService`.
- Count PENDING/APPROVED payments against the ceiling, not just RELEASED (TECH-DEBT D-8).
- **Acceptance:** a concurrent-receipt test proves no lost money.
- Continues existing seams (NN-19). No redesign. Effort: M.

### Workstream C — The two finance ADRs *(closes criterion 4)* 💼

**Blocked on business approval, not engineering.** Engineering's part is already done: both
formulas are centralized in one module with the divergence pinned by tests.

- **F-1** VO-approval formula · **F-2** the one authoritative overbilling ceiling.
- **Must be decided together** — F-1 changes the value F-2's ceiling reads.
- Then: implement, add a test pinning `form == function`, and run a regression analysis over
  existing data.
- **Sequencing note:** decide these **before** significant production data accumulates.
  Every WO with an approved VO created under the current formula is a potential restatement.

### Workstream D — Close criterion 2 properly

Compile the client fallback out behind `import.meta.env.DEV` (Constitution DEP-4). Bundle
inspection proved the fallback bodies still ship — unreachable, but they would reactivate
silently if `handleServerUnavailable` ever returned `null` again. Effort: S.

### Workstream E — Test-tier gaps

- **`tests/functions/`** — the largest gap. Rules structurally *cannot* test amounts,
  cumulative ceilings or transactional atomicity; only function tests can. This is also the
  answer to D-1's "verified by review, not tests" weakness.
- **`ledgerUtils.test.ts`** — zero tests on the most accounting-like module. Constitution
  **TEST-1** says this MUST be covered before any further ledger change.
- Extend rules tests to the **Sales** collections — the broadest write grants in the file.
- Add the coarse IP-keyed limiter in front of `requireAuth` (D-1 residual risk).

---

## 2. Then, and only then: **v1.2 Accounting Core**

Chartered in `ENGINEERING_PHASE_2.md` P0.6–P0.7. **Do not start before v1.1 closes.**

- **Posting engine foundation** — `accounts` (chart of accounts) + immutable `journalEntries`,
  posting inside the bill-approve and payment-release transactions, reconciled against the
  existing derived ledgers as a Tier-2 checksum.
- **Retention & TDS as tracked liabilities** with explicit release transitions. Today
  retention is deducted and then **vanishes from every ledger** (TECH-DEBT D-4).
- **Dependencies:** Workstreams A–C above, plus **accountant sign-off on the posting map**
  (Constitution §10.4). ADR-mandatory.
- **Honesty gate (NN-7):** the platform must not claim double-entry accounting until this
  ships **and reconciles**. Until then it is derived MIS reporting, and must be described as
  such.

---

## 3. Explicitly deferred

Not because they are unimportant, but because P0 is not complete.

| Deferred | Charter | Gate |
|---|---|---|
| Material Requests (R3) | P1 | After v1.1 |
| Procurement transactions (PR → PO → GRN) | P1.2 | After the posting engine |
| Inventory / stock ledger / transfers | P1.1 | After GRN + posting |
| Formal reporting engine | P2.1 | After posting |
| CEO intelligence, AI advisory layer | P2.2 / P2.3 | After trustworthy data |
| New verticals (Hospitality, Manufacturing) | P2.4 | Config packs over the unchanged core — **never forks** |
| Custom-claims role migration, boundary-enforced company scoping, pagination | P1.5 | Parallel-capable, after A |

---

## 4. Recommended immediate order

1. **Stage 1 governance** — branch protection first. Cheapest, and it protects everything else.
2. **Decide the `main` promotion path** (Option A or B, `RELEASE_REVIEW` §7). Do not label
   either as "v1.1 complete."
3. **Workstream A** — provision and deploy to staging. Highest value available.
4. **Workstream C** — route F-1/F-2 to the business now; they gate criterion 4 and have a
   data-restatement clock attached.
5. **Workstream B** — T5 atomic money. The last open money-integrity defect.
6. **Workstream D + E** — close criterion 2, then fill the test tiers.
7. Re-verify all six criteria, tag the honest milestone, **then** open v1.2.

---

## 5. What "done" looks like

Platform Stabilization v1.1 closes when **all six** criteria in `CURRENT_SPRINT.md` hold and
each is backed by evidence:

1. ✅ Client-SDK money transitions rejected by rules — **already met** (177 tests)
2. ⬜ No money-transition code path in the production build — needs Workstream D
3. ⬜ Four privileged ops running as **deployed** functions with audit entries — needs A
4. ⬜ One implementation per money formula; VO divergence gone; `form == function` pinned — needs C
5. ⬜ Atomic money mutations; concurrent-receipt test proves no lost money — needs B
6. ⬜ *(Stretch)* First `journalEntries` posting reconciled Tier-3 == Tier-2 — v1.2

At that point the platform is **enforceable in production** and the books are real enough to
build on. That is the moment feature development legitimately resumes — and not before.
