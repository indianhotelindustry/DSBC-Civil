# DATA LIFECYCLE — DSBC Civil

> **Authority:** Chartered by [`AMENDMENT-001`](./amendments/AMENDMENT-001.md) Article III; required by Non-Negotiable **NN-26** ("no major entity ships without a lifecycle entry here").
> **Scope:** every major entity's states, transitions, and archive/retention/deletion/recovery policy. This document governs the *full lifecycle* — the Constitution §11 governs the *transition mechanics*; this governs what happens across an entity's whole life including retention and deletion.

## Conventions

- **States / Transitions** — reflect the verified code today (Constitution §11) or, for planned entities, the intended design (marked *planned*).
- **Archive** — moving inactive records out of the hot read path (not deletion). Default: archived, not deleted.
- **Retention** — how long a record is kept before archival/eligibility for deletion. Financial records follow Indian statutory minimums (see [`COMPLIANCE.md`](./COMPLIANCE.md)): **8 years** for books-of-account and tax-relevant records unless noted.
- **Deletion** — hard removal. **Financial records of record are never hard-deleted** (Constitution FS-7 / NN-6); corrections are reversing entries. Operational/master records may be deleted only with reference guards satisfied.
- **Recovery** — how a wrongly-removed or corrupted record is restored (backup restore, reversing entry, or reactivation), per [`RELIABILITY.md`](./RELIABILITY.md).
- **PII** — classification per [`COMPLIANCE.md`](./COMPLIANCE.md).

> **Global rule:** No hard delete of any financial document of record. Retention periods are minimums, not deadlines to delete. Every deletion path must satisfy its referential guards; missing guards are tracked in [`../audit/TECHNICAL_DEBT.md`](../audit/TECHNICAL_DEBT.md) (D-9) and closed in Phase 2.

---

## FINANCIAL ENTITIES

### Project
- **States:** ACTIVE → COMPLETED / ON_HOLD.
- **Transitions:** PM/Admin create & edit; status changes by PM/Admin.
- **Archive:** on COMPLETED + all child WOs terminal, archive after 12 months inactive.
- **Retention:** 8 years (parent of financial records).
- **Deletion:** Admin only, **blocked while any Work Order references it** ([`projectService.ts`](../src/services/projectService.ts)). Never delete a project with financial history — archive.
- **Recovery:** reactivate (status) or backup restore.
- **PII:** none (org data).

### Work Order (incl. embedded BOQ)
- **States:** PENDING → APPROVED → COMPLETED; PENDING → REJECTED. Identity fields (`woNumber`, `createdAt`, `createdBy`) immutable across all paths (FS rules).
- **Transitions:** PM/Admin create (PENDING); CEO approve; CEO complete; PM reject. Financial reduction below billed is blocked ([`workOrderService.ts`](../src/services/workOrderService.ts)).
- **Archive:** on COMPLETED with all bills PAID and no open payment requests, archive after 12 months.
- **Retention:** 8 years.
- **Deletion:** Admin only, **blocked** by active bills, active payments, or approved VOs; Phase-2 must also block on payment requests (TECH-DEBT D-9). Never delete a WO with billing history.
- **Recovery:** backup restore (no soft-delete today); BOQ is embedded, restored with the WO.
- **PII:** none.

### BOQ Item
- **Lifecycle:** embedded in the Work Order (`boqItems[]`); has no independent lifecycle. Created/edited only while the WO is editable (PENDING or via VO). Retention/deletion follow the parent WO.

### Variation Order
- **States:** DRAFT → APPROVED / REJECTED. Approved VOs are immutable and un-deletable (they mutated WO financials).
- **Transitions:** PM/Admin create (DRAFT); CEO approve (updates WO financials — must use the shared `computeWorkOrderFinancials`, P0.4) / reject.
- **Archive:** with parent WO.
- **Retention:** 8 years (alters contract value).
- **Deletion:** Admin only, **blocked when APPROVED**. DRAFT/REJECTED may be deleted.
- **Recovery:** backup restore; an erroneously approved VO is corrected by a compensating VO, not by edit.

### Measurement / Measurement Book *(planned)*
- **States (planned):** DRAFT → VERIFIED → APPROVED → billed.
- **Transitions (planned):** site entry → PM/engineer verify → approve → consumed by a bill.
- **Archive/Retention:** 8 years with the WO/bill it supports.
- **Deletion:** none once linked to a bill; reversing entry only.
- **Note:** not implemented today (no measurement module, only UOM masters). This entry is the charter for when it is built (NN-26 must be satisfied before ship).

### Bill (Partial Billing)
- **States:** DRAFT → VERIFIED → APPROVED → PARTIALLY_PAID → PAID; pre-APPROVED → REJECTED.
- **Transitions:** ACCOUNTS/Admin create (DRAFT); PM verify; CEO approve; payment release moves to PARTIALLY_PAID/PAID (function-only post-P0.3). Overbilling ceiling enforced (single ceiling, P0.4).
- **Archive:** on PAID, archive after 12 months; remains queryable for ledgers.
- **Retention:** 8 years (statutory book of account).
- **Deletion:** **never once APPROVED** (FS-7). DRAFT/REJECTED deletable by Admin with no payments attached. Corrections post-approval are credit/adjustment entries.
- **Recovery:** reversing/adjustment entry; backup restore for DRAFT loss.
- **PII:** none (contractor reference only).

### Payment (Bill-based)
- **States:** PENDING → APPROVED → RELEASED; PENDING → REJECTED.
- **Transitions:** ACCOUNTS/Admin create; CEO approve; ACCOUNTS release (function-only, transactional, idempotent post-P0). Overpayment guarded.
- **Archive:** on RELEASED, archive after 12 months.
- **Retention:** 8 years.
- **Deletion:** **RELEASED payments never deletable** (rules + service). PENDING/APPROVED deletable by Admin. A released payment is corrected by a reversing entry.
- **Recovery:** reversing entry; posting engine (P0.6) makes reversal the canonical correction.
- **PII:** payment mode/reference — treat as sensitive, not PII.

### Payment Request (WO-based)
- **States:** PENDING_APPROVAL → APPROVED → PAID (terminal); PENDING_APPROVAL → REJECTED.
- **Transitions:** PM/Admin create; CEO approve/reject (reason required); ACCOUNTS mark paid (mode required). Cross-module outflow ceiling enforced.
- **Archive:** on PAID, archive after 12 months.
- **Retention:** 8 years.
- **Deletion:** Admin only; **must not delete PAID** in the mature platform (current service allows it — TECH-DEBT to guard). Converge with Payment path (FIN-6).
- **PII:** none.

### Retention (held amount) *(liability — Phase 2, P0.7)*
- **States (planned):** ACCRUED (on bill approve) → RELEASED (explicit transition) — mirrors payment release.
- **Retention/Deletion:** tracked liability; never silently cleared; released only by a guarded, audited transition.
- **Today:** retention is a deduction with no lifecycle — the gap this entry charters (TECH-DEBT D-4).

### Adjustment (contractor)
- **States:** single-sided DEBIT/CREDIT memo (no workflow today; entry UI is P1.3/D-5).
- **Retention:** 8 years (affects payable balances).
- **Deletion:** Admin only; once posting exists, reversal not deletion.
- **PII:** none.

### Journal Entry / Chart of Accounts *(planned — Posting Engine, P0.6)*
- **Journal Entry states:** POSTED (immutable) → SUPERSEDED (by a reversing entry). Never edited, never deleted (NN-6, POST-3).
- **Account states:** ACTIVE → INACTIVE (never deleted while referenced).
- **Retention:** permanent for the life of the company's books (≥ 8 years, effectively indefinite).
- **Recovery:** reversing entry only; backup restore for infrastructure loss.

---

## SALES / CRM ENTITIES

### Customer
- **States:** active master record (no status workflow).
- **Transitions:** PM/Admin create/edit; duplicate prevention on normalized (name, phone) per company.
- **Archive:** archive after 24 months with no active sale/receivable.
- **Retention:** 8 years after last transaction (financial counterparty).
- **Deletion:** Admin only, **blocked while any unit is owned by the customer**; Phase-2 must also block on `sales.customerId` (TECH-DEBT D-9).
- **PII:** **HIGH** — name, phone, address. Governed by [`COMPLIANCE.md`](./COMPLIANCE.md) (DPDP). Erasure requests handled within the reverse-don't-delete constraint (anonymize non-statutory fields; retain what law requires).

### Plot / Unit Inventory (SubLocation)
- **States:** ownership UNSOLD/SOLD; sale status AVAILABLE → BOOKED → SOLD → POSSESSION_GIVEN → CANCELLED.
- **Transitions:** PM/Admin manage; **Sales module is the sole path to SOLD** (manual-SOLD blocked); admin drift-repair tools exist.
- **Archive:** POSSESSION_GIVEN units archive after 24 months.
- **Retention:** 8 years (asset/sale record).
- **Deletion:** Admin only, blocked by active work orders; **Phase-2 must block on active sales** (TECH-DEBT D-9).
- **PII:** owner snapshot (name) — sensitive; follows the customer's PII policy.

### Sale / Booking
- **States:** BOOKED → SOLD → POSSESSION_GIVEN; → CANCELLED. Strict `finalSaleValue = agreementValue − discount` identity.
- **Transitions:** Admin/PM/Accounts drive; atomic sale+unit batch; cancel reverts unit and ownership. No post-BOOKED price edit (Phase 2).
- **Archive:** on POSSESSION_GIVEN, archive after 24 months.
- **Retention:** 8 years.
- **Deletion:** **no delete path** (by design); lifecycle ends at CANCELLED or POSSESSION_GIVEN. Cancelled-sale receipt reversal is P1.3.
- **PII:** customer reference — sensitive.

### Sale Receipt
- **States:** created → (deletable with reversal). No update.
- **Transitions:** ACCOUNTS/Admin create; atomic batch updates `sale.totalReceived` + schedule paid amounts (must be atomic/idempotent, P0.5). Overpayment allowed by policy.
- **Retention:** 8 years (money received).
- **Deletion:** delete reverses caches symmetrically today; in the mature platform, prefer reversal over delete (FS-7). Never delete a receipt on a closed period once posting exists.
- **PII:** none directly; links to customer.

### Sale Schedule (Installment)
- **States:** PENDING → PARTIALLY_PAID → PAID; sticky WAIVED / CANCELLED.
- **Transitions:** Admin/PM/Accounts manage; auto-status on payment; **delete blocked when `paidAmount > 0`** (waive/cancel instead).
- **Retention:** 8 years.
- **Deletion:** only unpaid schedules; paid ones are waived/cancelled, not deleted.
- **PII:** none.

### Sale Adjustment (refund/penalty/write-off) *(planned — P1.3)*
- **States (planned):** DRAFT → APPROVED → APPLIED.
- **Retention:** 8 years.
- **Note:** type reserved, no service/UI today; charter for P1.3.

---

## PROCUREMENT / INVENTORY ENTITIES

### Vendor
- **States:** active master (no workflow).
- **Transitions:** Purchase Manager/Admin create/edit; GSTIN/PAN/IFSC validated.
- **Archive:** after 24 months inactive.
- **Retention:** 8 years (financial counterparty).
- **Deletion:** Admin/SuperAdmin; **reference guard to be added when POs reference vendors** (P1.2). Restricted read (procurement/store/admin).
- **PII:** **MEDIUM/HIGH** — bank details, GSTIN, PAN. Restricted read already enforced; DPDP-governed.

### Material / Material Category / UOM
- **States:** active master.
- **Transitions:** Purchase Manager/Admin; code/name/symbol uniqueness.
- **Retention:** while referenced by stock/POs; then archive.
- **Deletion:** guarded (materialCategory/UOM block if referenced by materials); **material/vendor/store/vehicle delete guards to be completed** in P1 (TECH-DEBT).
- **PII:** none.

### Store / Vehicle
- **States:** active master.
- **Deletion:** Admin/SuperAdmin; reference guards added when stock/trips reference them (P1).
- **Retention:** while operational + 8 years for movement history.

### Purchase Request / Purchase Order / GRN *(planned — P1.2)*
- **States (planned):** PR: DRAFT → APPROVED → converted; PO: DRAFT → APPROVED → RECEIVED/CLOSED; GRN: posted (immutable).
- **Retention:** 8 years.
- **Deletion:** none once approved/received; reversal only.
- **Note:** charter for P1.2; NN-26 must be satisfied before ship.

### Inventory / Stock Ledger *(planned — P1.1)*
- **States (planned):** stock movements are immutable ledger entries; balances derived (Tier-2 style).
- **Retention:** 8 years.
- **Deletion:** never; corrections are counter-movements.
- **Note:** charter for P1.1.

### Asset Management *(planned — P2)*
- **States (planned):** ACQUIRED → IN_USE → UNDER_MAINTENANCE → DISPOSED.
- **Retention:** life of asset + 8 years.
- **Deletion:** never; disposal is a state, not a delete.
- **Note:** no code today; charter for a future module.

---

## PLATFORM ENTITIES

### User
- **States:** PENDING → ACTIVE → INACTIVE.
- **Transitions:** self-signup (PENDING/PROJECT_MANAGER); Admin approve/activate/deactivate/role-change; last-active-admin guard; self-role/status change blocked.
- **Archive:** INACTIVE users retained, not deleted.
- **Retention:** for the life of the audit trail they authored (their actions must remain attributable).
- **Deletion:** **real user docs are never deleted** (rules); only `uid==''` placeholders are removable. DPDP erasure handled by anonymizing profile fields while preserving audit attribution keys.
- **PII:** **HIGH** — name, email. DPDP-governed.

### Audit Log
- **States:** append-only, immutable (no update/delete).
- **Retention:** permanent (compliance memory); ≥ 8 years, effectively indefinite.
- **Deletion:** **never** (rules enforce). Authorship integrity to be hardened (SEC-6, P0/P1).
- **PII:** actor uid + action detail — treat as sensitive.

### Alert
- **States:** unread → read (user may only set `read=true`).
- **Retention:** purge after 12 months (operational, non-statutory).
- **Deletion:** Admin/system; safe to delete aged alerts.
- **PII:** none.

### Daily Summary
- **States:** generated (read-only for clients).
- **Retention:** 24 months (derived reporting cache).
- **Deletion:** system; regenerable from source, so freely purgeable.

### App Version
- **States:** append-only deployment log.
- **Retention:** permanent (deployment history).
- **Deletion:** never (rules).

---

## Lifecycle governance rules (summary)

1. **Financial records of record are never hard-deleted** — reverse, don't delete (NN-6, FS-7).
2. **Every deletion path satisfies its referential guards** — the missing guards (TECH-DEBT D-9) are Phase-2 closures.
3. **Statutory retention is 8 years minimum** for books/tax records; audit and deployment logs are permanent.
4. **PII lifecycle** follows [`COMPLIANCE.md`](./COMPLIANCE.md): minimize, restrict read, and honor erasure within statutory-retention limits by anonymizing non-required fields.
5. **A new major entity must have an entry here before it ships** (NN-26).
6. **Recovery** is by reversing entry (financial) or backup restore (operational); see [`RELIABILITY.md`](./RELIABILITY.md).
