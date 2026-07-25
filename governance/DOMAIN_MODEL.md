# DSBC DOMAIN MODEL & DDD GOVERNANCE
### `governance/DOMAIN_MODEL.md` — the formal domain-model layer of the DSBC Architecture Constitution

> **Document identity:** In the DSBC governance record this is the domain-model authority ("DOC-007"). It formalizes, as a Domain-Driven Design lens, the model **already implemented** in [`src/types.ts`](../src/types.ts), the services in [`src/services/`](../src/services/), and enforced by [`firestore.rules`](../firestore.rules). It is governed by, and subordinate to, the Constitution ([`ERP_ARCHITECTURE_BIBLE.md`](./ERP_ARCHITECTURE_BIBLE.md)).
> **Version:** 1.0.1 (incorporates the ARB additive refinements of [`amendments/DOC-007-AMENDMENT-SUMMARY-v1.0.1.md`](./amendments/DOC-007-AMENDMENT-SUMMARY-v1.0.1.md)).
> **Status:** Awaiting Document Lock.

## Additive mandate (read first)

This document introduces **no new architecture and removes nothing**. It is a *naming and governance layer* over concepts that already exist in code. Every DDD term below maps to an implemented artifact:

| DDD term | DSBC implementation (existing) |
|---|---|
| **Bounded Context** | A cohesive group of services/collections already separated by folder and rules seam |
| **Aggregate Root** | A top-level entity in [`src/types.ts`](../src/types.ts) that owns a consistency boundary (WorkOrder, Bill, Payment, Sale…) |
| **Value Object** | An embedded immutable structure (BOQItem, WorkOrderFinancials, ReceiptAllocation…) |
| **Domain Event** | The event bus of Constitution §13 (`BillApproved`, `PaymentReleased`…) |
| **Domain Service** | A pure calculation module in [`src/lib/`](../src/lib/) (the FinancialCalculationService, ledger builders…) |
| **Identity Boundary** | The `Company` dimension (multi-company scoping, Constitution §23) |
| **Domain Policy / Invariant** | A business rule enforced in `firestore.rules` + deployed functions (Constitution §8/§9) |

Because these are formalizations of existing concepts, **no bounded context is merged, no aggregate is redesigned, and no vocabulary conflicts** — DDD names are added *alongside* the existing "service / collection / entity / transition" language, with the correspondence table in §D15.

---

## D1 — Bounded Contexts

Six bounded contexts, defined over the seams already present in the code. These are the first formal naming of contexts that already exist implicitly; nothing is moved or merged.

| # | Bounded Context | Owns (collections/services) | Purpose |
|---|---|---|---|
| **BC-1** | **Identity & Access** | `users`, auth, roles, `userAccess` | Who a principal is; role; company assignment. Provides the identity boundary to all others. |
| **BC-2** | **Organization & Masters** | `companies`, `projects`, `contractors`, `customers`, `subLocations`, `workCategories`, `termsTemplates`, `numberSeries`, `materialCategories`, `uoms`, `materials`, `vendors`, `stores`, `vehicles` | Reference/master data and the company/project structure. |
| **BC-3** | **Construction Execution & Payables** | `workOrders` (+BOQ), `variationOrders`, `bills`, `payments`, `paymentRequests`, `adjustments` | The core construction financial lifecycle: order → bill → pay. |
| **BC-4** | **Sales & Receivables (CRM)** | `sales`, `saleReceipts`, `saleSchedules`, `saleAdjustments` (reserved) | Unit/plot sales, bookings, receipts, installment recovery. |
| **BC-5** | **Accounting & Posting** | derived ledgers today; `accounts`, `journalEntries` (planned, Constitution §10) | The books of record. Currently *derived reporting*; the posting engine is its future core. |
| **BC-6** | **Platform Services** | `auditLogs`, `alerts`, `dailySummaries`, `appVersions`, the event bus | Cross-cutting: audit, notification, summaries, versioning, events. |

**Context map (dependency direction, downward = "depends on"):**
```
BC-3 Construction ──┐         ┌── BC-4 Sales
                    ├──► BC-5 Accounting & Posting ──► (books of record)
BC-2 Masters ◄──────┘         │
   ▲                          │
BC-1 Identity & Access ───────┴──► provides Company identity boundary to ALL
BC-6 Platform Services ── observes all via Domain Events (audit, alerts)
```

**Rule DM-BC1:** A new capability belongs to exactly one bounded context. If it appears to span two, it is either a cross-context interaction (§D2) or a signal the context boundary needs an ADR — never a silent merge.

---

## D2 — Cross-Bounded Context Interaction Rules *(Area 1)*

This is the newly-formalized law for how contexts communicate. Four permitted mechanisms and one prohibition.

### D2.1 Direct read (synchronous, read-only reference)
A context **may read** another context's published data directly (via the owning service, never raw Firestore — Constitution AP-4) when it needs reference facts.
- **Allowed:** BC-3 reads BC-2's `workCategories`, `contractors`, `projects`, `numberSeries`; BC-4 reads BC-2's `customers`, `subLocations`; every context reads BC-1's identity/company scope.
- **Constraint:** direct reads are **reference only** — a context MUST NOT mutate another context's aggregate through a direct write.

### D2.2 Domain Event (asynchronous, decoupled reaction)
Cross-context **reactions** — where one context must *do something because* another's state changed — MUST occur through a Domain Event (Constitution §13), not an inline cross-context write.
- **Allowed:** BC-3 emits `BillApproved` / `PaymentReleased`; BC-5 (Accounting) reacts by posting a journal entry; BC-6 reacts by writing an audit entry and an alert.
- **Rule DM-BC2:** eventually-consistent cross-context effects (notifications, read models, non-atomic denormalization) MUST be event-driven reactors, never inline coupling.

### D2.3 Published interface / Domain Service (synchronous, authoritative)
Where a cross-context operation must be **atomic and authoritative**, it goes through a **published interface** — a deployed function or a shared Domain Service — not a direct reach into another aggregate.
- **Allowed:** BC-3's payment release calls the authoritative release function which atomically updates the payment and the bill *within BC-3*; the shared `computeWorkOrderFinancials` Domain Service is a published interface consumed by UI and functions.
- **Rule DM-BC3:** an atomic effect that must commit with a transition (e.g. posting, POST-5) runs *inside* the transition's transaction via the published interface, **not** via an async event (this is the §13/§10 boundary — restated as a context rule).

### D2.4 Prohibited interactions
- **Rule DM-BC4 (prohibited):** A context MUST NOT (a) write another context's aggregate directly; (b) depend on another context's *internal* (non-published) fields; (c) create a circular synchronous dependency between contexts; (d) bypass a context's owning service to reach its collection (the current direct-`saleReceipts` reads in `CustomerLedger`/`RecoveryDashboard` are legacy violations to migrate).

### D2.5 Worked examples
1. **Bill approved → journal posted.** BC-3 approves a bill (authoritative function). It emits `BillApproved`. BC-5 reacts, posting a balanced entry (Dr WIP; Cr payable + retention + TDS). *Mechanism: Domain Event → published posting interface.* Not an inline BC-3→BC-5 write.
2. **Payment released → bill updated.** Bill status change is *within* BC-3, so it stays an atomic in-transaction update via the release function. *Mechanism: published interface, atomic.* No event needed for the intra-context part; the `PaymentReleased` event then fans out to BC-5 (post) and BC-6 (audit/alert).
3. **WO needs a contractor name.** BC-3 reads `contractorService` from BC-2. *Mechanism: direct read, reference only.*
4. **Sale receipt recorded → recovery dashboard updates.** BC-4 emits `SaleReceiptRecorded`; BC-6/read-model reacts. The dashboard MUST NOT read all of BC-4's `saleReceipts` directly (legacy violation).

---

## D3 — Aggregate Roots & Aggregate Ownership Model *(Area 2)*

Every aggregate root, its owning context, and its six governance responsibilities. This formalizes ownership that is implicit in the current service/rules structure. **No aggregate is redesigned** — this is a catalog.

| Aggregate Root | Owning Context | Mutation Authority | Read Authority | Audit Responsibility | Lifecycle Owner |
|---|---|---|---|---|---|
| **WorkOrder** (owns BOQItem, WorkOrderFinancials) | BC-3 | `workOrderService` + approval fns (PM/CEO/Admin) | all auth (company-scoped) | BC-6 AuditLog | BC-3 |
| **Bill** | BC-3 | `billService` + verify/approve fns (Accounts/PM/CEO) | all auth (scoped) | BC-6 | BC-3 |
| **Payment** | BC-3 | `paymentService` + release fn (Accounts/CEO) | all auth (scoped) | BC-6 | BC-3 |
| **PaymentRequest** | BC-3 | `paymentRequestService` (PM/CEO/Accounts) | all auth (scoped) | BC-6 | BC-3 |
| **VariationOrder** | BC-3 | `variationOrderService` + approve fn (PM/CEO) | all auth (scoped) | BC-6 | BC-3 |
| **Adjustment** | BC-3 | `adjustmentService` (Accounts/Admin) | all auth (scoped) | BC-6 | BC-3 |
| **Sale** (owns funding split) | BC-4 | `saleService` (Admin/PM/Accounts) | all auth (scoped) | BC-6 | BC-4 |
| **SaleReceipt** (owns ReceiptAllocation) | BC-4 | `saleReceiptService` (Accounts/Admin) | all auth (scoped) | BC-6 | BC-4 |
| **SaleSchedule** | BC-4 | `saleScheduleService` (Admin/PM/Accounts) | all auth (scoped) | BC-6 | BC-4 |
| **Company** | BC-2 | `companyService`/seed (Admin) | all auth | BC-6 | BC-2 |
| **Project** | BC-2 | `projectService` (Admin/PM) | all auth (scoped) | BC-6 | BC-2 |
| **Contractor** | BC-2 | `contractorService` (Admin/PM) | all auth | BC-6 | BC-2 |
| **Customer** | BC-2 | `customerService` (Admin/PM) | all auth (scoped) | BC-6 | BC-2 |
| **SubLocation** (Unit/Plot) | BC-2 | `subLocationService` (Admin/PM); SOLD only via BC-4 | all auth (scoped) | BC-6 | BC-2 (ownership state co-driven by BC-4) |
| **WorkCategory / TermsTemplate / NumberSeries** | BC-2 | respective masters services (Admin/PM) | all auth | BC-6 | BC-2 |
| **Vendor / Material / Store / Vehicle / UOM / MaterialCategory** | BC-2 | respective services (Purchase/Store/Admin) | restricted (vendors) / all auth | BC-6 | BC-2 |
| **User** | BC-1 | `userService`/auth (self limited; Admin) | all auth (self + admin target) | BC-6 | BC-1 |
| **JournalEntry / Account** *(planned)* | BC-5 | posting functions only (system) | Accounts/CEO/Admin | BC-6 (immutable) | BC-5 |
| **AuditLogEntry** | BC-6 | append-only (system/authenticated, `userId==auth.uid`) | Admin/CEO | self (is the ledger) | BC-6 |
| **Alert / DailySummary / AppVersion** | BC-6 | system/Admin | scoped/auth | BC-6 | BC-6 |

**Rule DM-AG1 (single owner):** every aggregate has exactly **one** owning context and one lifecycle owner (Immutable Law #1, §Appendix). The one shared-lifecycle case — `SubLocation` ownership state co-driven by BC-4 Sales — is explicit and mediated (BC-4 reaches SOLD only via the sale transaction, never a direct write), not a co-ownership of the aggregate.

**Rule DM-AG2 (consistency boundary):** a transaction mutates **one** aggregate atomically; cross-aggregate effects use §D2 mechanisms. *Known weakness (from the audit, tracked in Phase 2):* payment-release currently mutates Payment **and** Bill in one batch (both BC-3, acceptable as one context transaction) and sale-receipt mutates SaleReceipt + Sale + SaleSchedule non-atomically — the latter MUST become transactional (NN-5). Recorded in §D14.

---

## D4 — Value Objects

Immutable, identity-less structures owned inside an aggregate. These already exist as embedded types.

| Value Object | Inside Aggregate | Notes |
|---|---|---|
| **BOQItem** | WorkOrder | Embedded line; lifecycle = parent WO |
| **WorkOrderFinancials** | WorkOrder | Computed by the `computeWorkOrderFinancials` Domain Service; MUST be recomputed, never partially mutated |
| **WorkOrderBilling** *(deprecated)* | WorkOrder | `@deprecated` cached rollup; retained for back-compat only |
| **ReceiptAllocation** | SaleReceipt | Allocation of a receipt to schedules; immutable once written |
| **Money (amount + implied INR)** | many | Two-decimal; `round2`; `MONEY_EPSILON` — candidate for a first-class `Money` VO with currency (see cross-industry §D13) |
| **CompanyLabels / vertical terminology** | Company/config | Vertical config value object (Constitution §24) |

**Rule DM-VO1:** value objects are **immutable** (Immutable Law #3). A "change" replaces the whole value object (e.g. recompute financials), never a partial in-place edit.

---

## D5 — Identity Strategy *(Area 3)*

Platform-wide, permanent identifier rules. These formalize what the code already does and fix the rules for the next decade.

| Rule | Policy | Grounding |
|---|---|---|
| **Generation** | Aggregate identity is a Firestore document id (system-generated) **or** a domain-meaningful sequence for business identifiers (WO number via the transactional `numberSeries`) | [`numberSeriesService.ts`](../src/services/numberSeriesService.ts), `db.generateDocId` |
| **Global uniqueness** | Document ids are globally unique within the Firestore database | Firestore guarantee |
| **Tenant/company uniqueness** | Business identifiers (WO#, future Bill#/Payment# series) are unique **within their company** (and year) — per-company series (Constitution MC-5) | numberSeries pattern |
| **Immutability** | An aggregate's identity is **immutable for life**. WO identity fields (`woNumber/createdAt/createdBy`) are rules-enforced immutable. Renumbering = delete + recreate | `firestore.rules` WO block, Immutable Law #4 |
| **Lifetime** | An identifier lives as long as its aggregate is retained (see [`DATA_LIFECYCLE.md`](./DATA_LIFECYCLE.md)); financial ids effectively permanent (≥8y) | DATA_LIFECYCLE |
| **Versioning** | Aggregates are **not** identity-versioned; corrections are new aggregates/reversing entries, not new versions of the same id (NN-6). Domain **events** are versioned (§D7), aggregates are not | — |
| **Cross-company references** | A reference across companies is **prohibited for financial aggregates** — an aggregate belongs to one Company boundary (§D6). Shared masters (a contractor used by two companies) are referenced by id with the company resolved at the transaction, never by embedding another company's aggregate | Constitution §23, MC-1 |
| **Human-facing vs system ids** | System id (doc id) is the reference key; the human-facing business number (WO-2026-0001) is a value on the aggregate, never the reference key | — |

**Rule DM-ID1 (permanent):** identity is generated once, never reused, never mutated, never recycled across aggregates. A deleted placeholder id (e.g. the `uid==''` user placeholder) is the only reclaimable id class, and only pre-activation.

---

## D6 — Identity Boundary *(Area 7)*

**New formal concept (additive):** every aggregate root belongs to **exactly one Identity Boundary** — the ownership scope that answers "whose data is this?"

- **Primary boundary: `Company`.** Every company-owned aggregate resolves to exactly one `companyId` (directly or via its parent). This is the multi-company dimension already in `userAccess` and §23.
- **Secondary boundary: `Project`** (within a Company) for construction aggregates, and **`Company` only** for masters/identity.
- **Platform aggregates** (AuditLog, AppVersion) belong to the **Platform boundary** (cross-company by design; access-restricted).

**Rule DM-IB1 (exactly one boundary):** every aggregate belongs to exactly one identity boundary (Immutable Law #5). No aggregate is boundary-less; no aggregate is in two company boundaries.

**Rule DM-IB2 (boundary is required and enforced):** company-owned financial aggregates MUST carry a resolvable, required `companyId`, and access MUST be boundary-enforced (Constitution MC-1/MC-2, NN-29). *Known gap (audit):* `companyId` is optional on WorkOrder/Project and absent on Bill/Payment/Adjustment; today their boundary resolves via the parent WO/project. Making it required and enforced is Phase-2 P1.5 — recorded in §D14. This is a *strengthening of enforcement*, not a model change: the boundary already exists conceptually.

**Boundary hierarchy:** `Platform ⊃ Company ⊃ Project ⊃ (WorkOrder | SubLocation | …)`. Reads/writes are scoped at the Company level; unrestricted roles (ADMIN/CEO/SUPER_ADMIN) are the explicit, audited exception.

---

## D7 — Domain Events & Versioning *(Area 4)*

Formalizes the event bus (Constitution §13) with an evolution contract so events can change safely for a decade.

### D7.1 Event envelope (every domain event carries)
```
{
  eventType:     "BillApproved",          // stable name
  eventVersion:  1,                        // integer, incremented on breaking payload change
  eventId:       "<globally unique>",      // idempotency key (NN-23)
  correlationId: "<traces audit↔event↔journal↔source>", // NN-24
  occurredAt:    "<ISO>",
  companyId:     "<identity boundary>",    // §D6
  actor:         "<uid | system>",
  aggregate:     { type, id },             // the source aggregate
  payload:       { ... }                   // version-specific
}
```

### D7.2 Publisher / consumers registry
| Event | Publisher (context) | Consumers (context) |
|---|---|---|
| `BillVerified` / `BillApproved` | BC-3 | BC-5 (post), BC-6 (audit/alert) |
| `PaymentApproved` / `PaymentReleased` | BC-3 | BC-5 (post), BC-6 |
| `VariationOrderApproved` | BC-3 | BC-3 (WO financials), BC-5, BC-6 |
| `RetentionReleased` *(planned)* | BC-3 | BC-5, BC-6 |
| `SaleBooked` / `SaleSold` / `SaleReceiptRecorded` | BC-4 | BC-5, BC-6, read-models |
| `UserRoleChanged` | BC-1 | BC-6 |

**Rule DM-EV1:** every event has exactly one publisher context; consumers subscribe, never the reverse.

### D7.3 Compatibility & evolution policy
- **Additive-only within a version:** new **optional** payload fields do NOT bump `eventVersion` (backward compatible).
- **Breaking change bumps the version:** removing/renaming/retyping a field, or changing semantics, requires a new `eventVersion` and an ADR (NN-25).
- **Parallel emission during migration:** on a breaking change, publish **both** the old and new version for a deprecation window; consumers migrate; then the old version is retired.
- **Deprecation policy:** a deprecated event version is supported for **≥ 2 releases** (aligns with the Evolution Policy §D12) and is announced in `CHANGELOG.md`.
- **Consumers tolerate unknown fields** (must not break on additive fields) and **pin the versions they handle**.
- **Rule DM-EV2 (immutable events):** a published event is immutable (Immutable Law #2); a correction is a new event, never an edit.
- **Rule DM-EV3 (idempotent consumption):** consumers key on `eventId` and are idempotent (NN-23, EVT-2).

---

## D8 — Domain Services

Stateless operations that don't belong to a single aggregate. All are pure and live in [`src/lib/`](../src/lib/) (Constitution AP-9).

- **FinancialCalculationService** — `computeWorkOrderFinancials`, `recalculateBillTotals`, `outflowCeiling` (the single source of money math, NN-4; Phase-2 P0.4 consolidates the current duplicated copies).
- **Ledger builders** — `calculateLedger` (contractor), `buildTransactionStream` (customer): derive Tier-2 views.
- **Schedule engine** — `computeAutoDistribution` (FIFO), status derivation.
- **Access resolver** — `getEffectiveCompanyScope` (identity boundary resolution).
- **PostingService** *(planned, BC-5)* — maps transitions to balanced journal entries.

**Rule DM-DS1:** a Domain Service is pure (no I/O, injectable clock), unit-tested, and imported by both UI and functions — never re-implemented per caller.

---

## D9 — Domain Policies & Invariants

The always-true rules, enforced at the boundary (Constitution §8). Non-exhaustive; each maps to an existing rule + Non-Negotiable:

- **No overbilling** beyond the single `outflowCeiling` (FIN-3, NN-4).
- **No payment without approval; approve ≠ initiate** (APP-1, NN-3).
- **No money transition without the authoritative transactional check** (NN-2).
- **Money mutations atomic + idempotent** (NN-5, NN-23).
- **Journal entries balance and are immutable; financial records reversed not deleted** (NN-6).
- **Every business fact is traceable and audited** (NN-12, NN-24).
- **Every aggregate is company-scoped and boundary-enforced** (NN-29, DM-IB2).

**Rule DM-IN1:** invariants are **never bypassed** (Immutable Law #8), including by AI (§D10). An invariant change is a governed evolution (§D12).

---

## D10 — AI Governance in the Domain *(Area 5)*

Strengthens Constitution §22 with an explicit, permanent capability boundary. **The authoritative platform is always deterministic; AI is advisory.**

### AI **MAY**
- **Suggest** (draft a bill narrative, propose a schedule).
- **Summarize** (a ledger, an approval queue).
- **Classify** (categorize a document, flag a likely duplicate).
- **Predict** (recovery risk, cash-flow forecast).
- **Recommend** (next action, anomaly to review).

### AI **MAY NOT**
- Become the **source of truth** (the deterministic aggregates + journal are the record).
- **Authorize / Approve** any transition (approval is a human role at the boundary, APP-1).
- **Mutate business state** (no AI-initiated write to an aggregate; AI output is a suggestion a human/authoritative function acts on).
- **Override a domain invariant, an approval, or governance.**

**Rule DM-AI1 (deterministic authority):** every financially- or security-material outcome is produced by deterministic, testable domain logic — never by a model. AI proposals enter the system only through the same authoritative, audited, human-gated transitions as any other input (Immutable Law #7). AI-assisted actions are audited as AI-assisted (§22 AI-9) and remain within the actor's identity boundary and entitlement (AI-8/AI-10).

---

## D11 — Domain Health Indicators *(Area 6)*

Every indicator is machine-measurable, with thresholds, method, cadence, and owner. These are the domain's vital signs.

| Indicator | Target | Warning | Critical | Measurement method | Frequency | Owner |
|---|---|---|---|---|---|---|
| **Enforced-transition ratio** (money transitions via authoritative path) | 100% | < 100% | < 90% | Static scan: money transitions with a deployed-function + rules deny-test / total | Per release | Chief Architect |
| **Books reconciliation** (Tier-3 journal vs Tier-2 derived) | 0 divergence | any | > MONEY_EPSILON on any account | PostingService reconciliation report (POST-6) | Continuous / daily | Accounting owner |
| **Money-mutation atomicity** | 100% atomic | < 100% | any non-atomic money write | Static scan for read-then-write on monetary fields | Per PR (CI) | Reviewer |
| **Shared-formula compliance** | 1 implementation each | > 1 | divergent copies in prod | Grep for duplicate financial formulas | Per PR | Reviewer |
| **Cross-company isolation** | 0 leaks | — | any scoped read/write crossing a boundary | Rules-unit isolation tests (NN-29) | Per PR + per release | Security owner |
| **Audit completeness** (transitions emitting an audit entry) | 100% | < 100% | < 95% | Test: each transition asserts an audit write (WF-3) | Per release | BC-6 owner |
| **Aggregate boundary integrity** (aggregates with a required companyId) | 100% | < 100% | financial aggregate lacking companyId | Schema/type scan | Per release | Chief Architect |
| **Test coverage of financial libs** | ≥ 90% lines | < 90% | < 75% or ledgerUtils untested | Vitest coverage | Per release | QA owner |
| **Deprecated-artifact age** (events/fields past their window) | 0 overdue | any | > window (2 releases) | Deprecation registry scan | Per release | Chief Architect |
| **Orphan aggregate rate** (records violating referential guards) | 0 | any | growing | Reconcile/repair tool scan (D-9) | Monthly | Data owner |

**Rule DM-HI1:** an indicator in **Critical** blocks the affected release (Release Checklist gate). Warning is a tracked item; Target is the steady state.

---

## D12 — Domain Evolution Policy *(Area 8)*

How each element of the model may change over the next decade. Backward compatibility is preferred (Immutable Law #10); breaking change is a governed exception.

| Element | Evolution rule | ADR? |
|---|---|---|
| **Aggregate** | Additive fields freely (optional, defaulted). Removing/retyping a field, or changing its consistency boundary, is breaking → migration + parallel-read window | Yes for breaking |
| **Bounded Context** | New contexts may be added; **existing contexts are never merged or split without an ADR** naming the seam and the migration | Yes always |
| **Value Object** | Immutable; evolve by introducing a new VO version and migrating; never partial in-place change | Yes for breaking |
| **Domain Service** | Signature-additive freely; a breaking signature change updates all callers in one change (single source of truth) | Yes for breaking |
| **Domain Event** | Per §D7.3: additive fields free; breaking → `eventVersion++` + parallel emission + ≥2-release deprecation | Yes for version bump |
| **Invariant** | **Strengthening** an invariant is additive (allowed with tests). **Weakening/removing** an invariant is entrenchment-altering → ADR + Amendment (Constitution Appendix B §5.3) | Yes always |
| **Policy** | Configurable policies (thresholds, approval routing) evolve via the vertical/company config registry (§24), not code branches | ADR for new policy dimension |
| **Backward compatibility** | Preferred default. Deprecate-before-remove with `@deprecated` + read fallbacks (AP-10); support window ≥ 2 releases | — |

**Rule DM-EV-POL1:** every model evolution that is breaking, removes a concept, or weakens an invariant **requires an ADR** (NN-25) and, where it touches a Non-Negotiable, an Amendment. Additive evolution within these rules is ordinary conformant work.

---

## D13 — Cross-Industry Validation *(Area 10)*

The model supports multiple verticals **without architectural modification** — verticals are config packs over the same aggregates (Constitution §24). Aggregate **names are preserved** (a `WorkOrder` stays a `WorkOrder` in code); the *concept generalizes* and the *label* changes per vertical config. Nothing construction-specific is hard-wired into an invariant.

| Generic concept (aggregate) | Construction | Hospitality | Manufacturing | Healthcare | Education | NGO | Corporate |
|---|---|---|---|---|---|---|---|
| **Engagement/Order** (`WorkOrder`) | Work order | Service/event order | Production order | Care plan / service order | Programme / course delivery | Project/grant activity | Statement of work |
| **Deliverable line** (`BOQItem`) | BOQ item | Service line | BOM/operation | Procedure/item | Module/credit | Activity line | Deliverable |
| **Claim** (`Bill`) | Contractor bill | Vendor/service invoice | Supplier bill | Provider claim | Fee/vendor claim | Disbursement claim | Vendor invoice |
| **Outflow** (`Payment`) | Payment/release | Payout | Supplier payment | Provider payment | Disbursement | Grant payment | AP payment |
| **Asset unit** (`SubLocation`) | Plot/unit | Room/property | SKU/asset | Bed/facility | Seat/facility | Beneficiary unit | Asset/space |
| **Sale/receivable** (`Sale`) | Unit sale | Booking | Sales order | Billing episode | Enrolment/fee | Pledge | Contract/receivable |
| **Counterparty** (`Contractor`/`Vendor`/`Customer`) | Contractor/customer | Guest/vendor | Supplier/customer | Patient/provider | Student/vendor | Beneficiary/donor | Client/vendor |
| **Books** (`JournalEntry`) | Same | Same | Same | Same | Same | Same (fund accounting) | Same |

**Rule DM-CI1 (no construction leakage into the core):** no bounded context, aggregate, invariant, or Domain Service may hard-code a construction-only assumption. Construction specifics live in the vertical config (labels, enabled modules, CoA template, approval thresholds) — Constitution VERT-1…VERT-3. Verified today by the existing `BusinessType` CONSTRUCTION/HOSPITALITY split and `companyLabels`. *Generalization note:* the `Money` value object SHOULD carry an explicit currency to support non-INR verticals/geographies (additive; §D14), preserving all current INR behavior as the default.

**Verdict:** the domain model is **industry-neutral at the core** and vertical-specific only at the config edge. No architectural modification is required to onboard the listed industries; each is a config pack (§24). NGO fund-accounting and healthcare episode-billing are supported by the same posting engine with vertical CoA templates.

---

## D14 — DDD Validation & Remaining Weaknesses *(Area 12)*

Final DDD review. The model is **sound and consistent**; the weaknesses below are **implementation gaps already tracked in the audit and Phase-2 roadmap**, not model defects. Listed for the record (honesty tenet).

| # | Element | Assessment | Weakness (if any) → tracked |
|---|---|---|---|
| 1 | Bounded contexts | ✅ Cohesive, clear seams | Two payables paths (Bills, PaymentRequests) overlap within BC-3 → converge (FIN-6, tracked) |
| 2 | Aggregate roots | ✅ Well-identified, single-owner | `Adjustment` aggregate has no write UI (D-5); `SubLocation` ownership co-driven (mediated, acceptable) |
| 3 | Value objects | ✅ Immutable, embedded | `Money` lacks explicit currency → add for cross-industry (additive) |
| 4 | Domain events | ✅ Named; envelope + versioning now formalized | Bus is Phase-2 (event emission not yet universal) |
| 5 | Domain policies | ✅ Enforced at boundary | Some enforced only in undeployed server today → P0 deploy |
| 6 | Domain services | ✅ Pure, tested | Financial math duplicated → consolidate (P0.4) |
| 7 | Invariants | ✅ Explicit, mapped to NNs | Cross-doc financial invariants not yet boundary-enforced in prod → P0 |
| 8 | Context boundaries | ✅ Respected | Legacy direct `saleReceipts` reads bypass the owning service → migrate (DM-BC4) |
| 9 | Aggregate consistency | ⚠️ Mostly | Sale-receipt cross-aggregate write non-atomic → make transactional (NN-5, P0.5) |
| 10 | Entity identity | ✅ Immutable, boundary-scoped | `companyId` not yet required on all financial aggregates → P1.5 (DM-IB2) |

**Rule DM-VAL1:** none of the above is a model redesign; each is an additive strengthening or a scheduled implementation fix. The domain model is **approved as structurally sound** for Document Lock.

---

## D15 — Terminology Consistency Map *(Area 11)*

To guarantee **no conflicting vocabulary**, DDD terms are defined as synonyms of existing DSBC terms — added alongside, never replacing.

| DDD term (this doc) | Existing DSBC term (Constitution/code) | Same thing? |
|---|---|---|
| Bounded Context | (implicit) service/collection grouping | Yes — newly named |
| Aggregate Root | top-level entity / "the record" | Yes |
| Value Object | embedded immutable struct | Yes |
| Domain Event | event (Constitution §13 event bus) | Yes |
| Domain Service | pure calc module (`src/lib/`) | Yes |
| Identity Boundary | Company scope (§23) | Yes |
| Domain Policy / Invariant | business rule / Non-Negotiable | Yes |
| Published interface | deployed function / `secureApi` | Yes |
| Transition | transition (Constitution §11) | Identical term |

**Notes on referenced-but-absent documents:** the mission's *Capability Catalog* and *Feature Catalog* do not exist in this repository. They are hereby **chartered** (like the Phase-1 instruments): when authored, they MUST use this terminology map. Until then, repository terminology consistency is validated against the documents that exist — the Constitution, the audit, and this domain model — and **no conflicting vocabulary was found**; DDD terms are additive synonyms.

---

## APPENDIX — THE TEN IMMUTABLE DOMAIN LAWS *(Area 9)*

Foundational principles for every future contributor (human or AI). These are entrenched; changing one is an entrenchment-altering amendment (Constitution Appendix B §5.3).

1. **Every Aggregate has exactly one owner** (one owning context, one lifecycle owner). *(§D3)*
2. **Every Domain Event is immutable** — corrections are new events, never edits. *(§D7)*
3. **Every Value Object is immutable** — change replaces the whole object. *(§D4)*
4. **Every business fact is traceable** — audited and correlation-linked across audit ↔ event ↔ journal ↔ source. *(NN-12/NN-24)*
5. **Every Aggregate belongs to exactly one Identity Boundary** (one Company). *(§D6)*
6. **Cross-context communication follows approved mechanisms only** — direct-read, event, or published interface; never a foreign write. *(§D2)*
7. **AI is never the system of record** and never authorizes, approves, or mutates business state. *(§D10)*
8. **Domain invariants are never bypassed** — not by UI, not by service, not by AI; only the boundary is trust. *(§D9)*
9. **Domain evolution requires governance** — breaking or invariant-weakening change needs an ADR (and an Amendment where it touches a Non-Negotiable). *(§D12)*
10. **Backward compatibility is preferred** — deprecate before remove; support window ≥ 2 releases. *(§D12, AP-10)*

---

*This domain-model document is subordinate to the Architecture Constitution and governed by its Amendment Protocol. It formalizes — additively — the DDD view of the platform already built. It removes nothing, merges nothing, and redesigns nothing. Awaiting ARB approval and Document Lock.*
