# FINANCE DECISIONS PENDING — DSBC Civil

**Date:** 2026-07-29 · **Status:** **AWAITING BUSINESS APPROVAL — no code changed**
**Raised by:** Platform Stabilization v1.1 (P0.4 / T4) · **Blocks:** `CURRENT_SPRINT.md` exit criterion #4

Two financial-policy questions are **deliberately unresolved in code**. Both are already
marked `TODO: Finance Approval Required` in
[`src/lib/financialCalculationService.ts`](../src/lib/financialCalculationService.ts).

> **Why they are not fixed:** they are not engineering defects with an obvious correct
> answer — each has **two internally-consistent readings**, and picking one **changes
> rupee figures on existing records**. Under AMENDMENT-001 Article VII #6 (*"a change to a
> canonical financial formula, ceiling, or the posting map"*) each requires an **ADR with
> finance sign-off** before implementation. NN-7 (honesty over optimism) forbids quietly
> unifying them and calling the divergence closed.
>
> The v1.1 pass therefore **centralized both formulas verbatim** — every call site now
> imports one shared function, so the divergence is in *one visible place* instead of
> scattered across four files. That was the engineering half. The policy half is below.

---

## Decision 1 · The Variation Order approval formula diverges from the Work Order form

### The two formulas

Both live in [`src/lib/financialCalculationService.ts`](../src/lib/financialCalculationService.ts):

| | **Form / canonical** — `computeWorkOrderFinancials` ([:88](../src/lib/financialCalculationService.ts#L88)) | **VO approval** — `computeVariationOrderFinancials` ([:129](../src/lib/financialCalculationService.ts#L129)) |
|---|---|---|
| `subtotal` | `totalAmount − advance` | `totalAmount + otherCharges` |
| `gstAmount` | `subtotal × gst%` *(post-advance base)* | `totalAmount × gst%` *(pre-advance base)* |
| `retentionAmount` | `totalAmount × retention%` | `totalAmount × retention%` *(computed, then unused)* |
| `grandTotal` | `subtotal + gst + otherCharges − retention` | `subtotal + gst` — **omits the advance and retention subtractions** |

### Exact code paths

| Path | File | Consumes |
|---|---|---|
| Work Order create/edit (user-facing) | [`src/components/WorkOrderForm.tsx:214`](../src/components/WorkOrderForm.tsx#L214) | `computeWorkOrderFinancials` |
| VO approval — server (authoritative) | [`server/secureRoutes.ts:222-229`](../server/secureRoutes.ts#L222-L229) | `computeVariationOrderFinancials` |
| VO approval — client fallback (dev/emergency) | [`src/services/secureApi.ts:223-230`](../src/services/secureApi.ts#L223-L230) | `computeVariationOrderFinancials` |

Both VO paths then write the result into `workOrders/{id}.financials` **and**
`billing.totalValue`, overwriting figures the form produced.

### Impact

**Every approved variation order rewrites the parent WO's `grandTotal` using a different
formula than the one that created it.** On a WO carrying an advance or retention, the
stored `grandTotal` is **inflated** relative to what the form would compute for the same
inputs — the advance is no longer deducted and retention is no longer withheld.

That figure is not cosmetic. It is the **bill-approval ceiling** in
[`server/secureRoutes.ts:116`](../server/secureRoutes.ts#L116) (`wo.financials?.grandTotal`),
so an inflated `grandTotal` **raises how much may be billed** against the work order.

The divergence is pinned by a passing regression test —
[`financialCalculationService.test.ts:74-95`](../src/lib/financialCalculationService.test.ts#L74-L95)
(*"documents the KNOWN divergence … MUST NOT be 'fixed' … without finance sign-off"*),
which asserts `viaVo.grandTotal > viaForm.grandTotal`.

### The question for finance

> When a variation order is approved, should the work order's `grandTotal` be recomputed
> with the **same** formula the WO form uses — i.e. re-deducting advance and retention on
> the new total?

- **If yes** (the expected answer): `computeVariationOrderFinancials` is replaced by
  `computeWorkOrderFinancials`. **Every WO with an approved VO changes value**, generally
  downward. A **backfill/restatement decision is required** for existing records, and the
  bill ceiling on those WOs tightens — some already-approved bills may retrospectively sit
  above the recomputed ceiling.
- **If no** — i.e. a VO is contractually "additional work at gross value, deductions
  already settled on the original order" — then the current behaviour is correct and must
  be **documented as intentional**, with the misleading `TODO` removed and the two
  formulas explicitly named as serving different contractual events.

### Recommendation

**Write an ADR** — *"Unify the variation-order approval formula with the work-order form
formula"*. It must record: the chosen formula, the treatment of existing approved VOs
(restate vs. grandfather), and the bill-ceiling consequence. Do not implement before it is
Accepted. Add a test pinning `form == function` once decided (sprint exit criterion #4).

---

## Decision 2 · Three different overbilling ceilings apply to the same work order

### The three ceilings

| # | Where | Ceiling used | Code |
|---|---|---|---|
| 1 | **Bill create** (client) | **GROSS BOQ** — `woGrossValue(wo)` | [`src/services/billService.ts:68`](../src/services/billService.ts#L68) |
| 2 | **Bill approve** (server, authoritative) | **NET grandTotal** — `wo.financials?.grandTotal ?? wo.amount ?? 0` | [`server/secureRoutes.ts:116`](../server/secureRoutes.ts#L116) |
| 3 | **WO edit** (client) | **NET grandTotal** — blocks reducing below `totalBilled` | [`src/services/workOrderService.ts:121-131`](../src/services/workOrderService.ts#L121-L131) |

All three compare against the same quantity — cumulative `workDoneAmount` across
non-REJECTED bills — but against **different limits**.

A fourth, separate outflow path exists: `paymentRequestService` counts a broader outflow
via `getTotalFinancialOutflow`
([`src/lib/paymentRequestCalcs.ts:136`](../src/lib/paymentRequestCalcs.ts#L136)), while the
Bills path ignores payment requests entirely. **The two payables paths do not see each
other.**

### Impact

Gross and net are related by
`grandTotal = (total − advance) × (1 + gst%) + otherCharges − total × retention%`.
Whether net is above or below gross **depends on the WO's own parameters**:

| Scenario | Gross | Net `grandTotal` | Which is stricter |
|---|---|---|---|
| GST 18%, retention 5%, no advance | 1,000,000 | 1,130,000 | Create (gross) is **stricter** |
| No GST, advance 200,000, retention 10% | 1,000,000 | 700,000 | Approve (net) is **stricter** |

So the failure mode is **not consistent in direction** — which is precisely what makes it
dangerous:

- **A bill can pass creation and then be blocked at approval** (when net < gross), leaving
  it stuck in `VERIFIED` with no in-app remedy other than editing or rejecting it.
- **Or a bill can be approved beyond the gross contract value** (when net > gross),
  because the approve-time ceiling is the looser of the two.
- Because ceiling #2 reads `grandTotal`, it is **coupled to Decision 1** — resolving the
  VO formula moves this ceiling too. **These two decisions must be taken together.**
- Bill `update` re-runs **no** ceiling check at all ([AUDIT TECH-DEBT D-7](../audit/TECHNICAL_DEBT.md)),
  so amounts can be raised post-create without revalidation.

### The question for finance

> What is the authoritative ceiling on cumulative billing against a work order — the
> **gross BOQ contract value** (work-done tracked against the agreed scope), or the
> **net payable grandTotal** (after advance, GST, retention and other charges)?

The Constitution already expresses a **preferred** answer — FIN-3 designates **gross BOQ**
for work-done, with the payment ceiling tracked separately
([`ENGINEERING_PHASE_2.md` P0.4](../ENGINEERING_PHASE_2.md), `PLATFORM_STABILIZATION_v1.1.md` §P0-5).
That is a governance preference, **not** finance sign-off, and it has not been ratified.

### Recommendation

**Write an ADR** — *"Designate one authoritative overbilling ceiling"*. It must:
1. Name the single ceiling and add `outflowCeiling(wo)` to `financialCalculationService.ts`.
2. Route **all four** sites through it: bill create, bill **update** (currently unguarded),
   bill approve, and WO edit.
3. Decide whether payment requests and bills count against a **shared** outflow ceiling.
4. Include a **regression analysis over existing data**: which historical bills would
   validate differently under the chosen ceiling.

`CURRENT_SPRINT.md` already flags this risk: *"Divergent ceilings (gross vs net) may change
which historical bills would validate — reconcile with an accountant; add regression tests
before changing the ceiling."*

---

## Summary

| # | Decision | Owner | Blocks | Code changed |
|---|---|---|---|---|
| 1 | VO approval formula — unify with the form, or document as intentional | Finance + Architecture Review | Sprint exit #4 | **None** |
| 2 | The one authoritative overbilling ceiling (gross vs net) | Finance + Architecture Review | Sprint exit #4, TECH-DEBT D-1 | **None** |

**Both are ADR-mandatory (AMENDMENT-001 Article VII #6) and must be decided together** —
Decision 1 changes the value that Decision 2's ceiling #2 reads.

Until then the current behaviour stands, reproduced verbatim, centralized in one module,
covered by tests that assert the divergence rather than hide it. **No financial formula was
changed by Platform Stabilization v1.1.**
