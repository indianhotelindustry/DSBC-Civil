# CAP-WFC-01 — WORKFORCE FINANCIAL CONTROL
## Constitutional Reference under the Construction Enterprise Reference Model (CERM)

---

| Attribute | Value |
|---|---|
| **Capability ID** | CAP-WFC-01 |
| **Capability Name** | Workforce Financial Control |
| **Reference Model** | Construction Enterprise Reference Model (CERM) |
| **Document Class** | Constitutional Reference — **normative** |
| **Status** | Draft for ratification |
| **Supersedes** | Nothing. First issue. |
| **Technology Binding** | **NONE.** This document is stack-neutral by mandate. |
| **Audience** | Enterprise architects · business analysts · construction executives · auditors · implementers |

---

### How to read this document

This is **not** a product requirements document, a user-interface specification, an implementation
plan, or a technical design. It is the **constitutional reference** for a business capability. It
describes *what must be true* of any implementation of Workforce Financial Control in a
construction enterprise, in any technology, in any decade.

**Normative language.** The words **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT** denote absolute
requirements. **SHOULD** denotes a strong recommendation whose violation requires recorded
justification. **MAY** denotes genuine optionality.

**Precedence.** Where any part of this document appears to conflict with another, the order of
authority is:

1. **Part 1 § Immutable Laws** — these override everything, including later parts of this document.
2. **Part 1 § Constitutional Principles**
3. **Part 9 Business Rules**
4. All other parts.

If an implementation cannot satisfy an Immutable Law, the implementation is non-conformant. The
Law does not bend to accommodate the implementation. **The Law does not bend to accommodate a
customer, a contract, or a deadline.**

**Amendment.** Immutable Laws may be amended only by a formal constitutional amendment recorded
against this document, never by implementation convenience, never by verbal agreement, and never
retroactively. A capability that has amended an Immutable Law **MUST** declare so publicly in its
conformance statement.

**Conformance.** An implementation claiming conformance to CAP-WFC-01 **MUST** publish a
conformance statement enumerating: every Immutable Law satisfied; every Business Rule implemented,
deferred, or rejected with reasons; and every Exception (Part 16) it can detect. Partial
conformance is legitimate and honest. **Silent partial conformance is not.**

---

# PART 1 — ENTERPRISE PHILOSOPHY

## 1.1 Vision

> **A construction enterprise in which no rupee leaves the organisation for labour or contracted
> work unless an unbroken chain of independently-created operational evidence proves that the work
> was performed, measured, verified, and earned.**

The vision is not "accurate payroll" or "efficient billing." Those are consequences. The vision is
a state of affairs in which **overpayment is not a risk that is managed but an outcome that is
structurally unavailable** — where a person intending to overpay a contractor would have to
manufacture physical work, forge independent measurement, defeat separated approval authority, and
falsify an immutable evidence chain, rather than simply enter a larger number.

The enterprise that achieves this vision does not become slower. It becomes **faster**, because
disputes collapse: every figure has a provenance, and provenance ends arguments.

## 1.2 Mission

**Ensure every rupee paid to labour or contractors is earned, verified, traceable, auditable,
mathematically correct, and protected against financial leakage.**

Each word is load-bearing:

| Word | Meaning within this capability |
|---|---|
| **Earned** | Corresponds to physical work actually executed and accepted, not to elapsed time, presence, promise, or relationship. |
| **Verified** | Confirmed by a party who did not perform the work and does not benefit from its valuation. |
| **Traceable** | Every currency figure can be decomposed, without human interpretation, to the physical quantities and the evidence records that produced it. |
| **Auditable** | Reconstructible by a third party, after the fact, without access to the original personnel. |
| **Mathematically correct** | Computed by one canonical definition per quantity, applied identically everywhere, with deterministic rounding. |
| **Protected against leakage** | Every known mechanism by which value escapes without corresponding work is explicitly detected, prevented, or escalated. |

## 1.3 Objectives

**O-1 — Structural prevention of overpayment.** Make contractor and labour overpayment
practically impossible by design rather than detectable after the fact. Detection is a fallback,
not a strategy.

**O-2 — Evidentiary payment.** Establish that payment is the terminal consequence of a verification
chain and never an independent administrative act.

**O-3 — Complete traceability.** Guarantee that every rupee is drillable to a measured quantity, an
attendance record, a work assignment, and an approval — in that order, without gaps.

**O-4 — Separation of financial authority.** Ensure that no single actor can originate, verify,
approve, and disburse the same payment.

**O-5 — Cumulative financial truth.** Ensure the running-account principle governs all contract
payments so that no interim error compounds and every bill self-corrects against contract-to-date
reality.

**O-6 — Recovery integrity.** Guarantee that every amount owed *to* the enterprise — advances,
materials issued, hire charges, damages, statutory deductions, penalties — is recovered before
value leaves, not pursued afterwards.

**O-7 — Contractual ceiling enforcement.** Guarantee that cumulative payment can never exceed the
sanctioned contract value plus formally approved variations.

**O-8 — Labour dignity and statutory compliance.** Guarantee that workers are paid correctly, on
time, at or above statutory minima, with lawful deductions only — recognising that underpayment of
labour is itself a form of enterprise risk, not a saving.

**O-9 — Institutional memory.** Ensure that the departure of any individual — the site engineer who
"knows" the site, the contractor's mate who "remembers" the rates — does not degrade financial
control.

**O-10 — Dispute extinction.** Reduce contractor disputes by making the enterprise's position
independently verifiable and its arithmetic uncontestable.

## 1.4 Industry pain points

This capability exists because construction has structural characteristics that make financial
control genuinely harder than in manufacturing, retail, or services. These are **not** excuses;
they are the design constraints.

### 1.4.1 The work is not where the money is

Work happens at a dispersed, weather-exposed, physically inaccessible site. Money is disbursed at
an office. The two are connected only by paper or its digital descendant. **Every leakage mechanism
in construction exploits this gap.**

### 1.4.2 The unit of work is ambiguous until measured

A shirt is a shirt. But "brickwork in cement mortar 1:6 in superstructure above plinth level" is a
quantity that does not exist until a human measures it, and two competent humans measuring the same
wall may differ. Ambiguity is the raw material of overpayment.

### 1.4.3 Labour is transient, undocumented, and intermediated

Workers arrive through a *mate* or petty contractor, often without identity documents, frequently
migrant, sometimes for a single day. The enterprise pays a person it cannot reliably identify for
work it did not directly observe, on the word of an intermediary who is paid more when the count is
higher. **This is the single most exploited surface in the industry.**

### 1.4.4 Measurement is performed by the party with the least incentive to be strict

The site engineer who measures is also judged on progress. Strict measurement makes progress look
slower. The incentive gradient runs against accuracy.

### 1.4.5 Advances are structural, not exceptional

Contractors are thinly capitalised. Mobilisation advances, material advances, and secured advances
are normal. Every advance is a recovery obligation, and **unrecovered advance is the most common
single leakage in Indian construction** — often discovered only when a contractor abandons the site.

### 1.4.6 The company supplies inputs to its own contractor

Cement, steel, shuttering, fuel, power, water, cranes, and accommodation flow from enterprise to
contractor. Each is a debit that must return through recovery. Each is routinely forgotten.

### 1.4.7 Scope changes continuously and informally

Instructions are given verbally at site. Work is executed. The variation order is raised months
later, or never. The contractor claims; the enterprise cannot disprove; the enterprise pays.

### 1.4.8 Payment pressure is operational, not financial

The contractor threatens to stop work. The slab must be poured tomorrow. Payment is released
against incomplete verification "just this once." **The exception becomes the process.**

### 1.4.9 Retention is treated as a discount rather than a liability

Retention withheld is recorded as reduced expenditure rather than as an obligation. Years later the
liability surfaces, unfunded and unreconciled, frequently unpaid — creating both a financial
misstatement and a legal exposure.

### 1.4.10 Cash and informality persist

Wage disbursement in cash, thumb impressions on musters, and intermediated payment survive because
the workforce is genuinely unbanked. Informality is not fraud, but it is an environment in which
fraud is undetectable.

### 1.4.11 Rate leakage is silent

An item executed at a rate slightly above the contracted rate, or an item billed under a
higher-rate description than the work performed, leaks continuously and invisibly. No single
transaction looks wrong.

### 1.4.12 The final bill is where control collapses

Under schedule pressure and relationship fatigue, final bills are settled by negotiation rather than
computation. The accumulated rigour of a hundred running bills is surrendered in one meeting.

## 1.5 Financial leakage philosophy

> **Leakage is not theft. Theft is a small and unrepresentative subset of leakage.**

Most value that escapes a construction enterprise escapes through **process**, not crime: through
omission, ambiguity, fatigue, deference, and the absence of a rule. A control model designed only
against dishonesty will fail, because it will not be looking where the money actually goes.

**Definition.** *Financial leakage* is the aggregate of all value that exits the enterprise without
a corresponding, verified, earned entitlement — **regardless of intent.**

### The Seven Forms of Leakage

Every leakage event in this capability's risk model (Part 10) is classified into exactly one of
these forms. The taxonomy is exhaustive by construction.

| # | Form | Definition | Characteristic signature |
|---|---|---|---|
| **L1** | **Phantom** | Payment for work never performed, or to persons who never worked | Ghost labour; inflated muster; measurement of unexecuted work |
| **L2** | **Duplicate** | The same earned work paid more than once | Same quantity in two bills; same worker on two musters; re-billed variation |
| **L3** | **Excess** | Payment exceeding the correct value of work genuinely performed | Over-measurement; wrong rate; wrong item classification; arithmetic error |
| **L4** | **Premature** | Payment before entitlement is earned | Advance disguised as bill; payment against unverified measurement; part-rate abuse |
| **L5** | **Unrecovered** | Amounts owed to the enterprise that are never deducted | Unrecovered advance; unbilled material issue; unrecovered hire, fuel, damage |
| **L6** | **Unenforced** | Contractual entitlements of the enterprise never claimed | Liquidated damages waived by inaction; retention released early; penalties not levied |
| **L7** | **Erosion** | Systematic value loss through rate, scope, and classification drift | Rate creep; scope creep without variation; favourable rounding; wastage norms not enforced |

**L5 and L6 are the largest in aggregate and the least policed**, because nothing visibly *goes
wrong* — a deduction simply never happens. A control model that watches only outgoing payments will
never see them. **This capability therefore treats non-recovery as equivalent in severity to
overpayment**, because they are financially identical.

### Leakage axioms

**LA-1 — Leakage is a function of ambiguity, not of dishonesty.** Reduce ambiguity and leakage
falls, whatever the character of the participants.

**LA-2 — Every undefined term is a leakage site.** If "completed," "verified," or "as directed" is
not defined, value will escape through the definition gap.

**LA-3 — Leakage compounds where it is invisible.** A small unrecovered item repeated across a
thousand transactions exceeds a single spectacular fraud, and no one will ever notice it.

**LA-4 — Controls that depend on vigilance decay.** Any control requiring a human to *remember* to
check will fail within one personnel change. Controls must be structural.

**LA-5 — The exception becomes the process.** Any bypass used more than twice ceases to be an
exception. Therefore every bypass must be counted, time-boxed, and escalated by its own frequency.

**LA-6 — Speed is purchased with control, and the price is paid later.** Every acceleration of
payment that skips verification creates a liability that surfaces at final settlement, usually when
leverage has been lost.

**LA-7 — The enterprise's leverage is highest before payment and never returns.** Recovery after
disbursement is litigation; recovery before disbursement is arithmetic.

## 1.6 Payment philosophy

> **Payment is a consequence, not a decision.**

By the time a payment is disbursed, every question that could be asked about it must already have
been answered by an earlier, independent act. The disbursing officer is not a decision-maker; they
are the final link verifying that the chain is complete.

### The Payment Chain

No payment exists outside this chain. Each link is created by a different act, at a different time,
and — for contractor payments — by a different actor.

```
  AUTHORITY        Contract / Work Order — establishes that this party may be paid at all,
                   for what scope, at what rates, up to what ceiling
       ↓
  ASSIGNMENT       Work Assignment / Deployment — establishes who was directed to do
                   which work, where, when
       ↓
  EXECUTION        Physical work performed at site
       ↓
  OBSERVATION      Attendance (for labour) / Progress (for contract work) — establishes
                   that effort occurred
       ↓
  MEASUREMENT      Measurement Book — establishes HOW MUCH was executed, in contract units
       ↓
  VERIFICATION     Independent check by a party who did not execute and did not measure
       ↓
  VALUATION        Application of contracted rates to verified quantities — arithmetic only
       ↓
  ENTITLEMENT      Gross earned value to date, cumulative
       ↓
  ADJUSTMENT       Less: previously paid, recoveries, retention, statutory deductions,
                   penalties, damages
       ↓
  ELIGIBILITY      Net payable — a computed figure, not a negotiated one
       ↓
  APPROVAL         Financial authority accepts the computed figure within delegated limits
       ↓
  DISBURSEMENT     Money moves
       ↓
  RECORD           Immutable, drillable, permanent
```

### Payment axioms

**PA-1 — Nothing enters the chain sideways.** A payment cannot begin at ENTITLEMENT because someone
asserts an amount. It must begin at AUTHORITY.

**PA-2 — The chain is verified backwards.** At disbursement, the system proves the chain by walking
*from* the payment *to* the physical quantity — not by trusting that earlier steps occurred.

**PA-3 — A broken link voids the payment, not the rule.** If measurement is missing, the payment
waits. The rule is never waived to release the payment.

**PA-4 — Cumulative, never incremental.** Contract payments are computed as *cumulative earned
value to date, less cumulative paid to date.* This is the running-account principle, and it is
non-negotiable: it causes every prior error to self-correct at the next bill rather than compound.

**PA-5 — Recovery precedes payment.** Amounts owed to the enterprise are deducted at source. The
enterprise never pays gross and invoices back.

**PA-6 — The ceiling is absolute.** Cumulative payment may never exceed sanctioned contract value
plus approved variations. A payment that would breach the ceiling is not "approved by a senior
person"; it is **rejected**, and the ceiling is raised by formal variation or not at all.

**PA-7 — Speed is achieved by removing steps that add no verification, never by skipping steps that
do.**

**PA-8 — Labour payment is a statutory obligation, not a commercial one.** Where commercial dispute
exists with an intermediary, the worker is still paid. The dispute is settled with the intermediary,
not funded by the worker's hunger.

## 1.7 Constitutional principles

These are the standing principles of the capability. They are binding but, unlike Immutable Laws,
they admit contextual interpretation.

**CP-1 — Evidence precedes entitlement.** No claim is valid before the evidence supporting it
exists. Evidence created *after* a claim, to justify it, is not evidence.

**CP-2 — Independence of verification.** The party that verifies must be structurally incapable of
benefiting from an incorrect verification.

**CP-3 — Separation of financial powers.** Origination, verification, approval, and disbursement are
four distinct powers. No actor holds more than two, and never both approval and disbursement.

**CP-4 — Single canonical definition.** Every computed quantity has exactly one definition in the
enterprise. Two implementations of the same formula constitute a defect regardless of whether they
currently agree.

**CP-5 — Immutability of record.** Financial and evidentiary records are never altered or deleted.
They are superseded by a new record that references the old. History is append-only.

**CP-6 — Accountability through approval.** Every approval names a person, a moment, and a
delegated authority. Approval is an assumption of personal accountability, not a workflow step.

**CP-7 — Drillability.** Every presented figure must decompose to its constituents, recursively, to
primary evidence, without human explanation.

**CP-8 — Conservatism under uncertainty.** Where quantity, rate, or entitlement is genuinely
uncertain, the enterprise's exposure is minimised until the uncertainty resolves. Underpayment
pending clarity is recoverable; overpayment is frequently not.

**CP-9 — Statutory supremacy.** Where enterprise rule and statute conflict, statute prevails, and
the conflict is recorded as a defect in the enterprise rule.

**CP-10 — Transparency to the counterparty.** The contractor and the worker are entitled to see the
computation of their own entitlement. Control derived from the counterparty's ignorance is not
control; it is a dispute waiting to mature.

**CP-11 — No silent failure.** A control that cannot execute must announce its inability. A check
that is skipped must be recorded as skipped. **Absence of an alarm must never be achievable by
disabling the alarm.**

**CP-12 — Technology neutrality.** The business architecture is sovereign. No rule in this document
exists because a technology made it convenient, and no rule may be weakened because a technology
makes it awkward.

## 1.8 Immutable Laws

> **These twelve statements are absolute. They admit no exception, no override, no emergency
> bypass, and no delegated waiver. An implementation that violates any of them is non-conformant to
> CAP-WFC-01 regardless of any other merit.**

**LAW-1 — No contractor payment without verified measurement.**
Value may be attributed to contracted work only through a measurement that has been recorded and
independently verified. No measurement, no payment. Advances are not payments against work and are
governed separately by LAW-7.

**LAW-2 — No labour payment without validated attendance and a work assignment.**
A worker is paid only where both (a) attendance is validated for the period, and (b) a deployment
or work assignment establishes that the worker was directed to work under enterprise authority.
Attendance alone is insufficient; assignment alone is insufficient.

**LAW-3 — No measurement without executed work.**
Measurement records physical reality. Anticipated, scheduled, promised, or programmed work is not
measurable. Measurement in advance of execution is falsification, irrespective of intent or
certainty.

**LAW-4 — Money never moves on a single authority.**
The actor who originates a payment claim may never be the sole actor who approves it. At minimum,
origination, verification, and approval are held by different actors for every payment of
contracted work.

**LAW-5 — Every rupee is traceable to a physical quantity or a validated human-day.**
No currency amount may exist in this capability without decomposition to either (a) a measured
physical quantity at a contracted rate, or (b) a validated attendance day at an authorised wage
rate, or (c) an explicitly classified non-work amount (advance, recovery, statutory deduction,
damages) that is itself traceable to its authorising instrument.

**LAW-6 — Contract payments are cumulative, never incremental.**
Every contract payment is computed as cumulative entitlement to date less cumulative settled to
date. Standalone incremental payments that do not reconcile to a cumulative position are prohibited.

**LAW-7 — Every advance is a recovery obligation from the moment it is created.**
No advance may be issued without a defined, scheduled, enforceable recovery plan. An advance
without a recovery plan is not an advance; it is an unauthorised payment.

**LAW-8 — Recovery precedes disbursement.**
All amounts owed to the enterprise and due for recovery in the period MUST be deducted before net
payment is computed. The enterprise never disburses gross with an intention to recover later.

**LAW-9 — Cumulative payment may never exceed the authorised ceiling.**
Cumulative gross certified value may never exceed sanctioned contract value plus formally approved
variations. This limit is not overridable by seniority, urgency, or relationship. The ceiling is
raised only by a formally approved variation, or not at all.

**LAW-10 — Retention is a liability of the enterprise, never income.**
Amounts retained remain the contractor's money, held under contract. Retention MUST be recorded as
a liability with an identified release condition and date, and MUST NOT reduce recorded project
cost or appear as a saving.

**LAW-11 — Records are immutable; corrections are supersessions.**
No evidentiary or financial record may be altered or destroyed once committed. Errors are corrected
by a new record that references, explains, and supersedes the erroneous one. **The erroneous record
remains permanently visible.**

**LAW-12 — Every exception is recorded, attributed, time-boxed, and counted.**
Any deviation from normal control — emergency payment, manual override, waived check, out-of-turn
release — MUST record who authorised it, why, under what authority, and for how long, and MUST be
counted against that authoriser. **An exception that is not counted has not been recorded.**

## 1.9 Design principles

Design principles guide the construction of any conforming implementation.

**DP-1 — Structural over procedural.** Prefer a control that makes the wrong outcome impossible over
a control that instructs a person not to cause it.

**DP-2 — Prevent, then detect, then correct.** In that order of preference. Detection is what
remains when prevention was not achievable; correction is what remains when detection was late.

**DP-3 — Fail closed on money.** Where a financial control cannot execute — evidence unavailable,
verification unreachable, computation indeterminate — the payment does not proceed. Financial paths
never degrade to a weaker path on failure.

**DP-4 — One definition, one place.** Each formula, rate, threshold, and status vocabulary exists
once and is referenced everywhere.

**DP-5 — Evidence at the point of creation.** Capture evidence where and when reality occurs, from
the actor who observes it. Evidence reconstructed later in an office is testimony, not evidence.

**DP-6 — Design for the adversarial insider.** Assume a competent, motivated participant who
understands the controls and benefits from defeating them. Controls that only survive good faith
are decoration.

**DP-7 — Make the honest path the fast path.** If compliance is slower than the workaround, the
workaround wins. Control must be the path of least resistance.

**DP-8 — Cumulative reconciliation over incremental trust.** Every period, re-derive the whole
position rather than trusting the accumulated sum of increments.

**DP-9 — Explicit over implied.** Nothing significant is inferred from absence. "No objection
recorded" is not approval; "not marked absent" is not attendance.

**DP-10 — Human judgement where judgement is required, never where arithmetic suffices.** Machines
must not adjudicate whether a wall is acceptable. Humans must not compute a bill.

**DP-11 — Every control declares its own failure.** A control MUST be able to report that it did
not run. Silence must never be indistinguishable from success.

**DP-12 — Time is a first-class dimension.** Rates, wages, statutory minima, contract terms, and
personnel authority all change. Every computation is performed against the values in force **at the
effective date of the work**, not the values in force at the time of computation.

---

# PART 2 — ENTERPRISE SCOPE

## 2.1 In Scope

CAP-WFC-01 governs the complete financial control of human effort applied to construction works —
whether that effort is engaged directly by the enterprise, supplied through an intermediary, or
contracted as an outcome.

### 2.1.1 Workforce engagement and identity

- Establishment and maintenance of worker identity, including workers without formal documentation.
- Classification of workers by trade, skill grade, and engagement type.
- Registration of contractors, petty contractors, labour suppliers, and gang leaders (*mates*).
- Engagement instruments: labour contracts, work orders, rate contracts, piece-rate agreements.
- Statutory registration obligations attaching to workforce engagement.

### 2.1.2 Deployment and assignment

- Allocation of workers and gangs to projects, sites, and work fronts.
- Work assignment linking workforce to specific activities and locations.
- Inter-project and inter-contractor transfer of labour (**borrowed labour**).
- Deployment planning against sanctioned strength and budgeted cost.

### 2.1.3 Attendance and effort observation

- Capture, validation, and correction of attendance.
- Muster roll maintenance and closure.
- Overtime authorisation and capture.
- Idle time, rain day, hindrance, and stand-by treatment.
- Detection of attendance anomalies including duplicate and ghost presence.

### 2.1.4 Measurement of executed work

- The Measurement Book as the enterprise's primary record of physical execution.
- Joint measurement, check measurement, and test check.
- Measurement revision, cancellation, and supersession.
- Measurement evidence: levels, dimensions, photographs, test results, pour cards.
- Quantity reconciliation against drawings, schedules, and theoretical consumption.

### 2.1.5 Valuation and entitlement

- Application of contracted rates to verified quantities.
- Running Account (RA) bill preparation, certification, and settlement.
- Piece-rate, day-rate, and lump-sum valuation.
- Part-rate payment for incomplete items.
- Price variation and escalation where contractually provided.
- Star rates / non-scheduled item rate derivation and approval.

### 2.1.6 Wage determination and settlement

- Wage computation for directly engaged and intermediated labour.
- Weekly, fortnightly, and monthly settlement cycles.
- Wage cards and individual worker earning records.
- Statutory minimum wage compliance verification.
- Bonus, incentive, and productivity-linked payment.

### 2.1.7 Recovery and deduction

- Advance issue, tracking, and scheduled recovery (mobilisation, material, secured, ad-hoc).
- Recovery for materials issued by the enterprise to the contractor.
- Recovery for plant, equipment, and vehicle hire.
- Recovery for fuel, power, water, and accommodation.
- Recovery for damage, loss, rework, and rejected work.
- Statutory deductions attaching to payment.
- Liquidated damages and contractual penalties.

### 2.1.8 Retention and security

- Retention withholding, accumulation, and release.
- Security deposits, earnest money, and performance guarantees insofar as they affect payment.
- Defect liability period obligations affecting release.

### 2.1.9 Payment authorisation and disbursement

- Payment request origination, verification, and approval.
- Delegated financial authority and approval limits.
- Payment voucher generation and disbursement instruction.
- Emergency and out-of-turn payment governance.
- Payment reversal, recall, and stop-payment.

### 2.1.10 Contractor financial position

- Contractor exposure, running account position, and net liability.
- Contractor performance against contract ceiling.
- Final bill, no-claim certificate, and account closure.

### 2.1.11 Productivity and cost intelligence

- Labour productivity measurement against norms.
- Labour cost per unit of output.
- Cost-to-complete and forecast exposure attributable to workforce.

### 2.1.12 Control, audit, and exception management

- The complete business rule catalogue (Part 9).
- Risk detection, escalation, and recovery (Part 10).
- Audit trail, evidence hierarchy, and investigation (Part 11).
- The exception library and its governance (Part 16).

## 2.2 Out of Scope

Explicitly excluded. Exclusion means **this capability does not govern it**; it does not mean the
enterprise does not need it.

| # | Excluded | Rationale | Governed by |
|---|---|---|---|
| **X-1** | Human resource management — recruitment, appraisal, career, discipline, training | Concerns the employment relationship, not the financial control of executed work | CAP-HCM |
| **X-2** | Payroll for salaried staff | Salary is time-based and not earned against measured site output | CAP-HCM / CAP-FIN |
| **X-3** | General financial accounting, ledgers, trial balance, statutory books | This capability *feeds* accounting; it is not accounting | CAP-FIN |
| **X-4** | Treasury, banking operations, cash management, fund planning | Concerns money movement mechanics, not entitlement | CAP-TRE |
| **X-5** | Material procurement, vendor management, purchase, inventory | Concerns goods; enters here only as **recovery** for materials issued | CAP-SCM |
| **X-6** | Plant and equipment management, maintenance, utilisation | Enters here only as **hire recovery** | CAP-PLT |
| **X-7** | Project planning, scheduling, programme, critical path | Provides context; does not authorise payment | CAP-PPM |
| **X-8** | Design, drawings, BOQ authoring, technical specification | Supplies the rate schedule and item definitions as inputs | CAP-DES |
| **X-9** | Quality assurance, testing regimes, defect management | Supplies acceptance evidence as an input to measurement | CAP-QLT |
| **X-10** | Health, safety, and environment management | Interacts through site access and penalties, but is not a financial control capability | CAP-HSE |
| **X-11** | Client-side billing and revenue recognition | This capability governs money **out**, not money **in** | CAP-REV |
| **X-12** | Taxation computation, filing, and statutory return preparation | Deduction *at source* is in scope; computation and filing are not | CAP-TAX |
| **X-13** | Legal, contract drafting, arbitration, litigation | Contract terms are consumed as authority; their creation is not governed here | CAP-LEG |
| **X-14** | Subcontractor technical qualification and empanelment | Precedes engagement; supplies eligibility as an input | CAP-SCM |

### 2.2.1 Boundary clarifications

Ambiguous cases, resolved definitively:

| Question | Ruling |
|---|---|
| Is issuing cement to a contractor in scope? | **No.** The material issue is CAP-SCM. **The recovery of its value from the contractor's bill is in scope.** |
| Is computing TDS in scope? | **The deduction from payment is in scope.** Rate determination, deposit, and return filing are CAP-TAX. |
| Is deciding whether a wall is acceptable in scope? | **No** — that is CAP-QLT. **Whether an unaccepted wall may be measured and paid is in scope, and the answer is no.** |
| Is paying a salaried site engineer in scope? | **No** — CAP-HCM. Their *act of measuring and verifying* is in scope. |
| Is a labour supply contractor's profit margin in scope? | **Yes**, insofar as it forms part of the contracted rate and affects entitlement and statutory minimum-wage pass-through. |
| Is worker welfare — food, housing, transport — in scope? | **Only** where it creates a recovery against wages or a contractual obligation affecting payment. |
| Is the bank transfer itself in scope? | **The disbursement instruction and its authorisation are in scope.** The banking mechanics are CAP-TRE. |

## 2.3 Dependencies

CAP-WFC-01 cannot operate without these. Each dependency is a **precondition**, and its absence is
a control failure, not an inconvenience.

| # | Dependency | Provided by | What is consumed | Consequence if absent |
|---|---|---|---|---|
| **D-1** | Contract / Work Order authority | CAP-SCM, CAP-LEG | Scope, rate schedule, ceiling, retention %, advance terms, LD terms, payment terms | **No payment is possible.** LAW-1 and PA-1 fail at the first link |
| **D-2** | Rate schedule / BOQ | CAP-DES, CAP-SCM | Item codes, descriptions, units, rates, effective dates | Valuation is impossible; measurement cannot be priced |
| **D-3** | Project and site structure | CAP-PPM | Project, site, block, level, work front hierarchy | Deployment and measurement cannot be located; cost cannot be attributed |
| **D-4** | Activity / WBS definition | CAP-PPM | Activity codes against which work is assigned and measured | Work assignment (LAW-2) cannot be established |
| **D-5** | Quality acceptance | CAP-QLT | Acceptance status of executed work, test results | Unaccepted work cannot be excluded from measurement |
| **D-6** | Material issue records | CAP-SCM | Quantities and values issued to each contractor | Recovery under L5 fails; leakage is invisible |
| **D-7** | Plant and equipment hire records | CAP-PLT | Hire hours, rates, fuel issued per contractor | Hire recovery fails |
| **D-8** | Statutory parameters | CAP-TAX, CAP-LEG | Minimum wage rates by trade and region, deduction rates, thresholds, effective dates | Statutory compliance cannot be verified; CP-9 fails |
| **D-9** | Organisational authority model | CAP-HCM | Persons, roles, delegated financial limits, validity periods | Approval (LAW-4) cannot be attributed or bounded |
| **D-10** | Calendar and site conditions | CAP-PPM, CAP-HSE | Working days, holidays, declared rain days, site closures | Attendance validation and idle-time treatment fail |
| **D-11** | Banking / disbursement channel | CAP-TRE | Payment execution and confirmation | Entitlement can be computed but not settled |
| **D-12** | Financial accounting structure | CAP-FIN | Cost centres, account codes, period status | Cost cannot be posted or attributed |
| **D-13** | Identity foundation | CAP-HCM | Worker identity records, biometric or documentary reference | Ghost labour (XCP-01) becomes undetectable |

## 2.4 Integration points

Integration points define what **crosses the capability boundary**, in which direction, and with
what obligation. Each is a contract between capabilities.

### 2.4.1 Inbound

| # | From | Information | Trigger | Obligation on WFC |
|---|---|---|---|---|
| **I-1** | CAP-SCM | Contract award, rate schedule, ceiling, terms | On award and on amendment | MUST NOT permit payment before receipt; MUST honour effective dates |
| **I-2** | CAP-DES | BOQ items, units, specifications, drawing revisions | On issue and revision | MUST measure against the revision in force at execution date |
| **I-3** | CAP-PPM | Project/site/WBS structure, calendar, programme | On creation and change | MUST reject assignment to undefined structure |
| **I-4** | CAP-QLT | Acceptance, rejection, test results, defect notices | On inspection | MUST exclude rejected work from measurement; MUST support rework recovery |
| **I-5** | CAP-SCM | Material issue to contractor | On issue | MUST create a recovery obligation automatically, not on request |
| **I-6** | CAP-PLT | Equipment hire and fuel issue | On issue/period close | MUST create a recovery obligation automatically |
| **I-7** | CAP-HCM | Persons, roles, delegated authority, validity | On change | MUST re-evaluate pending approvals against changed authority |
| **I-8** | CAP-TAX | Statutory rates, thresholds, minimum wages | On notification | MUST apply by effective date, never retroactively without restatement |
| **I-9** | CAP-HSE | Site access denial, safety penalties | On event | MUST support penalty recovery and access-based attendance invalidation |
| **I-10** | CAP-TRE | Payment execution confirmation, failure, return | On settlement | MUST reconcile; MUST reinstate liability on failed disbursement |

### 2.4.2 Outbound

| # | To | Information | Trigger | Obligation on the receiver |
|---|---|---|---|---|
| **O-1** | CAP-FIN | Certified cost, accrual, liability, retention liability | On certification and period close | MUST post without re-computation; WFC's figure is authoritative |
| **O-2** | CAP-TRE | Approved disbursement instruction with payee and amount | On approval | MUST NOT alter amount or payee |
| **O-3** | CAP-PPM | Physical progress derived from measurement | On measurement verification | MUST treat measured quantity as the authoritative progress fact |
| **O-4** | CAP-SCM | Contractor performance, exposure, recovery status | Continuous | Informs future award and empanelment |
| **O-5** | CAP-TAX | Deduction base and deducted amounts | On payment | Basis for deposit and return |
| **O-6** | CAP-HCM | Worker earning history, engagement duration, statutory records | Continuous | Basis for statutory registers and welfare entitlement |
| **O-7** | CAP-PLT / CAP-SCM | Confirmation that issued value has been recovered | On recovery | Closes the loop on issued value |
| **O-8** | Enterprise Audit | Exception events, override events, control failures | On occurrence | Independent oversight |

### 2.4.3 Integration invariants

**II-1** — Inbound authority is **consumed, never created**. WFC MUST NOT create a contract, a rate,
a statutory threshold, or an approval limit. It may only consume and enforce them.

**II-2** — Outbound financial figures are **authoritative and non-negotiable**. A downstream
capability that re-computes a WFC figure and obtains a different answer has discovered a defect;
it MUST NOT silently substitute its own value.

**II-3** — Every integration MUST be **effective-dated**. Values crossing the boundary carry the
date from which they apply, and WFC applies them by work date, not receipt date (DP-12).

**II-4** — Integration failure MUST **fail closed** on financial paths (DP-3). If material issue
data is unavailable, bills that require recovery MUST wait; they MUST NOT proceed with recovery
assumed to be nil.

---

# PART 3 — BUSINESS CAPABILITY

## 3.1 Capability definition

> **Workforce Financial Control is the enterprise capability that converts human effort applied to
> construction works into verified financial entitlement, and discharges that entitlement without
> leakage.**

It is defined by three simultaneous obligations that are frequently in tension:

1. **To the enterprise** — that no value leaves without corresponding earned work.
2. **To the counterparty** — that all value genuinely earned is paid, correctly and on time.
3. **To the record** — that both of the above remain provable indefinitely.

A capability that satisfies only the first is oppressive and will lose its workforce and its
contractors. A capability that satisfies only the second is generous and will be looted. A
capability that satisfies both but not the third cannot defend itself in audit, arbitration, or
statutory inspection.

**CAP-WFC-01 exists to hold all three simultaneously.**

## 3.2 Capability responsibilities

### R-1 — Establish and maintain workforce identity and engagement authority
Know who may be paid, under what instrument, at what rates, and within what limits, at every point
in time.

### R-2 — Establish assignment and deployment authority
Know who was directed to perform which work, where, and when — such that no effort can later be
claimed without a prior instruction to expend it.

### R-3 — Observe and validate effort
Capture attendance and presence at the point of occurrence, validate it against assignment and site
reality, and detect anomalies structurally rather than by inspection.

### R-4 — Measure executed work
Maintain the Measurement Book as the enterprise's authoritative record of physical execution, with
independent verification and permanent traceability to evidence.

### R-5 — Value entitlement
Convert verified quantities and validated attendance into currency by canonical, deterministic
computation using rates in force at the effective date.

### R-6 — Compute and enforce recoveries
Identify, accumulate, schedule, and enforce every amount owed to the enterprise, deducting at
source before value leaves.

### R-7 — Withhold and administer retention
Withhold contractual retention, record it as liability, and release it only on satisfaction of
defined conditions.

### R-8 — Enforce contractual and financial ceilings
Prevent cumulative payment from exceeding sanctioned authority under any circumstance.

### R-9 — Route approval through delegated authority
Ensure every payment passes through separated, delegated, personally-attributed approval within
validity and limit.

### R-10 — Authorise disbursement
Issue a disbursement instruction that is complete, unambiguous, and immutable, and reconcile its
execution.

### R-11 — Maintain the evidentiary record
Preserve an immutable, drillable, permanently reconstructible record of every figure and every
decision.

### R-12 — Detect, escalate, and govern exceptions
Recognise abnormal conditions, prevent them where possible, escalate them where not, and count them
always.

### R-13 — Report financial position and control health
Present contractor exposure, workforce cost, productivity, leakage indicators, and control
effectiveness to those accountable for them.

### R-14 — Preserve statutory compliance
Guarantee that engagement, wage, deduction, and record-keeping obligations imposed by law are
satisfied and evidenced.

## 3.3 Success criteria

A conforming implementation is **successful** when all of the following are demonstrably true. Each
is stated as a testable assertion, not an aspiration.

### Structural criteria

| # | Criterion | Test |
|---|---|---|
| **SC-1** | No payment exists without a complete Payment Chain | Sample any payment; walk backwards to physical quantity. Zero gaps permitted |
| **SC-2** | No cumulative payment exceeds authorised ceiling | For every contract, cumulative certified ≤ sanctioned + approved variations. Zero exceptions |
| **SC-3** | No actor holds conflicting financial powers | For every payment, originator ≠ verifier ≠ approver. Disburser never approves |
| **SC-4** | Every advance has an enforceable recovery plan | Zero advances exist without scheduled recovery |
| **SC-5** | Every retention amount is recorded as liability with a release condition | Retention liability reconciles to the rupee against contract terms |
| **SC-6** | Every record is immutable | No historical financial or evidentiary record has been altered or deleted |
| **SC-7** | Every exception is attributed and counted | Exception count by authoriser is available for any period |

### Financial criteria

| # | Criterion | Test |
|---|---|---|
| **SC-8** | Leakage forms L1–L7 are each explicitly detected | Named control exists for each form; each demonstrably fires |
| **SC-9** | Recovery completeness | Value issued to contractors reconciles to value recovered plus value outstanding, with zero unexplained residue |
| **SC-10** | Arithmetic integrity | Independent recomputation of any bill reproduces the certified figure exactly |
| **SC-11** | No duplicate settlement | No quantity and no attendance day is settled more than once |
| **SC-12** | Statutory minimum compliance | No worker's effective wage falls below statutory minimum for trade and region at effective date |

### Operational criteria

| # | Criterion | Test |
|---|---|---|
| **SC-13** | Payment cycle time within committed limits | Measured from measurement verification to disbursement |
| **SC-14** | Dispute rate declining | Contractor disputes per hundred bills trends downward |
| **SC-15** | Evidence completeness at first submission | Bills rejected for missing evidence trends downward |
| **SC-16** | Control health is visible | Every control reports execution, including failure to execute (CP-11) |

### The negative criterion

**SC-17 — The overpayment thought experiment.**
Given an actor with full system access and full domain knowledge but no ability to alter history or
impersonate others, it MUST NOT be possible to cause an overpayment without:
(a) creating a false measurement, **and**
(b) obtaining independent verification of it, **and**
(c) obtaining approval within a delegated limit, **and**
(d) leaving a permanent, attributed, drillable record of each.

If any single actor can defeat this alone, the capability has failed regardless of every other
criterion.

## 3.4 Capability boundaries

### 3.4.1 Upstream boundary — where WFC begins

WFC begins at the moment a **valid engagement authority exists** — a contract, work order, or labour
engagement instrument. Everything before that moment (tendering, negotiation, qualification, award)
is outside.

**The boundary is crossed by: an executed engagement instrument with defined scope, rates, ceiling,
and terms.**

### 3.4.2 Downstream boundary — where WFC ends

WFC ends at the moment an **approved disbursement instruction** is issued and its execution
reconciled. The mechanics of moving money, the bank relationship, and the accounting entry are
outside.

**The boundary is crossed by: an immutable, approved instruction naming payee, amount, and
reference.**

### 3.4.3 Lateral boundary — what WFC does not decide

WFC does **not** decide:

- Whether work is technically acceptable → **CAP-QLT decides; WFC obeys.**
- What a fair rate is → **CAP-SCM decides at contracting; WFC applies.**
- Whether the programme is achievable → **CAP-PPM decides; WFC records consequences.**
- Whether a person should be employed → **CAP-HCM decides; WFC pays.**
- Whether the enterprise can afford the payment → **CAP-TRE decides timing; WFC decides entitlement.**

**WFC decides exactly one class of question: *what is owed, to whom, on what evidence, and may it
be paid now?***

### 3.4.4 Temporal boundary

WFC's obligation over a given engagement begins at engagement and does **not** end at final payment.
It persists through:

- the defect liability period, during which retention remains a live liability;
- the statutory record-retention period, during which evidence must remain reconstructible;
- the limitation period for contractual claims.

**A contract is not closed when the last rupee is paid. It is closed when the last obligation
expires and the record is sealed.**

---

# PART 4 — ENTERPRISE ACTORS

An **actor** is a role that holds responsibility, authority, decision rights, or accountability
within this capability. Actors are roles, never named individuals, and a single person may hold
several — subject always to the separation constraints in § 4.14.

Each actor is defined by four distinct attributes, deliberately kept separate because they are
routinely and dangerously conflated:

| Attribute | Question it answers |
|---|---|
| **Responsibility** | What must this actor *do*? |
| **Authority** | What is this actor *permitted* to do? |
| **Decision rights** | What may this actor *decide alone*? |
| **Accountability** | What is this actor *answerable for* when it goes wrong? |

> **Authority without accountability produces leakage. Accountability without authority produces
> paralysis. Every actor below has both, deliberately matched.**

## 4.1 Worker (Labourer / Karigar / Skilled Tradesperson)

**Classification:** Internal-adjacent · Beneficiary · Non-decision-making

**Responsibility** — Present themselves for work as assigned; perform assigned work; permit
attendance capture; acknowledge receipt of wages.

**Authority** — To receive correct and timely wages for validated attendance. To inspect their own
wage card and earning record (CP-10). To raise a grievance regarding underpayment or non-payment.

**Decision rights** — Whether to accept engagement. Whether to dispute their own recorded
attendance or wage computation. **None over enterprise financial process.**

**Accountability** — For their own presence and for the accuracy of their identity declaration.
**Not** accountable for enterprise control failures. A worker MUST NOT bear the financial
consequence of the enterprise's inability to verify.

> **Constitutional note.** The worker is the only actor in this capability who is structurally
> unable to protect their own interest — typically transient, frequently unbanked, often illiterate
> in the language of the contract, and intermediated by a party whose interest opposes theirs.
> **CP-10 and LAW-2 exist substantially for this actor's protection.** The capability's obligation
> to the worker is not charity; underpaid and unrecorded labour is a statutory, reputational, and
> operational liability of the first order.

## 4.2 Gang Leader / Mate / Jamadar

**Classification:** Intermediary · **Structurally conflicted** · Operational

**Responsibility** — Assemble and present a gang; supervise its work; report attendance and output;
distribute wages where wages are intermediated.

**Authority** — To present workers for engagement. To report daily attendance and progress. To
receive gang-level payment **where and only where the contract explicitly so provides**.

**Decision rights** — Composition of the gang. Allocation of gang members to tasks within an
assignment. **No authority to determine attendance validity, quantity, rate, or entitlement.**

**Accountability** — For the accuracy of reported attendance and gang composition. For the actual
distribution of intermediated wages to the named workers. **Personally accountable for ghost
labour presented under their gang.**

> **⚠ Conflict declaration.** The mate is paid more when the headcount is higher and the output is
> reported as greater. **This actor's economic interest is directly opposed to the enterprise's
> financial control on the single most-exploited surface in the industry (§ 1.4.3).** Therefore:
> attendance reported by a mate is a **claim**, never evidence (Part 11 evidence hierarchy), and
> MUST be independently validated before it can support payment. A conforming implementation MUST
> NOT permit mate-reported attendance to flow directly to wage computation.

## 4.3 Contractor / Subcontractor

**Classification:** External · Counterparty · Commercial

**Responsibility** — Execute contracted scope to specification; deploy adequate resources; maintain
statutory compliance for their own workforce; present claims supported by evidence; accept
measurement or dispute it through defined process.

**Authority** — To claim payment for executed work. To participate in joint measurement. To inspect
the computation of their own entitlement (CP-10). To dispute measurement, valuation, or recovery
through the defined dispute process. To receive retention on satisfaction of conditions.

**Decision rights** — Their own means, methods, and workforce (subject to contract). Whether to
accept a measurement or dispute it. Whether to accept a rate for non-scheduled work. **No decision
rights over enterprise measurement, verification, recovery, or approval.**

**Accountability** — For work quality and quantity claimed. For statutory compliance regarding
their own workers. For the accuracy of claims. For recovery obligations arising from advances and
issued materials. **For the wages of workers they supply — a liability the enterprise cannot
escape** and therefore must monitor.

> **Constitutional note.** The contractor is a counterparty, **not an adversary.** CP-10 requires
> transparency to them. A contractor who can see and verify their own computation disputes less,
> not more. However, the contractor's claim is *always* a claim and *never* evidence.

## 4.4 Petty Contractor / Labour Supplier

**Classification:** External · Intermediary · Commercial · **Statutorily significant**

**Responsibility** — Supply labour of specified trade and grade; maintain statutory registration;
pay supplied workers at or above statutory minima; maintain wage records.

**Authority** — To supply workers. To claim payment for supplied labour-days at contracted rates.

**Decision rights** — Which individuals to supply. **No decision rights over attendance validation
or wage entitlement of the supplied workers.**

**Accountability** — For statutory compliance in respect of supplied workers. For actual payment to
those workers. For the identity of persons supplied.

> **⚠ Principal-employer exposure.** Where a labour supplier fails to pay statutory wages, liability
> characteristically flows to the **principal employer** — the enterprise. **The enterprise's
> financial control must therefore extend past its own counterparty into the counterparty's
> workforce.** This is the constitutional basis for requiring individual-worker visibility even
> where payment is intermediated (see Business Rules **LAB-**, **BRL-**).

## 4.5 Site Supervisor / Foreman

**Classification:** Internal · Operational · **First observer**

**Responsibility** — Direct daily work; assign workers and gangs to fronts; observe and record
attendance at the point of occurrence; record daily progress; report hindrance, idle time, and
site conditions.

**Authority** — To assign workers to work fronts within approved deployment. To record attendance.
To certify presence. To report and classify idle time. To stop unsafe or unauthorised work.

**Decision rights** — Daily task allocation. Attendance recording. Overtime *recommendation*.
**No authority to determine wage rates, measure for payment, or approve any payment.**

**Accountability** — For the truth of attendance recorded. For the reality of assignments made. For
identifying ghost labour in their own area — **an area supervisor who did not detect ghost labour
under their direct supervision is accountable for it.**

> **Constitutional note.** This actor stands at the boundary between physical reality and the
> record. **Almost every leakage in class L1 (phantom) passes through this actor**, either by
> commission or by inattention. Their recording is primary evidence (Part 11), and its integrity
> is therefore constitutionally significant.

## 4.6 Site Engineer / Measurement Engineer

**Classification:** Internal · Technical · **Primary measurer**

**Responsibility** — Measure executed work in the Measurement Book; record dimensions, levels, and
supporting evidence; apply correct item classification; record measurement date and location
precisely; identify non-conforming work for exclusion.

**Authority** — To record measurement in the Measurement Book. To classify work against BOQ items.
To reject unexecuted or unacceptable work from measurement. To require joint measurement.

**Decision rights** — What quantity was physically executed. Which BOQ item a work correctly falls
under. Whether the evidence supports measurement. **No authority to determine rates, approve bills,
or authorise payment.**

**Accountability** — **Personally and permanently accountable for the accuracy of every measurement
recorded, without time limit.** For correct item classification — misclassification is leakage form
L3/L7. For the completeness of measurement evidence.

> **⚠ Conflict declaration.** This actor is frequently assessed on **project progress**, and strict
> measurement makes progress appear slower (§ 1.4.4). **The measurer's performance evaluation MUST
> NOT include progress velocity**, or the conflict is institutionalised. This is a constitutional
> requirement on the enterprise's HR design, imposed by this capability, and is one of the few
> places where CAP-WFC-01 constrains a capability outside its own boundary — because the integrity
> of measurement is the foundation on which LAW-1 rests.

## 4.7 Check Measurement Officer / Quantity Surveyor

**Classification:** Internal · Technical · **Independent verifier**

**Responsibility** — Independently verify recorded measurement by test check or full re-measurement;
confirm item classification; confirm arithmetic; confirm evidence sufficiency; record verification
outcome including disagreement.

**Authority** — To re-measure any recorded work. To reject, reduce, or return a measurement. To
determine the test-check sample. To escalate suspected falsification.

**Decision rights** — Whether recorded measurement is accepted, reduced, or rejected. The extent of
verification applied. **No authority to increase a measurement beyond what they have independently
verified.**

**Accountability** — For the integrity of verification. **For measurements they accepted that later
prove false.** For applying the mandated check percentage.

> **Constitutional note.** This actor is the practical embodiment of **CP-2 (independence of
> verification)** and the primary structural defence against leakage form L3. Their independence
> from the measurer is not organisational preference; it is constitutional. Where an enterprise is
> too small to separate these roles, the check MUST be performed by an actor outside the project —
> **never by the same person, and never omitted.**

## 4.8 Project Manager

**Classification:** Internal · Managerial · Accountable for outcome

**Responsibility** — Deliver the project within cost, time, and quality; approve deployment plans;
authorise work assignment; review contractor performance; certify that claimed work serves the
project; manage contractor relationship.

**Authority** — To approve deployment within sanctioned strength. To authorise work assignments and
variations within delegated limit. To certify running bills within delegated limit. To recommend
contractor action.

**Decision rights** — Resource deployment. Work sequencing. Acceptance of contractor performance.
Certification of bills within limit. **No authority to exceed contract ceiling (LAW-9), waive
recovery (LAW-8), or approve their own origination (LAW-4).**

**Accountability** — For project cost outcome including workforce cost. For the reality of work
certified. For contractor exposure within their project. For deployment efficiency.

> **⚠ Conflict declaration.** This actor is accountable for **progress and relationship**, both of
> which are served by faster and larger payment. This is the structural origin of § 1.4.8 (payment
> pressure). Delegated limits and LAW-4 exist precisely to bound this actor's ability to act on
> that pressure.

## 4.9 Accountant / Accounts Officer

**Classification:** Internal · Financial · Computational verifier

**Responsibility** — Verify bill arithmetic; verify recovery completeness; verify statutory
deductions; verify retention computation; verify ceiling compliance; prepare payment vouchers;
maintain contractor accounts.

**Authority** — To verify or reject a bill on financial grounds. To compute and apply recoveries and
deductions. To return a bill for evidentiary insufficiency. **To halt any payment that breaches a
financial control.**

**Decision rights** — Whether arithmetic is correct. Whether recoveries are complete. Whether
deductions are correct. Whether ceiling permits payment. **No authority to determine quantity, rate,
or technical acceptability, and no authority to approve their own verification.**

**Accountability** — For arithmetic integrity. **For recovery completeness — an unrecovered advance
is this actor's accountability** (leakage form L5). For statutory deduction correctness. For
retention liability accuracy.

## 4.10 Finance Controller / CFO

**Classification:** Internal · Executive · Financial authority

**Responsibility** — Own the financial control framework; set and maintain delegated authority
limits; approve payments above departmental limits; own retention liability; own contractor
exposure; report financial position.

**Authority** — To approve payments within executive limit. To set recovery and retention policy
within contract terms. To suspend payment to any contractor. To mandate audit. To authorise
exceptions within a defined, counted envelope (LAW-12).

**Decision rights** — Financial policy within contractual and statutory bounds. Payment approval
within limit. Exception authorisation. **No authority to breach an Immutable Law, and specifically
no authority to waive the ceiling (LAW-9) or authorise payment without measurement (LAW-1).**

**Accountability** — For aggregate leakage. For the integrity of the control framework. For
retention liability accuracy and funding. For the enterprise's exposure to contractors.

## 4.11 Chief Executive / Managing Director

**Classification:** Internal · Executive · Ultimate accountability

**Responsibility** — Own enterprise outcome; own the control culture; resolve conflicts between
capabilities; sanction contracts and variations above executive limits.

**Authority** — Highest delegated financial authority. To sanction contracts and ceiling
enhancements through formal variation. To restructure delegated authority. **To constitute, but not
to override, the control framework.**

**Decision rights** — Enterprise financial policy. Ceiling enhancement **through formal variation
only.** Contractor blacklisting.

**Accountability** — For enterprise financial outcome and for the existence and health of the
control framework itself.

> **⚠ Constitutional limit — the most important sentence in Part 4.** The Chief Executive **MUST
> NOT** be able to cause a payment that violates an Immutable Law. Where a genuine business need
> requires such a payment, the correct instrument is a **formal, recorded variation of the
> underlying authority** — never an override of the control. **A control framework that the highest
> authority can silently bypass is not a control framework; it is a suggestion.**

## 4.12 Internal Auditor

**Classification:** Internal · Independent · Non-operational

**Responsibility** — Independently examine transactions, evidence, and control operation; test
control effectiveness; investigate exceptions; report findings without operational interference.

**Authority** — Unrestricted read access to every record, every evidence artefact, and every audit
trail. To require explanation from any actor. To escalate directly to the audit committee, bypassing
executive management.

**Decision rights** — Audit scope and method. Finding classification and severity. **No operational
decision rights whatsoever — the auditor MUST NOT approve, verify, measure, or authorise anything.**

**Accountability** — For audit rigour and independence. For failing to detect what a competent audit
would have detected.

> **Constitutional note.** The auditor's total absence of operational authority is what makes their
> unrestricted read access safe. **These two properties MUST hold together; neither is safe
> without the other.**

## 4.13 External actors

| Actor | Role | Authority within WFC | Accountability |
|---|---|---|---|
| **Statutory Inspector** | Labour, wage, and welfare compliance enforcement | To inspect records and require production of statutory registers | To the statute |
| **Statutory Auditor** | Independent financial attestation | To examine financial records and evidence | To shareholders and regulator |
| **Client / Employer** | Party for whom works are executed | May require joint measurement or audit where contract provides | To their own governance |
| **Client's Engineer / PMC** | Client-appointed technical supervisor | May witness or countersign measurement where contract provides | To the client |
| **Bank / Payment Channel** | Disbursement execution | To execute or reject instruction; **never to alter it** | To banking regulation |
| **Insurer / Surety** | Guarantee provider | To require evidence in the event of a claim | To the policy |
| **Arbitrator / Adjudicator** | Dispute resolution | To require production of the complete evidence chain | To the process |

## 4.14 Separation of duties matrix

The following combinations are **constitutionally prohibited** in respect of the *same* transaction.
Prohibition means an implementation MUST make the combination structurally impossible, not merely
discouraged by policy.

| # | Prohibited combination | Immutable Law breached | Leakage enabled |
|---|---|---|---|
| **SOD-1** | Measurer **and** Check Measurer | LAW-4, CP-2 | L1, L3 |
| **SOD-2** | Bill originator **and** Bill approver | LAW-4 | L2, L3, L4 |
| **SOD-3** | Approver **and** Disburser | LAW-4, CP-3 | L2, L4 |
| **SOD-4** | Attendance recorder **and** Wage approver | LAW-2, LAW-4 | L1 |
| **SOD-5** | Any operational actor **and** Auditor | CP-2 | All |
| **SOD-6** | Contractor **and** any internal verification role | CP-2 | All |
| **SOD-7** | Mate **and** Attendance validator | LAW-2, § 4.2 | L1 |
| **SOD-8** | Advance authoriser **and** Recovery waiver authority | LAW-7, LAW-8 | L5 |
| **SOD-9** | Rate setter **and** Measurement classifier | CP-2 | L3, L7 |
| **SOD-10** | Self-approval in any capacity | LAW-4 | All |

### 4.14.1 The small-enterprise problem

A genuine and common difficulty: an enterprise with a three-person site team cannot populate ten
distinct roles.

**Constitutional ruling.** Separation MUST be preserved **by time, distance, or externality** where
it cannot be preserved by headcount:

- **By externality** — the check measurement is performed by a person from another project or from
  head office. This is the preferred resolution.
- **By time and independence** — where externality is impossible, the check is performed later, by a
  different person, against evidence rather than memory, and the reduced independence is
  **recorded as a standing exception under LAW-12 and counted.**
- **Never by omission.** Reducing the check percentage is a decision that MUST be recorded,
  attributed, and reported. **Silently performing no check is a control failure, not a small-
  enterprise accommodation.**

---

# PART 5 — ENTERPRISE OBJECTS

An **Enterprise Object** is a business concept with independent identity, a lifecycle, an owner, and
relationships to other objects. Objects here are **conceptual**: they describe what the business
recognises as a thing, independent of how any implementation stores it.

Each object is specified by:

| Facet | Meaning |
|---|---|
| **Purpose** | Why the business needs this object to exist |
| **Identity** | What makes one instance distinguishable from another, permanently |
| **Owner** | The actor accountable for its correctness |
| **Lifecycle** | The states it passes through, and the transitions permitted |
| **Key attributes** | The business-significant properties (not a data schema) |
| **Relationships** | How it connects to other objects |
| **Constitutional notes** | Where the object carries specific legal or control weight |

> **Object immutability rule.** Objects marked **[EVIDENTIARY]** or **[FINANCIAL]** are subject to
> LAW-11: once committed they are never altered or deleted, only superseded.

## 5.1 Object catalogue

| ID | Object | Class | Immutable |
|---|---|---|---|
| OBJ-01 | Worker | Party | — |
| OBJ-02 | Contractor | Party | — |
| OBJ-03 | Gang | Organisational | — |
| OBJ-04 | Engagement Instrument | Authority | **[FINANCIAL]** |
| OBJ-05 | Rate Schedule Item | Authority | **[FINANCIAL]** |
| OBJ-06 | Deployment | Operational | — |
| OBJ-07 | Work Assignment | Operational | **[EVIDENTIARY]** |
| OBJ-08 | Activity | Reference | — |
| OBJ-09 | Attendance Record | Evidence | **[EVIDENTIARY]** |
| OBJ-10 | Muster Roll | Evidence | **[EVIDENTIARY]** |
| OBJ-11 | Measurement Book | Evidence | **[EVIDENTIARY]** |
| OBJ-12 | Measurement Entry | Evidence | **[EVIDENTIARY]** |
| OBJ-13 | Measurement Evidence Artefact | Evidence | **[EVIDENTIARY]** |
| OBJ-14 | Running Bill | Financial | **[FINANCIAL]** |
| OBJ-15 | Settlement Sheet | Financial | **[FINANCIAL]** |
| OBJ-16 | Wage Card | Financial | **[FINANCIAL]** |
| OBJ-17 | Advance | Financial | **[FINANCIAL]** |
| OBJ-18 | Recovery | Financial | **[FINANCIAL]** |
| OBJ-19 | Retention | Financial | **[FINANCIAL]** |
| OBJ-20 | Payment Voucher | Financial | **[FINANCIAL]** |
| OBJ-21 | Disbursement | Financial | **[FINANCIAL]** |
| OBJ-22 | Borrowed Labour Ledger | Financial | **[FINANCIAL]** |
| OBJ-23 | Productivity Record | Analytical | — |
| OBJ-24 | Variation Instrument | Authority | **[FINANCIAL]** |
| OBJ-25 | Contractor Account | Financial | **[FINANCIAL]** |
| OBJ-26 | Exception Record | Control | **[EVIDENTIARY]** |
| OBJ-27 | Approval Record | Control | **[EVIDENTIARY]** |
| OBJ-28 | Hindrance / Idle Time Record | Evidence | **[EVIDENTIARY]** |
| OBJ-29 | Issued Value Record | Financial | **[FINANCIAL]** |
| OBJ-30 | Final Account | Financial | **[FINANCIAL]** |

---

## 5.2 OBJ-01 — Worker

**Purpose.** To establish that a specific human being exists, is distinguishable from every other,
and may be paid. Without durable worker identity, leakage form L1 (phantom) is undetectable in
principle.

**Identity.** A permanent enterprise-assigned worker identity that survives gaps in engagement,
change of contractor, change of site, and change of trade. **Identity MUST NOT be derived from the
contractor**, or a worker moving between contractors becomes two workers — the mechanism by which
duplicate attendance (XCP-02) becomes invisible.

**Owner.** Site Supervisor for operational accuracy; HR/CAP-HCM for identity foundation.

**Lifecycle.**

```
  PROSPECTIVE → REGISTERED → ACTIVE ⇄ INACTIVE → SEPARATED → ARCHIVED
                     ↓            ↓
                  REJECTED    BLACKLISTED
```

| State | Meaning | Payment permitted |
|---|---|---|
| PROSPECTIVE | Presented, identity not yet established | **No** |
| REGISTERED | Identity established, not yet deployed | **No** |
| ACTIVE | Currently engaged and deployable | Yes |
| INACTIVE | Temporarily not engaged; identity retained | **No** (arrears only) |
| SEPARATED | Engagement ended; final settlement due or done | Arrears only |
| BLACKLISTED | Barred for cause | **No** |
| ARCHIVED | Retained for statutory record only | **No** |

**Key attributes.** Worker identity; name; identity evidence reference; trade; skill grade; date of
first engagement; wage entitlement basis; payment channel; statutory identifiers where applicable;
biometric or photographic reference where captured; current engagement type (direct / contractor /
supplier / borrowed).

**Relationships.** Belongs to zero-or-one **Gang** at a time; engaged under one **Engagement
Instrument** at a time; subject of many **Attendance Records**; subject of one **Wage Card** per
settlement period; may be subject of **Borrowed Labour Ledger** entries.

**Constitutional notes.**
- **A worker without established identity MUST NOT be paid** (LAW-2, LAW-5). Where documentary
  identity is genuinely unavailable — a real and common circumstance — the enterprise MUST
  establish an alternative durable identity (biometric or photographic with supervisor attestation)
  rather than paying an unidentified person.
- **Worker identity MUST be unique across the enterprise, not per project.** Per-project identity
  is the single most common structural enabler of duplicate attendance leakage.
- A worker is never deleted. A worker found to be fictitious is marked as such, and every record
  referencing them remains for investigation (LAW-11).

## 5.3 OBJ-02 — Contractor

**Purpose.** To establish a commercial counterparty capable of holding contractual obligations,
receiving payment, and owing recovery.

**Identity.** Permanent enterprise-assigned contractor identity, independent of any single contract.

**Owner.** CAP-SCM for empanelment; Finance Controller for financial standing.

**Lifecycle.**

```
  PROSPECTIVE → EMPANELLED → ACTIVE ⇄ SUSPENDED → CLOSED → ARCHIVED
                     ↓           ↓
                 REJECTED    BLACKLISTED
```

| State | Meaning | New work | Payment |
|---|---|---|---|
| PROSPECTIVE | Under qualification | No | No |
| EMPANELLED | Qualified, no live contract | Yes | No |
| ACTIVE | Holds at least one live engagement | Yes | Yes |
| SUSPENDED | Temporarily barred; existing obligations continue | No | **Restricted — see note** |
| BLACKLISTED | Permanently barred for cause | No | Earned dues only, after recovery |
| CLOSED | All engagements settled and closed | No | No |

**Key attributes.** Contractor identity; legal name and constitution; statutory registrations;
banking details; performance history; financial standing; current exposure; blacklist status.

**Relationships.** Party to many **Engagement Instruments**; holds one **Contractor Account**;
supplies many **Workers**; subject of many **Running Bills**, **Advances**, **Recoveries**,
**Retentions**.

**Constitutional notes.**
- Suspension MUST NOT automatically suspend payment for **already-earned, already-verified** work.
  Withholding earned money as commercial leverage is a contractual decision requiring explicit
  authority, not an automatic consequence of a status change. **Conflating the two is a common and
  legally hazardous design error.**
- Blacklisting MUST NOT extinguish the enterprise's obligation to pay earned dues, nor the
  contractor's obligation to repay recoveries. **Settlement continues; new engagement does not.**

## 5.4 OBJ-03 — Gang

**Purpose.** To recognise that construction labour is organised, deployed, measured, and frequently
paid as a **team**, not as individuals — while preserving individual traceability.

**Identity.** Enterprise-assigned gang identity, with a named leader and a defined composition
**over time**.

**Owner.** Site Supervisor.

**Lifecycle.**

```
  FORMED → ACTIVE ⇄ REORGANISED → DISBANDED → ARCHIVED
```

**Key attributes.** Gang identity; gang leader (Mate); trade; nominal strength; composition history
with effective dates; current deployment; associated contractor where intermediated.

**Relationships.** Led by one **Worker** acting as Mate; contains many **Workers** over time;
subject of **Deployments** and **Work Assignments**; may be the unit of **Productivity Record**.

**Constitutional notes.**
- **Gang composition MUST be effective-dated, never merely current.** Attendance and payment for a
  past date must resolve against the composition *in force on that date* (DP-12). A gang whose
  composition is only "as of now" makes historical verification impossible.
- **Gang-level payment MUST always decompose to individual workers.** Paying a gang as an
  undifferentiated unit destroys the individual traceability that LAW-5 and statutory wage
  obligations both require. Even where money is physically handed to a mate, the **entitlement**
  must be computed and recorded per worker.

## 5.5 OBJ-04 — Engagement Instrument **[FINANCIAL]**

**Purpose.** The root of all payment authority. Establishes *that* a party may be paid, *for what*,
*at what rates*, *up to what limit*, and *on what terms*. **This is the first link of the Payment
Chain (PA-1); nothing may be paid without it.**

**Identity.** Unique instrument reference, permanent and never reused.

**Owner.** CAP-SCM originates; Finance Controller owns financial terms.

**Sub-types.** Work Order (outcome-based) · Labour Contract (supply-based) · Rate Contract
(schedule-based) · Piece-Rate Agreement · Daily-Wage Engagement.

**Lifecycle.**

```
  DRAFT → SANCTIONED → ACTIVE ⇄ SUSPENDED → COMPLETED → CLOSED → ARCHIVED
    ↓          ↓                                ↓
 CANCELLED  REJECTED                       TERMINATED
```

| State | Meaning | Measurement | Payment |
|---|---|---|---|
| DRAFT | Under preparation | No | No |
| SANCTIONED | Financially approved, not commenced | No | **Advance only** |
| ACTIVE | Live; work may be executed | Yes | Yes |
| SUSPENDED | Execution halted | Prior work only | Restricted |
| COMPLETED | Physical work finished; account open | Final only | Final bill, retention |
| TERMINATED | Ended prematurely for cause | Executed work only | After recovery |
| CLOSED | Final account settled; no obligation remains | No | **No** |

**Key attributes.** Instrument reference; contractor; scope description; sanctioned value
(**the ceiling**); rate schedule reference; effective dates; retention percentage and cap; advance
terms and recovery schedule; deduction terms; liquidated damages terms; defect liability period;
payment terms and cycle; price variation clause; approving authority and date.

**Relationships.** Held by one **Contractor**; contains many **Rate Schedule Items**; subject of
many **Variation Instruments**; parent of many **Running Bills**, **Advances**, **Retentions**;
governs many **Work Assignments**.

**Constitutional notes.**
- **The sanctioned value is the ceiling of LAW-9.** It may be raised **only** by an approved
  **Variation Instrument** (OBJ-24). No other mechanism exists. Not seniority, not urgency, not
  approval by the Chief Executive.
- **All financial terms MUST be effective-dated** (DP-12). A rate revision applies to work executed
  after its effective date, never retroactively, unless a variation explicitly so provides.
- **CLOSED is terminal and absolute.** No payment, measurement, or claim may attach to a CLOSED
  instrument. Reopening requires a formal, recorded, separately-approved instrument.

## 5.6 OBJ-05 — Rate Schedule Item **[FINANCIAL]**

**Purpose.** To define, unambiguously, a unit of work that can be measured and priced. **Ambiguity
here is leakage (LA-2); this object exists to eliminate it.**

**Identity.** Item code, unique within a rate schedule version.

**Owner.** CAP-DES for definition; CAP-SCM for rate.

**Lifecycle.** `DRAFT → APPROVED → ACTIVE ⇄ SUPERSEDED → ARCHIVED`

**Key attributes.** Item code; full technical description including specification reference; unit of
measurement; rate; rate basis (labour / composite / supply-and-fix); effective from and to;
measurement rules (how the quantity is to be computed, including deductions); wastage or tolerance
norms; parent group.

**Relationships.** Belongs to one **Engagement Instrument** or master schedule; referenced by many
**Measurement Entries**; priced into many **Running Bills**.

**Constitutional notes.**
- **The item description MUST be sufficient to determine, without judgement, whether a given
  physical work falls under it.** Where two items could plausibly describe the same work, leakage
  form L7 (erosion by misclassification) is structurally enabled.
- **The measurement rule is part of the item, not a convention.** Whether openings are deducted,
  whether laps are measured, how partial units round — these MUST be explicit. Unstated measurement
  convention is the most common source of genuine, good-faith measurement dispute.
- **Non-scheduled ("star") rates MUST be derived, approved, and recorded as a Variation Instrument
  before use** — never agreed verbally at site and formalised later.

## 5.7 OBJ-06 — Deployment

**Purpose.** To record that workforce capacity has been allocated to a project or site for a period
— establishing *where a worker is supposed to be*, against which attendance can be tested.

**Identity.** Deployment reference: worker or gang, plus site, plus effective period.

**Owner.** Project Manager approves; Site Supervisor executes.

**Lifecycle.** `PLANNED → APPROVED → ACTIVE ⇄ TRANSFERRED → ENDED → ARCHIVED`

**Key attributes.** Worker or gang; project; site; work front; effective from and to; engagement
basis; approved strength; deploying authority; cost centre.

**Relationships.** Allocates **Workers** / **Gangs** to a project; precondition for **Work
Assignment**; tested against **Attendance Records**; may generate **Borrowed Labour Ledger** entries
on inter-project transfer.

**Constitutional notes.**
- **Deployment answers "where should this worker be?"; attendance answers "where were they?"**
  Attendance at a site where the worker is not deployed is an exception requiring explanation, and
  is a primary detector of duplicate attendance (XCP-02).
- Deployment MUST be bounded by **sanctioned strength**. Deployment beyond sanction is a cost
  overrun occurring silently at the point of decision — long before it appears in a bill.

## 5.8 OBJ-07 — Work Assignment **[EVIDENTIARY]**

**Purpose.** To establish that a specific worker or gang was **directed** to perform specific work,
at a specific place, on a specific date. **This is the ASSIGNMENT link of the Payment Chain and the
second limb of LAW-2.**

**Identity.** Assignment reference: assignee, activity, location, date.

**Owner.** Site Supervisor.

**Lifecycle.** `ISSUED → IN_PROGRESS → COMPLETED → CLOSED` with exception paths to `ABANDONED`,
`SUSPENDED`, `REASSIGNED`.

**Key attributes.** Assignment reference; assignee (worker / gang); activity; work location to the
finest available granularity; assigned date; expected output where applicable; assigning
supervisor; actual output; completion status.

**Relationships.** Assigns **Workers**/**Gangs** to an **Activity** at a location; supports
**Attendance Records**; links to **Measurement Entries** for the work produced; basis for
**Productivity Records**.

**Constitutional notes.**
- **Attendance without assignment is not payable** (LAW-2). A worker present but not directed to
  work is an operational failure of the enterprise, treated as idle time (OBJ-28) under defined
  rules — **not silently paid as though productive.**
- **The assignment MUST exist before or at the time of the work, never after.** An assignment
  created after the work, to justify attendance, is not evidence (CP-1). Implementations MUST record
  assignment creation time independently of assignment date.

## 5.9 OBJ-08 — Activity

**Purpose.** To provide the work-breakdown anchor against which effort is assigned, output is
measured, and cost is attributed.

**Identity.** Activity code within the project work breakdown structure.

**Owner.** CAP-PPM (dependency D-4).

**Lifecycle.** `PLANNED → ACTIVE → COMPLETED → CLOSED`

**Key attributes.** Activity code; description; parent WBS node; location; planned quantity; unit;
associated rate schedule items; planned and actual dates; productivity norm.

**Relationships.** Target of **Work Assignments**; context for **Measurement Entries**; basis for
**Productivity Records**; rolls up to project cost.

## 5.10 OBJ-09 — Attendance Record **[EVIDENTIARY]**

**Purpose.** To record that a specific identified worker was present and working at a specific
place on a specific date. **This is the OBSERVATION link of the Payment Chain and the first limb
of LAW-2.**

**Identity.** Worker + date + site. **This triple MUST be unique — its uniqueness is the structural
prevention of duplicate attendance (XCP-02).**

**Owner.** Site Supervisor.

**Lifecycle.**

```
  CAPTURED → VALIDATED → LOCKED → SETTLED → ARCHIVED
      ↓          ↓
  DISPUTED   REJECTED
      ↓
  CORRECTED (supersedes, never overwrites)
```

| State | Meaning | Payable |
|---|---|---|
| CAPTURED | Recorded at site, not yet validated | **No** |
| VALIDATED | Checked against deployment, assignment, duplication | Yes |
| REJECTED | Failed validation | **No** |
| DISPUTED | Contested by worker or contractor | **No** — pending resolution |
| CORRECTED | Superseded by a corrected record | **No** — successor governs |
| LOCKED | Period closed; no further change | Yes |
| SETTLED | Included in a settled wage payment | **Consumed — cannot be re-settled** |

**Key attributes.** Worker; date; site; work front; attendance type (full / half / absent / idle /
rain / holiday / overtime); hours where applicable; capture method (biometric / manual / mate-
reported); capturing actor; capture timestamp; validating actor; validation timestamp; supporting
evidence reference.

**Relationships.** For one **Worker**; at one site under a **Deployment**; supported by a **Work
Assignment**; aggregated into a **Muster Roll**; consumed by a **Wage Card**.

**Constitutional notes.**
- **Capture method determines evidential weight** (Part 11). Biometric capture at the point of
  occurrence outranks manual recording, which outranks mate-reported attendance. **Mate-reported
  attendance is a claim and MUST be validated independently before payment** (§ 4.2).
- **The SETTLED state is terminal and consumptive.** An attendance day that has been paid can never
  be paid again. This is the structural prevention of leakage form L2.
- **Correction is supersession, never overwrite** (LAW-11). The original record remains permanently
  visible with its correction linked — because a pattern of corrections is itself a leakage
  signal.

## 5.11 OBJ-10 — Muster Roll **[EVIDENTIARY]**

**Purpose.** The consolidated, period-bounded, statutorily-recognised register of attendance for a
site. It is both an operational control and, in most jurisdictions, a **statutory record subject to
inspection**.

**Identity.** Site + period.

**Owner.** Site Supervisor maintains; Project Manager certifies.

**Lifecycle.** `OPEN → CLOSED → CERTIFIED → SETTLED → ARCHIVED`, with `REOPENED` available only by
exception under LAW-12.

**Key attributes.** Site; period; opening and closing dates; total worker-days by trade and grade;
attendance records included; closure actor and timestamp; certifying actor; exceptions recorded;
statutory register reference.

**Relationships.** Aggregates many **Attendance Records**; basis for many **Wage Cards**; certified
by Project Manager; inspected by Statutory Inspector.

**Constitutional notes.**
- **Closure MUST be a discrete, attributed, timestamped act.** An open-ended muster that can absorb
  late entries indefinitely provides no control — retrospective insertion is the mechanism of
  phantom attendance.
- **Reopening a CLOSED muster is an exception** requiring authority, reason, and counting (LAW-12).
  Reopening frequency is a leading indicator of control decay.
- The muster roll is retained for the **statutory retention period**, which typically exceeds the
  enterprise's own commercial interest in it (§ 3.4.4).

## 5.12 OBJ-11 — Measurement Book **[EVIDENTIARY]**

**Purpose.** **The single most important object in this capability.** The Measurement Book (MB) is
the enterprise's permanent, authoritative record of what was physically executed. Every rupee paid
for contracted work traces to an entry in it (LAW-1, LAW-5).

**Identity.** MB reference, unique and permanently sequenced within the enterprise.

**Owner.** Site Engineer maintains; Check Measurement Officer verifies; Project Manager is
accountable for its existence and integrity.

**Lifecycle.** `ISSUED → IN_USE → COMPLETED → CLOSED → ARCHIVED`

**Key attributes.** MB reference; issue date and issuing authority; project; contractor; page range;
custodian; current status; closure date; archive reference.

**Relationships.** Contains many **Measurement Entries**; issued against a project; associated with
one or more **Engagement Instruments**.

**Constitutional notes.**
- **The MB is a controlled document.** Issue is registered, custody is attributed, pages are
  sequentially numbered, and **no page is ever removed.** In its traditional physical form this
  discipline was enforced by binding and numbering; **any conforming implementation MUST reproduce
  the control property, not merely the data.**
- **Sequence is a control, not a convenience.** An MB with gaps in its sequence has, by definition,
  lost evidence, and every payment traced through it is thereby weakened.
- The MB is the object most likely to be demanded in **arbitration**. Its integrity is what the
  enterprise's contractual position ultimately rests upon.

## 5.13 OBJ-12 — Measurement Entry **[EVIDENTIARY]**

**Purpose.** To record a specific quantity of a specific item of work, executed at a specific
location, measured on a specific date, by a specific person. **This is the MEASUREMENT link of the
Payment Chain.**

**Identity.** MB reference + page + entry sequence. Permanent and never reused.

**Owner.** Site Engineer records; Check Measurement Officer verifies.

**Lifecycle.**

```
  RECORDED → CHECKED → VERIFIED → BILLED → SETTLED → ARCHIVED
      ↓         ↓          ↓
  CANCELLED  REDUCED   DISPUTED
      ↓
  SUPERSEDED (by revision — original remains)
```

| State | Meaning | Billable |
|---|---|---|
| RECORDED | Measured by site engineer, not verified | **No** |
| CHECKED | Test-checked, awaiting formal verification | **No** |
| VERIFIED | Independently verified; billable | **Yes** |
| REDUCED | Verified at a lower quantity than recorded | Yes, at reduced quantity |
| DISPUTED | Contested by contractor | **No** — pending resolution |
| CANCELLED | Withdrawn before billing, with reason | **No** |
| SUPERSEDED | Replaced by a revised measurement | **No** — successor governs |
| BILLED | Included in a running bill | **Consumed** |
| SETTLED | Bill paid | **Consumed permanently** |

**Key attributes.** Entry identity; rate schedule item; description of work as executed; location to
finest granularity; measurement date; dimensions as recorded (length, breadth, depth, number,
deductions); computed quantity; unit; measuring actor; verifying actor; verification date; evidence
references; cumulative-to-date quantity for the item; revision linkage.

**Relationships.** Belongs to one **Measurement Book**; references one **Rate Schedule Item**;
supported by many **Measurement Evidence Artefacts**; consumed by one **Running Bill**; may
supersede or be superseded by another **Measurement Entry**.

**Constitutional notes.**
- **Dimensions MUST be recorded, not merely the computed quantity.** A quantity without its
  constituent dimensions is unverifiable and undrillable, defeating CP-7. This single discipline
  prevents a large share of leakage form L3.
- **Measurement date is the effective date** for rate selection (DP-12) — not the billing date, not
  the verification date.
- **BILLED and SETTLED are consumptive states.** A measurement entry that has been billed cannot be
  billed again — the structural prevention of duplicate billing (XCP-03, leakage L2).
- **Cancellation and revision are recorded, never erased.** A pattern of revisions against a
  particular measurer, contractor, or item is a primary fraud signal and MUST remain visible.

## 5.14 OBJ-13 — Measurement Evidence Artefact **[EVIDENTIARY]**

**Purpose.** To make measurement independently reconstructible after the physical work has been
covered, buried, plastered, or demolished — which in construction is usually within days.

**Identity.** Artefact reference, permanently linked to its measurement entry.

**Owner.** Site Engineer captures; the record retains permanently.

**Lifecycle.** `CAPTURED → ATTACHED → VERIFIED → ARCHIVED`

**Key attributes.** Artefact type (photograph / level record / dimension sheet / pour card / test
certificate / joint measurement sheet / survey record); capture timestamp; capture location; capture
actor; content reference; linked measurement entry; tamper-evidence marker.

**Relationships.** Supports one or more **Measurement Entries**; may support a **Running Bill**
directly; examined by **Internal Auditor**.

**Constitutional notes.**
- **Evidence MUST be captured at the point and moment of measurement** (DP-5). Evidence assembled
  later in an office is testimony about the past, not evidence of it.
- **Concealed work is a special class.** Work that will become permanently inaccessible —
  foundations, reinforcement before pour, buried services — MUST have evidence captured before
  concealment, or it becomes permanently unverifiable and permanently disputable. **A conforming
  implementation MUST enforce pre-concealment evidence as a precondition of measurement for items
  classified as concealed.**
- Capture time and location MUST be recorded **independently of the actor's assertion**, or the
  artefact proves only that a photograph exists, not when or where it was taken.

## 5.15 OBJ-14 — Running Bill **[FINANCIAL]**

**Purpose.** To convert verified measurement into a cumulative financial entitlement, and to compute
the net payable after all adjustments. **This is the object in which LAW-6 (cumulative, never
incremental) lives.**

**Identity.** Bill reference: engagement instrument + sequential bill number. **Never reused, never
renumbered.**

**Owner.** Contractor claims; Site Engineer substantiates; Accountant verifies; Project Manager
certifies; Finance approves.

**Lifecycle.**

```
  DRAFT → SUBMITTED → UNDER_MEASUREMENT → MEASURED → VERIFIED
        → CERTIFIED → APPROVED → PAID → CLOSED → ARCHIVED
              ↓            ↓         ↓
          RETURNED     REJECTED  PART_PAID
              ↓
          RESUBMITTED
```

| State | Meaning | Money moves |
|---|---|---|
| DRAFT | Under preparation | No |
| SUBMITTED | Claimed by contractor | No |
| UNDER_MEASUREMENT | Measurement in progress | No |
| MEASURED | Quantities recorded | No |
| VERIFIED | Quantities independently verified; arithmetic checked | No |
| CERTIFIED | Technically certified by Project Manager | No |
| APPROVED | Financially approved within delegated limit | **Authorised** |
| PART_PAID | Partially disbursed | Partially |
| PAID | Fully disbursed | Yes |
| RETURNED | Sent back for insufficiency, with reasons | No |
| REJECTED | Refused with reasons | No |
| CLOSED | Superseded by a later cumulative bill or final account | No |

**Key attributes.** Bill reference and sequence; engagement instrument; period covered; cumulative
gross value to date; value of previous bills; gross value of this bill; recoveries applied; retention
withheld; statutory deductions; penalties and damages; net payable; measurement entries consumed;
originating, verifying, certifying, and approving actors with timestamps; ceiling position after
this bill.

**Relationships.** Belongs to one **Engagement Instrument**; consumes many **Measurement Entries**;
applies many **Recoveries**; generates one **Retention** amount; produces one **Payment Voucher**;
updates the **Contractor Account**.

**Constitutional notes.**
- **The bill MUST be computed cumulatively** (LAW-6): cumulative earned value to date, less
  cumulative previously certified. **This is not a presentational preference — it is the mechanism
  by which every earlier error self-corrects at the next bill** rather than compounding silently.
- **The bill MUST show its own ceiling position.** A bill that does not display cumulative value
  against sanctioned value permits LAW-9 to be breached without anyone noticing.
- **Recovery is applied before net payable** (LAW-8), and MUST be itemised — never netted into a
  single opaque "deductions" figure, which defeats CP-7 and hides leakage form L5.
- A bill is **never deleted**. A bill raised in error is REJECTED with reason and remains permanently
  visible (LAW-11).

## 5.16 OBJ-15 — Settlement Sheet **[FINANCIAL]**

**Purpose.** To compute and record the periodic settlement of **labour** wages — the labour-side
analogue of the Running Bill — for a gang, a site, or a supplier, for a defined period.

**Identity.** Settlement reference: site + period + settlement unit.

**Owner.** Site Supervisor originates; Accountant verifies; Project Manager certifies.

**Lifecycle.** `DRAFT → COMPUTED → VERIFIED → CERTIFIED → APPROVED → PAID → CLOSED`, with
`DISPUTED` and `REJECTED` exception paths.

**Key attributes.** Settlement reference; period; settlement unit (gang / supplier / direct labour
pool); worker-days by trade and grade; wage rates applied; gross wages; overtime; incentive; idle-
time payment; advances recovered; other deductions; statutory deductions; net payable; individual
worker breakdown; attendance records consumed.

**Relationships.** Consumes many **Attendance Records**; produces many **Wage Cards**; applies
**Recoveries**; produces one **Payment Voucher**.

**Constitutional notes.**
- **The settlement sheet MUST decompose to individual workers even where payment is intermediated**
  (§ 5.4). Aggregate gang settlement without individual entitlement is a statutory exposure and
  destroys traceability under LAW-5.
- **Statutory minimum wage MUST be verified per worker**, not on the gang average. An average that
  clears the minimum can conceal individuals paid below it.

## 5.17 OBJ-16 — Wage Card **[FINANCIAL]**

**Purpose.** The individual worker's permanent earning record — what they worked, what they earned,
what was deducted, and what they received. It is simultaneously a control artefact, a statutory
record, and **the worker's own evidence** (CP-10).

**Identity.** Worker + settlement period.

**Owner.** Accountant maintains; the Worker is entitled to inspect it.

**Lifecycle.** `OPEN → COMPUTED → ISSUED → ACKNOWLEDGED → CLOSED → ARCHIVED`

**Key attributes.** Worker; period; days worked by type; wage rate applied and its authority; gross
earning; overtime; incentive; advances recovered; other deductions with reasons; statutory
deductions; net paid; payment mode and reference; acknowledgement evidence.

**Relationships.** For one **Worker**; derived from one **Settlement Sheet**; consumes
**Attendance Records**; references **Recoveries**.

**Constitutional notes.**
- **The worker is entitled to a comprehensible statement of their own earnings** (CP-10). This is a
  statutory requirement in most jurisdictions and a control in all of them — a worker who can check
  their own card is an unpaid auditor of the mate's attendance reporting.
- **Deductions MUST be itemised with reasons.** An unexplained deduction from a worker's wage is
  both a statutory violation and a leakage indicator.
- Acknowledgement of receipt MUST be captured in a form appropriate to the worker's literacy —
  **and the enterprise MUST NOT treat the absence of a signature as evidence of non-payment or its
  presence as conclusive evidence of payment.**

## 5.18 OBJ-17 — Advance **[FINANCIAL]**

**Purpose.** To record money paid **before** entitlement is earned, together with its binding
recovery obligation. **LAW-7 lives in this object: every advance is a recovery obligation from the
moment it is created.**

**Identity.** Advance reference, permanent.

**Owner.** Finance Controller authorises; Accountant tracks recovery.

**Sub-types.** Mobilisation Advance · Material Advance · Secured Advance (against materials at site)
· Machinery Advance · Wage Advance (to workers) · Ad-hoc / Emergency Advance.

**Lifecycle.**

```
  REQUESTED → APPROVED → DISBURSED → RECOVERING → RECOVERED → CLOSED
       ↓          ↓                       ↓
   REJECTED   CANCELLED            WRITTEN_OFF (exceptional)
```

| State | Meaning | Outstanding |
|---|---|---|
| REQUESTED | Sought, not approved | — |
| APPROVED | Authorised with recovery plan | — |
| DISBURSED | Money paid | Full |
| RECOVERING | Partially recovered | Partial |
| RECOVERED | Fully recovered | Nil |
| WRITTEN_OFF | Irrecoverable; **exceptional, executive approval, always a loss event** | Nil (loss) |

**Key attributes.** Advance reference; type; recipient (contractor or worker); principal amount;
authorising instrument; **recovery plan — schedule, rate, and start point**; security held; interest
terms where applicable; amount recovered to date; outstanding balance; expected full-recovery date.

**Relationships.** Issued against an **Engagement Instrument** or to a **Worker**; generates many
**Recoveries**; reflected in the **Contractor Account**; reduces **Payment Voucher** net.

**Constitutional notes.**
- **An advance without a recovery plan MUST NOT be creatable** (LAW-7). This is a structural
  prohibition, not a policy: the recovery plan is a mandatory constituent of the advance, and an
  advance lacking one is not an advance but an unauthorised payment.
- **Unrecovered advance is the single most common material leakage in construction** (§ 1.4.5,
  leakage L5). Advance ageing MUST be continuously visible and MUST escalate automatically.
- **Advance outstanding MUST be netted against the contractor's position before any release of
  retention or final payment.** A contractor MUST NOT exit with an outstanding advance.
- Write-off is a **loss event**, requiring executive approval, permanent recording, and — because
  the pattern matters more than the instance — **counting against the authorising actor** (LAW-12).

## 5.19 OBJ-18 — Recovery **[FINANCIAL]**

**Purpose.** To record an amount owed **to** the enterprise and to enforce its deduction at source.
**LAW-8 lives in this object.**

**Identity.** Recovery reference, permanent.

**Owner.** Accountant.

**Sub-types.** Advance recovery · Material issue recovery · Plant and equipment hire · Fuel and
power · Water · Accommodation and welfare · Damage, loss, and shortage · Rework and rejection ·
Liquidated damages · Contractual penalties · Statutory deductions · Debit notes · Third-party
claims.

**Lifecycle.**

```
  IDENTIFIED → QUANTIFIED → SCHEDULED → APPLIED → RECOVERED → CLOSED
        ↓            ↓           ↓
    DISPUTED     WAIVED     DEFERRED (exceptional, counted)
```

**Key attributes.** Recovery reference; type; source instrument (issue note, hire record, damage
report, contract clause); party; amount; basis of computation; scheduled recovery period; amount
applied to date; outstanding; dispute status; waiver authority where waived.

**Relationships.** Arises from an **Issued Value Record**, an **Advance**, or a contractual event;
applied against a **Running Bill** or **Settlement Sheet**; reflected in the **Contractor Account**.

**Constitutional notes.**
- **Recovery MUST be applied automatically, not on request** (LAW-8, II-4). A recovery that requires
  someone to remember it will eventually not happen (LA-4) — and its non-occurrence will be silent.
- **Waiver and deferral are exceptions** requiring authority, reason, and counting (LAW-12). The
  aggregate of waived recoveries by authoriser is a primary control metric.
- **A disputed recovery MUST still be withheld pending resolution**, unless a specific authority
  releases it. Conservatism under uncertainty (CP-8): withheld money can be released; released money
  frequently cannot be recovered (LA-7).

## 5.20 OBJ-19 — Retention **[FINANCIAL]**

**Purpose.** To record money withheld from the contractor as contractual security for performance
and defect rectification. **LAW-10 lives in this object: retention is a liability, never income.**

**Identity.** Retention position per engagement instrument, with a movement history.

**Owner.** Finance Controller.

**Lifecycle.**

```
  ACCRUING → HELD → PARTIALLY_RELEASED → RELEASED → CLOSED
                ↓
           FORFEITED (contractual, exceptional)
```

**Key attributes.** Engagement instrument; retention percentage; retention cap; cumulative withheld;
cumulative released; balance held; release conditions; defect liability period dates; first-release
trigger and date; final-release trigger and date; substitution instrument where a guarantee replaces
cash retention.

**Relationships.** Accrues from many **Running Bills**; released through **Payment Vouchers**;
reported as liability to CAP-FIN; conditioned on defect liability period.

**Constitutional notes.**
- **Retention MUST be recorded as a liability at the moment of withholding** (LAW-10) — never as
  reduced cost, never as a saving, never as margin. Misrecording retention overstates profit and
  understates liability simultaneously, which is a financial misstatement, not a bookkeeping
  preference.
- **Release MUST be condition-driven, never time-driven alone.** Release on elapsed time without
  verification of defect rectification is leakage form L6 (unenforced entitlement).
- **Retention MUST NOT be released while any recovery is outstanding.** Retention is the enterprise's
  last practical leverage (LA-7); releasing it while owed money forfeits that leverage permanently.
- Retention balances MUST be **reconcilable per contract at all times**, because they are frequently
  the largest unrecognised liability on a construction enterprise's balance sheet.

## 5.21 OBJ-20 — Payment Voucher **[FINANCIAL]**

**Purpose.** To constitute the formal, approved authority for money to leave the enterprise. **This
is the APPROVAL link of the Payment Chain, and the last object over which the enterprise has
control.**

**Identity.** Voucher reference, sequential, permanent, never reused.

**Owner.** Accountant prepares; approving authority approves.

**Lifecycle.**

```
  PREPARED → VERIFIED → APPROVED → RELEASED → SETTLED → CLOSED
       ↓          ↓          ↓          ↓
   CANCELLED  RETURNED   REJECTED   FAILED → REINSTATED
```

**Key attributes.** Voucher reference; payee; payment basis (running bill / settlement sheet /
advance / retention release); gross amount; deductions applied; net amount; payment mode; bank
reference; preparing, verifying, and approving actors with timestamps and authority basis; cost
attribution; supporting document references.

**Relationships.** Derives from one **Running Bill**, **Settlement Sheet**, **Advance**, or
**Retention** release; produces one **Disbursement**; posts to the **Contractor Account** and to
CAP-FIN.

**Constitutional notes.**
- **The voucher MUST be traceable to its basis in a single step, and from there to physical
  quantity** (CP-7, LAW-5). A voucher whose basis is "as per instruction" is constitutionally void.
- **Approval MUST be within the approver's delegated limit, valid at the approval moment**
  (DP-12). Limits are effective-dated; an approval by an actor whose authority had lapsed is void.
- **The amount MUST NOT be alterable after approval.** Alteration requires cancellation and a new
  voucher (LAW-11). A voucher amount that can change after approval renders approval meaningless.

## 5.22 OBJ-21 — Disbursement **[FINANCIAL]**

**Purpose.** To record the actual movement of money and to reconcile it against the authority that
permitted it. **This is where WFC's boundary ends** (§ 3.4.2).

**Identity.** Disbursement reference.

**Owner.** CAP-TRE executes; Accountant reconciles.

**Lifecycle.** `INSTRUCTED → IN_TRANSIT → CONFIRMED → RECONCILED`, with `FAILED → RETURNED →
REINSTATED` and `RECALLED` exception paths.

**Key attributes.** Disbursement reference; voucher reference; payee and channel details; amount;
instruction and confirmation timestamps; channel reference; failure reason where applicable;
reconciliation status.

**Relationships.** Executes one **Payment Voucher**; confirmed to the **Contractor Account** or
**Wage Card**.

**Constitutional notes.**
- **A failed disbursement MUST reinstate the liability** (I-10). A payment that failed in the channel
  but was recorded as settled creates a phantom settlement and an unpaid, unaware counterparty.
- **Disbursement MUST NOT alter the approved amount or payee** (O-2, II-2). Where the channel cannot
  execute the instruction, it fails; it does not adapt.

## 5.23 OBJ-22 — Borrowed Labour Ledger **[FINANCIAL]**

**Purpose.** To record and settle labour lent between projects, sites, cost centres, or contractors —
a routine practice that, uncontrolled, produces both cost misattribution and duplicate payment.

**Identity.** Ledger entry reference: lending party + borrowing party + period.

**Owner.** Project Managers of both parties; Accountant settles.

**Lifecycle.** `RAISED → ACKNOWLEDGED → RECONCILED → SETTLED → CLOSED`, with `DISPUTED`.

**Key attributes.** Lending project/contractor; borrowing project/contractor; workers involved;
period; worker-days lent by trade; agreed transfer rate; value; acknowledgement by borrower;
settlement mechanism (inter-project transfer or contractor recovery); dispute status.

**Relationships.** References **Workers** and **Attendance Records**; adjusts cost between projects;
may generate a **Recovery** against a contractor.

**Constitutional notes.**
- **Borrowed labour is a primary duplicate-payment surface** (XCP-06, leakage L2): the same worker's
  attendance can be claimed by both the lending and borrowing party. **Attendance uniqueness by
  worker + date (§ 5.10) is the structural prevention**, and it works only if worker identity is
  enterprise-wide (§ 5.2).
- **Both sides MUST acknowledge.** A one-sided borrowed-labour claim is a claim, not a settlement.
- Cost MUST follow the work: the **borrowing** project bears the cost, or project cost accounting
  is systematically false while total cost appears correct.

## 5.24 OBJ-23 — Productivity Record

**Purpose.** To relate output produced to effort consumed — the only object that can detect leakage
forms L1 and L3 **statistically**, when transaction-level controls have been individually defeated.

**Identity.** Activity + period + workforce unit.

**Owner.** Project Manager; analysed by Finance and Audit.

**Lifecycle.** `ACCUMULATING → COMPUTED → ANALYSED → ARCHIVED`

**Key attributes.** Activity; period; workforce unit; output quantity measured; effort consumed in
worker-days by trade; achieved productivity; norm productivity; variance; labour cost per unit;
explanatory factors (weather, hindrance, learning curve, site conditions).

**Relationships.** Derived from **Measurement Entries** (output) and **Attendance Records**
(effort); compared against **Activity** norms.

**Constitutional notes.**
- **Productivity is the enterprise's cross-check on itself.** Where measurement and attendance are
  each internally consistent but jointly implausible — high output with impossibly few worker-days,
  or high worker-days with negligible output — **one of them is false.** Transaction controls cannot
  detect this; only the ratio can.
- **Sustained impossible productivity is a fraud signal, not a performance achievement.** A
  conforming implementation MUST treat implausible favourable variance with the same suspicion as
  adverse variance.

## 5.25 OBJ-24 — Variation Instrument **[FINANCIAL]**

**Purpose.** To formally alter the authority established by an Engagement Instrument — scope, rates,
ceiling, or time. **This is the only mechanism by which the LAW-9 ceiling may be raised.**

**Identity.** Variation reference, sequential within the engagement instrument.

**Owner.** Project Manager originates; sanctioning authority approves per delegation.

**Lifecycle.** `PROPOSED → EVALUATED → SANCTIONED → INCORPORATED → CLOSED`, with `REJECTED` and
`WITHDRAWN`.

**Key attributes.** Variation reference; parent instrument; nature (scope addition / deletion / rate
change / non-scheduled item / time extension / ceiling enhancement); technical justification;
quantity and rate impact; value impact; revised ceiling; effective date; originating and sanctioning
actors; supporting instruction reference.

**Relationships.** Amends one **Engagement Instrument**; may create new **Rate Schedule Items**;
alters the ceiling tested by every subsequent **Running Bill**.

**Constitutional notes.**
- **A variation MUST be sanctioned before the varied work is measured for payment.** Retrospective
  variation to regularise already-executed work is the mechanism of § 1.4.7 and is a **counted
  exception** (LAW-12), never a routine step. Where site urgency genuinely requires execution before
  sanction, the *instruction* MUST be recorded contemporaneously even if the *valuation* follows.
- **Non-scheduled rates MUST be derived by a defined, recorded method** — analysis of rates from
  first principles, or a defined relationship to comparable scheduled items — **never by
  negotiation without derivation.** An undocumented star rate is pure leakage form L7.
- **A variation that raises the ceiling MUST be approved at the authority level appropriate to the
  revised total**, not to the increment. Splitting a large enhancement into several small ones to
  stay within a lower delegation is a control circumvention (XCP-16) and MUST be structurally
  detected.

## 5.26 OBJ-25 — Contractor Account **[FINANCIAL]**

**Purpose.** To maintain, continuously and authoritatively, the complete financial position between
the enterprise and a contractor — **the single figure that answers "what do we owe, and what are we
owed?"**

**Identity.** One per contractor, spanning all engagements, with per-engagement sub-positions.

**Owner.** Accountant maintains; Finance Controller owns.

**Lifecycle.** `OPEN → ACTIVE ⇄ SUSPENDED → CLOSING → CLOSED → ARCHIVED`

**Key attributes.** Contractor; per engagement: sanctioned value, cumulative certified, cumulative
paid, retention held, advances outstanding, recoveries outstanding, disputed amounts; aggregate
exposure; net position; ageing of outstanding items; guarantees held and their expiry.

**Relationships.** Aggregates all **Running Bills**, **Advances**, **Recoveries**, **Retentions**,
**Payment Vouchers** for one **Contractor**.

**Constitutional notes.**
- **The account MUST be reconcilable at any instant**, not only at period close. A position that is
  correct only after a month-end process is not a control.
- **Exposure MUST be visible before payment approval**, not after. An approver who cannot see that
  a contractor holds an unrecovered advance and disputed work is approving blind.
- The account MUST distinguish **certified** from **paid** from **due**. Conflating them is the
  origin of a large share of payment disputes.

## 5.27 OBJ-26 — Exception Record **[EVIDENTIARY]**

**Purpose.** To make every deviation from normal control **visible, attributed, bounded, and
counted**. **LAW-12 lives in this object.**

**Identity.** Exception reference, permanent.

**Owner.** The authorising actor owns it personally; Audit monitors.

**Lifecycle.** `RAISED → AUTHORISED → ACTIVE → EXPIRED / CLOSED → REVIEWED → ARCHIVED`

**Key attributes.** Exception reference; exception type (from the Part 16 library); affected object;
reason; authority relied upon; authorising actor; authorisation timestamp; **validity period**;
compensating control applied; closure evidence; review outcome; **count against authoriser**.

**Relationships.** Attaches to any object; counted against an actor; reported to Audit and the
Finance Controller.

**Constitutional notes.**
- **An exception without an expiry is a permanent change to the control framework** made without
  amendment, and MUST be prohibited. Every exception is time-boxed.
- **Counting is constitutive, not administrative** (LAW-12). An exception that is recorded but not
  counted against its authoriser provides no deterrent and no signal. **Frequency is the control.**
- **The exception rate is a primary health metric of the entire capability.** A rising exception
  rate means the rules no longer fit reality — the correct response is to examine the rules, not to
  suppress the counting.

## 5.28 OBJ-27 — Approval Record **[EVIDENTIARY]**

**Purpose.** To bind a decision to a person, a moment, and a delegated authority — converting a
workflow step into **personal accountability** (CP-6).

**Identity.** Approval reference, permanent.

**Owner.** The approving actor personally.

**Lifecycle.** `PENDING → GRANTED / REFUSED → SUPERSEDED → ARCHIVED`

**Key attributes.** Approval reference; subject object and its state at approval; approving actor;
role and delegated limit relied upon; authority validity at approval moment; decision; reason where
refused or conditional; timestamp; conditions attached; the **exact figures approved**.

**Relationships.** Attaches to **Running Bills**, **Settlement Sheets**, **Payment Vouchers**,
**Advances**, **Variations**, **Exceptions**.

**Constitutional notes.**
- **The approval MUST record the figures as they stood at the moment of approval.** If a downstream
  figure changes, the approval is void and MUST be re-obtained. An approval that floats over
  changing numbers approves nothing.
- **Authority MUST be validated at the moment of approval, against effective-dated delegation**
  (DP-12). An approval by an actor whose delegation had lapsed, or who had been transferred, is
  void — and the implementation MUST detect this rather than rely on the actor's own knowledge.
- **Approval is never anonymous, never by a role alone, and never by a shared identity.** A shared
  approval identity destroys accountability entirely and is constitutionally prohibited.

## 5.29 OBJ-28 — Hindrance / Idle Time Record **[EVIDENTIARY]**

**Purpose.** To record, contemporaneously, periods when deployed workforce could not productively
work — establishing both the enterprise's cost exposure and, critically, its **defence against
subsequent contractor claims**.

**Identity.** Site + period + cause.

**Owner.** Site Supervisor records; Project Manager certifies.

**Lifecycle.** `RECORDED → CERTIFIED → SETTLED → CLOSED`, with `DISPUTED`.

**Key attributes.** Site; work front; start and end; cause classification (rain / material
unavailability / drawing awaited / client instruction / power failure / safety stoppage / labour
unrest / equipment breakdown); attributable party; workforce affected; worker-days lost; cost
impact; payment treatment applied; certifying actor.

**Relationships.** Affects **Attendance Records** (idle classification); affects **Productivity
Records**; may support or defeat a contractor claim; may generate a **Recovery** where the
contractor is the attributable party.

**Constitutional notes.**
- **Contemporaneous recording is the entire value of this object.** A hindrance recorded weeks later
  during a claim dispute is worthless as evidence and is precisely what a claiming contractor will
  produce. **The enterprise that records hindrance daily wins claims; the one that reconstructs it
  later does not.**
- **Attribution determines who bears the cost.** Idle time attributable to the enterprise is
  generally payable; idle time attributable to the contractor generally is not and may be
  recoverable. **The classification is therefore a financial decision and MUST be certified, not
  merely recorded.**

## 5.30 OBJ-29 — Issued Value Record **[FINANCIAL]**

**Purpose.** To record value flowing **from** the enterprise **to** the contractor in non-cash form —
materials, fuel, power, water, plant hire, accommodation — each of which is a recovery obligation.
**This object exists because leakage form L5 is largest where value does not look like money.**

**Identity.** Issue reference, permanent.

**Owner.** CAP-SCM / CAP-PLT issue; Accountant values and recovers.

**Lifecycle.** `ISSUED → VALUED → RECOVERABLE → RECOVERED → CLOSED`, with `DISPUTED`, `RETURNED`,
`WRITTEN_OFF`.

**Key attributes.** Issue reference; contractor; engagement instrument; item and quantity; issue
date; issuing actor; receiving acknowledgement; valuation basis (issue rate / market / contractual);
value; contractual recovery treatment (free issue / recoverable / recoverable with handling);
returned quantity; net recoverable; linked recovery.

**Relationships.** Arises in CAP-SCM / CAP-PLT (I-5, I-6); generates a **Recovery**; reflected in the
**Contractor Account**; reconciled against theoretical consumption from **Measurement Entries**.

**Constitutional notes.**
- **Every issue MUST create a recovery obligation automatically at the moment of issue** (I-5, LAW-7
  by analogy). An issue that requires someone to later remember to recover it will leak.
- **Free issue MUST be explicit in the contract**, never assumed. "It has always been free issue" is
  not a contractual term.
- **Theoretical consumption reconciliation is a primary control.** Cement issued versus cement
  theoretically required by measured concrete quantities detects over-issue, wastage beyond norm,
  pilferage, **and over-measurement** — the last being the reason this reconciliation belongs in
  CAP-WFC-01 rather than solely in CAP-SCM. **Material and measurement check each other.**

## 5.31 OBJ-30 — Final Account **[FINANCIAL]**

**Purpose.** To settle definitively and permanently the entire financial relationship arising from
an engagement. **This is where § 1.4.12 — the collapse of control at final settlement — must be
structurally prevented.**

**Identity.** One per Engagement Instrument.

**Owner.** Finance Controller; approved per delegation for the total contract value.

**Lifecycle.**

```
  INITIATED → MEASURED → RECONCILED → AGREED → APPROVED → SETTLED → CLOSED
        ↓          ↓            ↓         ↓
    DISPUTED   DISPUTED    DISPUTED  ARBITRATION
```

**Key attributes.** Engagement instrument; final measured quantities; final gross value; all
variations incorporated; cumulative paid; all recoveries settled; retention position and release
schedule; liquidated damages assessed; claims received and their disposition; net final payable or
recoverable; no-claim certificate; defect liability period dates; closure approval.

**Relationships.** Closes one **Engagement Instrument**; incorporates all **Running Bills**,
**Variations**, **Recoveries**, **Retentions**; produces final **Payment Vouchers**; closes the
**Contractor Account** sub-position.

**Constitutional notes.**
- **The final account MUST be computed, not negotiated** (§ 1.4.12). Where a negotiated settlement
  differs from the computed position, the **difference MUST be recorded explicitly as a commercial
  settlement with its own approval** — never absorbed silently into quantities or rates. **This
  single discipline preserves the integrity of every measurement that preceded it**, and prevents a
  negotiation from retroactively falsifying the evidence record.
- **No final payment before all recoveries are settled** (LAW-8) and no retention release before
  conditions are met (LAW-10).
- **A no-claim certificate MUST be obtained before final release**, or the enterprise has paid in
  full while remaining exposed to future claims.
- **Closure is permanent** (§ 5.5). Reopening a closed final account requires a new, separately
  approved instrument and is an exception of the highest severity.

## 5.32 Object relationship model

The following expresses the essential structural dependencies. Read `→` as *"is a precondition
of / flows into."*

```
                         ENGAGEMENT INSTRUMENT ──────┐
                          (authority, ceiling)       │
                                  │                  │
                    ┌─────────────┼──────────────┐   │
                    ↓             ↓              ↓   │
            RATE SCHEDULE    DEPLOYMENT     VARIATION┘
                 ITEM             │         (raises ceiling)
                    │             ↓
                    │      WORK ASSIGNMENT
                    │        │         │
                    │        ↓         ↓
                    │   ATTENDANCE   [physical execution]
                    │     RECORD          │
                    │        │            ↓
                    │        ↓      MEASUREMENT ENTRY ←── EVIDENCE
                    │   MUSTER ROLL       │                ARTEFACT
                    │        │            │  (in MEASUREMENT BOOK)
                    │        ↓            ↓
                    └──→ SETTLEMENT   RUNNING BILL ←──── ISSUED VALUE
                          SHEET           │              RECORD
                             │            │                │
                             ↓            ↓                ↓
                        WAGE CARD    RETENTION  ←────── RECOVERY
                             │            │                │
                             └────────────┼────────────────┘
                                          ↓
                                  PAYMENT VOUCHER ←── APPROVAL RECORD
                                          │
                                          ↓
                                    DISBURSEMENT
                                          │
                                          ↓
                                 CONTRACTOR ACCOUNT
                                          │
                                          ↓
                                   FINAL ACCOUNT

  Cross-cutting: EXCEPTION RECORD attaches to any object.
                 PRODUCTIVITY RECORD derives from MEASUREMENT + ATTENDANCE.
                 BORROWED LABOUR LEDGER adjusts between projects.
                 HINDRANCE RECORD conditions ATTENDANCE and defends against claims.
```

### 5.32.1 The two payment paths

The model contains exactly **two** paths by which money reaches a party, and they are deliberately
distinct because their evidence requirements differ fundamentally:

| | **Contract path** | **Labour path** |
|---|---|---|
| **Governing law** | LAW-1 (no payment without verified measurement) | LAW-2 (no payment without validated attendance **and** assignment) |
| **Unit of entitlement** | Measured physical quantity | Validated worker-day |
| **Evidence** | Measurement Entry + artefacts | Attendance Record + Work Assignment |
| **Valuation** | Contracted rate × verified quantity | Wage rate × validated days |
| **Financial object** | Running Bill | Settlement Sheet |
| **Individual record** | Contractor Account | Wage Card |
| **Cumulative principle** | **Mandatory** (LAW-6) | Per settlement period |

**No third path exists.** Any payment that cannot be placed on one of these two paths is, by
definition, either an **Advance** (OBJ-17, governed by LAW-7) or an **exception** (OBJ-26, governed
by LAW-12). **There is no fourth category, and an implementation that permits one has created an
unpoliced channel for value to leave the enterprise.**

---

# PART 6 — BUSINESS LIFECYCLE

Part 5 defined objects and the states each may occupy. **Part 6 defines the journeys** — the ordered
business processes through which those objects move together, who may move them, and what MUST be
true at each transition.

An object lifecycle answers *"what states can this thing be in?"* A **business lifecycle** answers
*"how does the enterprise get from an intention to a discharged rupee, and what stops it going
wrong on the way?"*

## 6.1 The lifecycle model

### 6.1.1 Governing propositions

**LM-1 — There are exactly two payment lifecycles.** The contract path (LC-05) and the labour path
(LC-03), as established in § 5.32.1. Every other lifecycle in this Part either *feeds* one of them,
*constrains* one of them, or *closes* one of them. **No lifecycle terminates in money moving except
LC-10 (Disbursement), and LC-10 may only be entered from LC-03, LC-05, LC-06, LC-08 (retention
release) or LC-11 (final account).** The enumeration is exhaustive by intent: a payment that cannot
be placed on one of these five entries has no lawful route, and an implementation that creates one
has created the unpoliced channel this rule exists to prevent (§ 5.32.1).

**LM-2 — Lifecycles are entered at their origin, never in the middle.** PA-1 applies to processes,
not only to payments. An implementation that permits a Running Bill to be created without a
preceding verified measurement has allowed a lifecycle to be entered sideways, and every control
downstream of that entry point is thereby bypassed.

**LM-3 — Evidence is created *before* the process step that consumes it, by a different act.** A
lifecycle in which the evidence and the claim are created in the same act has no evidentiary value
(CP-1). The temporal ordering is itself a control.

**LM-4 — Progress is not automatic.** No object advances state by the passage of time alone. Every
transition is caused by a named actor performing a named act, and is recorded as such (CP-6). Timers
may *expire* an entitlement or *escalate* an exception; they may never *approve* anything.

**LM-5 — Every lifecycle has a defined terminal state, and terminal is permanent.** An object in a
terminal state is never revived. Where business need appears to require revival, the correct
construction is a **new object that references the terminal one** (LAW-11).

**LM-6 — Consumption is one-way.** Where a lifecycle consumes evidence — a measurement into a bill,
an attendance day into a settlement — that evidence is permanently marked consumed and MUST NOT be
consumable again. This single rule is the structural defence against leakage form **L2 (duplicate)**.

### 6.1.2 Lifecycle catalogue

| ID | Lifecycle | Primary objects | Terminates in |
|---|---|---|---|
| **LC-01** | Engagement | OBJ-04, OBJ-02, OBJ-05 | Authority to be paid at all |
| **LC-02** | Deployment & assignment | OBJ-06, OBJ-07, OBJ-03 | Authority for effort to be expended |
| **LC-03** | Labour cycle (daily → settlement) | OBJ-09, OBJ-10, OBJ-15, OBJ-16 | Net wage payable |
| **LC-04** | Measurement cycle | OBJ-11, OBJ-12, OBJ-13 | Verified quantity |
| **LC-05** | Contract payment cycle (running account) | OBJ-14, OBJ-25 | Net payable on a bill |
| **LC-06** | Advance | OBJ-17 | Recovered advance |
| **LC-07** | Recovery | OBJ-18, OBJ-29 | Recovered value |
| **LC-08** | Retention | OBJ-19 | Released or forfeited retention |
| **LC-09** | Variation | OBJ-24 | Raised ceiling / new rate |
| **LC-10** | Disbursement & reconciliation | OBJ-20, OBJ-21 | Money moved and reconciled |
| **LC-11** | Closure & final account | OBJ-30, OBJ-25 | Sealed contract |
| **LC-12** | Exception | OBJ-26 | Reviewed, counted exception |

> **Reading the diagrams.** `→` is a permitted transition. `⇄` is reversible. A transition drawn
> *downward* is an exception, rejection, or termination path. **A transition that is not drawn does
> not exist**; an implementation that permits it is non-conformant.

---

## 6.2 LC-01 — Engagement lifecycle

> *Establishes that a party may be paid at all, for what, at what rates, and up to what ceiling.*

```
  NEED IDENTIFIED → INSTRUMENT DRAFTED → SANCTIONED → RATES BOUND → ACTIVE
        (CAP-SCM)         (CAP-SCM)        (CAP-SCM)      (WFC)      (WFC)
                                                                       │
                              SUSPENDED ⇄ ─────────────────────────────┤
                                                                       ↓
                                            COMPLETED → account open → CLOSED (LC-11)
                                                 ↑
                                            TERMINATED (for cause)
```

**Entry.** An executed engagement instrument crosses the upstream boundary (§ 3.4.1) from CAP-SCM.
WFC **consumes** it; WFC never creates it (II-1).

**Mandatory preconditions before `ACTIVE`.** All of the following MUST be present and effective-dated,
or the instrument MUST NOT become ACTIVE:

| # | Precondition | Absent ⇒ |
|---|---|---|
| **E-1** | Sanctioned value (the ceiling) | LAW-9 unenforceable — **fatal** |
| **E-2** | Complete rate schedule with units and effective dates | Valuation impossible — **fatal** |
| **E-3** | Retention percentage and cap, or an explicit "nil retention" ruling | LAW-10 unenforceable — **fatal** |
| **E-4** | Advance terms and recovery basis, or an explicit "no advance" ruling | LAW-7 unenforceable — **fatal** |
| **E-5** | Recovery basis for enterprise-issued materials, plant, fuel, power | LAW-8 unenforceable — **fatal** |
| **E-6** | Statutory registration status of the counterparty | § 4.4 principal-employer exposure |
| **E-7** | Measurement basis — the standard method of measurement adopted (Part 8) | Ambiguity ⇒ leakage L3/L7 |
| **E-8** | Delegated approval limits applicable to this instrument | LAW-4 unbounded |

**LI-01 (invariant).** An instrument in `SANCTIONED` may support **only** an advance (LC-06), never a
bill. An instrument in `DRAFT` supports nothing at all.

**LI-02.** Rates bind at **`ACTIVE`** and are thereafter versioned, never edited (OBJ-05 is
`[FINANCIAL]`). A rate correction is a new rate version with its own effective date; work already
measured is valued at the version in force at the **work date**, not the correction date (DP-12).

**Suspension.** `SUSPENDED` halts new execution and new measurement. It does **not** halt: recovery
of outstanding advances, retention liability, or the contractor's entitlement to payment for work
already verified. **Suspension is not a payment-withholding device**; withholding is a separate,
recorded, attributed act under LC-12.

**Termination for cause.** On `TERMINATED`, LC-11 opens immediately. The enterprise's leverage is at
its maximum on the day of termination and decays thereafter (LA-7): all outstanding recoveries MUST
be crystallised into the final account before any residual payment.

---

## 6.3 LC-02 — Deployment & assignment lifecycle

> *Establishes that effort was directed before it was expended. Without this, effort claimed after
> the fact cannot be distinguished from effort invented after the fact.*

```
  DEPLOYMENT PLANNED → APPROVED → DEPLOYMENT ACTIVE
                                        │
                                        ↓
              WORK ASSIGNMENT ISSUED → IN_PROGRESS → COMPLETED → CLOSED
                                        │      ↓          ↓
                                  REASSIGNED SUSPENDED ABANDONED
```

**LI-03 — Assignment precedes execution.** A Work Assignment (OBJ-07) created **after** the work
date it purports to authorise is not an assignment; it is a reconstruction. It MUST be recorded as a
**retrospective assignment**, flagged, counted under LAW-12, and MUST NOT satisfy limb (b) of LAW-2
without recorded justification by an actor other than the one who created it.

**LI-04 — Deployment bounds assignment.** A worker may be assigned only within an approved
deployment. Assignment to a project on which the worker is not deployed is a primary detector of
duplicate attendance (XCP-02) and MUST be rejected, not warned.

**Borrowed labour.** Transfer of a worker between projects or contractors MUST close the lending
assignment and open the borrowing one **on the same date**, raising an entry in the Borrowed Labour
Ledger (OBJ-22). Overlapping open assignments for one worker on one date are prohibited — see LI-16.

---

## 6.4 LC-03 — The labour cycle (daily → settlement)

> *The path from a person standing at a site gate to a rupee in that person's hand. It is the
> highest-frequency lifecycle in the capability and the most exploited (§ 1.4.3).*

### 6.4.1 The cycle

```
  DAILY   ┌─ 1. Gate / muster capture ──── Site Supervisor (first observer)
          ├─ 2. Attendance CAPTURED ────── against Deployment + Assignment
          ├─ 3. Anomaly screening ──────── duplicate, ghost, out-of-deployment
          └─ 4. Attendance VALIDATED ───── by an actor who is not the Mate (SOD-7)
                        │
  PERIODIC ┌─ 5. Muster CLOSED ─────────── period sealed; no further capture
           ├─ 6. Muster CERTIFIED ──────── Project Manager
           ├─ 7. Wage computation ──────── Part 7 § 7.9 (arithmetic only)
           ├─ 8. Statutory minimum test ── LAW-8/CP-9; failure blocks settlement
           ├─ 9. Settlement Sheet COMPUTED → VERIFIED → CERTIFIED
           ├─10. Recoveries applied ────── LC-07 (worker advances, statutory)
           ├─11. Settlement APPROVED ───── delegated authority
           └─12. → LC-10 Disbursement · Wage Cards ISSUED → ACKNOWLEDGED
```

### 6.4.2 Transition conditions

| Step | Transition | MUST hold before the transition |
|---|---|---|
| 2 | → `CAPTURED` | Worker is `ACTIVE`; a Deployment exists covering the date |
| 4 | `CAPTURED` → `VALIDATED` | (a) an Assignment covers the date (LAW-2); (b) no other validated attendance exists for that worker on that date, enterprise-wide; (c) the validator is not the Mate who reported it (SOD-7); (d) the site was open (OBJ-28 / calendar) |
| 5 | `VALIDATED` → `LOCKED` | Period closed; every `DISPUTED` record resolved or excluded |
| 9 | Sheet `COMPUTED` → `VERIFIED` | Arithmetic independently reproduced (SC-10); day counts reconcile to the closed muster |
| 11 | → `APPROVED` | Recoveries complete (LAW-8); minimum-wage test passed; approver ≠ originator ≠ verifier (LAW-4) |
| 12 | → `SETTLED` | Disbursement instructed. Attendance days are now **consumed** (LM-6) |

### 6.4.3 Constitutional rulings on the labour cycle

**LR-1 — The worker is paid even when the intermediary is in dispute.** Where a commercial dispute
exists with a Mate or labour supplier, the workers' wages for validated attendance are settled on
time and in full (PA-8). The dispute is settled against the intermediary's margin, never against the
worker's wage.

**LR-2 — Intermediated payment does not extinguish individual visibility.** Where wages are paid
through a supplier or Mate, the enterprise MUST still hold a per-worker Wage Card (OBJ-16) and MUST
obtain acknowledgement of receipt by the **named worker** (§ 4.4 principal-employer exposure).
**Gang-level payment with no individual record is prohibited**, regardless of contract wording.

**LR-3 — Attendance is not a payment instruction.** Validated attendance establishes only that a
worker-day occurred. Entitlement additionally requires an authorised wage rate in force at the work
date and a passed statutory-minimum test.

**LR-4 — Idle, rain, and hindrance days are payable only where the instrument says so**, and are
recorded against OBJ-28 with a cause classification. An idle day recorded without a hindrance record
is an unclassified payment and is prohibited (DP-9).

**LR-5 — Correction never overwrites.** A wrong attendance record moves to `CORRECTED` and is
superseded by a new record referencing it (LAW-11). **The original remains visible permanently**,
including in the wage computation audit trail.

**LR-6 — Reopening a closed muster is an exception.** `CLOSED → REOPENED` requires LC-12, a named
authoriser, a reason, and a count against that authoriser. Repeated reopening by the same authoriser
is itself a detectable control-failure signal (LA-5).

---

## 6.5 LC-04 — The measurement cycle

> *Converts physical reality into a quantity the enterprise will pay for. Every rupee on the
> contract path originates here. Part 8 specifies the engine; this section specifies the journey.*

```
  Work executed at site
        ↓
  MEASUREMENT RECORDED ────── Site Engineer, in the Measurement Book, at site
        ↓
  EVIDENCE ATTACHED ───────── levels, dimensions, photographs, pour cards, test results
        ↓
  QUALITY GATE ────────────── CAP-QLT acceptance consumed (I-4); rejected work excluded
        ↓
  CHECK MEASUREMENT ───────── independent; test check or full re-measure
        ↓                          ↓                    ↓
  VERIFIED                     REDUCED              DISPUTED / CANCELLED
        ↓                          ↓
  → LC-05 (billable)          → LC-05 at reduced quantity
```

### 6.5.1 Transition conditions

| Transition | MUST hold |
|---|---|
| → `RECORDED` | The work is **executed** (LAW-3); the item is classified against an in-force Rate Schedule Item; location is recorded to the level of granularity that makes re-measurement possible |
| `RECORDED` → `CHECKED` | Checker ≠ measurer (SOD-1); the mandated check percentage (Part 8 § 8.8) has been applied |
| `CHECKED` → `VERIFIED` | Evidence sufficiency confirmed; arithmetic confirmed; classification confirmed; quality acceptance present |
| `VERIFIED` → `BILLED` | The entry is not already consumed by another bill (LM-6) |
| any → `SUPERSEDED` | A revision exists that references the original; **the original remains** (LAW-11) |

**LI-05 — Measurement in advance of execution is falsification** (LAW-3), irrespective of the
measurer's certainty that the work will be done. An implementation MUST make a future-dated
measurement impossible, not merely warn about it.

**LI-06 — The verifier may reduce, never increase.** A Check Measurement Officer may confirm or
reduce a recorded quantity. An increase requires a **new measurement by the measurer**, which is
then itself subject to check. This asymmetry is deliberate: it removes the incentive gradient
described in § 1.4.4 from the verification step.

**LI-07 — Quality is a precondition, not an adjustment.** Work not accepted by CAP-QLT is excluded
from measurement entirely. It is **never** measured and then discounted, because a discounted
measurement is a negotiated quantity, and negotiated quantities are how § 1.4.12 happens.

---

## 6.6 LC-05 — The contract payment cycle (running account)

> *The spine of the capability. Every control in Parts 1–5 either feeds this cycle or constrains it.*

```
  1. CLAIM RAISED ────────── contractor submits (a claim, never evidence — § 4.3)
  2. UNDER_MEASUREMENT ───── LC-04 executes for the period
  3. MEASURED ───────────── verified quantities assembled, cumulative to date
  4. VALUATION ──────────── Part 7: rates in force at work date × verified quantities
  5. CEILING TEST ───────── LAW-9. Breach ⇒ REJECT (never "approve at a higher level")
  6. RECOVERY ASSEMBLY ──── LC-07: advances due, materials, hire, fuel, damages, LD
  7. RETENTION ──────────── LC-08 accrual for the period
  8. STATUTORY DEDUCTION ── at source (in scope; computation/filing is CAP-TAX)
  9. NET COMPUTATION ────── Part 7 § 7.8: cumulative gross − previously paid − deductions
 10. VERIFIED ──────────── Accountant reproduces the arithmetic independently
 11. CERTIFIED ─────────── Project Manager, technical certification within limit
 12. APPROVED ──────────── Finance authority within delegated limit (LAW-4)
 13. → LC-10 ───────────── Payment Voucher → Disbursement
 14. CLOSED ────────────── superseded by the next cumulative bill or by LC-11
```

### 6.6.1 The hard gates

Each gate below is a **stop**, not a warning. An implementation that permits progress past a failed
gate is non-conformant regardless of any override facility offered.

| Gate | Test | On failure |
|---|---|---|
| **G-1** | Every quantity traces to a `VERIFIED` measurement entry not already consumed | Bill `RETURNED`; no partial pass |
| **G-2** | Cumulative certified ≤ sanctioned + approved variations (LAW-9) | **`REJECTED`.** Raise the ceiling by LC-09 or do not pay |
| **G-3** | All recoveries due in the period are applied (LAW-8) | Bill cannot reach `VERIFIED` |
| **G-4** | Retention withheld per instrument, recorded as liability (LAW-10) | Bill cannot reach `VERIFIED` |
| **G-5** | Originator ≠ verifier ≠ certifier ≠ approver (LAW-4, SOD-2, SOD-10) | Transition structurally impossible |
| **G-6** | Approver's delegated limit ≥ the amount, and valid at the approval date | `REJECTED`; escalate, never split (XCP-16) |
| **G-7** | Bill is cumulative and reconciles to the Contractor Account (LAW-6) | Bill cannot reach `VERIFIED` |
| **G-8** | Independent recomputation reproduces the figure exactly (SC-10) | Bill `RETURNED` as a defect |

**LI-08 — A returned bill re-enters at the step that failed, never later.** `RETURNED → RESUBMITTED`
restarts from measurement if measurement failed. It MUST NOT resume at `CERTIFIED` because the
earlier certification was given on a superseded set of facts.

**LI-09 — Part payment does not close a bill.** `PART_PAID` is a live state. The residual remains a
liability of the enterprise and appears in the Contractor Account until settled or explicitly
extinguished by the final account.

**LI-10 — The cumulative principle is not an accounting preference.** Every bill re-derives the whole
position (PA-4, DP-8). A bill computed as "this period's work only" is prohibited even where it
would produce the same number, because it forfeits the self-correction property that makes prior
errors non-compounding.

---

## 6.7 LC-06 — Advance lifecycle

```
  REQUESTED → recovery plan bound → APPROVED → DISBURSED → RECOVERING → RECOVERED → CLOSED
       ↓              ↓                                          ↓
   REJECTED      CANCELLED                              WRITTEN_OFF (executive, loss event)
```

**LI-11 — No advance exists without a recovery plan** (LAW-7). The recovery plan — instalment basis,
percentage of each bill, or absolute schedule — is bound **at approval**, not at first recovery. An
approved advance with an empty recovery plan is an unauthorised payment by definition.

**LI-12 — Advance recovery is not optional in a period where a bill exists.** If a bill is raised and
an advance is outstanding, recovery is applied (LAW-8). Deferral is an exception under LC-12 with a
named authoriser and a count — never a silent skip, which is precisely how leakage L5 accumulates.

**LI-13 — Write-off is a loss event, not a closure route.** `WRITTEN_OFF` requires executive
authority, produces a permanent loss record, and MUST be reported in control-health reporting
(R-13). It never silently removes the receivable from view.

---

## 6.8 LC-07 — Recovery lifecycle

```
  IDENTIFIED → QUANTIFIED → SCHEDULED → APPLIED → RECOVERED → CLOSED
       ↓            ↓            ↓
   DISPUTED      WAIVED      DEFERRED (exceptional, counted)
```

**LI-14 — Recovery obligations are created by the issuing event, not by the recovering party.**
Material issue (I-5) and plant/fuel issue (I-6) MUST create a recovery obligation **automatically on
issue**. A model in which the Accountant must remember to raise a recovery fails LA-4 within one
personnel change, and § 1.4.6 is the result.

**LI-15 — Waiver is an executive act with a permanent record.** `WAIVED` requires authority above the
approver of the payment it would otherwise reduce (SOD-8), a stated reason, and a count. Waiver by
the same actor who authorised the advance is constitutionally prohibited.

**Deferral vs waiver.** Deferral moves the recovery to a later period and keeps it live. Waiver
extinguishes it and is a loss. **An implementation MUST NOT allow deferral to function as an
indefinite waiver**: a recovery deferred more than a bounded number of periods escalates
automatically (CP-11, LA-5).

---

## 6.9 LC-08 — Retention lifecycle

```
  ACCRUING → HELD → PARTIALLY_RELEASED → RELEASED → CLOSED
                ↓
           FORFEITED (contractual, exceptional)
```

**Release conditions** are bound at engagement (E-3) and typically comprise: physical completion,
expiry of the defect liability period, satisfaction of recorded defects, and absence of outstanding
recovery.

**LI-17 — Retention is the contractor's money** (LAW-10). It is recorded as a liability from the
moment it is withheld. It MUST NOT reduce recorded project cost, MUST NOT appear as a saving, and
MUST NOT be released early to relieve a contractor's cash pressure — early release is the exact
mechanism by which the enterprise's residual security disappears before the defects appear.

**LI-18 — Release requires a positive condition test, not the absence of an objection** (DP-9).

---

## 6.10 LC-09 — Variation lifecycle

```
  PROPOSED → EVALUATED → SANCTIONED → INCORPORATED → CLOSED
       ↓          ↓
  WITHDRAWN   REJECTED
```

**LI-19 — The ceiling rises only here.** LAW-9 permits exactly one mechanism for increasing
cumulative payable value: a `SANCTIONED` variation. No approval seniority, urgency, or relationship
substitutes for it.

**LI-20 — Variation follows instruction, and instruction MUST precede execution.** § 1.4.7 describes
the failure mode: verbal instruction, work executed, variation raised months later or never. A
conforming implementation MUST support a **Site Instruction** record that creates the variation's
provenance on the day the instruction is given, and MUST flag any variation whose executed work
predates its instruction record.

**LI-21 — A rejected variation does not create an entitlement.** Work executed under a variation that
is subsequently `REJECTED` is not payable under the contract. Its treatment is a commercial dispute
(CAP-LEG), not a measurement adjustment.

---

## 6.11 LC-10 — Disbursement & reconciliation lifecycle

```
  VOUCHER PREPARED → VERIFIED → APPROVED → RELEASED → INSTRUCTED (to CAP-TRE)
        ↓                ↓          ↓           ↓
    CANCELLED        RETURNED   REJECTED     FAILED → RETURNED → REINSTATED
                                                 ↓
                                     IN_TRANSIT → CONFIRMED → RECONCILED → SETTLED
```

**LI-22 — The disburser never approves** (CP-3, SOD-3). The disbursing act verifies that the chain is
complete; it makes no financial judgement.

**LI-23 — Amount and payee are immutable after approval** (integration O-2). CAP-TRE MUST NOT alter either. A
required change is a cancellation and a new voucher, both permanently recorded.

**LI-24 — Failure reinstates the liability.** A failed or returned disbursement returns the amount to
the contractor's or worker's credit **automatically** (I-10). An implementation in which a failed
payment silently disappears has created an unrecorded gain to the enterprise and a live grievance.

**LI-25 — Reconciliation is mandatory and bounded in time.** An instructed disbursement that is
neither `CONFIRMED` nor `FAILED` within a defined window MUST raise an exception (CP-11). Silence is
never treated as success.

---

## 6.12 LC-11 — Closure & final account lifecycle

> *§ 1.4.12: this is where control collapses in practice. It therefore carries the strictest
> sequence in this Part.*

```
  INITIATED → FINAL MEASUREMENT → RECONCILED → AGREED → APPROVED → SETTLED → CLOSED
       ↓             ↓                 ↓          ↓
   DISPUTED      DISPUTED          DISPUTED   ARBITRATION → (CAP-LEG)
```

### 6.12.1 The closure reconciliation

Before `AGREED`, **all** of the following MUST reconcile to zero unexplained residue. Each is a
distinct test, and a failure in any one blocks closure:

| # | Reconciliation | Fails ⇒ leakage form |
|---|---|---|
| **FC-1** | Cumulative certified value = sum of all verified measurements at bound rates | L3 |
| **FC-2** | Cumulative certified ≤ sanctioned + sanctioned variations | L3 (ceiling breach) |
| **FC-3** | Total advances issued = total recovered + total outstanding + total written off | L5 |
| **FC-4** | Total value issued to contractor (materials, plant, fuel, power, accommodation) = recovered + outstanding | L5 |
| **FC-5** | Retention withheld = released + held + forfeited | L6 |
| **FC-6** | Statutory deductions deducted = deposited (confirmed by CAP-TAX) | statutory |
| **FC-7** | Liquidated damages due under the instrument = levied + formally waived | **L6** |
| **FC-8** | Cumulative paid = sum of all confirmed disbursements | L2 |
| **FC-9** | No measurement entry remains `VERIFIED` but unbilled | contractor detriment |
| **FC-10** | No attendance record remains `VALIDATED` but unsettled | worker detriment |

**LI-26 — The final bill is computed, then agreed — never agreed, then computed.** Settlement by
negotiation is prohibited. Where a negotiated commercial settlement is genuinely required, it is
recorded as a **settlement instrument with a stated variance from the computed figure**, attributed
to the executive who authorised it and counted under LAW-12. The computed figure remains permanently
visible beside it.

**LI-27 — Closure is not payment.** § 3.4.4: the contract closes when the last obligation expires —
retention released, defect liability expired, statutory records sealed — not when the last rupee
moves. `CLOSED` requires FC-1…FC-10 **and** the expiry of live obligations.

**LI-28 — No-claim certificates do not cure control failures.** A contractor's no-claim certificate
extinguishes the contractor's claims. It does not extinguish the enterprise's unrecovered value, and
MUST NOT be accepted as a substitute for FC-3, FC-4, or FC-7.

---

## 6.13 LC-12 — Exception lifecycle

```
  RAISED → AUTHORISED → ACTIVE → EXPIRED / CLOSED → REVIEWED → ARCHIVED
     ↓
  REFUSED
```

**LI-29 — Every exception is time-boxed at authorisation** (LAW-12). An exception without an expiry
is a permanent rule change made without governance.

**LI-30 — Exceptions are counted against the authoriser, and the count is reported** (LAW-12, LA-5).
An implementation that records exceptions but cannot report *exceptions by authoriser for a period*
has not satisfied LAW-12 — because an uncounted exception has not been recorded.

**LI-31 — Frequency is itself an escalation trigger.** The same exception type raised more than a
defined number of times in a period escalates automatically to the Finance Controller and to
Internal Audit. This is the structural implementation of "the exception becomes the process."

**LI-32 — An exception may relax a *procedure*. It may never relax an Immutable Law.** There is no
authority anywhere in this capability — executive, emergency, or contractual — that can authorise a
payment without measurement (LAW-1), a payment beyond ceiling (LAW-9), or a self-approval (LAW-4).
A request to do so is refused, and the refusal is itself recorded.

---

## 6.14 Transition authority matrix

Who may cause which transition. **Blank means prohibited.** "≠" denotes an additional separation
constraint on the same transaction.

| Transition | Supervisor | Site Engineer | Check Officer | PM | Accountant | Finance Controller | CEO/MD |
|---|---|---|---|---|---|---|---|
| Attendance → CAPTURED | **✔** | | | | | | |
| Attendance → VALIDATED | ✔ (≠ reporter) | ✔ | ✔ | | | | |
| Muster → CLOSED | ✔ | | | ✔ | | | |
| Muster → CERTIFIED | | | | **✔** | | | |
| Muster → REOPENED | | | | | | **✔** (exception) | ✔ |
| Measurement → RECORDED | | **✔** | | | | | |
| Measurement → CHECKED / VERIFIED | | | **✔** | | | | |
| Measurement → REDUCED | | | **✔** | | | | |
| Measurement → CANCELLED | | ✔ (pre-bill, with reason) | ✔ | | | | |
| Bill → SUBMITTED | | | | | ✔ (on contractor claim) | | |
| Bill → VERIFIED | | | | | **✔** (≠ originator) | | |
| Bill → CERTIFIED | | | | **✔** (≠ verifier) | | | |
| Bill → APPROVED | | | | ✔ within limit | | **✔** | ✔ |
| Ceiling breach override | | | | | | | **none — prohibited** |
| Advance → APPROVED | | | | ✔ within limit | | **✔** | ✔ |
| Recovery → WAIVED | | | | | | ✔ (≠ advance authoriser) | ✔ |
| Retention → RELEASED | | | | ✔ (condition test) | ✔ (computation) | **✔** | |
| Voucher → APPROVED | | | | | | **✔** | ✔ |
| Disbursement → INSTRUCTED | | | | | ✔ (≠ approver) | | |
| Final account → AGREED | | | | ✔ | ✔ | **✔** | ✔ |
| Exception → AUTHORISED | | | | ✔ (bounded types) | | **✔** | ✔ |
| Write-off | | | | | | ✔ (recommend) | **✔** |

> **The Internal Auditor appears nowhere in this matrix by design** (SOD-5). An actor who can cause a
> transition cannot independently audit it.

---

## 6.15 Cross-lifecycle synchronisation points

Points at which two lifecycles MUST agree before either may proceed. These are the joints at which
real implementations leak, because each lifecycle is individually correct and the *pair* is not.

| # | Synchronisation | Rule |
|---|---|---|
| **SY-1** | LC-04 → LC-05 | A measurement may be consumed by exactly one bill, ever (LM-6) |
| **SY-2** | LC-03 → LC-10 | An attendance day may be consumed by exactly one settlement, ever |
| **SY-3** | LC-06 → LC-05 | Every advance outstanding at bill date appears in that bill's recovery set |
| **SY-4** | LC-07 → LC-05 | Every recovery `SCHEDULED` for the period is `APPLIED` in that period's bill |
| **SY-5** | LC-09 → LC-05 | The ceiling test uses variations `SANCTIONED` **on or before** the bill date — never those merely proposed |
| **SY-6** | LC-05 → LC-08 | Retention accrues on the same certified value the bill used, in the same act |
| **SY-7** | LC-10 → LC-05 | A bill is `PAID` only on `CONFIRMED` disbursement, never on instruction |
| **SY-8** | LC-01 → all | An instrument leaving `ACTIVE` immediately constrains every dependent lifecycle |
| **SY-9** | LC-02 ↔ LC-03 | An attendance date outside the assignment window cannot be validated |
| **SY-10** | LC-11 → all | Closure requires every dependent lifecycle in a terminal state |

**LI-16 — The single-occupancy invariant.** For any worker and any date, at most **one** validated
attendance record may exist across the entire enterprise — all projects, all contractors, all
suppliers. This is enforced at validation, not detected in reporting. It is the single most
important structural control against leakage form L1/L2 in the labour path, and it is the reason
worker identity MUST be enterprise-wide rather than per-project (§ 5.2).

---

## 6.16 Terminal states and consumption

| Object | Terminal state | Consumption marker | Re-use after consumption |
|---|---|---|---|
| Attendance Record | `SETTLED` → `ARCHIVED` | `SETTLED` | **Never** |
| Measurement Entry | `SETTLED` → `ARCHIVED` | `BILLED` | **Never** |
| Running Bill | `CLOSED` → `ARCHIVED` | superseded by next cumulative bill | Never |
| Advance | `RECOVERED` / `WRITTEN_OFF` → `CLOSED` | fully recovered | Never |
| Recovery | `RECOVERED` → `CLOSED` | applied | Never |
| Retention | `RELEASED` / `FORFEITED` → `CLOSED` | released | Never |
| Payment Voucher | `SETTLED` → `CLOSED` | disbursement confirmed | Never |
| Engagement Instrument | `CLOSED` → `ARCHIVED` | final account settled | Never |
| Exception Record | `ARCHIVED` | reviewed | Never |

**LI-33 — Archival is not deletion.** `ARCHIVED` means "removed from operational view, retained for
the statutory retention period, reconstructible on demand" (LAW-11, § 3.4.4). An implementation that
deletes on archive is non-conformant.

**Routes to disbursement.** Five of the objects above reach money movement, and only these five, per
LM-1: a Running Bill through LC-05; a Settlement Sheet through LC-03; an Advance through LC-06;
**Retention through LC-08 on release (FM-16)**; and a **Final Account through LC-11 (CLS-04)**. Each
enters LC-10 and terminates at `CLOSED` only on confirmed disbursement (SY-7).

---

## 6.17 Period governance

**PG-1 — Every financial lifecycle operates inside a defined period**, and a period has exactly one
status: `OPEN`, `CLOSING`, `CLOSED`.

**PG-2 — Nothing financial is recorded into a `CLOSED` period.** A late fact is recorded in the
current open period with an effective date in the past, and the effective date — not the recording
date — governs valuation (DP-12).

**PG-3 — Period close is a positive act with a checklist**, not the arrival of a date. Minimum:
musters closed; disputed attendance resolved or excluded; measurements either verified or explicitly
carried forward; recoveries scheduled for the period applied or formally deferred; reconciliation
identities (Part 7 § 7.12) satisfied.

**PG-4 — Reopening a closed period is an exception under LC-12**, authorised at Finance Controller
level or above, time-boxed, counted, and reported.

---

## 6.18 Lifecycle invariants — consolidated

| # | Invariant | Enforcing law |
|---|---|---|
| LI-01 | `SANCTIONED` instrument supports advance only | LAW-1 |
| LI-02 | Rates bind at ACTIVE; valued at work date | DP-12, CP-4 |
| LI-03 | Assignment precedes execution | LAW-2 |
| LI-04 | Assignment within approved deployment only | LAW-2 |
| LI-05 | No future-dated measurement | LAW-3 |
| LI-06 | Verifier may reduce, never increase | CP-2 |
| LI-07 | Rejected work is excluded, not discounted | CP-8 |
| LI-08 | Returned bill re-enters at the failed step | CP-1 |
| LI-09 | Part payment leaves the bill live | LAW-6 |
| LI-10 | Bills are cumulative, always | LAW-6, PA-4 |
| LI-11 | No advance without a bound recovery plan | LAW-7 |
| LI-12 | Recovery applied wherever a bill exists | LAW-8 |
| LI-13 | Write-off is a loss event | LAW-7 |
| LI-14 | Issue creates recovery automatically | LAW-8, LA-4 |
| LI-15 | Waiver is executive and separated | SOD-8 |
| LI-16 | One validated attendance per worker per date, enterprise-wide | LAW-2 |
| LI-17 | Retention is a liability, never a saving | LAW-10 |
| LI-18 | Release requires a positive test | DP-9 |
| LI-19 | The ceiling rises only by variation | LAW-9 |
| LI-20 | Instruction precedes variation work | CP-1 |
| LI-21 | Rejected variation creates no entitlement | LAW-1 |
| LI-22 | Disburser never approves | CP-3 |
| LI-23 | Amount and payee immutable after approval | LAW-11 |
| LI-24 | Failed disbursement reinstates liability | II-4 |
| LI-25 | Unconfirmed disbursement raises an exception | CP-11 |
| LI-26 | Final bill computed, then agreed | PA-4 |
| LI-27 | Closure ≠ final payment | § 3.4.4 |
| LI-28 | No-claim certificate cures nothing | LAW-8 |
| LI-29 | Exceptions are time-boxed | LAW-12 |
| LI-30 | Exceptions are counted and reportable | LAW-12 |
| LI-31 | Frequency escalates automatically | LA-5 |
| LI-32 | No exception may relax an Immutable Law | § 1.8 |
| LI-33 | Archival is not deletion | LAW-11 |

---

# PART 7 — MATHEMATICAL ENGINE

## 7.1 Purpose and authority

This Part is the **single canonical definition of every computation in CAP-WFC-01** (CP-4, DP-4).

Its authority is absolute within its subject matter: where any document, report, screen, contract
interpretation, or implementation computes a quantity defined here and obtains a different result,
**that computation is a defect**, not an alternative view. Two implementations of the same formula
constitute a defect *even while they agree*, because they will eventually diverge and no one will
know which is right (CP-4).

**What this Part is not.** It is not a data model, an algorithm, or a rounding library. It states
*what the number means and how it is derived*, in a form that a competent person can reproduce by
hand and an auditor can check without access to the implementation.

> **The recomputation test (SC-10).** Any figure produced by a conforming implementation MUST be
> reproducible, **exactly**, from this Part plus the primary evidence. A figure that can only be
> reproduced by running the system is not auditable and therefore not conformant.

## 7.2 Notation

| Symbol | Meaning |
|---|---|
| `i` | A rate schedule item (OBJ-05) |
| `e` | A measurement entry (OBJ-12) |
| `t` | The work's **effective date** — the date the work was executed, never the date of computation |
| `Qᵢ(t)` | Verified quantity of item `i` executed on or before `t`, cumulative |
| `Rᵢ(t)` | Contracted rate for item `i` **in force at** `t` |
| `V` | A value in currency |
| `V_paid_cum` | Cumulative **confirmed net disbursement** against the instrument (RI-6) |
| `Ret_held` | Retention **currently held**: `Ret_cum − Ret_released − Ret_forfeited` (RI-5). Distinct from `Ret_cum`, which is retention *accrued* (FM-15) |
| `Σ` | Summation over all members of the stated set |
| `round₂(x)` | Rounding to 2 decimal places under RND-2 |
| `⌈x⌉ᶜᵃᵖ` | `x` limited to a stated ceiling: `min(x, cap)` |
| `⌊x⌋₀` | `x` floored at zero: `max(x, 0)` |
| **cum** | Cumulative to date, from contract commencement — never period-only |
| **prev** | The corresponding cumulative figure at the immediately preceding settled bill |

> **The `cum` / `prev` discipline is the running-account principle** (LAW-6, PA-4). Every contract
> formula in this Part is stated cumulatively. A period figure is *derived* as `cum − prev`, never
> accumulated forward from period figures.

## 7.3 Numeric foundations

### 7.3.1 Precision

| Class | Stored precision | Displayed | Rule |
|---|---|---|---|
| Quantity | 3 decimal places | 3 | Measurement precision is governed by Part 8 § 8.4 |
| Rate | As contracted, minimum 2 decimals | as contracted | **Never rounded** — a rounded rate is a changed rate |
| Currency (intermediate) | Full precision, unrounded | — | Intermediates are **not** rounded (RND-1) |
| Currency (presented / posted) | 2 decimal places | 2 | `round₂` at the defined points only |
| Percentage | Exact as contracted | — | Applied as a fraction, never as a rounded decimal |

### 7.3.2 Rounding rules

**RND-1 — Round once, at the end, at defined points only.** Intermediate results carry full
precision. Rounding at each step compounds error and is the arithmetic origin of leakage form L7
(erosion) and of the "our totals differ by ₹3" dispute that consumes disproportionate effort.

**RND-2 — Half away from zero.** `round₂(x)` rounds to two decimals, ties away from zero
(`2.345 → 2.35`, `−2.345 → −2.35`). Banker's rounding is **prohibited** here: it is unfamiliar to
the counterparties who must verify the figure by hand, and CP-10 requires that they can.

**RND-3 — The defined rounding points, and no others:**

| # | Rounding point |
|---|---|
| RPT-1 | Item value — `round₂` of `Qᵢ × Rᵢ` |
| RPT-2 | Each recovery amount, individually |
| RPT-3 | Each retention accrual |
| RPT-4 | Each statutory deduction |
| RPT-5 | Net payable on a voucher |
| RPT-6 | Each worker's net wage |

**RND-4 — Sums are sums of rounded components.** Gross measured value is `Σ round₂(item value)`, not
`round₂(Σ item value)`. This makes the bill's line items add up on paper — a CP-10 requirement — and
is the only place where the "round once" rule is deliberately relaxed, at the item boundary.

**RND-5 — No rounding may increase the enterprise's outflow.** Where a rounding convention is
genuinely ambiguous, the resolution favours the enterprise's exposure being lower (CP-8) — **except
in worker wage computation (RPT-6), where ambiguity resolves in the worker's favour** (§ 1.8 LAW-8
context, CP-9, PA-8).

**RND-6 — Currency is never truncated.** Truncation is prohibited everywhere.

**RND-7 — Percentages apply to unrounded bases.** Retention at 5% applies to the unrounded certified
value, then `round₂`. Applying a percentage to an already-rounded base and rounding again is a
double rounding and is prohibited.

**RND-8 — Deterministic ordering.** Where a sum's result could depend on ordering, items are summed
in **item-code order**, then entry-date order, then entry-identity order. Two runs MUST produce
identical output (SC-10).

### 7.3.3 Units

**U-1** — Quantity and rate MUST share a unit. A rate in ₹/m³ applied to a quantity in m² is not an
arithmetic error to be caught in review; it MUST be **structurally impossible**.

**U-2** — Unit conversion, where genuinely required, is performed once, at measurement, and the
conversion factor and both figures are recorded permanently (CP-7 drillability).

**U-3** — A lump-sum item has unit "LS" and quantity ∈ {0, part-rate fraction, 1}. It is valued by
§ 7.5 FM-04 and by no other route.

## 7.4 Rate resolution and effective dating

**Rate resolution is a computation, and it is the one most often performed wrongly.**

> **FM-00 — Rate resolution.**
> `Rᵢ(t)` = the rate of the version of item `i` whose effective-from ≤ `t` < effective-to,
> under the engagement instrument governing the work, **selected by the work date `t`, never by the
> billing date, the approval date, or the current date.**

**RR-1** — If no version of `i` is in force at `t`, the work is a **non-scheduled item** and MUST be
valued by the star-rate procedure (Part 8 § 8.10) before it can be billed. It MUST NOT be valued at
the nearest available rate, the latest rate, or a similar item's rate.

**RR-2** — A rate correction applies from its own effective date forward. Work already measured at
an earlier date retains the earlier rate. Retrospective rate change is a **restatement**, requires
executive authority, and MUST restate every affected bill visibly rather than silently altering the
current one (LAW-11).

**RR-3** — The same discipline governs wage rates, statutory minima, statutory deduction rates, and
delegated approval limits. **All are time-versioned; all resolve by effective date** (DP-12).

**RR-4 — `t` for work spanning a rate change.** Construction work is executed over a span, not on a
date. For a measured element whose execution spans two in-force rate versions, `t` is the **date of
completion of the element measured**, the element being the smallest unit the method of measurement
recognises (MM-1). Where the method permits, an element spanning a rate boundary **MUST be measured
in two parts at the boundary** and each part valued at its own `t`. **An undefined `t` is a rate
selection made by the measurer**, who is the actor § 4.6 declares to be conflicted, and its value is
the rate differential on the whole quantity (LA-2).

## 7.5 Valuation formulae — contract path

> **FM-01 — Item value.**
> `Vᵢ = round₂( Qᵢ(t) × Rᵢ(t) )`

> **FM-02 — Cumulative gross measured value.**
> `V_gross_cum = Σᵢ Vᵢ` over all items with verified quantity, cumulative to date (RND-4, RND-8)

> **FM-03 — Part rate for incomplete work.**
> `V_part = round₂( Q_executed × Rᵢ(t) × f_part )`
> where `f_part` ∈ (0, 1) is the **contractually defined** completion fraction for the stage reached.

**PR-1** — `f_part` MUST come from the instrument or an approved schedule of part rates. **It is
never negotiated at bill time.** An undefined part rate is an undefined term, and by LA-2 an
undefined term is a leakage site.

**PR-2** — Part-rate value for an item is superseded, not added to, when the item completes:
`V_on_completion = round₂(Q × R) − V_part_already_certified`. Adding a completion value to a part
value is duplicate settlement (L2).

> **FM-04 — Lump-sum item value.**
> `V_LS = round₂( LS_amount × f_stage )`, where `f_stage` is the instrument's stage-completion
> fraction and `Σ f_stage ≤ 1` over the life of the item, always.

> **FM-05 — Price variation / escalation** (only where the instrument provides for it).
> `V_esc = round₂( V_base × Σₖ ( wₖ × ( Iₖ(t) − Iₖ(t₀) ) / Iₖ(t₀) ) )`
> where `wₖ` is the contractual weightage of component `k` (labour, cement, steel, fuel, other),
> `Iₖ` its published index, `t₀` the contractual base date, and `Σ wₖ ≤ 1`.

**ESC-1** — Indices are consumed from the published source named in the instrument, by effective
date. **The enterprise never estimates an index.** If the index for `t` is not yet published, the
escalation for that period is `0` and is computed when the index publishes — as an addition in a
later cumulative bill, never as an estimate.

**ESC-2** — Escalation is computed on the **base value of work executed in the period to which the
index applies**, not on cumulative value, and its cumulative total is then carried in the running
account like any other component.

> **FM-06 — Cumulative certified value** (the LAW-9 subject).
> `V_certified_cum = V_gross_cum + V_esc_cum + V_variation_cum`

> **FM-07 — The ceiling test (LAW-9).**
> `V_certified_cum ≤ V_sanctioned + Σ V_variation_sanctioned(≤ bill date)`
> **A bill that fails this test is `REJECTED`.** It is not approved at a higher level, not
> part-passed to the ceiling, and not deferred. The ceiling is raised by LC-09 or the value is not
> paid. There is no third option anywhere in this capability.

> **FM-08 — Period certified value** (derived, never accumulated).
> `V_certified_period = V_certified_cum − V_certified_prev`

**A negative `V_certified_period` is legitimate** — it is the running-account principle
self-correcting a prior over-certification (PA-4). It MUST be presented as a negative figure and
MUST NOT be suppressed, floored at zero, or carried silently. **Suppressing it is how an
over-certification becomes permanent.**

## 7.6 Recovery formulae

> **FM-09 — Advance recovery due in the period** (percentage basis, the common case).
> `Rec_adv = min( round₂( V_certified_period × p_recovery ), Adv_outstanding )`

> **FM-10 — Advance recovery due** (instalment basis).
> `Rec_adv = min( Σ instalments due on or before bill date and unrecovered, Adv_outstanding )`

**AR-1** — Where the instrument specifies both a percentage and a minimum instalment, the recovery is
the **greater** of the two, capped at outstanding. Recovery accelerates; it never decelerates.

**AR-2** — On `SUSPENDED` or `TERMINATED` (LC-01), the entire outstanding advance becomes immediately
due and recoverable from any payment, notwithstanding the recovery schedule (LA-7).

> **FM-11 — Issued-value recovery** (materials, plant hire, fuel, power, water, accommodation).
> `Rec_issue = Σ round₂( q_issued × rate_issue(t_issue) × (1 + h) )`
> where `h` is the contractual handling/wastage uplift, `0` if not provided.

**IR-1** — `rate_issue` resolves by **issue date**, not bill date (DP-12).
**IR-2** — Issued value not yet recovered is a live receivable in the Contractor Account from the
moment of issue (LI-14), and appears in exposure (§ 7.11) whether or not a bill exists.

> **FM-12 — Damage, rework, and rejection recovery.**
> `Rec_damage = round₂( assessed_value )`, where the assessment is an attributed act with recorded
> basis, not a percentage applied at settlement.

> **FM-13 — The recovery waterfall.** Where the amount available is insufficient to satisfy all
> recoveries, they are applied in this fixed order. **The order is constitutional and MUST NOT be
> varied by agreement, convenience, or contractor preference:**

| Priority | Recovery class | Rationale |
|---|---|---|
| **1** | Statutory deductions | CP-9 — statute outranks the enterprise |
| **2** | Worker wages payable through the contractor | PA-8 — the worker's claim outranks the enterprise's |
| **3** | Secured / mobilisation advance | Enterprise principal at risk (LA-7) |
| **4** | Material and issued-value recovery | Enterprise value already transferred |
| **5** | Plant, equipment, fuel, and utility hire | Enterprise value already transferred |
| **6** | Damage, loss, rework, rejection | Assessed enterprise loss |
| **7** | Liquidated damages and contractual penalties | Contractual entitlement (L6) |
| **8** | Retention | Withheld, not recovered — accrues last |
| **9** | Ad-hoc / other advances | Lowest priority; longest tolerable exposure |

**WF-1** — Where the waterfall exhausts the payable amount, the unsatisfied remainder **stays
outstanding and carries forward**; it is never written off by the act of being unrecoverable this
period.

**WF-2** — The waterfall MUST NOT be reordered to produce a positive net payment. A contractor's
operational need for cash is a matter for LC-12 (an attributed, counted exception granting an
advance), never for silently deferring priority-3 recovery.

> **FM-14 — Total recovery in the period.**
> `Rec_total = Rec_adv + Rec_issue + Rec_damage + Rec_LD + Rec_other`

## 7.7 Retention and statutory deductions

> **FM-15 — Retention accrual.**
> `Ret_cum = ⌈ round₂( V_certified_cum × p_retention ) ⌉^(Ret_cap)`
> `Ret_period = Ret_cum − Ret_prev`

**RT-1** — Retention is computed on **cumulative certified value** and capped at the contractual
ceiling (typically a percentage of sanctioned value). Once the cap binds, `Ret_period = 0` — it does
not continue to accrue.

**RT-2** — `Ret_cum` is a **liability of the enterprise** from the instant it is computed (LAW-10).
It MUST NOT be netted against project cost, reported as a saving, or treated as retained profit.

> **FM-16 — Retention release.**
> `Ret_release = round₂( Ret_held × f_release )` on satisfaction of the release condition,
> **less any outstanding recovery** (LAW-8 — recovery precedes even the release of the contractor's
> own money, because the enterprise's leverage does not return afterwards).

> **FM-17 — Statutory deduction at source.**
> `Ded_s = round₂( base_s(t) × rate_s(t) )` for each statutory head `s`, where `base_s` and `rate_s`
> are consumed from CAP-TAX by effective date (I-8) and **never authored inside this capability**
> (II-1).

**SD-1** — Where a threshold determines applicability, the threshold is tested against the
**cumulative** base for the statutory period, not the individual bill — otherwise splitting bills
defeats the deduction, which is a control circumvention (XCP-16).

> **FM-18 — Liquidated damages.**
> `LD = ⌈ round₂( V_sanctioned × p_LD × n_periods_delayed ) ⌉^(LD_cap)`
> where `p_LD`, the period definition, and `LD_cap` all come from the instrument.

**LD-1** — LD accrues **by the instrument's own terms, automatically**, from the moment delay is
established. It is not "levied" by an act of will. **Non-levy is a waiver** (LC-07 `WAIVED`),
requires executive authority, and is counted — because LD abandoned by inaction is leakage form
**L6**, and L6 is invisible precisely because nothing appears to go wrong.

**LD-2** — Delay attributable to the enterprise (recorded hindrance, OBJ-28) reduces `n_periods_delayed`.
This is why hindrance records defend the enterprise as much as the contractor: an unrecorded
hindrance becomes an indefensible LD claim later.

## 7.8 The canonical bill computation

> **This ordered sequence is the definition of a Running Bill's net payable. The order is
> constitutional: the same components in a different order produce a different number, and only this
> order is conformant.**

```
  Step  Computation                                            Formula
  ────────────────────────────────────────────────────────────────────────────
   1    Resolve rates by work date                             FM-00
   2    Value each verified item                               FM-01, FM-03, FM-04
   3    Cumulative gross measured value                        FM-02
   4    Add escalation (if provided)                           FM-05
   5    Add sanctioned variations                              FM-06
   6    ►► CEILING TEST — hard stop on failure ◄◄              FM-07
   7    Derive period certified value                          FM-08
   8    Compute retention accrual for the period               FM-15
   9    Assemble all recoveries due                            FM-09…FM-14
  10    Apply the recovery waterfall                           FM-13
  11    Compute statutory deductions                           FM-17
  12    Compute net payable                                    FM-19
  13    ►► NON-NEGATIVE TEST ◄◄                                § 7.8.2
  14    Independent recomputation must reproduce steps 1–12    SC-10
```

> **FM-19 — Net payable on a running bill.**
> `Net = round₂( V_certified_cum − V_paid_cum − Ret_held − Rec_cum − Ded_cum )`
>
> **`Ret_held`, not `Ret_cum`.** Retention that has been released has already been disbursed and is
> therefore already inside `V_paid_cum`. Subtracting accrued retention would deduct the released
> amount a second time, underpaying the contractor by exactly the sum released, at every subsequent
> bill (LAW-10).

Stated cumulatively, as LAW-6 requires. Every term is a **cumulative** figure, and the bill's own
period movement is the difference from the previous settled position. This is what makes a prior
error self-correct at the next bill instead of compounding: **there is no term in FM-19 that carries
a period figure forward.**

### 7.8.1 Why cumulative, restated

An incremental formulation (`Net = period value − period deductions`) produces the same answer when
nothing has ever gone wrong, and diverges permanently the moment anything has. Under FM-19, an
over-certification in bill 4 is absorbed automatically in bill 5 as a smaller (or negative)
movement. Under an incremental formulation it survives to the final account, where it is discovered
under maximum schedule pressure and minimum leverage (§ 1.4.12).

### 7.8.2 Negative net payable

**NEG-1** — `Net < 0` is a **legitimate and important outcome**: the contractor owes the enterprise.

**NEG-2** — A negative net MUST NOT be floored at zero, hidden, or deferred. It is presented as a
negative figure, posted to the Contractor Account as a receivable, and recovered from the next
payment or by demand.

**NEG-3** — A negative net MUST NOT be netted against a *different* engagement instrument or a
different contractor without an explicit, attributed, recorded set-off decision. Silent cross-contract
netting destroys per-contract traceability (CP-7) and is prohibited.

## 7.9 Wage computation — labour path

> **FM-20 — Payable day count.**
> `D_payable = D_full + (0.5 × D_half) + D_idle_payable + D_holiday_payable`
> counted **only** from attendance records in state `VALIDATED` or `LOCKED` (§ 6.4.2).

> **FM-21 — Basic wage.**
> `W_basic = round₂( D_payable × rate_wage(worker trade, grade, region, t) )`

> **FM-22 — Overtime.**
> `W_ot = round₂( H_ot × rate_hourly(t) × m_ot(t) )`
> where `m_ot(t)` is the statutory or contractual overtime multiplier in force at `t`, whichever is
> **higher** (CP-9), and `H_ot` counts only **authorised** overtime hours.

**OT-1** — Unauthorised overtime is not payable **and is a control failure to be recorded**, not
simply discarded. A worker who worked hours the enterprise did not authorise has still worked them;
the resolution is an attributed exception (LC-12), never silent non-payment (PA-8).

> **FM-23 — Piece-rate / output-based wage.**
> `W_piece = round₂( Q_output_verified × rate_piece(t) )`
> where `Q_output_verified` is a **measured** quantity under Part 8 — piece-rate does not escape
> LAW-1; it merely uses the measurement to price labour rather than contract work.

> **FM-24 — Gross wage.**
> `W_gross = W_basic + W_ot + W_piece + W_allowance + W_bonus`

> **FM-25 — The statutory minimum test (a gate, not an adjustment).**
> `W_effective_daily = W_gross ÷ D_payable`
> **MUST satisfy** `W_effective_daily ≥ minimum_wage(trade, grade, region, t)`

**MW-1** — Failure is a **hard stop on settlement**, not a warning and not an automatic top-up
computed silently. The shortfall MUST be resolved by correcting the rate, which is an attributed act
with a recorded reason, because a silent top-up conceals the fact that the enterprise (or its
supplier) attempted to pay below the statutory floor.

**MW-2** — The test applies to the **worker's effective receipt**, including where wages are
intermediated. A supplier paid a compliant rate who pays the worker less has created a
principal-employer exposure for the enterprise (§ 4.4). **The test is therefore performed against the
worker's Wage Card, not against the supplier's invoice.**

**MW-3** — Deductions may not be used to breach the floor: the minimum-wage test is applied to gross
wage before deductions **and** the lawful-deduction limit is applied separately (FM-27).

> **FM-26 — Worker recoveries.**
> `Rec_worker = Σ ( advance instalments due + issued-value recovery + authorised deductions )`

> **FM-27 — The lawful deduction ceiling.**
> `Rec_worker ≤ W_gross × p_max_deduction(t)` — the statutory maximum proportion of wages deductible
> in a period. Excess **carries forward**; it is never deducted in breach of the ceiling.

> **FM-28 — Net wage.**
> `W_net = round₂( W_gross − Ded_statutory − Rec_worker )`, with RND-5 resolving ambiguity in the
> worker's favour.

> **FM-29 — Gang-to-worker allocation** (where a gang is engaged at a gang rate).
> `W_worker = round₂( W_gang_total × ( d_worker ÷ Σ d_all_workers ) )`
> allocated by **validated worker-days**, with any residual rupee from rounding allocated to the
> worker with the greatest `d_worker` (deterministic under RND-8).

**GA-1** — Gang-level payment **never** substitutes for individual allocation (LR-2). The allocation
above MUST be performed and recorded on each Wage Card even where physical disbursement is
intermediated.

> **FM-30 — Borrowed labour transfer value.**
> `V_transfer = round₂( Σ d_borrowed × rate_transfer(t) )`
> posted as a credit to the lending project and a debit to the borrowing project (OBJ-22).

**BL-1** — Transfer value MUST reconcile to the **same** validated attendance days that generated the
worker's wage. Two projects claiming the same worker-day is leakage form L2 and is prevented
structurally by LI-16, not detected by reconciliation.

## 7.10 Productivity and cost intelligence

> **FM-31 — Labour productivity.**
> `P = Q_output_measured ÷ E_effort_consumed` (output units per worker-day)

> **FM-32 — Unit labour cost.**
> `C_unit = round₂( W_total_attributable ÷ Q_output_measured )`

> **FM-33 — Productivity variance against norm.**
> `Δ = ( P_actual − P_norm ) ÷ P_norm`

**PD-1** — Productivity figures are **analytical, never financial**. They MUST NOT adjust
entitlement. A contractor is paid for measured work at contracted rates whether their productivity
was good or poor; productivity informs future award (integration O-4), forecasting, and investigation — and a
sudden favourable productivity shift is a **leakage signal** (over-measurement, L3), not a success.

## 7.11 Contractor account and exposure

> **FM-34 — Contractor exposure** (the enterprise's money at risk with this contractor, now).
> `Exposure = Adv_outstanding + Issued_value_unrecovered + Overpayment_receivable − Ret_held − Dues_payable`

> **FM-35 — Net position.**
> `Position = Dues_payable_to_contractor − Total_recoverable_from_contractor`

**EX-1** — Exposure is computed **per engagement instrument** and rolled up per contractor. The
roll-up is a view; the instrument-level figure is authoritative (CP-7).

**EX-2** — Retention **reduces** exposure (it is enterprise-held security) but remains a liability
(LAW-10). These two statements are simultaneously true and MUST both be visible: an implementation
that shows only one of them misrepresents the position in one direction or the other.

## 7.12 Reconciliation identities

> **These identities MUST hold at every period close (PG-3), and at every point in between. A
> violated identity is not a report to investigate later; it is a control failure that MUST raise an
> exception immediately (CP-11).**

| # | Identity | Detects |
|---|---|---|
| **RI-1** | `V_certified_cum = Σ round₂(Qᵢ × Rᵢ) + V_esc_cum + V_variation_cum` | L3 — value not traceable to measurement |
| **RI-2** | `V_certified_cum ≤ V_sanctioned + V_variation_sanctioned` | Ceiling breach (LAW-9) |
| **RI-3** | `Adv_issued = Adv_recovered + Adv_outstanding + Adv_written_off` | L5 — advance leakage |
| **RI-4** | `Issued_value = Recovered + Outstanding + Returned + Written_off` | L5 — issued-value leakage |
| **RI-5** | `Ret_accrued = Ret_held + Ret_released + Ret_forfeited` | L6 — retention leakage |
| **RI-6** | `V_paid_cum = Σ confirmed disbursements against this instrument` | L2 — duplicate payment |
| **RI-7** | `Σ worker-days paid across settlements in the period = Σ attendance records VALIDATED or LOCKED for that period`, residual investigated in **both** directions (WKS-03) | L1/L2 — phantom or duplicate labour; unsettled worker entitlement |
| **RI-8** | `Σ Wage Card net = Σ labour disbursement confirmed` | L1 — intermediation leakage |
| **RI-9** | `Ded_deducted = Ded_deposited` (reconciled with CAP-TAX) | Statutory exposure |
| **RI-10** | `LD_accrued = LD_levied + LD_waived` | **L6 — the invisible one** |
| **RI-11** | `Σ borrowed-labour debits = Σ borrowed-labour credits`, enterprise-wide | L2 — cross-project duplication |
| **RI-12** | Every `VERIFIED` measurement is `BILLED` or explicitly carried forward with a reason | Contractor detriment; hidden liability |

**RI-0 — The meta-identity.** Every identity above MUST be **computable on demand for any date**, not
only at period close. An identity that can only be evaluated after the fact detects leakage after
the leverage has gone (LA-7).

## 7.13 Worked example — a running bill

*Illustrative only; the formulae, not the numbers, are normative.*

**Given.** Sanctioned value ₹1,00,00,000. Sanctioned variation ₹5,00,000. Retention 5%, capped at
₹4,00,000. Mobilisation advance ₹10,00,000, recovery at 20% of period certified value. Materials
issued and unrecovered ₹3,50,000. Statutory deduction 2% of certified value. Previous cumulative
certified ₹60,00,000; previously paid ₹51,00,000; retention held ₹3,00,000; advance outstanding
₹6,00,000.

**This bill.** Verified measurement adds ₹15,00,000 of gross value. No escalation.

| Step | Computation | Result (₹) |
|---|---|---|
| 3 | `V_gross_cum` = 60,00,000 + 15,00,000 | 75,00,000 |
| 5 | `V_certified_cum` = 75,00,000 + 5,00,000 (variation) | 80,00,000 |
| 6 | **Ceiling test**: 80,00,000 ≤ 1,00,00,000 + 5,00,000 | **PASS** |
| 7 | `V_certified_period` = 80,00,000 − 60,00,000 | 20,00,000 |
| 8 | `Ret_cum` = min(80,00,000 × 5%, 4,00,000) = min(4,00,000, 4,00,000) | 4,00,000 *(cap now binds)* |
| 9 | `Rec_adv` = min(20,00,000 × 20%, 6,00,000) = min(4,00,000, 6,00,000) | 4,00,000 |
| 9 | `Rec_issue` (materials outstanding) | 3,50,000 |
| 9 | `Rec_cum` = previously recovered 4,00,000 + 4,00,000 + 3,50,000 | 11,50,000 |
| 11 | `Ded_cum` = 80,00,000 × 2% | 1,60,000 |
| 12 | `Net` = 80,00,000 − 51,00,000 − 4,00,000 − 11,50,000 − 1,60,000 | **11,90,000** |
| 13 | Non-negative test | **PASS** |

**Note the cap behaviour.** Retention accrued only ₹1,00,000 this period (4,00,000 − 3,00,000)
because the cap bound mid-bill. An implementation that applied 5% to the period value
(₹1,00,000 — coincidentally identical here) would diverge the moment the cap binds partway, which is
exactly why FM-15 is stated cumulatively.

## 7.14 Determinism and prohibited computations

**DT-1 — Same inputs, same output, always.** Two evaluations of the same bill from the same evidence
MUST produce byte-identical results (RND-8, SC-10).

**DT-2 — No hidden inputs.** Every input to every formula is an attribute of a named object or a
value consumed across a declared integration point. **A computation that depends on the current
date, the current user, or a system default has a hidden input and is non-conformant** — except
where the current date is itself the subject of the computation (e.g. LD delay periods), in which
case it is recorded as an input on the record.

**DT-3 — Prohibited computations.** The following MUST be structurally impossible:

| # | Prohibited | Why |
|---|---|---|
| **PC-1** | Valuing an unverified measurement | LAW-1 |
| **PC-2** | Valuing at a rate not in force at the work date | DP-12, RR-1 |
| **PC-3** | Deriving a rate by interpolation, analogy, or "similar item" | LA-2, RR-1 |
| **PC-4** | Computing a bill incrementally rather than cumulatively | LAW-6 |
| **PC-5** | Flooring a negative net at zero | NEG-2 |
| **PC-6** | Netting across engagement instruments or contractors without a recorded set-off | CP-7, NEG-3 |
| **PC-7** | Applying a percentage to an already-rounded base | RND-7 |
| **PC-8** | Reordering the recovery waterfall | FM-13 |
| **PC-9** | Deducting beyond the lawful wage-deduction ceiling | FM-27, CP-9 |
| **PC-10** | Silently topping up a below-minimum wage | MW-1 |
| **PC-11** | Adjusting entitlement by productivity | PD-1 |
| **PC-12** | Estimating an unpublished escalation index | ESC-1 |
| **PC-13** | Splitting a payment to stay within a delegated limit | XCP-16, SD-1 |
| **PC-14** | Recomputing a WFC figure downstream and substituting the result | II-2 |

**DT-4 — Every formula declares its own failure** (DP-11, CP-11). Where an input is missing — an
index unpublished, a statutory rate not received, a rate version absent at the work date — the
computation **fails closed** (DP-3) and the bill waits. It MUST NOT proceed with the missing
component treated as zero, because a missing recovery treated as zero is leakage form L5 arriving
through the arithmetic rather than through the process.

---

# PART 8 — MEASUREMENT ENGINE

## 8.1 Purpose

> **Measurement is the origin of every rupee on the contract path. Part 7 is arithmetic; this Part
> governs the numbers the arithmetic consumes. An error here is not detectable downstream — it
> propagates through a correct computation into a correct-looking payment.**

§ 1.4.2 states the underlying difficulty: the unit of construction work does not exist until a human
measures it, and two competent humans may differ. **Ambiguity is the raw material of overpayment**
(LA-1), and this Part exists to remove as much of it as the physical world permits, and to make the
remainder visible, attributed, and checkable.

## 8.2 Measurement principles

**MP-1 — Measurement records reality, never intention.** Only executed work is measurable (LAW-3).
Programmed, promised, ordered, delivered-to-site, and about-to-be-completed work are all
unmeasurable, however certain their completion.

**MP-2 — Measurement occurs at the work, at the time.** Measurement performed in an office from a
drawing is a *calculation*, not a measurement, and MUST be labelled as such (DP-5). Where computed
quantities are contractually permitted, they are a distinct measurement mode (§ 8.4) with distinct
evidence requirements.

**MP-3 — One method, declared in advance.** The standard method of measurement is bound at
engagement (E-7). Deductions, roundings, and inclusions follow that method and no other. Two methods
in one contract is an ambiguity that will be resolved in the claimant's favour every time.

**MP-4 — The measurer is named and permanently accountable** (§ 4.6). Accountability does not expire
with the project, the personnel change, or the defect liability period.

**MP-5 — Measurement is checked by someone who did not measure** (SOD-1, CP-2). The check is a
distinct act with its own record — never a countersignature on the same act.

**MP-6 — Evidence accompanies the measurement, created at the same moment** (CP-1). Evidence
assembled later, to support a measurement already recorded, is testimony.

**MP-7 — Location granularity determines re-measurability.** A quantity recorded without a location
precise enough to re-measure is unverifiable and therefore not billable. "Ground floor" is not a
location; "Grid B3–B5, plinth to sill, north face" is.

**MP-8 — Classification is part of measurement.** Recording the right quantity against the wrong
item is leakage forms L3 and L7 simultaneously, and it is silent (§ 1.4.11).

**MP-9 — Quality precedes quantity.** Work not accepted by CAP-QLT is not measured (LI-07).

**MP-10 — Measurement is never negotiated.** A quantity that two parties agreed is not a
measurement; it is a settlement. Where genuine dispute exists, § 8.15 governs.

**MP-11 — Net measurement, unless the method says otherwise.** Deductions for openings, voids, and
overlaps are applied per MP-3's declared method. **An undeclared deduction rule is decided before
the first measurement, never at the first dispute.**

**MP-12 — A measurement is a permanent record from the moment it is recorded** (LAW-11). Correction
is supersession; the original stays visible forever, including a cancelled one.

## 8.3 The Measurement Book

The Measurement Book (OBJ-11) is the enterprise's **primary evidentiary record of physical
execution**. Its integrity properties are constitutional, not clerical.

| # | Property | Requirement |
|---|---|---|
| **MB-1** | Custody | Issued to a named officer, on a recorded date, and returned. An MB in unrecorded custody has no evidentiary weight |
| **MB-2** | Sequence | Entries are sequential and gap-free. **A gap is a control event** requiring explanation |
| **MB-3** | Indelibility | No erasure, no obliteration, no removal. Corrections are struck through, initialled, dated, and superseded — **the original remains legible** |
| **MB-4** | Attribution | Every entry names its measurer and the date of measurement, distinct from the date of the work |
| **MB-5** | Completeness | Every entry carries item, location, dimensions, computation, quantity, and unit — a bare total is not a measurement |
| **MB-6** | Continuity | Cumulative quantities carry forward with a visible reference to the prior entry (LAW-6) |
| **MB-7** | Closure | An MB is closed formally; a closed MB accepts no further entry |
| **MB-8** | Retention | Retained for the statutory period and the limitation period, whichever is longer (§ 3.4.4) |

**MB-9 — Digital equivalence.** Where the MB is digital, it MUST satisfy MB-1…MB-8 **at least as
strictly** as paper: an append-only record, attributed, sequenced, with superseded entries
permanently visible. **A digital MB that permits silent edit is weaker than a paper one and is
non-conformant** — the physical difficulty of erasing ink is a control, and its digital replacement
must be at least as hard to defeat (DP-6).

## 8.4 Measurement modes and unit governance

| Mode | Unit class | Typical basis | Evidence weight |
|---|---|---|---|
| **Linear** | m, running metre | Direct site measurement | High |
| **Area** | m² | Direct measurement; computed from dimensions | High |
| **Volume** | m³ | Dimensions × depth; levels for earthwork | High, with levels |
| **Number** | nos. | Direct count | High, with location |
| **Weight** | kg, MT | Weighbridge, bar-bending schedule, test certificate | High only with an independent weight record |
| **Time** | hour, day, shift | Attendance / plant log | Medium — corroboration required |
| **Lump sum** | LS | Stage completion (FM-04) | Depends entirely on stage definition |
| **Computed** | any | Derived from drawing + verified as-built | **Lowest** — MUST be marked as computed |

**UG-1** — The unit is a property of the **rate schedule item**, not of the measurement. A measurer
may not select a unit (U-1).

**UG-2** — Weight measured by theoretical conversion (e.g. bar length × unit weight) is a **computed**
measurement and MUST be reconciled against actual receipt and consumption (§ 8.13).

**UG-3** — Time-based measurement (day work, plant hire) is the weakest contractual basis and MUST be
bounded: authorised in advance, capped, and reconciled to output. **Unbounded day work is a
standing invitation to leakage form L1.**

## 8.5 Method of measurement

**MM-1** — The instrument names a **standard method of measurement**. Where none is named, the
enterprise's default standard applies and MUST be recorded in the instrument before it becomes
`ACTIVE` (E-7). **Silence is not an option**; silence is resolved by dispute, and dispute is
resolved by the party with the better record.

**MM-2 — The deduction rules are part of the method**: openings, voids, embedded members, overlaps,
laps, wastage, and the thresholds below which deductions are not made. These MUST be explicit.

**MM-3 — Measurement follows the item description, not the physical convenience.** Where the item
says "excluding openings exceeding 0.5 m²", that is the rule, whatever is easier to measure.

**MM-4 — Ambiguity is resolved before measurement, not after.** An item description that admits two
readings is escalated to CAP-SCM/CAP-DES for clarification **before** work is measured under it. A
measurement recorded under an ambiguous description is a dispute already in progress (LA-2).

**MM-5 — Rounding of dimensions follows the method** and is applied consistently in both directions.
Systematic favourable rounding is leakage form **L7** and is invisible per transaction — it MUST be
detectable by pattern analysis (§ 8.14).

## 8.6 The measurement event

Every measurement entry MUST record, at the moment of measurement:

| # | Field | Why it is mandatory |
|---|---|---|
| **ME-1** | Rate schedule item and version | Classification is part of measurement (MP-8) |
| **ME-2** | Description of work **as executed** | Divergence from the item description is the classification check |
| **ME-3** | Location, to re-measurable granularity | MP-7 |
| **ME-4** | Dimensions as taken, and the computation from them | The quantity must be reproducible, not asserted (CP-7) |
| **ME-5** | Quantity and unit | The billable fact |
| **ME-6** | Date of execution (`t`) and date of measurement | Rate resolution uses `t` (FM-00), determined by **RR-4** where execution spans a rate change; the gap between the two dates is itself a signal |
| **ME-7** | Measurer identity | MP-4 |
| **ME-8** | Evidence artefact references | MP-6 |
| **ME-9** | Quality acceptance reference | MP-9 |
| **ME-10** | Cumulative position for the item | LAW-6 continuity |
| **ME-11** | Whether the measurement is direct, joint, or computed | Determines evidential weight (Part 11) |

**ME-12** — A measurement missing any of ME-1…ME-11 is `RECORDED` but MUST NOT reach `VERIFIED`. It
is returned to the measurer — it is not completed by the checker, because a checker who fills in the
measurer's record has become the measurer (SOD-1).

## 8.7 Joint measurement

**JM-1** — Joint measurement is measurement taken in the presence of the contractor and recorded as
such. It **binds both parties to the dimensions**, and it is the single most effective dispute
suppressant available (objective O-10, CP-10).

**JM-2** — Joint measurement is **mandatory** for: work that will become concealed; earthwork before
backfilling; any item where re-measurement will be impossible later; and the final bill (LC-11).

**JM-3** — A contractor's refusal or failure to attend, after recorded notice, does not block
measurement. The measurement proceeds, is recorded as **"taken in absence after notice"**, and the
notice becomes part of the evidence. **The enterprise never loses its ability to measure by the
counterparty's non-attendance.**

**JM-4** — Joint measurement is **not** verification (SOD-6). The contractor is a counterparty, not an
independent verifier; the check measurement (§ 8.8) is still required.

## 8.8 Check measurement and test check

**CK-1 — Every measurement is subject to check.** The check may be a test check of a sample or a full
re-measurement, but **no measurement reaches `VERIFIED` without a check having been applied to it or
to the sample that governs it.**

**CK-2 — The check percentage is declared in advance**, by value band, and is bound at engagement.
A representative structure (illustrative, not normative):

| Value band of the measurement | Minimum check | Checker level |
|---|---|---|
| Low | Sample-based test check | Check Measurement Officer |
| Medium | Increased sample; all high-value items | Check Measurement Officer |
| High | 100% re-measurement of high-value items | Senior / independent officer |
| Concealed work of any value | **100%, before concealment** | Check Measurement Officer |
| Final bill | **100%** | Independent of the project |

**CK-3 — The sample is selected by the checker, not offered by the measurer.** A sample chosen by the
measured party is not a sample (DP-6).

**CK-4 — Sample selection MUST be risk-weighted, not random alone**: highest-value items, items with
the largest period movement, items with unusual productivity implications, items measured close to a
bill date, and items previously reduced.

**CK-5 — A failed check invalidates the population, not just the sample.** Where a test check finds a
material discrepancy, the check escalates to 100% re-measurement of that item across the period, and
the measurer's other current measurements are reviewed. **A discrepancy found in a sample is
evidence about the population, and treating it as an isolated correction defeats the purpose of
sampling.**

**CK-6 — The check records its own extent** (CP-11, DP-11): what was checked, what was not, the
percentage applied, and the result — including "checked, no discrepancy". **A check that leaves no
record did not happen.**

**CK-7 — Reduced-independence checks are exceptions, not accommodations** (§ 4.14.1). Where the
checker cannot be fully independent, the reduced independence is recorded under LAW-12 and counted.

## 8.9 Part-rate and incomplete work

**PT-1** — Part rates exist because construction items complete in stages and contractors are thinly
capitalised (§ 1.4.5). They are legitimate — and they are leakage form **L4 (premature)** whenever
the stage fraction is not contractually defined.

**PT-2** — The stage schedule (`f_part`, FM-03) is bound at engagement or by sanctioned variation.
**It is never set at bill time**, by anyone, for any reason.

**PT-3** — Part-rate measurement MUST record the **stage reached**, not merely the fraction claimed,
with evidence appropriate to that stage.

**PT-4** — On completion, the item is measured in full and the previously certified part value is
deducted (PR-2). The part measurement is `SUPERSEDED`, not consumed twice.

## 8.10 Non-scheduled items and star rates

**SR-1** — Work with no rate in force at `t` (RR-1) is a non-scheduled item. It MUST NOT be measured
against an approximate or analogous item — that is PC-3 and it is how rate leakage (L7) enters.

**SR-2 — Star rate derivation** follows the instrument's stated method, in this order of preference:
(a) derived from the contracted rate of a comparable item by a documented adjustment;
(b) built up from first principles — material, labour, plant, overhead, profit — at rates evidenced
from the market at `t`;
(c) negotiated, which is the **least preferred** and requires the highest approval.

**SR-3** — A star rate is **approved before the work is billed and, wherever possible, before it is
executed.** A rate derived after execution is derived under duress: the work exists, the contractor
is owed something, and the enterprise's leverage has already gone (LA-7).

**SR-4** — Every star rate is recorded as a new Rate Schedule Item version with its own authority,
effective date, and derivation record — never as a one-off number on a bill (CP-4, CP-7).

## 8.11 Revision, cancellation, and supersession

**RV-1** — A measurement found to be wrong is **superseded** by a revision that references it and
states the reason. Both remain permanently visible (LAW-11, MP-12).

**RV-2** — A measurement may be `CANCELLED` only **before** it is billed, by the measurer or the
checker, with a recorded reason. After billing, the correction route is a revision that flows
through the running account (LAW-6) — the cumulative principle absorbs it at the next bill.

**RV-3** — Revision **downward** after payment creates a receivable (NEG-1/NEG-2) and is recovered in
the ordinary way. It is not "adjusted quietly" in a later measurement, which would destroy the
traceability of both.

**RV-4** — The **revision rate** — how often a measurer's entries are revised, and by how much — is a
control-health metric (R-13) and a leading indicator of both incompetence and collusion.

## 8.12 Evidence artefacts

| Artefact | Establishes | Weight |
|---|---|---|
| Level record / survey | Volume, depth, formation | Very high — independently re-derivable |
| Dimension sheet with witness | Linear, area, volume | High |
| Photograph, geotagged and timestamped | Existence, stage, location | High for existence; low for quantity |
| Pour card / batching record | Concrete volume placed | Very high — independent of the measurer |
| Test certificate | Acceptance (CAP-QLT input) | Precondition, not quantity |
| Weighbridge slip | Weight received | High, if independent |
| Bar-bending schedule | Computed steel weight | Medium — computed, requires § 8.13 |
| Joint measurement signature | Agreement on dimensions | High for dispute suppression |
| Contractor's claim | **Nothing** | **Not evidence** (§ 4.3) |

**EV-1** — Evidence created by an **independent process** (batching plant, weighbridge, survey
instrument, laboratory) outranks evidence created by an interested party, always.

**EV-2** — Evidence is attached to the measurement at the moment of measurement (MP-6). Evidence
attached later is admissible but MUST be recorded as later-attached, with the gap visible.

**EV-3** — **Absence of evidence is not neutral.** A measurement that should have carried an artefact
and does not is a deficient measurement, not an ordinary one (DP-9).

## 8.13 Reconciliation of measured work

Measurement is verified not only by re-measurement but by **reconciliation against independent
facts.** These reconciliations catch what a re-measurement cannot, because they compare the
measurement to a different universe of records.

| # | Reconciliation | Detects |
|---|---|---|
| **MR-1** | Measured quantity vs drawing/BOQ quantity, item by item | Over-measurement; scope creep without variation (L3, L7) |
| **MR-2** | Theoretical material consumption vs actual issue (cement, steel, bitumen) | Phantom work; wastage abuse; issued-value leakage (L1, L5) |
| **MR-3** | Measured concrete vs batching plant / pour records | L1, L3 |
| **MR-4** | Measured steel vs bar-bending schedule vs weighbridge receipt | L3, L7 |
| **MR-5** | Measured earthwork vs level records vs haulage records | L1, L3 |
| **MR-6** | Measured output vs labour deployed (productivity, FM-31) | **Both directions** — impossible productivity signals over-measurement; collapsed productivity signals ghost labour |
| **MR-7** | Cumulative measured vs contract ceiling utilisation curve | Early exhaustion of the ceiling; front-loading (L4) |
| **MR-8** | Measurement dates vs bill dates | Measurement clustered immediately before bills — a fabrication signal |

**MR-9** — A reconciliation variance beyond a declared tolerance MUST **block** the bill, not annotate
it (DP-3, G-1). The tolerance is declared in advance and is itself a governed parameter.

## 8.14 Anti-fraud controls in measurement

Designed against the adversarial insider (DP-6), not against carelessness.

| # | Control | Targets |
|---|---|---|
| **AF-1** | Enterprise-wide uniqueness of measurement entry identity; consumed entries cannot be re-billed | L2 |
| **AF-2** | Future-dated measurement structurally impossible | L1, LAW-3 |
| **AF-3** | Measurement recorded after concealment without prior joint measurement is rejected | L1, L3 |
| **AF-4** | Pattern analysis of rounding direction by measurer | **L7 — the silent one** |
| **AF-5** | Pattern analysis of quantities clustering just below a check threshold or a delegation limit | XCP-16 (circumvention) |
| **AF-6** | Item-classification drift analysis: quantity migrating toward higher-rate items over time | L3, L7 |
| **AF-7** | Measurer/checker pairing analysis — the same pair recurring on high-value work | Collusion |
| **AF-8** | Measurement-to-bill interval analysis (MR-8) | Fabrication |
| **AF-9** | Revision-rate monitoring by measurer (RV-4) | Competence and collusion |
| **AF-10** | Reconciliation exceptions (MR-1…MR-8) escalated, never merely logged | All |

**AF-11 — Detection outputs are routed to Internal Audit, not to the project** (SOD-5). A detection
report sent only to the actor whose work it monitors is not a control.

## 8.15 Measurement disputes

**MD-1** — A contractor may dispute a measurement. The disputed entry moves to `DISPUTED` and is
**not billable** while disputed (§ 5.13). Undisputed entries in the same bill proceed — **a dispute
on one item never holds the contractor's whole payment hostage**, because that pressure is precisely
what produces § 1.4.8.

**MD-2** — Dispute resolution is by **joint re-measurement** wherever the work is still measurable.
Where it is not — concealed, consumed, demolished — the enterprise's contemporaneous record governs,
which is why JM-2 makes joint measurement mandatory for work that will become concealed.

**MD-3** — A resolved dispute produces a **new measurement**, not an edit to the old one (LAW-11).

**MD-4** — An unresolved dispute escalates on a defined clock. It MUST NOT remain open indefinitely:
an aged unresolved dispute is a hidden liability of unknown size, and it converts at final account
into exactly the negotiation LI-26 prohibits.

## 8.16 Measurement invariants

| # | Invariant |
|---|---|
| **MI-1** | No measurement without executed work (LAW-3) |
| **MI-2** | No verification by the measurer (SOD-1) |
| **MI-3** | No increase by the verifier (LI-06) |
| **MI-4** | No quantity without a re-measurable location (MP-7) |
| **MI-5** | No measurement without its item classification and version (ME-1) |
| **MI-6** | No billing of an unverified entry (LAW-1, G-1) |
| **MI-7** | No entry consumed by two bills (LM-6, AF-1) |
| **MI-8** | No rate derived by analogy (PC-3, SR-1) |
| **MI-9** | No part rate set at bill time (PT-2) |
| **MI-10** | No edit — only supersession (LAW-11, MB-3) |
| **MI-11** | No concealed work billed without prior joint measurement (JM-2, AF-3) |
| **MI-12** | No check without a record of its extent (CK-6) |

---

# PART 9 — BUSINESS RULES

## 9.1 Status and authority of this Part

Part 9 is **third in the order of constitutional authority** (§ How to read this document): below the
Immutable Laws and the Constitutional Principles, above every other part of this document.

A **Business Rule** is a binding statement about how the enterprise behaves. It differs from an
Immutable Law in exactly one respect: **a Law admits no exception whatever; a Rule may admit a
defined, attributed, counted exception.** Every rule below therefore carries an explicit exception
policy, and where that policy reads **"None"**, the rule is operating at Law-equivalent strength and
no authority in the enterprise may relax it.

> **The rule catalogue is not a checklist for implementers. It is the enumerated behaviour of a
> conforming construction enterprise.** An implementation that satisfies every rule has not
> "implemented CAP-WFC-01"; it has become capable of conforming to it. Conformance is demonstrated
> by evidence (Part 11), not by feature presence.

### 9.1.1 Rule specification format

Every rule is specified with the following attributes. Where an attribute is genuinely inapplicable
it reads **"—"**; it is never omitted, because an omitted attribute is an undefined term and by
**LA-2 every undefined term is a leakage site.**

| Attribute | Meaning |
|---|---|
| **Identifier** | Domain prefix + sequence. Permanent; never reused, never renumbered |
| **Statement** | The binding behaviour, in one sentence, in the normative language of § How to read |
| **Rationale** | Why the enterprise requires this. A rule whose rationale cannot be stated is a habit, not a rule |
| **Trigger** | The business event at which the rule is evaluated |
| **Preconditions** | What must already be true for the rule to be evaluable |
| **Mandatory actions** | What MUST happen |
| **Prohibited actions** | What MUST NOT happen |
| **Exception policy** | Who may relax it, on what authority, for how long — or **None** |
| **Laws** | The Immutable Law(s) the rule enforces |
| **Cross-references** | Related rules, objects, lifecycles, formulae, risks |

### 9.1.2 Rule domains

| # | Prefix | Domain | Rules |
|---|---|---|---|
| 1 | **WRK** | Workforce identity and engagement | WRK-01…14 |
| 2 | **CLB** | Company (directly engaged) labour | CLB-01…12 |
| 3 | **CTL** | Contractor labour | CTL-01…14 |
| 4 | **BRL** | Borrowed, supplied and intermediated labour | BRL-01…14 |
| 5 | **GNG** | Gang management | GNG-01…10 |
| 6 | **DEP** | Deployment | DEP-01…11 |
| 7 | **ASG** | Work assignment | ASG-01…11 |
| 8 | **ATT** | Attendance | ATT-01…20 |
| 9 | **LAB** | Statutory labour obligations and welfare | LAB-01…14 |
| 10 | **WGR** | Wage rates | WGR-01…12 |
| 11 | **DWG** | Daily wages | DWG-01…10 |
| 12 | **WKS** | Weekly and periodic settlement | WKS-01…12 |
| 13 | **PCR** | Piece-rate work | PCR-01…10 |
| 14 | **PRD** | Productivity | PRD-01…09 |
| 15 | **MSR** | Measurement | MSR-01…18 |
| 16 | **MBK** | Measurement Book | MBK-01…12 |
| 17 | **RBL** | Running bills | RBL-01…18 |
| 18 | **EVL** | Earned value | EVL-01…10 |
| 19 | **PEL** | Payment eligibility | PEL-01…14 |
| 20 | **ADV** | Advances | ADV-01…14 |
| 21 | **REC** | Recoveries | REC-01…16 |
| 22 | **RET** | Retention | RET-01…12 |
| 23 | **VAR** | Variation orders | VAR-01…12 |
| 24 | **OVR** | Manual overrides | OVR-01…10 |
| 25 | **FIN** | Financial integrity | FIN-01…16 |
| 26 | **EXC** | Exception handling | EXC-01…10 |
| 27 | **SEC** | Security and access | SEC-01…12 |
| 28 | **AUD** | Audit | AUD-01…12 |
| 29 | **CLS** | Contract closure | CLS-01…14 |
| | | **Total** | **373 rules** |

## 9.2 Higher-order governing principles

Before the catalogue: **twenty-four governing principles that consolidate recurring rule patterns.**
Each principle stands in place of the dozens of near-identical rules that would otherwise be needed
in every domain. **Where a specific rule and a governing principle appear to conflict, the specific
rule governs its own domain and the principle governs everywhere else.**

> **Why consolidation matters constitutionally.** A catalogue of five hundred unconnected rules is
> unlearnable, and an unlearnable rule set is obeyed by the system and ignored by the organisation.
> These principles are what a competent officer can hold in their head. **The catalogue is what the
> enterprise proves.**

| # | Governing principle | Consolidates |
|---|---|---|
| **GP-01** | **Nothing financial exists without an authorising instrument in force at the effective date.** Every amount, rate, limit, percentage, and entitlement resolves to an instrument, by date. | ~40 rules across WGR, RBL, ADV, RET, VAR |
| **GP-02** | **Every evidentiary record is created by the party who observed the fact, at the time and place of the fact.** | ATT, MSR, MBK |
| **GP-03** | **Every financial record is created by one party, verified by a second, approved by a third, and executed by a fourth.** No two of these are the same person for the same transaction. | RBL, WKS, PEL, ADV, FIN |
| **GP-04** | **Nothing is consumed twice.** Every evidentiary unit — a worker-day, a measured quantity, an issued item, an approved variation — carries a consumption marker and is structurally unusable once consumed. | ATT, MSR, RBL, BRL |
| **GP-05** | **Every computation is cumulative and self-correcting.** No financial position is derived by accumulating period figures forward. | RBL, EVL, ADV, REC, RET, CLS |
| **GP-06** | **Every amount owed to the enterprise is deducted before value leaves.** Recovery is never pursued after disbursement where it could have been deducted before it. | REC, ADV, RET, PEL, CLS |
| **GP-07** | **Every ceiling is absolute and rises only by formal instrument.** Contract value, delegated limit, retention cap, deduction limit, advance limit — all behave identically. | RBL, VAR, ADV, PEL, SEC |
| **GP-08** | **Every record is append-only.** Correction is supersession; the erroneous record remains permanently visible with its successor. | All domains |
| **GP-09** | **Every control declares its own execution, including its failure to execute.** Silence is never success. | AUD, EXC, FIN |
| **GP-10** | **Every deviation is attributed, time-boxed, counted against its authoriser, and reported by frequency.** | OVR, EXC, AUD |
| **GP-11** | **Every figure is drillable to primary evidence without human explanation.** | FIN, AUD, EVL |
| **GP-12** | **The worker's statutory entitlement outranks every commercial consideration in this capability.** | LAB, DWG, WKS, BRL |
| **GP-13** | **A claim is never evidence.** Any assertion by a party who benefits from it requires independent corroboration before it can support value. | CTL, BRL, RBL, MSR |
| **GP-14** | **Absence is never consent.** No approval, acceptance, validation, or entitlement arises from silence, inaction, or the expiry of a review window. | All domains |
| **GP-15** | **Identity is enterprise-wide and permanent.** Workers, contractors, measurements, bills, and vouchers are unique across the enterprise and across time, never per project or per period. | WRK, ATT, MSR, BRL |
| **GP-16** | **Where a financial control cannot execute, the transaction stops.** Missing data is never treated as zero, nil, or nothing-to-recover. | FIN, REC, PEL |
| **GP-17** | **Rates, limits, statutes, and authorities are time-versioned and resolve by the effective date of the work**, never by the date of computation, approval, or payment. | WGR, MSR, RBL, SEC, LAB |
| **GP-18** | **Splitting to evade a threshold is the same offence as breaching it.** Bills, vouchers, advances, and measurements are tested against cumulative position, not instance size. | PEL, SEC, ADV, RBL |
| **GP-19** | **The counterparty may see the derivation of their own entitlement.** | CTL, BRL, RBL, LAB |
| **GP-20** | **Every open obligation ages, and age escalates automatically.** Nothing sits unresolved indefinitely: disputes, recoveries, deferrals, unbilled measurements, unsettled attendance. | REC, MSR, EXC, CLS |
| **GP-21** | **The enterprise measures its own controls.** Every rule in this Part has a detection mechanism, and the rate at which each fires is reported to accountable officers. | AUD, FIN, PRD |
| **GP-22** | **Concealment is the trigger for maximum verification.** Any work, quantity, or fact that will become unverifiable is verified at maximum strength before it becomes so. | MSR, MBK, AUD |
| **GP-23** | **Two independent records of the same fact must reconcile, and the reconciliation is a control, not a report.** | FIN, PRD, REC, AUD |
| **GP-24** | **No actor may occupy a position from which they can both cause a loss and conceal it.** This is separation of duties stated as its purpose rather than as a list. | SEC, AUD, OVR, FIN |

---

## 9.3 Domain WRK — Workforce identity and engagement

> *Establishes who exists, who may be paid, and under what authority. Every phantom-labour scenario
> in Part 10 begins with a failure in this domain.*

**WRK-01 — An unidentified person MUST NOT be paid.**
- **Rationale.** Payment to an unidentified person is indistinguishable from payment to no person, which is leakage form L1 in its purest form and undetectable in principle (§ 2.3 D-13).
- **Trigger.** Any wage settlement or labour payment.
- **Preconditions.** A Worker record (OBJ-01) in state `REGISTERED` or later.
- **Mandatory.** Establish and record a durable identity before any attendance may be validated.
- **Prohibited.** Payment against a name, a headcount, or a gang total without underlying identities.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5. **Cross-refs.** § 5.2, LI-16, GP-15, RSK-01.

**WRK-02 — Worker identity MUST be unique across the entire enterprise and permanent across time.**
- **Rationale.** Per-project or per-contractor identity makes one human being into several records, and duplicate attendance becomes structurally invisible (§ 5.2).
- **Trigger.** Worker registration; re-engagement after a gap; transfer between contractors or projects.
- **Preconditions.** A single enterprise-wide identity register exists.
- **Mandatory.** Search the enterprise register before creating any new worker identity; re-use the existing identity on re-engagement.
- **Prohibited.** Creating a second identity for a person already registered; deriving identity from the contractor.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5. **Cross-refs.** WRK-03, ATT-06, BRL-04, GP-15, XCP-02.

**WRK-03 — Where documentary identity is unavailable, an alternative durable identity MUST be established.**
- **Rationale.** Much of the construction workforce is genuinely undocumented (§ 1.4.3). Refusing to record such workers does not remove them from site; it removes them from control while they continue to be paid.
- **Trigger.** Registration of a worker who cannot produce documentary identity.
- **Preconditions.** A defined alternative-identity method (biometric or photographic with supervisor attestation).
- **Mandatory.** Capture the alternative identity; record the attesting supervisor; record the reason documentary identity was unavailable.
- **Prohibited.** Treating undocumented status as a bar to registration; paying an undocumented worker without alternative identity.
- **Exception policy.** **None** — the method may vary; the requirement may not.
- **Laws.** LAW-2, LAW-5. **Cross-refs.** § 5.2, LAB-03, RSK-02.

**WRK-04 — A worker record MUST NOT be deleted, at any time, for any reason.**
- **Rationale.** A worker found to be fictitious is the single most valuable record in an investigation; deleting it destroys the evidence of the leakage it caused.
- **Trigger.** Discovery of a fictitious, duplicate, or erroneous worker record.
- **Preconditions.** —
- **Mandatory.** Mark the record with its finding; retain every record referencing it; raise an exception (LC-12).
- **Prohibited.** Deletion; merge that discards history; anonymisation that breaks the reference chain.
- **Exception policy.** **None.** Statutory erasure obligations, where they exist, are satisfied by restricting access, never by destroying the financial chain.
- **Laws.** LAW-11. **Cross-refs.** GP-08, AUD-09, SEC-11.

**WRK-05 — Every worker MUST be classified by trade and skill grade, and the classification MUST be evidenced.**
- **Rationale.** Trade and grade determine the wage rate and the statutory minimum. An unclassified or over-classified worker is a permanent, silent rate leakage (L7).
- **Trigger.** Registration; change of trade or grade.
- **Preconditions.** An enterprise trade-and-grade schedule with effective dates.
- **Mandatory.** Record the classification, its evidence (skill test, experience attestation, certification), and its effective date.
- **Prohibited.** Grade assigned by the Mate or by the worker's own assertion alone; retrospective upgrade applied to already-settled periods.
- **Exception policy.** Provisional classification for up to one settlement period, recorded, then confirmed or corrected.
- **Laws.** LAW-5. **Cross-refs.** WGR-02, LAB-06, RSK-31.

**WRK-06 — Engagement type MUST be recorded for every worker and MUST be current.**
- **Rationale.** Direct, contractor, supplier, and borrowed engagement carry different payment paths, different statutory exposures, and different control requirements. An unknown engagement type means an unknown control set.
- **Trigger.** Engagement; transfer; change of intermediary.
- **Preconditions.** WRK-01, WRK-02.
- **Mandatory.** Record engagement type with effective dates; close the prior engagement on the same date the new one opens.
- **Prohibited.** Overlapping open engagements for one worker; retrospective change of engagement type over a settled period.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** BRL-02, DEP-04, GP-15.

**WRK-07 — A worker MUST NOT be engaged under two intermediaries simultaneously.**
- **Rationale.** Dual intermediation is the mechanism by which one person's attendance is billed twice by two suppliers who never meet (L2).
- **Trigger.** Engagement or supply of a worker already engaged.
- **Preconditions.** Enterprise-wide identity (WRK-02).
- **Mandatory.** Reject the second engagement; raise an exception naming both intermediaries.
- **Prohibited.** Warning-only treatment; resolution by allowing both and reconciling later.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-4. **Cross-refs.** BRL-05, ATT-06, LI-16, XCP-02.

**WRK-08 — A blacklisted worker MUST NOT be engaged, deployed, or paid other than for established arrears.**
- **Rationale.** Blacklisting that does not bind at deployment is a record-keeping gesture.
- **Trigger.** Deployment; attendance validation; settlement.
- **Preconditions.** A blacklisting decision with recorded cause and authority.
- **Mandatory.** Block engagement enterprise-wide; permit settlement of arrears already earned.
- **Prohibited.** Withholding wages already earned as a punitive measure — that is a statutory matter, not a control matter.
- **Exception policy.** Revocation of blacklisting by the authority above the one that imposed it, recorded.
- **Laws.** LAW-2, LAW-8 context. **Cross-refs.** LAB-11, SEC-08.

**WRK-09 — Contractor registration MUST establish legal identity, statutory registration, and banking identity before any engagement instrument becomes ACTIVE.**
- **Rationale.** The enterprise's principal-employer exposure (§ 4.4) attaches whether or not it verified the counterparty. Verification after award is verification without leverage.
- **Trigger.** Contractor empanelment; first engagement.
- **Preconditions.** —
- **Mandatory.** Record legal constitution, statutory registrations with validity dates, and the banking identity to which disbursement will be made.
- **Prohibited.** Activation of an instrument against an unverified counterparty; payment to a banking identity not recorded against the contractor.
- **Exception policy.** **None** for banking identity. Statutory registration may be conditionally accepted for a bounded period, recorded and counted, where the law permits.
- **Laws.** LAW-4, LAW-5. **Cross-refs.** § 6.2 E-6, SEC-06, RSK-52.

**WRK-10 — A change of contractor banking identity MUST be verified independently of the request.**
- **Rationale.** Payee substitution is among the highest-value, lowest-effort frauds available to anyone with access to correspondence, and it succeeds because the request looks routine.
- **Trigger.** Any request to change payee bank details.
- **Preconditions.** WRK-09.
- **Mandatory.** Verify through a channel independent of the one that carried the request; record the verification, the verifier, and the prior details; retain the change history permanently.
- **Prohibited.** Change effected by the actor who received the request; change applied to a voucher already approved (LI-23).
- **Exception policy.** **None.**
- **Laws.** LAW-4, LAW-11. **Cross-refs.** LC-10, SEC-07, RSK-46.
 
**WRK-11 — A contractor MUST NOT hold an internal verification, measurement, or approval role.**
- **Rationale.** SOD-6 stated as an operating rule. A counterparty verifying its own entitlement is not a control weakness; it is the absence of control.
- **Trigger.** Role assignment; delegation; temporary cover during absence.
- **Preconditions.** —
- **Mandatory.** Structurally prevent the assignment.
- **Prohibited.** Temporary or emergency assignment "because the officer is on leave".
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SOD-6, SEC-03, GP-24.

**WRK-12 — Suspension of a contractor MUST NOT suspend the enterprise's recovery rights or the contractor's earned entitlement.**
- **Rationale.** Conflating commercial displeasure with financial control produces both unlawful withholding and abandoned recovery.
- **Trigger.** Contractor suspension.
- **Preconditions.** —
- **Mandatory.** Continue recovery; continue retention accounting; settle entitlement for verified work.
- **Prohibited.** Using suspension as an undeclared payment-withholding device.
- **Exception policy.** Withholding is a separate, attributed, recorded act under LC-12.
- **Laws.** LAW-8. **Cross-refs.** § 6.2, REC-14, CLS-06.

**WRK-13 — The workforce register MUST be reconcilable to physical site presence on demand.**
- **Rationale.** A register that cannot be walked out to the site and counted is an assertion, not a control. Physical headcount reconciliation is the only detection method that ghost labour cannot survive.
- **Trigger.** Surprise site verification; audit; any anomaly indicator.
- **Preconditions.** Deployment records (DEP), attendance records (ATT).
- **Mandatory.** Produce, for any site and date, the list of workers who should be present, by identity.
- **Prohibited.** Reporting headcount without identity; reporting gang totals in place of named workers.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5. **Cross-refs.** AUD-05, RSK-01, XCP-01.

**WRK-14 — Worker separation MUST trigger final settlement within the defined period.**
- **Rationale.** Unsettled dues of departed workers become permanent enterprise liabilities and statutory exposures, and they are the least likely to be claimed — which is precisely why they must be paid without being claimed (GP-12).
- **Trigger.** Separation; end of engagement; site closure.
- **Preconditions.** All attendance for the worker validated or resolved.
- **Mandatory.** Compute and settle final dues; recover outstanding worker advances within the lawful ceiling; issue the wage card record.
- **Prohibited.** Retaining unsettled dues indefinitely; offsetting unrelated claims against final wages.
- **Exception policy.** Unlocatable worker — dues held as a liability with a defined escheat/statutory treatment, recorded, never absorbed as income.
- **Laws.** LAW-8, CP-9. **Cross-refs.** LAB-13, WKS-11, RSK-33.

---

## 9.4 Domain CLB — Company (directly engaged) labour

> *Workers engaged by the enterprise itself. The control set is stronger here because the enterprise
> observes the worker directly — and weaker in one respect, because there is no intermediary whose
> commercial interest can be used as a cross-check.*

**CLB-01 — A directly engaged worker MUST be paid by the enterprise, to the worker, without intermediation.**
- **Rationale.** Direct engagement exists precisely to remove the intermediary; re-inserting one for payment convenience recreates every intermediation risk while retaining the direct-engagement cost.
- **Trigger.** Wage settlement for a directly engaged worker.
- **Preconditions.** WRK-06 engagement type = direct.
- **Mandatory.** Disburse to the worker's own recorded payment channel or to the worker in person against acknowledgement.
- **Prohibited.** Payment to a Mate, supervisor, or third party on the worker's behalf without a recorded lawful authority.
- **Exception policy.** Payment to a legally authorised representative, evidenced and recorded per instance.
- **Laws.** LAW-5, PA-8. **Cross-refs.** DWG-05, LAB-08, RSK-34.

**CLB-02 — Directly engaged labour MUST be deployed against an approved deployment plan and sanctioned strength.**
- **Rationale.** Unbudgeted direct engagement is the mechanism by which project labour cost escapes control without any single transaction appearing irregular.
- **Trigger.** Engagement; deployment.
- **Preconditions.** An approved deployment plan (OBJ-06).
- **Mandatory.** Test the engagement against sanctioned strength and budgeted cost; record the variance.
- **Prohibited.** Deployment beyond sanctioned strength without recorded approval.
- **Exception policy.** Project Manager approval within delegated limit, recorded, reported in period.
- **Laws.** LAW-2. **Cross-refs.** DEP-02, PRD-07, RSK-25.

**CLB-03 — Attendance of directly engaged labour MUST be recorded by the enterprise's own officer.**
- **Rationale.** GP-02. Where the enterprise engages directly, it observes directly; delegating observation to a party outside the enterprise's accountability chain forfeits the principal advantage of direct engagement.
- **Trigger.** Daily attendance capture.
- **Preconditions.** Deployment; assignment.
- **Mandatory.** Capture by Site Supervisor or a designated enterprise officer.
- **Prohibited.** Capture by a Mate, a contractor, or the workers themselves collectively.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** ATT-02, SOD-7.

**CLB-04 — Overtime for directly engaged labour MUST be authorised before it is worked.**
- **Rationale.** Retrospective overtime authorisation is indistinguishable from invented overtime, and it is a favoured mechanism because it needs no ghost worker — only a real worker and an extra number.
- **Trigger.** Any work beyond normal hours.
- **Preconditions.** An authorising officer with delegated authority.
- **Mandatory.** Record the authorisation, its extent, its reason, and its authoriser before the hours are worked.
- **Prohibited.** Post-facto authorisation as routine practice.
- **Exception policy.** Emergency overtime authorised within one working day, recorded as an exception and counted (LAW-12); the hours are paid regardless (OT-1).
- **Laws.** LAW-2, LAW-12. **Cross-refs.** FM-22, DWG-06, RSK-35.

**CLB-05 — Idle time for directly engaged labour MUST be classified against a recorded cause.**
- **Rationale.** Unclassified idle time is a payment for absence of work, and DP-9 forbids inferring anything significant from a blank.
- **Trigger.** Any day recorded as idle, standby, or rain.
- **Preconditions.** A Hindrance / Idle Time Record (OBJ-28).
- **Mandatory.** Link the idle day to the hindrance record and its cause classification.
- **Prohibited.** Idle time recorded without a cause; cause assigned retrospectively to justify payment already made.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** LR-4, ATT-13, RSK-36.

**CLB-06 — Directly engaged labour cost MUST be attributed to the activity on which it was expended.**
- **Rationale.** Labour cost pooled at project level cannot be compared to output, so productivity leakage becomes undetectable (GP-23).
- **Trigger.** Attendance validation.
- **Preconditions.** Work assignment carrying an activity code (D-4).
- **Mandatory.** Attribute each validated worker-day to an activity.
- **Prohibited.** Attribution to a generic or default activity as standard practice.
- **Exception policy.** A bounded proportion of general-site effort may be attributed to a general activity, declared and monitored.
- **Laws.** LAW-5. **Cross-refs.** ASG-03, PRD-02, FM-31.

**CLB-07 — A directly engaged worker MUST NOT simultaneously be paid as contractor or supplied labour.**
- **Rationale.** The same person paid twice through two engagement paths is leakage form L2, and it is invisible unless identity is enterprise-wide (WRK-02).
- **Trigger.** Attendance validation; settlement.
- **Preconditions.** WRK-02, WRK-06.
- **Mandatory.** Test every settlement against all engagement paths for that worker and date.
- **Prohibited.** Parallel settlement paths for one worker-day.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** LI-16, BRL-05, XCP-02.

**CLB-08 — Statutory obligations for directly engaged labour MUST be discharged by the enterprise itself.**
- **Rationale.** Direct engagement makes the enterprise the employer in fact and in law; there is no intermediary to whom obligation can pass.
- **Trigger.** Settlement; statutory period close.
- **Preconditions.** Statutory parameters consumed from CAP-TAX (I-8).
- **Mandatory.** Compute, deduct, record, and hand off statutory amounts.
- **Prohibited.** Treating statutory obligations as discharged by contract with a third party.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-01, FM-17.

**CLB-09 — Wage rates for directly engaged labour MUST derive from the enterprise's authorised wage schedule.**
- **Rationale.** Site-negotiated wages produce rate drift, inconsistency between adjacent projects, and an unanswerable grievance when workers compare (§ 1.4.11 applied to labour).
- **Trigger.** Engagement; wage computation.
- **Preconditions.** An authorised wage schedule with effective dates.
- **Mandatory.** Resolve the rate by trade, grade, region, and effective date (GP-17).
- **Prohibited.** Site-level rate setting; rate negotiated per worker outside the schedule.
- **Exception policy.** Scarce-trade premium, approved centrally, time-boxed, recorded against the worker and the reason.
- **Laws.** LAW-5, CP-4. **Cross-refs.** WGR-01, FM-21.

**CLB-10 — Advances to directly engaged workers MUST carry a recovery plan within the lawful deduction ceiling.**
- **Rationale.** A worker advance with no plan becomes either a permanent enterprise loss or an unlawful deduction when finally recovered in one instalment.
- **Trigger.** Worker advance request.
- **Preconditions.** FM-27 lawful deduction ceiling known.
- **Mandatory.** Bind an instalment plan that respects the ceiling at approval.
- **Prohibited.** Recovery in excess of the ceiling; recovery from a final settlement that leaves the worker below statutory minimum for the period.
- **Exception policy.** **None** for the ceiling. Deferral of recovery, recorded.
- **Laws.** LAW-7, CP-9. **Cross-refs.** ADV-11, FM-26, FM-27.

**CLB-11 — Transfer of a directly engaged worker between projects MUST close and reopen deployment on the same date.**
- **Rationale.** An open deployment on two projects permits two attendance records, and the reconciliation that would catch it is periodic while the fraud is daily.
- **Trigger.** Inter-project transfer.
- **Preconditions.** DEP-05.
- **Mandatory.** Same-date close and open; raise the borrowed-labour entry where cost is shared.
- **Prohibited.** Overlapping deployments; transfer recorded retrospectively across a settled period.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** BRL-01, LI-16, DEP-05.

**CLB-12 — A directly engaged worker's wage card MUST be available to that worker.**
- **Rationale.** CP-10. A worker who can see the derivation of their own wage is the cheapest and most motivated auditor of the attendance record the enterprise holds.
- **Trigger.** Settlement.
- **Preconditions.** Wage Card (OBJ-16).
- **Mandatory.** Make days, rate, gross, deductions, recoveries, and net visible to the worker in a form they can understand.
- **Prohibited.** Net-only disclosure; disclosure only on request.
- **Exception policy.** **None.**
- **Laws.** CP-10, GP-19. **Cross-refs.** LAB-09, WKS-09.

---

## 9.5 Domain CTL — Contractor labour

> *Workers engaged through a contractor executing contracted scope. The enterprise pays for outcomes,
> not for people — but remains exposed for the people (§ 4.4).*

**CTL-01 — Payment for contracted work MUST be for measured output, never for headcount.**
- **Rationale.** Paying a contractor by headcount converts an outcome contract into a labour-supply contract at outcome prices, and removes measurement — the only defence against L1 and L3 — from the payment path entirely.
- **Trigger.** Any claim from a contractor holding an outcome-based instrument.
- **Preconditions.** Verified measurement (LC-04).
- **Mandatory.** Value by FM-01 against verified quantities.
- **Prohibited.** Valuing by worker-days present, by gang strength, or by the contractor's own labour cost.
- **Exception policy.** Day-work items expressly provided in the instrument, bounded and authorised in advance (UG-3).
- **Laws.** LAW-1, LAW-5. **Cross-refs.** MSR-01, RBL-02, RSK-11.

**CTL-02 — The enterprise MUST maintain individual visibility of workers deployed by a contractor on its sites.**
- **Rationale.** Principal-employer exposure (§ 4.4) does not stop at the contract boundary; nor does the enterprise's ability to be presented with a fictitious workforce.
- **Trigger.** Contractor worker entering site; period close.
- **Preconditions.** WRK-01, WRK-02.
- **Mandatory.** Register each contractor worker under enterprise identity; record trade, grade, and the contractor under whom deployed.
- **Prohibited.** Accepting an aggregate headcount in place of identities.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5. **Cross-refs.** LAB-02, BRL-06, WRK-13.

**CTL-03 — A contractor's claim MUST be treated as a claim and never as evidence.**
- **Rationale.** GP-13, § 4.3. The claimant's assertion of quantity, attendance, or entitlement carries no evidential weight regardless of the claimant's reputation or the relationship's duration.
- **Trigger.** Receipt of any contractor claim, bill, or statement.
- **Preconditions.** —
- **Mandatory.** Record the claim as a claim; verify independently before any value attaches.
- **Prohibited.** Certifying a bill from the contractor's own figures; adopting contractor measurements without check.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-2. **Cross-refs.** MSR-05, RBL-03, EDR-01.

**CTL-04 — Contractor deployment MUST NOT exceed the deployment recorded against the instrument without record.**
- **Rationale.** Undeclared workforce on site is an uncontrolled statutory exposure and an uncounted population against which ghost labour hides.
- **Trigger.** Site entry; daily strength return.
- **Preconditions.** DEP-01.
- **Mandatory.** Record actual strength daily by contractor; reconcile to gate/entry records where they exist.
- **Prohibited.** Site access for unregistered workers.
- **Exception policy.** Same-day registration for genuine new arrivals, recorded.
- **Laws.** LAW-2. **Cross-refs.** ATT-04, LAB-04, RSK-03.

**CTL-05 — The enterprise MUST verify that the contractor has paid its own workers before releasing subsequent payment where the law imposes principal-employer liability.**
- **Rationale.** Unpaid workers of a paid contractor become the enterprise's liability, its reputational event, and its site stoppage — in that order and usually in the same week.
- **Trigger.** Contractor bill approval.
- **Preconditions.** Wage records from the contractor (LAB-02).
- **Mandatory.** Obtain and record evidence of wage payment for the preceding period; reconcile to the worker register (RI-8).
- **Prohibited.** Approving a subsequent payment where the prior period's wage evidence is absent.
- **Exception policy.** One period's grace, recorded and counted, where the delay is documented and the workers are confirmed paid by direct enquiry.
- **Laws.** CP-9, PA-8. **Cross-refs.** LAB-05, BRL-09, RSK-32.

**CTL-06 — Where a contractor fails to pay its workers, the enterprise MUST pay them and recover from the contractor.**
- **Rationale.** PA-8. The worker's hunger is not a lever in a commercial dispute, and the enterprise's statutory position is worse if it waits.
- **Trigger.** Confirmed non-payment of workers by a contractor.
- **Preconditions.** Individual worker records (CTL-02); attendance validated by the enterprise.
- **Mandatory.** Pay validated wages directly to the named workers; record each payment; raise a recovery (LC-07) against the contractor at priority 2 of the waterfall.
- **Prohibited.** Withholding worker wages pending resolution of the contractor dispute.
- **Exception policy.** **None.**
- **Laws.** PA-8, CP-9, LAW-8. **Cross-refs.** FM-13, REC-05, LAB-10.

**CTL-07 — Contractor rates MUST NOT be varied at site level.**
- **Rationale.** Rate variation at site is invisible per transaction and compounding in aggregate — leakage form L7 in its purest form (§ 1.4.11).
- **Trigger.** Any application of a rate not in the bound schedule.
- **Preconditions.** GP-01, FM-00.
- **Mandatory.** Route every rate not in force to the star-rate procedure (§ 8.10).
- **Prohibited.** Site agreement on rate; "rate as per market" entries; rate adopted from another contract.
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-4. **Cross-refs.** SR-1, PC-3, RSK-14.

**CTL-08 — Contractor labour MUST NOT perform enterprise-supervisory or verification functions.**
- **Rationale.** WRK-11 applied at the working level: a contractor's employee recording attendance or assisting measurement has been given custody of the evidence that constrains their employer's payment.
- **Trigger.** Role or task assignment at site.
- **Preconditions.** —
- **Mandatory.** Restrict evidence creation to enterprise officers.
- **Prohibited.** Contractor staff maintaining musters, measurement books, or issue records.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-2. **Cross-refs.** SOD-6, MBK-02, SEC-04.

**CTL-09 — Materials, plant, fuel, power, water, and accommodation supplied to a contractor MUST create a recovery at the moment of issue.**
- **Rationale.** § 1.4.6 and LI-14. The recovery that depends on someone remembering is the recovery that does not happen, and L5 is the largest leakage class in aggregate.
- **Trigger.** Any issue of enterprise value to a contractor.
- **Preconditions.** Issue rates bound in the instrument (E-5).
- **Mandatory.** Raise an Issued Value Record (OBJ-29) and a linked recovery obligation automatically on issue.
- **Prohibited.** Issue without valuation; recovery raised only at bill time; recovery raised on request.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FM-11, REC-02, RI-4, RSK-21.

**CTL-10 — Contractor performance and exposure MUST be visible before further work is awarded.**
- **Rationale.** Awarding new work to a contractor already carrying unrecovered exposure increases the loss on default; the decision is routinely taken without the number in front of it.
- **Trigger.** New award; scope increase; variation.
- **Preconditions.** FM-34 exposure computable.
- **Mandatory.** Present exposure, recovery status, and dispute history to the awarding authority.
- **Prohibited.** Award without the exposure figure.
- **Exception policy.** Recorded override by executive authority.
- **Laws.** LAW-9 context. **Cross-refs.** integration O-4, CLS-12, RSK-48.

**CTL-11 — Contractor demobilisation MUST crystallise all recoveries before final payment.**
- **Rationale.** LA-7. The enterprise's leverage is at maximum while it holds money and the contractor is still on site; both conditions end together and never return.
- **Trigger.** Demobilisation; completion; termination.
- **Preconditions.** FC-3, FC-4 computable.
- **Mandatory.** Compute all outstanding advances, issued value, damages, and LD before releasing any final payment.
- **Prohibited.** Releasing final payment with recoveries "to be settled separately".
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** CLS-04, ADV-09, RSK-22.

**CTL-12 — Contractor-supplied attendance data MUST NOT flow directly into any enterprise financial computation.**
- **Rationale.** § 4.2 and GP-13. Data supplied by the beneficiary is a claim; using it as input is using the claim as evidence with extra steps.
- **Trigger.** Ingestion of any contractor-supplied record.
- **Preconditions.** —
- **Mandatory.** Mark such data as claimed; require independent validation before it can support value.
- **Prohibited.** Direct use in wage or bill computation.
- **Exception policy.** **None.**
- **Laws.** LAW-2, CP-2. **Cross-refs.** ATT-03, BRL-08, RSK-04.

**CTL-13 — Every contractor engagement MUST have a single accountable enterprise officer.**
- **Rationale.** Shared accountability is absent accountability; a contractor managed by everyone is managed by no one, and this is where scope creep without variation (§ 1.4.7) lives.
- **Trigger.** Instrument activation.
- **Preconditions.** —
- **Mandatory.** Name the accountable officer on the instrument; record changes with dates.
- **Prohibited.** Instruments with no named officer or with joint primary accountability.
- **Exception policy.** **None.**
- **Laws.** CP-6. **Cross-refs.** § 4.8, AUD-04, ARB-F6.

**CTL-14 — Site instructions to a contractor MUST be recorded on the day they are given.**
- **Rationale.** § 1.4.7. Verbal instruction followed by executed work followed by a claim is the sequence in which the enterprise loses, because the only record is the claimant's.
- **Trigger.** Any instruction that changes scope, method, sequence, or quantity.
- **Preconditions.** —
- **Mandatory.** Record the instruction, its author, its date, and its expected cost consequence.
- **Prohibited.** Instructions recorded retrospectively to support a variation already claimed.
- **Exception policy.** Emergency instruction recorded within one working day, counted.
- **Laws.** CP-1, LAW-9. **Cross-refs.** LI-20, VAR-03, RSK-41.

---

## 9.6 Domain BRL — Borrowed, supplied and intermediated labour

> *The most exploited surface in the industry (§ 1.4.3) and the domain in which the enterprise pays a
> person it cannot see, on the word of a party who is paid more when the count is higher.*

**BRL-01 — Borrowed labour MUST create a matched debit and credit on the same date.**
- **Rationale.** Unmatched transfer entries permit the same worker-day to be borne by two projects or by none — the first inflates cost twice, the second hides it entirely.
- **Trigger.** Transfer of a worker or gang between projects, sites, or contractors.
- **Preconditions.** Borrowed Labour Ledger (OBJ-22).
- **Mandatory.** Raise the ledger entry at transfer; close the lending assignment and open the borrowing one on the same date (LI-04).
- **Prohibited.** Transfer without a ledger entry; entries raised at period close from memory.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** FM-30, RI-11, CLB-11, ATT-06, XCP-06.

**BRL-02 — Borrowed labour requires dual accountability: the lending and the borrowing officer are both accountable.**
- **Rationale.** Transfers fail because each side believes the other is recording it. Making both accountable for the same fact means neither can rely on the other's silence (GP-14).
- **Trigger.** Transfer.
- **Preconditions.** Named officers on both sides.
- **Mandatory.** Both officers acknowledge the transfer, its dates, and its rate.
- **Prohibited.** Single-sided transfer records.
- **Exception policy.** **None.**
- **Laws.** CP-6. **Cross-refs.** EDR-04, DEP-06, RSK-27.

**BRL-03 — The transfer value MUST reconcile to the same validated attendance days that generated the worker's wage.**
- **Rationale.** BL-1. Two projects claiming the same worker-day is L2; the reconciliation is what makes it detectable, and the identity rule (LI-16) is what makes it impossible.
- **Trigger.** Period close; transfer settlement.
- **Preconditions.** Validated attendance.
- **Mandatory.** Reconcile debits and credits enterprise-wide (RI-11).
- **Prohibited.** Transfer value computed from planned rather than validated days.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** FM-30, RI-11, ATT-06.

**BRL-04 — A supplied worker MUST be registered under enterprise identity before first attendance.**
- **Rationale.** A worker known only to the supplier cannot be counted, cannot be reconciled, and cannot be found when the statutory inspector asks (§ 4.4).
- **Trigger.** First presentation of a supplied worker.
- **Preconditions.** WRK-01, WRK-02, WRK-03.
- **Mandatory.** Register before attendance may be captured.
- **Prohibited.** Attendance capture against an unregistered supplied worker.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** CTL-02, LAB-02, XCP-01.

**BRL-05 — One worker MUST NOT appear on two musters, two suppliers, or two projects for the same date.**
- **Rationale.** The single-occupancy invariant (LI-16) stated as an operating rule. This is the highest-value single control in the labour path.
- **Trigger.** Attendance validation.
- **Preconditions.** WRK-02 enterprise-wide identity.
- **Mandatory.** Test enterprise-wide at validation; reject the second occurrence; raise an exception naming both sources.
- **Prohibited.** Detection deferred to reporting; resolution by accepting both and adjusting later.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** LI-16, ATT-06, WRK-07, XCP-02.

**BRL-06 — Payment through an intermediary MUST NOT extinguish individual wage records.**
- **Rationale.** LR-2. Gang-level payment with no individual record is the condition under which the enterprise cannot prove it discharged its principal-employer obligation, and cannot detect that it did not.
- **Trigger.** Any intermediated wage settlement.
- **Preconditions.** Individual identities and validated attendance.
- **Mandatory.** Maintain a Wage Card per worker; compute the individual allocation (FM-29); obtain acknowledgement by the named worker.
- **Prohibited.** Settlement recorded only at gang or supplier level.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5, CP-9. **Cross-refs.** GNG-05, FM-29, LAB-08, RSK-05.

**BRL-07 — The intermediary's margin MUST be visible and MUST NOT be funded from the worker's statutory entitlement.**
- **Rationale.** § 4.4 boundary ruling: the supplier's margin is in scope insofar as it affects minimum-wage pass-through. A margin taken out of the worker's wage is an enterprise statutory breach wearing a commercial costume.
- **Trigger.** Supplier rate agreement; settlement.
- **Preconditions.** Statutory minimum known for trade, grade, region, date.
- **Mandatory.** Decompose the supplied-labour rate into wage component and margin; test the wage component against the statutory minimum (FM-25).
- **Prohibited.** Opaque all-in rates that cannot be decomposed; margin that reduces the worker below the floor.
- **Exception policy.** **None.**
- **Laws.** CP-9, PA-8. **Cross-refs.** MW-2, LAB-06, RSK-30.

**BRL-08 — Mate-reported attendance MUST be independently validated before it can support payment.**
- **Rationale.** § 4.2 conflict declaration: the Mate is paid more when the count is higher. Their report is a claim (GP-13), and a claim validated by its own author is not validated.
- **Trigger.** Attendance capture through a Mate or gang leader.
- **Preconditions.** —
- **Mandatory.** Validate by an enterprise officer who is not the Mate (SOD-7); corroborate by an independent signal where available.
- **Prohibited.** Direct flow of mate-reported attendance into wage computation.
- **Exception policy.** **None.**
- **Laws.** LAW-2, CP-2. **Cross-refs.** SOD-7, ATT-03, GNG-04, XCP-01.

**BRL-09 — The enterprise MUST obtain evidence that supplied workers received their wages.**
- **Rationale.** The supplier's invoice proves the supplier was paid. It proves nothing about the worker, which is the only fact that discharges the enterprise's exposure.
- **Trigger.** Settlement of a supplier claim.
- **Preconditions.** Individual wage records (BRL-06).
- **Mandatory.** Obtain acknowledgement or payment evidence per named worker; reconcile to the enterprise's own attendance (RI-8).
- **Prohibited.** Accepting the supplier's aggregate declaration as evidence of worker payment.
- **Exception policy.** Bounded grace, recorded and counted, with direct worker enquiry as compensating control.
- **Laws.** CP-9, PA-8. **Cross-refs.** CTL-05, RI-8, LAB-05.

**BRL-10 — A supplier MUST NOT supply workers already engaged elsewhere in the enterprise.**
- **Rationale.** WRK-07 applied at supply. The supplier has no visibility of the enterprise's other engagements; the enterprise does, and therefore the test belongs to the enterprise.
- **Trigger.** Worker presentation.
- **Preconditions.** WRK-02.
- **Mandatory.** Test at registration and at each attendance validation.
- **Prohibited.** Reliance on the supplier's declaration.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** BRL-05, WRK-07.

**BRL-11 — Borrowed labour rates MUST be bound before transfer, not agreed at settlement.**
- **Rationale.** A transfer priced after the fact is priced by whichever party has the stronger position at that moment, which is a negotiation dressed as an accounting entry.
- **Trigger.** Transfer initiation.
- **Preconditions.** An enterprise transfer-rate basis.
- **Mandatory.** Bind `rate_transfer` at transfer with its effective date.
- **Prohibited.** Rate determined at period close.
- **Exception policy.** **None.**
- **Laws.** CP-4, GP-01. **Cross-refs.** FM-30, BRL-02.

**BRL-12 — Statutory obligations MUST NOT be lost at the intermediation boundary.**
- **Rationale.** Every intermediation layer is a place where a statutory obligation can be assumed to belong to the other party. Principal-employer liability does not accept that assumption.
- **Trigger.** Engagement of any intermediary; statutory period close.
- **Preconditions.** Statutory registration status of the intermediary (WRK-09).
- **Mandatory.** Record which party discharges each obligation; verify discharge; retain evidence.
- **Prohibited.** Assuming discharge from the existence of a contract clause.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-01, LAB-12, RSK-49.

**BRL-13 — Termination of an intermediary MUST NOT strand the workers' entitlement.**
- **Rationale.** When a supplier abandons a site, the workers remain and are owed. The enterprise that treats this as the supplier's problem acquires a site stoppage and a statutory finding.
- **Trigger.** Supplier termination, abandonment, or insolvency.
- **Preconditions.** Individual records (BRL-06).
- **Mandatory.** Settle validated worker entitlement directly; recover from amounts due to the intermediary at waterfall priority 2.
- **Prohibited.** Suspension of worker settlement pending commercial resolution.
- **Exception policy.** **None.**
- **Laws.** PA-8. **Cross-refs.** CTL-06, FM-13, RSK-33.

**BRL-14 — Intermediated labour cost MUST be attributable to activity and output like any other labour cost.**
- **Rationale.** Intermediation is a commercial arrangement, not an accounting exemption. Cost that cannot be attributed cannot be compared to output, and productivity leakage becomes structurally undetectable.
- **Trigger.** Settlement; period close.
- **Preconditions.** Assignment carrying activity (ASG-03).
- **Mandatory.** Attribute supplied worker-days to activities.
- **Prohibited.** Booking supplied labour as an undifferentiated service cost.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** CLB-06, PRD-02, MR-6.

---

## 9.7 Domain GNG — Gang management

> *A gang is an operational convenience and a financial hazard: it aggregates individuals into a
> number, and numbers are easier to inflate than people.*

**GNG-01 — A gang MUST have a named leader and a recorded composition at every point in time.**
- **Rationale.** Accountability for ghost labour attaches to the gang leader (§ 4.2). An unnamed leader or an unrecorded composition removes the accountable party from the record.
- **Trigger.** Gang formation; composition change.
- **Preconditions.** WRK-01 for every member.
- **Mandatory.** Record leader, members, trade, and effective dates; retain composition history.
- **Prohibited.** Gangs defined by strength alone; composition inferred from attendance.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** § 5.4, GNG-02, XCP-01.

**GNG-02 — Gang composition changes MUST be recorded on the date of change.**
- **Rationale.** Retrospective composition is composition fitted to attendance, which reverses the evidential order (CP-1).
- **Trigger.** Member joins or leaves.
- **Preconditions.** GNG-01.
- **Mandatory.** Same-date recording with the authorising supervisor.
- **Prohibited.** Composition reconstructed at settlement.
- **Exception policy.** Same-day-plus-one recording, counted.
- **Laws.** CP-1. **Cross-refs.** ATT-05, GNG-01.

**GNG-03 — A worker MUST belong to at most one gang on any date.**
- **Rationale.** Multi-gang membership is the gang-level equivalent of duplicate attendance, and it produces double allocation under FM-29 even where total attendance is correct.
- **Trigger.** Gang assignment.
- **Preconditions.** WRK-02.
- **Mandatory.** Enforce single membership per date.
- **Prohibited.** Concurrent memberships.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** LI-16, FM-29.

**GNG-04 — The gang leader MUST NOT validate the gang's own attendance.**
- **Rationale.** SOD-7. The party whose payment increases with the count cannot be the party who confirms the count.
- **Trigger.** Attendance validation.
- **Preconditions.** —
- **Mandatory.** Validation by an enterprise officer.
- **Prohibited.** Self-validation in any form, including countersignature presented as validation.
- **Exception policy.** **None.**
- **Laws.** LAW-2, CP-2. **Cross-refs.** SOD-7, BRL-08, ATT-03.

**GNG-05 — Gang-level payment MUST be allocated to named individuals.**
- **Rationale.** BRL-06 at the gang level. Without allocation, the enterprise cannot demonstrate that any individual was paid anything.
- **Trigger.** Gang settlement.
- **Preconditions.** Validated attendance per member.
- **Mandatory.** Allocate by validated worker-days (FM-29); record on each Wage Card.
- **Prohibited.** Settlement recorded only as a gang total.
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-9. **Cross-refs.** FM-29, GA-1, LAB-08.

**GNG-06 — Gang output MUST be measurable and attributable to the gang.**
- **Rationale.** A gang whose output cannot be measured cannot be assessed for productivity, and productivity variance is a primary detector of both ghost labour and over-measurement (MR-6).
- **Trigger.** Assignment of work to a gang.
- **Preconditions.** Activity and measurable item.
- **Mandatory.** Assign gangs to work fronts whose output is measurable.
- **Prohibited.** Standing general-duties assignment as the normal pattern.
- **Exception policy.** Bounded general-duty proportion, declared and monitored.
- **Laws.** LAW-5. **Cross-refs.** PRD-03, MR-6, CLB-06.

**GNG-07 — A gang MUST NOT be paid for a day on which its assigned work front was closed.**
- **Rationale.** Attendance on a closed front is either misattributed or fictitious; both are detectable only if front status is recorded.
- **Trigger.** Attendance validation.
- **Preconditions.** Site and front calendar; hindrance records (OBJ-28).
- **Mandatory.** Test attendance against front status; classify legitimate idle time (CLB-05).
- **Prohibited.** Validation against a closed front without an idle-time classification.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-3. **Cross-refs.** ATT-12, CLB-05, RSK-06.

**GNG-08 — Gang strength MUST be reconcilable to physical presence on demand.**
- **Rationale.** WRK-13 at gang level; the surprise count is the control that ghost labour cannot survive.
- **Trigger.** Site verification; audit.
- **Preconditions.** GNG-01.
- **Mandatory.** Produce named members expected on site for any date.
- **Prohibited.** Strength reported without identities.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** WRK-13, AUD-05.

**GNG-09 — Gang leader remuneration MUST NOT vary with reported headcount alone.**
- **Rationale.** § 4.2. Where the Mate's earnings rise with the count they report, the enterprise has paid someone to inflate its own records. Remuneration linked to measured output inverts that incentive.
- **Trigger.** Agreement of gang leader remuneration.
- **Preconditions.** Measurable output (GNG-06).
- **Mandatory.** Link remuneration to verified output or to a fixed engagement, not to reported presence.
- **Prohibited.** Per-head commission on reported attendance.
- **Exception policy.** Recorded executive approval where market practice compels it, with compensating attendance controls declared.
- **Laws.** CP-2. **Cross-refs.** § 4.2, RSK-04, EDR-06.

**GNG-10 — Ghost labour discovered in a gang MUST be attributed to the gang leader and the supervising officer.**
- **Rationale.** § 4.2 and § 4.5 both make this attribution explicit. Accountability that attaches to no one deters no one.
- **Trigger.** Detection of ghost labour.
- **Preconditions.** —
- **Mandatory.** Record the finding against both parties; raise an exception; recover the value.
- **Prohibited.** Treating discovery as a correction without attribution.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** § 4.5, RSK-01, AUD-10.

---

## 9.8 Domain DEP — Deployment

> *Deployment is the enterprise's statement of who it intends to have, where, at what cost. It bounds
> everything downstream: a worker cannot be assigned outside deployment, and cannot be paid outside
> assignment.*

**DEP-01 — Every worker on site MUST be covered by an approved deployment for that date.**
- **Rationale.** Deployment is the outer boundary of the payable population. A worker outside it is either an unbudgeted cost or a fiction, and the enterprise cannot tell which.
- **Trigger.** Site presence; attendance capture.
- **Preconditions.** Approved deployment plan (OBJ-06).
- **Mandatory.** Test presence against deployment; reject capture outside it.
- **Prohibited.** Attendance validated for an undeployed worker.
- **Exception policy.** Same-day deployment amendment by the Project Manager, recorded.
- **Laws.** LAW-2. **Cross-refs.** LI-04, ATT-04, CTL-04.

**DEP-02 — Deployment MUST be approved against sanctioned strength and budgeted cost.**
- **Rationale.** Labour cost escapes control through accumulation of individually reasonable decisions; the sanctioned-strength test is where accumulation becomes visible.
- **Trigger.** Deployment planning; amendment.
- **Preconditions.** Sanctioned strength and labour budget.
- **Mandatory.** Record planned strength, budgeted cost, and variance at approval.
- **Prohibited.** Deployment approved without the budget comparison.
- **Exception policy.** Documented approval above the exceeded limit.
- **Laws.** LAW-9 context. **Cross-refs.** CLB-02, PRD-07.

**DEP-03 — Deployment MUST name the project, site, and work front.**
- **Rationale.** MP-7 applied to people. Deployment to "the project" cannot be reconciled to a front, a gang, or an output, so no productivity or presence test is possible.
- **Trigger.** Deployment creation.
- **Preconditions.** Project/site/front structure (D-3).
- **Mandatory.** Record to work-front granularity.
- **Prohibited.** Project-level-only deployment as standard practice.
- **Exception policy.** Mobilisation period, bounded and declared.
- **Laws.** LAW-2. **Cross-refs.** I-3, ASG-02.

**DEP-04 — Deployment MUST record the engagement type under which the worker is deployed.**
- **Rationale.** The control set differs by engagement type (WRK-06); a deployment that does not carry it cannot invoke the right controls.
- **Trigger.** Deployment.
- **Preconditions.** WRK-06.
- **Mandatory.** Carry engagement type and intermediary identity onto the deployment.
- **Prohibited.** Deployment silent as to engagement type.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** BRL-04, CTL-02.

**DEP-05 — Deployments for one worker MUST NOT overlap.**
- **Rationale.** Overlapping deployment is the precondition for duplicate attendance; closing the door here is cheaper than detecting the consequence downstream.
- **Trigger.** Deployment creation; transfer.
- **Preconditions.** WRK-02.
- **Mandatory.** Close the prior deployment on the date the new one opens.
- **Prohibited.** Concurrent open deployments.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** LI-16, CLB-11, BRL-01.

**DEP-06 — Inter-project deployment transfer MUST be acknowledged by both projects.**
- **Rationale.** BRL-02 dual accountability. Single-sided transfers leave cost on the wrong project and attendance on both.
- **Trigger.** Transfer.
- **Preconditions.** Named officers on both sides.
- **Mandatory.** Both acknowledge; ledger entry raised (BRL-01).
- **Prohibited.** Transfer effected by the receiving project alone.
- **Exception policy.** **None.**
- **Laws.** CP-6. **Cross-refs.** BRL-02, RI-11.

**DEP-07 — Deployment MUST end on a recorded date.**
- **Rationale.** An open-ended deployment is a permanent authorisation, and permanent authorisations survive the people and the reasons that created them (LA-4).
- **Trigger.** Deployment creation.
- **Preconditions.** —
- **Mandatory.** Record an expected end date; require positive extension.
- **Prohibited.** Indefinite deployment.
- **Exception policy.** **None.**
- **Laws.** DP-12. **Cross-refs.** GP-20, SEC-09.

**DEP-08 — Deployment beyond sanctioned strength MUST be visible in period reporting.**
- **Rationale.** GP-21. An exceeded limit that is approved and then forgotten is a limit that has been abolished quietly.
- **Trigger.** Period close.
- **Preconditions.** DEP-02.
- **Mandatory.** Report strength variance by project and period to the accountable officer.
- **Prohibited.** Variance visible only on request.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** AUD-08, PRD-08.

**DEP-09 — Deployment MUST NOT be created retrospectively over a settled period.**
- **Rationale.** Retrospective deployment legitimises attendance that was invalid when captured, which converts a detection into a correction and destroys the audit signal.
- **Trigger.** Deployment creation with a past effective date.
- **Preconditions.** Period status (PG-1).
- **Mandatory.** Reject where the period is closed; route through exception with restatement where genuinely required.
- **Prohibited.** Silent backdating.
- **Exception policy.** Finance Controller, recorded, counted, with the affected settlements restated visibly.
- **Laws.** LAW-11. **Cross-refs.** PG-2, PG-4, OVR-06.

**DEP-10 — Deployment records MUST support surprise verification.**
- **Rationale.** WRK-13. The value of a deployment record is realised only when someone walks the site with it.
- **Trigger.** Verification.
- **Preconditions.** DEP-01, DEP-03.
- **Mandatory.** Produce expected presence by identity, site, front, and date.
- **Prohibited.** —
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** AUD-05, GNG-08.

**DEP-11 — Demobilisation MUST close deployments and trigger settlement.**
- **Rationale.** Open deployments after demobilisation permit attendance capture for workers who have left, and unsettled workers who have left are the least likely to claim (WRK-14).
- **Trigger.** Demobilisation; front completion; site closure.
- **Preconditions.** —
- **Mandatory.** Close deployments; settle validated attendance; record unsettled dues as liabilities.
- **Prohibited.** Deployments left open after demobilisation.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** WRK-14, CLS-08.

---

## 9.9 Domain ASG — Work assignment

> *Assignment is the second limb of LAW-2 and the answer to the question "who told this person to do
> this work?" Without it, effort claimed after the fact cannot be distinguished from effort invented
> after the fact.*

**ASG-01 — Work MUST be assigned before it is performed.**
- **Rationale.** LI-03. Assignment created after the work date is a reconstruction, and reconstruction by an interested party is the definition of a fabricated authority.
- **Trigger.** Allocation of a worker or gang to work.
- **Preconditions.** Deployment (DEP-01).
- **Mandatory.** Record the assignment with its date, before the work date.
- **Prohibited.** Routine retrospective assignment.
- **Exception policy.** Retrospective assignment flagged, justified by an actor other than its creator, counted (LI-03).
- **Laws.** LAW-2. **Cross-refs.** LI-03, ATT-07, RSK-07.

**ASG-02 — Every assignment MUST name a work location to re-verifiable granularity.**
- **Rationale.** MP-7 applied to labour. "Site" is not a location; a location that cannot be visited cannot be verified, and unverifiable assignment supports unverifiable attendance.
- **Trigger.** Assignment.
- **Preconditions.** Site/front structure.
- **Mandatory.** Record project, site, front, and where relevant grid or level.
- **Prohibited.** Assignment to a project without a front.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** DEP-03, MP-7.

**ASG-03 — Every assignment MUST carry an activity code.**
- **Rationale.** Activity is the join between labour cost and measured output; without it, productivity (FM-31) and MR-6 are both unavailable.
- **Trigger.** Assignment.
- **Preconditions.** WBS/activity definition (D-4).
- **Mandatory.** Record the activity against which effort will be attributed.
- **Prohibited.** Assignment to an undefined or default activity as standard practice.
- **Exception policy.** Bounded general activity, declared and monitored.
- **Laws.** LAW-2, LAW-5. **Cross-refs.** CLB-06, PRD-02, MR-6.

**ASG-04 — Assignment MUST be to a defined and open work front.**
- **Rationale.** Assignment to a closed or non-existent front is a control failure that produces payable attendance against work that cannot have occurred (LAW-3).
- **Trigger.** Assignment.
- **Preconditions.** Front status; calendar (D-10).
- **Mandatory.** Reject assignment to closed or undefined fronts.
- **Prohibited.** —
- **Exception policy.** **None.**
- **Laws.** LAW-3. **Cross-refs.** GNG-07, I-3.

**ASG-05 — An assignment MUST name its issuing authority.**
- **Rationale.** CP-6. An instruction with no author is an instruction no one is accountable for, and § 1.4.7 is the consequence.
- **Trigger.** Assignment issue.
- **Preconditions.** —
- **Mandatory.** Record the issuing supervisor or engineer.
- **Prohibited.** System- or role-issued assignments with no named person.
- **Exception policy.** **None.**
- **Laws.** CP-6. **Cross-refs.** CTL-13, AUD-04.

**ASG-06 — Assignment MUST NOT exceed the scope of the governing engagement instrument.**
- **Rationale.** Assigning a contractor's gang to work outside their instrument creates executed work with no rate and no authority — the origin of the star-rate-under-duress problem (SR-3).
- **Trigger.** Assignment of contracted labour.
- **Preconditions.** Instrument scope.
- **Mandatory.** Test the activity against instrument scope; route out-of-scope work to LC-09 before execution.
- **Prohibited.** Out-of-scope assignment resolved by a later variation.
- **Exception policy.** Emergency work under recorded site instruction (CTL-14), variation raised within a bounded period.
- **Laws.** LAW-9, PA-1. **Cross-refs.** VAR-02, LI-20, RSK-41.

**ASG-07 — Assignment status MUST be maintained through to completion or abandonment.**
- **Rationale.** GP-20. An assignment that is never closed is an authority that never expires and an output that is never compared to its effort.
- **Trigger.** Work progress; period close.
- **Preconditions.** —
- **Mandatory.** Move assignments to `COMPLETED`, `ABANDONED`, `SUSPENDED`, or `REASSIGNED`; age open assignments.
- **Prohibited.** Assignments left `IN_PROGRESS` indefinitely.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** § 5.8, GP-20.

**ASG-08 — Reassignment MUST close the prior assignment on the same date.**
- **Rationale.** Overlapping assignments permit one worker-day to be attributed to two activities, which corrupts both productivity figures and any cost attribution built on them.
- **Trigger.** Reassignment.
- **Preconditions.** —
- **Mandatory.** Same-date close and open.
- **Prohibited.** Overlapping open assignments for one worker.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** DEP-05, LI-16.

**ASG-09 — Assignment MUST be visible to the worker or gang it directs.**
- **Rationale.** A worker who does not know what they were assigned to cannot dispute an attendance or productivity record built on it, and CP-10 requires that they can.
- **Trigger.** Assignment issue.
- **Preconditions.** —
- **Mandatory.** Communicate the assignment in a form the assignee can understand.
- **Prohibited.** Assignments held only in enterprise records.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** GP-19, CLB-12.

**ASG-10 — Assignment records MUST be retained for the life of the contract and its limitation period.**
- **Rationale.** § 3.4.4. Assignment is the evidence that defeats a later claim that work was directed; it is needed precisely when the people who issued it have gone (O-9).
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Retain per the evidence-retention schedule.
- **Prohibited.** Purging assignment records at project close.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** AUD-12, LI-33.

**ASG-11 — Work performed without assignment MUST be recorded as an exception, not silently paid or silently refused.**
- **Rationale.** Both silent outcomes are wrong: silent payment defeats LAW-2; silent refusal takes the worker's labour without payment. The honest treatment is an attributed exception (GP-10).
- **Trigger.** Attendance or measurement with no covering assignment.
- **Preconditions.** —
- **Mandatory.** Raise an exception; decide explicitly; record the decision and its authority.
- **Prohibited.** Quiet inclusion; quiet exclusion.
- **Exception policy.** —
- **Laws.** LAW-2, LAW-12, PA-8. **Cross-refs.** OT-1, EXC-02, RSK-08.

---

## 9.10 Domain ATT — Attendance

> *The highest-frequency evidentiary act in the enterprise, performed by the least senior actor, at
> the greatest distance from the money. § 1.4.1 in a single domain.*

**ATT-01 — Attendance MUST be captured at the point and time of occurrence.**
- **Rationale.** DP-5. Attendance reconstructed in an office at week's end is testimony about the past, and testimony from an interested party is not evidence.
- **Trigger.** Daily work.
- **Preconditions.** Deployment; assignment.
- **Mandatory.** Capture at site on the day.
- **Prohibited.** Bulk retrospective capture as routine practice.
- **Exception policy.** Connectivity or emergency failure — capture within one working day, recorded as delayed, counted (GP-10).
- **Laws.** LAW-2, CP-1. **Cross-refs.** GP-02, MP-2, RSK-09.

**ATT-02 — Attendance MUST be captured by an enterprise officer, never by the beneficiary.**
- **Rationale.** GP-13 and SOD-7. The party paid by the count cannot create the count.
- **Trigger.** Capture.
- **Preconditions.** —
- **Mandatory.** Capture by Site Supervisor or designated officer.
- **Prohibited.** Capture by Mate, contractor, supplier, or the workers collectively.
- **Exception policy.** **None.**
- **Laws.** LAW-2, CP-2. **Cross-refs.** CLB-03, BRL-08, GNG-04.

**ATT-03 — Attendance reported by an intermediary is a claim and MUST be validated independently.**
- **Rationale.** § 4.2 conflict declaration. Where operational reality requires the Mate to report first, the report enters as a claim and is converted to evidence only by an independent act.
- **Trigger.** Intermediated reporting.
- **Preconditions.** —
- **Mandatory.** Mark as claimed; validate by an enterprise officer; retain both records.
- **Prohibited.** Claim flowing directly into computation.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** CTL-12, BRL-08, GP-13.

**ATT-04 — Attendance MUST NOT be captured for a worker without a covering deployment.**
- **Rationale.** DEP-01. The deployment is the payable population; capture outside it creates payable evidence for an unauthorised person.
- **Trigger.** Capture.
- **Preconditions.** DEP-01.
- **Mandatory.** Test at capture, not at settlement.
- **Prohibited.** Capture first, deploy later.
- **Exception policy.** Same-day deployment amendment (DEP-01), recorded.
- **Laws.** LAW-2. **Cross-refs.** DEP-01, ATT-07.

**ATT-05 — Attendance MUST identify the individual, never a headcount.**
- **Rationale.** A headcount cannot be reconciled, cannot be paid individually, and cannot be proven. Every phantom-labour scenario depends on aggregation.
- **Trigger.** Capture.
- **Preconditions.** WRK-01.
- **Mandatory.** Record worker identity per day.
- **Prohibited.** Gang totals as the primary attendance record.
- **Exception policy.** **None.**
- **Laws.** LAW-2, LAW-5. **Cross-refs.** GNG-05, BRL-06, XCP-01.

**ATT-06 — One worker MUST have at most one validated attendance record per date, enterprise-wide.**
- **Rationale.** LI-16, restated as the operating rule of this domain. It is enforced at validation, not discovered in reporting.
- **Trigger.** Validation.
- **Preconditions.** WRK-02.
- **Mandatory.** Test across all projects, contractors, suppliers, and engagement types; reject the second. **On a transfer date** (BRL-01, CLB-11), attendance attaches to the deployment **in force at the start of the working day**, and the transfer takes effect from the next working day; where a genuine same-day split is required, **one** attendance record carries a split attribution across two activities, preserving one validated record per worker per date.
- **Prohibited.** Post-hoc reconciliation in place of prevention. Two records for one worker on a transfer date; site-level agreement on which project records the day.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** LI-16, BRL-01, BRL-05, CLB-11, XCP-02, RSK-02.

**ATT-07 — Attendance MUST be validated against a covering work assignment.**
- **Rationale.** LAW-2 requires both limbs. Attendance alone establishes presence, not entitlement.
- **Trigger.** Validation.
- **Preconditions.** ASG-01.
- **Mandatory.** Test date against assignment window (SY-9).
- **Prohibited.** Validation on presence alone.
- **Exception policy.** ASG-11 exception route.
- **Laws.** LAW-2. **Cross-refs.** SY-9, ASG-01.

**ATT-08 — The validator MUST NOT be the reporter.**
- **Rationale.** CP-2 at the highest-frequency control point in the capability.
- **Trigger.** Validation.
- **Preconditions.** —
- **Mandatory.** Structural separation of capture and validation.
- **Prohibited.** Self-validation; validation by the same officer as routine.
- **Exception policy.** Single-officer sites — validation by an officer outside the site (§ 4.14.1), recorded as a standing exception and counted.
- **Laws.** LAW-2, LAW-4. **Cross-refs.** SOD-4, SOD-7, § 4.14.1.

**ATT-09 — Attendance MUST record the attendance type explicitly.**
- **Rationale.** DP-9. Full, half, absent, idle, rain, hindrance, leave, and overtime carry different entitlements; an unclassified day is an undefined term and therefore a leakage site.
- **Trigger.** Capture.
- **Preconditions.** Defined attendance-type vocabulary (CP-4).
- **Mandatory.** Record type per worker-day.
- **Prohibited.** Blank treated as present; blank treated as absent.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** CLB-05, ATT-13, DP-9.

**ATT-10 — Attendance evidence method MUST be recorded.**
- **Rationale.** § 5.10: capture method determines evidential weight (Part 11). A biometric record and a supervisor's recollection are not interchangeable, and the record must say which it is.
- **Trigger.** Capture.
- **Preconditions.** —
- **Mandatory.** Record method: biometric, photographic, gate record, supervisor observation, intermediary report.
- **Prohibited.** Method unrecorded.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** Part 11 § 11.3, EV-1.

**ATT-11 — Attendance MUST NOT be capturable for a future date.**
- **Rationale.** LAW-3 applied to presence. Anticipated attendance is not attendance, and its existence in the record is an invitation to settle it.
- **Trigger.** Capture.
- **Preconditions.** —
- **Mandatory.** Structurally prevent future-dated capture.
- **Prohibited.** —
- **Exception policy.** **None.**
- **Laws.** LAW-3. **Cross-refs.** AF-2, MSR-04.

**ATT-12 — Attendance MUST be tested against site and front status for the date.**
- **Rationale.** Presence on a closed site is either misrecorded or fictitious; the calendar is the independent record that makes the test possible (D-10).
- **Trigger.** Validation.
- **Preconditions.** Calendar; hindrance records.
- **Mandatory.** Test against declared closures, holidays, and rain days.
- **Prohibited.** Validation ignoring site status.
- **Exception policy.** Genuine work on a declared closure day — recorded with authorisation.
- **Laws.** LAW-3. **Cross-refs.** GNG-07, CLB-05, I-9.

**ATT-13 — Idle, rain, and hindrance days MUST link to a hindrance record.**
- **Rationale.** LR-4. Payable non-work requires a positive cause; without it the enterprise is paying for absence and cannot later defend the cost or claim against the cause.
- **Trigger.** Capture of a non-working payable day.
- **Preconditions.** OBJ-28.
- **Mandatory.** Link cause; record who declared it.
- **Prohibited.** Idle days recorded without cause.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** CLB-05, LD-2, RSK-36.

**ATT-14 — Overtime hours MUST be recorded separately and only where authorised.**
- **Rationale.** Overtime is the leakage that needs no ghost: a real worker and a larger number. Separation makes it visible; prior authorisation makes it defensible.
- **Trigger.** Capture.
- **Preconditions.** CLB-04 authorisation.
- **Mandatory.** Record hours, authorisation reference, and authoriser.
- **Prohibited.** Overtime merged into day count; unauthorised overtime paid silently or refused silently.
- **Exception policy.** OT-1 route — paid, recorded as exception, counted.
- **Laws.** LAW-12, PA-8. **Cross-refs.** FM-22, OT-1, RSK-35.

**ATT-15 — A disputed attendance record MUST NOT be settled while disputed.**
- **Rationale.** Settling a disputed day forecloses the dispute in the enterprise's favour by default, which is exactly the outcome CP-10 exists to prevent.
- **Trigger.** Dispute raised by worker or contractor.
- **Preconditions.** —
- **Mandatory.** Move to `DISPUTED`; resolve; supersede with a corrected record.
- **Prohibited.** Settlement while disputed; silent resolution in favour of the record holder.
- **Exception policy.** **None.**
- **Laws.** CP-10, LAW-11. **Cross-refs.** § 5.10, MD-1.

**ATT-16 — Attendance correction MUST supersede, never overwrite.**
- **Rationale.** LR-5. The original record is the evidence of what was first claimed, which is exactly what an investigation needs.
- **Trigger.** Correction.
- **Preconditions.** —
- **Mandatory.** Create a corrected record referencing the original; retain both; record the corrector and reason.
- **Prohibited.** In-place edit; deletion.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** GP-08, MBK-03.

**ATT-17 — A closed muster MUST NOT accept further capture.**
- **Rationale.** The close is the point at which the population becomes fixed and computation may begin; a muster that accepts late entries has no such point.
- **Trigger.** Period close.
- **Preconditions.** PG-3.
- **Mandatory.** Reject capture after close; route late facts through LC-12 with restatement.
- **Prohibited.** Silent late insertion.
- **Exception policy.** LR-6 reopening — Finance Controller, recorded, counted.
- **Laws.** LAW-11, LAW-12. **Cross-refs.** LR-6, PG-4, OVR-05.

**ATT-18 — Attendance MUST be reconcilable to independent presence signals where they exist.**
- **Rationale.** GP-23. Gate records, biometric logs, transport manifests, canteen counts, and safety inductions are created for other purposes and therefore make excellent independent checks.
- **Trigger.** Period close; audit; anomaly.
- **Preconditions.** Availability of an independent signal.
- **Mandatory.** Reconcile and investigate variance beyond tolerance.
- **Prohibited.** Treating variance as noise without investigation.
- **Exception policy.** **None** where a signal exists.
- **Laws.** CP-2. **Cross-refs.** RI-7, AUD-06, RSK-01.

**ATT-19 — Attendance patterns MUST be monitored for anomaly signatures.**
- **Rationale.** GP-21 and DP-6. Ghost labour has statistical signatures — perfect attendance, identical patterns across workers, strength unchanged through weather events, new workers appearing only in the final week of a period.
- **Trigger.** Period close; continuous monitoring.
- **Preconditions.** —
- **Mandatory.** Compute and report anomaly indicators to Internal Audit (AF-11).
- **Prohibited.** Reports routed only to the site that generated the data.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** AF-11, AUD-07, RSK-01.

**ATT-20 — Validated attendance is consumed on settlement and MUST NOT be settled again.**
- **Rationale.** GP-04 and SY-2. Re-settlement of a consumed day is duplicate payment (L2) and is prevented structurally, not detected by reconciliation.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Mark `SETTLED`; block further consumption.
- **Prohibited.** Re-opening a settled day for re-payment; parallel settlement through a second path.
- **Exception policy.** **None.** Arrears are a new record referencing the settled one.
- **Laws.** LAW-11, LAW-6 context. **Cross-refs.** LM-6, CLB-07, RI-7.

---

## 9.11 Domain LAB — Statutory labour obligations and welfare

> *CP-9: where enterprise rule and statute conflict, statute prevails. This domain is where the
> enterprise's commercial interest and its legal obligation are most often assumed to be the same
> thing, and are not.*

**LAB-01 — Statutory obligations MUST be identified, owned, and evidenced for every engagement type.**
- **Rationale.** Obligations that no one owns are discharged by no one, and principal-employer liability does not accept "we assumed the contractor did it".
- **Trigger.** Engagement; statutory period close.
- **Preconditions.** Statutory parameters from CAP-TAX/CAP-LEG (D-8).
- **Mandatory.** Record which party discharges each obligation and the evidence of discharge.
- **Prohibited.** Obligation assumed discharged from a contract clause alone.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** BRL-12, CLB-08, RSK-49.

**LAB-02 — The enterprise MUST hold wage records for every worker on its sites, including intermediated workers.**
- **Rationale.** § 4.4. The enterprise is asked, by inspectors and by courts, to produce records for workers it did not pay directly. The answer "the supplier holds them" is not an answer.
- **Trigger.** Engagement; period close.
- **Preconditions.** CTL-02, BRL-04.
- **Mandatory.** Maintain or obtain per-worker wage records; retain per the statutory schedule.
- **Prohibited.** Reliance on the intermediary's undertaking to maintain records.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** BRL-06, LAB-14, RI-8.

**LAB-03 — Absence of documentary identity MUST NOT result in non-payment.**
- **Rationale.** WRK-03. Non-payment of an undocumented worker who has worked is both a statutory breach and an unrecorded enterprise gain, which is worse than the documentation problem it purports to solve.
- **Trigger.** Settlement of an undocumented worker.
- **Preconditions.** Alternative identity established (WRK-03).
- **Mandatory.** Pay validated attendance; record the identity basis used.
- **Prohibited.** Withholding wages pending documentation.
- **Exception policy.** **None.**
- **Laws.** CP-9, PA-8. **Cross-refs.** WRK-03, RSK-30.

**LAB-04 — Statutory registers MUST be maintained from the operational record, not reconstructed for inspection.**
- **Rationale.** A register assembled for an inspection is a document about an inspection, not about the workforce. It also diverges from the payment record, and the divergence is what an inspector looks for.
- **Trigger.** Continuous; inspection.
- **Preconditions.** Attendance and wage records.
- **Mandatory.** Derive registers from the same records that drove payment.
- **Prohibited.** Parallel register maintenance.
- **Exception policy.** **None.**
- **Laws.** CP-9, CP-4. **Cross-refs.** integration O-6, AUD-11.

**LAB-05 — Evidence that intermediated workers were paid MUST be obtained before the intermediary's next settlement.**
- **Rationale.** CTL-05. The only moment at which the enterprise has leverage over an intermediary's wage discipline is while it still holds the next payment.
- **Trigger.** Intermediary settlement.
- **Preconditions.** LAB-02.
- **Mandatory.** Obtain, reconcile, and record.
- **Prohibited.** Settlement without prior-period wage evidence.
- **Exception policy.** Bounded grace, counted, with direct worker enquiry.
- **Laws.** CP-9, PA-8. **Cross-refs.** BRL-09, RI-8, LA-7.

**LAB-06 — Every worker's effective wage MUST be tested against the statutory minimum for trade, grade, region, and date.**
- **Rationale.** FM-25. Minimum-wage compliance is not an average or an aggregate property; it is a per-worker, per-period test, and it is failed one worker at a time.
- **Trigger.** Wage computation.
- **Preconditions.** Statutory minima by effective date (I-8).
- **Mandatory.** Apply FM-25 per worker; block settlement on failure.
- **Prohibited.** Aggregate or gang-average compliance testing.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** MW-1, MW-2, WGR-05.

**LAB-07 — A below-minimum wage MUST NOT be corrected silently.**
- **Rationale.** MW-1. A silent top-up conceals that the enterprise or its supplier attempted to pay below the floor, and conceals the pattern that would reveal a systemic rate error.
- **Trigger.** FM-25 failure.
- **Preconditions.** —
- **Mandatory.** Raise the failure; correct the rate as an attributed act; record the reason; report the frequency.
- **Prohibited.** Automatic silent adjustment.
- **Exception policy.** **None.**
- **Laws.** CP-9, CP-11. **Cross-refs.** MW-1, PC-10, RSK-30.

**LAB-08 — Wages MUST be paid to the worker, and receipt MUST be acknowledged by the worker.**
- **Rationale.** Payment to an intermediary discharges the enterprise's commercial obligation and none of its statutory one. Acknowledgement by the named worker is the only evidence that closes the gap.
- **Trigger.** Disbursement of wages.
- **Preconditions.** Individual wage records.
- **Mandatory.** Obtain acknowledgement per worker, by signature, thumb impression, biometric, or bank credit confirmation.
- **Prohibited.** Bulk acknowledgement by an intermediary on the workers' behalf.
- **Exception policy.** **None.**
- **Laws.** CP-9, PA-8. **Cross-refs.** BRL-06, CLB-01, RI-8.

**LAB-09 — Every worker MUST be able to see the computation of their own wage.**
- **Rationale.** CP-10 and GP-19. Transparency to the worker is the cheapest audit of the attendance record the enterprise holds, and the most reliable detector of intermediary skimming.
- **Trigger.** Settlement.
- **Preconditions.** Wage Card.
- **Mandatory.** Present days, rate, gross, deductions, and net in an intelligible form.
- **Prohibited.** Net-only disclosure.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** CLB-12, WKS-09.

**LAB-10 — Wage payment MUST NOT be delayed beyond the statutory or contractual period.**
- **Rationale.** Delay is both a statutory breach and the mechanism by which a workforce becomes dependent on advances, which then become recoveries, which then become disputes.
- **Trigger.** Settlement period end.
- **Preconditions.** —
- **Mandatory.** Settle within the period; where a commercial dispute exists with an intermediary, pay the workers regardless (CTL-06).
- **Prohibited.** Wage delay used as commercial leverage.
- **Exception policy.** **None.**
- **Laws.** CP-9, PA-8. **Cross-refs.** CTL-06, BRL-13, RSK-33.

**LAB-11 — Deductions from wages MUST be lawful, authorised, and within the statutory ceiling.**
- **Rationale.** FM-27. Recovery discipline is a virtue up to the lawful ceiling and an offence beyond it; the ceiling is not a guideline.
- **Trigger.** Wage computation.
- **Preconditions.** Statutory deduction ceiling by date.
- **Mandatory.** Test every deduction set against FM-27; carry the excess forward.
- **Prohibited.** Deduction beyond the ceiling; unauthorised deduction of any kind.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** CLB-10, REC-13, PC-9.

**LAB-12 — Welfare obligations that create a recovery MUST be valued and recorded like any other recovery.**
- **Rationale.** § 2.2.1 boundary ruling: welfare is in scope only where it creates a recovery or affects payment. Where it does, informality is the leakage.
- **Trigger.** Provision of food, housing, transport, or utilities against wages.
- **Preconditions.** Contractual or statutory basis for the recovery.
- **Mandatory.** Value at the agreed basis; record; apply within the lawful ceiling.
- **Prohibited.** Ad hoc site-level deduction for welfare provision.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** REC-06, LAB-11.

**LAB-13 — A departing worker MUST be settled without requiring a claim.**
- **Rationale.** GP-12. The dues least likely to be claimed are the ones most likely to be retained, and retention of unclaimed wages is an unrecorded gain to the enterprise.
- **Trigger.** Separation; demobilisation; site closure.
- **Preconditions.** Attendance resolved.
- **Mandatory.** Compute and settle; record unlocatable-worker dues as liabilities.
- **Prohibited.** Settlement conditional on the worker asking.
- **Exception policy.** **None.**
- **Laws.** CP-9, PA-8. **Cross-refs.** WRK-14, DEP-11, CLS-09.

**LAB-14 — Statutory records MUST be retained for the statutory period regardless of project closure.**
- **Rationale.** § 3.4.4 temporal boundary. Obligations outlive projects, and the record is demanded when the project team no longer exists (objective O-9).
- **Trigger.** Project or contract closure.
- **Preconditions.** —
- **Mandatory.** Retain and keep reconstructible; transfer custody on closure.
- **Prohibited.** Purge at project close; custody left with a demobilised team.
- **Exception policy.** **None.**
- **Laws.** LAW-11, CP-9. **Cross-refs.** LI-33, AUD-12, CLS-14.

---

## 9.12 Domain WGR — Wage rates

> *A rate is an instrument, not a number. Every rule in this domain exists because a rate applied
> without authority is indistinguishable from a rate applied with one, until an audit.*

**WGR-01 — Every wage rate MUST derive from an authorised schedule with an effective date.**
- **Rationale.** GP-01 and CP-4. A rate with no instrument behind it cannot be defended, reconciled, or applied consistently across two adjacent sites.
- **Trigger.** Wage computation; engagement.
- **Preconditions.** Authorised wage schedule.
- **Mandatory.** Resolve by trade, grade, region, and effective date.
- **Prohibited.** Site-set rates; rates carried over from another project by assumption.
- **Exception policy.** Centrally approved premium, time-boxed and recorded.
- **Laws.** CP-4, LAW-5. **Cross-refs.** CLB-09, FM-21, GP-17.

**WGR-02 — Rate MUST follow the worker's evidenced classification, not their claimed one.**
- **Rationale.** WRK-05. Grade inflation is silent, permanent, and compounding — leakage form L7 in the labour path.
- **Trigger.** Wage computation.
- **Preconditions.** WRK-05 classification with evidence.
- **Mandatory.** Apply the rate for the evidenced grade.
- **Prohibited.** Grade asserted by the Mate, the supplier, or the worker without evidence.
- **Exception policy.** Provisional grade for one period, recorded.
- **Laws.** LAW-5. **Cross-refs.** WRK-05, RSK-31.

**WGR-03 — Wage rates MUST be time-versioned and never edited in place.**
- **Rationale.** GP-08 and RR-2. Editing a rate silently restates every past settlement computed from it, and no one can see that it happened.
- **Trigger.** Rate revision.
- **Preconditions.** —
- **Mandatory.** Create a new version with its own effective date; retain prior versions.
- **Prohibited.** In-place edit; retrospective application without restatement.
- **Exception policy.** Restatement by executive authority, applied visibly.
- **Laws.** LAW-11. **Cross-refs.** RR-2, FIN-07.

**WGR-04 — Work MUST be valued at the rate in force on the work date.**
- **Rationale.** DP-12, FM-00. Valuing at the computation date transfers the benefit of every rate movement to whichever party the timing favours, invisibly.
- **Trigger.** Wage computation.
- **Preconditions.** WGR-03.
- **Mandatory.** Resolve by work date.
- **Prohibited.** Resolution by payment date, approval date, or current date.
- **Exception policy.** **None.**
- **Laws.** DP-12. **Cross-refs.** FM-00, GP-17, PC-2.

**WGR-05 — Every wage rate MUST be at or above the statutory minimum for its classification and date.**
- **Rationale.** A schedule that permits a sub-minimum rate has institutionalised a statutory breach and will produce it consistently.
- **Trigger.** Rate schedule approval; statutory revision.
- **Preconditions.** Statutory minima by effective date.
- **Mandatory.** Test the schedule on approval and on every statutory revision; correct forward.
- **Prohibited.** Schedule rates below the floor "to be topped up in computation".
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-06, MW-1.

**WGR-06 — A statutory minimum revision MUST be applied from its own effective date.**
- **Rationale.** I-8 and II-3. Late application creates arrears the enterprise owes and did not record; early application misstates cost.
- **Trigger.** Statutory notification.
- **Preconditions.** —
- **Mandatory.** Apply from the effective date; compute and settle arrears where the notification is late.
- **Prohibited.** Application from the notification date where the statute says otherwise.
- **Exception policy.** **None.**
- **Laws.** CP-9, DP-12. **Cross-refs.** II-3, LAB-06.

**WGR-07 — Overtime multipliers MUST be the higher of statutory and contractual.**
- **Rationale.** FM-22. The enterprise may be more generous than the statute; it may never be less, and the computation must not require anyone to remember which applies.
- **Trigger.** Overtime computation.
- **Preconditions.** Both values known by date.
- **Mandatory.** Apply the higher.
- **Prohibited.** Contractual multiplier applied where lower than statutory.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** FM-22, ATT-14.

**WGR-08 — Piece rates MUST be authorised centrally and reconcilable to a day-rate equivalent.**
- **Rationale.** A piece rate that yields less than the minimum wage for a normal day's output is a minimum-wage breach expressed as productivity, and it is invisible unless the equivalence is computed.
- **Trigger.** Piece-rate agreement; settlement.
- **Preconditions.** Norm output for the item.
- **Mandatory.** Compute the day-rate equivalent at norm output; test against the statutory minimum.
- **Prohibited.** Site-agreed piece rates; piece rates with no norm.
- **Exception policy.** **None.**
- **Laws.** CP-9, CP-4. **Cross-refs.** PCR-02, PCR-06, LAB-06.

**WGR-09 — Scarce-trade premiums MUST be time-boxed, attributed, and reviewed.**
- **Rationale.** LA-5. A premium granted for a genuine scarcity becomes a permanent rate the moment no one reviews it, and it propagates by comparison to workers who were never scarce.
- **Trigger.** Premium grant.
- **Preconditions.** Central approval.
- **Mandatory.** Record reason, authority, expiry; review at expiry.
- **Prohibited.** Open-ended premiums.
- **Exception policy.** Extension by the granting authority, recorded and counted.
- **Laws.** LAW-12. **Cross-refs.** WGR-01, GP-10.

**WGR-10 — Rate exceptions MUST be reported by frequency and by authoriser.**
- **Rationale.** GP-10 and LI-30. An exception that is recorded but never counted has not been recorded.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report count and value of rate exceptions by authoriser.
- **Prohibited.** Exception data available only on request.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** EXC-08, AUD-08.

**WGR-11 — Rate schedules MUST be consistent across projects within a region and period.**
- **Rationale.** Inconsistent rates for identical work in the same labour market produce grievance, attrition to the higher-paying site, and an unanswerable question in an inspection.
- **Trigger.** Schedule approval; periodic review.
- **Preconditions.** —
- **Mandatory.** Test for cross-project inconsistency; justify or correct.
- **Prohibited.** Unexplained divergence.
- **Exception policy.** Documented local-market justification.
- **Laws.** CP-4. **Cross-refs.** WGR-01, PRD-09.

**WGR-12 — Applied rates MUST be visible on the worker's wage record.**
- **Rationale.** CP-10. A worker who cannot see the rate cannot detect that the wrong one was applied, and the wrong rate is the most common silent error in this domain.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Show rate and its basis on the Wage Card.
- **Prohibited.** Rate withheld from the worker's record.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** LAB-09, CLB-12.

---

## 9.13 Domain DWG — Daily wages

> *Daily-wage engagement is the simplest payment path in the capability and therefore the one where
> controls are most often assumed to be unnecessary.*

**DWG-01 — A daily wage MUST be payable only against a validated attendance day.**
- **Rationale.** LAW-2. The day is the unit of entitlement; without validation there is no unit, only an assertion.
- **Trigger.** Wage computation.
- **Preconditions.** ATT-06, ATT-07.
- **Mandatory.** Count only `VALIDATED` or `LOCKED` days (FM-20).
- **Prohibited.** Payment from captured-but-unvalidated attendance.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** FM-20, PEL-02.

**DWG-02 — Half-day and part-day treatment MUST follow a defined rule, not site discretion.**
- **Rationale.** LA-2. "Half day" undefined is a leakage site repeated thousands of times per period.
- **Trigger.** Attendance capture.
- **Preconditions.** Defined attendance-type vocabulary.
- **Mandatory.** Define thresholds; apply uniformly (FM-20).
- **Prohibited.** Site-level interpretation.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** ATT-09, FM-20.

**DWG-03 — Daily wage computation MUST be reproducible by hand.**
- **Rationale.** SC-10 and CP-10. A daily wage the worker cannot recompute is a wage the worker cannot dispute, and a wage no auditor can verify without the system.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Present days × rate + additions − deductions.
- **Prohibited.** Composite figures with no derivation.
- **Exception policy.** **None.**
- **Laws.** CP-7, CP-10. **Cross-refs.** FM-21, LAB-09.

**DWG-04 — Daily-wage engagement MUST NOT be used to circumvent measurement for contracted work.**
- **Rationale.** UG-3. Day work is the weakest contractual basis; used at scale it converts an outcome contract into an unmeasured time contract and removes LAW-1 from the payment path.
- **Trigger.** Day-work authorisation.
- **Preconditions.** Instrument provision for day work.
- **Mandatory.** Authorise in advance; cap; reconcile to output.
- **Prohibited.** Unbounded day work; day work substituted for measurable items.
- **Exception policy.** Executive approval, time-boxed, counted.
- **Laws.** LAW-1. **Cross-refs.** UG-3, CTL-01, RSK-13.

**DWG-05 — Daily wages MUST be disbursed to the worker within the defined cycle.**
- **Rationale.** LAB-10. Daily-wage workers are, by definition, those least able to absorb delay.
- **Trigger.** Cycle end.
- **Preconditions.** —
- **Mandatory.** Disburse within the cycle; record acknowledgement.
- **Prohibited.** Rolling delay; payment contingent on the contractor's own receipt.
- **Exception policy.** **None.**
- **Laws.** PA-8, CP-9. **Cross-refs.** CLB-01, LAB-08.

**DWG-06 — Overtime on daily-wage engagement MUST be authorised, recorded, and paid at the correct multiplier.**
- **Rationale.** ATT-14 and WGR-07 combined at the point where they are most often ignored.
- **Trigger.** Overtime worked.
- **Preconditions.** CLB-04.
- **Mandatory.** Authorise, record, compute by FM-22.
- **Prohibited.** Overtime absorbed into the day rate.
- **Exception policy.** OT-1.
- **Laws.** CP-9, LAW-12. **Cross-refs.** FM-22, WGR-07.

**DWG-07 — Daily-wage cost MUST be attributed to an activity.**
- **Rationale.** CLB-06. Unattributed daily wages are the fastest route to a project whose labour cost cannot be explained.
- **Trigger.** Validation.
- **Preconditions.** ASG-03.
- **Mandatory.** Attribute.
- **Prohibited.** Blanket attribution as routine.
- **Exception policy.** Bounded general activity.
- **Laws.** LAW-5. **Cross-refs.** ASG-03, PRD-02.

**DWG-08 — Advances against daily wages MUST be recovered within the lawful ceiling.**
- **Rationale.** CLB-10 and FM-27. The daily-wage worker is the most likely to take an advance and the least able to survive an unlawful recovery.
- **Trigger.** Settlement.
- **Preconditions.** Recovery plan bound at advance approval.
- **Mandatory.** Apply FM-27; carry excess forward.
- **Prohibited.** Full recovery in one cycle where it breaches the ceiling.
- **Exception policy.** **None.**
- **Laws.** CP-9, LAW-7. **Cross-refs.** ADV-11, LAB-11.

**DWG-09 — Daily-wage rosters MUST be reconcilable to the muster and to disbursement.**
- **Rationale.** GP-23 and RI-8. Three records of the same population, created for different purposes, is a control; one record is a claim.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Reconcile roster, muster, and disbursement; investigate variance.
- **Prohibited.** Single-source reporting.
- **Exception policy.** **None.**
- **Laws.** CP-2. **Cross-refs.** RI-7, RI-8, AUD-06.

**DWG-10 — Cash disbursement of daily wages MUST carry compensating controls.**
- **Rationale.** § 1.4.10: informality is not fraud, but it is an environment in which fraud is undetectable. Cash is often unavoidable; uncontrolled cash is not.
- **Trigger.** Cash wage disbursement.
- **Preconditions.** —
- **Mandatory.** Independent witness to disbursement; per-worker acknowledgement; surprise verification of a sample; segregation of the officer who computes from the officer who disburses.
- **Prohibited.** Cash disbursed by the officer who validated the attendance.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-3. **Cross-refs.** SOD-3, LAB-08, RSK-34.

---

## 9.14 Domain WKS — Weekly and periodic settlement

> *Settlement is where accumulated evidence becomes a single number. It is the last point at which
> an error is cheap to correct.*

**WKS-01 — A settlement MUST be computed only from a closed muster.**
- **Rationale.** Computing from an open population produces a figure that changes after it is approved, which makes the approval meaningless.
- **Trigger.** Settlement computation.
- **Preconditions.** ATT-17 muster closed.
- **Mandatory.** Close first, compute second.
- **Prohibited.** Computation on an open muster.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** § 6.4.1, PG-3.

**WKS-02 — Settlement arithmetic MUST be independently verified before approval.**
- **Rationale.** GP-03 and SC-10. The originator's arithmetic is the originator's claim about arithmetic.
- **Trigger.** Settlement `COMPUTED → VERIFIED`.
- **Preconditions.** —
- **Mandatory.** Independent recomputation reproducing the figure exactly.
- **Prohibited.** Verification by the computing officer; verification by sampling only.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SC-10, G-8.

**WKS-03 — Settlement MUST reconcile to the muster day count.**
- **Rationale.** RI-7. Days settled that exceed days validated is duplicate payment; days validated that are never settled is worker detriment. Both are found by the same test.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Reconcile both directions; investigate either variance.
- **Prohibited.** One-directional reconciliation.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** RI-7, ATT-20.

**WKS-04 — The statutory minimum test MUST pass before approval.**
- **Rationale.** LAB-06. Approving a settlement that fails the floor commits the enterprise to a breach it has already detected.
- **Trigger.** Approval.
- **Preconditions.** FM-25 evaluated.
- **Mandatory.** Block approval on failure.
- **Prohibited.** Approval with a flagged failure "to be corrected next period".
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** MW-1, LAB-07.

**WKS-05 — Recoveries due in the period MUST be applied before approval.**
- **Rationale.** LAW-8 and G-3 at the labour path. A settlement approved without recovery has forfeited the deduction opportunity for that period.
- **Trigger.** Settlement.
- **Preconditions.** Recovery schedule.
- **Mandatory.** Apply; where deferred, record the deferral as an exception with authority.
- **Prohibited.** Silent omission.
- **Exception policy.** Deferral, attributed and counted (LI-12).
- **Laws.** LAW-8. **Cross-refs.** REC-09, FM-26.

**WKS-06 — Settlement approval MUST be by an actor who neither computed nor verified it.**
- **Rationale.** GP-03, LAW-4, SOD-4.
- **Trigger.** Approval.
- **Preconditions.** —
- **Mandatory.** Structural separation.
- **Prohibited.** Any two of compute/verify/approve by one actor.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SOD-4, SOD-10, § 6.14.

**WKS-07 — Approved settlement MUST NOT be altered.**
- **Rationale.** LI-23 applied to the labour path. An alterable approval is not an approval.
- **Trigger.** Post-approval change request.
- **Preconditions.** —
- **Mandatory.** Cancel and re-originate, with both records retained.
- **Prohibited.** Amount, payee, or period edited after approval.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LI-23, FIN-05.

**WKS-08 — Settlement MUST consume the attendance days it settles.**
- **Rationale.** GP-04, SY-2, ATT-20. Consumption is what prevents the same day funding two settlements.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Mark `SETTLED`; block re-consumption.
- **Prohibited.** —
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LM-6, RI-7.

**WKS-09 — Every settlement MUST produce an individual wage record.**
- **Rationale.** BRL-06, LAB-02. A settlement that produces only a total has settled a number, not a workforce.
- **Trigger.** Settlement.
- **Preconditions.** —
- **Mandatory.** Wage Card per worker, with derivation.
- **Prohibited.** Aggregate-only settlement records.
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-9. **Cross-refs.** GNG-05, LAB-09.

**WKS-10 — Failed or returned wage disbursement MUST reinstate the worker's entitlement.**
- **Rationale.** LI-24. A failed wage payment that disappears is an unrecorded enterprise gain and an unpaid worker, simultaneously.
- **Trigger.** Disbursement failure.
- **Preconditions.** —
- **Mandatory.** Reinstate automatically; re-attempt; record.
- **Prohibited.** Silent absorption.
- **Exception policy.** **None.**
- **Laws.** PA-8. **Cross-refs.** LI-24, I-10.

**WKS-11 — Unsettled entitlement MUST age and escalate.**
- **Rationale.** GP-20 and RI-12's labour equivalent. Entitlement that sits unsettled becomes untraceable as the workforce disperses.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report unsettled validated attendance by age; escalate beyond threshold.
- **Prohibited.** Unsettled entitlement invisible in reporting.
- **Exception policy.** **None.**
- **Laws.** CP-11, PA-8. **Cross-refs.** RI-12, WRK-14.

**WKS-12 — Settlement periods MUST be closed positively and MUST NOT reopen silently.**
- **Rationale.** PG-3, PG-4. A period that closes by the calendar and reopens by convenience has no closing point at all.
- **Trigger.** Period close.
- **Preconditions.** Checklist satisfied.
- **Mandatory.** Positive close with checklist evidence; reopening only by LC-12.
- **Prohibited.** Silent reopening; retrospective insertion.
- **Exception policy.** Finance Controller, recorded, counted.
- **Laws.** LAW-11, LAW-12. **Cross-refs.** PG-3, PG-4, ATT-17.

---

## 9.15 Domain PCR — Piece-rate work

> *Piece rate pays for output rather than presence. It is the most honest labour arrangement in
> construction and the one most easily converted into an unmeasured payment.*

**PCR-01 — Piece-rate payment MUST be against measured output.**
- **Rationale.** FM-23. Piece rate does not escape LAW-1; it uses measurement to price labour instead of contract work. Unmeasured piece rate is simply an unsupported payment.
- **Trigger.** Piece-rate settlement.
- **Preconditions.** Verified measurement of the output.
- **Mandatory.** Measure and verify output before valuation.
- **Prohibited.** Payment on the gang leader's declared output.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-5. **Cross-refs.** FM-23, MSR-01, GP-13.

**PCR-02 — Piece rates MUST be centrally authorised with a defined norm output.**
- **Rationale.** WGR-08. Without a norm, the rate cannot be tested against the statutory minimum, and the arrangement becomes a lawful-looking route below the floor.
- **Trigger.** Rate setting.
- **Preconditions.** Norm schedule.
- **Mandatory.** Record rate, norm, and effective date.
- **Prohibited.** Site-agreed piece rates.
- **Exception policy.** **None.**
- **Laws.** CP-4, CP-9. **Cross-refs.** WGR-08, PCR-06.

**PCR-03 — Piece-rate output MUST be attributable to identified workers.**
- **Rationale.** Output attributed to a gang without allocation cannot be tested against any individual's statutory entitlement (GNG-05).
- **Trigger.** Settlement.
- **Preconditions.** Gang composition; attendance.
- **Mandatory.** Allocate by FM-29 or by an evidenced individual output record.
- **Prohibited.** Gang-total-only settlement.
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-9. **Cross-refs.** FM-29, BRL-06.

**PCR-04 — Piece-rate output MUST NOT be measured by the party paid for it.**
- **Rationale.** GP-13 at its sharpest: the measurer's own earnings rise with the measurement.
- **Trigger.** Measurement of piece-rate output.
- **Preconditions.** —
- **Mandatory.** Measurement by an enterprise officer; check per § 8.8.
- **Prohibited.** Self-measurement; measurement by the Mate.
- **Exception policy.** **None.**
- **Laws.** CP-2, LAW-4. **Cross-refs.** SOD-1, GNG-04.

**PCR-05 — Piece-rate output MUST NOT be counted twice against contract measurement.**
- **Rationale.** The same physical work paid once as piece-rate labour and once as a contractor's measured item is leakage form L2 across two payment paths, and neither path sees the other.
- **Trigger.** Measurement; billing.
- **Preconditions.** —
- **Mandatory.** Mark output consumed by the path that settled it; reconcile paths at period close.
- **Prohibited.** Parallel valuation of one quantity on both paths.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** GP-04, SY-1, RSK-16.

**PCR-06 — Piece-rate earnings MUST be tested against the statutory minimum for the period.**
- **Rationale.** FM-25 applies to effective receipt regardless of the payment basis. Low output does not license sub-minimum payment.
- **Trigger.** Settlement.
- **Preconditions.** Days worked; statutory minimum.
- **Mandatory.** Compute effective daily wage; block settlement on failure; correct as an attributed act.
- **Prohibited.** "Output was low" as justification for sub-minimum receipt.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-06, MW-1.

**PCR-07 — Rejected or defective output MUST NOT be paid at piece rate.**
- **Rationale.** MP-9 and LI-07. Paying for rejected output funds rework twice — once to produce the defect and once to correct it.
- **Trigger.** Quality rejection.
- **Preconditions.** CAP-QLT acceptance record (I-4).
- **Mandatory.** Exclude rejected output from measurement.
- **Prohibited.** Paying at a discounted rate for rejected work.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** LI-07, MSR-08.

**PCR-08 — Rework MUST NOT be paid as new output.**
- **Rationale.** Rework re-executes work already paid; measuring it as fresh output is duplicate payment for a single unit of value delivered.
- **Trigger.** Rework execution.
- **Preconditions.** Identification of the original output.
- **Mandatory.** Record rework against the original; recover where the fault is the executor's.
- **Prohibited.** Rework measured as new production.
- **Exception policy.** Enterprise-caused rework — payable, recorded with cause.
- **Laws.** LAW-1, LAW-8. **Cross-refs.** REC-07, RSK-17.

**PCR-09 — Piece-rate arrangements MUST NOT displace attendance recording.**
- **Rationale.** Attendance remains the statutory record and the productivity denominator even where payment is by output. Abandoning it removes both the compliance evidence and the anomaly detector.
- **Trigger.** Piece-rate engagement.
- **Preconditions.** —
- **Mandatory.** Capture attendance normally.
- **Prohibited.** "Piece rate, therefore no muster".
- **Exception policy.** **None.**
- **Laws.** LAW-2, CP-9. **Cross-refs.** ATT-01, PRD-04.

**PCR-10 — Piece-rate productivity outliers MUST be investigated, in both directions.**
- **Rationale.** MR-6. Impossible output signals over-measurement; collapsed output signals ghost labour or misattribution. A one-sided check finds only the second.
- **Trigger.** Period close.
- **Preconditions.** Norms.
- **Mandatory.** Report and investigate variance beyond tolerance either way.
- **Prohibited.** Investigating only underperformance.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** MR-6, PRD-06, AUD-07.

---

## 9.16 Domain PRD — Productivity

> *Productivity is analytical, never financial (PD-1). Its value to this capability is as a detector:
> it is the only control that compares two independent records — effort and output — that were
> created by different actors for different purposes.*

**PRD-01 — Productivity MUST NOT adjust entitlement.**
- **Rationale.** PD-1. Entitlement follows measured work at contracted rates. Adjusting payment for productivity converts a contract into a performance opinion.
- **Trigger.** Any proposal to vary payment on productivity grounds.
- **Preconditions.** —
- **Mandatory.** Route productivity findings to award, forecasting, and investigation.
- **Prohibited.** Productivity-based payment adjustment.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-5. **Cross-refs.** PD-1, PC-11.

**PRD-02 — Effort MUST be attributable to the activity whose output is measured.**
- **Rationale.** FM-31 requires a shared denominator. Effort on one activity and output on another produce a meaningless ratio that will be relied upon anyway.
- **Trigger.** Attendance validation; measurement.
- **Preconditions.** ASG-03.
- **Mandatory.** Common activity coding across effort and output.
- **Prohibited.** Productivity computed across mismatched activity sets.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** ASG-03, CLB-06.

**PRD-03 — Productivity MUST be computed for every activity with a defined norm.**
- **Rationale.** GP-21. A control that is computed selectively is a control that can be avoided by selection.
- **Trigger.** Period close.
- **Preconditions.** Norms; measured output.
- **Mandatory.** Compute and report; record where a norm is absent.
- **Prohibited.** Computation only where results are expected to be favourable.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** FM-31, FM-33.

**PRD-04 — Productivity MUST use validated attendance, not planned deployment.**
- **Rationale.** Planned effort measures intent; validated effort measures reality. Using the former produces a figure that cannot detect ghost labour, because ghosts are not in the plan.
- **Trigger.** Computation.
- **Preconditions.** Validated attendance.
- **Mandatory.** Use validated worker-days.
- **Prohibited.** Deployment strength as the denominator.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** FM-31, MR-6.

**PRD-05 — Favourable productivity anomalies MUST be treated as leakage signals.**
- **Rationale.** PD-1's constitutional note: a sudden improvement in measured output per worker-day is more often over-measurement than genius.
- **Trigger.** Variance beyond tolerance.
- **Preconditions.** —
- **Mandatory.** Investigate as a potential measurement anomaly; route to Internal Audit.
- **Prohibited.** Reporting favourable variance as achievement without verification.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** MR-6, AF-11, RSK-15.

**PRD-06 — Productivity norms MUST be authorised, versioned, and reviewed.**
- **Rationale.** A norm nobody owns drifts to match whatever is being achieved, at which point it detects nothing.
- **Trigger.** Norm setting; periodic review.
- **Preconditions.** —
- **Mandatory.** Central authorisation with effective dates; periodic review against evidence.
- **Prohibited.** Site-adjusted norms; norms revised to eliminate a variance.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** WGR-08, PCR-02.

**PRD-07 — Labour cost per unit MUST be reported against budget by activity.**
- **Rationale.** § 2.1.11 cost intelligence: the enterprise cannot forecast exposure it cannot decompose.
- **Trigger.** Period close.
- **Preconditions.** Attributed cost; measured output.
- **Mandatory.** Report `C_unit` (FM-32) against budget.
- **Prohibited.** Project-level-only cost reporting.
- **Exception policy.** **None.**
- **Laws.** LAW-5. **Cross-refs.** FM-32, CLB-02.

**PRD-08 — Productivity reporting MUST reach the officer accountable for the cost.**
- **Rationale.** GP-21. A metric that reaches only its own producer changes nothing.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Route to Project Manager, Finance Controller, and Internal Audit.
- **Prohibited.** Circulation limited to the site.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** AF-11, R-13.

**PRD-09 — Productivity comparison across projects MUST account for declared conditions.**
- **Rationale.** Comparing unlike sites produces conclusions that are wrong and confident, and the response — pressure on the measurer — damages exactly the control that matters (§ 4.6).
- **Trigger.** Cross-project reporting.
- **Preconditions.** Recorded site conditions, hindrances, and access constraints.
- **Mandatory.** Normalise or disclose the conditions alongside the comparison.
- **Prohibited.** Ranking sites on unadjusted productivity.
- **Exception policy.** **None.**
- **Laws.** CP-8. **Cross-refs.** ATT-13, § 4.6.

---

## 9.17 Domain MSR — Measurement

> *Part 8 defines the engine. This domain states the rules the enterprise obeys when operating it.*

**MSR-01 — Value MUST NOT attach to unmeasured work.**
- **Rationale.** LAW-1 stated as the operating rule of the domain. Every other rule here is a defence of this one.
- **Trigger.** Any valuation of contracted work.
- **Preconditions.** —
- **Mandatory.** Require a measurement entry for every valued quantity.
- **Prohibited.** Valuation from a claim, a schedule, a programme, or a percentage-complete assertion.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** G-1, CTL-01, EDR-02.

**MSR-02 — Measurement MUST be performed by an enterprise officer competent in the item measured.**
- **Rationale.** MP-4. Accountability requires competence; a measurement taken by someone who cannot read the item description is an accountable error waiting to be attributed.
- **Trigger.** Measurement.
- **Preconditions.** —
- **Mandatory.** Record the measurer; maintain competence records.
- **Prohibited.** Measurement by contractor staff (CTL-08).
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-6. **Cross-refs.** § 4.6, CTL-08.

**MSR-03 — Measurement MUST record the work as executed, against the item as described.**
- **Rationale.** MP-8. Misclassification is leakage forms L3 and L7 simultaneously, and it is invisible because the quantity is correct.
- **Trigger.** Measurement.
- **Preconditions.** Rate schedule item in force.
- **Mandatory.** Record both the item and the description of work as executed (ME-2).
- **Prohibited.** Classification chosen for rate advantage; description copied from the item without observation.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-5. **Cross-refs.** ME-2, AF-6, RSK-12.

**MSR-04 — Future-dated measurement MUST be structurally impossible.**
- **Rationale.** LAW-3, LI-05, AF-2. Certainty that work will be completed is not a substitute for its completion.
- **Trigger.** Measurement entry.
- **Preconditions.** —
- **Mandatory.** Prevent at entry.
- **Prohibited.** Warning-only treatment.
- **Exception policy.** **None.**
- **Laws.** LAW-3. **Cross-refs.** LI-05, ATT-11.

**MSR-05 — Contractor-supplied measurements MUST be re-measured, not adopted.**
- **Rationale.** GP-13, CTL-03. Adopting the claimant's measurement removes the only independent step in the contract path.
- **Trigger.** Receipt of contractor measurement.
- **Preconditions.** —
- **Mandatory.** Treat as a claim; measure independently.
- **Prohibited.** Adoption with a countersignature.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-2. **Cross-refs.** CTL-03, JM-4.

**MSR-06 — Every measurement MUST be checked by an actor who did not measure it.**
- **Rationale.** SOD-1, CK-1. The check is the structural embodiment of CP-2 and the primary defence against L3.
- **Trigger.** Measurement verification.
- **Preconditions.** Declared check percentage.
- **Mandatory.** Apply the declared check; record its extent (CK-6).
- **Prohibited.** Verification by the measurer; check omitted for low value without a declared policy.
- **Exception policy.** Reduced independence in small teams — recorded as a standing exception, counted (CK-7).
- **Laws.** LAW-4, CP-2. **Cross-refs.** CK-1…CK-7, § 4.14.1.

**MSR-07 — The checker MUST NOT increase a measurement.**
- **Rationale.** LI-06. The asymmetry removes the progress-pressure incentive (§ 1.4.4) from the verification step; an increase requires a fresh measurement that is itself checked.
- **Trigger.** Check.
- **Preconditions.** —
- **Mandatory.** Confirm or reduce; route increases to re-measurement.
- **Prohibited.** Upward adjustment at check.
- **Exception policy.** **None.**
- **Laws.** CP-2. **Cross-refs.** LI-06, MSR-06.

**MSR-08 — Work not accepted by quality MUST be excluded from measurement, not discounted.**
- **Rationale.** LI-07, MP-9. A discounted measurement is a negotiated quantity, and negotiated quantities are the mechanism of § 1.4.12.
- **Trigger.** Measurement of work with an open quality finding.
- **Preconditions.** CAP-QLT status (I-4).
- **Mandatory.** Exclude; re-measure after acceptance.
- **Prohibited.** Measuring at a reduced quantity to reflect quality.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** LI-07, PCR-07.

**MSR-09 — Work that will become concealed MUST be jointly measured before concealment.**
- **Rationale.** GP-22, JM-2. Once concealed, the enterprise's only options are the contractor's record or destructive verification.
- **Trigger.** Imminent concealment.
- **Preconditions.** —
- **Mandatory.** Joint measurement with the contractor; 100% check (CK-2).
- **Prohibited.** Billing concealed work measured only after concealment.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-3. **Cross-refs.** JM-2, AF-3, MI-11.

**MSR-10 — Measurement MUST record location to re-measurable granularity.**
- **Rationale.** MP-7. A quantity that cannot be re-found cannot be re-measured, and an unverifiable measurement is not billable.
- **Trigger.** Measurement.
- **Preconditions.** Site structure.
- **Mandatory.** Record to grid, level, face, or chainage as the work requires.
- **Prohibited.** Building- or floor-level-only location.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** ME-3, MI-4.

**MSR-11 — Measurement evidence MUST be captured at the time of measurement.**
- **Rationale.** MP-6, EV-2. Evidence assembled afterwards to support a recorded quantity is testimony about a claim.
- **Trigger.** Measurement.
- **Preconditions.** —
- **Mandatory.** Attach artefacts at entry; record any later attachment as later (EV-2).
- **Prohibited.** Bulk evidence attachment at bill time.
- **Exception policy.** **None.**
- **Laws.** CP-1. **Cross-refs.** EV-2, MBK-06.

**MSR-12 — A measurement MUST NOT be edited; corrections supersede.**
- **Rationale.** MP-12, MB-3, LAW-11. The original is the record of what was first asserted, which is the fact an investigation needs most.
- **Trigger.** Correction.
- **Preconditions.** —
- **Mandatory.** Revision referencing the original, with reason; both retained and visible.
- **Prohibited.** In-place edit; deletion; silent cancellation.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** RV-1, MBK-03.

**MSR-13 — A verified measurement MUST be consumed by exactly one bill.**
- **Rationale.** LM-6, SY-1, AF-1. This is the structural prevention of duplicate billing (L2).
- **Trigger.** Billing.
- **Preconditions.** —
- **Mandatory.** Mark consumed; block re-consumption enterprise-wide. **On cancellation or rejection of a bill**, return its consumed entries to `VERIFIED` as an attributed act recorded against **both** the bill and each entry, and require fresh check-measurement confirmation before those entries may be billed again.
- **Prohibited.** Re-billing after cancellation of a bill without restoring and re-verifying the entry. Restoration performed silently, in bulk, or by the actor who prepared the cancelled bill.
- **Exception policy.** **None.**
- **Laws.** LAW-11, LAW-6. **Cross-refs.** SY-1, RBL-13, XCP-03, RSK-18.

**MSR-14 — Measurement MUST NOT be performed against an item with no rate in force.**
- **Rationale.** RR-1, SR-1. Measuring first and pricing later transfers the pricing decision to the moment of least leverage (SR-3).
- **Trigger.** Measurement.
- **Preconditions.** Rate resolution (FM-00).
- **Mandatory.** Route to the star-rate procedure before measurement wherever practicable.
- **Prohibited.** Measuring against an analogous or approximate item.
- **Exception policy.** Measurement recorded as non-scheduled pending rate approval; not billable until SR-4 is satisfied.
- **Laws.** LAW-5, CP-4. **Cross-refs.** SR-1…SR-4, PC-3.

**MSR-15 — Part-rate measurement MUST record the stage reached.**
- **Rationale.** PT-3. A fraction claimed without a stage is a number with no referent, and it will be settled anyway.
- **Trigger.** Part-rate measurement.
- **Preconditions.** Bound stage schedule (PT-2).
- **Mandatory.** Record stage and its evidence.
- **Prohibited.** Percentage-complete assertions in place of stages.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** FM-03, PT-1…PT-4.

**MSR-16 — Measurement MUST be reconciled against independent consumption and design records.**
- **Rationale.** MR-1…MR-8. Re-measurement checks the measurer; reconciliation checks the measurement against a different universe of facts, and catches what re-measurement cannot.
- **Trigger.** Period close; bill preparation.
- **Preconditions.** Material issue, batching, weighbridge, and design records.
- **Mandatory.** Perform the applicable reconciliations; block on variance beyond tolerance (MR-9).
- **Prohibited.** Annotating a variance and proceeding.
- **Exception policy.** **None.**
- **Laws.** CP-2. **Cross-refs.** MR-1…MR-9, GP-23.

**MSR-17 — Measurement timing patterns MUST be monitored.**
- **Rationale.** AF-8, MR-8. Measurement clustered immediately before bills, or long after execution, are both fabrication signatures.
- **Trigger.** Continuous.
- **Preconditions.** ME-6 dates recorded.
- **Mandatory.** Report execution-to-measurement and measurement-to-bill intervals to Internal Audit.
- **Prohibited.** —
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** AF-8, AUD-07.

**MSR-18 — Disputed measurement MUST NOT block undisputed value.**
- **Rationale.** MD-1. Holding a whole bill over one item creates precisely the payment pressure (§ 1.4.8) that produces "just this once" releases.
- **Trigger.** Dispute.
- **Preconditions.** —
- **Mandatory.** Bill the undisputed entries; hold the disputed entry; age and escalate (MD-4).
- **Prohibited.** Whole-bill suspension over a single disputed item.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** MD-1…MD-4, GP-20.

---

## 9.18 Domain MBK — Measurement Book

> *The MB is the enterprise's primary evidentiary record of physical execution. Its integrity
> properties are constitutional, not clerical (§ 8.3).*

**MBK-01 — Every Measurement Book MUST be issued to a named officer and its custody recorded.**
- **Rationale.** MB-1. An MB in unrecorded custody has no evidentiary weight, because no one can say who could have written in it.
- **Trigger.** Issue; transfer; return.
- **Preconditions.** —
- **Mandatory.** Record issue, custody transfers, and return with dates and names.
- **Prohibited.** Unissued or unattributed books in use.
- **Exception policy.** **None.**
- **Laws.** LAW-11, CP-6. **Cross-refs.** MB-1, AUD-03.

**MBK-02 — The MB MUST NOT be maintained by, or accessible for entry to, a contractor.**
- **Rationale.** CTL-08, SOD-6. Custody of the evidence that constrains one's own payment is not a control arrangement.
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Restrict entry rights to enterprise officers.
- **Prohibited.** Contractor entries, contractor custody, contractor-held digital access.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-2. **Cross-refs.** CTL-08, SEC-04.

**MBK-03 — MB entries MUST be indelible; corrections are struck through, initialled, and superseded.**
- **Rationale.** MB-3. The physical difficulty of erasing ink is a control, and its replacement must be at least as hard to defeat (MB-9).
- **Trigger.** Correction.
- **Preconditions.** —
- **Mandatory.** Strike through legibly; initial; date; record the superseding entry.
- **Prohibited.** Erasure; obliteration; page removal; overwriting.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MB-3, MSR-12.

**MBK-04 — MB entries MUST be sequential and gap-free.**
- **Rationale.** MB-2. A gap is where a removed or unrecorded measurement would be; it is a control event, not a clerical untidiness.
- **Trigger.** Entry; audit.
- **Preconditions.** —
- **Mandatory.** Maintain sequence; explain and record any gap.
- **Prohibited.** Unexplained gaps; renumbering.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MB-2, AUD-03.

**MBK-05 — Every entry MUST carry item, location, dimensions, computation, quantity, and unit.**
- **Rationale.** MB-5, ME-4. A bare total is an assertion; the dimensions and their arithmetic are what make it reproducible.
- **Trigger.** Entry.
- **Preconditions.** —
- **Mandatory.** Record all six.
- **Prohibited.** Totals without derivation.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** ME-1…ME-11, SC-10.

**MBK-06 — Entries MUST record both the work date and the measurement date.**
- **Rationale.** ME-6. Rate resolution uses the work date (FM-00); the interval between the two is itself an anomaly signal (AF-8).
- **Trigger.** Entry.
- **Preconditions.** —
- **Mandatory.** Record both.
- **Prohibited.** Single-date entries.
- **Exception policy.** **None.**
- **Laws.** DP-12. **Cross-refs.** FM-00, MSR-17.

**MBK-07 — Cumulative quantities MUST carry forward with a visible reference to the prior entry.**
- **Rationale.** MB-6, LAW-6. Continuity is what makes the running account auditable across books and periods.
- **Trigger.** Entry.
- **Preconditions.** —
- **Mandatory.** Reference the prior cumulative position.
- **Prohibited.** Period-only entries with no cumulative link.
- **Exception policy.** **None.**
- **Laws.** LAW-6. **Cross-refs.** MB-6, EVL-03.

**MBK-08 — A closed MB MUST NOT accept further entry.**
- **Rationale.** MB-7. A book that reopens has no closing point, and its sequence guarantee is void.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Formal closure with date and officer.
- **Prohibited.** Post-closure entries.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MB-7, ATT-17.

**MBK-09 — A digital MB MUST be append-only and MUST NOT permit silent modification.**
- **Rationale.** MB-9. A digital book that permits silent edit is weaker than paper and therefore non-conformant, regardless of convenience gained.
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Append-only records; attributed entries; superseded entries permanently visible; version history retained.
- **Prohibited.** In-place update; hard delete; administrative edit without a visible superseding record.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MB-9, Part 11 § 11.7, SEC-10.

**MBK-10 — MB entries MUST be attributable to a person, never to a role or a system.**
- **Rationale.** CP-6, MB-4. Accountability that cannot be attributed to a human being is not accountability.
- **Trigger.** Entry.
- **Preconditions.** Individual credentials (SEC-01).
- **Mandatory.** Record the individual.
- **Prohibited.** Shared accounts; role-based attribution; system-generated entries with no responsible officer.
- **Exception policy.** **None.**
- **Laws.** CP-6. **Cross-refs.** SEC-01, AUD-04.

**MBK-11 — MBs MUST be retained for the statutory and limitation period.**
- **Rationale.** MB-8, § 3.4.4. The MB is demanded in arbitration years after the project team has dispersed (objective O-9).
- **Trigger.** Closure; project close.
- **Preconditions.** —
- **Mandatory.** Retain and keep reconstructible; transfer custody formally.
- **Prohibited.** Disposal at project close; custody left with a demobilised team.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LI-33, LAB-14, CLS-14.

**MBK-12 — MB integrity MUST be verified independently and periodically.**
- **Rationale.** GP-21. Integrity properties that are never tested are assumptions, and assumptions fail silently.
- **Trigger.** Audit cycle.
- **Preconditions.** —
- **Mandatory.** Verify custody, sequence, indelibility, attribution, and closure; report findings.
- **Prohibited.** Verification by the custodian.
- **Exception policy.** **None.**
- **Laws.** CP-11, CP-2. **Cross-refs.** AUD-03, SOD-5.

---

## 9.19 Domain RBL — Running bills

> *The running bill is the instrument through which almost all contract money leaves the enterprise.
> Every control in Parts 1–8 either feeds this domain or constrains it.*

**RBL-01 — A running bill is a claim until it is certified; it is never an entitlement on submission.**
- **Rationale.** GP-13, CTL-03. Treating a submitted bill as a debt from the moment of receipt inverts the burden of proof and creates the payment pressure described in § 1.4.8.
- **Trigger.** Bill submission.
- **Preconditions.** —
- **Mandatory.** Record as a claim; establish entitlement by verification.
- **Prohibited.** Ageing a submitted bill as a payable before certification.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-1. **Cross-refs.** EDR-01, § 6.6.

**RBL-02 — Every billed quantity MUST trace to a verified, unconsumed measurement entry.**
- **Rationale.** G-1, MSR-13. This is the single test that connects money to physical reality.
- **Trigger.** Bill preparation and verification.
- **Preconditions.** LC-04 complete for the quantities billed.
- **Mandatory.** Trace each line; reject the bill on any untraceable line.
- **Prohibited.** Partial pass of a bill containing untraceable lines.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-5. **Cross-refs.** G-1, SY-1, RSK-11.

**RBL-03 — Bills MUST NOT be prepared from the contractor's figures.**
- **Rationale.** CTL-03. A bill prepared from the claimant's data and then "checked" is a claim with a signature on it.
- **Trigger.** Bill preparation.
- **Preconditions.** Enterprise measurement records.
- **Mandatory.** Prepare from the enterprise's own verified measurements.
- **Prohibited.** Importing contractor quantities as the basis.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-2. **Cross-refs.** MSR-05, GP-13.

**RBL-04 — Every bill MUST be cumulative and MUST reconcile to the Contractor Account.**
- **Rationale.** LAW-6, LI-10, G-7. The cumulative form is what makes prior error self-correcting rather than compounding.
- **Trigger.** Bill computation.
- **Preconditions.** Prior settled position.
- **Mandatory.** Compute by FM-19; reconcile to OBJ-25.
- **Prohibited.** Period-only bills, even where the arithmetic would agree.
- **Exception policy.** **None.**
- **Laws.** LAW-6. **Cross-refs.** FM-19, PC-4, EVL-01.

**RBL-05 — The ceiling test MUST be applied before any other financial step and MUST stop the bill on failure.**
- **Rationale.** G-2, FM-07, LAW-9. A ceiling that is tested after recovery and retention has already been computed invites the arithmetic to be adjusted until it passes.
- **Trigger.** Bill computation, step 6 (§ 7.8).
- **Preconditions.** Sanctioned value and sanctioned variations to date.
- **Mandatory.** Apply FM-07; reject on breach.
- **Prohibited.** Approval at a higher level; part-passing to the ceiling; deferral of the excess to a later bill.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** FM-07, VAR-01, RSK-19.

**RBL-06 — Rates applied MUST be those in force at the work date.**
- **Rationale.** FM-00, WGR-04, PC-2. Billing-date rate resolution silently transfers the value of every rate movement.
- **Trigger.** Valuation.
- **Preconditions.** Versioned rate schedule.
- **Mandatory.** Resolve by work date per line.
- **Prohibited.** Uniform current-rate application across a period spanning a rate change.
- **Exception policy.** **None.**
- **Laws.** DP-12, CP-4. **Cross-refs.** FM-00, GP-17.

**RBL-07 — All recoveries due in the period MUST be applied before the bill can be verified.**
- **Rationale.** G-3, LAW-8, LI-12. The bill is the enterprise's recovery opportunity; a bill that passes without recovery has forfeited it for that period.
- **Trigger.** Verification.
- **Preconditions.** Recovery schedule; issued-value records.
- **Mandatory.** Assemble and apply per FM-13.
- **Prohibited.** Silent omission; recovery "to be adjusted later".
- **Exception policy.** Deferral by LC-12, attributed and counted.
- **Laws.** LAW-8. **Cross-refs.** FM-13, REC-09, RSK-20.

**RBL-08 — Retention MUST be withheld in the same act that certifies the value it applies to.**
- **Rationale.** SY-6. Retention computed separately from certification drifts from it, and the drift is discovered at release when the money has gone.
- **Trigger.** Certification.
- **Preconditions.** Retention terms bound (E-3).
- **Mandatory.** Compute FM-15 on the same certified value; record as liability.
- **Prohibited.** Retention computed in a separate later process.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** SY-6, RET-01.

**RBL-09 — Bill arithmetic MUST be independently reproduced before certification.**
- **Rationale.** G-8, SC-10. Reproduction is the only verification that does not depend on trusting the preparer's process.
- **Trigger.** Verification.
- **Preconditions.** —
- **Mandatory.** Recompute independently; reconcile exactly; record the verifier.
- **Prohibited.** Review by inspection; sampling of lines in place of recomputation of the total.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-4. **Cross-refs.** SC-10, DT-1.

**RBL-10 — Origination, verification, certification, and approval MUST be four different actors.**
- **Rationale.** G-5, LAW-4, SOD-2, SOD-10. Four separated acts is the structural definition of a bill the enterprise can defend.
- **Trigger.** Each transition.
- **Preconditions.** —
- **Mandatory.** Enforce structurally.
- **Prohibited.** Any two roles held by one actor on one bill.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** § 6.14, SOD-2, SOD-10.

**RBL-11 — Approval MUST be within the approver's delegated limit, valid at the approval date.**
- **Rationale.** G-6, GP-17. A limit that is not tested by date is a limit that survives the delegation that created it.
- **Trigger.** Approval.
- **Preconditions.** Delegation register with validity dates (D-9).
- **Mandatory.** Test the **approval base** against the approver's limit, and test the delegation's validity at the approval date. **The approval base is the cumulative certified value** (FM-06), consistent with GP-18; net payable is a separate figure and is tested only against disbursement authority (PEL-14).
- **Prohibited.** Approval outside limit; approval under a lapsed delegation. **Using net payable as the approval base** — it would make delegated authority a function of how much recovery happened to fall in the period, so a contractor whose advance recovery completes would move approval tier by arithmetic, with no one deciding anything.
- **Exception policy.** **None.** Escalate to a higher authority instead.
- **Laws.** LAW-4. **Cross-refs.** SEC-05, GP-18, RBL-12, PEL-09, RSK-40.

**RBL-12 — Bills MUST NOT be split to remain within a delegated limit.**
- **Rationale.** GP-18, PC-13, XCP-16. Splitting is the same offence as breaching, performed with more steps.
- **Trigger.** Approval; monitoring.
- **Preconditions.** —
- **Mandatory.** Test cumulative position, not instance size; monitor for split patterns (AF-5).
- **Prohibited.** Sequential same-period bills that individually clear a limit the aggregate would breach.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** AF-5, PEL-09, RSK-40.

**RBL-13 — A returned bill MUST re-enter at the step that failed.**
- **Rationale.** LI-08. Resuming at certification means certifying on a superseded set of facts.
- **Trigger.** Resubmission.
- **Preconditions.** Recorded failure point.
- **Mandatory.** Restart from the failed step; re-verify everything downstream of it.
- **Prohibited.** Resumption at the point of return.
- **Exception policy.** **None.**
- **Laws.** CP-1. **Cross-refs.** LI-08, § 6.6.

**RBL-14 — Part payment MUST leave the bill live and the residual visible.**
- **Rationale.** LI-09. A part-paid bill closed as paid conceals a liability that will resurface at the final account.
- **Trigger.** Part disbursement.
- **Preconditions.** —
- **Mandatory.** State `PART_PAID`; carry the residual in the Contractor Account.
- **Prohibited.** Closing a part-paid bill.
- **Exception policy.** **None.**
- **Laws.** LAW-6. **Cross-refs.** LI-09, FIN-11.

**RBL-15 — A bill is PAID only on confirmed disbursement.**
- **Rationale.** SY-7, LI-25. Marking paid on instruction records an outcome that has not happened and may not.
- **Trigger.** Disbursement confirmation.
- **Preconditions.** —
- **Mandatory.** Transition on confirmation; reinstate on failure (LI-24).
- **Prohibited.** `PAID` on approval or instruction.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** SY-7, LC-10.

**RBL-16 — Every bill MUST be drillable to primary evidence without human explanation.**
- **Rationale.** CP-7, GP-11. A bill that requires its preparer to explain it cannot be audited after that person leaves (objective O-9).
- **Trigger.** Any presentation of the bill.
- **Preconditions.** —
- **Mandatory.** Decompose to measurement, evidence, rate authority, recovery source, and approval.
- **Prohibited.** Summary figures with no traceable derivation.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** SC-10, Part 11 § 11.5.

**RBL-17 — The contractor MUST be able to see the derivation of their own bill.**
- **Rationale.** CP-10, GP-19. A contractor who can verify the computation disputes less; a contractor who cannot disputes everything, indiscriminately.
- **Trigger.** Certification.
- **Preconditions.** —
- **Mandatory.** Provide quantities, rates, recoveries, retention, and deductions with their bases.
- **Prohibited.** Net-only communication.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** objective O-10, MD-1.

**RBL-18 — Negative net payable MUST be presented, posted, and pursued.**
- **Rationale.** NEG-1, NEG-2. A suppressed negative is an over-certification made permanent.
- **Trigger.** FM-19 yields a negative.
- **Preconditions.** —
- **Mandatory.** Present as negative; post as receivable to the Contractor Account; recover.
- **Prohibited.** Flooring at zero; deferring the negative silently to the next bill.
- **Exception policy.** **None.**
- **Laws.** LAW-6, LAW-8. **Cross-refs.** NEG-1…NEG-3, PC-5, FIN-09.

---

## 9.20 Domain EVL — Earned value

> *Earned value is the enterprise's statement of what the contractor has become entitled to, before
> anything is deducted. It is the bridge between measurement and money.*

**EVL-01 — Earned value MUST be computed cumulatively from verified quantities at bound rates.**
- **Rationale.** FM-02, FM-06, LAW-6. Earned value assembled from period figures loses the self-correction property that makes the running account safe.
- **Trigger.** Bill computation; period close.
- **Preconditions.** Verified measurement; rate versions.
- **Mandatory.** Compute per FM-01/FM-02/FM-06.
- **Prohibited.** Progress-percentage-based earned value on measurable items.
- **Exception policy.** **None.**
- **Laws.** LAW-6, LAW-1. **Cross-refs.** FM-06, RBL-04.

**EVL-02 — Earned value MUST NOT include unverified, disputed, cancelled, or superseded measurement.**
- **Rationale.** Each of those states exists precisely to keep a quantity out of value until a condition is met.
- **Trigger.** Computation.
- **Preconditions.** —
- **Mandatory.** Include only `VERIFIED` or `REDUCED` entries not yet consumed.
- **Prohibited.** Provisional inclusion pending verification.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** § 5.13, EVL-01.

**EVL-03 — Earned value MUST reconcile to the Measurement Book.**
- **Rationale.** RI-1, MBK-07. Two records of the same fact that do not reconcile mean one of them is wrong and no one knows which.
- **Trigger.** Period close; bill verification.
- **Preconditions.** —
- **Mandatory.** Reconcile; investigate any variance.
- **Prohibited.** Reporting earned value without reconciliation.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** RI-1, GP-23.

**EVL-04 — Earned value MUST NOT exceed the authorised ceiling.**
- **Rationale.** RI-2, LAW-9. The ceiling binds the earned figure, not merely the paid one; certifying beyond it creates an obligation the enterprise has not authorised.
- **Trigger.** Computation.
- **Preconditions.** Sanctioned value and variations.
- **Mandatory.** Test at computation, not only at payment.
- **Prohibited.** Certifying beyond ceiling with payment withheld.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** FM-07, RBL-05.

**EVL-05 — Escalation MUST NOT be estimated.**
- **Rationale.** ESC-1, PC-12. An estimated index becomes a paid amount, and correcting it later requires recovering money already disbursed.
- **Trigger.** Escalation computation.
- **Preconditions.** Published index.
- **Mandatory.** Compute only on published indices; carry the period forward at nil until publication.
- **Prohibited.** Provisional escalation payment.
- **Exception policy.** **None.**
- **Laws.** CP-8. **Cross-refs.** FM-05, ESC-1, ESC-2.

**EVL-06 — Variation value MUST enter earned value only when the variation is sanctioned.**
- **Rationale.** SY-5, LI-21. Proposed variations are not authority; paying against them funds a decision that has not been taken.
- **Trigger.** Computation.
- **Preconditions.** LC-09 state.
- **Mandatory.** Include only `SANCTIONED` variations effective on or before the bill date.
- **Prohibited.** Provisional inclusion of proposed variations.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** SY-5, VAR-06.

**EVL-07 — Part-rate earned value MUST be superseded, not supplemented, on completion.**
- **Rationale.** PR-2, PT-4. Adding completion value to part value pays the same work twice.
- **Trigger.** Item completion.
- **Preconditions.** Prior part certification recorded.
- **Mandatory.** Compute full value less part value already certified.
- **Prohibited.** Additive treatment.
- **Exception policy.** **None.**
- **Laws.** LAW-6. **Cross-refs.** PR-2, MSR-15.

**EVL-08 — A reduction in earned value MUST be visible, not netted silently.**
- **Rationale.** FM-08. A negative period movement is the running account doing its job; hiding it removes the evidence that a prior certification was wrong.
- **Trigger.** Cumulative value falls below the prior position.
- **Preconditions.** —
- **Mandatory.** Present the negative movement with its cause.
- **Prohibited.** Suppression; offsetting against new work to produce a positive.
- **Exception policy.** **None.**
- **Laws.** LAW-6, LAW-11. **Cross-refs.** FM-08, RBL-18.

**EVL-09 — Earned value MUST be reported against physical progress to CAP-PPM.**
- **Rationale.** Integration O-3: measured quantity is the authoritative progress fact. Divergence between reported progress and measured value is a leading indicator of both over-measurement and programme misreporting.
- **Trigger.** Measurement verification; period close.
- **Preconditions.** —
- **Mandatory.** Publish measured progress; investigate divergence.
- **Prohibited.** Parallel progress reporting inconsistent with measurement.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** integration O-3, MR-7.

**EVL-10 — Unbilled verified value MUST be visible and aged.**
- **Rationale.** RI-12, GP-20. Verified work not billed is a liability the enterprise has incurred and not recorded, and it is contractor detriment.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report verified-but-unbilled value by age and reason.
- **Prohibited.** Carrying verified value indefinitely without reason.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** RI-12, FC-9.

---

## 9.21 Domain PEL — Payment eligibility

> *Eligibility is the final gate. Everything upstream produces a number; this domain decides whether
> the number may be released. PA-6: by this point every question must already be answered.*

**PEL-01 — Payment MUST be a consequence of a complete chain, never an independent act.**
- **Rationale.** § 1.6, PA-1. A payment originated at eligibility is a payment that entered the chain sideways.
- **Trigger.** Any payment request.
- **Preconditions.** The Payment Chain (§ 1.6).
- **Mandatory.** Verify the chain backwards from the payment to the physical quantity or validated day (PA-2).
- **Prohibited.** Payment initiated from an amount rather than from evidence.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-2, LAW-5. **Cross-refs.** PA-1…PA-3, EDR-02.

**PEL-02 — Labour payment MUST satisfy both limbs of LAW-2.**
- **Rationale.** Attendance alone establishes presence; assignment alone establishes intent. Only both establish entitlement.
- **Trigger.** Wage settlement.
- **Preconditions.** ATT-06, ATT-07.
- **Mandatory.** Test both.
- **Prohibited.** Payment on either limb alone.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** DWG-01, ASG-11.

**PEL-03 — Contract payment MUST satisfy LAW-1 without substitution.**
- **Rationale.** No document, certificate, relationship, or urgency substitutes for verified measurement.
- **Trigger.** Contract payment.
- **Preconditions.** LC-04 complete.
- **Mandatory.** Verified measurement for every valued quantity.
- **Prohibited.** Payment against progress reports, photographs, or contractor certificates alone.
- **Exception policy.** **None.**
- **Laws.** LAW-1. **Cross-refs.** RBL-02, MSR-01.

**PEL-04 — A broken chain MUST stop the payment, not relax the rule.**
- **Rationale.** PA-3. The rule that bends under pressure is not a rule; it is a default that can be argued away.
- **Trigger.** Any missing link.
- **Preconditions.** —
- **Mandatory.** Hold the payment; record the gap; resolve the gap. **The chain is tested per quantity, not per bill:** a disputed or unsupported item has a broken chain and does not proceed, while undisputed items in the same bill are unaffected (MD-1, MSR-18).
- **Prohibited.** Conditional release pending later evidence.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-2. **Cross-refs.** PA-3, DP-3, MD-1, MSR-18.

**PEL-05 — Recovery MUST precede disbursement.**
- **Rationale.** LAW-8, PA-5, LA-7. Recovery before payment is arithmetic; recovery after payment is litigation.
- **Trigger.** Eligibility computation.
- **Preconditions.** Recovery set assembled.
- **Mandatory.** Deduct at source per FM-13.
- **Prohibited.** Gross payment with an intention to invoice back.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FM-13, RBL-07.

**PEL-06 — The computed figure is the maximum payable; approval may reduce it but never increase it.**
- **Rationale.** The settlement computation is the enterprise's arithmetic statement of entitlement. An approval that increases it has substituted judgement for evidence, which is the precise definition of an unsupported payment.
- **Trigger.** Approval.
- **Preconditions.** Computed net (FM-19 or FM-28).
- **Mandatory.** Cap the payable at the computed figure; record any reduction and its reason. **This applies at final account exactly as at every running bill:** CLS-13 records a negotiated variance and **confers no payment authority**; a settlement above the computed figure requires the underlying entitlement to be changed by formal instrument (LAW-9).
- **Prohibited.** Approval above the computed figure by any authority, at any stage, including closure.
- **Exception policy.** **None.**
- **Laws.** LAW-1, LAW-4, LAW-5. **Cross-refs.** EDR-05, FIN-02, CLS-13, RSK-39.

**PEL-07 — Eligibility MUST be re-tested if any input changes after computation.**
- **Rationale.** An approval given on one set of facts does not carry to another. Silent input drift between computation and disbursement is a known fraud vector.
- **Trigger.** Any change to quantities, rates, recoveries, or payee after computation.
- **Preconditions.** —
- **Mandatory.** Invalidate the approval; recompute; re-approve.
- **Prohibited.** Post-approval input changes carried into disbursement.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** WKS-07, LI-23, RSK-38.

**PEL-08 — Payment MUST NOT proceed where a control could not execute.**
- **Rationale.** DP-3, GP-16, DT-4. A missing recovery input treated as zero is leakage arriving through the arithmetic.
- **Trigger.** Any unavailable input or unreachable control.
- **Preconditions.** —
- **Mandatory.** Fail closed; record the failure (CP-11).
- **Prohibited.** Defaulting a missing value to nil, zero, or "none outstanding".
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** II-4, DT-4, RSK-24.

**PEL-09 — Cumulative position, not instance size, MUST govern every threshold test.**
- **Rationale.** GP-18, SD-1, PC-13. Thresholds tested per instance are thresholds defeated by division.
- **Trigger.** Any limit or threshold test.
- **Preconditions.** —
- **Mandatory.** Test against cumulative position for the relevant period and counterparty.
- **Prohibited.** Per-instance testing where a cumulative rule applies.
- **Exception policy.** **None.**
- **Laws.** LAW-4, LAW-9. **Cross-refs.** RBL-12, SD-1.

**PEL-10 — Emergency and out-of-turn payment MUST NOT bypass evidence; it may only bypass sequence.**
- **Rationale.** LI-32. Urgency can justify reordering administrative steps; it can never justify paying for work that has not been verified.
- **Trigger.** Emergency payment request.
- **Preconditions.** Verified evidence exists.
- **Mandatory.** Record the exception, authority, reason, and expiry; count it (LAW-12).
- **Prohibited.** Emergency payment against unverified measurement or unvalidated attendance.
- **Exception policy.** Executive authority, time-boxed, counted, reported.
- **Laws.** LAW-1, LAW-2, LAW-12. **Cross-refs.** LI-32, EXC-04, RSK-42.

**PEL-11 — Payment MUST NOT be made to a party other than the entitled payee.**
- **Rationale.** WRK-10, LI-23. Payee substitution is the highest-value, lowest-effort fraud available to anyone with access to correspondence.
- **Trigger.** Disbursement.
- **Preconditions.** Verified payee record.
- **Mandatory.** Pay to the recorded payee; verify any change independently. **A worker paid directly under CTL-06 is an entitled payee**, not a third party: this rule prohibits payment to an unentitled party, never the discharge of a statutory obligation the enterprise owes.
- **Prohibited.** Payment to a third party on instruction, without recorded lawful authority.
- **Exception policy.** Legal assignment or attachment, verified and recorded.
- **Laws.** LAW-5, LAW-11. **Cross-refs.** WRK-10, CTL-06, RSK-46.

**PEL-12 — Eligibility decisions MUST be recorded with their basis, including refusals.**
- **Rationale.** CP-6, GP-09. A refusal that leaves no record cannot be reviewed for consistency, and inconsistent refusal is how relationship-based payment discipline emerges.
- **Trigger.** Any eligibility decision.
- **Preconditions.** —
- **Mandatory.** Record decision, actor, basis, and date.
- **Prohibited.** Undocumented refusal; undocumented release.
- **Exception policy.** **None.**
- **Laws.** CP-6, CP-11. **Cross-refs.** AUD-04, EXC-09.

**PEL-13 — Payment eligibility MUST be independent of the contractor's operational pressure.**
- **Rationale.** § 1.4.8, LA-6. "The slab must be poured tomorrow" is a programme fact, not an evidentiary one; treating it as the latter is how the exception becomes the process.
- **Trigger.** Payment pressure of any kind.
- **Preconditions.** —
- **Mandatory.** Decide on evidence; where the enterprise chooses to relieve pressure, do so by advance (LC-06) with a recovery plan, recorded.
- **Prohibited.** Releasing an unverified payment to maintain progress.
- **Exception policy.** **None** for evidence. Advance is the legitimate instrument.
- **Laws.** LAW-1, LAW-7. **Cross-refs.** LA-6, ADV-01, RSK-43.

**PEL-14 — The disburser MUST verify chain completeness and MUST NOT exercise financial judgement.**
- **Rationale.** § 1.6, LI-22, CP-3. The disbursing officer is the final check that the chain is complete, not a second approver — and never a first one.
- **Trigger.** Disbursement.
- **Preconditions.** Approved voucher.
- **Mandatory.** Verify completeness; execute or refuse; record either.
- **Prohibited.** Disburser altering amount or payee; disburser approving.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-3. **Cross-refs.** SOD-3, LI-22, LI-23.

---

## 9.22 Domain ADV — Advances

> *§ 1.4.5: advances are structural, not exceptional. Unrecovered advance is the most common single
> leakage in Indian construction, and it is usually discovered when the contractor abandons the site.*

**ADV-01 — An advance MUST NOT be issued without a bound, enforceable recovery plan.**
- **Rationale.** LAW-7, LI-11. An advance without a recovery plan is not an advance; it is an unauthorised payment with a friendly name.
- **Trigger.** Advance approval.
- **Preconditions.** Instrument advance terms (E-4).
- **Mandatory.** Bind basis, rate or instalments, start point, and completion condition at approval.
- **Prohibited.** Approval with recovery "to be decided"; recovery plan created at first recovery.
- **Exception policy.** **None.**
- **Laws.** LAW-7. **Cross-refs.** LI-11, FM-09, RSK-20.

**ADV-02 — An advance MUST be classified by type.**
- **Rationale.** Mobilisation, material, secured, and ad-hoc advances carry different security, different recovery priority (FM-13), and different treatment on termination. An unclassified advance gets the weakest treatment of all by default.
- **Trigger.** Advance request.
- **Preconditions.** —
- **Mandatory.** Record type and its contractual basis.
- **Prohibited.** Generic advances with no type.
- **Exception policy.** **None.**
- **Laws.** LAW-7, LAW-5. **Cross-refs.** FM-13, § 5.18.

**ADV-03 — Advances MUST NOT exceed the limit set by the instrument.**
- **Rationale.** GP-07. An advance ceiling behaves exactly like a contract ceiling: it rises by instrument or not at all.
- **Trigger.** Approval.
- **Preconditions.** Advance limit in the instrument.
- **Mandatory.** Test cumulative advances against the limit.
- **Prohibited.** Exceeding by seniority; multiple advances aggregating past the limit.
- **Exception policy.** Formal amendment of the instrument.
- **Laws.** LAW-7, LAW-9 analogue. **Cross-refs.** GP-18, PEL-09.

**ADV-04 — A secured advance MUST be secured, and the security MUST be live.**
- **Rationale.** A secured advance whose bank guarantee has expired is an unsecured advance that everyone believes is secured — the most dangerous state available.
- **Trigger.** Approval; guarantee expiry.
- **Preconditions.** Security instrument with validity dates.
- **Mandatory.** Record security, its value, and expiry; monitor and escalate before expiry.
- **Prohibited.** Advance continuing past security expiry without action.
- **Exception policy.** **None.**
- **Laws.** LAW-7. **Cross-refs.** GP-20, RSK-23.

**ADV-05 — Material advances MUST be tied to materials actually procured and secured.**
- **Rationale.** A material advance against materials never bought is a cash advance with extra paperwork, and the enterprise has no lien over anything.
- **Trigger.** Material advance request.
- **Preconditions.** Evidence of procurement or delivery.
- **Mandatory.** Verify existence, location, and title; inspect where material; record.
- **Prohibited.** Advance on invoices alone.
- **Exception policy.** **None.**
- **Laws.** LAW-7, CP-1. **Cross-refs.** EV-1, RSK-23.

**ADV-06 — Recovery MUST commence at the defined point and MUST NOT be silently deferred.**
- **Rationale.** LI-12. The deferral that is never recorded is indistinguishable from the recovery that never happened.
- **Trigger.** Each bill or settlement after the commencement point.
- **Preconditions.** ADV-01.
- **Mandatory.** Apply per FM-09/FM-10; where deferred, raise LC-12 with authority, reason, and expiry.
- **Prohibited.** Silent omission from a bill's recovery set.
- **Exception policy.** Deferral, attributed and counted; bounded in number of periods.
- **Laws.** LAW-8. **Cross-refs.** LI-12, REC-10, RSK-20.

**ADV-07 — Recovery MUST accelerate, never decelerate.**
- **Rationale.** AR-1. Where both a percentage and a minimum instalment apply, taking the lesser converts a recovery schedule into an aspiration.
- **Trigger.** Recovery computation.
- **Preconditions.** Both bases known.
- **Mandatory.** Apply the greater, capped at outstanding.
- **Prohibited.** Applying the lesser; renegotiating the rate downward at bill time.
- **Exception policy.** Executive authority, recorded, counted.
- **Laws.** LAW-8. **Cross-refs.** AR-1, FM-09.

**ADV-08 — Suspension or termination MUST make the entire outstanding advance immediately recoverable.**
- **Rationale.** AR-2, LA-7. The schedule assumed a continuing relationship; when that ends, so does the assumption.
- **Trigger.** Instrument suspension or termination.
- **Preconditions.** —
- **Mandatory.** Crystallise the outstanding; recover from any payment due; pursue security.
- **Prohibited.** Continuing the original instalment schedule after termination.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** AR-2, CTL-11, CLS-04.

**ADV-09 — Final payment MUST NOT be released while an advance is outstanding.**
- **Rationale.** LA-7 at its sharpest: after final payment, the enterprise has no leverage and no money to deduct from.
- **Trigger.** Final bill; closure.
- **Preconditions.** FC-3.
- **Mandatory.** Recover in full or record a formal write-off decision before release.
- **Prohibited.** Final release with an advance "to be recovered separately".
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FC-3, CLS-04, RSK-22.

**ADV-10 — Advance outstanding MUST appear in contractor exposure continuously.**
- **Rationale.** FM-34, CTL-10. An exposure figure that omits advances understates the loss on default by exactly the amount most likely to be lost.
- **Trigger.** Continuous.
- **Preconditions.** —
- **Mandatory.** Include in exposure; report by age.
- **Prohibited.** Exposure reported net of expected recovery.
- **Exception policy.** **None.**
- **Laws.** LAW-7. **Cross-refs.** FM-34, EX-1.

**ADV-11 — Worker advances MUST respect the lawful deduction ceiling on recovery.**
- **Rationale.** CLB-10, FM-27. Recovering an advance in one instalment from a worker's wage is a statutory breach committed in pursuit of good discipline.
- **Trigger.** Wage settlement.
- **Preconditions.** Ceiling known.
- **Mandatory.** Apply FM-27; carry excess forward.
- **Prohibited.** Ceiling breach; recovery that takes net receipt below statutory minimum.
- **Exception policy.** **None.**
- **Laws.** CP-9, LAW-7. **Cross-refs.** FM-27, LAB-11, PC-9.

**ADV-12 — Write-off MUST be an executive act producing a permanent loss record.**
- **Rationale.** LI-13. Write-off is the honest recognition of a loss; used as a housekeeping route it silently removes the evidence of a control failure.
- **Trigger.** Irrecoverable advance.
- **Preconditions.** Recovery attempts recorded.
- **Mandatory.** Executive approval; permanent loss record; report in control-health reporting; root-cause review.
- **Prohibited.** Write-off by the officer who approved the advance; write-off to clear an ageing report.
- **Exception policy.** **None.**
- **Laws.** LAW-7, LAW-12. **Cross-refs.** LI-13, SOD-8, AUD-10.

**ADV-13 — The advance authoriser MUST NOT authorise waiver or write-off of the same advance.**
- **Rationale.** SOD-8. Otherwise an actor can create an exposure and extinguish the evidence of their own decision.
- **Trigger.** Waiver or write-off.
- **Preconditions.** —
- **Mandatory.** Route to an authority above and independent of the original approver.
- **Prohibited.** Self-waiver in any form.
- **Exception policy.** **None.**
- **Laws.** LAW-4, LAW-7. **Cross-refs.** SOD-8, GP-24, REC-12.

**ADV-14 — Advance ageing MUST be reported and MUST escalate automatically.**
- **Rationale.** GP-20, LA-3. An advance that ages quietly for two years is the leakage that no one will ever notice until abandonment.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report by age, contractor, and type; escalate beyond threshold.
- **Prohibited.** Ageing visible only on request.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** GP-20, RI-3, AUD-08.

---

## 9.23 Domain REC — Recoveries

> *L5 and L6 are the largest leakage classes in aggregate and the least policed, because nothing
> visibly goes wrong — a deduction simply never happens (§ 1.5).*

**REC-01 — Every recovery obligation MUST be created by the event that gives rise to it.**
- **Rationale.** LI-14, LA-4. A recovery that depends on someone remembering will fail within one personnel change.
- **Trigger.** Material issue, plant hire, fuel issue, utility supply, accommodation, damage, LD accrual.
- **Preconditions.** Recovery bases bound in the instrument (E-5).
- **Mandatory.** Raise the obligation automatically at the event.
- **Prohibited.** Recovery raised at bill time; recovery raised on request; recovery raised by the party who will pay it.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** LI-14, I-5, I-6, RSK-21.

**REC-02 — Issued value MUST be valued at the issue date and at the contracted issue rate.**
- **Rationale.** IR-1, FM-11. Valuing at bill date transfers price movement to whichever party the timing favours, and the enterprise is usually the loser because the issue precedes the bill.
- **Trigger.** Issue.
- **Preconditions.** Issue rate schedule with effective dates.
- **Mandatory.** Value at issue with the applicable handling or wastage uplift.
- **Prohibited.** Deferred valuation; market-rate valuation where a contracted rate exists.
- **Exception policy.** **None.**
- **Laws.** LAW-8, DP-12. **Cross-refs.** FM-11, IR-1.

**REC-03 — Recovery obligations MUST be visible as receivables from creation, not from application.**
- **Rationale.** IR-2. An obligation invisible until it is deducted cannot be aged, reported, or pursued if no bill ever arrives.
- **Trigger.** Creation.
- **Preconditions.** —
- **Mandatory.** Post to the Contractor Account; include in exposure (FM-34).
- **Prohibited.** Off-ledger tracking; site-level registers as the only record.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FM-34, RI-4, FIN-08.

**REC-04 — All recoveries due in a period MUST be applied in that period's payment.**
- **Rationale.** G-3, SY-4. The payment is the recovery opportunity; missing it converts arithmetic into pursuit.
- **Trigger.** Bill or settlement.
- **Preconditions.** Recovery schedule.
- **Mandatory.** Apply; block verification if unapplied.
- **Prohibited.** Silent omission.
- **Exception policy.** Recorded deferral (REC-10).
- **Laws.** LAW-8. **Cross-refs.** RBL-07, WKS-05.

**REC-05 — The recovery waterfall MUST be applied in its constitutional order.**
- **Rationale.** FM-13, WF-2, PC-8. Reordering to produce a positive net payment subordinates statutory and worker claims to the enterprise's own convenience.
- **Trigger.** Insufficient payable amount.
- **Preconditions.** —
- **Mandatory.** Apply priorities 1–9 in order; carry the unsatisfied remainder forward.
- **Prohibited.** Reordering by agreement, preference, or convenience.
- **Exception policy.** **None.**
- **Laws.** LAW-8, CP-9, PA-8. **Cross-refs.** FM-13, WF-1, WF-2.

**REC-06 — Every recovery MUST reference its source instrument.**
- **Rationale.** CP-7, LAW-5. A deduction the contractor cannot trace to an issue note or a hire record is a deduction that will be disputed and probably reversed.
- **Trigger.** Application.
- **Preconditions.** —
- **Mandatory.** Reference the issue note, hire record, damage assessment, or statutory basis.
- **Prohibited.** Lump-sum recoveries with no source; "sundry recoveries".
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-7. **Cross-refs.** RBL-17, MD-1.

**REC-07 — Damage, loss, and rework recovery MUST be assessed, not estimated as a percentage.**
- **Rationale.** FM-12. A percentage applied at settlement is a negotiated number wearing an arithmetic costume, and it will not survive challenge.
- **Trigger.** Damage, loss, or rejected work.
- **Preconditions.** —
- **Mandatory.** Assess with a recorded basis and an attributed assessor; notify the contractor.
- **Prohibited.** Blanket percentage deductions.
- **Exception policy.** Contractual liquidated rates where the instrument provides them.
- **Laws.** LAW-8, CP-10. **Cross-refs.** FM-12, PCR-08.

**REC-08 — Liquidated damages MUST accrue automatically by the instrument's terms.**
- **Rationale.** LD-1. LD abandoned by inaction is leakage form L6, and it is invisible precisely because nothing appears to go wrong.
- **Trigger.** Delay established against the contractual programme.
- **Preconditions.** LD terms; hindrance records.
- **Mandatory.** Accrue per FM-18; net recorded hindrance (LD-2); notify the contractor.
- **Prohibited.** LD raised only when the relationship deteriorates; LD forgotten at final account.
- **Exception policy.** Non-levy is a waiver under REC-12.
- **Laws.** LAW-8. **Cross-refs.** FM-18, RI-10, FC-7, RSK-26.

**REC-09 — Recovery completeness MUST be verified before any bill is certified.**
- **Rationale.** § 4.9: an unrecovered advance is the Accountant's accountability. Verification is the act by which that accountability is discharged.
- **Trigger.** Bill verification.
- **Preconditions.** Full recovery set retrievable.
- **Mandatory.** Confirm every open obligation has been considered and applied or formally deferred.
- **Prohibited.** Certification without the completeness check.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** § 4.9, RI-3, RI-4.

**REC-10 — Deferral MUST be bounded, attributed, and escalated by frequency.**
- **Rationale.** LI-15's companion rule. An implementation that lets deferral repeat indefinitely has created a silent waiver.
- **Trigger.** Deferral request.
- **Preconditions.** —
- **Mandatory.** Record authority, reason, and expiry; escalate automatically beyond a bounded number of periods.
- **Prohibited.** Rolling deferral; deferral by the officer who benefits from the payment proceeding.
- **Exception policy.** —
- **Laws.** LAW-8, LAW-12. **Cross-refs.** LI-15, LA-5, EXC-06.

**REC-11 — A disputed recovery MUST NOT be silently dropped.**
- **Rationale.** GP-20. A dispute that ages out of the record is a waiver granted by the passage of time and no one's decision.
- **Trigger.** Contractor disputes a recovery.
- **Preconditions.** —
- **Mandatory.** Move to `DISPUTED`; age; escalate; resolve by decision.
- **Prohibited.** Removal from the recovery set without a decision.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** MD-4, RI-4.

**REC-12 — Waiver MUST be an executive act, separated from the origination of the obligation.**
- **Rationale.** LI-15, SOD-8. Otherwise the actor who issued the advance or the material can extinguish the evidence of their decision.
- **Trigger.** Waiver request.
- **Preconditions.** —
- **Mandatory.** Authority above the payment approver and different from the obligation's originator; stated reason; permanent loss record; counted.
- **Prohibited.** Waiver by the originating authority; waiver recorded as an adjustment.
- **Exception policy.** **None.**
- **Laws.** LAW-8, LAW-12. **Cross-refs.** SOD-8, ADV-13, RSK-28.

**REC-13 — Recovery from wages MUST respect the lawful ceiling.**
- **Rationale.** FM-27, LAB-11. Enterprise recovery discipline never justifies a statutory breach against the worker.
- **Trigger.** Wage settlement.
- **Preconditions.** Ceiling known.
- **Mandatory.** Apply FM-27; carry excess.
- **Prohibited.** Ceiling breach for any reason.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-11, ADV-11.

**REC-14 — Recovery rights MUST survive suspension, dispute, and termination.**
- **Rationale.** WRK-12, AR-2. Recovery rights are the enterprise's residual position; forfeiting them during a dispute is forfeiting the position that resolves it.
- **Trigger.** Suspension; dispute; termination.
- **Preconditions.** —
- **Mandatory.** Continue accrual and tracking; crystallise on termination.
- **Prohibited.** Suspension of recovery tracking during a commercial dispute.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** WRK-12, CTL-11.

**REC-15 — Recovery reconciliation MUST balance to zero unexplained residue.**
- **Rationale.** RI-3, RI-4, FC-3, FC-4. Issued value that neither returns nor stands outstanding has disappeared, and disappearance is the definition of leakage.
- **Trigger.** Period close; closure.
- **Preconditions.** —
- **Mandatory.** Reconcile issued = recovered + outstanding + returned + written off; investigate residue.
- **Prohibited.** Tolerance for unexplained residue.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** RI-3, RI-4, FC-3, FC-4.

**REC-16 — Non-recovery MUST be treated with the same severity as overpayment.**
- **Rationale.** § 1.5: they are financially identical, and the enterprise's instincts are not. Severity parity is what makes the L5/L6 controls survive contact with a busy period.
- **Trigger.** Governance; reporting; investigation.
- **Preconditions.** —
- **Mandatory.** Report L5/L6 events alongside overpayment events with equal prominence and escalation.
- **Prohibited.** Classifying non-recovery as an administrative lapse.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** § 1.5, AUD-08, RSK-21.

---

## 9.24 Domain RET — Retention

> *§ 1.4.9: retention is treated as a discount rather than a liability. Years later the liability
> surfaces, unfunded and unreconciled — a financial misstatement and a legal exposure at once.*

**RET-01 — Retention MUST be withheld at the rate and cap bound in the instrument.**
- **Rationale.** E-3, GP-01. Retention decided at bill time is retention negotiated at bill time.
- **Trigger.** Certification.
- **Preconditions.** Retention terms bound.
- **Mandatory.** Apply FM-15 on cumulative certified value, capped.
- **Prohibited.** Site-varied retention; retention omitted for relationship reasons.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** FM-15, RBL-08.

**RET-02 — Retention MUST be recorded as a liability from the instant it is withheld.**
- **Rationale.** LAW-10, RT-2. Retention recorded as reduced cost is a misstatement that grows silently and surfaces unfunded.
- **Trigger.** Withholding.
- **Preconditions.** —
- **Mandatory.** Post as liability; report as liability; hand off to CAP-FIN as liability (integration O-1).
- **Prohibited.** Netting against project cost; presenting as a saving or a margin.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** LI-17, RT-2, RSK-29.

**RET-03 — Retention MUST be computed cumulatively, not per period.**
- **Rationale.** FM-15 and the worked example (§ 7.13): period-percentage computation diverges the moment the cap binds part-way.
- **Trigger.** Certification.
- **Preconditions.** —
- **Mandatory.** `Ret_cum` then `Ret_period = Ret_cum − Ret_prev`.
- **Prohibited.** Period-rate application.
- **Exception policy.** **None.**
- **Laws.** LAW-6, LAW-10. **Cross-refs.** FM-15, § 7.13.

**RET-04 — Release conditions MUST be bound at engagement and tested positively.**
- **Rationale.** LI-18, DP-9. Release on the absence of an objection is release by default, and defaults favour whoever is asking.
- **Trigger.** Release request.
- **Preconditions.** Conditions recorded at engagement.
- **Mandatory.** Test each condition and record the evidence of satisfaction.
- **Prohibited.** Release because no defect was reported; release because the period elapsed without review.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** LI-18, GP-14.

**RET-05 — Retention MUST NOT be released early to relieve contractor cash pressure.**
- **Rationale.** LI-17. Early release removes the enterprise's residual security exactly before the period in which defects appear.
- **Trigger.** Early release request.
- **Preconditions.** —
- **Mandatory.** Refuse; where the enterprise chooses to assist, use an advance with a recovery plan (LC-06).
- **Prohibited.** Early release for operational or relationship reasons.
- **Exception policy.** Executive authority with recorded justification, security substitution, and a counted exception.
- **Laws.** LAW-10. **Cross-refs.** LI-17, PEL-13, RSK-29.

**RET-06 — Release MUST be net of outstanding recovery.**
- **Rationale.** FM-16, LAW-8. Recovery precedes even the release of the contractor’s own money, because the leverage does not return afterwards. **This does not qualify LAW-10:** the retention remains the contractor’s money throughout, and LAW-8 governs only the order in which the contractor’s money is applied to the contractor’s own obligations.
- **Trigger.** Release.
- **Preconditions.** Recovery position computed.
- **Mandatory.** Deduct outstanding recoveries from the release.
- **Prohibited.** Gross release with recovery pursued separately.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FM-16, LA-7.

**RET-07 — Retention substituted by a guarantee MUST be monitored for validity.**
- **Rationale.** ADV-04's logic applied to retention. An expired guarantee held in place of cash is neither.
- **Trigger.** Substitution; approach of expiry.
- **Preconditions.** Guarantee with validity dates.
- **Mandatory.** Record value and expiry; escalate before expiry; reinstate cash retention on lapse.
- **Prohibited.** Substitution without monitoring.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** ADV-04, GP-20.

**RET-08 — Retention liability MUST be reconciled every period.**
- **Rationale.** RI-5, FC-5. A liability that is not reconciled is a liability whose true size is unknown, and it is always larger than assumed.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Accrued = held + released + forfeited; investigate residue.
- **Prohibited.** Reconciliation at closure only.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** RI-5, FC-5.

**RET-09 — Forfeiture MUST be contractual, attributed, and exceptional.**
- **Rationale.** LAW-10: retention remains the contractor's money. Forfeiture is a contractual remedy, not an accounting convenience for an aged balance.
- **Trigger.** Forfeiture.
- **Preconditions.** Contractual ground.
- **Mandatory.** Cite the ground; attribute the decision; notify the contractor; record permanently.
- **Prohibited.** Forfeiture to clear an ageing liability; forfeiture without notice.
- **Exception policy.** **None.**
- **Laws.** LAW-10, CP-10. **Cross-refs.** RI-5, CLS-07.

**RET-10 — Retention MUST survive project closure until its release conditions expire.**
- **Rationale.** § 3.4.4 temporal boundary, LI-27. The defect liability period outlives the project team, and the liability outlives the project's accounts.
- **Trigger.** Project closure.
- **Preconditions.** —
- **Mandatory.** Carry the liability; assign custody; monitor release conditions.
- **Prohibited.** Closing the liability with the project.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** LI-27, CLS-11.

**RET-11 — The contractor MUST be able to see their retention position.**
- **Rationale.** CP-10, GP-19. Disputes over retention are disproportionately about the contractor's inability to see what is held and why.
- **Trigger.** Continuous; on request; at each bill.
- **Preconditions.** —
- **Mandatory.** Present withheld, released, held, and release conditions.
- **Prohibited.** Position disclosed only at closure.
- **Exception policy.** **None.**
- **Laws.** CP-10. **Cross-refs.** RBL-17, objective O-10.

**RET-12 — Unreleased retention MUST age and escalate.**
- **Rationale.** GP-20, § 1.4.9: the characteristic failure is retention that is never released because no one owns the release, which converts into an unpaid liability and a legal exposure.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report by age and contractor; escalate past the release date.
- **Prohibited.** Retention ageing invisibly.
- **Exception policy.** **None.**
- **Laws.** LAW-10, CP-11. **Cross-refs.** GP-20, RSK-29.

---

## 9.25 Domain VAR — Variation orders

> *§ 1.4.7: instructions are given verbally at site, work is executed, the variation is raised months
> later or never. The contractor claims; the enterprise cannot disprove; the enterprise pays.*

**VAR-01 — The contract ceiling MUST rise only by a sanctioned variation.**
- **Rationale.** LAW-9, LI-19. There is exactly one mechanism, and seniority is not it.
- **Trigger.** Any requirement to certify beyond the current ceiling.
- **Preconditions.** —
- **Mandatory.** Raise, evaluate, and sanction a variation before certification.
- **Prohibited.** Ceiling raised by approval authority, by urgency, or by adjustment at final account.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** LI-19, RBL-05, FM-07.

**VAR-02 — Work outside instrument scope MUST NOT be executed without an instruction record.**
- **Rationale.** ASG-06, CTL-14. Executed out-of-scope work creates an entitlement argument the enterprise cannot win without a contemporaneous record.
- **Trigger.** Identification of out-of-scope work.
- **Preconditions.** —
- **Mandatory.** Record the site instruction before execution; raise the variation.
- **Prohibited.** Execution first, variation later, as normal practice.
- **Exception policy.** Emergency and safety work under recorded instruction, variation raised within a bounded period, counted.
- **Laws.** LAW-9, CP-1. **Cross-refs.** CTL-14, LI-20.

**VAR-03 — A variation whose executed work predates its instruction record MUST be flagged.**
- **Rationale.** LI-20. The sequence instruction → execution → claim is the enterprise's defence; the reverse sequence is the claimant's opportunity.
- **Trigger.** Variation evaluation.
- **Preconditions.** Instruction and execution dates recorded.
- **Mandatory.** Compare dates; flag; require justification recorded by an actor other than the originator.
- **Prohibited.** Silent acceptance of retrospective instruction.
- **Exception policy.** **None.**
- **Laws.** CP-1. **Cross-refs.** LI-20, CTL-14, RSK-41.

**VAR-04 — Variation rates MUST be derived by the instrument's stated method.**
- **Rationale.** SR-2. A variation priced by negotiation under schedule pressure is priced at the moment of least leverage.
- **Trigger.** Variation pricing.
- **Preconditions.** Rate derivation method in the instrument.
- **Mandatory.** Follow the preference order: comparable-item adjustment, first-principles build-up, then negotiation.
- **Prohibited.** Negotiated rate where a derivable rate exists.
- **Exception policy.** Documented, at the highest approval level.
- **Laws.** CP-4, LAW-5. **Cross-refs.** SR-2, SR-3, CTL-07.

**VAR-05 — Variation rates MUST be recorded as new rate-schedule versions.**
- **Rationale.** SR-4, CP-4. A one-off number on a bill is invisible to every future computation and every reconciliation.
- **Trigger.** Rate sanction.
- **Preconditions.** —
- **Mandatory.** Create a versioned item with authority, effective date, and derivation record.
- **Prohibited.** Rates existing only inside a bill.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** SR-4, RBL-06.

**VAR-06 — Only SANCTIONED variations MUST enter valuation, effective on or before the bill date.**
- **Rationale.** SY-5, EVL-06. Paying against a proposed variation funds a decision that has not been taken.
- **Trigger.** Bill computation.
- **Preconditions.** —
- **Mandatory.** Test sanction state and effective date.
- **Prohibited.** Provisional inclusion; inclusion of variations sanctioned after the bill date.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** SY-5, EVL-06.

**VAR-07 — Variation approval MUST be within the approver's delegated limit for variations.**
- **Rationale.** GP-07. Variation authority is a distinct delegation from payment authority, and conflating them lets a payment approver expand their own ceiling.
- **Trigger.** Sanction.
- **Preconditions.** Delegation register.
- **Mandatory.** Test variation value against the variation limit, cumulatively per instrument (GP-18).
- **Prohibited.** Splitting a variation to stay within a limit (§ 5.25 note, XCP-16).
- **Exception policy.** **None.**
- **Laws.** LAW-4, LAW-9. **Cross-refs.** § 5.25, AF-5, RSK-40.

**VAR-08 — A rejected or withdrawn variation MUST NOT create entitlement.**
- **Rationale.** LI-21. The commercial consequence of work executed under a rejected variation is a dispute, not a measurement adjustment.
- **Trigger.** Rejection or withdrawal.
- **Preconditions.** —
- **Mandatory.** Exclude from valuation; route the commercial consequence to CAP-LEG.
- **Prohibited.** Absorbing the value into another item; "adjusting" a related rate to compensate.
- **Exception policy.** **None.**
- **Laws.** LAW-9, LAW-1. **Cross-refs.** LI-21, RSK-14.

**VAR-09 — Scope reduction MUST be processed as a variation, not left implicit.**
- **Rationale.** Omitted work that remains in the ceiling inflates the contractor's headroom and understates the enterprise's savings; it also survives to the final account as a claim.
- **Trigger.** Descoping.
- **Preconditions.** —
- **Mandatory.** Raise a negative variation; adjust the ceiling downward.
- **Prohibited.** Descoping recorded only in correspondence.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** FM-06, CLS-03.

**VAR-10 — Cumulative variation value MUST be monitored against the original sanction.**
- **Rationale.** MR-7. A contract whose variations approach or exceed its original value has ceased to be the contract that was awarded, and that fact should reach a decision-maker before the final account does.
- **Trigger.** Each sanction; period close.
- **Preconditions.** —
- **Mandatory.** Report cumulative variation as a proportion of original sanction; escalate beyond threshold.
- **Prohibited.** Monitoring only against the revised ceiling.
- **Exception policy.** **None.**
- **Laws.** LAW-9, CP-11. **Cross-refs.** MR-7, CTL-10, RSK-44.

**VAR-11 — Variation evaluation MUST consider time as well as value.**
- **Rationale.** A variation that extends the programme without a recorded extension of time leaves LD accruing against a delay the enterprise itself caused (LD-2).
- **Trigger.** Evaluation.
- **Preconditions.** Programme data (CAP-PPM).
- **Mandatory.** Record the time consequence; adjust the LD baseline where extension is granted.
- **Prohibited.** Value-only evaluation.
- **Exception policy.** **None.**
- **Laws.** LAW-8 context. **Cross-refs.** LD-2, REC-08.

**VAR-12 — Variation records MUST be retained and drillable at closure.**
- **Rationale.** FC-2, CLS-03. The final account's ceiling test depends entirely on a complete, dated variation record.
- **Trigger.** Closure; audit.
- **Preconditions.** —
- **Mandatory.** Retain sanction, derivation, dates, and authority.
- **Prohibited.** Variation records held only in project correspondence.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** FC-2, CLS-03.

---

## 9.26 Domain OVR — Manual overrides

> *LA-5: any bypass used more than twice ceases to be an exception. This domain exists to make that
> arithmetic visible before the bypass becomes the process.*

**OVR-01 — An override MUST NOT relax an Immutable Law.**
- **Rationale.** LI-32. There is no authority in the enterprise — executive, emergency, or contractual — that can authorise payment without measurement, beyond ceiling, or by self-approval.
- **Trigger.** Any override request.
- **Preconditions.** —
- **Mandatory.** Refuse; record the refusal and its requester.
- **Prohibited.** Granting; treating the request as routine.
- **Exception policy.** **None.**
- **Laws.** § 1.8 entire. **Cross-refs.** LI-32, EXC-01.

**OVR-02 — Every override MUST name a person, not a role or a system.**
- **Rationale.** CP-6, MBK-10. An override attributed to a role is an override no human being answers for.
- **Trigger.** Override.
- **Preconditions.** Individual credentials.
- **Mandatory.** Record the individual, their authority, and the delegation relied upon.
- **Prohibited.** Shared or generic credentials for override actions.
- **Exception policy.** **None.**
- **Laws.** CP-6, LAW-12. **Cross-refs.** SEC-01, AUD-04.

**OVR-03 — Every override MUST state a reason in the authoriser's own terms.**
- **Rationale.** GP-10. A reason selected from a list is a category, not a reason, and categories cannot be investigated.
- **Trigger.** Override.
- **Preconditions.** —
- **Mandatory.** Free-text justification recorded and retained; category optional in addition.
- **Prohibited.** Code-only justification.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** EXC-03, AUD-07.

**OVR-04 — Every override MUST be time-boxed.**
- **Rationale.** LI-29. An override without expiry is a permanent rule change made without governance.
- **Trigger.** Override.
- **Preconditions.** —
- **Mandatory.** Record expiry; expire automatically; require positive renewal.
- **Prohibited.** Open-ended overrides; renewal by inaction.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-29, GP-14.

**OVR-05 — Overrides that alter a closed period MUST additionally require period reopening.**
- **Rationale.** PG-2, PG-4. Two controls guard the closed period, and an override of one must not silently satisfy the other.
- **Trigger.** Override affecting a closed period.
- **Preconditions.** —
- **Mandatory.** Require both authorisations; restate affected figures visibly.
- **Prohibited.** Single authorisation covering both.
- **Exception policy.** **None.**
- **Laws.** LAW-11, LAW-12. **Cross-refs.** PG-4, WKS-12, ATT-17.

**OVR-06 — Backdating MUST be recorded as backdating.**
- **Rationale.** DEP-09, ATT-01. A record whose effective date precedes its creation date is legitimate; a record that conceals that fact is not.
- **Trigger.** Any record with an effective date before its creation date.
- **Preconditions.** —
- **Mandatory.** Record both dates; flag; report the frequency by actor.
- **Prohibited.** Effective-date-only records.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MBK-06, AF-8, RSK-38.

**OVR-07 — Overrides MUST be counted against the authoriser and reported.**
- **Rationale.** LI-30, LAW-12. An exception that is not counted has not been recorded.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report count and value by authoriser, type, and period.
- **Prohibited.** Aggregate-only override reporting.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-30, EXC-08, AUD-08.

**OVR-08 — Override frequency MUST trigger automatic escalation and rule review.**
- **Rationale.** LI-31, LA-5. Repetition is evidence that the rule is wrong, the process is wrong, or the control is being circumvented — and all three deserve a decision rather than a habit.
- **Trigger.** Threshold breach.
- **Preconditions.** —
- **Mandatory.** Escalate to Finance Controller and Internal Audit; review the underlying rule.
- **Prohibited.** Frequency monitored without consequence.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-31, EXC-07.

**OVR-09 — Override capability MUST be restricted, reviewed, and time-limited.**
- **Rationale.** GP-24. Override authority accumulates quietly in the hands of long-serving officers until it is the normal way work is done.
- **Trigger.** Access grant; periodic review.
- **Preconditions.** —
- **Mandatory.** Grant explicitly with expiry; review periodically; revoke on role change.
- **Prohibited.** Standing override rights; rights inherited by role succession without review.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SEC-05, SEC-09.

**OVR-10 — An override MUST NOT be exercisable by the beneficiary of its outcome.**
- **Rationale.** GP-24, SOD-10. An actor who can both cause a loss and authorise the bypass that permits it holds a position no control can compensate for.
- **Trigger.** Override.
- **Preconditions.** —
- **Mandatory.** Test the authoriser against the beneficiary; route to an independent authority.
- **Prohibited.** Self-benefiting override in any form.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SOD-10, GP-24, RSK-47.

---

## 9.27 Domain FIN — Financial integrity

> *The domain that binds the arithmetic of Part 7 to the behaviour of the enterprise. Its rules are
> the ones that survive when everything else is under pressure.*

**FIN-01 — Every computation MUST have exactly one canonical definition.**
- **Rationale.** CP-4, DP-4. Two implementations of one formula constitute a defect even while they agree, because they will diverge and no one will know which is right.
- **Trigger.** Any computation.
- **Preconditions.** Part 7.
- **Mandatory.** Compute from the canonical definition; reference it.
- **Prohibited.** Parallel computations of the same quantity; spreadsheet re-derivation used for decisions.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** Part 7, II-2, PC-14.

**FIN-02 — The computed figure is authoritative; downstream capabilities MUST NOT substitute their own.**
- **Rationale.** II-2. A downstream capability that recomputes and gets a different answer has discovered a defect, not a better number.
- **Trigger.** Hand-off to CAP-FIN, CAP-TRE, CAP-TAX.
- **Preconditions.** —
- **Mandatory.** Post as received; raise a defect on divergence.
- **Prohibited.** Silent substitution; adjustment on posting.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** II-2, integration O-1, O-2.

**FIN-03 — Every figure MUST be reproducible by hand from this document and the primary evidence.**
- **Rationale.** SC-10, DT-1. A figure reproducible only by running the system is not auditable, and therefore not conformant.
- **Trigger.** Audit; dispute; verification.
- **Preconditions.** —
- **Mandatory.** Preserve inputs, rates, and derivation.
- **Prohibited.** Composite figures with no stated derivation.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** SC-10, RBL-16.

**FIN-04 — Rounding MUST occur only at the defined points.**
- **Rationale.** RND-1, RND-3. Rounding at each step compounds error and is the arithmetic origin of leakage form L7 and of the disputes that consume disproportionate effort.
- **Trigger.** Computation.
- **Preconditions.** —
- **Mandatory.** Full-precision intermediates; round at RPT-1…RPT-6 only.
- **Prohibited.** Step-wise rounding; truncation anywhere.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** RND-1…RND-8, PC-7.

**FIN-05 — Approved financial records MUST NOT be altered.**
- **Rationale.** LAW-11, LI-23, WKS-07. An alterable approval is not an approval, and the alteration is invisible to the approver.
- **Trigger.** Post-approval change.
- **Preconditions.** —
- **Mandatory.** Cancel and re-originate with both records visible.
- **Prohibited.** In-place amendment of amount, payee, period, or basis.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LI-23, PEL-07.

**FIN-06 — Financial paths MUST fail closed.**
- **Rationale.** DP-3, GP-16, DT-4. A financial control that degrades to a weaker path on failure has converted an outage into a leakage event.
- **Trigger.** Any control or input failure.
- **Preconditions.** —
- **Mandatory.** Stop; record the failure; alert (CP-11).
- **Prohibited.** Fallback to a weaker computation; defaults substituted for missing inputs.
- **Exception policy.** **None.**
- **Laws.** LAW-8, CP-11. **Cross-refs.** DP-3, II-4, PEL-08.

**FIN-07 — Time-versioned parameters MUST never be edited in place.**
- **Rationale.** RR-2, WGR-03. Editing a rate silently restates every past computation derived from it.
- **Trigger.** Parameter change.
- **Preconditions.** —
- **Mandatory.** New version with effective date; prior versions retained and resolvable.
- **Prohibited.** In-place edit of rates, limits, percentages, or statutory parameters.
- **Exception policy.** Restatement by executive authority, applied visibly.
- **Laws.** LAW-11, DP-12. **Cross-refs.** RR-2, GP-17.

**FIN-08 — Every financial obligation MUST be on the ledger from creation.**
- **Rationale.** REC-03. Obligations tracked in site registers, spreadsheets, or correspondence are obligations that vanish with the person who tracked them.
- **Trigger.** Creation of any receivable or payable.
- **Preconditions.** —
- **Mandatory.** Post to the Contractor Account or the appropriate ledger immediately.
- **Prohibited.** Off-ledger tracking of any financial obligation.
- **Exception policy.** **None.**
- **Laws.** LAW-5, CP-7. **Cross-refs.** REC-03, FM-34.

**FIN-09 — Negative positions MUST be presented, never suppressed.**
- **Rationale.** NEG-2, EVL-08. A suppressed negative makes a prior over-certification permanent and removes the evidence that it occurred.
- **Trigger.** Any negative net, negative movement, or debit position.
- **Preconditions.** —
- **Mandatory.** Present; post; pursue.
- **Prohibited.** Flooring at zero; netting to hide.
- **Exception policy.** **None.**
- **Laws.** LAW-6. **Cross-refs.** NEG-1…NEG-3, RBL-18.

**FIN-10 — Cross-instrument and cross-counterparty netting MUST be an explicit, attributed decision.**
- **Rationale.** NEG-3, PC-6. Silent netting destroys per-contract traceability and conceals which relationship is actually losing money.
- **Trigger.** Any proposed set-off.
- **Preconditions.** Legal right of set-off.
- **Mandatory.** Record the decision, its legal basis, and its authority; retain per-instrument positions.
- **Prohibited.** Automatic netting; netting used to produce a positive payable.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** NEG-3, EX-1.

**FIN-11 — The Contractor Account MUST be complete, live, and reconcilable at any moment.**
- **Rationale.** EX-1, GP-11. An account that is assembled at closure is an account that cannot inform any decision taken before closure.
- **Trigger.** Continuous.
- **Preconditions.** —
- **Mandatory.** Maintain certified, paid, advance, issued, retained, and disputed positions per instrument.
- **Prohibited.** Period-end-only assembly; roll-up figures without instrument detail.
- **Exception policy.** **None.**
- **Laws.** CP-7. **Cross-refs.** § 5.26, FM-34, RI-6.

**FIN-12 — Reconciliation identities MUST be evaluable on demand for any date.**
- **Rationale.** RI-0. An identity evaluable only at period close detects leakage after the leverage has gone.
- **Trigger.** On demand; period close.
- **Preconditions.** —
- **Mandatory.** Compute RI-1…RI-12 for any date; raise an exception on violation immediately.
- **Prohibited.** Identity violations logged as reports for later review.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** RI-0…RI-12, AUD-06.

**FIN-13 — Financial period status MUST govern every posting.**
- **Rationale.** PG-1, PG-2. Postings into closed periods invalidate every figure that has already been reported from them.
- **Trigger.** Any posting.
- **Preconditions.** Period status.
- **Mandatory.** Post to open periods; record late facts with past effective dates in the current period.
- **Prohibited.** Silent posting into a closed period.
- **Exception policy.** PG-4 reopening.
- **Laws.** LAW-11. **Cross-refs.** PG-1…PG-4, OVR-05.

**FIN-14 — Currency, units, and precision MUST be governed centrally.**
- **Rationale.** U-1, § 7.3. A rate in one unit applied to a quantity in another is not an error to be caught in review; it must be impossible.
- **Trigger.** Any computation or data exchange.
- **Preconditions.** —
- **Mandatory.** Enforce unit compatibility structurally; apply the precision table.
- **Prohibited.** Unit conversion at the point of computation; locally chosen precision.
- **Exception policy.** **None.**
- **Laws.** CP-4. **Cross-refs.** U-1…U-3, § 7.3.1.

**FIN-15 — Every financial computation MUST declare its own failure to execute.**
- **Rationale.** DP-11, CP-11, DT-4. Silence indistinguishable from success is the condition under which a disabled control is undetectable.
- **Trigger.** Computation failure or skipped control.
- **Preconditions.** —
- **Mandatory.** Record non-execution; alert; block the dependent transaction.
- **Prohibited.** Silent skip; success assumed from absence of error.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** DP-11, GP-09, AUD-06.

**FIN-16 — Absence of an alarm MUST NOT be achievable by disabling the alarm.**
- **Rationale.** CP-11 in its strongest form. A control whose monitoring can be switched off by the party it monitors is decoration.
- **Trigger.** Configuration or access change affecting a control.
- **Preconditions.** —
- **Mandatory.** Record every enable/disable with actor and reason; alert Internal Audit independently; retain the history.
- **Prohibited.** Control suppression by an operational actor; suppression without an independent alert.
- **Exception policy.** **None.**
- **Laws.** CP-11, LAW-12. **Cross-refs.** SEC-12, AUD-06, RSK-50.

---

## 9.28 Domain EXC — Exception handling

**EXC-01 — An exception may relax a procedure; it MUST NOT relax an Immutable Law.**
- **Rationale.** LI-32, OVR-01. The distinction between a Law and a Rule is precisely the availability of an exception.
- **Trigger.** Exception request.
- **Preconditions.** —
- **Mandatory.** Test the request against § 1.8; refuse and record where it would breach a Law.
- **Prohibited.** Granting; treating repeated refusals as an argument for amendment without formal constitutional process.
- **Exception policy.** **None.**
- **Laws.** § 1.8. **Cross-refs.** LI-32, OVR-01.

**EXC-02 — Abnormal conditions MUST be raised as exceptions, never resolved silently.**
- **Rationale.** ASG-11, GP-10. Both silent outcomes — quiet inclusion and quiet refusal — destroy the record of a decision that was in fact taken.
- **Trigger.** Any condition outside normal control flow.
- **Preconditions.** —
- **Mandatory.** Raise; decide explicitly; record decision and authority.
- **Prohibited.** Local workaround; informal resolution.
- **Exception policy.** —
- **Laws.** LAW-12. **Cross-refs.** ASG-11, CP-11.

**EXC-03 — Every exception MUST record who, why, under what authority, and for how long.**
- **Rationale.** LAW-12 verbatim. An exception missing any of the four is not recorded.
- **Trigger.** Authorisation.
- **Preconditions.** —
- **Mandatory.** All four attributes, with free-text reason (OVR-03).
- **Prohibited.** Partial records; category-only reasons.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** § 5.27, OVR-02, OVR-03.

**EXC-04 — Emergency exceptions MUST be regularised within a bounded period.**
- **Rationale.** LA-5. The emergency that is never regularised is the process that was never approved.
- **Trigger.** Emergency exception.
- **Preconditions.** —
- **Mandatory.** Regularise or expire within the bound; escalate on failure to regularise.
- **Prohibited.** Indefinite emergency status.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** PEL-10, OVR-04.

**EXC-05 — Exceptions MUST expire automatically and MUST NOT renew by inaction.**
- **Rationale.** LI-29, GP-14. Renewal by silence is the mechanism by which a temporary relaxation becomes permanent.
- **Trigger.** Expiry.
- **Preconditions.** —
- **Mandatory.** Expire; require positive renewal by the authorised actor.
- **Prohibited.** Auto-renewal; expiry warnings that permit continuation.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-29, OVR-04.

**EXC-06 — Deferrals MUST be treated as exceptions, not as scheduling.**
- **Rationale.** REC-10, LI-15. Deferral that is not governed becomes indefinite waiver without anyone deciding to waive.
- **Trigger.** Any deferral of a control, recovery, or check.
- **Preconditions.** —
- **Mandatory.** Record as an exception with expiry; escalate on repetition.
- **Prohibited.** Rolling deferral.
- **Exception policy.** —
- **Laws.** LAW-12, LAW-8. **Cross-refs.** REC-10, LI-15.

**EXC-07 — Exception frequency MUST trigger automatic escalation.**
- **Rationale.** LI-31, LA-5. Frequency is the enterprise's only early warning that a control has stopped working in practice while remaining intact on paper.
- **Trigger.** Threshold breach by type, actor, project, or counterparty.
- **Preconditions.** —
- **Mandatory.** Escalate to Finance Controller and Internal Audit; review the underlying rule.
- **Prohibited.** Monitoring without consequence.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-31, OVR-08, AUD-08.

**EXC-08 — Exception counts by authoriser MUST be reportable for any period.**
- **Rationale.** LI-30. An implementation that records exceptions but cannot report them by authoriser has not satisfied LAW-12.
- **Trigger.** Period close; on demand.
- **Preconditions.** —
- **Mandatory.** Report count and value by authoriser, type, and period.
- **Prohibited.** Aggregate-only reporting.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** LI-30, OVR-07.

**EXC-09 — Refused exceptions MUST be recorded as fully as granted ones.**
- **Rationale.** PEL-12. The pattern of what was asked for and refused is among the most valuable investigative signals the enterprise holds, and it exists nowhere else.
- **Trigger.** Refusal.
- **Preconditions.** —
- **Mandatory.** Record request, requester, grounds, and refusal.
- **Prohibited.** Discarding refused requests.
- **Exception policy.** **None.**
- **Laws.** LAW-12, CP-11. **Cross-refs.** PEL-12, AUD-07.

**EXC-10 — Exceptions MUST be reviewed after closure and feed rule improvement.**
- **Rationale.** § 5.27 lifecycle `REVIEWED`. An exception library that is never reviewed accumulates the enterprise's unlearned lessons.
- **Trigger.** Exception closure; periodic governance review.
- **Preconditions.** —
- **Mandatory.** Review; classify root cause; propose rule or process change.
- **Prohibited.** Closure without review.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** § 5.27, ARB gate § 11.12.

---

## 9.29 Domain SEC — Security and access

> *Access is the mechanism through which every separation-of-duties rule is either enforced or
> quietly defeated. This domain is about authority, not about technology.*

**SEC-01 — Every actor MUST hold an individual identity; shared credentials are prohibited.**
- **Rationale.** CP-6. Attribution is impossible under shared identity, and attribution is the foundation of accountability, exception counting, and investigation.
- **Trigger.** Access grant.
- **Preconditions.** —
- **Mandatory.** Individual identity for every actor who creates, verifies, approves, or executes anything.
- **Prohibited.** Shared, generic, departmental, or role accounts.
- **Exception policy.** **None.**
- **Laws.** CP-6, LAW-12. **Cross-refs.** MBK-10, OVR-02.

**SEC-02 — Authority MUST derive from the organisational authority model, not from local grant.**
- **Rationale.** D-9, II-1. Authority created locally is authority the enterprise did not delegate.
- **Trigger.** Access grant; delegation.
- **Preconditions.** CAP-HCM authority model.
- **Mandatory.** Consume roles, limits, and validity from the authority model.
- **Prohibited.** Site- or project-level creation of financial authority.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** I-7, RBL-11.

**SEC-03 — Prohibited duty combinations MUST be structurally impossible, not policy-discouraged.**
- **Rationale.** § 4.14. Prohibition means the combination cannot be assembled, including by accumulation over time.
- **Trigger.** Any role assignment or delegation.
- **Preconditions.** SOD matrix.
- **Mandatory.** Test SOD-1…SOD-10 at grant and continuously.
- **Prohibited.** Temporary combination during absence; combination acquired by successive grants.
- **Exception policy.** § 4.14.1 small-enterprise treatment, recorded as a standing exception and counted.
- **Laws.** LAW-4. **Cross-refs.** § 4.14, § 4.14.1, GP-24.

**SEC-04 — External parties MUST NOT hold internal evidence or verification rights.**
- **Rationale.** SOD-6, CTL-08, MBK-02. A counterparty with entry rights to the evidence that constrains their payment is not a counterparty; they are an author of their own entitlement.
- **Trigger.** Access grant to any external party.
- **Preconditions.** —
- **Mandatory.** Restrict externals to their own claim submission and their own entitlement view (CP-10).
- **Prohibited.** Contractor access to musters, measurement records, or approval functions.
- **Exception policy.** **None.**
- **Laws.** LAW-4, CP-2. **Cross-refs.** CTL-08, MBK-02, RBL-17.

**SEC-05 — Delegated financial limits MUST be explicit, dated, and enforced at the moment of use.**
- **Rationale.** RBL-11, GP-17. A limit enforced at grant but not at use is a limit that survives the delegation that created it.
- **Trigger.** Any approval.
- **Preconditions.** Delegation register.
- **Mandatory.** Test amount and validity at the approval instant.
- **Prohibited.** Approval under a lapsed or superseded delegation.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** RBL-11, VAR-07.

**SEC-06 — Authority changes MUST re-evaluate pending approvals.**
- **Rationale.** Integration I-7. An approval pending under an authority that has since been withdrawn is an approval no one currently holds the power to give.
- **Trigger.** Role, limit, or validity change.
- **Preconditions.** —
- **Mandatory.** Re-evaluate and re-route pending items.
- **Prohibited.** Pending approvals completing under withdrawn authority.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** I-7, PEL-07.

**SEC-07 — Payee and banking data MUST be change-controlled with independent verification.**
- **Rationale.** WRK-10, PEL-11. Payee substitution succeeds because the request looks routine and the verification is performed by the person who received it.
- **Trigger.** Any change.
- **Preconditions.** —
- **Mandatory.** Independent-channel verification; separation of requester, verifier, and applier; permanent change history.
- **Prohibited.** Same-actor request and application; change applied to an approved voucher.
- **Exception policy.** **None.**
- **Laws.** LAW-4, LAW-11. **Cross-refs.** WRK-10, LI-23, RSK-46.

**SEC-08 — Access MUST be revoked on role change, transfer, separation, and suspension.**
- **Rationale.** LA-4. Residual access is the most common precondition of insider fraud and the least often reviewed.
- **Trigger.** Any change in status.
- **Preconditions.** —
- **Mandatory.** Revoke promptly; reconcile access to the current establishment periodically.
- **Prohibited.** Access retained "in case"; access surviving demobilisation.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** WRK-08, DEP-11.

**SEC-09 — Elevated rights MUST be time-limited and periodically reviewed.**
- **Rationale.** OVR-09. Elevated authority accumulates quietly until it becomes the normal way work is done.
- **Trigger.** Grant; periodic review.
- **Preconditions.** —
- **Mandatory.** Expiry on grant; positive renewal; periodic recertification by an independent reviewer.
- **Prohibited.** Standing elevation; recertification by the holder's own manager alone where the rights are financial.
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** OVR-09, AUD-04.

**SEC-10 — Records MUST NOT be modifiable outside the supersession mechanism, by anyone.**
- **Rationale.** MB-9, LAW-11. Administrative modification capability defeats every immutability rule in this document, silently, and is normally held by the people least subject to operational control.
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Append-only records; every change a visible superseding record with an actor.
- **Prohibited.** Direct record modification; deletion; administrative "correction" tooling without a superseding record.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** MBK-09, Part 11 § 11.7, RSK-51.

**SEC-11 — Evidence MUST be protected against destruction, including by those who created it.**
- **Rationale.** WRK-04, LAW-11. The strongest motive to destroy evidence belongs to the person who created it.
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Retention independent of the creator's control; custody records; integrity verification.
- **Prohibited.** Creator-controlled deletion; retention dependent on a single custodian.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** Part 11 § 11.8, MBK-11.

**SEC-12 — Control configuration MUST be change-controlled and independently alerted.**
- **Rationale.** FIN-16, CP-11. A control that the monitored party can reconfigure is not a control.
- **Trigger.** Any change to thresholds, tolerances, check percentages, or alerting.
- **Preconditions.** —
- **Mandatory.** Record actor, before/after values, and reason; alert Internal Audit independently; retain history.
- **Prohibited.** Operational actors changing their own control parameters.
- **Exception policy.** **None.**
- **Laws.** CP-11, LAW-12. **Cross-refs.** FIN-16, AUD-06, RSK-50.

---

## 9.30 Domain AUD — Audit

> *SOD-5: an actor who can cause a transition cannot independently audit it. Everything in this
> domain depends on that separation holding.*

**AUD-01 — Internal Audit MUST be independent of every operational actor in this capability.**
- **Rationale.** SOD-5, § 4.12. Audit performed by a participant is self-assessment with a different title.
- **Trigger.** —
- **Preconditions.** —
- **Mandatory.** Reporting line independent of project and finance operations.
- **Prohibited.** Audit staff holding any transition authority (§ 6.14).
- **Exception policy.** **None.**
- **Laws.** CP-2. **Cross-refs.** SOD-5, § 6.14.

**AUD-02 — Every financial and evidentiary act MUST leave an audit trail sufficient to reconstruct it.**
- **Rationale.** CP-7, SC-6. Reconstructibility by a third party without the original personnel is the test (objective O-9).
- **Trigger.** Every act.
- **Preconditions.** —
- **Mandatory.** Record actor, time, before/after state, and authority.
- **Prohibited.** Acts recorded only by their outcome.
- **Exception policy.** **None.**
- **Laws.** LAW-11, CP-7. **Cross-refs.** Part 11 § 11.9, MBK-10.

**AUD-03 — Measurement Book integrity MUST be independently verified on a defined cycle.**
- **Rationale.** MBK-12, GP-21. Integrity properties never tested are assumptions, and assumptions fail silently.
- **Trigger.** Audit cycle; MB closure.
- **Preconditions.** —
- **Mandatory.** Verify custody, sequence, indelibility, attribution, closure; report.
- **Prohibited.** Verification by the custodian.
- **Exception policy.** **None.**
- **Laws.** CP-2. **Cross-refs.** MBK-01…MBK-12.

**AUD-04 — Approval and delegation MUST be audited for validity, limit, and separation.**
- **Rationale.** LAW-4 is only as strong as the evidence that it held on the day.
- **Trigger.** Audit cycle; on exception.
- **Preconditions.** —
- **Mandatory.** Test every sampled approval for delegated limit, validity date, and SOD compliance.
- **Prohibited.** Sampling limited to high-value items only (splitting evades that pattern — GP-18).
- **Exception policy.** **None.**
- **Laws.** LAW-4. **Cross-refs.** SEC-05, RBL-12, AF-5.

**AUD-05 — Physical verification of workforce presence MUST be performed unannounced.**
- **Rationale.** WRK-13, GNG-08. The surprise count is the only control ghost labour cannot survive, and its value is entirely in the surprise.
- **Trigger.** Audit programme; anomaly.
- **Preconditions.** Deployment and attendance records.
- **Mandatory.** Reconcile expected to actual by identity; record variance and outcome.
- **Prohibited.** Announced verification; verification accompanied by the site's own supervisor alone.
- **Exception policy.** **None.**
- **Laws.** LAW-2. **Cross-refs.** WRK-13, RSK-01, XCP-01.

**AUD-06 — Reconciliation identity violations MUST raise exceptions immediately, not appear in reports.**
- **Rationale.** RI-0, FIN-12. A violation that waits for a report has already had time to be settled and disbursed.
- **Trigger.** Identity violation.
- **Preconditions.** —
- **Mandatory.** Raise, alert, and block the dependent transaction where the identity governs it.
- **Prohibited.** Logging without escalation.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** RI-1…RI-12, FIN-12.

**AUD-07 — Anomaly detection outputs MUST route to Internal Audit, not only to the monitored party.**
- **Rationale.** AF-11. A detection report sent only to the actor whose work it monitors is not a control.
- **Trigger.** Detection.
- **Preconditions.** —
- **Mandatory.** Independent routing; retention of the detection history.
- **Prohibited.** Site-only circulation; suppression by the monitored party (FIN-16).
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** AF-1…AF-11, ATT-19, MSR-17.

**AUD-08 — Control health MUST be reported to accountable officers every period.**
- **Rationale.** GP-21, SC-16, R-13. Every control reports its execution, including failure to execute; the report is what converts that into governance.
- **Trigger.** Period close.
- **Preconditions.** —
- **Mandatory.** Report exception counts by authoriser, override frequency, reconciliation status, ageing positions, and non-executed controls.
- **Prohibited.** Control health reported only on request or only when adverse.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** SC-16, EXC-08, OVR-07.

**AUD-09 — Investigations MUST be able to reach every record, including superseded and cancelled ones.**
- **Rationale.** WRK-04, LAW-11. The superseded record is usually the one that shows what was originally claimed.
- **Trigger.** Investigation.
- **Preconditions.** —
- **Mandatory.** Full access to current, superseded, cancelled, refused, and archived records.
- **Prohibited.** Operational filters applied to investigative access.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** Part 11 § 11.10, WRK-04.

**AUD-10 — Confirmed leakage MUST be attributed, quantified, recovered, and root-caused.**
- **Rationale.** DP-2. Correction without root cause guarantees recurrence; attribution without recovery guarantees repetition by others.
- **Trigger.** Confirmed finding.
- **Preconditions.** —
- **Mandatory.** Attribute to actors; quantify the loss; pursue recovery; identify the failed control; propose the rule change.
- **Prohibited.** Closing a finding on correction alone.
- **Exception policy.** **None.**
- **Laws.** LAW-12. **Cross-refs.** GNG-10, ADV-12, Part 10 § 10.4.

**AUD-11 — Statutory records MUST be audit-verified against operational records.**
- **Rationale.** LAB-04. Divergence between the register and the payment record is what an inspector looks for and what the enterprise usually discovers second.
- **Trigger.** Audit cycle; before inspection.
- **Preconditions.** —
- **Mandatory.** Reconcile registers to attendance, wage, and disbursement records.
- **Prohibited.** Assurance based on register completeness alone.
- **Exception policy.** **None.**
- **Laws.** CP-9. **Cross-refs.** LAB-02, LAB-04, RI-8.

**AUD-12 — Evidence retention MUST be verified, not assumed.**
- **Rationale.** § 3.4.4, LAB-14, MBK-11. Retention failures are discovered at the moment the evidence is demanded, which is the moment it cannot be recreated.
- **Trigger.** Audit cycle; project closure.
- **Preconditions.** —
- **Mandatory.** Verify existence, legibility, completeness, and reconstructibility of retained evidence.
- **Prohibited.** Retention assumed from policy.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LI-33, Part 11 § 11.8.

---

## 9.31 Domain CLS — Contract closure

> *§ 1.4.12: the final bill is where control collapses. Under schedule pressure and relationship
> fatigue, the accumulated rigour of a hundred running bills is surrendered in one meeting.*

**CLS-01 — Final measurement MUST be joint and 100% checked.**
- **Rationale.** JM-2, CK-2. The final account is the last opportunity to establish quantities, and after it there is no opportunity at all.
- **Trigger.** Closure initiation.
- **Preconditions.** —
- **Mandatory.** Joint measurement; full check by an officer independent of the project.
- **Prohibited.** Final quantities adopted from running bills without re-verification of the cumulative position.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-2. **Cross-refs.** JM-2, CK-2, MSR-09.

**CLS-02 — The final account MUST be computed before it is discussed.**
- **Rationale.** LI-26. Settlement by negotiation reverses the constitutional order and forfeits every control upstream of the meeting.
- **Trigger.** Closure.
- **Preconditions.** FC-1…FC-10 computable.
- **Mandatory.** Compute; present the computed figure; then discuss.
- **Prohibited.** Agreeing a number and reconciling to it afterwards.
- **Exception policy.** **None.**
- **Laws.** LAW-6, PA-4. **Cross-refs.** LI-26, EDR-08.

**CLS-03 — The ceiling test MUST hold at closure, including all variations.**
- **Rationale.** FC-2, VAR-12. Closure is where accumulated ceiling breaches surface, and where they are most likely to be resolved by a retrospective variation.
- **Trigger.** Closure.
- **Preconditions.** Complete variation record.
- **Mandatory.** Test cumulative certified against sanctioned plus sanctioned variations.
- **Prohibited.** Retrospective variation raised to legitimise a breach already paid.
- **Exception policy.** **None.**
- **Laws.** LAW-9. **Cross-refs.** FC-2, VAR-01, RSK-19.

**CLS-04 — All recoveries MUST be crystallised before final payment.**
- **Rationale.** FC-3, FC-4, CTL-11, ADV-09. The enterprise's leverage ends with the final payment and never returns.
- **Trigger.** Final payment preparation.
- **Preconditions.** —
- **Mandatory.** Compute and apply every outstanding advance, issued value, damage, and LD.
- **Prohibited.** Final payment with recoveries "to be settled separately".
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** FC-3, FC-4, LA-7.

**CLS-05 — Liquidated damages MUST be computed and either levied or formally waived.**
- **Rationale.** FC-7, RI-10, LD-1. LD abandoned by inaction at closure is leakage form L6 in its most valuable single instance.
- **Trigger.** Closure.
- **Preconditions.** Delay position; hindrance records.
- **Mandatory.** Compute per FM-18; levy or record a waiver with executive authority.
- **Prohibited.** Silent omission from the final account.
- **Exception policy.** Waiver per REC-12.
- **Laws.** LAW-8. **Cross-refs.** FC-7, RI-10, REC-08.

**CLS-06 — A no-claim certificate MUST NOT substitute for the enterprise's reconciliations.**
- **Rationale.** LI-28. It extinguishes the contractor's claims; it does nothing to the enterprise's unrecovered value.
- **Trigger.** Receipt of a no-claim certificate.
- **Preconditions.** —
- **Mandatory.** Complete FC-3, FC-4, FC-7 independently.
- **Prohibited.** Treating the certificate as closure evidence.
- **Exception policy.** **None.**
- **Laws.** LAW-8. **Cross-refs.** LI-28, FC-3.

**CLS-07 — Retention MUST be carried past closure until its release conditions expire.**
- **Rationale.** LI-27, RET-10. A contract is closed when the last obligation expires, not when the last rupee moves.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Carry the liability with assigned custody and monitored conditions.
- **Prohibited.** Releasing retention to close the account.
- **Exception policy.** **None.**
- **Laws.** LAW-10. **Cross-refs.** LI-27, RET-10.

**CLS-08 — Every dependent lifecycle MUST be terminal before closure.**
- **Rationale.** SY-10. An open measurement, dispute, advance, or exception at closure becomes an orphan the moment the project team disperses.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Verify terminal state across LC-02…LC-10 and LC-12.
- **Prohibited.** Closure with open dependent lifecycles.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** SY-10, § 6.16.

**CLS-09 — No validated attendance may remain unsettled at closure.**
- **Rationale.** FC-10, LAB-13. Unsettled workers at closure are both a statutory exposure and an unrecorded gain.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Settle or record as a liability with a defined treatment.
- **Prohibited.** Closure with unresolved worker entitlement.
- **Exception policy.** **None.**
- **Laws.** PA-8, CP-9. **Cross-refs.** FC-10, WRK-14.

**CLS-10 — No verified measurement may remain unbilled at closure.**
- **Rationale.** FC-9, RI-12. Verified but unbilled value is contractor detriment and a hidden enterprise liability simultaneously.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Bill or record an explicit, reasoned exclusion.
- **Prohibited.** Silent lapse of verified value.
- **Exception policy.** **None.**
- **Laws.** LAW-1, CP-10. **Cross-refs.** FC-9, EVL-10.

**CLS-11 — Closure MUST NOT occur while an obligation remains live.**
- **Rationale.** § 3.4.4, LI-27. Defect liability, retention, statutory retention, and limitation periods all outlive physical completion.
- **Trigger.** Closure request.
- **Preconditions.** —
- **Mandatory.** Test every live obligation; close only when all have expired or been discharged.
- **Prohibited.** Administrative closure for reporting convenience.
- **Exception policy.** **None.**
- **Laws.** LAW-10, LAW-11. **Cross-refs.** § 3.4.4, RET-10.

**CLS-12 — Closure outcomes MUST inform future award.**
- **Rationale.** Integration O-4, CTL-10. An enterprise that does not carry closure findings into empanelment re-awards work to the counterparty that just cost it money.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Publish performance, recovery, dispute, and LD outcomes to CAP-SCM.
- **Prohibited.** Closure findings retained within the project.
- **Exception policy.** **None.**
- **Laws.** CP-11. **Cross-refs.** integration O-4, CTL-10.

**CLS-13 — Negotiated settlement variance MUST be recorded against the computed figure.**
- **Rationale.** LI-26. Where a commercial settlement genuinely departs from the computation, the departure is the decision — and it must be attributable to the executive who took it, permanently, beside the number it replaced.
- **Trigger.** Settlement differing from the computed final account.
- **Preconditions.** Computed figure.
- **Mandatory.** Record the variance, its authority, and its reason; retain the computed figure permanently. **This rule governs the recording of a variance and confers no payment authority** (PEL-06): a settlement above the computed figure requires the entitlement itself to be changed by formal instrument (LAW-9), or it is not payable.
- **Prohibited.** Restating the computation to match the settlement. **Treating this rule as an approval route above the computed figure.**
- **Exception policy.** Executive authority, recorded, counted, reported.
- **Laws.** LAW-11, LAW-12. **Cross-refs.** LI-26, PEL-06, RSK-45.

**CLS-14 — The closed record MUST be sealed, retained, and reconstructible.**
- **Rationale.** § 3.4.4: a contract is closed when the last obligation expires and the record is sealed. Sealing is an act, not an absence of activity.
- **Trigger.** Closure.
- **Preconditions.** —
- **Mandatory.** Seal; transfer custody; verify retention and reconstructibility (AUD-12).
- **Prohibited.** Records left in project custody after demobilisation.
- **Exception policy.** **None.**
- **Laws.** LAW-11. **Cross-refs.** LI-33, MBK-11, LAB-14.

---

## 9.32 Rule catalogue summary

| Domain | Rules | Rules with **no** exception permitted | Primary leakage forms addressed |
|---|---|---|---|
| WRK | 14 | 8 | L1, L2, L7 |
| CLB | 12 | 6 | L1, L4 |
| CTL | 14 | 9 | L1, L3, L5 |
| BRL | 14 | 13 | L1, L2, L5 |
| GNG | 10 | 7 | L1, L2 |
| DEP | 11 | 7 | L1, L2 |
| ASG | 11 | 7 | L1, L4 |
| ATT | 20 | 12 | L1, L2 |
| LAB | 14 | 13 | Statutory, L1 |
| WGR | 12 | 7 | L3, L7 |
| DWG | 10 | 7 | L1, L4 |
| WKS | 12 | 10 | L2, L5 |
| PCR | 10 | 9 | L1, L2, L3 |
| PRD | 9 | 9 | L1, L3 (detection) |
| MSR | 18 | 16 | L1, L2, L3, L7 |
| MBK | 12 | 12 | L1, L3, evidence integrity |
| RBL | 18 | 17 | L2, L3, L4 |
| EVL | 10 | 10 | L3, L4 |
| PEL | 14 | 11 | L1, L2, L3, L4 |
| ADV | 14 | 11 | **L5** |
| REC | 16 | 12 | **L5, L6** |
| RET | 12 | 11 | **L6**, misstatement |
| VAR | 12 | 10 | L3, L7 |
| OVR | 10 | 10 | All (circumvention) |
| FIN | 16 | 14 | All |
| EXC | 10 | 8 | All (governance) |
| SEC | 12 | 11 | All (collusion) |
| AUD | 12 | 12 | All (detection) |
| CLS | 14 | 12 | **L5, L6**, L3 |
| **Total** | **373** | **301** | — |

> **Observation for the Architecture Review Board.** Roughly four-fifths of this catalogue admits no
> exception at all. That proportion is not an accident of drafting: in a capability whose subject is
> money leaving an enterprise on evidence created at a distance, **most rules are either structural
> or worthless.** A rule that can be set aside by the person under pressure is a rule that will be
> set aside precisely when it matters (LA-4, LA-5, DP-1).

---

# PART 10 — ENTERPRISE RISK & LEAKAGE MODEL

## 10.1 Purpose and posture

Part 9 states how a conforming enterprise behaves. **Part 10 states what happens when it does not,
who makes it happen, how it is detected, and what it costs.**

This Part is written from the position of a construction auditor and a fraud investigator rather
than a risk administrator. It does not catalogue generic enterprise risks — market, weather,
political, technological. It catalogues **the specific, realistic mechanisms by which value escapes
a construction enterprise through its workforce and contractor payment chain**, in the terms a
person attempting them would recognise.

> **The posture of this Part.** § 1.5 establishes that leakage is not theft and that most escaping
> value escapes through process — omission, ambiguity, fatigue, deference, and the absence of a rule.
> **This Part is therefore not a fraud register.** It is a register of *how money leaves*, of which
> fraud is a minority subset. A risk model that looks only for dishonesty will not be looking where
> the money actually goes.

**RP-1 — Every risk is classified into exactly one of the seven leakage forms** (§ 1.5, L1–L7), or
marked **[G]** governance / **[S]** statutory / **[C]** cash-flow where no value escapes directly but
the enterprise's control or legal position degrades.

**RP-2 — Every risk names a responsible actor.** A risk owned by "the organisation" is owned by
nobody and will be managed by nobody.

**RP-3 — Prevention outranks detection outranks correction** (DP-2). Where a risk's primary control
is detective, that is recorded as a known weakness, not presented as adequacy.

**RP-4 — Residual risk is stated honestly.** A risk whose residual is described as "nil" after
controls is a risk that has not been thought about. **Every residual in this register is non-zero.**

**RP-5 — The adversarial test** (DP-6). Every control set below has been challenged with: *can this
be manipulated? can two people collude? can money leave without evidence? can evidence be
fabricated? can measurement be inflated? can labour be counted twice? can recoveries be bypassed?
can approvals be abused?* Where the answer was yes, the constitutional rule was strengthened in
Part 9 and the strengthening is cited here.

## 10.2 Severity and impact scales

| Severity | Meaning | Typical characteristic |
|---|---|---|
| **Critical** | Threatens the capability's core promise (SC-17). A single occurrence can be large; recurrence is systemic | Defeats an Immutable Law, or is undetectable in principle without a named structural control |
| **High** | Material value at risk, or statutory exposure with third-party consequence | Detectable, but usually after disbursement |
| **Medium** | Recurrent value loss at moderate unit size, or a control degradation that enables a higher risk | Visible in reconciliation |
| **Low** | Contained loss, self-correcting under the running-account principle | Absorbed at the next cumulative bill |

| Financial impact band | Characteristic pattern |
|---|---|
| **Compounding** | Small per transaction, unbounded in aggregate, invisible per instance (LA-3) — the most expensive class |
| **Episodic-large** | Rare, individually large, usually discovered late (abandonment, final account) |
| **Statutory** | Penalty, interest, and third-party liability, largely independent of the sum at issue |
| **Opportunity** | Value the enterprise was entitled to and never claimed (L6) |

## 10.3 The leakage map

| Leakage form | Where it enters | Primary structural defence | Register block |
|---|---|---|---|
| **L1 Phantom** | Attendance capture; measurement of unexecuted work | LI-16 single-occupancy; LAW-3; AUD-05 surprise count | RSK-01…10 |
| **L2 Duplicate** | Second consumption of a settled day or billed quantity | GP-04 consumption markers; enterprise-wide identity | RSK-01…10, 16…18 |
| **L3 Excess** | Over-measurement; wrong rate; wrong classification | Check measurement (§ 8.8); FM-00 rate resolution | RSK-11…19 |
| **L4 Premature** | Payment before entitlement; part-rate abuse; advance disguised as bill | LAW-1; PT-2 bound stage schedule | RSK-11…19, 42…44 |
| **L5 Unrecovered** | Advances, issued materials, hire, fuel, damages | LI-14 automatic obligation on issue | RSK-20…25 |
| **L6 Unenforced** | LD waived by inaction; retention released early or never | RI-10; RET-12 ageing | RSK-26…29 |
| **L7 Erosion** | Rate creep, scope creep, favourable rounding, grade inflation | RND-1…RND-8; AF-4 pattern analysis; VAR-01 | RSK-14, 31, 44, 57 |

---

## 10.4 Risk register

> Presented in identifier order. Identifiers are permanent and are cross-referenced throughout
> Part 9. The category index at § 10.5 groups them by discipline.

### Block A — Labour and attendance leakage (RSK-01…RSK-10)

### RSK-01 — Ghost labour
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** |
| **Description** | Wages paid for workers who did not work, do not exist, or were never on site |
| **Root cause** | Aggregation of workers into counts; identity established by the beneficiary; observation delegated to the party paid by the count (§ 1.4.3) |
| **Typical scenario** | A mate presents a gang of 40; 34 attend. Six names appear on the muster each day, drawn from real workers who left months ago and were never marked separated. The supervisor signs the muster he did not personally count |
| **Early warning indicators** | Strength unchanged through rain days; identical attendance patterns across many workers; workers appearing only in the final week of a period; headcount rising without output rising; new registrations clustered before settlement |
| **Detection mechanism** | Unannounced physical verification by identity (AUD-05); attendance vs independent presence signals (ATT-18); productivity collapse (MR-6); anomaly pattern analysis (ATT-19) |
| **Preventive controls** | WRK-01 identity before payment; WRK-02 enterprise-wide unique identity; ATT-02 capture by enterprise officer; ATT-05 individual not headcount; GNG-04 mate cannot validate; BRL-08 claim requires validation |
| **Detective controls** | AUD-05; ATT-18; ATT-19; RI-7; PRD-04 |
| **Corrective controls** | Recovery from the intermediary; attribution to mate and supervisor (GNG-10); blacklisting; AUD-10 root cause |
| **Severity** | **Critical** |
| **Business impact** | Site strength unknown; productivity data corrupted; every labour-cost decision built on a false denominator |
| **Financial impact** | **Compounding** — small daily, unbounded over a project |
| **Responsible actor** | Site Supervisor (§ 4.5, explicitly accountable); Gang Leader (§ 4.2) |
| **Escalation path** | Supervisor → Project Manager → Internal Audit → Finance Controller |
| **Recovery strategy** | Deduct from intermediary's running account at waterfall priority 3–6; pursue under contract; report where statutory offence |
| **Residual risk** | **Medium.** Collusion between supervisor and mate defeats single-observer capture. Mitigated only by surprise verification frequency and independent presence signals — never eliminated |

### RSK-02 — Duplicate worker identity
| | |
|---|---|
| **Category / form** | Labour leakage · **L1/L2** |
| **Description** | One human being carried as two or more workers, permitting the same person to be paid twice |
| **Root cause** | Identity derived from contractor or project rather than the enterprise (§ 5.2); re-registration on re-engagement |
| **Typical scenario** | A worker leaves contractor A and joins contractor B on the same site. B registers him afresh. Both musters carry him for an overlapping fortnight; both are settled |
| **Early warning indicators** | Registrations with matching biometric/photographic references; same name and trade across contractors; workers registered more than once in a quarter |
| **Detection mechanism** | Identity de-duplication at registration; enterprise-wide attendance uniqueness test (ATT-06) |
| **Preventive controls** | WRK-02; WRK-07 no dual intermediary; BRL-04 registration before attendance; BRL-10; LI-16 |
| **Detective controls** | ATT-06 rejection log; RI-7; RI-11 |
| **Corrective controls** | Merge under supersession (never deletion — WRK-04); recover the duplicate settlement |
| **Severity** | **Critical** |
| **Business impact** | Every anti-duplication control downstream is void, because they all key on identity |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor for registration; CAP-HCM for the identity foundation (D-13) |
| **Escalation path** | Supervisor → Project Manager → Internal Audit |
| **Recovery strategy** | Recover from the intermediary who presented the duplicate; correct forward |
| **Residual risk** | **Medium** where documentary identity is unavailable and alternative identity is weak (WRK-03) |

### RSK-03 — Undeclared workforce on site
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** · **[S]** |
| **Description** | Workers present and working who appear in no enterprise record |
| **Root cause** | Site access not bound to registration; contractor treats its workforce as its own business |
| **Typical scenario** | A subcontractor brings 12 additional workers for a pour. None are registered. One is injured. The enterprise cannot establish who was on its site or under whose authority |
| **Early warning indicators** | Gate counts exceeding registered strength; safety inductions exceeding musters; canteen or transport counts diverging |
| **Detection mechanism** | Gate/induction reconciliation; unannounced count (AUD-05) |
| **Preventive controls** | CTL-04 access bound to registration; CTL-02 individual visibility; DEP-01 |
| **Detective controls** | ATT-18; WRK-13 |
| **Corrective controls** | Same-day registration; contractor notice; recovery of any statutory cost |
| **Severity** | **High** |
| **Business impact** | Statutory exposure on injury; unknown population against which ghost labour hides |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Site Supervisor; Project Manager |
| **Escalation path** | Project Manager → HSE → Finance Controller |
| **Recovery strategy** | Contractual penalty; cost recovery for statutory consequences |
| **Residual risk** | **Medium** on large, multi-gate, or dispersed sites |

### RSK-04 — Mate-inflated attendance
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** |
| **Description** | The intermediary reports more workers or more days than were worked |
| **Root cause** | § 4.2 conflict declaration — the mate's earnings rise with the count they themselves report |
| **Typical scenario** | Gang paid per worker-day. Mate reports 30 days for 28 workers who each worked 26. The difference is small, plausible, and repeated for eleven months |
| **Early warning indicators** | Reported days consistently at or near theoretical maximum; no absence variability; mate's reported strength exceeding output-implied strength |
| **Detection mechanism** | Independent validation (BRL-08); productivity analysis (MR-6); worker wage-card acknowledgement mismatch (RI-8) |
| **Preventive controls** | ATT-02; ATT-03 claim not evidence; GNG-04; GNG-09 remuneration not linked to reported headcount; CTL-12 |
| **Detective controls** | RI-7; RI-8; ATT-19 |
| **Corrective controls** | Recovery from mate's dues; attribution (GNG-10) |
| **Severity** | **High** |
| **Business impact** | Corrupts the productivity baseline used for future estimating |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Gang Leader; validating Site Supervisor |
| **Escalation path** | Supervisor → Project Manager → Internal Audit |
| **Recovery strategy** | Deduct from intermediary settlement; terminate engagement |
| **Residual risk** | **Medium.** Survives where the validating officer accepts the mate's list as the starting point rather than counting independently |

### RSK-05 — Intermediated wage skimming
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** · **[S]** |
| **Description** | The enterprise pays the intermediary correctly; the worker receives less |
| **Root cause** | Payment intermediated without individual visibility; workers unbanked and often illiterate in the language of the contract (§ 4.1) |
| **Typical scenario** | Supplier invoiced at ₹650/day per worker; workers receive ₹480 in cash. No individual record exists, so the difference is invisible and the statutory floor is breached in the enterprise's name |
| **Early warning indicators** | Absence of worker acknowledgements; workers unable to state their own rate; wage complaints; high worker turnover under one supplier |
| **Detection mechanism** | Wage-card reconciliation (RI-8); direct worker enquiry; minimum-wage test against the worker's receipt (MW-2) |
| **Preventive controls** | BRL-06 individual records; BRL-07 margin visible and decomposed; LAB-08 acknowledgement by the named worker; LAB-09 transparency; GNG-05 |
| **Detective controls** | RI-8; BRL-09; AUD-11 |
| **Corrective controls** | Direct payment to workers (CTL-06); recovery from supplier; termination |
| **Severity** | **Critical** — statutory and reputational, not merely financial |
| **Business impact** | Principal-employer liability; site stoppage; inspection finding |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Petty Contractor / Labour Supplier (§ 4.4); Accountant for detection |
| **Escalation path** | Project Manager → Finance Controller → Legal |
| **Recovery strategy** | Pay workers directly, recover at waterfall priority 2 (FM-13) |
| **Residual risk** | **High** where cash disbursement is unavoidable and literacy is low. The controls reduce it; the environment does not permit elimination (§ 1.4.10) |

### RSK-06 — Attendance against a closed or non-existent work front
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** |
| **Description** | Attendance validated for a location where no work could have occurred |
| **Root cause** | Front status not recorded or not tested at validation |
| **Typical scenario** | A front closed for design revision on the 3rd. Twelve workers show attendance there until the 19th, reassigned in the record only afterwards |
| **Early warning indicators** | Attendance on fronts with no measurement in the period; attendance during declared closures |
| **Detection mechanism** | Attendance vs front status and calendar (ATT-12); attendance vs measurement by front |
| **Preventive controls** | ASG-04; GNG-07; ATT-12; ATT-13 idle classification |
| **Detective controls** | MR-6; period-close reconciliation |
| **Corrective controls** | Reclassify to idle with cause and authority, or recover |
| **Severity** | **Medium** |
| **Business impact** | Cost attributed to the wrong activity; productivity distorted |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor |
| **Escalation path** | Project Manager |
| **Recovery strategy** | Correct forward under supersession; recover where fictitious |
| **Residual risk** | **Low** where front status is maintained; **High** where it is not |

### RSK-07 — Retrospective work assignment
| | |
|---|---|
| **Category / form** | Labour leakage · **L1/L4** · **[G]** |
| **Description** | Assignment records created after the work date to legitimise attendance already captured |
| **Root cause** | LI-03 not enforced; assignment treated as paperwork rather than authority |
| **Typical scenario** | Attendance is captured for 60 workers; at period close, 60 assignments are generated dated to match |
| **Early warning indicators** | Assignment creation timestamps clustered at period end; assignment dates uniformly equal to attendance dates; bulk creation by one actor |
| **Detection mechanism** | Creation-date vs effective-date analysis (OVR-06); ASG-01 flagging |
| **Preventive controls** | ASG-01; ASG-05 named issuer; ATT-07 validation against assignment |
| **Detective controls** | OVR-06 backdating report; AUD-07 |
| **Corrective controls** | Exception record; review of the period's settlements |
| **Severity** | **High** — it converts LAW-2 into a formality |
| **Business impact** | The second limb of LAW-2 stops functioning as a control while appearing to be satisfied |
| **Financial impact** | Enables RSK-01; not directly quantifiable alone |
| **Responsible actor** | Site Supervisor; Site Engineer |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Re-verify the affected period; recover confirmed phantom value |
| **Residual risk** | **Medium.** Genuine operational lag makes some retrospection legitimate; only the pattern distinguishes it |

### RSK-08 — Work performed without assignment
| | |
|---|---|
| **Category / form** | Labour leakage · **L4** · **[S]** |
| **Description** | Effort expended with no covering authority, then either paid without basis or refused without record |
| **Root cause** | Operational reality outrunning the record; no defined route for the unassigned case |
| **Typical scenario** | Workers directed verbally to clear a collapsed excavation over a weekend. No assignment exists. The days are paid quietly, or refused quietly, depending on who reviews them |
| **Early warning indicators** | Attendance without assignment appearing regularly at one site; disputes about unpaid days |
| **Detection mechanism** | ATT-07 validation failures; exception register |
| **Preventive controls** | ASG-01; ASG-11 explicit exception route |
| **Detective controls** | Exception frequency by site (EXC-07) |
| **Corrective controls** | Attributed decision; pay where the work occurred (PA-8); correct the assignment discipline |
| **Severity** | **Medium** |
| **Business impact** | Either an unsupported payment or an unpaid worker — both are enterprise failures |
| **Financial impact** | **Statutory** where unpaid |
| **Responsible actor** | Site Supervisor |
| **Escalation path** | Project Manager |
| **Recovery strategy** | Regularise through exception; not a recovery event where genuine |
| **Residual risk** | **Medium** — inherent to construction's improvisational reality |

### RSK-09 — Retrospective bulk attendance capture
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** · **[G]** |
| **Description** | Attendance reconstructed in an office at period end rather than captured at site daily |
| **Root cause** | Connectivity, convenience, or supervisor workload; capture treated as reporting rather than evidence |
| **Typical scenario** | A fortnight's musters are entered in one sitting from a notebook, or from the mate's summary |
| **Early warning indicators** | Capture timestamps clustered; identical capture times across many days; capture by an actor not present at site |
| **Detection mechanism** | Capture-timestamp analysis; geolocation where captured (Part 11 § 11.7) |
| **Preventive controls** | ATT-01 capture at point of occurrence; ATT-10 method recorded; delayed capture recorded and counted |
| **Detective controls** | AF-8-style interval analysis applied to attendance; ATT-19 |
| **Corrective controls** | Restore daily capture; treat the affected period as lower-confidence evidence (Part 11 § 11.4) |
| **Severity** | **High** |
| **Business impact** | Converts primary evidence into testimony, degrading every downstream control that relies on it |
| **Financial impact** | Enables RSK-01, RSK-04 |
| **Responsible actor** | Site Supervisor |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Re-verification of the period by independent means |
| **Residual risk** | **Medium** on remote sites with genuine connectivity constraints |

### RSK-10 — Proxy attendance
| | |
|---|---|
| **Category / form** | Labour leakage · **L1** |
| **Description** | One worker registers presence for another — shared credentials, shared biometric enrolment, passed tokens |
| **Root cause** | Capture mechanism binds to a credential rather than to a person; enrolment quality unverified |
| **Typical scenario** | Two workers share one card; one attends, both are marked present. Or a biometric is enrolled from the mate's finger for four "workers" |
| **Early warning indicators** | Sequential captures seconds apart; captures from one device for workers deployed to different fronts; enrolment anomalies |
| **Detection mechanism** | Capture-sequence and device analysis; enrolment audit; physical verification (AUD-05) |
| **Preventive controls** | WRK-03 durable identity with attested enrolment; ATT-10 method recorded; SEC-01 individual identity |
| **Detective controls** | ATT-18; ATT-19 |
| **Corrective controls** | Re-enrolment under supervision; recovery; attribution |
| **Severity** | **High** |
| **Business impact** | Undermines confidence in the strongest available attendance evidence class |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor; enrolment officer |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Recover confirmed days; re-enrol the affected population |
| **Residual risk** | **Medium.** No capture technology is proof against collusion at enrolment |

---

### Block B — Measurement and valuation leakage (RSK-11…RSK-19)

### RSK-11 — Payment against unmeasured work
| | |
|---|---|
| **Category / form** | Measurement risk · **L1/L4** |
| **Description** | Value certified without a verified measurement behind it |
| **Root cause** | Schedule pressure; measurement treated as documentation to be completed later (§ 1.4.8) |
| **Typical scenario** | A bill is certified on the engineer's assurance that "the quantities are broadly right"; measurement follows in the next period and is fitted to the amount already paid |
| **Early warning indicators** | Bills certified with measurement dates after the bill date; measurement clustered immediately after payment; round-figure certifications |
| **Detection mechanism** | G-1 traceability test; AF-8 measurement-to-bill interval; MSR-17 |
| **Preventive controls** | MSR-01; RBL-02; PEL-03; G-1 as a hard stop |
| **Detective controls** | RI-1; MSR-17; AUD-04 |
| **Corrective controls** | Recover on the next cumulative bill (LAW-6 self-correction); investigate the certifier |
| **Severity** | **Critical** — it defeats LAW-1 directly |
| **Business impact** | The enterprise's central promise fails; every figure downstream is unfounded |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Project Manager (certifier); Accountant (verifier) |
| **Escalation path** | Finance Controller → CEO/MD → Internal Audit |
| **Recovery strategy** | Cumulative self-correction; recovery from the next bill; disciplinary attribution |
| **Residual risk** | **Low** where G-1 is structural; **Critical** where it is procedural |

### RSK-12 — Item misclassification
| | |
|---|---|
| **Category / form** | Measurement risk · **L3/L7** |
| **Description** | Correct quantity recorded against a higher-rate item than the work performed |
| **Root cause** | Ambiguous item descriptions; classification left to the measurer without check; rate advantage invisible per entry (§ 1.4.11) |
| **Typical scenario** | Excavation in ordinary soil booked as excavation in hard rock; brickwork above plinth booked at the superstructure rate throughout |
| **Early warning indicators** | Quantity migrating toward higher-rate items over time; item mix diverging from BOQ proportions; hard-material proportions above geological expectation |
| **Detection mechanism** | AF-6 classification drift analysis; MR-1 measured vs BOQ; check measurement confirming classification (CK-6) |
| **Preventive controls** | MSR-03; ME-1/ME-2 item and as-executed description; MM-3; MSR-06 check includes classification |
| **Detective controls** | AF-6; MR-1; MR-2 consumption reconciliation |
| **Severity** | **High** |
| **Business impact** | Silent, systematic overpayment that no single transaction reveals |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Engineer (§ 4.6, permanently accountable) |
| **Escalation path** | Check Measurement Officer → Project Manager → Internal Audit |
| **Recovery strategy** | Re-classification and cumulative correction; recovery of the differential |
| **Residual risk** | **Medium.** Genuine classification judgement exists; only pattern analysis separates it from drift |

### RSK-13 — Unbounded day work
| | |
|---|---|
| **Category / form** | Measurement risk · **L1/L4** |
| **Description** | Work paid on time rather than output, without cap, authorisation, or output reconciliation |
| **Root cause** | Day work is easy to authorise and hard to verify; it removes measurement from the payment path (UG-3) |
| **Typical scenario** | "Day work as directed" runs for four months on a site with no measurable output attached, absorbing labour the contractor cannot deploy elsewhere |
| **Early warning indicators** | Day-work value rising as a proportion of certification; day work with no corresponding measured output; day work authorised by the same officer repeatedly |
| **Detection mechanism** | Day-work proportion reporting; MR-6 productivity; exception frequency |
| **Preventive controls** | CTL-01; DWG-04 cap and prior authorisation; UG-3 bounded |
| **Detective controls** | Proportion monitoring; AUD-08 |
| **Corrective controls** | Convert to measured items; terminate the authorisation |
| **Severity** | **High** |
| **Business impact** | The contract becomes a labour-supply arrangement at outcome prices |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Project Manager |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Limited — day work already worked is generally payable; the control is preventive |
| **Residual risk** | **Medium**, and higher on refurbishment and remedial works where day work is genuinely appropriate |

### RSK-14 — Rate leakage
| | |
|---|---|
| **Category / form** | Valuation risk · **L3/L7** |
| **Description** | Work valued at a rate other than the contracted rate in force at the work date |
| **Root cause** | Site-level rate agreement; rates resolved by billing date; analogous-item pricing (§ 1.4.11) |
| **Typical scenario** | A rate revised upward in June is applied to work executed in March, across a whole bill, because the system resolves rates as "current" |
| **Early warning indicators** | Rate versions applied inconsistently across a period boundary; bills spanning a rate change with a single rate; star rates appearing without derivation records |
| **Detection mechanism** | RI-1 recomputation; rate-version audit; PC-2/PC-3 violation detection |
| **Preventive controls** | FM-00 work-date resolution; CTL-07 no site variation; RBL-06; MSR-14; SR-1…SR-4 |
| **Detective controls** | RI-1; AUD-04 |
| **Corrective controls** | Recompute and self-correct cumulatively; recover the differential |
| **Severity** | **High** |
| **Business impact** | Invisible per transaction, systematic in aggregate — the definition of L7 |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Accountant; Site Engineer for classification |
| **Escalation path** | Finance Controller → Internal Audit |
| **Recovery strategy** | Cumulative correction at the next bill |
| **Residual risk** | **Low** where rate resolution is structural; **High** where it is manual |

### RSK-15 — Over-measurement
| | |
|---|---|
| **Category / form** | Measurement risk · **L3** |
| **Description** | Quantities recorded in excess of work actually executed |
| **Root cause** | The measurer is judged on progress (§ 1.4.4); check measurement weak, sampled by the measured party, or omitted |
| **Typical scenario** | Concrete measured to nominal drawing dimensions rather than as-built; earthwork measured to design lines with no level records; 4% added across every item, which no single check would notice |
| **Early warning indicators** | Favourable productivity outliers (PRD-05); measured concrete exceeding batching records; steel exceeding bar-bending schedule; measured quantity exceeding BOQ without variation |
| **Detection mechanism** | MR-1…MR-5 reconciliations; check measurement (CK-1…CK-5); MR-6 productivity in the favourable direction |
| **Preventive controls** | MSR-06 independent check; MSR-07 checker may not increase; MSR-09 joint measurement before concealment; CK-3 checker selects the sample |
| **Detective controls** | AF-4 rounding-direction analysis; MR-2 theoretical vs actual consumption; PRD-05 |
| **Corrective controls** | CK-5 escalate the sample to the population; cumulative correction; recover |
| **Severity** | **Critical** |
| **Business impact** | Corrupts progress reporting to CAP-PPM as well as payment |
| **Financial impact** | **Compounding**, occasionally **Episodic-large** on concealed work |
| **Responsible actor** | Site Engineer; Check Measurement Officer for undetected acceptance |
| **Escalation path** | Check Officer → Project Manager → Internal Audit |
| **Recovery strategy** | Re-measurement where still measurable; cumulative correction; recovery from running account |
| **Residual risk** | **Medium.** Concealed work re-measured only by destruction; the defence is prior joint measurement, and where that was missed the residual is **High** |

### RSK-16 — Same work paid through two payment paths
| | |
|---|---|
| **Category / form** | Measurement risk · **L2** |
| **Description** | One physical quantity settled once as contracted work and again as piece-rate or day-rate labour |
| **Root cause** | The two payment paths (§ 5.32.1) do not see each other's consumption |
| **Typical scenario** | A gang is paid piece-rate for block-laying; the same blockwork is measured and billed under the contractor's item in the same month |
| **Early warning indicators** | Labour cost and contract cost both attributed to one activity; measured output exceeding contract-path measurement |
| **Detection mechanism** | Cross-path reconciliation at period close; activity-level cost analysis |
| **Preventive controls** | PCR-05 consumption marking across paths; ASG-03 activity coding; GP-04 |
| **Detective controls** | Activity cost vs measured value; MR-6 |
| **Corrective controls** | Recover the duplicate; correct the attribution |
| **Severity** | **High** |
| **Business impact** | Activity cost data becomes unusable for estimating |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Project Manager; Accountant |
| **Escalation path** | Finance Controller → Internal Audit |
| **Recovery strategy** | Deduct from the contractor or the intermediary, whichever received the second payment |
| **Residual risk** | **Medium** — the two paths are governed by different actors and reconcile only periodically |

### RSK-17 — Rework paid as new production
| | |
|---|---|
| **Category / form** | Measurement risk · **L2/L3** |
| **Description** | Work re-executed after rejection, measured and paid as if it were additional output |
| **Root cause** | Measurement does not distinguish first execution from re-execution; quality rejections not linked to measurement |
| **Typical scenario** | A slab is rejected and recast. Both pours appear in the Measurement Book as separate entries at different locations recorded loosely enough that no one connects them |
| **Early warning indicators** | Measured quantity exceeding design quantity for an element; consumption far above theoretical (MR-2); quality rejections without a corresponding measurement supersession |
| **Detection mechanism** | MR-1 vs drawing; MR-2 consumption; quality-record linkage |
| **Preventive controls** | PCR-08; MSR-08 rejected work excluded; MSR-10 precise location; MSR-12 supersession |
| **Detective controls** | MR-1; MR-2; quality-to-measurement reconciliation |
| **Corrective controls** | Recover the duplicate; recover rework cost where the fault is the contractor's (REC-07) |
| **Severity** | **High** |
| **Business impact** | The enterprise funds its counterparty's defects twice |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Site Engineer; Check Measurement Officer |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Recovery at waterfall priority 6 |
| **Residual risk** | **Medium** where location granularity is weak |

### RSK-18 — Duplicate billing of a measurement
| | |
|---|---|
| **Category / form** | Measurement risk · **L2** |
| **Description** | The same verified measurement entry consumed by two bills |
| **Root cause** | Consumption not marked, or marked only within a project or a period; bill cancellation restoring entries without re-verification |
| **Typical scenario** | A bill is cancelled after certification; its entries are restored and billed again while the original bill is also revived and paid |
| **Early warning indicators** | Entries appearing in more than one bill's trace; cumulative billed quantity exceeding cumulative measured |
| **Detection mechanism** | RI-1; AF-1 uniqueness; cumulative reconciliation (LAW-6 makes this visible at the next bill) |
| **Preventive controls** | MSR-13; SY-1; LM-6; AF-1 enterprise-wide entry identity |
| **Detective controls** | RI-1; RI-6 |
| **Corrective controls** | Cumulative self-correction; recovery |
| **Severity** | **High** |
| **Business impact** | Direct duplicate payment; contractor account misstated |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Accountant |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Automatic under the running-account principle at the next bill |
| **Residual risk** | **Low** where bills are cumulative; **High** where they are incremental — this is the clearest single argument for LAW-6 |

### RSK-19 — Ceiling breach
| | |
|---|---|
| **Category / form** | Contractual risk · **L3** · **[G]** |
| **Description** | Cumulative certified value exceeding sanctioned value plus sanctioned variations |
| **Root cause** | Ceiling tested late in the computation, or tested against a revised ceiling that includes unsanctioned variations |
| **Typical scenario** | Certification continues past the ceiling on the understanding that a variation "is being processed". The variation is later reduced, and the enterprise has paid for value it never authorised |
| **Early warning indicators** | Ceiling utilisation above threshold (MR-7); variations in `PROPOSED` state relied upon in valuation; final bills materially above the last running bill |
| **Detection mechanism** | FM-07 at step 6 of § 7.8; RI-2 at any date; MR-7 utilisation curve |
| **Preventive controls** | RBL-05 hard stop; EVL-04 ceiling binds earned value; VAR-06 sanctioned only; CLS-03 at closure |
| **Detective controls** | RI-2; VAR-10 cumulative variation monitoring |
| **Corrective controls** | Reject and re-issue; sanction the variation properly or recover |
| **Severity** | **Critical** — LAW-9 is unconditional |
| **Business impact** | The enterprise has committed value no authority sanctioned |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Accountant to detect; Finance Controller to enforce |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Recover on the next cumulative bill; regularise only by formal variation |
| **Residual risk** | **Low** where FM-07 precedes recovery and retention computation; **High** where the ceiling is tested last |

---

### Block C — Recovery, advance and retention leakage (RSK-20…RSK-29)

> **This block is the largest in aggregate and the least policed.** Nothing visibly goes wrong: a
> deduction simply never happens (§ 1.5). L5 and L6 do not announce themselves.

### RSK-20 — Unrecovered advance
| | |
|---|---|
| **Category / form** | Financial leakage · **L5** |
| **Description** | An advance issued and never recovered, in whole or part |
| **Root cause** | Recovery plan absent, unbound, or dependent on human memory (LA-4); recovery silently skipped in periods of pressure (§ 1.4.5) |
| **Typical scenario** | ₹40 lakh mobilisation advance recovered at 15% for three bills, then omitted for eleven months during a dispute. The contractor abandons the site with ₹26 lakh outstanding and no security |
| **Early warning indicators** | Advance ageing beyond plan; bills certified with no advance recovery line; recovery percentage falling below the contractual rate; contractor requesting deferral repeatedly |
| **Detection mechanism** | RI-3 identity; ADV-14 ageing report; REC-09 completeness check at bill verification |
| **Preventive controls** | ADV-01 bound recovery plan; ADV-06 no silent deferral; ADV-07 accelerate never decelerate; RBL-07 recovery before verification; G-3 hard gate |
| **Detective controls** | RI-3; ADV-10 exposure reporting; ADV-14 |
| **Corrective controls** | Crystallise on suspension (ADV-08); recover from any payment; enforce security; write-off only as an executive loss event (ADV-12) |
| **Severity** | **Critical** |
| **Business impact** | The single most common large loss in Indian construction, and typically discovered at abandonment when nothing remains to deduct from |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Accountant (§ 4.9 — explicitly this actor's accountability) |
| **Escalation path** | Accountant → Finance Controller → CEO/MD |
| **Recovery strategy** | Waterfall priority 3; security enforcement; set-off within the same instrument; legal recovery as last resort |
| **Residual risk** | **High.** Recovery depends on a future payment existing. Where the contractor stops working, the control has already failed — which is why ADV-08 and LA-7 matter more than the recovery process itself |

### RSK-21 — Unrecovered issued value
| | |
|---|---|
| **Category / form** | Material leakage · **L5** |
| **Description** | Cement, steel, shuttering, fuel, power, water, accommodation, and plant hire supplied to a contractor and never recovered from its bills |
| **Root cause** | § 1.4.6 — the company supplies inputs to its own contractor, each a debit that must return through recovery, each routinely forgotten. Recovery raised manually, at bill time, by someone who must remember |
| **Typical scenario** | Diesel issued daily from the site tank against a register that no one values. At closure the register shows 84,000 litres and the bills show recovery of 51,000 |
| **Early warning indicators** | Issue registers not reconciled to recovery; issued value ageing; consumption exceeding theoretical (MR-2); site registers maintained outside the ledger |
| **Detection mechanism** | RI-4 identity; FC-4 at closure; MR-2 consumption reconciliation |
| **Preventive controls** | CTL-09 and REC-01 automatic obligation at issue; REC-02 valuation at issue date; REC-03 on-ledger from creation; FIN-08 |
| **Detective controls** | RI-4; REC-15; ageing reports |
| **Corrective controls** | Deduct at waterfall priority 4–5; crystallise at demobilisation (CTL-11) |
| **Severity** | **Critical** |
| **Business impact** | Value transferred out of the enterprise with no corresponding entitlement, invisible until closure |
| **Financial impact** | **Compounding**, resolving into **Episodic-large** at closure |
| **Responsible actor** | Store / issuing officer to raise; Accountant to recover |
| **Escalation path** | Project Manager → Finance Controller |
| **Recovery strategy** | Deduct from running bills; from retention; from final account |
| **Residual risk** | **High** where issue is recorded on paper at site and valued later; **Low** where valuation is automatic at issue |

### RSK-22 — Recovery lost at demobilisation
| | |
|---|---|
| **Category / form** | Financial leakage · **L5/L6** |
| **Description** | Outstanding recoveries not crystallised before the contractor leaves site and receives final payment |
| **Root cause** | LA-7 ignored — leverage is highest before payment and never returns; closure driven by schedule rather than reconciliation |
| **Typical scenario** | Final bill released to close the project before year end; ₹18 lakh of issued materials and an unrecovered secured advance are "to be settled separately". They never are |
| **Early warning indicators** | Final bills prepared before FC-3/FC-4 are computable; closure requested under reporting deadlines; recoveries listed as "pending" on a closure checklist |
| **Detection mechanism** | FC-3, FC-4 at closure; CLS-04 gate |
| **Preventive controls** | CTL-11; ADV-09 no final release with advance outstanding; CLS-04; CLS-06 no-claim certificate cures nothing |
| **Detective controls** | RI-3; RI-4; closure reconciliation |
| **Corrective controls** | Withhold final payment until crystallised; enforce security; pursue contractually |
| **Severity** | **Critical** |
| **Business impact** | Terminal — after final payment the enterprise has neither money nor leverage |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Accountant; Finance Controller |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Litigation only, which is why prevention is the whole control |
| **Residual risk** | **Medium**, rising sharply under schedule or year-end pressure |

### RSK-23 — Advance security failure
| | |
|---|---|
| **Category / form** | Financial leakage · **L5** |
| **Description** | An advance believed to be secured is in fact unsecured — guarantee expired, never received, or covering less than the outstanding |
| **Root cause** | Security recorded once and never monitored; expiry dates held outside the financial record |
| **Typical scenario** | A bank guarantee for a ₹1 crore secured advance expires eleven months before the contractor defaults. No one is watching the expiry, and the advance is 60% outstanding |
| **Early warning indicators** | Guarantees approaching expiry; guarantee value below advance outstanding; material advances with no verified material |
| **Detection mechanism** | Security register vs advance outstanding; expiry monitoring |
| **Preventive controls** | ADV-04 live security; ADV-05 material advances tied to verified materials; GP-20 ageing and escalation |
| **Detective controls** | Expiry escalation; RI-3 |
| **Corrective controls** | Demand extension; accelerate recovery; suspend further payment |
| **Severity** | **High** |
| **Business impact** | The enterprise believes it is protected and behaves accordingly, which is worse than knowing it is exposed |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Accountant; Finance Controller |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Invoke security while live; otherwise recover from payments due |
| **Residual risk** | **Medium** |

### RSK-24 — Control fails open on missing data
| | |
|---|---|
| **Category / form** | Governance · **[G]** · enabling **L5** |
| **Description** | A recovery or verification control cannot execute and the transaction proceeds with the missing value treated as zero |
| **Root cause** | Financial paths permitted to degrade on failure, contrary to DP-3 |
| **Typical scenario** | The material-issue feed is unavailable at period close. The bill computes with recovery of nil, is approved, and is paid. The recovery is never revisited because the bill shows it as zero rather than as unknown |
| **Early warning indicators** | Bills with nil recovery where issues occurred; integration outages coinciding with period close; controls reporting no execution |
| **Detection mechanism** | FIN-15 non-execution recording; II-4; RI-4 |
| **Preventive controls** | FIN-06 fail closed; PEL-08; DT-4; GP-16 |
| **Detective controls** | FIN-12 identities on demand; AUD-06 |
| **Corrective controls** | Recompute and correct cumulatively; recover |
| **Severity** | **High** |
| **Business impact** | Leakage arrives through the arithmetic rather than through the process, so no one involved has done anything visibly wrong |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Finance Controller (control design); Accountant (detection) |
| **Escalation path** | Finance Controller → Internal Audit |
| **Recovery strategy** | Cumulative correction |
| **Residual risk** | **Low** where fail-closed is structural; **Critical** where a fallback path exists |

### RSK-25 — Unbudgeted deployment growth
| | |
|---|---|
| **Category / form** | Operational leakage · **[G]** |
| **Description** | Labour strength growing beyond sanction through an accumulation of individually reasonable decisions |
| **Root cause** | Sanctioned strength not tested at deployment; variance visible only in period cost, by which time the cost is incurred |
| **Typical scenario** | Fifteen separate small increases over a quarter, each approved locally, none exceeding a threshold, together 40% above sanctioned strength |
| **Early warning indicators** | Strength variance trending upward; repeated small deployment amendments by one approver; labour cost per unit output rising (FM-32) |
| **Detection mechanism** | DEP-02 test at approval; DEP-08 variance reporting; PRD-07 |
| **Preventive controls** | CLB-02; DEP-02; GP-18 cumulative testing |
| **Detective controls** | DEP-08; PRD-07 |
| **Corrective controls** | Re-sanction or reduce; attribute the variance |
| **Severity** | **Medium** |
| **Business impact** | Project labour cost escapes control without any single transaction appearing irregular |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Project Manager |
| **Escalation path** | Project Manager → Finance Controller |
| **Recovery strategy** | Not recoverable — this is a budget control, not a leakage recovery |
| **Residual risk** | **Medium** |

### RSK-26 — Liquidated damages not levied
| | |
|---|---|
| **Category / form** | Contractual · **L6** |
| **Description** | LD contractually due, never accrued, never levied, never formally waived |
| **Root cause** | LD treated as an act of will rather than an automatic contractual consequence (LD-1); relationship reluctance; hindrance records absent so the position is indefensible |
| **Typical scenario** | Eight months' delay, ₹2.4 crore LD entitlement. It is never raised because the contractor is still needed on site, and at closure it is traded away in a settlement that is never quantified |
| **Early warning indicators** | Delay recorded in the programme with no LD accrual; LD absent from contractor account; hindrance records missing for the delay period |
| **Detection mechanism** | RI-10 identity (`LD_accrued = LD_levied + LD_waived`); FC-7 at closure |
| **Preventive controls** | REC-08 automatic accrual; LD-2 hindrance netting; CLS-05 levy or formal waiver at closure |
| **Detective controls** | RI-10; VAR-11 time consequence recorded |
| **Corrective controls** | Levy retrospectively where contractually open; record a waiver with executive authority and count it |
| **Severity** | **High** |
| **Business impact** | The purest L6: nothing goes wrong, an entitlement simply evaporates |
| **Financial impact** | **Opportunity** — frequently the largest single unclaimed sum on a delayed project |
| **Responsible actor** | Project Manager to establish delay; Accountant to accrue; Finance Controller to enforce |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Deduct at waterfall priority 7 before final payment |
| **Residual risk** | **High.** LD is the entitlement most readily surrendered under relationship pressure, and RI-10 only makes the surrender visible — it cannot prevent it |

### RSK-27 — Borrowed labour mismatch
| | |
|---|---|
| **Category / form** | Labour leakage · **L2** |
| **Description** | Transfer entries unmatched, so a worker-day is borne by two projects or by neither |
| **Root cause** | Single-sided transfer recording; entries raised at period close from memory; no dual accountability |
| **Typical scenario** | Twelve workers moved for a pour and returned. The borrowing project records nothing; the lending project keeps paying and keeps the cost. The workers appear on both musters for three days |
| **Early warning indicators** | Debits and credits not balancing enterprise-wide; transfers recorded only by one side; overlapping deployments |
| **Detection mechanism** | RI-11 enterprise-wide balance; LI-16 at validation |
| **Preventive controls** | BRL-01 same-date matched entries; BRL-02 dual accountability; DEP-05 no overlap; CLB-11 |
| **Detective controls** | RI-11; BRL-03 reconciliation to validated days |
| **Corrective controls** | Correct the ledger; recover the duplicated settlement |
| **Severity** | **Medium** |
| **Business impact** | Project cost misstated in both directions; productivity distorted on both sides |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Lending and borrowing officers jointly (BRL-02) |
| **Escalation path** | Project Managers → Finance Controller |
| **Recovery strategy** | Inter-project adjustment; recovery where a duplicate settlement occurred |
| **Residual risk** | **Medium** — transfers are operationally informal by nature |

### RSK-28 — Improper waiver of recovery
| | |
|---|---|
| **Category / form** | Financial leakage · **L5/L6** · **[G]** |
| **Description** | A recovery extinguished by the same authority that created the obligation, or without executive sanction |
| **Root cause** | SOD-8 not enforced; waiver recorded as an adjustment rather than a loss |
| **Typical scenario** | The officer who approved an ad-hoc advance later approves its waiver as a "commercial settlement", removing the evidence of the original decision |
| **Early warning indicators** | Waivers concentrated with one authoriser; waivers shortly after adverse ageing reports; waivers recorded as adjustments |
| **Detection mechanism** | Waiver reporting by authoriser (EXC-08); RI-3/RI-4 residue |
| **Preventive controls** | REC-12 executive and separated; ADV-13; SOD-8; GP-24 |
| **Detective controls** | EXC-08; AUD-08 |
| **Corrective controls** | Reverse where improperly authorised; attribute; report as a loss |
| **Severity** | **High** |
| **Business impact** | An actor can create an exposure and erase the record of their own decision |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Finance Controller; CEO/MD for write-off |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Reinstate the obligation where the waiver was ultra vires |
| **Residual risk** | **Low** where SOD-8 is structural |

### RSK-29 — Retention failure
| | |
|---|---|
| **Category / form** | Financial · **L6** · misstatement |
| **Description** | Retention not withheld, released early, never released, or recorded as reduced cost rather than as a liability |
| **Root cause** | § 1.4.9 — retention treated as a discount rather than an obligation; release owned by nobody |
| **Typical scenario** | Retention shown as project saving for four years. At defect liability expiry the contractors claim ₹3.1 crore that was never provided for, and two of them have to be traced |
| **Early warning indicators** | Retention absent from liability reporting; retention released without a condition test; retention ageing past its release date; retention released to relieve cash pressure |
| **Detection mechanism** | RI-5 identity; FC-5 at closure; RET-12 ageing |
| **Preventive controls** | RET-01 withhold at bound rate; RET-02 liability from the instant withheld; RET-04 positive condition test; RET-05 no early release; RET-06 net of recovery |
| **Detective controls** | RI-5; RET-08 period reconciliation; RET-12 |
| **Corrective controls** | Restate the liability; recover early releases; assign release ownership |
| **Severity** | **High** |
| **Business impact** | Simultaneous financial misstatement and legal exposure (§ 1.4.9) |
| **Financial impact** | **Episodic-large** and **Opportunity** |
| **Responsible actor** | Accountant; Finance Controller |
| **Escalation path** | Finance Controller → CFO |
| **Recovery strategy** | Recover early releases from remaining dues or security |
| **Residual risk** | **Medium**, concentrated at the point where projects close and custody transfers (RET-10) |

---

### Block D — Statutory, wage and worker risks (RSK-30…RSK-37)

### RSK-30 — Statutory minimum wage breach
| | |
|---|---|
| **Category / form** | Statutory · **[S]** |
| **Description** | A worker's effective receipt falling below the statutory minimum for trade, grade, region, and date |
| **Root cause** | Rate schedules not tested on statutory revision; intermediary margin taken from the wage; deductions applied without ceiling |
| **Typical scenario** | A statutory revision effective 1 April is applied from 1 July when the notification is processed. Three months of workers were underpaid, and the enterprise discovers it during an inspection |
| **Early warning indicators** | FM-25 failures; statutory revisions not reflected in schedules; supplier rates that cannot be decomposed (BRL-07) |
| **Detection mechanism** | FM-25 per worker per period; WGR-05 schedule test on revision; MW-2 tested at the Wage Card |
| **Preventive controls** | LAB-06; WGR-05; WGR-06 effective-date application; BRL-07 margin decomposition; LAB-11 deduction ceiling |
| **Detective controls** | RI-8; AUD-11 register reconciliation |
| **Corrective controls** | Pay arrears; correct the rate as an attributed act (LAB-07); never a silent top-up |
| **Severity** | **Critical** |
| **Business impact** | Statutory penalty, interest, third-party liability, reputational exposure, and site unrest |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Finance Controller for schedules; Accountant for the test; Project Manager for site practice |
| **Escalation path** | Finance Controller → CFO → Legal |
| **Recovery strategy** | Not recoverable — arrears are paid, and recovery from a supplier addresses the commercial loss only |
| **Residual risk** | **Medium**, higher where intermediation is deep and cash disbursement common |

### RSK-31 — Grade inflation
| | |
|---|---|
| **Category / form** | Labour leakage · **L7** |
| **Description** | Workers classified at a higher skill grade than evidenced, attracting a higher rate |
| **Root cause** | Grade asserted by the mate or supplier; classification unevidenced; upgrade never reviewed |
| **Typical scenario** | 40% of a gang classified as skilled where the work and the output indicate otherwise. The differential is ₹120 per day per worker, indefinitely |
| **Early warning indicators** | Grade mix diverging from trade norms; upgrades clustered before settlement; grade distribution differing sharply between comparable sites |
| **Detection mechanism** | Grade-mix analysis by site and supplier; evidence audit |
| **Preventive controls** | WRK-05 evidenced classification; WGR-02 rate follows evidenced grade; central authorisation |
| **Detective controls** | WGR-11 cross-project consistency; grade-mix reporting |
| **Corrective controls** | Re-classify forward; recover where fraudulent |
| **Severity** | **Medium** |
| **Business impact** | Silent permanent uplift to labour cost |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor; Project Manager |
| **Escalation path** | Project Manager → Finance Controller |
| **Recovery strategy** | Forward correction; recovery only where classification was falsified |
| **Residual risk** | **Medium** — skill assessment is genuinely judgemental |

### RSK-32 — Contractor fails to pay its workers
| | |
|---|---|
| **Category / form** | Statutory · **[S]** |
| **Description** | A contractor paid by the enterprise does not pay the workers it deployed |
| **Root cause** | Contractor cash distress; enterprise verifying its own payment but not the onward payment (§ 4.4) |
| **Typical scenario** | Contractor paid on the 10th; workers unpaid for six weeks; work stops; the enterprise is named as principal employer and pays twice |
| **Early warning indicators** | Wage evidence not produced for the prior period; worker complaints; contractor requesting advances; high labour turnover under one contractor |
| **Detection mechanism** | CTL-05 prior-period wage evidence; RI-8; direct worker enquiry |
| **Preventive controls** | CTL-05 gate before next settlement; LAB-05; BRL-09; LAB-02 records held by the enterprise |
| **Detective controls** | RI-8; AUD-11 |
| **Corrective controls** | CTL-06 — pay the workers directly and recover at waterfall priority 2 |
| **Severity** | **Critical** |
| **Business impact** | Site stoppage, statutory finding, reputational damage, and double payment |
| **Financial impact** | **Statutory** and **Episodic-large** |
| **Responsible actor** | Project Manager; Accountant |
| **Escalation path** | Project Manager → Finance Controller → Legal |
| **Recovery strategy** | Recover from contractor dues, retention, and security |
| **Residual risk** | **Medium.** The control is leverage-dependent: it works while a next payment exists |

### RSK-33 — Stranded worker entitlement
| | |
|---|---|
| **Category / form** | Statutory · **[S]** |
| **Description** | Validated attendance never settled because the worker left, the supplier was terminated, or the site closed |
| **Root cause** | Settlement conditional on a claim; demobilisation not triggering settlement; dues least likely to be claimed are the least likely to be paid |
| **Typical scenario** | A supplier is terminated mid-month. 60 workers disperse with 11 days unsettled. The dues sit in no ledger and are eventually absorbed |
| **Early warning indicators** | Validated attendance unsettled and ageing (WKS-11); demobilisations with open attendance; deployments closed without settlement |
| **Detection mechanism** | RI-7; WKS-11 ageing; FC-10 at closure |
| **Preventive controls** | WRK-14; LAB-13 settle without requiring a claim; BRL-13 on intermediary termination; DEP-11 |
| **Detective controls** | WKS-11; FC-10 |
| **Corrective controls** | Settle; where the worker is unlocatable, hold as a liability with a defined statutory treatment — never absorb as income |
| **Severity** | **High** |
| **Business impact** | Unrecorded enterprise gain, statutory exposure, and a grievance that surfaces years later |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Accountant; Project Manager |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Not applicable — this is an obligation to discharge, not value to recover |
| **Residual risk** | **Medium**, concentrated at demobilisation and supplier termination |

### RSK-34 — Cash disbursement leakage
| | |
|---|---|
| **Category / form** | Labour leakage · **L1/L2** |
| **Description** | Wages disbursed in cash that do not reach the named worker in full |
| **Root cause** | § 1.4.10 — genuine unbanked workforce; informality is not fraud but is an environment in which fraud is undetectable |
| **Typical scenario** | Cash drawn against a muster of 120; 108 present; the difference is acknowledged with thumb impressions taken by the same officer who computed the muster |
| **Early warning indicators** | Acknowledgements collected by the computing officer; identical impressions; cash drawn exceeding validated days; no independent witness |
| **Detection mechanism** | Surprise verification of a sample of workers; RI-8; acknowledgement audit |
| **Preventive controls** | DWG-10 compensating controls; CLB-01 payment to the worker; LAB-08 acknowledgement by the named worker; SOD-3 computing officer ≠ disbursing officer |
| **Detective controls** | RI-8; AUD-05 |
| **Corrective controls** | Recover; attribute; move the population to banked payment where possible |
| **Severity** | **High** |
| **Business impact** | The weakest evidential point in the labour path |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Disbursing officer; Accountant |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Recovery from the responsible officer or intermediary |
| **Residual risk** | **High** while cash disbursement persists. This is honestly stated: the controls reduce it, the environment sustains it |

### RSK-35 — Overtime abuse
| | |
|---|---|
| **Category / form** | Labour leakage · **L1/L3** |
| **Description** | Overtime hours claimed that were not worked or not authorised |
| **Root cause** | Retrospective authorisation; overtime merged into the day count; no independent record of hours |
| **Typical scenario** | Four hours of overtime added for an entire gang on days when the site closed at normal time, authorised in bulk at period end |
| **Early warning indicators** | Overtime uniform across a gang; overtime on days with no corresponding output; authorisation timestamps after the work date |
| **Detection mechanism** | Authorisation-date analysis; overtime vs output; gate records |
| **Preventive controls** | CLB-04 prior authorisation; ATT-14 separate recording; DWG-06; WGR-07 correct multiplier |
| **Detective controls** | ATT-19; OVR-06 backdating report |
| **Corrective controls** | Recover unworked hours; pay genuine unauthorised hours and record the exception (OT-1) |
| **Severity** | **Medium** |
| **Business impact** | Needs no ghost worker — only a real worker and a larger number |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor; authorising officer |
| **Escalation path** | Project Manager |
| **Recovery strategy** | Deduct from the intermediary or correct forward |
| **Residual risk** | **Medium** |

### RSK-36 — Idle-time abuse
| | |
|---|---|
| **Category / form** | Labour leakage · **L1/L4** |
| **Description** | Non-working days paid as idle without a genuine or recorded cause |
| **Root cause** | Idle time payable without a positive cause record; hindrance classification applied retrospectively to justify payment |
| **Typical scenario** | Fourteen "rain days" in a month with four recorded rainfall events, classified after the muster was queried |
| **Early warning indicators** | Idle days without hindrance records; hindrance records created after the attendance; idle proportion diverging between adjacent sites |
| **Detection mechanism** | ATT-13 linkage test; hindrance-record creation timestamps; weather and site-closure data |
| **Preventive controls** | CLB-05 cause classification; ATT-13; ATT-12 calendar test; DP-9 |
| **Detective controls** | Idle-proportion reporting; OVR-06 |
| **Corrective controls** | Reclassify; recover where fictitious |
| **Severity** | **Medium** |
| **Business impact** | Also weakens the enterprise's LD position, since unrecorded hindrance cannot be netted (LD-2) |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Supervisor; Project Manager |
| **Escalation path** | Project Manager |
| **Recovery strategy** | Correct forward; recover where fabricated |
| **Residual risk** | **Medium** |

### RSK-37 — Unlawful or unrecorded deduction from wages
| | |
|---|---|
| **Category / form** | Statutory · **[S]** |
| **Description** | Deductions taken from workers beyond the lawful ceiling, without authorisation, or without record |
| **Root cause** | Site-level recovery of welfare provision, damages, or advances without governance; recovery discipline pursued past the statutory limit |
| **Typical scenario** | Accommodation and food deducted at site-determined rates, taking several workers below the statutory floor, recorded nowhere except in the mate's notebook |
| **Early warning indicators** | Net wages varying inexplicably between comparable workers; deductions absent from wage cards; FM-27 breaches |
| **Detection mechanism** | FM-27 ceiling test; wage-card audit; worker enquiry |
| **Preventive controls** | LAB-11 lawful, authorised, within ceiling; LAB-12 welfare recoveries valued and recorded; REC-13; CLB-10; ADV-11 |
| **Detective controls** | RI-8; AUD-11; LAB-09 transparency to the worker |
| **Corrective controls** | Refund; correct the practice; attribute |
| **Severity** | **High** |
| **Business impact** | Statutory breach committed in pursuit of good recovery discipline — the most common way a control becomes an offence |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Accountant; Site Supervisor |
| **Escalation path** | Finance Controller → Legal |
| **Recovery strategy** | Refund to workers; recover from the intermediary where they imposed it |
| **Residual risk** | **Medium** |

---

### Block E — Approval, override and variation abuse (RSK-38…RSK-44)

### RSK-38 — Post-approval input drift
| | |
|---|---|
| **Category / form** | Governance · **[G]** · enabling **L2/L3** |
| **Description** | Quantities, rates, recoveries, or payee changed after approval and before disbursement |
| **Root cause** | Approval treated as a workflow state rather than as an assumption of accountability for a specific set of facts |
| **Typical scenario** | A voucher approved at ₹42 lakh is edited to ₹46 lakh before release; the approver's record still shows their approval, and nothing indicates it was for a different number |
| **Early warning indicators** | Edits between approval and release; voucher values differing from approved bill values; backdated records (OVR-06) |
| **Detection mechanism** | Approval-to-disbursement value comparison; audit trail (AUD-02) |
| **Preventive controls** | PEL-07 re-test on any change; FIN-05 approved records immutable; LI-23 amount and payee immutable; WKS-07 |
| **Detective controls** | AUD-02; OVR-06; RI-6 |
| **Corrective controls** | Reverse; re-originate; attribute |
| **Severity** | **Critical** |
| **Business impact** | Destroys the meaning of every approval in the enterprise |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Finance Controller; disbursing officer |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Recover the differential; disciplinary action |
| **Residual risk** | **Low** where immutability is structural; **Critical** where administrative edit exists (RSK-51) |

### RSK-39 — Approval above the computed figure
| | |
|---|---|
| **Category / form** | Financial · **L3** · **[G]** |
| **Description** | An approver authorises more than the computation supports |
| **Root cause** | Approval treated as a decision about amount rather than about whether the chain is complete (§ 1.6) |
| **Typical scenario** | The computed net is ₹8.4 lakh; ₹10 lakh is approved "to help with wages this month", with no advance raised and no recovery plan |
| **Early warning indicators** | Approved value exceeding computed value; round-figure approvals; approvals with manual amount entry |
| **Detection mechanism** | PEL-06 cap test; approval vs computation comparison |
| **Preventive controls** | PEL-06 computed figure is the maximum payable; FIN-02 authoritative computation; PEL-13 use an advance instead |
| **Detective controls** | AUD-04; EXC-08 |
| **Corrective controls** | Reclassify the excess as an advance with a recovery plan, or recover it |
| **Severity** | **Critical** |
| **Business impact** | Substitutes judgement for evidence at the last gate, which is the definition of an unsupported payment |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Approving authority |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Recover on the next cumulative bill |
| **Residual risk** | **Low** where the cap is structural |

### RSK-40 — Delegated-limit circumvention
| | |
|---|---|
| **Category / form** | Governance · **[G]** |
| **Description** | Transactions split, sequenced, or reclassified so that each falls within a limit the aggregate would exceed |
| **Root cause** | Thresholds tested per instance rather than cumulatively (§ 5.25 note) |
| **Typical scenario** | Three bills raised in one month, each just below the Project Manager's limit, for work that constitutes one certification |
| **Early warning indicators** | Values clustering just below thresholds (AF-5); multiple same-period bills for one instrument; variations split into parts |
| **Detection mechanism** | AF-5 threshold-clustering analysis; cumulative testing (GP-18) |
| **Preventive controls** | RBL-12; PEL-09 cumulative position governs; VAR-07; SEC-05 |
| **Detective controls** | AF-5; AUD-04 sampling not limited to high values |
| **Corrective controls** | Re-route to the correct authority; attribute the circumvention as an exception |
| **Severity** | **High** |
| **Business impact** | The delegation framework becomes advisory |
| **Financial impact** | Enables RSK-39, RSK-19 |
| **Responsible actor** | Accountant to detect; Finance Controller to enforce |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Not a recovery event; a governance failure to attribute |
| **Residual risk** | **Medium** |

### RSK-41 — Scope creep without variation
| | |
|---|---|
| **Category / form** | Contractual · **L3/L7** |
| **Description** | Work instructed verbally and executed, with the variation raised late or never |
| **Root cause** | § 1.4.7 — instructions given at site, work executed, the record created by whoever benefits from it |
| **Typical scenario** | Eighteen months of small verbal instructions surface at the final account as a ₹1.7 crore claim the enterprise cannot disprove because it holds no contemporaneous record |
| **Early warning indicators** | Variations whose executed work predates their instruction (VAR-03); measurement against items outside instrument scope; claims referencing verbal instructions |
| **Detection mechanism** | VAR-03 date comparison; ASG-06 scope test at assignment |
| **Preventive controls** | CTL-14 same-day site instruction record; ASG-06; VAR-02; LI-20 |
| **Detective controls** | VAR-03; VAR-10 |
| **Corrective controls** | Evaluate and sanction or reject; where rejected, treat as a commercial dispute (LI-21) |
| **Severity** | **High** |
| **Business impact** | The enterprise pays claims it cannot evaluate because the only record belongs to the claimant |
| **Financial impact** | **Episodic-large** at final account |
| **Responsible actor** | Project Manager; Site Engineer |
| **Escalation path** | Project Manager → Finance Controller → Legal |
| **Recovery strategy** | Limited once the work is executed; the control is entirely preventive |
| **Residual risk** | **High.** Verbal instruction is endemic to site management; only same-day recording contains it |

### RSK-42 — Emergency payment abuse
| | |
|---|---|
| **Category / form** | Governance · **[G]** · enabling **L4** |
| **Description** | The emergency route used to bypass evidence rather than sequence |
| **Root cause** | Emergency defined by urgency rather than by which controls may be relaxed (LI-32) |
| **Typical scenario** | Out-of-turn payments become the normal route for one contractor; over a year, 40% of that contractor's value is paid without measurement |
| **Early warning indicators** | Emergency exceptions concentrated by contractor, authoriser, or period; emergencies not regularised (EXC-04) |
| **Detection mechanism** | EXC-07 frequency escalation; EXC-08 counts by authoriser |
| **Preventive controls** | PEL-10 evidence never bypassed; LI-32; EXC-01; OVR-04 time-boxing |
| **Detective controls** | EXC-07; EXC-08; AUD-08 |
| **Corrective controls** | Regularise or recover; withdraw the emergency authority |
| **Severity** | **High** |
| **Business impact** | LA-5 realised — the exception has become the process |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Authorising executive |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Recover unsupported value on the next cumulative bill |
| **Residual risk** | **Medium** |

### RSK-43 — Payment released under operational pressure
| | |
|---|---|
| **Category / form** | Governance · **[G]** · **L4** |
| **Description** | Unverified payment released to keep work moving |
| **Root cause** | § 1.4.8 — the contractor threatens to stop; the slab must be poured tomorrow; "just this once" |
| **Typical scenario** | Payment released against incomplete verification before a critical pour. It happens twice more that quarter, and by the next it is the process |
| **Early warning indicators** | Payments preceding verification; releases clustered before programme milestones; the same contractor repeatedly |
| **Detection mechanism** | Payment-to-verification sequence analysis; exception frequency |
| **Preventive controls** | PEL-13 decide on evidence; PEL-04 broken chain stops payment; advance is the legitimate instrument (LC-06) |
| **Detective controls** | EXC-07; AF-8 |
| **Corrective controls** | Reclassify as an advance with a recovery plan; recover |
| **Severity** | **High** |
| **Business impact** | LA-6 — speed purchased with control, and the price paid at final settlement when leverage has gone |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Cumulative correction; convert to a recorded advance |
| **Residual risk** | **Medium**, rising with programme criticality |

### RSK-44 — Variation inflation
| | |
|---|---|
| **Category / form** | Contractual · **L3/L7** |
| **Description** | Cumulative variations expanding the contract far beyond the award, at rates never competitively tested |
| **Root cause** | Variations priced by negotiation under pressure (SR-3); ceiling monitored only against the revised value |
| **Typical scenario** | A ₹12 crore contract closes at ₹19 crore through 60 variations, none individually alarming, most priced by negotiation |
| **Early warning indicators** | Cumulative variation as a proportion of original sanction (VAR-10); variations priced by negotiation rather than derivation; variations concentrated late |
| **Detection mechanism** | VAR-10 proportion monitoring; MR-7 ceiling utilisation |
| **Preventive controls** | VAR-04 derivation preference order; VAR-05 versioned rates; VAR-07 cumulative limit testing; SR-2, SR-3 |
| **Detective controls** | VAR-10; CTL-10 exposure at award |
| **Corrective controls** | Re-derive rates; escalate the award decision |
| **Severity** | **High** |
| **Business impact** | The contract that was awarded is no longer the contract being performed, and no competitive process governs the difference |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Prospective only |
| **Residual risk** | **Medium** |

---

### Block F — Commercial, counterparty and governance risks (RSK-45…RSK-52)

### RSK-45 — Final account settled by negotiation
| | |
|---|---|
| **Category / form** | Contractual · **L3/L6** |
| **Description** | The final bill agreed at a meeting and reconciled to afterwards, rather than computed and then discussed |
| **Root cause** | § 1.4.12 — schedule pressure and relationship fatigue; the accumulated rigour of a hundred running bills surrendered in one meeting |
| **Typical scenario** | Both parties arrive with positions ₹3 crore apart. They settle at the midpoint. No one computes FC-1…FC-10, and unrecovered issued value and unlevied LD are inside the number that was traded away |
| **Early warning indicators** | Final settlement discussions before the computation is complete; settlement values that are round figures; closure driven by a reporting deadline |
| **Detection mechanism** | CLS-02 sequence enforcement; CLS-13 variance recorded against the computed figure |
| **Preventive controls** | LI-26 computed then agreed; CLS-01 joint 100% final measurement; CLS-04 recoveries crystallised; CLS-05 LD levied or waived |
| **Detective controls** | FC-1…FC-10; CLS-13 variance reporting |
| **Corrective controls** | Record the variance, its authority, and its reason permanently beside the computed figure; count it (LAW-12) |
| **Severity** | **Critical** |
| **Business impact** | Every control in Parts 6–9 is surrendered at the single point where the most value is at stake |
| **Financial impact** | **Episodic-large** and **Opportunity** combined |
| **Responsible actor** | Finance Controller; CEO/MD |
| **Escalation path** | Finance Controller → CEO/MD → Board |
| **Recovery strategy** | None after settlement — the control is entirely in the sequence |
| **Residual risk** | **High.** Commercial settlement is legitimate; what CLS-13 secures is that its cost is visible and attributed, not that it is prevented |

### RSK-46 — Payee substitution
| | |
|---|---|
| **Category / form** | Fraud · **L1** |
| **Description** | Payment diverted by changing banking details on a legitimate entitlement |
| **Root cause** | Change requests look routine; verification performed by whoever received the request; change history not retained |
| **Typical scenario** | A letter on contractor letterhead requests a bank change. It is applied by the officer who received it. Two payments totalling ₹64 lakh are diverted before the contractor asks where its money is |
| **Early warning indicators** | Bank changes shortly before a large payment; changes requested by email only; changes applied by the requester's correspondent; multiple contractors sharing an account |
| **Detection mechanism** | Change-history audit; independent confirmation; account de-duplication across counterparties |
| **Preventive controls** | WRK-10 independent-channel verification; SEC-07 separation of requester, verifier, and applier; PEL-11; LI-23 no change to an approved voucher |
| **Detective controls** | AUD-02; RI-6; account de-duplication |
| **Corrective controls** | Immediate recall (LC-10 `RECALLED`); law enforcement; reinstate the contractor's entitlement |
| **Severity** | **Critical** |
| **Business impact** | Direct, immediate, and frequently unrecoverable |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Finance Controller; Accountant |
| **Escalation path** | Finance Controller → CEO/MD → Legal |
| **Recovery strategy** | Recall through CAP-TRE if same-day; otherwise legal recovery, typically partial |
| **Residual risk** | **Medium** — social-engineering quality improves faster than verification discipline |

### RSK-47 — Self-benefiting override
| | |
|---|---|
| **Category / form** | Governance · **[G]** · all forms |
| **Description** | An actor authorises the bypass of a control that constrains their own transaction |
| **Root cause** | Override authority granted by seniority rather than by independence from the outcome |
| **Typical scenario** | A Project Manager overrides the ceiling warning on a bill they certified, for a contractor whose performance determines their own project metrics |
| **Early warning indicators** | Overrides where authoriser and originator coincide or report to one another; overrides concentrated on one instrument |
| **Detection mechanism** | Override-to-beneficiary analysis; EXC-08 counts by authoriser |
| **Preventive controls** | OVR-10 beneficiary cannot override; GP-24; SOD-10; OVR-01 Laws cannot be overridden at all |
| **Detective controls** | EXC-07; EXC-08; AUD-07 |
| **Corrective controls** | Reverse; attribute; withdraw override rights (OVR-09) |
| **Severity** | **Critical** |
| **Business impact** | GP-24 failure — an actor who can both cause a loss and conceal it |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Finance Controller; Internal Audit |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Recover the value; disciplinary action |
| **Residual risk** | **Low** where structurally prevented; **Critical** where override rights follow seniority |

### RSK-48 — Award to an over-exposed contractor
| | |
|---|---|
| **Category / form** | Commercial · **[G]** |
| **Description** | New work awarded to a contractor already carrying unrecovered exposure, increasing the loss on default |
| **Root cause** | Exposure not presented at the award decision; recovery status held in finance and the award decision taken in procurement |
| **Typical scenario** | A contractor with ₹70 lakh unrecovered advance receives two further packages. When it fails, the exposure is ₹2.3 crore instead of ₹70 lakh |
| **Early warning indicators** | Awards to contractors with ageing recoveries; exposure not referenced in award papers; concentration of value with one counterparty |
| **Detection mechanism** | CTL-10 exposure presented at award; FM-34 |
| **Preventive controls** | CTL-10; integration O-4 performance and recovery status to CAP-SCM; CLS-12 closure outcomes inform award |
| **Detective controls** | Exposure concentration reporting; ADV-10 |
| **Corrective controls** | Condition the award on recovery; require security; decline |
| **Severity** | **High** |
| **Business impact** | Converts a contained loss into a concentrated one |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Awarding authority; Finance Controller to supply the figure |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Set-off within the same counterparty, subject to FIN-10 |
| **Residual risk** | **Medium** |

### RSK-49 — Statutory obligation lost at the intermediation boundary
| | |
|---|---|
| **Category / form** | Statutory · **[S]** |
| **Description** | Each party assumes the other discharges a statutory obligation; neither does |
| **Root cause** | Obligation ownership recorded in a contract clause rather than in the operational record; discharge assumed rather than evidenced |
| **Typical scenario** | Three intermediation layers on one site. Statutory registration lapses at layer two. The enterprise discovers this when an inspector traces liability to the principal employer |
| **Early warning indicators** | Registration validity dates not tracked; obligations with no named owner; multi-layer intermediation |
| **Detection mechanism** | LAB-01 ownership record; WRK-09 registration validity; AUD-11 |
| **Preventive controls** | BRL-12; LAB-01; LAB-02 enterprise holds the records; WRK-09 verification before activation |
| **Detective controls** | AUD-11; registration expiry monitoring |
| **Corrective controls** | Discharge directly; recover from the intermediary; restructure the engagement |
| **Severity** | **High** |
| **Business impact** | Principal-employer liability crystallises regardless of contractual allocation |
| **Financial impact** | **Statutory** |
| **Responsible actor** | Finance Controller; Project Manager |
| **Escalation path** | Finance Controller → Legal → CFO |
| **Recovery strategy** | Commercial recovery from the intermediary; the statutory liability itself is not transferable |
| **Residual risk** | **Medium**, rising with each intermediation layer |

### RSK-50 — Control suppression
| | |
|---|---|
| **Category / form** | Governance · **[G]** · all forms |
| **Description** | Alerts, thresholds, tolerances, or check percentages altered or disabled by the party they monitor |
| **Root cause** | Control configuration held as operational settings rather than as governed parameters |
| **Typical scenario** | A reconciliation tolerance widened from 1% to 8% "to reduce noise". Nine months of variances pass unreported, and no one recalls who changed it |
| **Early warning indicators** | Alert volumes falling without process change; tolerance or threshold changes; check percentages reduced; controls reporting no executions |
| **Detection mechanism** | SEC-12 configuration change record with independent alerting; FIN-15 non-execution reporting |
| **Preventive controls** | FIN-16 absence of an alarm not achievable by disabling the alarm; SEC-12; CK-7 reduced checks recorded as exceptions |
| **Detective controls** | Independent configuration audit; AUD-06; AUD-08 |
| **Corrective controls** | Restore; re-run the suppressed period; attribute |
| **Severity** | **Critical** |
| **Business impact** | Every detective control in this Part becomes unreliable, and the enterprise cannot tell which period is affected |
| **Financial impact** | Enables all forms |
| **Responsible actor** | Finance Controller; Internal Audit |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Re-execute controls over the suppressed period |
| **Residual risk** | **Low** where configuration change is independently alerted; **Critical** otherwise |

### RSK-51 — Silent record modification
| | |
|---|---|
| **Category / form** | Governance · **[G]** · all forms |
| **Description** | Records altered outside the supersession mechanism, leaving no visible trace |
| **Root cause** | Administrative modification capability retained for "corrections"; immutability implemented as policy rather than structure (MB-9) |
| **Typical scenario** | A measurement quantity is corrected directly to match a bill. Both records agree, no supersession exists, and the audit trail shows a consistent history that never happened |
| **Early warning indicators** | Records whose content conflicts with derived figures elsewhere; absent supersession chains; modification capability held outside audit |
| **Detection mechanism** | Integrity verification (Part 11 § 11.7); cross-record reconciliation; MBK-12 |
| **Preventive controls** | SEC-10 no modification outside supersession; MBK-09 append-only digital MB; FIN-05; LAW-11 throughout |
| **Detective controls** | Part 11 § 11.7 integrity checks; RI-1…RI-12 divergence |
| **Corrective controls** | Reconstruct from independent evidence; treat the affected period as lower-confidence (Part 11 § 11.4) |
| **Severity** | **Critical** |
| **Business impact** | Defeats LAW-11 and therefore every investigation, every audit, and every dispute defence simultaneously |
| **Financial impact** | Enables all forms; unquantifiable in itself |
| **Responsible actor** | Finance Controller; Internal Audit |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Independent reconstruction; forensic examination |
| **Residual risk** | **Medium.** Those holding administrative capability are normally the least subject to operational control (§ 11.7 addresses this directly) |

### RSK-52 — Counterparty legitimacy failure
| | |
|---|---|
| **Category / form** | Fraud · **L1** · **[S]** |
| **Description** | Payment to an entity that is a shell, an undisclosed related party, or not the entity that was qualified |
| **Root cause** | Legal, statutory, and banking identity verified after award or not at all; related-party interests undeclared |
| **Typical scenario** | A "new" subcontractor shares a bank account and a proprietor with an existing one, and is used to bill work already billed elsewhere |
| **Early warning indicators** | Shared bank accounts, addresses, or directors across counterparties; new counterparties with immediate large awards; registrations issued shortly before award |
| **Detection mechanism** | Counterparty de-duplication; related-party declaration; banking identity comparison |
| **Preventive controls** | WRK-09 verification before activation; SEC-07 banking identity control; CTL-13 named accountable officer |
| **Detective controls** | Counterparty attribute analysis; RI-6 |
| **Corrective controls** | Suspend; investigate; recover; report where a statutory offence |
| **Severity** | **High** |
| **Business impact** | Duplicate billing through a second identity; conflict of interest; statutory exposure |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Procurement (CAP-SCM) to qualify; Finance Controller to verify identity |
| **Escalation path** | Internal Audit → CEO/MD → Legal |
| **Recovery strategy** | Recovery from any dues; legal action |
| **Residual risk** | **Medium** |

---

### Block G — Collusion, evidence and systemic risks (RSK-53…RSK-72)

> **This block answers the adversarial questions of RP-5 directly.** Every risk here assumes a
> competent, motivated participant who understands the controls and benefits from defeating them.
> **Controls that survive only good faith are decoration** (DP-6).

### RSK-53 — Measurer–contractor collusion
| | |
|---|---|
| **Category / form** | Fraud · **L1/L3** |
| **Description** | The measuring engineer and the contractor agree quantities in excess of execution |
| **Root cause** | Measurement is a judgement made alone at a location no one else visits; the check may be weak or predictable |
| **Typical scenario** | An engineer measures consistently 6% high for one contractor. The check officer samples the same items each period, and the pattern holds for two years |
| **Early warning indicators** | Consistent measurer–contractor pairing (AF-7); favourable productivity (PRD-05); consumption reconciliation variances (MR-2); low revision rate combined with high value |
| **Detection mechanism** | AF-7 pairing analysis; CK-3/CK-4 checker-selected, risk-weighted sampling; MR-2…MR-5 |
| **Preventive controls** | SOD-1; MSR-06; MSR-07 checker cannot increase; rotation of measurer–checker pairings; CK-4 |
| **Detective controls** | AF-4, AF-6, AF-7, AF-9; MR-6 |
| **Corrective controls** | CK-5 escalate to population; re-measure; recover cumulatively; disciplinary and criminal referral |
| **Severity** | **Critical** |
| **Business impact** | Defeats the primary defence of the contract path from inside |
| **Financial impact** | **Compounding** into **Episodic-large** |
| **Responsible actor** | Check Measurement Officer (accountable for measurements accepted that later prove false — § 4.7) |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Cumulative correction; recovery from the contractor; action against the officer |
| **Residual risk** | **Medium.** Collusion between measurer and checker (RSK-54's analogue) would defeat this; rotation and reconciliation are the only remaining defences |

### RSK-54 — Supervisor–mate collusion
| | |
|---|---|
| **Category / form** | Fraud · **L1** |
| **Description** | The attendance recorder and the intermediary agree an inflated count and share the proceeds |
| **Root cause** | Single-observer capture; validation performed by the same person or their close colleague |
| **Typical scenario** | Six ghost workers per day, shared between supervisor and mate, for fourteen months on a site with no independent presence signal |
| **Early warning indicators** | Same supervisor–mate pairing over long periods; ghost indicators (RSK-01) concentrated on one front; resistance to unannounced verification |
| **Detection mechanism** | AUD-05 unannounced count; ATT-18 independent signals; ATT-19 patterns; rotation |
| **Preventive controls** | ATT-08 validator ≠ reporter; GNG-04; BRL-08; SOD-7; rotation of supervisors and validators |
| **Detective controls** | RI-7; RI-8; PRD-04 |
| **Corrective controls** | Recover; attribute to both (GNG-10); dismiss; blacklist the intermediary |
| **Severity** | **Critical** |
| **Business impact** | The labour path's primary evidence is created by the two colluding parties |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Project Manager (for rotation and oversight); Internal Audit |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Recover from intermediary dues; criminal referral where established |
| **Residual risk** | **Medium–High** on remote sites with a single enterprise officer. § 4.14.1 externality is the only real answer |

### RSK-55 — Approver–contractor collusion
| | |
|---|---|
| **Category / form** | Fraud · **L3/L4** |
| **Description** | An approving officer accepts consideration to approve inflated, premature, or unsupported payment |
| **Root cause** | Approval authority concentrated; exceptions available; relationship longevity |
| **Typical scenario** | One contractor consistently receives faster certification, more favourable variation rates, and repeated deferral of recovery, all approved by the same officer |
| **Early warning indicators** | Contractor-specific exception concentration; consistently favourable rate derivations; recovery deferrals concentrated by approver–contractor pair; rapid certification cycle times for one counterparty |
| **Detection mechanism** | Pair analysis across approvals, exceptions, deferrals, and variations; EXC-08 |
| **Preventive controls** | RBL-10 four separated actors; SEC-05 limits; OVR-10; rotation; VAR-04 derivation preference order |
| **Detective controls** | EXC-07; EXC-08; AUD-04; AF-5 |
| **Corrective controls** | Suspend authority; investigate; recover; refer |
| **Severity** | **Critical** |
| **Business impact** | Corruption of the gate on which every other control depends |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Internal Audit; CEO/MD |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Recovery from the contractor; action against the officer |
| **Residual risk** | **Medium.** Separation limits the damage a single colluder can do; it does not prevent collusion across the four roles |

### RSK-56 — Undisclosed related-party interest
| | |
|---|---|
| **Category / form** | Fraud · **[G]** |
| **Description** | An enterprise officer holds an undisclosed interest in a contractor, supplier, or intermediary |
| **Root cause** | Interests not declared, not verified, and not re-declared on change |
| **Typical scenario** | A site engineer's relative operates the labour supply company whose attendance the engineer validates |
| **Early warning indicators** | Shared addresses or contact details between officers and counterparties; counterparties introduced by a single officer; resistance to rotation |
| **Detection mechanism** | Declaration register with verification; counterparty attribute comparison; RSK-52 analysis |
| **Preventive controls** | Mandatory declaration on appointment and annually; SOD enforcement; rotation; WRK-11 and CTL-08 role separation |
| **Detective controls** | Attribute matching; audit sampling |
| **Corrective controls** | Remove from the transaction chain; investigate historic transactions; recover |
| **Severity** | **High** |
| **Business impact** | Every separation-of-duties control is nominally satisfied while being substantively void |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Internal Audit; CAP-HCM |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Recovery of value; disciplinary and legal action |
| **Residual risk** | **Medium** — declarations are self-reported by definition |

### RSK-57 — Systematic favourable rounding
| | |
|---|---|
| **Category / form** | Valuation · **L7** |
| **Description** | Dimensions, quantities, or values consistently rounded in the contractor's favour |
| **Root cause** | Rounding rules undeclared or applied by discretion; per-transaction amounts too small to attract attention (§ 1.4.11) |
| **Typical scenario** | Every dimension rounded up to the nearest convenient figure. The effect is 1.5% of certified value across a ₹40 crore contract |
| **Early warning indicators** | Rounding-direction bias by measurer (AF-4); dimensions clustering at convenient values; quantities ending in repeated digits |
| **Detection mechanism** | AF-4 statistical rounding analysis; MM-5 consistency test; MR-1 |
| **Preventive controls** | MM-5 method-defined rounding applied both directions; RND-1…RND-8 in valuation; RND-5 ambiguity resolves against enterprise outflow |
| **Detective controls** | AF-4; RI-1 |
| **Corrective controls** | Re-measure; correct cumulatively |
| **Severity** | **Medium** individually, **High** in aggregate |
| **Business impact** | The definition of L7 — no single transaction looks wrong and the total is material |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Site Engineer; Check Measurement Officer |
| **Escalation path** | Check Officer → Internal Audit |
| **Recovery strategy** | Cumulative correction |
| **Residual risk** | **Medium** — detectable only statistically, and only where the analysis is actually run |

### RSK-58 — Fabricated measurement evidence
| | |
|---|---|
| **Category / form** | Fraud · **L1/L3** |
| **Description** | Photographs, level records, pour cards, or dimension sheets created or reused to support measurements that do not reflect reality |
| **Root cause** | Evidence created by the interested party; artefacts not bound to time, place, or subject |
| **Typical scenario** | The same photograph supports three pours at three locations; level records are transcribed rather than surveyed |
| **Early warning indicators** | Reused or duplicate artefacts; artefacts lacking geolocation or timestamp; evidence attached in bulk after the fact (EV-2) |
| **Detection mechanism** | Artefact duplicate detection; timestamp and geolocation validation (Part 11 § 11.7); independent-source corroboration (EV-1) |
| **Preventive controls** | MSR-11 evidence at time of measurement; EV-1 independent process evidence outranks interested-party evidence; MSR-09 joint measurement for concealed work |
| **Detective controls** | Part 11 § 11.7 integrity checks; MR-3, MR-4 independent-record reconciliation |
| **Corrective controls** | Void the measurement; re-measure or reconstruct from independent records; recover |
| **Severity** | **Critical** |
| **Business impact** | The evidence layer that underpins CP-7 drillability becomes unreliable |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Site Engineer; Check Measurement Officer |
| **Escalation path** | Internal Audit → CEO/MD |
| **Recovery strategy** | Recovery from the contractor where complicit; action against the officer |
| **Residual risk** | **Medium.** Independent-process evidence (batching, weighbridge, survey) is the only class that resists fabrication (EV-1) |

### RSK-59 — Timestamp and location manipulation
| | |
|---|---|
| **Category / form** | Fraud · **[G]** · enabling **L1** |
| **Description** | Capture time or location falsified so that attendance or measurement appears to have occurred where and when it did not |
| **Root cause** | Time and location supplied by the capturing party's own device or asserted by entry |
| **Typical scenario** | Attendance captured from a location 40 km from the site, with the device time set back to the work date |
| **Early warning indicators** | Captures outside site geofence; device times inconsistent with server times; captures clustered from one device across dispersed fronts |
| **Detection mechanism** | Independent time reference; geofence validation; device-consistency analysis (Part 11 § 11.7) |
| **Preventive controls** | ATT-10 method recorded; ATT-11 no future dating; capture bound to an independent time source; MSR-04 |
| **Detective controls** | Part 11 § 11.7; ATT-19; MSR-17 |
| **Corrective controls** | Reclassify the affected evidence as lower confidence; re-verify; attribute |
| **Severity** | **High** |
| **Business impact** | Undermines the evidential weight of the enterprise's strongest capture methods |
| **Financial impact** | Enables RSK-01, RSK-09, RSK-11 |
| **Responsible actor** | Site Supervisor; Internal Audit for detection |
| **Escalation path** | Internal Audit |
| **Recovery strategy** | Re-verification; recovery where value followed |
| **Residual risk** | **Medium** |

### RSK-60 — Supersession abuse
| | |
|---|---|
| **Category / form** | Governance · **[G]** |
| **Description** | The supersession mechanism used to replace records repeatedly until the desired figure is reached, with the trail technically intact but practically unreadable |
| **Root cause** | Supersession permitted without reason, attribution, or frequency monitoring |
| **Typical scenario** | A measurement superseded eleven times over three weeks, ending at a quantity 30% above the original, each revision individually documented |
| **Early warning indicators** | High revision rates by measurer (RV-4); repeated supersession of the same entry; supersession clustered before bills |
| **Detection mechanism** | RV-4 revision-rate monitoring; supersession-chain analysis |
| **Preventive controls** | MSR-12 reason required; MSR-07 checker cannot increase; MBK-03 legible originals |
| **Detective controls** | RV-4; AF-9; AUD-03 |
| **Corrective controls** | Investigate the chain; re-measure independently |
| **Severity** | **Medium** |
| **Business impact** | Immutability is preserved in form and defeated in substance |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Check Measurement Officer; Internal Audit |
| **Escalation path** | Internal Audit |
| **Recovery strategy** | Cumulative correction |
| **Residual risk** | **Medium** |

### RSK-61 — Evidence loss
| | |
|---|---|
| **Category / form** | Governance · **[G]** |
| **Description** | Evidence unavailable when required — destroyed, illegible, uncustodied, or left with a demobilised team |
| **Root cause** | Retention assumed from policy; custody transferred informally at project close; digital evidence dependent on a single system or person |
| **Typical scenario** | An arbitration four years after closure requires the MBs for a disputed element. Two books cannot be located and the site office was cleared in 2023 |
| **Early warning indicators** | Retention never verified (AUD-12); custody records incomplete; project closures without formal handover |
| **Detection mechanism** | AUD-12 retention verification; custody audit; periodic retrieval testing |
| **Preventive controls** | MBK-11; LAB-14; CLS-14 sealed and reconstructible; SEC-11 protection against destruction including by the creator; LI-33 archival ≠ deletion |
| **Detective controls** | AUD-12; retrieval testing |
| **Corrective controls** | Reconstruct from secondary evidence; accept the weakened position honestly |
| **Severity** | **High** |
| **Business impact** | The enterprise loses disputes it would have won, and cannot demonstrate compliance it achieved |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Project Manager at closure; Internal Audit |
| **Escalation path** | Finance Controller → Legal |
| **Recovery strategy** | None — evidence cannot be recreated after the fact (MP-6) |
| **Residual risk** | **Medium** |

### RSK-62 — Plant and equipment hire recovery failure
| | |
|---|---|
| **Category / form** | Material leakage · **L5** |
| **Description** | Enterprise plant, equipment, and shuttering used by contractors without hire recovery |
| **Root cause** | Hire records maintained operationally rather than financially; no automatic obligation at issue (I-6) |
| **Typical scenario** | A crane shared between the enterprise's own works and two contractors for eight months. Hire hours are logged for maintenance purposes and never converted into recovery |
| **Early warning indicators** | Hire logs without corresponding recoveries; utilisation exceeding enterprise-only work; contractors with no hire recovery on plant-intensive scopes |
| **Detection mechanism** | RI-4; hire log to recovery reconciliation |
| **Preventive controls** | CTL-09; REC-01 automatic obligation; REC-02 valuation at issue; E-5 recovery basis bound at engagement |
| **Detective controls** | RI-4; FC-4 |
| **Corrective controls** | Recover at waterfall priority 5; crystallise at demobilisation |
| **Severity** | **High** |
| **Business impact** | Classic L5: value transferred with no entitlement, invisible because nothing failed |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Plant officer to raise; Accountant to recover |
| **Escalation path** | Project Manager → Finance Controller |
| **Recovery strategy** | Deduct from running bills and final account |
| **Residual risk** | **Medium** |

---

### RSK-63 — Fuel and utility leakage
| | |
|---|---|
| **Category / form** | Material leakage · **L5** |
| **Description** | Diesel, power, and water issued to contractors or consumed by unauthorised plant, never recovered |
| **Root cause** | Issue recorded in a site register with no valuation; consumption unmeasured; no theoretical-consumption benchmark |
| **Typical scenario** | Site tank issues recorded by the operator; no meter on the generator; consumption 30% above the plant's rated draw and no one holds the comparison |
| **Early warning indicators** | Consumption above theoretical for deployed plant hours; issue registers not reconciled; issues rising without corresponding output |
| **Detection mechanism** | MR-2-style theoretical vs actual consumption; RI-4 |
| **Preventive controls** | CTL-09; REC-01; metering where practicable; E-5 |
| **Detective controls** | RI-4; consumption benchmarking |
| **Corrective controls** | Recover at waterfall priority 5; tighten issue control |
| **Severity** | **Medium** |
| **Business impact** | Continuous small loss, rarely investigated because the sums per transaction are trivial (LA-3) |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Store/plant officer; Accountant |
| **Escalation path** | Project Manager → Finance Controller |
| **Recovery strategy** | Deduct from bills |
| **Residual risk** | **Medium–High** — physically difficult to control on open sites |

### RSK-64 — Material loss disguised as wastage
| | |
|---|---|
| **Category / form** | Material leakage · **L5/L7** |
| **Description** | Material removed from site and accounted for as wastage, breakage, or consumption |
| **Root cause** | Wastage norms undefined or generous; theoretical consumption never reconciled to measured output |
| **Typical scenario** | Cement consumption 14% above theoretical for the measured concrete, absorbed under a "wastage" allowance that no instrument defines |
| **Early warning indicators** | Consumption-to-output ratios above norm; wastage at or near the permitted maximum consistently; norms not defined in the instrument |
| **Detection mechanism** | MR-2 theoretical vs actual; MR-3, MR-4 |
| **Preventive controls** | MM-2 wastage rules explicit in the method; E-7; REC-01 issued value recovery; MR-9 variance blocks the bill |
| **Detective controls** | MR-2…MR-5; MR-9 |
| **Corrective controls** | Recover the excess; investigate; revise norms with evidence |
| **Severity** | **High** |
| **Business impact** | Simultaneously a material loss and an over-measurement signal — the two reinforce each other |
| **Financial impact** | **Compounding** |
| **Responsible actor** | Store officer; Site Engineer; Accountant |
| **Escalation path** | Project Manager → Internal Audit |
| **Recovery strategy** | Recovery at waterfall priority 4 |
| **Residual risk** | **Medium** |

### RSK-65 — Productivity data corruption
| | |
|---|---|
| **Category / form** | Productivity leakage · **[G]** |
| **Description** | Productivity figures rendered meaningless by mismatched effort and output attribution |
| **Root cause** | Effort attributed to generic activities; output measured against different codes; planned rather than validated effort used |
| **Typical scenario** | 60% of labour booked to "general site works". Productivity is computed, reported, and relied upon for estimating, and it measures nothing |
| **Early warning indicators** | High proportion of general-activity attribution; productivity figures with implausible stability; norms revised to eliminate variance |
| **Detection mechanism** | Attribution-proportion reporting; PRD-03 coverage; PRD-06 norm-change audit |
| **Preventive controls** | ASG-03; CLB-06; BRL-14; PRD-02 common activity coding; PRD-04 validated effort |
| **Detective controls** | PRD-03; PRD-06 |
| **Corrective controls** | Restore attribution discipline; restate norms from evidence |
| **Severity** | **Medium** |
| **Business impact** | Loss of the only control that compares two independently created records (MR-6), and corruption of the estimating base for future tenders |
| **Financial impact** | **Opportunity** — future mispricing |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Not applicable |
| **Residual risk** | **Medium** |

### RSK-66 — Concealed work billed without prior joint measurement
| | |
|---|---|
| **Category / form** | Measurement risk · **L1/L3** |
| **Description** | Work that has become unverifiable billed on the strength of records made after concealment |
| **Root cause** | Joint measurement not performed before backfilling, casting, or covering; programme pressure to proceed |
| **Typical scenario** | Foundation excavation backfilled over a weekend. The quantity is agreed afterwards from the contractor's dimensions, and no level records exist |
| **Early warning indicators** | Measurement dates after concealment dates; absent level or pour records; contractor-supplied dimensions for concealed elements |
| **Detection mechanism** | AF-3; date sequence analysis; MR-5 level records |
| **Preventive controls** | MSR-09; JM-2 mandatory joint measurement; CK-2 100% check before concealment; MI-11 |
| **Detective controls** | AF-3; MR-1; MR-5 |
| **Corrective controls** | Destructive verification where justified; otherwise the enterprise's contemporaneous record governs (MD-2) — and where none exists, the loss is accepted and recorded |
| **Severity** | **Critical** |
| **Business impact** | Permanently unverifiable value; the enterprise's position in any dispute is the contractor's own record |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Site Engineer; Project Manager |
| **Escalation path** | Check Officer → Project Manager → Internal Audit |
| **Recovery strategy** | Extremely limited once concealed — the control is wholly preventive (GP-22) |
| **Residual risk** | **High** where programme pressure is severe |

### RSK-67 — Contractor insolvency or abandonment
| | |
|---|---|
| **Category / form** | Commercial · **L5** · **[C]** |
| **Description** | The counterparty ceases work with the enterprise's value unrecovered and the work incomplete |
| **Root cause** | Thin capitalisation is structural in construction (§ 1.4.5); exposure allowed to accumulate; early indicators not acted upon |
| **Typical scenario** | Delayed wage payments, then material supplier complaints, then requests for out-of-turn advances, then abandonment — with ₹1.4 crore of advances, issued materials, and hire outstanding |
| **Early warning indicators** | Wage evidence failures (CTL-05); repeated advance requests; supplier complaints; labour strength falling; recovery deferral requests; plant removal from site |
| **Detection mechanism** | Exposure monitoring (FM-34); early-indicator dashboard; CTL-05 gate failures |
| **Preventive controls** | ADV-04 live security; CTL-10 exposure at award; RET-05 retention preserved; ADV-08 crystallisation on suspension; ADV-09 |
| **Detective controls** | ADV-14 ageing; ADV-10; RSK-32 indicators |
| **Corrective controls** | Suspend; crystallise; enforce security; take over the work; recover from retention |
| **Severity** | **Critical** |
| **Business impact** | Simultaneous financial loss, programme disruption, and workforce liability (RSK-33, BRL-13) |
| **Financial impact** | **Episodic-large** |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller → CEO/MD → Legal |
| **Recovery strategy** | Security, retention, set-off within the instrument, statutory claim |
| **Residual risk** | **High.** Insolvency cannot be prevented by the enterprise; only the exposure at the moment it occurs is controllable, which is exactly what LA-7 and Block C exist to limit |

### RSK-68 — Front-loaded certification
| | |
|---|---|
| **Category / form** | Financial · **L4** · **[C]** |
| **Description** | Early certification running ahead of physical execution, financing the contractor from the enterprise's balance sheet |
| **Root cause** | Part rates without bound stages; materials-on-site payments without control; generous early-stage valuations |
| **Typical scenario** | 45% certified at 25% physical completion through part rates set at bill time and materials-on-site allowances with no verification of title or location |
| **Early warning indicators** | Certified value ahead of the measured-progress curve (MR-7); part-rate proportion high; materials-on-site claims rising |
| **Detection mechanism** | MR-7 ceiling utilisation vs progress; PT-1 part-rate proportion analysis |
| **Preventive controls** | PT-2 stages bound at engagement; MSR-15 stage recorded; ADV-05 verified materials for material advances; EVL-01 |
| **Detective controls** | MR-7; PRD-05 |
| **Corrective controls** | Cumulative self-correction; suspend part-rate certification |
| **Severity** | **High** |
| **Business impact** | The enterprise becomes the contractor's financier without a lending decision, and its exposure on default is far above the work in place |
| **Financial impact** | **Episodic-large** · **[C]** cash-flow |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller → CFO |
| **Recovery strategy** | Cumulative correction at subsequent bills |
| **Residual risk** | **Medium** |

### RSK-69 — Unbalanced rates at award
| | |
|---|---|
| **Category / form** | Valuation · **L4/L7** |
| **Description** | A tender priced with early-executed items loaded high and late items low, so that early certification exceeds value delivered |
| **Root cause** | Award decided on total only; rate reasonableness not tested item by item; this precedes WFC (D-2) but is discharged through it |
| **Typical scenario** | Excavation and foundations priced 40% above market, finishes 30% below. The contractor is cash-positive by month four and indifferent to completion |
| **Early warning indicators** | Item rates deviating sharply from internal estimates; early-item concentration of value; certified value ahead of progress from the first bill |
| **Detection mechanism** | Rate-reasonableness comparison at award; MR-7 from the first bill |
| **Preventive controls** | Not preventable within WFC (II-1 — rates are consumed, not created). **WFC's obligation is to detect and report it**, and to hold the ceiling and recovery discipline that limit its consequence |
| **Detective controls** | MR-7; EVL-09 progress vs value; front-loading indicators (RSK-68) |
| **Corrective controls** | Report to CAP-SCM (integration O-4); tighten retention and recovery; resist part-rate generosity |
| **Severity** | **Medium** |
| **Business impact** | The enterprise's exposure exceeds work in place for most of the contract's life |
| **Financial impact** | **[C]** cash-flow, converting to loss on default |
| **Responsible actor** | CAP-SCM at award; Finance Controller for consequence management |
| **Escalation path** | Finance Controller → CEO/MD |
| **Recovery strategy** | Contractual only |
| **Residual risk** | **Medium** — outside WFC's authority to prevent (§ 3.4.3) |

### RSK-70 — Dispute ageing into loss
| | |
|---|---|
| **Category / form** | Contractual · **L6** |
| **Description** | Disputes left open until evidence, memory, and leverage have degraded, then settled unfavourably |
| **Root cause** | No dispute clock; disputes owned by whoever is least busy; MD-4 not enforced |
| **Typical scenario** | Fourteen measurement disputes open for two years. At final account they are settled in bulk at 70% of the contractor's claim because no one can now re-measure or recall |
| **Early warning indicators** | Ageing disputes without escalation; disputes with no named owner; disputed value rising as a proportion of certified value |
| **Detection mechanism** | Dispute ageing report; MD-4 escalation clock |
| **Preventive controls** | MD-1 undisputed value proceeds; MD-2 joint re-measurement while measurable; MD-4 defined clock; REC-11 disputed recoveries not dropped |
| **Detective controls** | Ageing reporting; GP-20 |
| **Corrective controls** | Force resolution; escalate to arbitration where contractual |
| **Severity** | **High** |
| **Business impact** | Converts into precisely the bulk negotiation LI-26 prohibits (RSK-45) |
| **Financial impact** | **Opportunity** and **Episodic-large** |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller → Legal |
| **Recovery strategy** | Resolution while the work remains measurable |
| **Residual risk** | **Medium** |

### RSK-71 — Institutional knowledge loss
| | |
|---|---|
| **Category / form** | Governance · **[G]** |
| **Description** | Financial control degrading when individuals leave, because critical facts lived in their heads |
| **Root cause** | Objective O-9 unmet — arrangements, rates, understandings, and site history held personally rather than recorded |
| **Typical scenario** | The engineer who "knows the site" resigns. Three contractors immediately raise claims that cannot be evaluated, and two rate understandings cannot be evidenced |
| **Early warning indicators** | Records requiring their author to interpret them; single points of knowledge; undocumented arrangements referenced in correspondence |
| **Detection mechanism** | Reconstructibility testing (AUD-12); RBL-16 drillability without explanation |
| **Preventive controls** | RBL-16; CP-7; MBK-05 complete entries; CTL-14 instructions recorded; ASG-10 retention; LAB-14 |
| **Detective controls** | AUD-12; audit sampling for interpretability |
| **Corrective controls** | Reconstruct from records; accept and record the weakened position |
| **Severity** | **Medium** |
| **Business impact** | Objective O-9 fails; the enterprise's position depends on individuals' availability years later |
| **Financial impact** | **Opportunity** |
| **Responsible actor** | Project Manager; Finance Controller |
| **Escalation path** | Finance Controller |
| **Recovery strategy** | Not applicable |
| **Residual risk** | **Medium** |

### RSK-72 — Governance decay
| | |
|---|---|
| **Category / form** | Governance · **[G]** · all forms |
| **Description** | Rules remaining nominally in force while ceasing to operate — exceptions normalised, checks reduced, reports unread |
| **Root cause** | LA-4 and LA-5 acting together: controls requiring vigilance decay, and any bypass used more than twice becomes the process |
| **Typical scenario** | Check percentages quietly reduced during a busy quarter; exceptions rise; the exception report circulates to no one who acts; two years later the check regime exists only on paper |
| **Early warning indicators** | Exception counts rising with no rule change; check percentages below policy; control-health reports unacknowledged; standing exceptions never reviewed |
| **Detection mechanism** | EXC-07 frequency escalation; AUD-08 control health; CK-6 check-extent records; EXC-10 review |
| **Preventive controls** | LI-30, LI-31 counting and escalation; OVR-08; SEC-12; FIN-16; EXC-05 no renewal by inaction |
| **Detective controls** | AUD-08; EXC-08; ARB review (§ 11.12) |
| **Corrective controls** | Reinstate; review the rule that is being bypassed; amend formally or enforce |
| **Severity** | **Critical** — it is the mechanism by which every other control in this document fails |
| **Business impact** | The enterprise believes it is controlled and is not, which is a worse position than knowing it is uncontrolled |
| **Financial impact** | Enables all forms |
| **Responsible actor** | Finance Controller; Internal Audit; CEO/MD |
| **Escalation path** | Internal Audit → CEO/MD → Board |
| **Recovery strategy** | Not applicable — governance is restored, not recovered |
| **Residual risk** | **Medium**, and permanent. **This is the risk that never closes** |

---

## 10.5 Category index

| Category | Risks |
|---|---|
| **Financial leakage** | RSK-20, 22, 23, 24, 28, 39, 68 |
| **Operational leakage** | RSK-06, 08, 25, 65 |
| **Material leakage** | RSK-21, 62, 63, 64 |
| **Labour leakage** | RSK-01…05, 07, 09, 10, 27, 31, 34, 35, 36 |
| **Productivity leakage** | RSK-65, and detection roles in RSK-01, 15 |
| **Measurement risk** | RSK-11, 12, 13, 15, 16, 17, 18, 57, 58, 60, 66 |
| **Fraud scenarios** | RSK-46, 52, 53, 54, 55, 56, 58, 59 |
| **Contractor manipulation** | RSK-04, 05, 12, 15, 41, 44, 45, 69 |
| **Internal collusion** | RSK-53, 54, 55, 56 |
| **Approval abuse** | RSK-38, 39, 40, 42, 43, 47 |
| **Recovery failure** | RSK-20, 21, 22, 24, 28, 62, 63 |
| **Retention failure** | RSK-29 |
| **Documentation failure** | RSK-51, 58, 59, 60, 61, 71 |
| **Governance failure** | RSK-07, 24, 47, 50, 51, 72 |
| **Contractual risk** | RSK-19, 26, 41, 44, 45, 70 |
| **Cash-flow risk** | RSK-67, 68, 69 |
| **Statutory risk** | RSK-03, 05, 30, 32, 33, 37, 49 |

## 10.6 Severity and residual summary

| Severity | Count | Risks |
|---|---|---|
| **Critical** | **25** | RSK-01, 02, 05, 11, 15, 19, 20, 21, 22, 30, 32, 38, 39, 45, 46, 47, 50, 51, 53, 54, 55, 58, 66, 67, 72 |
| **High** | **34** | RSK-03, 04, 07, 09, 10, 12, 13, 14, 16, 17, 18, 23, 24, 26, 28, 29, 33, 34, 37, 40, 41, 42, 43, 44, 48, 49, 52, 56, 59, 61, 62, 64, 68, 70 |
| **Medium** | **13** | RSK-06, 08, 25, 27, 31, 35, 36, 57, 60, 63, 65, 69, 71 |
| **Total register** | **72** | |

> **On the shape of this distribution.** Thirty-five percent of the register is Critical, and that
> is not severity inflation. It follows from what the capability governs: **a control that fails on a
> money path fails toward disbursement**, and disbursement is irreversible in a way that most
> enterprise risks are not (LA-7). A risk register for this subject that were mostly Medium would be
> describing a different enterprise.

### The honest residual position

| Residual | Count | Risks | Why it cannot be eliminated |
|---|---|---|---|
| **High** | 9 | RSK-05, 20, 21, 26, 34, 41, 45, 66, 67 | Each depends on a condition the enterprise does not fully control: an unbanked workforce, a future payment existing to deduct from, relationship pressure at closure, verbal instruction at site, programme pressure before concealment, or a counterparty's solvency |
| **Medium–High** | 2 | RSK-54, 63 | Single-officer remote sites (§ 4.14.1) and physically open fuel and utility control |
| **Medium** | 50 | — | Controls are structural, but effectiveness depends on detection frequency, rotation, and statistical analysis **actually being performed** (RSK-72 is the risk that they are not) |
| **Low** | 11 | RSK-06, 11, 14, 18, 19, 24, 28, 38, 39, 47, 50 — **only where the control is structural** | Each is Low *only* where the control is enforced by construction. Where the same control is procedural, ten of these eleven return to **Critical** |

> **The central finding of Part 10.** Ten risks in this register move between **Low and Critical**
> depending on a single question: *is the control structural or procedural?* That is the whole of
> DP-1 expressed as evidence. **An enterprise that implements this document as policy rather than as
> structure has not reduced its risk; it has reduced its visibility of the risk.**

## 10.7 Risk governance

**RG-1 — Every risk has a named owner** (RP-2), and ownership sits with the actor who can act, not
with the actor who reports.

**RG-2 — Escalation is by severity and by frequency**, independently. A Medium risk occurring
weekly escalates faster than a Critical risk occurring once, because frequency is evidence of a
systemic control failure (LA-5).

**RG-3 — Detection outputs route to Internal Audit** (AF-11, AUD-07), never solely to the actor
whose work they monitor.

**RG-4 — The register is reviewed on a defined cycle** and after every confirmed leakage event
(AUD-10). A confirmed event that produces no register change means the root cause was not found.

**RG-5 — Residual risk is re-stated at each review, honestly.** A residual that has fallen to zero
has been mis-assessed (RP-4).

**RG-6 — New risks are added by observation, not only by review.** Every exception, dispute, and
audit finding is a candidate.

## 10.8 The adversarial review record

The eight adversarial questions of RP-5, answered against this document as it stands. **Where the
answer was "yes", the rule that was strengthened is named.** Where the answer remains "yes", it is
recorded as an open weakness rather than resolved by assertion.

| # | Question | Answer | Constitutional response |
|---|---|---|---|
| 1 | **Can this be manipulated?** | Yes — attendance, measurement, classification, rounding, and timing all admit manipulation by a single competent actor | ATT-02/08, MSR-06/07, AF-4/6/8, MM-5, ATT-11, MSR-04 |
| 2 | **Can two people collude?** | **Yes, and this remains the register's largest unclosed exposure** (RSK-53, 54, 55) | SOD matrix; rotation (RSK-53/54 controls); § 4.14.1 externality; AF-7 pairing analysis. **Residual remains Medium–High on small and remote sites** |
| 3 | **Can money leave without evidence?** | No, where G-1…G-8 and PEL-01…PEL-04 are structural. **Yes, where they are procedural** | RBL-02, PEL-01, PEL-04, FIN-06, MSR-01. This is the Low/Critical hinge of § 10.6 |
| 4 | **Can evidence be fabricated?** | Yes for interested-party evidence; substantially harder for independent-process evidence | EV-1 hierarchy; MSR-09/JM-2 for concealed work; MR-2…MR-5 independent reconciliation; Part 11 § 11.7 |
| 5 | **Can measurement be inflated?** | Yes, within the tolerance of the check regime | CK-1…CK-7, MSR-07 asymmetry, CK-5 sample-to-population escalation, MR-1…MR-8, AF-4 |
| 6 | **Can labour be counted twice?** | **No, where LI-16 is enforced enterprise-wide at validation.** Yes, wherever identity is scoped per project or per contractor | WRK-02, LI-16, ATT-06, BRL-05, BRL-10, RI-7, RI-11 |
| 7 | **Can recoveries be bypassed?** | Yes, by silent omission and by rolling deferral | REC-01 automatic creation, RBL-07/G-3 hard gate, REC-10 bounded deferral, LI-12, RI-3/RI-4, REC-16 severity parity |
| 8 | **Can approvals be abused?** | Yes, by splitting, by override, by post-approval drift, and by approving above the computation | PEL-06 computed maximum, PEL-09/RBL-12 cumulative testing, OVR-10, PEL-07, FIN-05, LI-23 |

> **Two answers in this table are still "yes" after every control in this document has been
> applied: question 2 (collusion) and question 4 (fabricated interested-party evidence).** They are
> recorded here rather than argued away, because SC-17's thought experiment is honest only if the
> enterprise states where it does not hold. Both are addressed in Part 11 — the first through
> independence and rotation of the audit function, the second through the evidence hierarchy and
> confidence model that refuses to treat all evidence as equal.

---

# PART 11 — EVIDENCE, AUDIT & INVESTIGATION MODEL

## 11.1 Evidence philosophy

> **Evidence is not documentation. Documentation describes what someone says happened. Evidence
> constrains what can be said to have happened.**

In this capability, evidence is a **first-class enterprise object** with its own creation rules, its
own hierarchy, its own confidence model, its own custody, and its own lifecycle. It is not a
by-product of operations to be filed; it is the substance on which every rupee rests.

### 11.1.1 The five evidential axioms

**EA-1 — Evidence precedes the claim it supports.** Evidence created *after* a claim, to justify it,
is not evidence (CP-1). The temporal order is itself the control, and it is the only property of
evidence that cannot be improved after the fact.

**EA-2 — Evidence is created by the observer, at the point and moment of observation.** Evidence
assembled later in an office is **testimony** (DP-5, MP-2). Testimony is admissible; it is simply
worth less, and the record must say which it is.

**EA-3 — Evidence created by a party who benefits from its content is a claim.** Regardless of that
party's reputation, longevity, or good faith (GP-13, § 4.3). A claim becomes evidence only by an
independent act performed by someone who does not benefit.

**EA-4 — Evidence from an independent process outranks evidence from an interested person.** A
batching plant record, a weighbridge slip, a survey instrument, a laboratory certificate — these
were created for another purpose by a mechanism with no stake in the payment (EV-1). This is the
single most useful principle in construction audit.

**EA-5 — Absence of evidence is not neutral.** A record that should have carried an artefact and does
not is a **deficient** record, not an ordinary one (EV-3, DP-9). The enterprise must be able to
distinguish "checked and nothing found" from "not checked", and silence must never resolve to the
first.

### 11.1.2 What makes evidence trustworthy

Six properties, each independently testable. Evidence is not trustworthy or untrustworthy as a
whole; it is trustworthy **to the extent that it holds these properties**, and the confidence model
(§ 11.4) is built from them.

| # | Property | Question it answers | Failure mode |
|---|---|---|---|
| **TE-1** | **Contemporaneity** | Was it created when the fact occurred? | Reconstruction; backdating (RSK-09, RSK-59) |
| **TE-2** | **Proximity** | Was it created where the fact occurred, by someone who observed it? | Office-created records; hearsay chains |
| **TE-3** | **Independence** | Was its creator free of benefit from its content? | Interested-party evidence (RSK-04, RSK-58) |
| **TE-4** | **Integrity** | Is it unaltered since creation, and can that be demonstrated? | Silent modification (RSK-51); supersession abuse (RSK-60) |
| **TE-5** | **Attribution** | Does it name the human being who created it? | Role- or system-attributed records |
| **TE-6** | **Sufficiency** | Does it establish the specific fact it is offered to prove? | A photograph proving existence offered as proof of quantity |

> **TE-6 is the property most often assumed and least often tested.** A geotagged photograph is
> excellent evidence that something exists at a place on a date. It is very weak evidence of
> **how much** of it exists. Evidence must be matched to the proposition, not to the file.

### 11.1.3 The evidential burden

**EB-1 — The burden of evidence rests on the party seeking value.** A contractor claiming, a mate
reporting, a worker disputing an attendance — each bears the burden of supporting their own claim.

**EB-2 — The enterprise bears the burden of its own deductions.** Every recovery, damage assessment,
LD levy, and quality rejection is an enterprise claim and carries the same burden (REC-06, REC-07,
CP-10). **The enterprise does not get to be the only party that need not prove things.**

**EB-3 — Where the enterprise's own control failed, the enterprise bears the consequence.** A worker
whose attendance the enterprise failed to capture properly is not to be left unpaid for the
enterprise's failure (§ 4.1, PA-8). CP-8 conservatism protects the enterprise against uncertainty;
it does not license it to resolve its own failures in its own favour.

## 11.2 Evidence classes

Evidence in this capability falls into seven classes, distinguished by **what kind of fact each can
establish**. The classes are not ranked here — ranking is the hierarchy in § 11.3, which depends on
the proposition being proved.

| Class | Establishes | Typical instruments |
|---|---|---|
| **EC-1 Contractual** | Authority: who may be paid, for what, at what rate, up to what limit | Engagement instrument, rate schedule, variation, delegation register, security instrument |
| **EC-2 Engineering** | Physical reality: what was built, to what dimension, to what standard | Measurement Book entries, level records, dimension sheets, drawings, as-built records, pour cards, test certificates |
| **EC-3 Operational** | Activity: who was present, who was directed, what occurred on site | Musters, deployment records, work assignments, site instructions, hindrance records, gate and induction records |
| **EC-4 Financial** | Value and its movement: what was computed, deducted, approved, and paid | Bills, settlement sheets, wage cards, vouchers, issue notes, hire records, contractor accounts, disbursement confirmations |
| **EC-5 Digital** | Metadata about any of the above: when, where, by whom, unaltered since | Timestamps, geolocation, device identity, version history, integrity signatures, access logs |
| **EC-6 Physical** | The work itself and the artefacts of its execution | The structure, samples, retained cubes, weighbridge slips, materials at site |
| **EC-7 Human testimony** | Recollection, explanation, and context | Statements, interviews, explanations of records, expert opinion |

**EC-A — Class does not equal weight.** A contractual instrument (EC-1) is conclusive as to authority
and worthless as to quantity. A photograph (EC-5/EC-6) is strong as to existence and weak as to
measurement. **Every evidential question must state what it is trying to prove before asking what
proves it.**

**EC-B — Human testimony (EC-7) is the class of last resort and the first to be offered.** It is
admissible, it is often the only thing available years later, and it is systematically the weakest:
memory degrades, incentive persists, and the people with the clearest recollection are usually the
people with the strongest interest.

## 11.3 The evidence hierarchy

For any given proposition, evidence ranks by the properties in § 11.1.2. The hierarchy below is
normative: **where two pieces of evidence conflict, the higher-ranked governs**, and the lower is
not discarded but recorded as conflicting (LAW-11).

| Rank | Tier | Definition | Examples |
|---|---|---|---|
| **H-1** | **Independent instrumented record** | Created by a process or instrument with no interest in the outcome, at the moment of the fact | Batching plant record; weighbridge slip; survey/level record; laboratory test certificate; biometric capture with independent time source |
| **H-2** | **Contemporaneous enterprise record, independently verified** | Created by an enterprise officer at the point of occurrence and independently checked by another | Check-measured MB entry; validated attendance where validator ≠ reporter; jointly measured quantity |
| **H-3** | **Contemporaneous enterprise record, unverified** | Created by an enterprise officer at the point of occurrence, not yet independently checked | Recorded (unchecked) MB entry; captured (unvalidated) attendance; site instruction |
| **H-4** | **Contractual instrument** | Establishes authority and terms, conclusively, and nothing else | Engagement instrument; rate schedule version; sanctioned variation; delegation |
| **H-5** | **Derived or computed record** | Correct if its inputs are correct; carries the confidence of its weakest input | Bills, settlement sheets, wage cards, theoretical consumption, productivity |
| **H-6** | **Interested-party record (a claim)** | Created by a party who benefits from its content | Contractor's bill or measurement; mate's attendance report; supplier's invoice |
| **H-7** | **Reconstructed record** | Created after the fact, from memory or secondary sources, by any party | Retrospective musters; assignments generated at period end; evidence attached in bulk later |
| **H-8** | **Testimony** | Recollection offered in explanation | Statements, interviews |

### 11.3.1 Hierarchy rules

**HR-1 — A claim (H-6) never becomes evidence by being countersigned.** It becomes evidence only when
an independent act creates a record at H-3 or above (MSR-05, ATT-03).

**HR-2 — A derived record (H-5) cannot be stronger than its weakest input.** A bill computed
flawlessly from an unverified measurement carries the confidence of that measurement, not of the
arithmetic. **This is the property most often forgotten**, because the arithmetic is visibly rigorous
and the input is not visible at all.

**HR-3 — H-1 evidence resolves conflicts against all lower tiers**, and its absence where it should
exist is itself a finding (EA-5). If concrete was placed and no batching record exists, the question
is not "what other evidence is there" but "why does this record not exist".

**HR-4 — Reconstructed records (H-7) must be labelled as reconstructed**, permanently and visibly.
They may support payment where nothing better exists and the enterprise's own failure caused the
gap (EB-3), but they may never be presented as contemporaneous.

**HR-5 — Testimony (H-8) cannot establish quantity, presence, or value on its own.** It may explain,
contextualise, or direct an investigation to better evidence. It may not be the basis of a payment.

**HR-6 — Evidence tier is recorded, not inferred.** Every evidentiary record carries its tier and the
capture method that determines it (ATT-10, ME-11). An implementation that cannot state the tier of a
given record cannot operate the confidence model.

## 11.4 Evidence confidence levels

Tier (§ 11.3) is a property of *how evidence was made*. **Confidence is a property of a specific
proposition supported by a specific evidence set.** The same MB entry may support a high-confidence
statement about location and a low-confidence statement about volume.

| Level | Definition | Requirements | Permitted use |
|---|---|---|---|
| **High** | The proposition is established by H-1 or H-2 evidence, corroborated by at least one independent record, with integrity demonstrable | Contemporaneous · independent · verified · reconcilable | **Any** — including final account, dispute defence, and statutory proof |
| **Medium** | Established by H-3 or H-4 evidence, uncorroborated but with integrity and attribution intact | Contemporaneous · attributed · unaltered | Running payment; **not** sufficient alone for final account or concealed work |
| **Low** | Established by H-5, H-6, or H-7 evidence, or by H-3 with an integrity or attribution gap | Traceable but weak on at least two of TE-1…TE-6 | Interim treatment only, with a recorded plan to strengthen; **never** for concealed work, final accounts, or disputes |
| **Unsupported** | The proposition rests on H-8 alone, or on evidence whose integrity cannot be demonstrated | — | **No payment.** May direct investigation only |

**CL-1 — Confidence is recorded against the proposition, not filed against the document.**

**CL-2 — Payment requires at least Medium**, and **High** where the work is or will become concealed
(GP-22, JM-2), where the value is at final account (CLS-01), or where a dispute is live.

**CL-3 — Confidence degrades with time for reconstructible propositions and is fixed for
contemporaneous ones.** A proposition supported by H-1 evidence is as strong in year seven as on the
day. A proposition supported by testimony weakens continuously, which is why MD-4 and RSK-70 treat
dispute ageing as a loss mechanism.

**CL-4 — Confidence MUST NOT be raised by repetition.** Three copies of the same claim, three
restatements by the same actor, or the same photograph attached to three entries do not corroborate:
corroboration requires an **independent source**, not an additional instance.

**CL-5 — A downgrade is a finding.** Where evidence is discovered to be weaker than recorded — a
capture method misstated, an integrity gap found, a record shown to be reconstructed — the affected
payments are reviewed, not merely re-labelled.

## 11.5 Evidence traceability

> **CP-7: every presented figure must decompose to its constituents, recursively, to primary
> evidence, without human explanation.** § 11.5 states what that decomposition must contain.

### 11.5.1 The contract-path evidence chain

Every rupee on a running bill decomposes through this chain. **A gap at any link makes the rupee
unsupported, regardless of the strength of the other links.**

```
  DISBURSEMENT  ── confirmation from CAP-TRE (H-1)                            [EC-4]
        ↑
  VOUCHER  ── approved amount, payee, basis; approver identity and limit      [EC-4/EC-1]
        ↑
  APPROVAL  ── named approver, delegated limit valid at that date             [EC-1]
        ↑
  NET COMPUTATION  ── FM-19, every term traceable                             [EC-4]
        ↑
  ├── CERTIFIED VALUE ── FM-06 cumulative                                     [EC-4]
  │        ↑
  │   ITEM VALUE ── FM-01: quantity × rate                                    [EC-4]
  │        ↑                    ↑
  │   VERIFIED QUANTITY    RATE VERSION in force at work date (H-4)           [EC-2/EC-1]
  │        ↑
  │   CHECK MEASUREMENT ── checker identity, extent, result (H-2)             [EC-2]
  │        ↑
  │   MB ENTRY ── item, location, dimensions, computation, dates (H-3)        [EC-2]
  │        ↑
  │   ├── EVIDENCE ARTEFACTS ── levels, pour cards, weighbridge (H-1)         [EC-2/EC-6]
  │   └── QUALITY ACCEPTANCE ── CAP-QLT record (H-1/H-2)                      [EC-2]
  │        ↑
  │   PHYSICAL EXECUTION ── the work itself                                   [EC-6]
  │        ↑
  │   WORK ASSIGNMENT / SITE INSTRUCTION (H-3)                                [EC-3]
  │        ↑
  │   ENGAGEMENT INSTRUMENT ── scope, rates, ceiling (H-4)                    [EC-1]
  │
  ├── RECOVERIES ── each to its issue note, hire record, or assessment (H-1/H-3)  [EC-4]
  ├── RETENTION ── to the instrument's rate and cap (H-4)                     [EC-1]
  └── DEDUCTIONS ── to the statutory parameter and its effective date (H-4)   [EC-1]
```

### 11.5.2 The labour-path evidence chain

```
  DISBURSEMENT  ── confirmation, or acknowledgement by the named worker (H-1/H-2)  [EC-4]
        ↑
  WAGE CARD ── days, rate, gross, deductions, recoveries, net                 [EC-4]
        ↑
  SETTLEMENT ── FM-28, independently verified arithmetic                      [EC-4]
        ↑
  ├── PAYABLE DAYS ── FM-20 from validated attendance only                    [EC-3]
  │        ↑
  │   ATTENDANCE VALIDATION ── validator ≠ reporter (H-2)                     [EC-3]
  │        ↑
  │   ATTENDANCE CAPTURE ── method, time, location recorded (H-1/H-3)         [EC-3/EC-5]
  │        ↑
  │   ├── WORKER IDENTITY ── enterprise-wide, permanent                       [EC-3]
  │   ├── WORK ASSIGNMENT ── issued before the work date (H-3)                [EC-3]
  │   └── DEPLOYMENT ── approved, covering the date (H-3)                     [EC-3]
  │
  ├── WAGE RATE ── authorised schedule version at work date (H-4)             [EC-1]
  ├── STATUTORY MINIMUM ── parameter at work date (H-4)                       [EC-1]
  └── RECOVERIES ── within the lawful ceiling (H-3/H-4)                       [EC-4]
```

**TR-1 — Both chains are walked backwards at verification** (PA-2), from the money to the physical
fact. Walking forwards proves only that the process ran.

**TR-2 — Every link records its own tier and confidence** (HR-6, CL-1), so that the confidence of the
whole is computable as the weakest link (HR-2), not asserted.

**TR-3 — A chain with a missing link is not a weak chain; it is not a chain.** PA-3: the payment
waits, the rule is not waived.

**TR-4 — Drillability must be automatic** (RBL-16, CP-7). A chain that requires its author to explain
it has already failed objective O-9, which is the whole reason for keeping it.

## 11.6 Evidence reconciliation

> **GP-23: two independent records of the same fact must reconcile, and the reconciliation is a
> control, not a report.** Reconciliation is the enterprise's most powerful evidential tool because
> it does not depend on trusting either record.

### 11.6.1 The reconciliation matrix

| # | Record A | Record B | What a variance proves | Frequency |
|---|---|---|---|---|
| **XR-01** | Deployment | Attendance | Presence outside authorised population (RSK-01, 03) | Daily |
| **XR-02** | Attendance | Work assignment | Effort without authority (RSK-07, 08) | At validation |
| **XR-03** | Attendance | Independent presence signal — gate, induction, transport, canteen | Ghost or proxy labour (RSK-01, 10) | Daily where available |
| **XR-04** | Attendance (all sources, enterprise-wide) | Itself | Duplicate settlement (RSK-02, 27) | At validation |
| **XR-05** | Attendance | Settlement | Unsettled entitlement or duplicate settlement (RI-7) | Per period |
| **XR-06** | Wage cards | Disbursement confirmations | Intermediation skimming (RI-8, RSK-05, 34) | Per period |
| **XR-07** | Attendance (effort) | Measurement (output) | Over-measurement **or** ghost labour, in opposite directions (MR-6) | Per period |
| **XR-08** | Measurement | Drawing / BOQ quantity | Over-measurement; unrecorded scope change (MR-1, RSK-15, 41) | Per bill |
| **XR-09** | Measurement | Material consumption, theoretical vs issued | Phantom work; wastage abuse (MR-2, RSK-64) | Per period |
| **XR-10** | Measured concrete | Batching / pour records | Over-measurement (MR-3) — H-1 against H-3 | Per pour |
| **XR-11** | Measured steel | Bar-bending schedule and weighbridge | Quantity and classification drift (MR-4) | Per period |
| **XR-12** | Measured earthwork | Level records and haulage | Over-measurement (MR-5) | Per period |
| **XR-13** | Measurement entries | Bills | Duplicate billing; unbilled verified value (RI-1, RI-12) | Per bill |
| **XR-14** | Certified value | Sanctioned value + variations | Ceiling breach (RI-2, RSK-19) | Per bill and on demand |
| **XR-15** | Advances issued | Recovered + outstanding + written off | Advance leakage (RI-3, RSK-20) | Per period |
| **XR-16** | Issued value | Recovered + outstanding + returned + written off | Material, plant, fuel leakage (RI-4, RSK-21, 62, 63) | Per period |
| **XR-17** | Retention accrued | Held + released + forfeited | Retention failure (RI-5, RSK-29) | Per period |
| **XR-18** | Cumulative paid | Confirmed disbursements | Duplicate or diverted payment (RI-6, RSK-46) | Per period |
| **XR-19** | LD accrued | Levied + waived | Unenforced entitlement (RI-10, RSK-26) | Per period |
| **XR-20** | Borrowed-labour debits | Borrowed-labour credits, enterprise-wide | Cross-project duplication (RI-11, RSK-27) | Per period |
| **XR-21** | Statutory deducted | Deposited (CAP-TAX) | Statutory exposure (RI-9) | Per statutory period |
| **XR-22** | Statutory registers | Attendance and wage records | Register divergence before inspection finds it (AUD-11) | Per period |
| **XR-23** | Approved voucher values | Disbursed values | Post-approval drift (RSK-38) | Per disbursement |
| **XR-24** | Control execution log | Expected control executions | Suppressed or non-executed controls (RSK-50, FIN-15) | Continuous |

**XR-A — Every reconciliation names the leakage it detects.** A reconciliation performed without
knowing what a variance would mean produces a number nobody acts on.

**XR-B — Variance beyond tolerance blocks, it does not annotate** (MR-9, AUD-06). Tolerances are
governed parameters (SEC-12), not local settings.

**XR-C — Reconciliations must be computable on demand for any date** (RI-0, FIN-12), not only at
period close, because leverage decays continuously (LA-7).

**XR-D — A reconciliation that always passes is a candidate for review.** Either the control is
genuinely effective, or it is comparing a record against itself. XR-07 and XR-09 are the two most
common places where an implementation accidentally compares derived data with its own source and
concludes, permanently, that everything agrees.

---

## 11.7 Digital evidence integrity

> **MB-9 states the governing principle: a digital record must be at least as hard to falsify as the
> paper record it replaces.** The physical difficulty of erasing ink, of forging a sequence of bound
> pages, of being in two places at once — these were controls. Their digital replacements must be
> stronger, not merely more convenient.

### 11.7.1 The integrity properties

| # | Property | Requirement | Defeats |
|---|---|---|---|
| **DI-1** | **Append-only** | Records are added, never updated in place. Every change is a new record referencing its predecessor | RSK-51 silent modification |
| **DI-2** | **Attribution** | Every record names an individual (SEC-01), never a role, a shared account, or "system" | RSK-47, RSK-56 |
| **DI-3** | **Sequence** | Entry sequence is gap-free and gaps are control events (MB-2, MBK-04) | Removal of records |
| **DI-4** | **Independent time** | Time is taken from a source the recording party does not control | RSK-59 timestamp manipulation |
| **DI-5** | **Location assurance** | Where location matters, it is captured independently and validated against site geometry | RSK-59 location falsification |
| **DI-6** | **Version history** | Every superseded version is retrievable, legible, and attributed, permanently | RSK-60 supersession abuse |
| **DI-7** | **Tamper evidence** | Alteration outside the supersession mechanism is detectable after the fact | RSK-51 |
| **DI-8** | **Administrative containment** | No role — including the most privileged — can alter a record without leaving a visible superseding record | RSK-51, RSK-50 |

**DI-A — DI-8 is the property most often absent and most consequential.** Every immutability rule in
this document is void if a privileged administrator can modify records silently. **The people holding
that capability are normally the least subject to operational control**, so the containment must be
structural and independently monitored (SEC-10, SEC-12).

### 11.7.2 Measurement revisions

**DR-1** — A revision is a **new record** that references, explains, and supersedes its predecessor
(RV-1, MSR-12). The predecessor remains legible forever, including where it was cancelled.

**DR-2** — Every revision records: what changed, by how much, why, by whom, and on whose authority.
A revision with a reason of "correction" states nothing and is non-conformant (OVR-03).

**DR-3** — **Revision rate is a monitored control-health metric** (RV-4, AF-9), by measurer and by
contractor. It is a leading indicator of both incompetence and collusion, and it is the only signal
that distinguishes legitimate correction from supersession abuse (RSK-60).

**DR-4** — Revision **after** billing flows through the running account (RV-2); it is never a quiet
adjustment inside a later measurement, because that destroys the traceability of both.

### 11.7.3 Photographic evidence

**PH-1** — A photograph proves **existence, stage, and condition at a place and time**. It is strong
for those propositions and weak for quantity (TE-6). It MUST NOT be offered as measurement evidence.

**PH-2** — Photographic evidence carries independent time and location (DI-4, DI-5) or it is
demoted to H-7 reconstructed evidence.

**PH-3** — **Duplicate-artefact detection is mandatory.** The same image supporting multiple
measurements is a primary fabrication signature (RSK-58), and it is trivially detectable.

**PH-4** — Photographs are bound to the record at creation (MSR-11, EV-2). Bulk attachment at bill
time is recorded as later-attached and demoted accordingly.

**PH-5** — The absence of a photograph where the method required one is a deficiency, recorded as
such (EA-5, EV-3) — not an ordinary record with one fewer attachment.

### 11.7.4 Timestamp integrity

**TS-1** — Time is taken from a source independent of the capturing party. Device-supplied time is
recorded as **claimed time** and is not sufficient where the timing itself is material.

**TS-2** — Both **event time** and **record time** are captured (ME-6, MBK-06). Their difference is a
monitored signal (AF-8, MSR-17, RSK-09).

**TS-3** — Future-dated events are structurally impossible (ATT-11, MSR-04, AF-2).

**TS-4** — Backdating is legitimate and MUST be recorded as backdating (OVR-06). The effective date
may precede the creation date; concealing that it does is the offence.

### 11.7.5 Location validation

**LV-1** — Where location is evidential — attendance capture, measurement, material issue — it is
captured independently and validated against the site's recorded geometry.

**LV-2** — Captures outside the expected geometry are **rejected or demoted**, never silently
accepted. A pattern of out-of-geometry captures from one device or one actor is an investigation
trigger (RSK-59).

**LV-3** — Location assurance is a **corroborating** control, not a substitute for observation. A
correctly geolocated fabricated record is still fabricated; location defeats absence, not dishonesty.

### 11.7.6 Chain of custody

**CC-1** — Every evidentiary object has a custodian at every moment of its life, recorded (MB-1,
MBK-01). An object in unrecorded custody has no evidential weight, because no one can say who could
have altered it.

**CC-2** — Custody transfers are recorded with both parties and the date. Demobilisation, project
closure, and personnel change are the three highest-risk custody events (RSK-61) and each requires a
formal transfer (CLS-14).

**CC-3** — For digital evidence, custody means **control of the capability to alter**, not physical
possession. The custody record must therefore include who held administrative capability over the
repository, for what period (DI-8).

**CC-4** — An evidentiary object whose custody chain is broken is demoted in confidence (§ 11.4) and
the break is recorded as a finding. It is not discarded — a broken chain is itself evidence about
the enterprise's control.

## 11.8 Evidence preservation

**EP-1 — Retention runs to the longest of: the statutory retention period, the defect liability
period, and the contractual limitation period** (§ 3.4.4, MB-8).

**EP-2 — Archival is not deletion** (LI-33). Archived evidence is removed from operational view and
remains retrievable, legible, and reconstructible on demand.

**EP-3 — Retention MUST be independent of the creator's control** (SEC-11). The strongest motive to
destroy a record belongs to whoever created it.

**EP-4 — Retention is verified, not assumed** (AUD-12). Verification means retrieval testing: an
auditor asks for specific evidence from a closed project and receives it. **Policy compliance is not
evidence of retention.**

**EP-5 — Legibility is part of retention.** Evidence retained in a format or system that can no
longer be read has not been retained. This applies with particular force to digital evidence held in
superseded systems.

**EP-6 — Preservation obligations survive project closure, personnel change, and system replacement.**
Each is a scheduled custody event requiring formal transfer and verification (CC-2).

**EP-7 — Evidence under investigation or dispute is placed under hold** and exempt from any routine
disposal, with the hold recorded and released only by the investigating authority.

## 11.9 Audit framework

### 11.9.1 Audit principles

**AP-1 — Independence.** Internal Audit holds no transition authority anywhere in § 6.14 (SOD-5,
AUD-01). An auditor who can cause a transition cannot audit it.

**AP-2 — Evidence-based.** Audit conclusions rest on evidence at H-3 or above, never on
explanation (HR-5). "The site explained that…" is a note, not a finding.

**AP-3 — Risk-weighted.** Audit effort follows the register of Part 10, weighted by severity,
residual risk, and frequency — not by transaction value alone, because splitting defeats a
value-weighted programme (GP-18, AUD-04).

**AP-4 — Unannounced where surprise is the control.** Physical verification loses all value if
scheduled (AUD-05).

**AP-5 — Reconciliation before inspection.** The reconciliation matrix (§ 11.6) directs where to look;
inspection without it is sampling in the dark.

**AP-6 — Findings are attributed.** To actors, to failed controls, and to root causes — all three
(AUD-10). A finding attributed only to a process changes nothing.

**AP-7 — The audit reports to an authority that can act.** Findings routed to the audited party alone
are not findings (AF-11, AUD-07).

**AP-8 — Audit tests the controls, not merely the transactions.** A period with no exceptions is as
interesting as a period with many: it may mean the controls are working, or that they are not
running (FIN-15, RSK-50).

### 11.9.2 Audit scope

| Scope area | What is examined |
|---|---|
| **Identity and engagement** | WRK, CLB, CTL, BRL — duplicate identity, unregistered workforce, counterparty legitimacy |
| **Attendance and deployment** | ATT, DEP, ASG, GNG — capture discipline, validation separation, single-occupancy |
| **Measurement** | MSR, MBK — MB integrity, check regime, classification, concealed work |
| **Valuation and billing** | RBL, EVL, VAR — rate resolution, cumulative form, ceiling, variation governance |
| **Recovery, advance, retention** | ADV, REC, RET — the L5/L6 block, ageing, waiver governance |
| **Wage and statutory** | LAB, WGR, DWG, WKS, PCR — minimum wage, deduction ceilings, intermediated payment evidence |
| **Approval and authority** | PEL, SEC, OVR — delegation validity, separation, splitting, override governance |
| **Financial integrity** | FIN — canonical computation, rounding, immutability, fail-closed behaviour |
| **Evidence and record** | Part 11 — tier accuracy, integrity properties, custody, retention |
| **Governance** | EXC, AUD, CLS — exception counting, control health, closure discipline |

### 11.9.3 Audit events and checkpoints

**Audit events** are occurrences that require an audit response regardless of the audit calendar.

| # | Event | Required response |
|---|---|---|
| **AE-1** | Reconciliation identity violation (RI-1…RI-12) | Immediate exception; investigate before the dependent payment |
| **AE-2** | Exception frequency threshold breached (EXC-07) | Rule review; authoriser review |
| **AE-3** | Control non-execution or suppression (FIN-15, SEC-12) | Immediate independent review of the suppressed period |
| **AE-4** | Confirmed leakage of any form | Full AUD-10 treatment: attribute, quantify, recover, root-cause |
| **AE-5** | Contractor distress indicators (RSK-67) | Exposure review; recovery acceleration decision |
| **AE-6** | Measurement revision-rate outlier (RV-4) | Measurer review; re-check of the period |
| **AE-7** | Favourable productivity outlier (PRD-05) | Measurement investigation, not congratulation |
| **AE-8** | Payee or banking-detail change (SEC-07) | Independent verification before any payment |
| **AE-9** | Emergency or out-of-turn payment (PEL-10) | Post-facto review within the exception's time box |
| **AE-10** | Project closure (CLS) | Closure audit: FC-1…FC-10, evidence retention, custody transfer |

**Audit checkpoints** are the scheduled gates.

| # | Checkpoint | Frequency | Focus |
|---|---|---|---|
| **AC-1** | Site verification | Unannounced, minimum quarterly per active site | Physical presence vs record (AUD-05) |
| **AC-2** | Measurement audit | Per bill cycle, risk-weighted sample | MB integrity; check regime; classification |
| **AC-3** | Recovery and exposure review | Monthly | RI-3, RI-4; ageing; waiver governance |
| **AC-4** | Statutory compliance review | Per statutory period | LAB domain; RI-8, RI-9; register reconciliation |
| **AC-5** | Approval and delegation audit | Quarterly | Limits, validity, separation, splitting patterns |
| **AC-6** | Control-health review | Monthly | Exception counts, override frequency, non-executed controls |
| **AC-7** | Evidence and custody audit | Half-yearly | Tier accuracy, integrity, retention retrieval testing |
| **AC-8** | Closure audit | Per closure | FC-1…FC-10; CLS domain |
| **AC-9** | Governance review | Annual | ARB gate (§ 11.12); rule-set review; register refresh |

### 11.9.4 Audit responsibilities

| Actor | Audit responsibility |
|---|---|
| **Internal Auditor** | Independent examination; findings; root cause; control-effectiveness opinion. **No transition authority** |
| **Finance Controller** | Owns control design and remediation; cannot audit their own controls |
| **Project Manager** | Provides access and evidence; accountable for site-level remediation; **never** the sole verifier of an audit finding on their own project |
| **Check Measurement Officer** | Operational verification (not audit); their own work is subject to audit |
| **Accountant** | Recovery completeness and arithmetic integrity; subject to audit on both |
| **CEO/MD** | Receives findings that cannot be remediated below executive level; owns the exception culture (LA-5) |
| **External audit / statutory auditor** | Independent assurance; consumes this framework, does not replace it |

### 11.9.5 The audit trail

**AT-1** — Every financial and evidentiary act records: **actor, time, prior state, new state,
authority relied upon, and reason where the act is discretionary** (AUD-02).

**AT-2** — The trail is append-only and subject to DI-1…DI-8 in full. **An audit trail that can be
altered is worse than none**, because it manufactures confidence.

**AT-3** — The trail covers refusals, rejections, and failed attempts, not only successful acts
(EXC-09, PEL-12). The pattern of what was attempted and refused is often the most valuable
investigative signal the enterprise holds, and it exists nowhere else.

**AT-4** — The trail covers **reads of sensitive records** where the risk model requires it — payee
data, exposure positions, and evidence under hold.

**AT-5** — The trail is retained for the full evidence-retention period (EP-1) and is itself subject
to retrieval testing (EP-4).

## 11.10 Investigation model

### 11.10.1 Investigation triggers

An investigation is opened on: an audit event (AE-1…AE-10); a reconciliation variance beyond
tolerance that is not explained by evidence; an exception pattern; a whistleblower report; a
counterparty complaint; a worker grievance regarding non-payment; or an external notification.

**IV-1 — A trigger is not a finding.** Opening an investigation carries no implication of misconduct,
and the record must not read as though it does.

### 11.10.2 The investigation workflow

```
  1. TRIGGER RECORDED ──────── source, date, initial proposition
  2. EVIDENCE PRESERVED ────── hold applied (EP-7); custody secured (CC-1)
  3. SCOPE DEFINED ─────────── propositions to be tested, period, counterparties, actors
  4. EVIDENCE ASSEMBLED ────── by tier (§ 11.3); independent sources first (EA-4)
  5. RECONCILIATION RUN ────── the applicable XR tests (§ 11.6)
  6. PROPOSITIONS TESTED ───── each to a confidence level (§ 11.4)
  7. ACTORS INTERVIEWED ────── last, never first — testimony is H-8 (HR-5)
  8. FINDINGS FORMED ───────── attributed to actor, control, and root cause (AP-6)
  9. QUANTIFICATION ────────── loss computed by Part 7 formulae, not estimated
 10. RECOVERY INITIATED ────── through the ordinary waterfall wherever possible (FM-13)
 11. REMEDIATION ──────────── rule, process, or structural change (AUD-10)
 12. CLOSURE AND REVIEW ───── register updated (RG-4, RG-6); exception reviewed (EXC-10)
```

**IV-2 — Evidence is preserved before it is examined**, not after. Step 2 precedes step 3 because
scoping conversations alert the subjects of the investigation.

**IV-3 — Interviews come last** (step 7). Testimony taken before the documentary position is
established shapes the investigation around the account of the most articulate participant.

**IV-4 — Investigators MUST have access to superseded, cancelled, refused, and archived records**
(AUD-09). Operational filters do not apply to investigative access.

**IV-5 — Loss is computed, not estimated** (step 9). The formulae of Part 7 apply to the
quantification of a loss exactly as they apply to a payment; an estimated loss cannot support
recovery, discipline, or a claim.

**IV-6 — An investigation that finds nothing MUST still record what was tested.** A closed
investigation with no findings is evidence that the enterprise looked, and it protects the people who
were investigated.

### 11.10.3 Investigation classes

| Class | Subject | Distinctive requirement |
|---|---|---|
| **Exception investigation** | A pattern of authorised deviations (EXC-07) | Tests whether the **rule** is wrong, the **process** is wrong, or the control is being circumvented — all three are different remedies |
| **Financial investigation** | A quantified discrepancy: leakage, variance, unexplained residue | Quantification by Part 7; recovery through the waterfall; root cause in the control set |
| **Fraud investigation** | Suspected deliberate defeat of controls, including collusion | Evidence preservation before scoping; restricted circulation; legal counsel engaged early; statutory reporting obligations assessed |
| **Statutory investigation** | Suspected breach of a worker's statutory entitlement | The worker is made whole **first** (PA-8, EB-3); commercial recovery follows separately |
| **Control investigation** | Suspected suppression or non-execution of a control (RSK-50) | Independent re-execution over the affected period; scope defined by when the control last demonstrably ran |

**IC-1 — Fraud investigations restrict circulation, not evidence.** The investigating authority sees
everything; distribution is limited. An investigation whose *evidence* is restricted has been
compromised at the outset.

**IC-2 — Where collusion is suspected, the investigation is conducted by an authority outside the
reporting line of every suspected participant** — which, for a site-level collusion, means outside
the project entirely (§ 4.14.1 externality applied to audit).

### 11.10.4 Escalation

| Level | Trigger | Authority | Response time |
|---|---|---|---|
| **E-L1** | Reconciliation variance within tolerance, single occurrence | Accountant / Site Engineer | Same period |
| **E-L2** | Variance beyond tolerance; failed control; exception threshold | Project Manager + Accountant | Before the dependent payment |
| **E-L3** | Confirmed leakage; repeated exception pattern; statutory breach indication | Finance Controller + Internal Audit | Immediate; payment blocked |
| **E-L4** | Suspected fraud, collusion, or control suppression | Internal Audit + CEO/MD; legal counsel | Immediate; evidence preserved before any notification |
| **E-L5** | Systemic control failure; material misstatement; regulatory exposure | CEO/MD + Board; external audit informed | Immediate |

**ES-1 — Escalation is by severity *and* by frequency, independently** (RG-2).

**ES-2 — Escalation MUST NOT pass through an actor who is a subject of the matter.** Where the
ordinary path would do so, it routes directly to the next independent level (GP-24).

**ES-3 — The worker's grievance escalates on its own path** and is never gated by a commercial
dispute (PA-8, CTL-06, LAB-10). A worker reporting non-payment reaches an authority that can pay
them, within the settlement period.

**ES-4 — De-escalation is a decision, recorded.** A matter closed at any level records who closed it,
on what evidence, and why — because quiet de-escalation is how findings disappear (GP-14).

---

## 11.11 Architectural intent

Two instruments preserve *why* this capability is shaped as it is, for implementers who will arrive
after everyone who wrote it has gone (objective O-9). Neither is a rule. **Rules bind behaviour;
these preserve intent, so that a future implementer can tell the difference between a constraint
that must hold and an accident of drafting that may be improved.**

### 11.11.1 Enterprise Decision Records

Each record states a decision that was genuinely open, the alternative that was rejected, and the
reasoning. **A decision with no rejected alternative is not a decision; it is a description.**

> **EDR-01 — A running bill is a claim, not an entitlement.**
> **Decision.** A submitted bill creates no obligation. Entitlement arises only from verification.
> **Rejected alternative.** Treating a submitted bill as a payable from receipt, ageing it as a debt.
> **Reasoning.** The rejected model inverts the burden of proof and manufactures the payment pressure
> of § 1.4.8 — the contractor's clock starts running before the enterprise has established that
> anything is owed. **Consequence:** RBL-01, CTL-03, GP-13.

> **EDR-02 — Payment follows verified evidence; evidence never follows payment.**
> **Decision.** No payment may precede the evidence that supports it, in any circumstance including
> emergency.
> **Rejected alternative.** Permitting payment against undertaking, with evidence to follow — the
> ordinary commercial practice in many industries.
> **Reasoning.** In construction the evidence is created at a distance from the money by people the
> payer does not observe (§ 1.4.1). Evidence produced after payment is produced by a party who has
> already been paid, and is therefore worthless. **Consequence:** LAW-1, LAW-2, PEL-01, PEL-10.

> **EDR-03 — The Measurement Book is immutable, and a digital MB must be harder to falsify than paper.**
> **Decision.** Append-only, attributed, sequenced, with superseded entries permanently legible.
> **Rejected alternative.** A digital record permitting administrative correction, on the reasoning
> that digital systems are inherently more reliable than paper.
> **Reasoning.** The reliability of paper came from the *difficulty of altering it* — bound pages,
> ink, sequence, custody. A digital record that permits silent edit has removed the control and kept
> the appearance. **Consequence:** MB-9, MBK-09, SEC-10, DI-1…DI-8.

> **EDR-04 — Borrowed labour requires dual accountability.**
> **Decision.** Both the lending and the borrowing officer are accountable for the same transfer.
> **Rejected alternative.** Single-sided recording by the receiving project.
> **Reasoning.** Transfers fail because each side assumes the other recorded it. Duplicated
> accountability is the only arrangement in which neither party can rely on the other's silence.
> **Consequence:** BRL-01, BRL-02, DEP-06, RI-11.

> **EDR-05 — The settlement computation determines the maximum payable.**
> **Decision.** Approval may reduce the computed figure; no authority may increase it.
> **Rejected alternative.** Approval as a discretionary financial decision within a delegated limit.
> **Reasoning.** If an approver may exceed the computation, the computation is advisory and every
> control feeding it is decorative. Discretion belongs at the *reduction* end, where it is
> conservative (CP-8). **Consequence:** PEL-06, FIN-02, RSK-39. **See ARB-F1.**

> **EDR-06 — Intermediary remuneration must not rise with reported headcount.**
> **Decision.** Gang-leader and supplier remuneration is linked to verified output or a fixed
> engagement, never to the presence count they themselves report.
> **Rejected alternative.** Per-head commission, which is the prevailing market practice.
> **Reasoning.** The enterprise would otherwise be paying someone to inflate its own primary evidence
> (§ 4.2). Where market practice compels the rejected model, it is an exception with declared
> compensating controls — not a silent default. **Consequence:** GNG-09, BRL-08, RSK-04.

> **EDR-07 — Contract payments are cumulative, never incremental.**
> **Decision.** Every bill re-derives the whole position; the period figure is a derived difference.
> **Rejected alternative.** Period-based billing, which is simpler, more intuitive, and produces the
> same number whenever nothing has gone wrong.
> **Reasoning.** The two models diverge permanently the moment anything *has* gone wrong. Under the
> cumulative model a prior error self-corrects at the next bill; under the incremental model it
> survives to the final account, to be discovered under maximum pressure and minimum leverage.
> **Consequence:** LAW-6, FM-19, § 7.8.1, RBL-04, RSK-18.

> **EDR-08 — The final account is computed before it is discussed.**
> **Decision.** Compute, present, then negotiate — never negotiate, then reconcile.
> **Rejected alternative.** Commercial settlement of the final account as a single negotiation, the
> prevailing industry practice.
> **Reasoning.** § 1.4.12: the accumulated rigour of a hundred running bills is otherwise surrendered
> in one meeting. Where a commercial settlement is genuinely required, its variance from the computed
> figure is the decision, and it is recorded and attributed. **Consequence:** LI-26, CLS-02, CLS-13.

> **EDR-09 — Worker identity is enterprise-wide and permanent.**
> **Decision.** One human being, one identity, across all projects, contractors, and time.
> **Rejected alternative.** Per-project or per-contractor worker records, which are simpler to
> administer and match how contractors actually manage their own labour.
> **Reasoning.** Duplicate settlement is undetectable in principle without a single identity space.
> Every anti-duplication control in the labour path keys on identity, so scoping identity narrowly
> voids all of them at once. **Consequence:** WRK-02, LI-16, ATT-06, RSK-02.

> **EDR-10 — Financial paths fail closed.**
> **Decision.** Where a financial control cannot execute, the transaction stops; a missing input is
> never treated as zero.
> **Rejected alternative.** Graceful degradation — proceeding with the best available data so that
> operations are not blocked by an outage.
> **Reasoning.** A missing recovery treated as nil is leakage arriving through the arithmetic, with
> no one having done anything visibly wrong. Availability is an operational virtue; on a money path
> it is a leakage mechanism. **Consequence:** DP-3, FIN-06, PEL-08, DT-4, RSK-24.

> **EDR-11 — Exceptions are counted against the authoriser.**
> **Decision.** Every deviation is attributed to a person and reportable by that person for any
> period.
> **Rejected alternative.** Recording exceptions by type and volume without personal attribution.
> **Reasoning.** LA-5 — a bypass used more than twice ceases to be an exception. Only per-authoriser
> counting makes that arithmetic visible while it is still correctable, and only personal attribution
> makes an authoriser feel the accumulation. **Consequence:** LAW-12, LI-30, EXC-08, OVR-07.

> **EDR-12 — Recovery is deducted at source and never invoiced back.**
> **Decision.** Amounts owed to the enterprise are deducted before value leaves.
> **Rejected alternative.** Gross payment with separate recovery billing, which is cleaner
> accounting and preserves the counterparty's cash position.
> **Reasoning.** LA-7 — the enterprise's leverage is highest before payment and never returns.
> Recovery before disbursement is arithmetic; recovery afterwards is litigation. **Consequence:**
> LAW-8, PA-5, FM-13, PEL-05, RSK-20.

### 11.11.2 Enterprise Event Model

**Enterprise events are business facts, not system messages.** Each is the moment at which the
enterprise's position changes and evidence becomes fixed. They are listed because an implementation
that cannot recognise these moments cannot place its controls at them.

| # | Event | Occurs when | Evidence fixed | Downstream obligation |
|---|---|---|---|---|
| **EVT-01** | **Engagement Authorised** | An instrument becomes ACTIVE with rates, ceiling, retention, and recovery terms bound | EC-1 contractual | Payment becomes possible at all; ceiling begins to bind |
| **EVT-02** | **Labour Deployed** | An approved deployment takes effect for a worker or gang | EC-3 | Attendance capture becomes permissible for that worker |
| **EVT-03** | **Work Assigned** | An assignment is issued, before execution | EC-3 (H-3) | Limb (b) of LAW-2 satisfied for the covered dates |
| **EVT-04** | **Attendance Recorded** | Presence is captured at the point of occurrence | EC-3/EC-5 (H-3) | Enters the single-occupancy test (LI-16) |
| **EVT-05** | **Attendance Validated** | An independent officer confirms it | EC-3 (H-2) | Becomes payable; becomes a productivity denominator |
| **EVT-06** | **Work Executed** | Physical work is performed | EC-6 | Becomes measurable (LAW-3) |
| **EVT-07** | **Measurement Recorded** | The engineer records quantity at site | EC-2 (H-3) | Enters the check regime |
| **EVT-08** | **Measurement Verified** | Independent check confirms or reduces | EC-2 (H-2) | Becomes billable; enters the consumption register |
| **EVT-09** | **Running Bill Submitted** | Contractor claims | EC-4 (H-6) | A claim only — no obligation arises (EDR-01) |
| **EVT-10** | **Value Certified** | Technical certification within limit | EC-4 | Retention accrues in the same act (SY-6) |
| **EVT-11** | **Recovery Applied** | Deduction taken at source | EC-4 | Obligation reduced; ledger updated |
| **EVT-12** | **Settlement Calculated** | Net payable computed | EC-4 (H-5) | Establishes the **maximum** payable (EDR-05) |
| **EVT-13** | **Settlement Approved** | Financial authority accepts within limit | EC-1/EC-4 | Amount and payee become immutable (LI-23) |
| **EVT-14** | **Payment Released** | Disbursement instructed | EC-4 | Liability transfers to CAP-TRE; reconciliation clock starts |
| **EVT-15** | **Payment Confirmed** | Disbursement confirmed by the channel | EC-4 (H-1) | Bill becomes PAID (SY-7); evidence consumed |
| **EVT-16** | **Advance Issued** | Advance disbursed against a bound recovery plan | EC-4 | Recovery obligation live from this instant (LAW-7) |
| **EVT-17** | **Value Issued to Contractor** | Material, plant, fuel, or utility issued | EC-4 | Recovery obligation created automatically (LI-14) |
| **EVT-18** | **Retention Withheld** | Retention accrues on certification | EC-4 | Enterprise liability created (LAW-10) |
| **EVT-19** | **Variation Sanctioned** | A variation is formally approved | EC-1 | The ceiling rises — the only mechanism by which it can (LAW-9) |
| **EVT-20** | **Exception Raised** | A deviation is authorised | EC-3 | Time box starts; count accrues against the authoriser |
| **EVT-21** | **Settlement Closed** | A bill or settlement is superseded or discharged | EC-4 | Evidence consumed permanently (LM-6) |
| **EVT-22** | **Contract Closed** | All obligations expired and the record sealed | EC-1/EC-4 | Retention custody transfers; evidence retention clock governs |

**EV-M1 — Every event is a control point.** Where an event occurs and no control is evaluated, the
enterprise has a gap by construction.

**EV-M2 — Events are recorded, not inferred.** An enterprise that reconstructs "when the value was
certified" from a timestamp on a document has not recorded the event.

**EV-M3 — Evidence fixed at an event does not change afterwards.** It may be superseded (LAW-11); it
is never revised in place. This is what makes an event a point of reference at all.

## 11.12 Architecture Review Board quality gate

> This section is the self-review mandated before Part 11 concludes. **Every finding is recorded,
> including those left uncorrected.** A review that reports no findings has not been performed.

### 11.12.1 Gate results

| # | Verification | Result |
|---|---|---|
| 1 | No contradictory rules | **1 material conflict found and resolved** (ARB-F1); 3 apparent conflicts resolved by precedence (ARB-F2) |
| 2 | No payment path without evidence | **Pass**, with one declared weakening (ARB-F3) |
| 3 | No overpayment path | **Pass against SC-17 for a single actor**; fails against collusion (ARB-F4) |
| 4 | No duplicate payment path | **Pass within each payment path**; cross-path reconciliation is periodic, not structural (ARB-F5) |
| 5 | No undefined responsibility | **Pass** with two ambiguities recorded (ARB-F6) |
| 6 | No circular approvals | **Pass** (ARB-F7) |
| 7 | No unsupported financial computation | **Pass** with one external dependency (ARB-F8) |
| 8 | No orphan lifecycle | **Pass** (ARB-F9) |
| 9 | No missing audit trail | **Pass** with one scope gap (ARB-F10) |
| 10 | No business object without ownership | **Pass** (ARB-F11) |
| 11 | No unresolved governance gap | **Fail — four gaps open** (ARB-F12…ARB-F15) |

### 11.12.2 Findings

> **ARB-F1 — Conflict between PEL-06 and CLS-13. Resolved.**
> **Finding.** PEL-06 states that no authority may approve above the computed figure. CLS-13 permits a
> negotiated final settlement that differs from the computed final account. Read together, CLS-13
> could be used to pay above the computation, defeating EDR-05.
> **Resolution.** CLS-13 does **not** create a payment authority. A negotiated settlement above the
> computed figure requires the underlying entitlement to be changed by a formal instrument — a
> sanctioned variation (LAW-9) or a recorded executive settlement carrying its own authority — and
> the computed figure continues to bind the payment until that instrument exists. **PEL-06 governs;
> CLS-13 governs only the recording of the variance.** Both rules stand as written with this
> precedence recorded here.
> **Status.** Resolved by precedence. **Superseded by amendment B-5:** the precedence stated here has
> been promoted into PEL-06 and CLS-13 themselves, because a resolution recorded only in this
> assessment section binds only readers of Part 11, while Part 9 is the operative layer.

> **ARB-F2 — Three apparent conflicts, resolved by existing precedence. No change.**
> (a) **MSR-18/MD-1 vs PEL-04.** MD-1 lets undisputed value proceed while an item is disputed;
> PEL-04 says a broken chain stops the payment. **Resolution:** the chain is tested per quantity, not
> per bill. A disputed item has a broken chain and does not proceed; the others are unaffected.
> (b) **RET-06 vs LAW-10.** Retention is the contractor's money, yet RET-06 releases it net of
> recovery. **Resolution:** LAW-8 governs the order of application; the contractor's money is applied
> to the contractor's obligations. No Law is breached.
> (c) **CTL-06 vs PEL-11.** CTL-06 pays workers directly where a contractor has failed to; PEL-11
> restricts payment to the entitled payee. **Resolution:** the worker *is* an entitled payee under
> the statutory obligation that CTL-06 discharges. PEL-11's prohibition is against payment to an
> unentitled third party.
> **Status.** Resolved. **Superseded by amendment B-5:** all three resolutions have been promoted
> into the operative rules — (a) into PEL-04, (b) into RET-06, (c) into PEL-11 — for the same reason
> given at ARB-F1.

> **ARB-F3 — A declared weakening of LAW-2 on single-officer sites.**
> **Finding.** ATT-08 requires validator ≠ reporter, but permits, in small teams, validation by an
> officer outside the site under § 4.14.1. On a genuinely single-officer remote site, capture and
> validation may be separated only by time and distance, not by person.
> **Assessment.** This is a real reduction in control, not an equivalent alternative. It is recorded
> as a standing exception, counted under LAW-12, and it is the direct enabler of RSK-54.
> **Status.** **Accepted weakness, not corrected.** The alternative — refusing to operate
> single-officer sites — is not within this capability's authority to impose.

> **ARB-F4 — SC-17 holds against a single actor and fails against collusion.**
> **Finding.** The overpayment thought experiment (SC-17) is satisfied for any single actor: causing
> an overpayment requires a false measurement, its independent verification, an approval within
> limit, and a permanent attributed record. **Two colluding actors — measurer and checker, or
> supervisor and mate — can satisfy all four.**
> **Assessment.** Rotation (RSK-53, RSK-54 controls), pairing analysis (AF-7), independent-process
> reconciliation (MR-2…MR-5), and audit externality (IC-2) reduce but do not close this.
> **Status.** **Open, recorded honestly.** § 10.8 question 2 states the same conclusion. This is the
> capability's largest structural limitation and it must not be presented as closed.

> **ARB-F5 — Cross-path duplicate payment is prevented periodically, not structurally.**
> **Finding.** Within the contract path (SY-1, MSR-13) and within the labour path (SY-2, ATT-20),
> consumption marking is structural. **Between** them — the same physical work paid once as a
> contractor's measured item and once as piece-rate labour — PCR-05 requires consumption marking
> across paths, but the reconciliation that would detect a failure runs at period close.
> **Assessment.** RSK-16 carries this as Medium severity with Medium residual, which is consistent.
> **Status.** **Open.** A future amendment should consider a synchronisation point (a companion to
> SY-1/SY-2) binding cross-path consumption at the moment of settlement rather than at period close.

> **ARB-F6 — Two ownership ambiguities in Part 5.**
> **Finding.** OBJ-08 (Activity) and OBJ-23 (Productivity Record) are consumed by this capability but
> originate in or serve CAP-PPM. Their owner within WFC is implied rather than stated.
> **Assessment.** Neither is a financial object, so no payment path is affected. CTL-13 ensures every
> engagement has a named accountable officer, which covers the operational gap.
> **Status.** **Recorded, not corrected.** Part 5 is frozen baseline; the clarification belongs in a
> future amendment rather than a retrospective edit (LAW-11 applied to the document itself).

> **ARB-F7 — No circular approvals found.**
> **Finding.** The transition authority matrix (§ 6.14) was traced for cycles. No transition requires
> an approval that depends, directly or transitively, on a later transition. SEC-06 additionally
> prevents a pending approval completing under withdrawn authority, which is the principal way a
> cycle would arise in practice.
> **Status.** Pass.

> **ARB-F8 — One external dependency in the computation set.**
> **Finding.** FM-05 escalation depends on a published index the enterprise does not control. ESC-1
> forbids estimation, so an unpublished index blocks that component.
> **Assessment.** This is fail-closed behaviour operating as intended (EDR-10), not a gap. It is
> recorded because implementers routinely resolve it by estimating, which is PC-12.
> **Status.** Pass, with the failure mode named.

> **ARB-F9 — No orphan lifecycles.**
> **Finding.** All twelve lifecycles (LC-01…LC-12) terminate in a defined state, and § 6.16 gives a
> terminal state and consumption marker for every object that carries one. SY-10 and CLS-08 prevent
> closure with any dependent lifecycle open.
> **Status.** Pass.

> **ARB-F10 — Audit-trail read-logging scope is undefined.**
> **Finding.** AT-4 requires logging of reads "where the risk model requires it" and names three
> categories. The boundary is not fully specified.
> **Assessment.** Deliberate: exhaustive read logging is disproportionate and would itself become an
> unmonitored data set. But an undefined boundary is an undefined term (LA-2).
> **Status.** **Open.** A future amendment should enumerate the read-logged classes explicitly.

> **ARB-F11 — Every business object has an owner.**
> **Finding.** All thirty objects in § 5.1 carry an Owner facet. Subject to ARB-F6's two
> clarifications, ownership is complete and no financial object is unowned.
> **Status.** Pass.

> **ARB-F12 — Governance gap: the exception library (Part 16) is referenced but not authored.**
> **Finding.** XCP-01, XCP-02, XCP-03, XCP-06, and XCP-16 are referenced with established meanings
> across Parts 2, 5, 9, and 10. The remaining identifiers in that range are unassigned.
> **Assessment.** Part 10's register (RSK-01…RSK-72) is a distinct instrument and does not replace
> the exception library: a *risk* is what can happen; an *exception* is an authorised deviation.
> **Status.** **Open.** Part 16, when authored, MUST adopt the five established identifiers unchanged
> and MUST NOT renumber them.

> **ARB-F13 — Governance gap: Parts 12–15 are undefined.**
> **Finding.** The document's internal references establish Part 16 as the exception library. Parts
> 12 through 15 are neither authored nor scoped.
> **Status.** **Open.** Scope to be set by governance decision before authoring continues.

> **ARB-F14 — Governance gap: RSK-69 lies outside this capability's authority.**
> **Finding.** Unbalanced rates at award are set in CAP-SCM (§ 3.4.3 — WFC applies rates, it does not
> decide them; II-1 — authority is consumed, never created). WFC can detect and report the condition
> and limit its consequence; it cannot prevent it.
> **Status.** **Open by design.** Recorded so that no implementer mistakes the absence of a
> preventive control for an oversight.

> **ARB-F15 — Observation: 301 of 373 rules admit no exception.**
> **Finding.** Four-fifths of the catalogue is Law-equivalent in strength.
> **Assessment.** This is intentional (§ 9.32) and follows from DP-1 and LA-4: in a capability whose
> subject is money leaving on evidence created at a distance, a rule that can be set aside under
> pressure will be set aside precisely when it matters. It is recorded because it is a legitimate
> subject of governance challenge, and a future board may reasonably wish to revisit the proportion.
> **Status.** Recorded for governance attention. No change proposed.

### 11.12.3 Board conclusion

**The capability as specified in Parts 1–11 is internally consistent, has no payment path that
bypasses evidence, and satisfies SC-17 against any single actor.**

It does **not** close two exposures, and both are stated rather than argued away:

1. **Collusion between two actors holding adjacent roles** (ARB-F4, § 10.8 Q2).
2. **Fabrication of interested-party evidence** where no independent-process record exists
   (§ 10.8 Q4) — mitigated by the evidence hierarchy, not eliminated by it.

Four governance gaps remain open (ARB-F5, ARB-F10, ARB-F12, ARB-F13) and one is open by design
(ARB-F14).

> **Conformance note.** An implementation claiming conformance to CAP-WFC-01 MUST publish a
> conformance statement enumerating every Immutable Law satisfied, every Business Rule implemented,
> deferred, or rejected with reasons, and every Exception it can detect (§ How to read this
> document). **Partial conformance is legitimate and honest. Silent partial conformance is not** —
> and after Part 10 § 10.6, an implementer can no longer claim not to have known which controls
> must be structural.

---

> **End of the constitutional core — Parts 1–11.**
> **Part 9** — 373 business rules across 29 domains, consolidated by 24 governing principles.
> **Part 10** — 72 risks across 17 categories, with the adversarial review recorded at § 10.8.
> **Part 11** — evidence hierarchy, confidence model, traceability chains, 24 reconciliations,
> the audit and investigation framework, 12 Enterprise Decision Records, 22 enterprise events,
> and the Architecture Review Board gate at § 11.12.
>
> **Outstanding by governance decision (ARB-F12, ARB-F13):** Part 16 — Exception Library, which MUST
> adopt XCP-01, XCP-02, XCP-03, XCP-06 and XCP-16 as already established; and the scope of
> Parts 12–15, which is not yet set.

---

# CONSTITUTIONAL DERIVATION — PARTS 12 THROUGH 17

> **The preceding eleven Parts are the constitutional core. Everything that follows is derived from
> them and adds no architecture.**

Parts 12–17 exist because a constitution that cannot be *observed*, *reported*, *classified*, or
*spoken about consistently* will not survive the people who wrote it. They supply, in order:
what the enterprise measures (12), how it presents what it measures (13), what it records formally
(14), what its concepts are as an information model (15), what happens when the rules do not hold
(16), and what its words mean (17).

**Derivation discipline.** Every element of Parts 12–17 traces to at least one element of Parts 1–11.
Where a derived element cannot be traced, it is not admitted — no matter how useful it appears.
Specifically, throughout Parts 12–17:

| # | Constraint | Consequence |
|---|---|---|
| **DD-1** | No new Immutable Law, Constitutional Principle, or Design Principle | The philosophy is closed |
| **DD-2** | No new business rule, risk, or enterprise event | Counts in Parts 9, 10 and 11 are invariant |
| **DD-3** | No new business concept unless unavoidable, and each one declared where introduced | Part 15 introduces value objects and ledgers only, both derived |
| **DD-4** | No change to any formula in Part 7 | The mathematical engine is closed |
| **DD-5** | No expansion of scope beyond § 2.1, and no crossing of the boundaries in § 3.4 | The capability boundary is closed |
| **DD-6** | Every KPI, dashboard, report, exception, and glossary term cites its constitutional source | Traceability is verifiable, not asserted |
| **DD-7** | Derived Parts may **observe** the core; they may never **override** it | An indicator that conflicts with a rule is a defective indicator |

> **The ordering of authority is unchanged** (§ How to read this document). Parts 12–17 sit below
> Part 9 in constitutional authority and below every Immutable Law without exception. **A KPI that
> makes a rule inconvenient does not amend the rule; it is evidence that the KPI is wrong.**

---

# PART 12 — ENTERPRISE KPI CATALOGUE

## 12.1 Purpose and constitutional standing

> **A key performance indicator in this capability is not a management convenience. It is the
> instrument by which the enterprise observes whether its own constitution is being obeyed.**

Part 10 § 10.7 RG-2 establishes that severity and frequency escalate independently; § 9.2 GP-21
establishes that *the enterprise measures its own controls*; SC-16 requires that control health be
visible. **Part 12 is where those obligations become specific.**

### 12.1.1 What a constitutional KPI is, and is not

| A constitutional KPI **is** | A constitutional KPI **is not** |
|---|---|
| A named quantity derived from constitutional data by a stated formula | A target negotiated between managers |
| Owned by exactly one accountable actor from Part 4 | A departmental score |
| Bound to at least one business rule or risk it observes | A measure invented because the data happened to exist |
| Thresholded, with the threshold itself a governed parameter (SEC-12) | A number whose threshold the observed party may adjust |
| Decision-supporting: it names the decision it informs | A figure reported because it was reported last period |

### 12.1.2 Constitutional constraints on all indicators

**KP-1 — A KPI never adjusts entitlement.** PD-1 states this for productivity; it generalises to
every indicator in this Part. **No payment, no rate, no approval, and no recovery may be varied
because of an indicator's value.** An indicator informs award, forecasting, investigation, and
resourcing. It never touches the money path.

**KP-2 — A KPI is computed from constitutional sources only.** Every KPI below states its source in
terms of Part 5 objects, Part 7 formulae, Part 9 rules, or Part 11 evidence classes. **An indicator
computed from a parallel data set is measuring something else** (CP-4, FIN-01).

**KP-3 — A favourable movement is not self-evidently good.** PRD-05 establishes that favourable
productivity is a leakage signal. Several indicators below are **bidirectional**: both an adverse and
a favourable excursion require investigation, and the catalogue says which.

**KP-4 — Thresholds are governed parameters.** They are set centrally, versioned by effective date
(GP-17), changed only under SEC-12 with independent alerting, and never adjusted by the party the
indicator observes (FIN-16).

**KP-5 — An indicator that cannot be computed MUST report that it could not be computed**
(CP-11, DP-11, FIN-15). A blank is never a zero, and an unavailable indicator is never a passing one.

**KP-6 — Every indicator names its owner, and the owner is an actor, not a function.** A KPI owned
by "Finance" is owned by nobody (RP-2 applied to measurement).

**KP-7 — Indicators are reported to an authority that can act** (AP-7, AF-11). An indicator whose
only recipient is the party it measures is not a control; it is a mirror.

### 12.1.3 Catalogue structure

Indicators carry a single enterprise-wide sequence, **KPI-01 … KPI-70**, and are never renumbered.
§ 12.2 defines the ten strategic indicators. § 12.3 defines the operational and control indicators.
§ 12.4 presents the **role catalogues** — twelve views over the same single catalogue, because a
capability with twelve separate KPI sets has twelve versions of the truth (CP-4).

Each indicator is specified as:

| Attribute | Meaning |
|---|---|
| **Identifier** | Permanent, never reused |
| **Name** | Its canonical name; the only name by which it is referred to anywhere |
| **Business meaning** | What a change in it actually tells the enterprise |
| **Formula** | Derivation, in the notation of Part 7 where applicable |
| **Source data** | The constitutional objects, events, and evidence it consumes |
| **Frequency** | How often it is computed |
| **Thresholds** | Governed values, with direction of concern |
| **Owner** | The single accountable actor (Part 4) |
| **Decision supported** | The specific decision it informs |
| **Related risks** | Part 10 identifiers |
| **Related rules** | Part 9 identifiers |

---

## 12.2 Strategic indicators — KPI-01 … KPI-10

> These ten are the enterprise's constitutional health indicators. **They answer the only question
> the capability exists to answer: is every rupee released to labour and contractors earned,
> verified, and recoverable?**

### KPI-01 — Verified Payment Accuracy
| | |
|---|---|
| **Business meaning** | The proportion of disbursed value whose full evidence chain (§ 11.5) is complete and drillable. **It is the direct measurement of SC-1 and of the capability's central promise.** A value below 100% means money has left against an incomplete chain |
| **Formula** | `Value disbursed with a complete chain ÷ total value disbursed`, per period, per payment path |
| **Source data** | OBJ-14, OBJ-15, OBJ-20, OBJ-21; the chains at § 11.5.1 and § 11.5.2; evidence tiers (§ 11.3) |
| **Frequency** | Monthly; per bill on exception |
| **Thresholds** | **Target 100%.** Any value < 100% is an exception, not a variance. < 99% escalates to E-L3 |
| **Owner** | Finance Controller |
| **Decision supported** | Whether the payment control environment may be relied upon; whether to suspend a payment path |
| **Related risks** | RSK-11, RSK-15, RSK-38, RSK-51 |
| **Related rules** | PEL-01, PEL-03, RBL-02, RBL-16, MSR-01 |

### KPI-02 — Potential Financial Leakage
| | |
|---|---|
| **Business meaning** | The enterprise's best quantified estimate of value at risk of escaping without entitlement, by leakage form L1–L7. **It is deliberately an estimate of exposure, not a record of loss** — a capability that can only measure confirmed loss is measuring history |
| **Formula** | `Σ (open reconciliation residues + unrecovered ageing balances + unresolved anomaly values + confirmed-but-unrecovered leakage)`, classified into L1…L7 |
| **Source data** | RI-1…RI-12 residues; XR-01…XR-24 variances; ageing from ADV-14, REC-16, RET-12; AUD-10 findings |
| **Frequency** | Monthly, with continuous accrual |
| **Thresholds** | Governed absolute and percentage-of-turnover thresholds by form; **L5 and L6 carry the tightest thresholds** because they are the largest in aggregate and least policed (§ 1.5) |
| **Owner** | Finance Controller; reported to CFO and Internal Audit |
| **Decision supported** | Where to direct audit effort; whether a control set requires structural change |
| **Related risks** | All; principally RSK-20, RSK-21, RSK-26, RSK-29 |
| **Related rules** | REC-16, FIN-12, AUD-06, AUD-08 |

### KPI-03 — Payment Readiness
| | |
|---|---|
| **Business meaning** | The proportion of pending payment value that would pass every hard gate **today**. It measures whether the enterprise is prevented from paying by its own incompleteness — which is a service failure to the counterparty, not a control success |
| **Formula** | `Value of pending bills and settlements passing G-1…G-8 ÷ total pending value` |
| **Source data** | OBJ-14, OBJ-15 in pre-approval states; the gates at § 6.6.1 |
| **Frequency** | Weekly |
| **Thresholds** | Governed. A **falling** value with stable volume indicates evidence discipline decay upstream |
| **Owner** | Accountant; escalated by Finance Controller |
| **Decision supported** | Whether payment delay is a control outcome or an administrative failure; where evidence discipline is degrading |
| **Related risks** | RSK-43, RSK-70, RSK-09 |
| **Related rules** | PEL-04, RBL-13, MSR-11, EVL-10 |

### KPI-04 — Labour Productivity
| | |
|---|---|
| **Business meaning** | Measured output per validated worker-day, by activity. **Bidirectional (KP-3):** collapse indicates ghost labour or misattribution; an implausible improvement indicates over-measurement |
| **Formula** | FM-31 `P = Q_output_measured ÷ E_effort_consumed`; variance to norm by FM-33 |
| **Source data** | OBJ-09 validated attendance; OBJ-12 verified measurement; OBJ-08 activity; OBJ-23 |
| **Frequency** | Monthly per activity; per period per gang |
| **Thresholds** | Governed variance band per activity. **Excursion in either direction triggers investigation** |
| **Owner** | Project Manager; norms owned by Finance Controller |
| **Decision supported** | Resourcing; estimating base; and — critically — whether to open a measurement investigation |
| **Related risks** | RSK-01, RSK-15, RSK-65, RSK-04 |
| **Related rules** | PRD-01…PRD-09, MSR-16 |

### KPI-05 — Contractor Performance Index
| | |
|---|---|
| **Business meaning** | A composite standing of a counterparty across delivery, evidence quality, financial discipline, and statutory conduct. **It exists to make CTL-10 and CLS-12 operable** — award decisions taken without it are taken blind |
| **Formula** | Weighted composite of: measurement revision rate (RV-4), bill return rate, recovery compliance, LD incidence, wage-evidence compliance (CTL-05), dispute rate, and exposure trend. **Weights are governed parameters** |
| **Source data** | OBJ-25 contractor account; OBJ-14 bill history; OBJ-26 exceptions; LAB-05 evidence |
| **Frequency** | Quarterly; on demand before any award |
| **Thresholds** | Governed banding; a band change is a reportable event to CAP-SCM (integration O-4) |
| **Owner** | Project Director; consumed by CAP-SCM |
| **Decision supported** | Award, re-award, empanelment, suspension, and security requirements |
| **Related risks** | RSK-48, RSK-52, RSK-67, RSK-32 |
| **Related rules** | CTL-10, CLS-12, WRK-09, WRK-12 |

### KPI-06 — Recovery Effectiveness
| | |
|---|---|
| **Business meaning** | The proportion of recovery due in a period that was actually deducted at source. **This is the direct measurement of LAW-8**, and the primary defence against the largest leakage class |
| **Formula** | `Value recovered in period ÷ value scheduled for recovery in period`; with a companion ageing profile of the unsatisfied remainder |
| **Source data** | OBJ-17 advances, OBJ-18 recoveries, OBJ-29 issued value; FM-09…FM-14 |
| **Frequency** | Monthly |
| **Thresholds** | **Target 100%.** Any shortfall must decompose into recorded deferrals (REC-10) or it is a control failure, not a variance |
| **Owner** | Accountant (§ 4.9 — this actor's explicit accountability) |
| **Decision supported** | Whether recovery discipline is holding; whether deferral is being used as silent waiver |
| **Related risks** | RSK-20, RSK-21, RSK-24, RSK-62, RSK-63 |
| **Related rules** | REC-04, REC-09, REC-10, RBL-07, ADV-06 |

### KPI-07 — Retention Exposure
| | |
|---|---|
| **Business meaning** | Total retention held as a liability, aged against release conditions. **§ 1.4.9 is the failure this indicator exists to prevent**: retention recorded as a saving and surfacing years later, unfunded |
| **Formula** | `Ret_held` across all instruments (FM-15, FM-16), aged by release date and by defect liability expiry |
| **Source data** | OBJ-19 retention; OBJ-04 instrument terms; OBJ-30 final accounts |
| **Frequency** | Monthly; mandatory at every period close |
| **Thresholds** | Governed ageing bands. **Retention past its release date is an exception** (RET-12), never a balance |
| **Owner** | Finance Controller; reported to CFO |
| **Decision supported** | Liability provisioning; release scheduling; whether release ownership exists at all |
| **Related risks** | RSK-29 |
| **Related rules** | RET-02, RET-08, RET-10, RET-12, CLS-07 |

### KPI-08 — Cash Flow Commitment
| | |
|---|---|
| **Business meaning** | Value the enterprise is contractually committed to disburse, by period, distinguishing **earned and approved** from **earned and pending** from **committed but unearned** (advances, materials on site). It informs CAP-TRE without crossing into it (§ 3.4.2) |
| **Formula** | `Σ approved-unpaid + Σ certified-unapproved + Σ advance commitments + Σ retention releases falling due` |
| **Source data** | OBJ-14, OBJ-15, OBJ-17, OBJ-19, OBJ-20 |
| **Frequency** | Weekly; forward-looking by period |
| **Thresholds** | Governed by treasury planning horizon. **A rising unearned component is the front-loading signal** (RSK-68) |
| **Owner** | CFO; computed by Accounts |
| **Decision supported** | Funding, timing, and whether exposure is running ahead of work in place |
| **Related risks** | RSK-68, RSK-69, RSK-67 |
| **Related rules** | PEL-05, ADV-10, RET-08, EVL-09 |

### KPI-09 — Settlement Cycle Time
| | |
|---|---|
| **Business meaning** | Elapsed time from measurement verification (or attendance validation) to confirmed disbursement. **It measures SC-13, and it is the counterparty's experience of the capability.** A control environment that is correct and unusably slow will be bypassed (DP-7) |
| **Formula** | Median and 90th-percentile days: `EVT-08 → EVT-15` for the contract path; `EVT-05 → EVT-15` for the labour path. Reported by stage |
| **Source data** | Enterprise events EVT-05, EVT-08, EVT-10, EVT-13, EVT-15 |
| **Frequency** | Monthly, by path and by counterparty |
| **Thresholds** | Governed committed limits. **The labour path carries the tighter limit** (LAB-10, PA-8) |
| **Owner** | Project Director; labour path owned by Accounts |
| **Decision supported** | Where the process, not the control, is the delay; whether DP-7 is holding |
| **Related risks** | RSK-43, RSK-33, RSK-70 |
| **Related rules** | LAB-10, DWG-05, WKS-11, MD-4 |

### KPI-10 — Risk Exposure Index
| | |
|---|---|
| **Business meaning** | A composite standing of the enterprise against its own risk register: how many Critical risks are live, how many controls are non-executing, how many exceptions are open, and how much residual sits in the High band |
| **Formula** | Weighted composite of: open Critical risk count, control non-execution count (FIN-15), open exception count by severity, and value in High-residual categories. **Weights governed** |
| **Source data** | Part 10 register; OBJ-26 exception register; control-health data (AUD-08) |
| **Frequency** | Monthly; immediately on any AE-1…AE-10 audit event |
| **Thresholds** | Governed. **Any Critical risk assessed as live for two consecutive periods escalates to E-L5** |
| **Owner** | Internal Auditor; reported to CEO/MD and the Board |
| **Decision supported** | Board-level assurance; whether the control environment is degrading (RSK-72) |
| **Related risks** | All, principally RSK-50, RSK-72 |
| **Related rules** | AUD-08, EXC-07, EXC-08, FIN-16 |

---

## 12.3 Operational and control indicators — KPI-11 … KPI-70

> Specified in the compact form. Every attribute of § 12.1.3 is present in every entry.

### 12.3.1 Workforce, deployment and attendance — KPI-11 … KPI-20

**KPI-11 — Registered Workforce Integrity**
- **Meaning.** Proportion of workers on site holding a durable enterprise identity. Below 100%, ghost labour is undetectable in principle. **Formula.** `workers with enterprise identity ÷ workers present`. **Source.** OBJ-01, OBJ-06, gate records. **Frequency.** Weekly.
- **Thresholds.** Target 100%; any shortfall is an exception. **Owner.** Site Supervisor. **Decision.** Whether site access control is binding.
- **Risks.** RSK-01, RSK-02, RSK-03. **Rules.** WRK-01, WRK-02, CTL-02, BRL-04.

**KPI-12 — Duplicate Attendance Rejection Rate**
- **Meaning.** Count and value of attendance records rejected by the single-occupancy test. **Bidirectional:** a rate of zero means either perfect discipline or a test that is not running (KP-5). **Formula.** `rejections ÷ validations attempted`. **Source.** OBJ-09 validation log. **Frequency.** Monthly.
- **Thresholds.** Governed band; **zero for two consecutive periods triggers a control-execution check**. **Owner.** Accountant. **Decision.** Whether LI-16 is enforced or merely stated.
- **Risks.** RSK-02, RSK-27. **Rules.** ATT-06, BRL-05, BRL-10.

**KPI-13 — Attendance Capture Timeliness**
- **Meaning.** Proportion of attendance captured at the point of occurrence rather than reconstructed. Measures whether primary evidence is primary. **Formula.** `records captured same-day ÷ total records`. **Source.** OBJ-09 capture timestamps (DI-4). **Frequency.** Weekly.
- **Thresholds.** Governed; a falling value degrades every downstream control. **Owner.** Site Supervisor. **Decision.** Where evidence discipline is decaying.
- **Risks.** RSK-09, RSK-59. **Rules.** ATT-01, ATT-10.

**KPI-14 — Independent Presence Corroboration**
- **Meaning.** Proportion of validated attendance corroborated by an independent signal — gate, induction, transport, biometric with independent time. **Formula.** `corroborated records ÷ validated records`. **Source.** OBJ-09; EC-5 digital evidence. **Frequency.** Monthly.
- **Thresholds.** Governed by site capability; **reported per site so that low-corroboration sites are visible**. **Owner.** Project Manager. **Decision.** Where physical verification (AUD-05) must be concentrated.
- **Risks.** RSK-01, RSK-10, RSK-54. **Rules.** ATT-18, AUD-05.

**KPI-15 — Deployment Strength Variance**
- **Meaning.** Actual deployed strength against sanctioned strength and budget. **Formula.** `(actual − sanctioned) ÷ sanctioned`, by project. **Source.** OBJ-06. **Frequency.** Monthly.
- **Thresholds.** Governed band; breach requires recorded approval. **Owner.** Project Manager. **Decision.** Whether labour cost is escaping through accumulation.
- **Risks.** RSK-25. **Rules.** CLB-02, DEP-02, DEP-08.

**KPI-16 — Assignment Coverage**
- **Meaning.** Proportion of validated attendance covered by an assignment issued **before** the work date. Measures limb (b) of LAW-2 as a live control rather than a formality. **Formula.** `attendance with prior assignment ÷ validated attendance`. **Source.** OBJ-07, OBJ-09. **Frequency.** Monthly.
- **Thresholds.** Target 100%; retrospective assignments counted separately. **Owner.** Site Supervisor. **Decision.** Whether assignment discipline is real.
- **Risks.** RSK-07, RSK-08. **Rules.** ASG-01, ATT-07, ASG-11.

**KPI-17 — Idle and Hindrance Proportion**
- **Meaning.** Payable non-working days as a proportion of payable days, with cause classification. **Formula.** `(idle + rain + hindrance days) ÷ payable days`. **Source.** OBJ-09, OBJ-28. **Frequency.** Monthly by site.
- **Thresholds.** Governed; **unclassified idle days are an exception at any volume**. **Owner.** Project Manager. **Decision.** Cost control, and the enterprise's LD defensibility (LD-2).
- **Risks.** RSK-36, RSK-26. **Rules.** CLB-05, ATT-13, ATT-12.

**KPI-18 — Overtime Authorisation Compliance**
- **Meaning.** Proportion of paid overtime authorised before it was worked. **Formula.** `pre-authorised OT hours ÷ paid OT hours`. **Source.** OBJ-09 overtime records. **Frequency.** Monthly.
- **Thresholds.** Target 100%; retrospective authorisations counted by authoriser. **Owner.** Project Manager. **Decision.** Whether overtime is a control or a channel.
- **Risks.** RSK-35. **Rules.** CLB-04, ATT-14, DWG-06.

**KPI-19 — Gang Composition Stability**
- **Meaning.** Rate of gang composition change and the proportion recorded on the date of change. **Bidirectional:** implausible stability suggests a composition not being maintained; extreme churn suggests identity control failure. **Formula.** `same-date-recorded changes ÷ total changes`. **Source.** OBJ-03. **Frequency.** Monthly.
- **Thresholds.** Governed. **Owner.** Site Supervisor. **Decision.** Whether gang records can support attribution (GNG-10).
- **Risks.** RSK-01, RSK-04. **Rules.** GNG-01, GNG-02, GNG-03.

**KPI-20 — Borrowed Labour Ledger Balance**
- **Meaning.** Enterprise-wide match between transfer debits and credits. **Formula.** `|Σ debits − Σ credits|` — target zero (RI-11). **Source.** OBJ-22. **Frequency.** Monthly.
- **Thresholds.** **Any non-zero residue is an exception.** **Owner.** Finance Controller. **Decision.** Whether transfers are being recorded on both sides.
- **Risks.** RSK-27, RSK-02. **Rules.** BRL-01, BRL-02, BRL-03, DEP-06.

### 12.3.2 Measurement and valuation — KPI-21 … KPI-30

**KPI-21 — Check Measurement Coverage**
- **Meaning.** Proportion of measured value subjected to the mandated check percentage. **Formula.** `value check-measured ÷ value recorded`, by value band. **Source.** OBJ-11, OBJ-12 check records. **Frequency.** Per bill cycle.
- **Thresholds.** Governed per band (§ 8.8); **any shortfall below the declared percentage is an exception**, never a resourcing note. **Owner.** Check Measurement Officer. **Decision.** Whether the primary contract-path defence is operating.
- **Risks.** RSK-15, RSK-53. **Rules.** MSR-06, CK-1…CK-7.

**KPI-22 — Measurement Reduction Rate**
- **Meaning.** Proportion and value of measurements reduced at check. **Bidirectional:** a rate of zero suggests the check is not independent; a high rate suggests measurement incompetence or inflation. **Formula.** `value reduced ÷ value checked`. **Source.** OBJ-12. **Frequency.** Monthly by measurer.
- **Thresholds.** Governed band both ways. **Owner.** Check Measurement Officer. **Decision.** Measurer competence review; investigation trigger.
- **Risks.** RSK-15, RSK-12, RSK-53. **Rules.** MSR-07, CK-5.

**KPI-23 — Measurement Revision Rate**
- **Meaning.** Revisions per hundred entries, by measurer and by contractor. The leading indicator of both incompetence and collusion (RV-4, DR-3). **Formula.** `revisions ÷ entries`. **Source.** OBJ-12 supersession chains. **Frequency.** Monthly.
- **Thresholds.** Governed; **outliers by measurer trigger AE-6**. **Owner.** Check Measurement Officer. **Decision.** Whether to open a measurement investigation.
- **Risks.** RSK-53, RSK-60. **Rules.** MSR-12, MBK-03.

**KPI-24 — Concealed Work Compliance**
- **Meaning.** Proportion of work that became concealed which was jointly measured beforehand. **Formula.** `concealed elements with prior joint measurement ÷ concealed elements`. **Source.** OBJ-12, OBJ-13, quality records. **Frequency.** Per bill cycle.
- **Thresholds.** **Target 100%; any shortfall is permanently unverifiable value.** **Owner.** Site Engineer. **Decision.** Whether to require destructive verification or accept and record the loss.
- **Risks.** RSK-66, RSK-15. **Rules.** MSR-09, JM-2, CK-2, MI-11.

**KPI-25 — Consumption Reconciliation Variance**
- **Meaning.** Theoretical against actual material consumption for measured output — cement, steel, bitumen, fuel. **Formula.** `(actual − theoretical) ÷ theoretical`, per material per period. **Source.** OBJ-12, OBJ-29, issue records. **Frequency.** Monthly.
- **Thresholds.** Governed tolerance; **breach blocks the bill** (MR-9). **Owner.** Site Engineer; verified by Accounts. **Decision.** Whether measured output is real and whether wastage norms are being abused.
- **Risks.** RSK-15, RSK-64, RSK-63. **Rules.** MSR-16, MR-1…MR-9.

**KPI-26 — Item Classification Drift**
- **Meaning.** Movement of measured quantity toward higher-rate items over time, against BOQ proportions. **Formula.** `period item-mix by value vs BOQ item-mix`, tracked as a trend. **Source.** OBJ-05, OBJ-12. **Frequency.** Quarterly.
- **Thresholds.** Governed drift band. **Owner.** Check Measurement Officer. **Decision.** Whether classification is drifting — silent L3/L7.
- **Risks.** RSK-12, RSK-57. **Rules.** MSR-03, AF-6.

**KPI-27 — Rounding Direction Balance**
- **Meaning.** Statistical balance of rounding direction by measurer. **Formula.** `proportion of roundings favouring the contractor`, expected ≈ 50%. **Source.** OBJ-12 dimension records. **Frequency.** Quarterly.
- **Thresholds.** Governed deviation band; **sustained bias is the L7 signature**. **Owner.** Internal Auditor. **Decision.** Whether to open a measurer investigation.
- **Risks.** RSK-57, RSK-53. **Rules.** MM-5, AF-4, FIN-04.

**KPI-28 — Measurement-to-Bill Interval**
- **Meaning.** Distribution of days between execution, measurement, and billing. Clustering immediately before bills is a fabrication signature. **Formula.** Median and distribution of `EVT-06 → EVT-07 → EVT-09`. **Source.** OBJ-12 dates (ME-6). **Frequency.** Monthly.
- **Thresholds.** Governed. **Owner.** Internal Auditor. **Decision.** Investigation targeting.
- **Risks.** RSK-11, RSK-09. **Rules.** MSR-17, AF-8.

**KPI-29 — Non-Scheduled Item Proportion**
- **Meaning.** Value executed under star rates as a proportion of certified value, and the proportion of star rates approved **before** execution. **Formula.** `star-rate value ÷ certified value`; `pre-approved star rates ÷ total star rates`. **Source.** OBJ-05, OBJ-24. **Frequency.** Quarterly.
- **Thresholds.** Governed; a rising trend means the contract no longer describes the work. **Owner.** Project Director. **Decision.** Whether pricing discipline has moved to the point of least leverage (SR-3).
- **Risks.** RSK-14, RSK-44, RSK-41. **Rules.** MSR-14, SR-1…SR-4, CTL-07.

**KPI-30 — Measurement Evidence Completeness**
- **Meaning.** Proportion of measurement entries carrying the artefacts their method requires, attached at the time of measurement. **Formula.** `entries with complete contemporaneous evidence ÷ entries`. **Source.** OBJ-13; § 11.3 tiers. **Frequency.** Per bill cycle.
- **Thresholds.** Governed; **absence where required is a deficiency, not a lower score** (EA-5). **Owner.** Site Engineer. **Decision.** Whether measured value would survive a dispute.
- **Risks.** RSK-58, RSK-66, RSK-61. **Rules.** MSR-11, EV-2, EV-3.

### 12.3.3 Billing, valuation and payment — KPI-31 … KPI-40

**KPI-31 — Bill Return Rate**
- **Meaning.** Bills returned or rejected, by cause and by counterparty. Measures evidence completeness at first submission (SC-15). **Formula.** `bills returned ÷ bills submitted`. **Source.** OBJ-14. **Frequency.** Monthly.
- **Thresholds.** Governed; a **rising** rate for one counterparty is a performance signal, a rising rate overall is a process signal. **Owner.** Accountant. **Decision.** Counterparty engagement; process correction.
- **Risks.** RSK-11, RSK-43. **Rules.** RBL-13, G-1…G-8.

**KPI-32 — Ceiling Utilisation**
- **Meaning.** Cumulative certified value against sanctioned value plus sanctioned variations, per instrument. **Formula.** `V_certified_cum ÷ (V_sanctioned + Σ V_variation_sanctioned)`. **Source.** OBJ-04, OBJ-24, OBJ-14. **Frequency.** Per bill; monthly portfolio view.
- **Thresholds.** Governed warning band below 100%; **100% is absolute** (LAW-9). **Owner.** Accountant; escalated to Finance Controller. **Decision.** Whether a variation is genuinely required, and whether it is being raised in time.
- **Risks.** RSK-19, RSK-44, RSK-68. **Rules.** RBL-05, EVL-04, FM-07.

**KPI-33 — Certified Value Against Physical Progress**
- **Meaning.** Certified value against measured physical progress. Divergence is the front-loading signal. **Formula.** `certified % ÷ measured progress %`, per instrument. **Source.** OBJ-12, OBJ-14; integration O-3. **Frequency.** Monthly.
- **Thresholds.** Governed divergence band. **Owner.** Project Director. **Decision.** Whether the enterprise is financing the contractor without a lending decision.
- **Risks.** RSK-68, RSK-69. **Rules.** EVL-09, MR-7.

**KPI-34 — Part-Rate Proportion**
- **Meaning.** Value certified at part rates as a proportion of certified value, and whether each part rate came from the bound stage schedule. **Formula.** `part-rate value ÷ certified value`. **Source.** OBJ-12, OBJ-14. **Frequency.** Monthly.
- **Thresholds.** Governed; **any part rate not from the bound schedule is an exception**. **Owner.** Accountant. **Decision.** Whether premature payment (L4) is entering through stage valuation.
- **Risks.** RSK-68. **Rules.** MSR-15, PT-1…PT-4, FM-03.

**KPI-35 — Rate Resolution Accuracy**
- **Meaning.** Proportion of billed lines valued at the rate version in force at the work date. **Formula.** `lines with correct work-date rate ÷ lines billed`, tested on audit sample and on every period spanning a rate change. **Source.** OBJ-05 versions, OBJ-12 dates. **Frequency.** Per bill cycle.
- **Thresholds.** Target 100%. **Owner.** Accountant. **Decision.** Whether silent rate leakage is occurring.
- **Risks.** RSK-14. **Rules.** RBL-06, FM-00, RR-4, WGR-04.

**KPI-36 — Arithmetic Reproduction Rate**
- **Meaning.** Proportion of bills whose independent recomputation reproduced the certified figure exactly. **Formula.** `bills reproducing exactly ÷ bills verified`. **Source.** OBJ-14 verification records. **Frequency.** Per bill cycle.
- **Thresholds.** **Target 100%; any failure is a defect** (SC-10). **Owner.** Accountant. **Decision.** Whether the computation layer can be relied on.
- **Risks.** RSK-24, RSK-51. **Rules.** RBL-09, FIN-01, FIN-03.

**KPI-37 — Separation Compliance**
- **Meaning.** Proportion of bills and settlements where originator, verifier, certifier and approver were four distinct actors. **Formula.** `compliant instruments ÷ total instruments`. **Source.** OBJ-27 approval records. **Frequency.** Monthly.
- **Thresholds.** **Target 100%; any breach is structural, not statistical.** **Owner.** Internal Auditor. **Decision.** Whether LAW-4 is enforced by construction.
- **Risks.** RSK-53, RSK-55, RSK-47. **Rules.** RBL-10, WKS-06, SOD-1…SOD-10.

**KPI-38 — Delegated Limit Compliance**
- **Meaning.** Approvals within limit and within delegation validity, plus detected splitting patterns. **Formula.** `compliant approvals ÷ approvals`; separately, count of values clustering below thresholds. **Source.** OBJ-27, delegation register. **Frequency.** Monthly.
- **Thresholds.** Target 100% compliance; **clustering count governed separately**. **Owner.** Finance Controller. **Decision.** Whether authority is real or routinely circumvented.
- **Risks.** RSK-40, RSK-55. **Rules.** RBL-11, RBL-12, PEL-09, SEC-05, AF-5.

**KPI-39 — Negative Position Incidence**
- **Meaning.** Count and value of negative net positions, and whether each was presented, posted, and pursued. **Formula.** `count and value of Net < 0`, with disposition. **Source.** OBJ-14, OBJ-25. **Frequency.** Monthly.
- **Thresholds.** **A negative that was not posted is an exception at any value.** **Owner.** Accountant. **Decision.** Whether over-certification is self-correcting or being suppressed.
- **Risks.** RSK-11, RSK-15. **Rules.** RBL-18, FIN-09, NEG-1…NEG-3.

**KPI-40 — Disbursement Reconciliation**
- **Meaning.** Instructed disbursements confirmed, failed, or unresolved within the defined window. **Formula.** `confirmed ÷ instructed`; ageing of unresolved. **Source.** OBJ-21. **Frequency.** Weekly.
- **Thresholds.** **Any instruction neither confirmed nor failed within the window is an exception** (LI-25). **Owner.** Accountant. **Decision.** Whether payment is reaching the payee, and whether failures reinstate correctly.
- **Risks.** RSK-46, RSK-38. **Rules.** RBL-15, LI-24, LI-25, WKS-10.

### 12.3.4 Recovery, advance and retention — KPI-41 … KPI-50

**KPI-41 — Advance Outstanding and Ageing**
- **Meaning.** Total advance outstanding by contractor, type, and age. **Formula.** `Σ Adv_outstanding`, aged. **Source.** OBJ-17. **Frequency.** Monthly.
- **Thresholds.** Governed ageing bands; **breach escalates automatically** (ADV-14). **Owner.** Accountant. **Decision.** Recovery acceleration; award restriction.
- **Risks.** RSK-20, RSK-67. **Rules.** ADV-10, ADV-14, RI-3.

**KPI-42 — Advance Recovery Compliance**
- **Meaning.** Advance recovery applied against recovery due, per bill. **Formula.** `Rec_adv applied ÷ Rec_adv due`. **Source.** OBJ-17, OBJ-14. **Frequency.** Per bill.
- **Thresholds.** **Target 100%; shortfall must decompose into recorded deferrals or it is a control failure.** **Owner.** Accountant. **Decision.** Whether deferral is functioning as silent waiver.
- **Risks.** RSK-20, RSK-28. **Rules.** ADV-06, ADV-07, REC-10.

**KPI-43 — Advance Security Currency**
- **Meaning.** Proportion of secured advances whose security is live and at least equal to the outstanding. **Formula.** `advances with valid sufficient security ÷ secured advances`. **Source.** OBJ-17, security register. **Frequency.** Monthly, with expiry alerting.
- **Thresholds.** **Target 100%; an expired security on a live advance is an exception.** **Owner.** Finance Controller. **Decision.** Whether the enterprise's belief about its protection is true.
- **Risks.** RSK-23, RSK-67. **Rules.** ADV-04, ADV-05.

**KPI-44 — Issued Value Recovery**
- **Meaning.** Value of materials, plant, fuel, power, water and accommodation issued against value recovered and outstanding. **Formula.** RI-4 components with residue. **Source.** OBJ-29. **Frequency.** Monthly.
- **Thresholds.** **Zero unexplained residue.** **Owner.** Accountant. **Decision.** Whether L5 is being closed at source.
- **Risks.** RSK-21, RSK-62, RSK-63, RSK-64. **Rules.** CTL-09, REC-01, REC-15, RI-4.

**KPI-45 — Automatic Recovery Creation**
- **Meaning.** Proportion of issue events that created a recovery obligation automatically at issue. **Formula.** `issues with obligation raised at issue ÷ issue events`. **Source.** OBJ-29. **Frequency.** Monthly.
- **Thresholds.** **Target 100%.** Anything less means recovery depends on memory, which fails within one personnel change (LA-4). **Owner.** Store/plant officer; verified by Accounts. **Decision.** Whether LI-14 is structural.
- **Risks.** RSK-21, RSK-62. **Rules.** REC-01, LI-14.

**KPI-46 — Recovery Deferral Frequency**
- **Meaning.** Deferrals by authoriser, counterparty, and consecutive-period count. **Formula.** `deferral count and value`, with consecutive-period tracking. **Source.** OBJ-26. **Frequency.** Monthly.
- **Thresholds.** Governed; **deferral beyond the bounded number of periods escalates automatically**. **Owner.** Finance Controller. **Decision.** Whether deferral has become indefinite waiver.
- **Risks.** RSK-20, RSK-28. **Rules.** REC-10, EXC-06, LI-15.

**KPI-47 — Waiver and Write-Off Incidence**
- **Meaning.** Value waived or written off, by authoriser, with root cause. **Formula.** `Σ waived + Σ written off`, by authoriser. **Source.** OBJ-18, OBJ-17, OBJ-26. **Frequency.** Quarterly; each instance reported.
- **Thresholds.** Governed; **any waiver by the obligation's originator is an exception** (SOD-8). **Owner.** CFO. **Decision.** Whether losses are being recognised or quietly disposed of.
- **Risks.** RSK-28, RSK-20. **Rules.** REC-12, ADV-12, ADV-13.

**KPI-48 — Liquidated Damages Realisation**
- **Meaning.** LD accrued against LD levied and LD formally waived. **Formula.** RI-10 components. **Source.** OBJ-04, programme data, OBJ-28. **Frequency.** Monthly per instrument.
- **Thresholds.** **`LD_accrued − LD_levied − LD_waived` must be zero.** A non-zero residue is L6 accumulating silently. **Owner.** Finance Controller. **Decision.** Whether contractual entitlement is being abandoned by inaction.
- **Risks.** RSK-26, RSK-45. **Rules.** REC-08, CLS-05, RI-10, LD-1.

**KPI-49 — Retention Release Timeliness**
- **Meaning.** Retention released within its condition window against retention past due for release. **Formula.** `released on time ÷ due for release`; ageing of overdue. **Source.** OBJ-19. **Frequency.** Monthly.
- **Thresholds.** **Retention past its release date is an exception** (RET-12). **Owner.** Finance Controller. **Decision.** Whether release has an owner at all — the characteristic § 1.4.9 failure.
- **Risks.** RSK-29. **Rules.** RET-04, RET-10, RET-12.

**KPI-50 — Early Retention Release Incidence**
- **Meaning.** Retention released before its conditions were satisfied, by authoriser and reason. **Formula.** `count and value of early releases`. **Source.** OBJ-19, OBJ-26. **Frequency.** Quarterly; each instance reported.
- **Thresholds.** **Target zero.** **Owner.** Finance Controller. **Decision.** Whether the enterprise's residual security is being surrendered under cash pressure.
- **Risks.** RSK-29, RSK-43. **Rules.** RET-05, RET-06.

### 12.3.5 Statutory, wage and worker indicators — KPI-51 … KPI-57

**KPI-51 — Statutory Minimum Compliance**
- **Meaning.** Workers whose effective receipt met or exceeded the statutory minimum for trade, grade, region and date. **Formula.** `workers passing FM-25 ÷ workers settled`. **Source.** OBJ-16, statutory parameters. **Frequency.** Every settlement period.
- **Thresholds.** **Target 100%; a single failure blocks that settlement** (WKS-04). **Owner.** Accountant; escalated to Finance Controller. **Decision.** Whether the enterprise is compliant per worker, not on average.
- **Risks.** RSK-30, RSK-37. **Rules.** LAB-06, LAB-07, MW-1, MW-2.

**KPI-52 — Wage Payment Timeliness**
- **Meaning.** Settlements disbursed within the statutory or contractual period. **Formula.** `settlements paid within period ÷ settlements due`. **Source.** OBJ-15, OBJ-21. **Frequency.** Every period.
- **Thresholds.** **Target 100%; the labour path carries the tightest limit** (PA-8). **Owner.** Accountant. **Decision.** Whether wage delay is creating advance dependency and grievance.
- **Risks.** RSK-33, RSK-32. **Rules.** LAB-10, DWG-05.

**KPI-53 — Worker Acknowledgement Completeness**
- **Meaning.** Proportion of wage value acknowledged by the named worker, including intermediated payment. **Formula.** `value acknowledged per named worker ÷ wage value disbursed`. **Source.** OBJ-16, OBJ-21; RI-8. **Frequency.** Every period.
- **Thresholds.** **Target 100%.** Below it, the enterprise cannot demonstrate any individual was paid. **Owner.** Accountant. **Decision.** Whether principal-employer exposure is discharged or merely assumed.
- **Risks.** RSK-05, RSK-34, RSK-32. **Rules.** LAB-08, BRL-06, BRL-09, RI-8.

**KPI-54 — Intermediary Wage Evidence Compliance**
- **Meaning.** Proportion of intermediary settlements preceded by evidence that the prior period's workers were paid. **Formula.** `settlements with prior-period evidence ÷ intermediary settlements`. **Source.** OBJ-16, contractor wage records. **Frequency.** Every period.
- **Thresholds.** **Target 100%; grace instances counted separately** (CTL-05). **Owner.** Project Manager. **Decision.** Whether to pay workers directly and recover (CTL-06).
- **Risks.** RSK-32, RSK-05, RSK-67. **Rules.** CTL-05, LAB-05, BRL-09.

**KPI-55 — Lawful Deduction Compliance**
- **Meaning.** Proportion of settlements where total worker deductions stayed within the statutory ceiling. **Formula.** `settlements within FM-27 ceiling ÷ settlements`. **Source.** OBJ-16. **Frequency.** Every period.
- **Thresholds.** **Target 100%.** **Owner.** Accountant. **Decision.** Whether recovery discipline has become a statutory offence.
- **Risks.** RSK-37, RSK-30. **Rules.** LAB-11, REC-13, ADV-11, FM-27.

**KPI-56 — Unsettled Entitlement Ageing**
- **Meaning.** Validated attendance not yet settled, by age and by site. **Formula.** `Σ validated-unsettled worker-days`, aged. **Source.** OBJ-09, OBJ-15. **Frequency.** Every period.
- **Thresholds.** Governed ageing bands; **escalates automatically** (WKS-11). **Owner.** Accountant. **Decision.** Whether entitlement is being stranded as the workforce disperses.
- **Risks.** RSK-33. **Rules.** WKS-11, LAB-13, WRK-14, FC-10.

**KPI-57 — Statutory Register Consistency**
- **Meaning.** Agreement between statutory registers and the operational records that drove payment. **Formula.** `register entries reconciling to attendance and wage records ÷ register entries`. **Source.** OBJ-09, OBJ-16, statutory registers. **Frequency.** Per statutory period.
- **Thresholds.** **Target 100%; divergence is what an inspector looks for.** **Owner.** Accountant; verified by Internal Audit. **Decision.** Inspection readiness.
- **Risks.** RSK-49, RSK-30. **Rules.** LAB-04, AUD-11.

### 12.3.6 Control, governance and audit indicators — KPI-58 … KPI-70

**KPI-58 — Control Execution Rate**
- **Meaning.** Proportion of expected control executions that actually ran and reported. **Formula.** `controls executed ÷ controls expected`. **Source.** Control-execution log (FIN-15). **Frequency.** Monthly.
- **Thresholds.** **Target 100%; a non-executing control is indistinguishable from an absent one.** **Owner.** Internal Auditor. **Decision.** Whether the control environment exists in operation, not only on paper.
- **Risks.** RSK-50, RSK-72, RSK-24. **Rules.** FIN-15, FIN-16, AUD-08.

**KPI-59 — Reconciliation Identity Status**
- **Meaning.** Status of RI-1…RI-12 and XR-01…XR-24: computed, passing, in breach, or not computable. **Formula.** status vector with residue values. **Source.** § 7.12, § 11.6. **Frequency.** Continuous; mandatory at period close.
- **Thresholds.** **Any breach raises an exception immediately** (AUD-06); **any "not computable" is itself a finding** (KP-5). **Owner.** Finance Controller. **Decision.** Whether to block dependent payments.
- **Risks.** RSK-24, RSK-50. **Rules.** FIN-12, AUD-06, RI-0.

**KPI-60 — Exception Volume by Authoriser**
- **Meaning.** Count and value of exceptions authorised, per authoriser, per type, per period. **The direct measurement of LAW-12.** **Formula.** `count and value grouped by authoriser and type`. **Source.** OBJ-26. **Frequency.** Monthly.
- **Thresholds.** Governed per type; **frequency breach escalates automatically** (EXC-07). **Owner.** Internal Auditor. **Decision.** Whether an exception has become the process (LA-5).
- **Risks.** RSK-42, RSK-72, RSK-47. **Rules.** EXC-07, EXC-08, OVR-07, LI-30.

**KPI-61 — Override Incidence**
- **Meaning.** Manual overrides by actor, type, and whether time-boxed and expired as recorded. **Formula.** `count, value, and expiry compliance`. **Source.** OBJ-26. **Frequency.** Monthly.
- **Thresholds.** Governed; **any override by a beneficiary is an exception at any volume** (OVR-10). **Owner.** Finance Controller. **Decision.** Whether override rights should be withdrawn (OVR-09).
- **Risks.** RSK-47, RSK-42. **Rules.** OVR-02, OVR-04, OVR-08, OVR-10.

**KPI-62 — Backdating Incidence**
- **Meaning.** Records whose effective date precedes their creation date, by actor and object type. **Formula.** `count by actor`, with value where financial. **Source.** All evidentiary and financial objects. **Frequency.** Monthly.
- **Thresholds.** Governed; **concentration by actor is an investigation trigger**. **Owner.** Internal Auditor. **Decision.** Whether evidence is being reconstructed rather than captured.
- **Risks.** RSK-07, RSK-09, RSK-38, RSK-59. **Rules.** OVR-06, ATT-01, ASG-01.

**KPI-63 — Evidence Confidence Profile**
- **Meaning.** Distribution of disbursed value by the confidence level of the evidence supporting it (§ 11.4). **Formula.** `value by High / Medium / Low / Unsupported`. **Source.** § 11.3 tiers on all supporting evidence. **Frequency.** Monthly.
- **Thresholds.** **No value may rest on Unsupported evidence; Low requires a recorded strengthening plan.** **Owner.** Internal Auditor. **Decision.** Whether the enterprise could defend its payments in dispute or inspection.
- **Risks.** RSK-58, RSK-61, RSK-66. **Rules.** CL-1…CL-5, PEL-01.

**KPI-64 — Audit Finding Closure**
- **Meaning.** Findings closed with attribution, quantification, recovery and root cause — the full AUD-10 treatment — against findings closed on correction alone. **Formula.** `fully treated ÷ closed`. **Source.** Audit records. **Frequency.** Quarterly.
- **Thresholds.** **Target 100%; correction without root cause guarantees recurrence** (DP-2). **Owner.** Internal Auditor. **Decision.** Whether the enterprise is learning or merely repairing.
- **Risks.** RSK-72. **Rules.** AUD-10, EXC-10.

**KPI-65 — Physical Verification Coverage**
- **Meaning.** Unannounced site verifications performed against those scheduled, and identity-level variance found. **Formula.** `verifications performed ÷ scheduled`; plus variance rate. **Source.** Audit records; OBJ-06, OBJ-09. **Frequency.** Quarterly per active site.
- **Thresholds.** Governed minimum per site; **announced verification does not count**. **Owner.** Internal Auditor. **Decision.** Whether the only control ghost labour cannot survive is actually being run.
- **Risks.** RSK-01, RSK-03, RSK-54. **Rules.** AUD-05, WRK-13, GNG-08.

**KPI-66 — Dispute Ageing**
- **Meaning.** Open measurement and recovery disputes by age and value. **Formula.** `count and value`, aged, against the MD-4 clock. **Source.** OBJ-12, OBJ-18. **Frequency.** Monthly.
- **Thresholds.** Governed; **breach of the clock escalates**. **Owner.** Project Director. **Decision.** Whether disputes are being resolved while still resolvable (MD-2).
- **Risks.** RSK-70, RSK-45. **Rules.** MD-1…MD-4, REC-11, MSR-18.

**KPI-67 — Unbilled Verified Value**
- **Meaning.** Verified measurement not yet billed, by age and reason. Contractor detriment and hidden enterprise liability simultaneously. **Formula.** `Σ verified-unbilled value`, aged. **Source.** OBJ-12, OBJ-14; RI-12. **Frequency.** Monthly.
- **Thresholds.** Governed ageing; **carrying without a recorded reason is an exception**. **Owner.** Accountant. **Decision.** Whether the enterprise's liability is complete.
- **Risks.** RSK-70. **Rules.** EVL-10, RI-12, CLS-10.

**KPI-68 — Closure Reconciliation Completeness**
- **Meaning.** Proportion of closures where FC-1…FC-10 all reconciled to zero unexplained residue **before** final payment. **Formula.** `closures with all ten reconciled ÷ closures`. **Source.** OBJ-30. **Frequency.** Per closure.
- **Thresholds.** **Target 100%; closure without them is where control collapses** (§ 1.4.12). **Owner.** Finance Controller. **Decision.** Whether the final account may be settled.
- **Risks.** RSK-22, RSK-45, RSK-26. **Rules.** CLS-02…CLS-11, FC-1…FC-10.

**KPI-69 — Negotiated Settlement Variance**
- **Meaning.** Value of final settlements departing from the computed final account, with authority and reason. **Formula.** `Σ |settlement − computed|`, by authoriser. **Source.** OBJ-30, OBJ-26. **Frequency.** Per closure; quarterly aggregate.
- **Thresholds.** Governed; **every instance is reported individually** to CEO/MD. **Owner.** CFO. **Decision.** What negotiation at closure is actually costing the enterprise.
- **Risks.** RSK-45, RSK-26. **Rules.** CLS-13, LI-26, PEL-06.

**KPI-70 — Evidence Retention Assurance**
- **Meaning.** Proportion of retrieval tests that produced complete, legible, reconstructible evidence from closed projects. **Formula.** `successful retrievals ÷ retrieval tests`. **Source.** Archived evidence; custody records. **Frequency.** Half-yearly.
- **Thresholds.** **Target 100%; retention assumed from policy is not retention** (EP-4). **Owner.** Internal Auditor. **Decision.** Whether the enterprise can defend a claim after the project team has gone (objective O-9).
- **Risks.** RSK-61, RSK-71. **Rules.** AUD-12, EP-1…EP-7, CLS-14.

---

## 12.4 Role catalogues

> **Twelve views over one catalogue.** There are no role-specific KPIs, only role-specific
> *attention*. A capability with twelve separate indicator sets has twelve versions of the truth
> (CP-4). Where a role owns an indicator, it is shown **in bold**.

| Role | Indicators |
|---|---|
| **Executive Board** | KPI-01, 02, **10**, 05, 07, 08, 47, 60, 64, 68, 69 |
| **CEO / Managing Director** | KPI-01, 02, 05, 08, **10**, 45, 47, 60, 64, 68, 69 |
| **CFO** | **KPI-08**, **47**, **69**, 01, 02, 06, 07, 32, 39, 41, 48, 51, 68 |
| **Finance Controller** | **KPI-01**, **02**, **07**, **20**, **38**, **43**, **46**, **48**, **49**, **50**, **59**, **61**, **68**, 06, 32, 36, 42, 51 |
| **Project Director** | **KPI-05**, **09**, **29**, **33**, **66**, 02, 04, 15, 32, 44, 54 |
| **Project Manager** | **KPI-04**, **14**, **15**, **17**, **18**, **54**, 09, 16, 19, 21, 25, 31, 41, 56, 65 |
| **Site Engineer** | **KPI-24**, **25**, **30**, 04, 21, 22, 23, 26, 27, 28, 29, 34, 35 |
| **Site Supervisor** | **KPI-11**, **13**, **16**, **19**, 12, 14, 17, 18, 53, 56, 65 |
| **HR (CAP-HCM interface)** | KPI-11, 51, 52, 53, 55, 56, 57, 19, 37 |
| **Accounts** | **KPI-03**, **06**, **12**, **31**, **32**, **34**, **35**, **36**, **39**, **40**, **41**, **42**, **44**, **51**, **52**, **53**, **55**, **56**, **57**, **67**, 45, 46 |
| **Auditor (Internal)** | **KPI-10**, **27**, **28**, **37**, **58**, **60**, **62**, **63**, **64**, **65**, **70**, and read access to every other indicator |
| **Contractor (counterparty view)** | KPI-31, 32, 49, 66, 67 — **restricted to the contractor's own instruments** (CP-10, SEC-04) |

### 12.4.1 Constitutional constraints on role catalogues

**RC-1 — The contractor's view is an entitlement, not a courtesy** (CP-10, GP-19, RBL-17). It is
restricted to that contractor's own instruments (SEC-04) and includes the derivation of their own
entitlement, their retention position, and their open disputes.

**RC-2 — The Internal Auditor reads everything and owns the control indicators** (AP-1, SOD-5). The
auditor appears in no role catalogue as an operational owner of a payment indicator, because an
actor who can cause a transition cannot independently audit it.

**RC-3 — No role may see an indicator computed on a different basis from any other role's.** Views
differ; definitions do not (CP-4, KP-2).

**RC-4 — Ownership is singular** (KP-6). Where a table above shows an indicator in bold for two
roles, the more senior holds accountability and the other holds operational responsibility; the
catalogue entry at § 12.2 or § 12.3 is authoritative.

---

> **Part 12 complete — 70 indicators, twelve role catalogues, every indicator traced to at least one
> rule and one risk.**

---

# PART 13 — ENTERPRISE DASHBOARD CATALOGUE

## 13.1 Purpose and constitutional standing

> **This Part is information architecture, not interface design.** It states what each decision-maker
> must be able to see, in what order of priority, with what drill paths, and what must interrupt
> them. It states nothing about how any of it is drawn.

A dashboard in this capability is a **standing information position** — the set of facts an
accountable actor must hold in view to discharge the accountability Part 4 assigns them. It is
constitutional because **an actor who is accountable for an outcome and cannot see it has authority
without accountability**, which § 4 declares produces leakage.

### 13.1.1 What this Part does not specify

**DB-0 — Explicitly out of scope, by mandate:** screen layout, wireframes, navigation, visual design,
colour, chart type, device, technology, refresh mechanism, and interaction pattern. **CP-12 governs:
the business architecture is sovereign, and no rule here exists because a technology made it
convenient.** An implementation may realise these positions as screens, printed packs, briefings,
or notifications; the constitution is indifferent, provided the information priority is preserved.

### 13.1.2 Constitutional constraints on all dashboards

**DB-1 — Information priority is constitutional, not editorial.** Each catalogue entry states its
priority order. **Money at risk outranks money moving; money moving outranks activity; activity
outranks volume.** An implementation that inverts this has changed what the enterprise attends to.

**DB-2 — Every displayed figure is drillable to primary evidence** (CP-7, GP-11, RBL-16). A figure
that cannot be decomposed on demand does not belong on a dashboard, because it invites a decision
that cannot be justified.

**DB-3 — A dashboard never becomes an approval surface.** Observation and authorisation are separate
acts by separate rules (LAW-4, § 6.14). **Presenting an approval action beside an indicator that
argues for it is a control weakness**, not a convenience.

**DB-4 — Alerts interrupt; indicators inform.** An alert category exists only where the constitution
requires an interruption: a hard-gate failure, a reconciliation breach, an exception threshold, a
statutory failure, or a control non-execution. Everything else is an indicator.

**DB-5 — No dashboard may show a figure computed on a basis other than its catalogue definition**
(CP-4, KP-2). Twelve dashboards, one set of definitions.

**DB-6 — Absence must be visible.** Where an indicator could not be computed, the position shows
*not computed*, never a blank and never a zero (KP-5, CP-11, FIN-15).

**DB-7 — Counterparty positions are entitlements** (CP-10). The contractor position is restricted to
that contractor's own instruments (SEC-04) and must present the derivation of their own entitlement.

**DB-8 — Escalation is a property of the information, not of the viewer.** Where an alert category
requires escalation under § 11.10.4, it escalates whether or not anyone is looking (GP-14).

### 13.1.3 Catalogue structure

Positions carry identifiers **DSH-01 … DSH-14**, permanent and never renumbered. Each is specified
as: **Purpose · Audience · Information priority · Decision support · Drill-down paths · Alert
categories · Escalation**.

---

## 13.2 Dashboard catalogue

### DSH-01 — Constitutional Health Position
| | |
|---|---|
| **Purpose** | To answer the single question the capability exists to answer: is every rupee released earned, verified, and recoverable? |
| **Audience** | Executive Board; CEO/MD; CFO |
| **Information priority** | 1 Verified Payment Accuracy (KPI-01) · 2 Potential Financial Leakage by form (KPI-02) · 3 Risk Exposure Index (KPI-10) · 4 Control Execution Rate (KPI-58) · 5 Exception volume by authoriser (KPI-60) · 6 Negotiated settlement variance (KPI-69) |
| **Decision support** | Whether the control environment may be relied upon; whether to commission investigation; whether a payment path must be suspended |
| **Drill-down paths** | KPI-01 → payment path → instrument → bill → measurement → evidence artefact. KPI-02 → leakage form → risk → open residues → source reconciliation |
| **Alert categories** | Verified Payment Accuracy below 100% · any Critical risk live two consecutive periods · any control non-executing · any reconciliation identity in breach |
| **Escalation** | E-L5 on any alert; Board notification on Critical risk persistence |

### DSH-02 — Financial Integrity Position
| | |
|---|---|
| **Purpose** | To hold the enterprise's money-path integrity in one view: what is owed, what is held, what is at risk, and what could not be computed |
| **Audience** | CFO; Finance Controller |
| **Information priority** | 1 Reconciliation identity status (KPI-59) · 2 Recovery Effectiveness (KPI-06) · 3 Retention Exposure with ageing (KPI-07) · 4 Advance outstanding and ageing (KPI-41) · 5 Ceiling utilisation across the portfolio (KPI-32) · 6 Cash Flow Commitment (KPI-08) · 7 Negative position incidence (KPI-39) |
| **Decision support** | Whether to block dependent payments; where to accelerate recovery; liability provisioning; funding posture |
| **Drill-down paths** | Identity → residue → contributing objects → source transactions. Recovery → contractor → obligation → issue event. Retention → instrument → release condition → defect liability expiry |
| **Alert categories** | Reconciliation breach · recovery shortfall not decomposing into recorded deferrals · retention past release date · advance security lapsed · negative position not posted |
| **Escalation** | E-L3 immediate, payment blocked where the identity governs it (AUD-06) |

### DSH-03 — Leakage and Risk Position
| | |
|---|---|
| **Purpose** | To make the seven leakage forms and the 72-risk register continuously visible rather than periodically reviewed |
| **Audience** | Internal Auditor; Finance Controller; CEO/MD |
| **Information priority** | 1 Open Critical risks · 2 Potential leakage by form L1–L7 (KPI-02) · 3 Control execution and suppression (KPI-58) · 4 Backdating incidence by actor (KPI-62) · 5 Override and exception concentration (KPI-60, KPI-61) · 6 Evidence confidence profile (KPI-63) |
| **Decision support** | Where to direct audit effort; whether a control requires structural rather than procedural enforcement (§ 10.6) |
| **Drill-down paths** | Leakage form → risk → early warning indicator → source records → actors. Risk → controls → execution status → last demonstrated run |
| **Alert categories** | Control suppression or configuration change · exception frequency threshold · favourable productivity outlier · measurement revision-rate outlier · duplicate-attendance rejection rate falling to zero |
| **Escalation** | E-L4 on suspected suppression or collusion indicators; evidence preserved before any notification (IV-2) |

### DSH-04 — Contract Portfolio Position
| | |
|---|---|
| **Purpose** | To hold every live engagement's financial standing: ceiling, exposure, recovery, retention, disputes |
| **Audience** | Project Director; Finance Controller; CAP-SCM at award |
| **Information priority** | 1 Ceiling utilisation (KPI-32) · 2 Contractor exposure (FM-34) · 3 Contractor Performance Index (KPI-05) · 4 Certified value against physical progress (KPI-33) · 5 Cumulative variation proportion · 6 Dispute ageing (KPI-66) |
| **Decision support** | Award and re-award; whether a variation is genuinely required; whether exposure warrants security or suspension |
| **Drill-down paths** | Instrument → certified value → bills → measurements. Instrument → exposure → advances, issued value, damages. Instrument → variations → instruction records |
| **Alert categories** | Ceiling utilisation above warning band · exposure above threshold · contractor distress indicators (RSK-67) · variation proportion above threshold |
| **Escalation** | E-L3 on distress indicators; award decisions blocked without the exposure figure (CTL-10) |

### DSH-05 — Payment Readiness Position
| | |
|---|---|
| **Purpose** | To distinguish payment delayed **by control** from payment delayed **by administration** — the second is a service failure, not a control success |
| **Audience** | Accounts; Project Manager; Finance Controller |
| **Information priority** | 1 Payment Readiness (KPI-03) · 2 Bills by gate-failure cause (G-1…G-8) · 3 Settlement cycle time by stage (KPI-09) · 4 Bill return rate by cause (KPI-31) · 5 Unbilled verified value ageing (KPI-67) |
| **Decision support** | Where evidence discipline is degrading; where process, not control, is the delay; whether DP-7 (honest path is the fast path) is holding |
| **Drill-down paths** | Pending value → failing gate → missing element → responsible actor. Cycle time → stage → instrument → counterparty |
| **Alert categories** | Bills aged beyond the committed limit · unbilled verified value beyond ageing band · rising return rate for one cause |
| **Escalation** | E-L2 before the dependent payment; E-L3 where a pattern persists |

### DSH-06 — Workforce Integrity Position
| | |
|---|---|
| **Purpose** | To make the labour path's primary controls continuously observable: identity, single occupancy, capture timeliness, corroboration |
| **Audience** | Project Manager; Site Supervisor; Internal Auditor |
| **Information priority** | 1 Registered workforce integrity (KPI-11) · 2 Duplicate attendance rejections (KPI-12) · 3 Independent presence corroboration (KPI-14) · 4 Capture timeliness (KPI-13) · 5 Assignment coverage (KPI-16) · 6 Physical verification coverage and variance (KPI-65) |
| **Decision support** | Where to concentrate unannounced verification; whether site access control is binding; whether LI-16 is enforced or merely stated |
| **Drill-down paths** | Site → gang → worker → attendance record → capture method → corroborating signal. Rejection → both source records → both intermediaries |
| **Alert categories** | Unregistered worker on site · duplicate rejection rate at zero for two periods · attendance captured outside site geometry · corroboration falling below band |
| **Escalation** | E-L2 routine; E-L4 where supervisor–mate collusion is indicated (RSK-54) |

### DSH-07 — Measurement Integrity Position
| | |
|---|---|
| **Purpose** | To observe the contract path's primary defence: check coverage, reduction and revision behaviour, concealed-work compliance, and consumption reconciliation |
| **Audience** | Check Measurement Officer; Site Engineer; Project Director; Internal Auditor |
| **Information priority** | 1 Concealed work compliance (KPI-24) · 2 Check measurement coverage (KPI-21) · 3 Consumption reconciliation variance (KPI-25) · 4 Measurement revision rate by measurer (KPI-23) · 5 Reduction rate (KPI-22) · 6 Classification drift (KPI-26) · 7 Rounding direction balance (KPI-27) |
| **Decision support** | Whether measured value would survive dispute; whether to escalate a sample to the population (CK-5); whether to open a measurer investigation |
| **Drill-down paths** | Measurement → check record → checker → sample basis. Variance → material → theoretical basis → issue records. Revision → supersession chain → reasons → measurer |
| **Alert categories** | Concealed work billed without prior joint measurement · consumption variance beyond tolerance · revision-rate outlier · rounding bias beyond deviation band |
| **Escalation** | Bill blocked on consumption variance (MR-9); E-L4 where collusion indicators coincide (AF-7) |

### DSH-08 — Recovery and Exposure Position
| | |
|---|---|
| **Purpose** | To keep L5 and L6 visible — the largest leakage classes and the least policed, because nothing appears to go wrong |
| **Audience** | Accounts; Finance Controller |
| **Information priority** | 1 Recovery Effectiveness (KPI-06) · 2 Issued value recovery with residue (KPI-44) · 3 Advance outstanding and ageing (KPI-41) · 4 Automatic recovery creation rate (KPI-45) · 5 Deferral frequency (KPI-46) · 6 LD realisation (KPI-48) · 7 Waiver and write-off incidence (KPI-47) |
| **Decision support** | Whether recovery discipline holds; whether deferral has become silent waiver; whether LD is being abandoned by inaction |
| **Drill-down paths** | Recovery → obligation → issue event → valuation basis. Deferral → authoriser → consecutive periods → reason. LD → instrument → delay position → hindrance records |
| **Alert categories** | Recovery shortfall · deferral beyond bounded periods · automatic creation rate below 100% · LD residue non-zero · waiver by the obligation's originator |
| **Escalation** | E-L3; waiver instances reported individually to CFO |

### DSH-09 — Statutory and Worker Position
| | |
|---|---|
| **Purpose** | To hold the enterprise's obligations to the workforce in view, including for workers it does not pay directly |
| **Audience** | Accounts; HR; Project Manager; Finance Controller |
| **Information priority** | 1 Statutory minimum compliance (KPI-51) · 2 Worker acknowledgement completeness (KPI-53) · 3 Intermediary wage evidence compliance (KPI-54) · 4 Wage payment timeliness (KPI-52) · 5 Lawful deduction compliance (KPI-55) · 6 Unsettled entitlement ageing (KPI-56) · 7 Statutory register consistency (KPI-57) |
| **Decision support** | Whether to pay workers directly and recover (CTL-06); inspection readiness; whether entitlement is being stranded |
| **Drill-down paths** | Worker → wage card → attendance → rate authority → statutory minimum at date. Intermediary → workers supplied → acknowledgements → prior-period evidence |
| **Alert categories** | Any minimum-wage failure · missing prior-period wage evidence · acknowledgement gap · deduction ceiling breach · unsettled entitlement beyond ageing band |
| **Escalation** | Settlement blocked on minimum-wage failure (WKS-04); **worker grievance escalates on its own path** (ES-3) |

### DSH-10 — Site Operations Position
| | |
|---|---|
| **Purpose** | To give the site the facts it is accountable for, at the granularity it can act on |
| **Audience** | Site Supervisor; Site Engineer; Project Manager |
| **Information priority** | 1 Attendance capture status and exceptions for today · 2 Deployment against sanctioned strength (KPI-15) · 3 Assignment coverage (KPI-16) · 4 Idle and hindrance proportion with causes (KPI-17) · 5 Overtime authorisation compliance (KPI-18) · 6 Measurement evidence completeness (KPI-30) |
| **Decision support** | Daily allocation; whether attendance and assignment discipline is holding; where evidence is incomplete before it becomes unrecoverable |
| **Drill-down paths** | Front → gang → worker → attendance → assignment → activity. Element → measurement → evidence artefacts → quality acceptance |
| **Alert categories** | Attendance captured against a closed front · unassigned attendance · unclassified idle day · concealment imminent without joint measurement |
| **Escalation** | E-L2 to Project Manager; concealment alert is immediate and blocking |

### DSH-11 — Audit and Investigation Position
| | |
|---|---|
| **Purpose** | To hold the enterprise's control evidence for the actor forbidden from causing any transition |
| **Audience** | Internal Auditor exclusively; extracts to CEO/MD and Board |
| **Information priority** | 1 Control execution and suppression (KPI-58) · 2 Reconciliation identity status (KPI-59) · 3 Separation compliance (KPI-37) · 4 Exception and override concentration (KPI-60, KPI-61) · 5 Backdating incidence (KPI-62) · 6 Evidence confidence profile (KPI-63) · 7 Audit finding closure quality (KPI-64) · 8 Retention assurance (KPI-70) |
| **Decision support** | Where to investigate; whether the control environment is degrading (RSK-72); whether findings are being closed on correction alone |
| **Drill-down paths** | Any indicator → contributing records → **including superseded, cancelled, and refused records** (AUD-09, IV-4) → actors → authority relied upon |
| **Alert categories** | Control configuration change · non-execution · separation breach · beneficiary override · pairing concentration (AF-7) · reconciliation breach |
| **Escalation** | E-L4 or E-L5 directly, bypassing any actor who is a subject of the matter (ES-2) |

### DSH-12 — Closure and Final Account Position
| | |
|---|---|
| **Purpose** | To govern the point at which § 1.4.12 says control collapses |
| **Audience** | Finance Controller; Project Director; CFO |
| **Information priority** | 1 Closure reconciliation completeness FC-1…FC-10 (KPI-68) · 2 Crystallised recoveries against outstanding · 3 LD position (KPI-48) · 4 Retention carried past closure (KPI-49) · 5 Unbilled verified value and unsettled attendance (KPI-67, KPI-56) · 6 Negotiated settlement variance (KPI-69) |
| **Decision support** | Whether the final account may be settled; what a proposed negotiated settlement actually costs |
| **Drill-down paths** | Closure → each of FC-1…FC-10 → residue → source. Settlement → computed figure → variance → authority → reason |
| **Alert categories** | Closure attempted with any reconciliation unresolved · final payment attempted with advance outstanding · retention released to close the account · settlement above computed figure |
| **Escalation** | E-L3 blocking; E-L5 where a settlement above the computed figure is proposed (PEL-06) |

### DSH-13 — Counterparty Position *(contractor-facing)*
| | |
|---|---|
| **Purpose** | To discharge CP-10: the counterparty may see the derivation of their own entitlement. Transparency suppresses disputes; opacity manufactures them |
| **Audience** | Contractor — **restricted to that contractor's own instruments** (SEC-04) |
| **Information priority** | 1 Their bill status and the gate that is holding it · 2 Derivation of their entitlement: quantities, rates, recoveries, retention, deductions with bases · 3 Their retention position and release conditions · 4 Their open disputes and the clock on each · 5 Their advance and issued-value position |
| **Decision support** | Whether to accept or dispute a measurement; what evidence to supply; what is outstanding against them |
| **Drill-down paths** | Bill → line → quantity → measurement reference → rate authority. Recovery → source instrument. Retention → condition → date |
| **Alert categories** | Bill returned with cause · dispute clock approaching escalation · evidence outstanding |
| **Escalation** | Through the defined dispute process (MD-1…MD-4); never through the enterprise's internal escalation |
| **Constraint** | **Read-only, and never an approval surface** (DB-3). No enterprise control indicator, no other counterparty's data, no exposure figure |

### DSH-14 — Worker Position *(worker-facing)*
| | |
|---|---|
| **Purpose** | To discharge CP-10 and GP-19 for the actor § 4.1 declares structurally unable to protect their own interest. **This is the cheapest and most motivated audit of the enterprise's own attendance record** |
| **Audience** | The individual worker, including workers paid through an intermediary |
| **Information priority** | 1 Days recorded for the period, by type · 2 Rate applied and its basis · 3 Gross, deductions, recoveries, net · 4 Payment status and acknowledgement · 5 How to dispute a record |
| **Decision support** | Whether the worker's own record is correct; whether to raise a grievance |
| **Drill-down paths** | Wage card → day → attendance record → site and front |
| **Alert categories** | Payment overdue · disputed record unresolved |
| **Escalation** | **The worker's grievance escalates on its own path and is never gated by a commercial dispute** (ES-3, PA-8, LAB-10) |
| **Constraint** | Presented in a form the worker can understand (LAB-09), including where literacy or language is a constraint |

---

## 13.3 Alert taxonomy

> **DB-4: alerts interrupt.** Only these five categories may interrupt, and each derives from a
> constitutional requirement to stop rather than to observe.

| # | Category | Constitutional source | Response |
|---|---|---|---|
| **AL-1** | **Hard-gate failure** — a payment cannot lawfully proceed | G-1…G-8, PEL-04, FIN-06 | Block; the transaction does not advance |
| **AL-2** | **Reconciliation breach** — an identity in § 7.12 or a test in § 11.6 is in breach | RI-0, AUD-06, FIN-12 | Immediate exception; block dependent payment where the identity governs it |
| **AL-3** | **Exception threshold** — frequency, concentration, or ageing breach | EXC-07, LI-31, OVR-08 | Escalate to Finance Controller and Internal Audit; review the rule |
| **AL-4** | **Statutory failure** — a worker's statutory position is or would be breached | CP-9, WKS-04, LAB-06 | Block settlement; worker made whole first (EB-3) |
| **AL-5** | **Control non-execution or suppression** — a control did not run, or its configuration changed | CP-11, FIN-15, FIN-16, SEC-12 | Independent alert to Internal Audit; re-execute the suppressed period |

**AL-A — An alert that can be dismissed without a recorded disposition is not an alert** (GP-14,
EXC-09). Dismissal records the actor, the reason, and the time.

**AL-B — Alert suppression is itself an AL-5 event.** The absence of an alarm must never be
achievable by disabling the alarm (FIN-16).

**AL-C — Alerts route to an authority that can act** (AP-7, AF-11), and never solely to the party
whose work generated them.

---

> **Part 13 complete — 14 information positions, 5 alert categories, no interface specified.**

---

# PART 14 — ENTERPRISE REPORT CATALOGUE

## 14.1 Purpose and constitutional standing

> **A dashboard is a position; a report is a record.** A dashboard shows what is true now. A report
> states what was true for a period, in a form that can be filed, cited, disputed, and produced years
> later to a party who was not present.

Reports are constitutional because **§ 3.4.4 makes the enterprise's obligation outlive the project**,
and because objective O-9 requires that the departure of any individual not degrade financial
control. A report is the artefact that survives the people.

### 14.1.1 Constitutional constraints on all reports

**RPR-A — Every report is reproducible.** Re-running it for the same period with the same parameters
produces the identical result (DT-1, SC-10). **A report whose output depends on when it was run is
not a record.** Where later facts have superseded earlier ones, both are visible (LAW-11).

**RPR-B — Every report states its own basis:** the period, the parameters, the effective-date basis,
the run time, and the data completeness at run time.

**RPR-C — Every report declares incompleteness.** Where a control did not run, an input was
unavailable, or a figure could not be computed, the report says so (CP-11, KP-5). **A total that
silently excludes what it could not compute is a false total.**

**RPR-D — Mandatory totals are constitutional.** Where this catalogue names a total, it is not
optional and it may not be suppressed by filtering. **A filtered report still carries the unfiltered
control totals**, so that a reader can see what the filter removed.

**RPR-E — Mandatory reconciliations travel with the report.** Where a report presents a financial
position, the identities that prove it are presented with it, in breach or not.

**RPR-F — Every report is drillable to primary evidence** (CP-7, GP-11).

**RPR-G — Reports do not compute.** A report presents figures computed under Part 7 by the canonical
definition. **A report that derives its own figure has created a second definition** (CP-4, FIN-01)
and is a defect.

**RPR-H — Counterparty reports are restricted to that counterparty's own instruments** (SEC-04) and
carry the derivation of their own entitlement (CP-10).

### 14.1.2 Catalogue structure

Reports carry identifiers **REP-01 … REP-56**, permanent and never renumbered, grouped into the
fourteen categories below. Each is specified as: **Purpose · Audience · Frequency · Decisions
supported · Mandatory filters · Mandatory totals · Mandatory reconciliations**.

> **Identifier note.** Reports use the prefix `REP-`. The prefix `RPT-` is **not available** — it is
> held by Part 7 § 7.3.2's rounding points.

---

## 14.2 Operational reports — REP-01 … REP-04

**REP-01 — Daily Site Position**
- **Purpose.** The day's operational truth at a site: who was deployed, who was captured, what was assigned, what was measured. **Audience.** Site Supervisor; Site Engineer; Project Manager. **Frequency.** Daily.
- **Decisions.** Next-day allocation; which attendance and evidence gaps must close before the period does.
- **Filters.** Project · site · work front · date. **Totals.** Deployed strength · captured records · validated records · rejected records · unassigned attendance · measured value.
- **Reconciliations.** XR-01 deployment vs attendance · XR-02 attendance vs assignment.

**REP-02 — Muster Roll**
- **Purpose.** The statutory and evidentiary record of presence for a period, by named worker. **Audience.** Site Supervisor; Accounts; statutory inspection. **Frequency.** Per settlement period, closed positively (PG-3).
- **Decisions.** Whether the period may close; what is payable.
- **Filters.** Site · period · gang · intermediary · engagement type. **Totals.** Worker-days by type and trade · payable days · disputed days · corrected days with their originals visible.
- **Reconciliations.** XR-03 independent presence signals · XR-04 enterprise-wide single occupancy · RI-7.

**REP-03 — Deployment and Assignment Register**
- **Purpose.** Who was authorised to be where, doing what, over a period. **Audience.** Project Manager; Internal Auditor. **Frequency.** Monthly; on demand for verification.
- **Decisions.** Whether presence was authorised; where retrospective assignment is concentrated.
- **Filters.** Project · site · front · activity · engagement type · date range. **Totals.** Deployments open and closed · assignments issued, completed, abandoned · retrospective assignments counted separately.
- **Reconciliations.** XR-01 · XR-02 · overlapping deployment test (DEP-05).

**REP-04 — Hindrance and Idle Time Register**
- **Purpose.** The recorded causes of non-working payable time — the enterprise's LD defence as well as its cost record. **Audience.** Project Manager; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Cost acceptance; LD netting under LD-2; whether idle time is being classified after the fact.
- **Filters.** Site · front · cause classification · date range. **Totals.** Idle days by cause · unclassified idle days *(must be zero)* · value of payable non-working time.
- **Reconciliations.** Attendance idle days vs hindrance records (ATT-13) · hindrance record creation date vs attendance date.

## 14.3 Financial reports — REP-05 … REP-09

**REP-05 — Running Account Statement**
- **Purpose.** The cumulative financial position of one engagement instrument: certified, paid, retained, recovered, deducted, outstanding. **Audience.** Accounts; Finance Controller; the contractor (own instrument only). **Frequency.** Per bill; monthly.
- **Decisions.** What is payable now; whether the cumulative position reconciles.
- **Filters.** Instrument · contractor · period. **Totals.** `V_certified_cum` · `V_paid_cum` · `Ret_held` · `Rec_cum` · `Ded_cum` · net position · ceiling headroom.
- **Reconciliations.** RI-1 · RI-2 · RI-6 · XR-13 · XR-14.

**REP-06 — Bill Register**
- **Purpose.** Every bill and its state, cause of return, and cycle time. **Audience.** Accounts; Project Director. **Frequency.** Monthly.
- **Decisions.** Where the payment process is failing; which counterparty submits incomplete claims.
- **Filters.** Instrument · state · cause of return · approver · period. **Totals.** Bills by state · value by state · returns by cause · median and 90th-percentile cycle time.
- **Reconciliations.** Bills certified vs measurements consumed (XR-13) · approved vs disbursed (XR-23).

**REP-07 — Payment Voucher and Disbursement Register**
- **Purpose.** Every voucher, its authority, its payee, and its disbursement outcome. **Audience.** Accounts; Finance Controller; Internal Auditor. **Frequency.** Weekly.
- **Decisions.** Whether payment reached the payee; whether failures reinstated correctly.
- **Filters.** Payee · instrument · approver · state · period. **Totals.** Value instructed · confirmed · failed · reinstated · unresolved beyond window *(must be zero)*.
- **Reconciliations.** XR-18 cumulative paid vs confirmed disbursements · XR-23 approved vs disbursed value.

**REP-08 — Cash Flow Commitment Schedule**
- **Purpose.** Committed outflow by period, separating earned-and-approved, earned-and-pending, and committed-but-unearned. **Audience.** CFO; CAP-TRE. **Frequency.** Weekly, forward-looking.
- **Decisions.** Funding and timing; whether exposure runs ahead of work in place.
- **Filters.** Period · instrument · commitment class. **Totals.** By class, by period; unearned component as a proportion.
- **Reconciliations.** Commitments vs approved-unpaid vs certified-unapproved; advance commitments vs FM-34 exposure.

**REP-09 — Contractor Account Statement**
- **Purpose.** The complete standing of one counterparty across all instruments. **Audience.** Finance Controller; Project Director; the contractor (own account). **Frequency.** Monthly; mandatory before any award (CTL-10).
- **Decisions.** Award; security requirement; suspension; set-off.
- **Filters.** Contractor · instrument · period. **Totals.** Per instrument and rolled up: certified, paid, advance outstanding, issued value unrecovered, retention held, disputed value, exposure (FM-34), net position (FM-35).
- **Reconciliations.** RI-3 · RI-4 · RI-5 · RI-6 — all four presented, in breach or not.

## 14.4 Executive reports — REP-10 … REP-12

**REP-10 — Constitutional Health Report**
- **Purpose.** The Board's periodic assurance that the capability's central promise is being kept. **Audience.** Executive Board; CEO/MD; CFO. **Frequency.** Quarterly.
- **Decisions.** Whether the control environment may be relied upon; whether structural change is required.
- **Filters.** Period · business unit. **Totals.** KPI-01 · KPI-02 by leakage form · KPI-10 · control execution rate · exception volume by authoriser · negotiated settlement variance.
- **Reconciliations.** Status of all twelve identities RI-1…RI-12 · count of identities not computable.

**REP-11 — Executive Exposure Report**
- **Purpose.** Where the enterprise's money is at risk, by counterparty and by class. **Audience.** CEO/MD; CFO; Board. **Frequency.** Quarterly.
- **Decisions.** Concentration limits; security posture; award restrictions.
- **Filters.** Counterparty · project · exposure class. **Totals.** Advance outstanding · issued value unrecovered · overpayment receivable · retention held · net exposure, with ageing.
- **Reconciliations.** RI-3 · RI-4 · RI-5 · exposure roll-up vs instrument-level detail (EX-1).

**REP-12 — Governance and Exception Report**
- **Purpose.** What the enterprise permitted itself to bypass, and who authorised it. **Audience.** CEO/MD; Board; Internal Auditor. **Frequency.** Quarterly.
- **Decisions.** Whether an exception has become the process; whether override rights should be withdrawn.
- **Filters.** Authoriser · exception type · period · project. **Totals.** Count and value by authoriser and type · overrides · refused requests · expired-not-renewed · standing exceptions.
- **Reconciliations.** Exceptions raised vs closed vs reviewed (EXC-10) · frequency against governed thresholds.

## 14.5 Audit reports — REP-13 … REP-17

**REP-13 — Control Health Report**
- **Purpose.** Which controls ran, which did not, and which were reconfigured. **Audience.** Internal Auditor; Finance Controller; CEO/MD. **Frequency.** Monthly.
- **Decisions.** Whether the control environment exists in operation; where to re-execute a suppressed period.
- **Filters.** Control · period · project · actor. **Totals.** Executions expected vs performed · non-executions · configuration changes with before/after values and actor.
- **Reconciliations.** Expected vs actual execution counts; alert volumes against process volumes (a fall in one without the other is AL-5).

**REP-14 — Separation of Duties Report**
- **Purpose.** Whether LAW-4 held on every transaction. **Audience.** Internal Auditor. **Frequency.** Monthly.
- **Decisions.** Whether separation is structural or nominal; where role accumulation has occurred.
- **Filters.** Instrument · actor · transition · period. **Totals.** Instruments with four distinct actors · breaches by SOD identifier · actors holding prohibited combinations · standing § 4.14.1 exceptions.
- **Reconciliations.** Approval records vs delegation register validity (XR-23) · measurer–checker pairing concentration (AF-7).

**REP-15 — Evidence Integrity Report**
- **Purpose.** Whether the record can be relied upon: tiers, integrity properties, custody, and retrieval. **Audience.** Internal Auditor. **Frequency.** Half-yearly.
- **Decisions.** Whether disbursed value is defensible; whether custody has broken.
- **Filters.** Object class · project · period · evidence tier. **Totals.** Value by confidence level (KPI-63) · records with integrity gaps · custody breaks · retrieval test results.
- **Reconciliations.** Supersession chains complete and legible · sequence gaps in every Measurement Book (MB-2) · duplicate artefact detection (PH-3).

**REP-16 — Anomaly and Pattern Report**
- **Purpose.** The statistical signatures the constitution requires be monitored: rounding bias, classification drift, timing clusters, revision outliers, threshold clustering. **Audience.** Internal Auditor exclusively (AF-11). **Frequency.** Quarterly.
- **Decisions.** Where to open an investigation.
- **Filters.** Actor · counterparty · project · signature type · period. **Totals.** Per signature: population, outliers, and the actors concerned.
- **Reconciliations.** AF-4 · AF-5 · AF-6 · AF-7 · AF-8 · AF-9, each reported whether or not it fired.

**REP-17 — Investigation Register**
- **Purpose.** Every investigation, its class, status, quantified loss, recovery, and root cause. **Audience.** Internal Auditor; CEO/MD. **Frequency.** Quarterly; each closure reported.
- **Decisions.** Whether findings are fully treated or closed on correction alone (AUD-10).
- **Filters.** Class · status · project · period. **Totals.** Open and closed by class · loss quantified · value recovered · findings with root cause identified · **investigations closed with no findings** (IV-6).
- **Reconciliations.** Losses quantified vs recoveries pursued vs written off.

## 14.6 Compliance reports — REP-18 … REP-21

**REP-18 — Statutory Register Pack**
- **Purpose.** The statutory registers, derived from the operational records that drove payment (LAB-04). **Audience.** Statutory inspection; Accounts; Internal Auditor. **Frequency.** Per statutory period.
- **Decisions.** Inspection readiness.
- **Filters.** Establishment · period · engagement type · intermediary. **Totals.** As prescribed by the applicable statute, plus worker count, worker-days, wages paid, deductions.
- **Reconciliations.** XR-22 registers vs attendance and wage records · RI-8 · RI-9.

**REP-19 — Statutory Deduction Report**
- **Purpose.** Deductions computed, deducted, and handed to CAP-TAX for deposit. **Audience.** Accounts; CAP-TAX. **Frequency.** Per statutory period.
- **Decisions.** Deposit and return preparation (outside this capability — § 2.2 X-12).
- **Filters.** Deduction head · counterparty · period. **Totals.** Base, rate, and amount by head; cumulative base for threshold tests (SD-1).
- **Reconciliations.** RI-9 deducted vs deposited · cumulative base vs threshold applicability.

**REP-20 — Minimum Wage Compliance Report**
- **Purpose.** Per-worker demonstration that effective receipt met or exceeded the statutory floor. **Audience.** Accounts; Finance Controller; inspection. **Frequency.** Every settlement period.
- **Decisions.** Whether settlement may proceed (WKS-04); where a rate correction is required.
- **Filters.** Trade · grade · region · intermediary · period. **Totals.** Workers tested · workers passing · **failures, individually listed** · arrears paid.
- **Reconciliations.** Effective daily wage against the statutory minimum in force at the work date (FM-25, MW-2) — tested at the Wage Card, not the invoice.

**REP-21 — Principal Employer Assurance Report**
- **Purpose.** Evidence that intermediated workers were paid, in the enterprise's own records. **Audience.** Finance Controller; Legal; inspection. **Frequency.** Per settlement period.
- **Decisions.** Whether to settle an intermediary's next claim (CTL-05); whether to pay workers directly (CTL-06).
- **Filters.** Intermediary · site · period. **Totals.** Workers supplied · acknowledgements obtained · value acknowledged · **gaps, individually listed**.
- **Reconciliations.** RI-8 wage cards vs disbursement · XR-06 · prior-period evidence presence.

## 14.7 Labour reports — REP-22 … REP-26

**REP-22 — Wage Register**
- **Purpose.** Per-worker wage computation and its derivation, for a period. **Audience.** Accounts; worker (own record); inspection. **Frequency.** Every settlement period.
- **Decisions.** Whether the settlement is correct and defensible per worker.
- **Filters.** Site · gang · intermediary · trade · grade · period. **Totals.** Days by type · gross · statutory deductions · recoveries · net · workers settled.
- **Reconciliations.** RI-7 · RI-8 · FM-27 lawful deduction ceiling per worker.

**REP-23 — Worker Wage Card**
- **Purpose.** One worker's own record: days, rate and its basis, gross, deductions, net, acknowledgement. **Audience.** The worker (LAB-09); Accounts; inspection. **Frequency.** Every settlement period.
- **Decisions.** Whether the worker disputes their own record — the enterprise's cheapest audit.
- **Filters.** Worker · period. **Totals.** As above, in a form the worker can understand.
- **Reconciliations.** Card days against the closed muster; net against disbursement acknowledgement.

**REP-24 — Labour Cost Attribution Report**
- **Purpose.** Labour cost by activity, project, and engagement type. **Audience.** Project Manager; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Cost control; estimating base; whether attribution discipline is holding.
- **Filters.** Project · activity · engagement type · period. **Totals.** Cost by activity · proportion attributed to general activity *(governed cap)* · unit labour cost (FM-32).
- **Reconciliations.** Attributed cost vs settled wage value · effort vs measured output (XR-07).

**REP-25 — Borrowed Labour Ledger Report**
- **Purpose.** Inter-project and inter-contractor labour transfers, matched. **Audience.** Finance Controller; Project Managers on both sides. **Frequency.** Monthly.
- **Decisions.** Whether transfers are recorded on both sides; inter-project settlement.
- **Filters.** Lending project · borrowing project · worker · period. **Totals.** Debits · credits · **residue (must be zero)** · transfer value.
- **Reconciliations.** RI-11 · XR-20 · transfer days against validated attendance (BRL-03).

**REP-26 — Productivity Report**
- **Purpose.** Output per validated worker-day by activity, with variance to norm. **Audience.** Project Manager; Project Director; Internal Auditor. **Frequency.** Monthly.
- **Decisions.** Resourcing; estimating; **and whether to open a measurement investigation** (PRD-05).
- **Filters.** Activity · gang · project · period. **Totals.** `P` (FM-31) · norm · variance (FM-33) · outliers **in both directions**.
- **Reconciliations.** XR-07 effort vs output · MR-6.

## 14.8 Contractor reports — REP-27 … REP-30

**REP-27 — Contractor Performance Report**
- **Purpose.** The composite standing that makes CTL-10 and CLS-12 operable. **Audience.** Project Director; CAP-SCM; CEO/MD. **Frequency.** Quarterly; on demand before award.
- **Decisions.** Award, re-award, empanelment, suspension, security.
- **Filters.** Contractor · project · period. **Totals.** KPI-05 composite and each component · band and band changes.
- **Reconciliations.** Component sources against their own registers; exposure against REP-09.

**REP-28 — Contractor Exposure and Ageing Report**
- **Purpose.** What the enterprise stands to lose if this counterparty stops today. **Audience.** Finance Controller; Project Director. **Frequency.** Monthly.
- **Decisions.** Recovery acceleration; security enforcement; suspension.
- **Filters.** Contractor · instrument · exposure class · age band. **Totals.** By class with ageing; security held and its validity.
- **Reconciliations.** RI-3 · RI-4 · security value against outstanding (ADV-04).

**REP-29 — Site Instruction and Variation Register**
- **Purpose.** Every instruction given and every variation raised, with dates — the enterprise's defence against § 1.4.7. **Audience.** Project Manager; Finance Controller; Legal. **Frequency.** Monthly.
- **Decisions.** Whether variations follow instructions or reconstruct them; whether the ceiling must rise.
- **Filters.** Instrument · instruction date · variation state · approver. **Totals.** Instructions recorded · variations by state · **variations whose executed work predates their instruction record** (VAR-03) · cumulative variation as a proportion of original sanction.
- **Reconciliations.** Variation value in valuation vs sanctioned variations only (SY-5) · ceiling test (RI-2).

**REP-30 — Counterparty Entitlement Statement** *(contractor-facing)*
- **Purpose.** To discharge CP-10: the derivation of the contractor's own entitlement. **Audience.** The contractor, own instruments only (SEC-04). **Frequency.** Per bill.
- **Decisions.** Whether to accept or dispute; what evidence to supply.
- **Filters.** Own instrument · period. **Totals.** Quantities and rates by line · gross · recoveries with their source instruments · retention · deductions · net.
- **Reconciliations.** Line quantities against measurement references; recoveries against issue notes (REC-06).

## 14.9 Settlement reports — REP-31 … REP-34

**REP-31 — Settlement Register**
- **Purpose.** Every settlement sheet, its state, its authority chain, and its outcome. **Audience.** Accounts; Finance Controller; Internal Auditor. **Frequency.** Every settlement period.
- **Decisions.** Whether settlements are separated, verified, and complete.
- **Filters.** Period · site · intermediary · state · approver. **Totals.** Settlements by state · value · worker-days · settlements with four distinct actors.
- **Reconciliations.** RI-7 · RI-8 · muster day count (WKS-03).

**REP-32 — Settlement Cycle Time Report**
- **Purpose.** Elapsed time from evidence to money, by stage and path. **Audience.** Project Director; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Whether delay is control or administration; whether DP-7 holds.
- **Filters.** Path · stage · counterparty · period. **Totals.** Median and 90th-percentile by stage; instances beyond the committed limit.
- **Reconciliations.** Stage timestamps against the enterprise event sequence (EVT-05 → EVT-15).

**REP-33 — Settlement Reversal and Failure Report**
- **Purpose.** Every failed, returned, recalled, or reversed settlement and its reinstatement. **Audience.** Accounts; Internal Auditor. **Frequency.** Monthly.
- **Decisions.** Whether failures reinstate entitlement automatically; whether reversals are attributed.
- **Filters.** Cause · payee · period. **Totals.** Failures by cause · value reinstated · **value neither reinstated nor resolved (must be zero)**.
- **Reconciliations.** LI-24 reinstatement · RI-6 · unresolved beyond window (LI-25).

**REP-34 — Unsettled Entitlement Report**
- **Purpose.** Validated attendance and verified measurement not yet settled, aged. **Audience.** Accounts; Finance Controller. **Frequency.** Every period.
- **Decisions.** Whether entitlement is being stranded as the workforce or contractor disperses.
- **Filters.** Site · worker · instrument · age band. **Totals.** Unsettled worker-days and value · unbilled verified value · both aged.
- **Reconciliations.** RI-7 · RI-12 · FC-9 and FC-10 where a closure is pending.

## 14.10 Recovery reports — REP-35 … REP-38

**REP-35 — Advance Register**
- **Purpose.** Every advance, its type, its recovery plan, its outstanding balance and age. **Audience.** Accounts; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Recovery acceleration; security enforcement; write-off recommendation.
- **Filters.** Contractor · type · age band · state. **Totals.** Issued · recovered · outstanding · written off · **advances without a bound recovery plan (must be zero)**.
- **Reconciliations.** RI-3 · security validity against outstanding.

**REP-36 — Issued Value Recovery Report**
- **Purpose.** Materials, plant, fuel, power, water and accommodation issued against value recovered. **Audience.** Accounts; Store and plant officers; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Whether L5 is closed at source; whether issue valuation is automatic.
- **Filters.** Contractor · item class · issue date range. **Totals.** Issued · recovered · outstanding · returned · written off · **unexplained residue (must be zero)**.
- **Reconciliations.** RI-4 · XR-16 · issue events against obligations raised (KPI-45).

**REP-37 — Recovery Application Report**
- **Purpose.** Recovery due against recovery applied, per bill and settlement, with the waterfall order evidenced. **Audience.** Accounts; Finance Controller. **Frequency.** Per bill; monthly.
- **Decisions.** Whether LAW-8 is holding; whether the waterfall was reordered.
- **Filters.** Instrument · recovery class · period. **Totals.** Due · applied · deferred **with authority** · waived **with authority** · carried forward.
- **Reconciliations.** FM-13 priority order evidenced per application · XR-15 · XR-16.

**REP-38 — Liquidated Damages Report**
- **Purpose.** LD accrued, levied, waived, and outstanding, per instrument. **Audience.** Finance Controller; Project Director; CFO. **Frequency.** Monthly.
- **Decisions.** Whether contractual entitlement is being abandoned by inaction — the purest L6.
- **Filters.** Instrument · delay period · state. **Totals.** Accrued · levied · waived with authority · **residue (must be zero)** · hindrance days netted.
- **Reconciliations.** RI-10 · XR-19 · delay position against recorded hindrance (LD-2).

## 14.11 Retention reports — REP-39 … REP-41

**REP-39 — Retention Liability Report**
- **Purpose.** Retention held as a liability, by instrument, with release conditions and dates. **Audience.** Finance Controller; CFO; CAP-FIN. **Frequency.** Monthly; mandatory at period close.
- **Decisions.** Liability provisioning; release scheduling.
- **Filters.** Instrument · contractor · release-condition state · age band. **Totals.** Accrued · held · released · forfeited · **retention past release date**.
- **Reconciliations.** RI-5 · XR-17 · FC-5 where a closure is pending.

**REP-40 — Retention Release Report**
- **Purpose.** Every release, its condition test, its authority, and its net-of-recovery computation. **Audience.** Finance Controller; Internal Auditor. **Frequency.** Per release; monthly aggregate.
- **Decisions.** Whether releases follow positive condition tests or elapsed time.
- **Filters.** Instrument · release type · authoriser · period. **Totals.** Value released · released net of recovery · **early releases, individually listed** (RET-05).
- **Reconciliations.** FM-16 · outstanding recovery at release date (RET-06).

**REP-41 — Retention Ageing and Expiry Report**
- **Purpose.** Retention approaching or past its release condition, including on closed projects. **Audience.** Finance Controller. **Frequency.** Monthly.
- **Decisions.** Whether release has an owner — the characteristic § 1.4.9 failure.
- **Filters.** Age band · defect liability expiry · project state including closed. **Totals.** By age band; retention carried past project closure (CLS-07, RET-10).
- **Reconciliations.** RI-5 · custody of the liability after closure.

## 14.12 Measurement reports — REP-42 … REP-46

**REP-42 — Measurement Book Register**
- **Purpose.** Every MB, its custody, its sequence integrity, and its state. **Audience.** Check Measurement Officer; Internal Auditor. **Frequency.** Monthly; per closure.
- **Decisions.** Whether the primary evidentiary record can be relied upon.
- **Filters.** Project · book · custodian · state. **Totals.** Books issued, in use, closed, archived · **sequence gaps (each explained)** · custody transfers.
- **Reconciliations.** MB-1…MB-8 property checks · cumulative carry-forward continuity (MBK-07).

**REP-43 — Measurement Register**
- **Purpose.** Every entry, its state, its check, its consumption, and its dates. **Audience.** Site Engineer; Check Measurement Officer; Accounts. **Frequency.** Per bill cycle.
- **Decisions.** What is billable; what is disputed; what remains unbilled.
- **Filters.** Instrument · item · state · measurer · checker · date range. **Totals.** Entries by state · value verified · value consumed · value unbilled · reduced value.
- **Reconciliations.** RI-1 · RI-12 · XR-13 · execution-to-measurement-to-bill intervals (AF-8).

**REP-44 — Check Measurement Report**
- **Purpose.** What was checked, by whom, to what extent, and with what result — **including "checked, no discrepancy"** (CK-6). **Audience.** Check Measurement Officer; Internal Auditor. **Frequency.** Per bill cycle.
- **Decisions.** Whether the declared check percentage was applied; whether a sample failure escalated to the population (CK-5).
- **Filters.** Instrument · value band · checker · period. **Totals.** Value checked by band · percentage applied vs declared · discrepancies found · populations escalated.
- **Reconciliations.** Applied percentage against the governed declaration; checker independence against SOD-1.

**REP-45 — Quantity Reconciliation Report**
- **Purpose.** Measured quantity against drawings, theoretical consumption, batching, weighbridge, and level records. **Audience.** Site Engineer; Check Measurement Officer; Internal Auditor. **Frequency.** Per bill cycle.
- **Decisions.** Whether measured output is real; whether the bill may proceed (MR-9).
- **Filters.** Instrument · item · material · period. **Totals.** Measured vs design vs consumption-implied; variance by item and material.
- **Reconciliations.** MR-1 … MR-8, each reported whether or not it breached.

**REP-46 — Measurement Dispute Report**
- **Purpose.** Every disputed entry, its age, its value, and its resolution path. **Audience.** Project Director; Finance Controller; the contractor (own disputes). **Frequency.** Monthly.
- **Decisions.** Whether disputes are resolved while still measurable (MD-2); whether the MD-4 clock is being observed.
- **Filters.** Instrument · age band · dispute cause. **Totals.** Open disputes by age and value · resolved in period · **disputes past the escalation clock**.
- **Reconciliations.** Disputed value excluded from certification (MD-1) · resolution recorded as a new measurement, not an edit (MD-3).

## 14.13 Exception reports — REP-47 … REP-49

**REP-47 — Exception Register Report**
- **Purpose.** Every exception raised, authorised, refused, active, expired, and reviewed. **Audience.** Finance Controller; Internal Auditor; CEO/MD. **Frequency.** Monthly.
- **Decisions.** Whether exceptions are time-boxed, counted, and reviewed; whether a rule requires amendment.
- **Filters.** Exception type (Part 16) · authoriser · project · state · period. **Totals.** Count and value by type and authoriser · refused requests · expired-not-renewed · standing exceptions · **exceptions closed without review (must be zero)**.
- **Reconciliations.** Raised vs closed vs reviewed (EXC-10) · frequency against governed thresholds (EXC-07).

**REP-48 — Override and Backdating Report**
- **Purpose.** Every manual override and every record whose effective date preceded its creation. **Audience.** Internal Auditor; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Whether override rights should be withdrawn; whether evidence is being reconstructed.
- **Filters.** Actor · object class · period · project. **Totals.** Overrides by actor and type · **overrides by a beneficiary (must be zero)** · backdated records by actor · closed-period alterations.
- **Reconciliations.** Override expiry compliance (OVR-04) · period-reopening authority (PG-4, OVR-05).

**REP-49 — Exception Frequency and Trend Report**
- **Purpose.** Whether an exception has become the process. **Audience.** Internal Auditor; CEO/MD; Board. **Frequency.** Quarterly.
- **Decisions.** Whether to amend the rule, correct the process, or investigate circumvention — three different remedies (§ 11.10.3).
- **Filters.** Type · authoriser · counterparty · project · period series. **Totals.** Trend by type and authoriser; types breaching frequency thresholds; repeat authorisers.
- **Reconciliations.** Frequency against LA-5 thresholds; escalations triggered vs escalations required (LI-31).

## 14.14 Risk reports — REP-50 … REP-52

**REP-50 — Risk Register Status Report**
- **Purpose.** The 72-risk register with current assessment, residual, and control status. **Audience.** Internal Auditor; CEO/MD; Board. **Frequency.** Quarterly; on any AE-1…AE-10 event.
- **Decisions.** Where to direct audit effort; whether residuals have moved; whether a control must become structural.
- **Filters.** Category · severity · residual band · owner · project. **Totals.** Risks by severity and residual · Critical risks live · risks with non-executing controls.
- **Reconciliations.** Control status against the register's stated controls; residual restated (RG-5).

**REP-51 — Leakage Quantification Report**
- **Purpose.** Value at risk and value confirmed lost, by leakage form L1–L7. **Audience.** CFO; Finance Controller; Internal Auditor; Board. **Frequency.** Quarterly.
- **Decisions.** Where the control model is failing in aggregate rather than in instance.
- **Filters.** Leakage form · project · counterparty · period. **Totals.** Estimated exposure and confirmed loss by form · recovered · written off · **L5 and L6 reported with equal prominence to L1–L4** (REC-16).
- **Reconciliations.** Estimates against open residues; confirmed losses against investigation records (REP-17).

**REP-52 — Early Warning Indicator Report**
- **Purpose.** The register's early-warning indicators, fired and not fired. **Audience.** Internal Auditor; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Pre-emptive investigation; contractor distress response (RSK-67).
- **Filters.** Risk · indicator · project · counterparty. **Totals.** Indicators fired · indicators not computable · risks with no indicator currently computable.
- **Reconciliations.** Indicator availability against the register's stated detection mechanisms.

## 14.15 Management reports — REP-53 … REP-56

**REP-53 — Project Financial Summary**
- **Purpose.** One project's complete workforce-financial position. **Audience.** Project Manager; Project Director; Finance Controller. **Frequency.** Monthly.
- **Decisions.** Project cost control; where exposure and leakage concentrate.
- **Filters.** Project · period · instrument · engagement type. **Totals.** Labour cost · certified contract value · recoveries · retention · exposure · unit labour cost.
- **Reconciliations.** RI-1 · RI-3 · RI-4 · RI-5 at project level.

**REP-54 — Period Close Certificate**
- **Purpose.** The positive record that a period closed properly (PG-3) — the checklist, its evidence, and its residues. **Audience.** Finance Controller; Internal Auditor. **Frequency.** Every period.
- **Decisions.** Whether the period may close; what carries forward.
- **Filters.** Period · project · business unit. **Totals.** Musters closed · disputes resolved or excluded · recoveries applied or deferred · identities computed and their status · **items carried forward with reasons**.
- **Reconciliations.** All twelve identities RI-1…RI-12, presented in breach or not (RPR-E).

**REP-55 — Final Account and Closure Report**
- **Purpose.** The complete closure record: FC-1…FC-10, the computed figure, and any negotiated variance. **Audience.** Finance Controller; CFO; CEO/MD; Internal Auditor. **Frequency.** Per closure.
- **Decisions.** Whether the contract may close; what a negotiated settlement cost.
- **Filters.** Instrument · contractor. **Totals.** Each of FC-1…FC-10 with its residue · computed final figure · settled figure · variance with authority and reason.
- **Reconciliations.** FC-1 … FC-10, **all ten, each to zero unexplained residue** · live obligations remaining (CLS-11).

**REP-56 — Constitutional Conformance Report**
- **Purpose.** The enterprise's own statement of conformance to CAP-WFC-01: Laws satisfied, rules implemented, deferred or rejected with reasons, exceptions detectable. **Audience.** Board; external audit; counterparties on request. **Frequency.** Annual, and on any material change to the control environment.
- **Decisions.** Whether the enterprise may claim conformance, and in what terms.
- **Filters.** Business unit; rule domain. **Totals.** Immutable Laws satisfied *(all twelve, or the amendment declared)* · rules implemented / deferred / rejected · exception types detectable · declared exposures.
- **Reconciliations.** Rule inventory against Part 9; exception types against Part 16. **Partial conformance is legitimate; silent partial conformance is not** (§ How to read this document).

---

## 14.16 Report governance

**RPG-A — Every report has a single named owner** who is accountable for its accuracy, drawn from
Part 4. Ownership follows the accountability, not the effort of production.

**RPG-B — A report is a record and is retained** for the evidence-retention period (EP-1). Reports
produced for statutory purposes are retained on the statutory schedule (LAB-14).

**RPG-C — Reports circulate to an authority that can act** (AP-7). Audit and anomaly reports do not
circulate solely to the party they observe (AF-11, AUD-07).

**RPG-D — A report that has never been read is a control that is not running.** Circulation and
acknowledgement of the reports named as mandatory in Part 12 and Part 13 is itself monitored under
KPI-58.

**RPG-E — Counterparty and worker reports are entitlements, not disclosures** (CP-10, GP-19). They are
produced as a matter of course, not on request.

---

> **Part 14 complete — 56 reports across 14 categories, each with mandatory totals and
> reconciliations.**

---

# PART 15 — ENTERPRISE DATA MODEL

## 15.1 Purpose and derivation

> **This is a conceptual model of what the enterprise knows. It is not a schema, and it will outlive
> every schema built from it.**

Part 5 defined thirty enterprise objects — what the business recognises as a thing. **Part 15 states
how those things hold together as information**: which of them must change together, which may
change independently, what must remain true across all of them, and what history must survive.

### 15.1.1 What this Part is not

**DM-0 — Explicitly out of scope, by mandate.** No tables, no keys, no columns, no indexes, no
queries, no schema language, no database technology, no platform, no storage design, no API, no
serialisation format, no naming convention for any of these. **CP-12 governs absolutely: the
business architecture is sovereign, and nothing here exists because a technology made it convenient
or is omitted because a technology made it awkward.**

An implementation may realise this model as relational tables, documents, ledgers, event streams,
paper registers, or any combination. **The model is indifferent, and must remain so for as long as
this capability governs — which § 3.4.4 and objective O-9 measure in decades, not release cycles.**

### 15.1.2 Derivation

Every element of this Part derives from Parts 1–11:

| Construct | Derived from |
|---|---|
| Aggregates | The consistency boundaries implied by Part 6's lifecycles and Part 7's cumulative formulae |
| Entities | **The thirty objects of § 5.1, unchanged.** No entity is introduced |
| Value objects | The quantities, dates, and references Part 7 and Part 8 already compute with |
| Ledgers | The cumulative positions Part 7 requires and Part 5 already names (OBJ-22, OBJ-25) |
| Relationships | The relationship statements in each § 5.x object specification |
| Integrity constraints | The invariants of Part 6 (LI-), the identities of § 7.12 (RI-), and the rules of Part 9 |
| Event history | The twenty-two enterprise events of § 11.11.2 |
| Audit history | § 11.9.5 AT-1…AT-5 |

**Two constructs are newly named here and nowhere else: *value object* and *ledger*.** Both are
declared under DD-3 as unavoidable — a conceptual model cannot state integrity without distinguishing
things that have identity from things that only have value, nor state cumulative position without
naming the running record that holds it. **Neither introduces a business concept**: every value
object and every ledger is a restatement of something Parts 5, 7, or 11 already require.

## 15.2 Modelling constructs

| Construct | Definition | Test |
|---|---|---|
| **Entity** | A thing with independent identity that persists through change of every attribute | *If every attribute changed, would it still be the same thing?* If yes, entity |
| **Value object** | A thing defined entirely by its value, with no independent identity, immutable once formed | *Are two instances with identical values interchangeable?* If yes, value object |
| **Aggregate** | A cluster of entities and value objects that **must change together to remain correct**, with one entity as its root | *Can an outside party change part of this without the whole being re-checked?* If no, one aggregate |
| **Aggregate root** | The only entity through which an aggregate may be changed; the holder of the aggregate's invariants | — |
| **Ledger** | An append-only running record of a cumulative position, from which balances are derived rather than stored | *Is the balance a fact, or a conclusion?* In this capability it is always a conclusion |
| **Register** | An append-only record of occurrences, kept for evidence rather than for balance | — |
| **Reference data** | Facts consumed from another capability, never authored here (II-1) | — |
| **Derived record** | A record computed from others, carrying the confidence of its weakest input (HR-2) | — |

### 15.2.1 Why aggregates matter constitutionally

An aggregate boundary is not a modelling convenience. **It is the boundary within which an invariant
is guaranteed and outside which it is not.** Three of this capability's most important controls are
aggregate-boundary statements:

- **LI-16** (one validated attendance per worker per date, enterprise-wide) is an invariant that
  **crosses every aggregate** — which is precisely why § 5.2 requires enterprise-wide identity, and
  why the model must state it as a global constraint rather than a local one (DMC-04).
- **LM-6 / GP-04** (nothing is consumed twice) is an invariant between the Measurement aggregate and
  the Running Bill aggregate, and between the Attendance aggregate and the Settlement aggregate.
- **LAW-6** (cumulative, never incremental) means the Running Bill aggregate must be **derivable in
  full from the ledger**, not accumulated from its predecessors.

## 15.3 Aggregate catalogue

> Sixteen aggregates. Each names its root, its members, the invariants it guarantees, and its
> transactional boundary.

| ID | Aggregate | Root | Member objects | Guarantees |
|---|---|---|---|---|
| **AGG-01** | Worker | OBJ-01 Worker | — | Enterprise-wide unique, permanent identity (WRK-02); never deleted (WRK-04) |
| **AGG-02** | Contractor | OBJ-02 Contractor | — | Verified legal, statutory, and banking identity before activation (WRK-09, WRK-10) |
| **AGG-03** | Gang | OBJ-03 Gang | — | Named leader and dated composition at every point in time (GNG-01, GNG-02); one gang per worker per date (GNG-03) |
| **AGG-04** | Engagement | OBJ-04 Engagement Instrument | OBJ-05 Rate Schedule Item · OBJ-24 Variation Instrument | Ceiling, rates, retention, advance and recovery terms all present before ACTIVE (E-1…E-8); rates versioned, never edited (LI-02, FIN-07); ceiling rises only by sanctioned variation (LI-19) |
| **AGG-05** | Deployment & Assignment | OBJ-06 Deployment | OBJ-07 Work Assignment | No overlapping deployment for one worker (DEP-05); assignment within deployment (LI-04) and before execution (LI-03) |
| **AGG-06** | Attendance & Site Conditions | OBJ-10 Muster Roll | OBJ-09 Attendance Record · OBJ-28 Hindrance Record | One validated record per worker per date **within** the muster; capture method recorded (ATT-10); correction by supersession only (ATT-16); closed muster accepts no entry (ATT-17) |
| **AGG-07** | Measurement | OBJ-11 Measurement Book | OBJ-12 Measurement Entry · OBJ-13 Evidence Artefact | Sequence gap-free (MBK-04); entries indelible and superseded, never edited (MBK-03); check applied before VERIFIED (MSR-06); no future-dated entry (MSR-04) |
| **AGG-08** | Running Bill | OBJ-14 Running Bill | — | Cumulative and reconciling to the contractor ledger (RBL-04); every quantity traceable to an unconsumed verified entry (RBL-02); ceiling tested before recovery and retention (RBL-05) |
| **AGG-09** | Settlement | OBJ-15 Settlement Sheet | OBJ-16 Wage Card | Computed only from a closed muster (WKS-01); one wage card per worker per period (WKS-09); statutory minimum passed before approval (WKS-04) |
| **AGG-10** | Advance | OBJ-17 Advance | — | Recovery plan bound at approval (LI-11); outstanding crystallises on suspension or termination (ADV-08) |
| **AGG-11** | Recovery & Issued Value | OBJ-18 Recovery | OBJ-29 Issued Value Record | Obligation created by the issuing event, automatically (LI-14); valued at issue date (REC-02); waiver separated from origination (SOD-8) |
| **AGG-12** | Retention | OBJ-19 Retention | — | Liability from the instant withheld (RET-02); cumulative computation, capped (FM-15); release on positive condition test only (LI-18) |
| **AGG-13** | Payment | OBJ-20 Payment Voucher | OBJ-21 Disbursement | Amount and payee immutable after approval (LI-23); PAID only on confirmed disbursement (SY-7); failure reinstates liability (LI-24) |
| **AGG-14** | Final Account | OBJ-30 Final Account | — | FC-1…FC-10 reconciled before AGREED (§ 6.12.1); computed before discussed (LI-26) |
| **AGG-15** | Exception | OBJ-26 Exception Record | — | Who, why, under what authority, for how long (LAW-12); time-boxed (LI-29); counted against the authoriser (LI-30) |
| **AGG-16** | Approval | OBJ-27 Approval Record | — | Names a person, a moment, and a delegated authority (CP-6); records the subject's state at approval; supersession only |

### 15.3.1 Objects not held in an aggregate

Four of the thirty objects are deliberately not aggregate members, and the reason matters:

| Object | Placement | Reason |
|---|---|---|
| **OBJ-08 Activity** | **Reference data**, consumed from CAP-PPM (D-4, I-3) | II-1 — WFC consumes activity structure; it never authors it. An aggregate would imply ownership |
| **OBJ-22 Borrowed Labour Ledger** | **Ledger LDG-03** | It is a running position between two projects, not a thing with a lifecycle of its own |
| **OBJ-25 Contractor Account** | **Ledger LDG-01** | Its balance is a conclusion drawn from bills, advances, recoveries, retention and disbursements — never a stored fact (§ 15.6) |
| **OBJ-23 Productivity Record** | **Derived record** | Computed from measurement and attendance; carries the confidence of its weakest input (HR-2); analytical and never financial (PD-1) |

### 15.3.2 Transactional boundary rules

**AB-1 — An invariant inside one aggregate is guaranteed at every moment.** An invariant that spans
aggregates is guaranteed at a defined point, and the model must say which point (DMC-04, DMC-05).

**AB-2 — An aggregate is changed only through its root.** A measurement entry is never altered except
through its Measurement Book; a wage card never except through its settlement.

**AB-3 — Cross-aggregate references are by identity, never by containment.** A Running Bill
references measurement entries; it does not contain them. **This is what makes LM-6 consumption
enforceable**: the entry's consumption state lives with the entry, not with the bill that consumed
it.

**AB-4 — No aggregate may be deleted.** Ever, under any circumstance, by any authority (LAW-11,
WRK-04, LI-33).

## 15.4 Entity catalogue

> **The entities of this capability are the thirty objects of § 5.1, unchanged and unrenumbered.**
> No entity is introduced by this Part. The table below adds only the information a conceptual model
> requires and Part 5 did not state: identity basis, mutability class, and aggregate placement.

| OBJ | Entity | Identity basis | Mutability | Aggregate |
|---|---|---|---|---|
| OBJ-01 | Worker | Enterprise-assigned, permanent, survives every engagement change | Attributes mutable; identity never | AGG-01 |
| OBJ-02 | Contractor | Enterprise-assigned legal-entity identity | Attributes mutable; banking identity change-controlled (SEC-07) | AGG-02 |
| OBJ-03 | Gang | Enterprise-assigned, with dated composition history | Composition mutable by dated record | AGG-03 |
| OBJ-04 | Engagement Instrument | Instrument reference | **[FINANCIAL]** — superseded, never altered | AGG-04 (root) |
| OBJ-05 | Rate Schedule Item | Item code **plus version** | **[FINANCIAL]** — versioned by effective date; never edited | AGG-04 |
| OBJ-06 | Deployment | Worker/gang + project + effective range | Closed by date, never overwritten | AGG-05 (root) |
| OBJ-07 | Work Assignment | Assignment reference | **[EVIDENTIARY]** | AGG-05 |
| OBJ-08 | Activity | Activity code from CAP-PPM | Reference data — consumed | — |
| OBJ-09 | Attendance Record | Worker + date + capture event | **[EVIDENTIARY]** — corrected by supersession | AGG-06 |
| OBJ-10 | Muster Roll | Site + period | **[EVIDENTIARY]** — closed positively | AGG-06 (root) |
| OBJ-11 | Measurement Book | Book reference + custody chain | **[EVIDENTIARY]** — sequence gap-free | AGG-07 (root) |
| OBJ-12 | Measurement Entry | Entry identity, **unique enterprise-wide** (AF-1) | **[EVIDENTIARY]** — superseded only | AGG-07 |
| OBJ-13 | Evidence Artefact | Artefact identity + binding to its entry | **[EVIDENTIARY]** — immutable once captured | AGG-07 |
| OBJ-14 | Running Bill | Instrument + sequence | **[FINANCIAL]** — cumulative; superseded by its successor | AGG-08 (root) |
| OBJ-15 | Settlement Sheet | Settlement reference | **[FINANCIAL]** | AGG-09 (root) |
| OBJ-16 | Wage Card | Worker + period | **[FINANCIAL]** | AGG-09 |
| OBJ-17 | Advance | Advance reference | **[FINANCIAL]** | AGG-10 (root) |
| OBJ-18 | Recovery | Recovery reference + source instrument | **[FINANCIAL]** | AGG-11 (root) |
| OBJ-19 | Retention | Instrument + accrual sequence | **[FINANCIAL]** | AGG-12 (root) |
| OBJ-20 | Payment Voucher | Voucher reference | **[FINANCIAL]** — immutable after approval | AGG-13 (root) |
| OBJ-21 | Disbursement | Disbursement reference | **[FINANCIAL]** | AGG-13 |
| OBJ-22 | Borrowed Labour Ledger | Lending + borrowing + worker + period | **[FINANCIAL]** — ledger | LDG-03 |
| OBJ-23 | Productivity Record | Activity + period + workforce unit | Derived; recomputable | — |
| OBJ-24 | Variation Instrument | Variation reference | **[FINANCIAL]** | AGG-04 |
| OBJ-25 | Contractor Account | Contractor + instrument | **[FINANCIAL]** — ledger | LDG-01 |
| OBJ-26 | Exception Record | Exception reference | **[EVIDENTIARY]** | AGG-15 (root) |
| OBJ-27 | Approval Record | Approval reference | **[EVIDENTIARY]** | AGG-16 (root) |
| OBJ-28 | Hindrance Record | Site + front + period | **[EVIDENTIARY]** | AGG-06 |
| OBJ-29 | Issued Value Record | Issue reference | **[FINANCIAL]** | AGG-11 |
| OBJ-30 | Final Account | Instrument | **[FINANCIAL]** | AGG-14 (root) |

**EN-1 — Identity is permanent and never re-used.** An identifier released by an object's archival
is never issued to another object, in any family, ever. Re-use destroys the ability to interpret
historical records, which is the whole purpose of retaining them (objective O-9).

**EN-2 — `[FINANCIAL]` and `[EVIDENTIARY]` classifications are as § 5.1 states them** and are
carried into the model unchanged. Both classes are subject to LAW-11 without exception.

**EN-3 — Mutability is a property of the entity, not of the actor.** No role, however privileged,
alters an immutable entity (SEC-10, DI-8).

## 15.5 Value objects

> Value objects have no identity and no lifecycle. They are **immutable once formed** and are
> compared by value. Each below is a restatement of something Part 7, Part 8, or Part 11 already
> requires — none introduces a business concept (DD-3).

| ID | Value object | Composition | Constitutional source |
|---|---|---|---|
| **VO-01** | **Money** | Amount + currency + precision class | § 7.3.1; never truncated (RND-6) |
| **VO-02** | **Quantity** | Magnitude + unit of measure | § 7.3.3 U-1 — unit is inseparable from magnitude |
| **VO-03** | **Rate** | Money per unit of measure + effective range + authority | FM-00, RR-1…RR-4; **never rounded** (§ 7.3.1) |
| **VO-04** | **Unit of Measure** | Unit + measurement mode | § 8.4; a property of the rate schedule item, never of the measurement (UG-1) |
| **VO-05** | **Percentage** | Exact fraction as contracted | § 7.3.1 — applied to unrounded bases (RND-7) |
| **VO-06** | **Effective Date** | The date a fact was true, distinct from when it was recorded | DP-12, TS-2, RR-4 |
| **VO-07** | **Date Range** | Effective from + effective to | Versioning of rates, delegations, statutory parameters (GP-17) |
| **VO-08** | **Period** | Period identity + status OPEN / CLOSING / CLOSED | PG-1 |
| **VO-09** | **Worker Day** | Worker identity + date + attendance type + fraction | FM-20; **the atomic unit of the labour path** |
| **VO-10** | **Location** | Project + site + front + grid/level/chainage to re-measurable granularity | MP-7, ME-3 |
| **VO-11** | **Item Classification** | Rate schedule item + version + as-executed description | MP-8, ME-1, ME-2 |
| **VO-12** | **Evidence Reference** | Artefact identity + tier + capture method + confidence | § 11.3, § 11.4, ATT-10, ME-11 |
| **VO-13** | **Approval Reference** | Actor + moment + delegated authority + limit at that moment | CP-6, SEC-05 |
| **VO-14** | **Authority Limit** | Amount + scope + validity range | D-9, RBL-11 |
| **VO-15** | **Evidence Tier** | H-1 … H-8 | § 11.3 |
| **VO-16** | **Confidence Level** | High / Medium / Low / Unsupported | § 11.4 |
| **VO-17** | **Leakage Form** | L1 … L7 | § 1.5 |
| **VO-18** | **State Transition** | From-state + to-state + actor + moment + authority + reason | § 6.14, AT-1 |

**VOC-1 — A value object is never edited; it is replaced.** Changing a rate produces a new Rate, not
a modified one (FIN-07).

**VOC-2 — Money and Quantity may not be combined across incompatible units** (U-1). This is a
structural impossibility, not a validation rule.

**VOC-3 — Every Money value carries the precision class that produced it** (§ 7.3.1), so that a
presented figure can be distinguished from a full-precision intermediate.

**VOC-4 — Effective Date and record date are always both present** wherever a fact is recorded
(TS-2, ME-6, OVR-06). **A single-date record cannot express backdating, and therefore cannot
reveal it.**

## 15.6 Ledgers and registers

> A ledger holds a **cumulative position** as an append-only sequence of movements. **Balances are
> derived, never stored** — because LAW-6 requires that every position be re-derivable from its
> constituents, and a stored balance is an assertion that can drift from the record that justifies it.

| ID | Ledger / register | Holds | Balance derived as | Source |
|---|---|---|---|---|
| **LDG-01** | **Contractor Account** | Every movement against one instrument: certification, payment, advance, recovery, retention, deduction, dispute | FM-34, FM-35; RI-1…RI-6 | OBJ-25 |
| **LDG-02** | **Wage Card Ledger** | Per-worker earnings, deductions, recoveries, and acknowledgements across periods | FM-28 per period; cumulative earning history | OBJ-16 |
| **LDG-03** | **Borrowed Labour Ledger** | Matched debits and credits between projects for transferred worker-days | RI-11 — must net to zero enterprise-wide | OBJ-22 |
| **LDG-04** | **Advance Ledger** | Issue, recovery, deferral, waiver, write-off per advance | RI-3 | AGG-10 |
| **LDG-05** | **Issued Value Ledger** | Issue, valuation, recovery, return, write-off per issue event | RI-4 | AGG-11 |
| **LDG-06** | **Retention Ledger** | Accrual, holding, release, forfeiture per instrument | RI-5; `Ret_held` (§ 7.2) | AGG-12 |
| **LDG-07** | **Recovery Ledger** | Obligation, schedule, application, deferral, waiver | RI-3, RI-4; waterfall application order (FM-13) | AGG-11 |
| **LDG-08** | **Statutory Deduction Ledger** | Deduction base, rate, amount, and hand-off to CAP-TAX | RI-9 | FM-17 |
| **LDG-09** | **Measurement Consumption Register** | Which bill consumed which entry, and every restoration on cancellation | LM-6; AF-1 uniqueness | AGG-07 ↔ AGG-08 |
| **LDG-10** | **Attendance Consumption Register** | Which settlement consumed which validated day | SY-2, ATT-20; RI-7 | AGG-06 ↔ AGG-09 |
| **LDG-11** | **Exception Register** | Every exception raised, refused, authorised, expired, reviewed | LI-30 counts by authoriser | AGG-15 |
| **LDG-12** | **Approval Register** | Every approval and refusal, with authority relied upon | AT-3 — **refusals recorded as fully as grants** | AGG-16 |
| **LDG-13** | **Audit Trail** | Actor, time, prior state, new state, authority, reason for every act | AT-1…AT-5 | Cross-cutting |

**LG-1 — Ledgers are append-only.** A movement is never altered; a reversing movement is added and
both remain visible (LAW-11, DI-1).

**LG-2 — A balance is a conclusion, not a fact.** Any stored balance is a **cache of a derivation**
and MUST be reproducible from the ledger at any moment. Where a stored balance and its derivation
disagree, **the derivation governs and the disagreement is a defect** (CP-4, FIN-01).

**LG-3 — Every ledger supports point-in-time derivation.** The position on any past date is
computable, because RI-0 requires that every identity be evaluable for any date and because disputes
arrive years later (§ 3.4.4).

**LG-4 — The two consumption registers (LDG-09, LDG-10) are the structural implementation of GP-04.**
They are the reason "nothing is consumed twice" is an enforceable invariant rather than a hope, and
they are the only place where a consumption may be reversed (MSR-13, RBL-13).

**LG-5 — The audit trail is itself append-only and subject to the same integrity properties as what
it records** (AT-2). **An alterable audit trail is worse than none, because it manufactures
confidence.**

---

## 15.7 Relationship model

> Relationships are stated as they appear in the *Relationships* facet of each § 5.x object
> specification. **None is added here.** Cardinality and temporality are made explicit because a
> conceptual model must state them and Part 5 stated them only in prose.

| ID | Relationship | Cardinality | Temporality | Constitutional note |
|---|---|---|---|---|
| **REL-01** | Worker → Gang | 0..1 at a time | Dated; history retained | GNG-03 — one gang per worker per date |
| **REL-02** | Worker → Engagement Instrument | 1 at a time | Dated | WRK-06, WRK-07 — no dual intermediary |
| **REL-03** | Worker → Deployment | 0..1 open | Dated; no overlap | DEP-05 |
| **REL-04** | Worker → Attendance Record | 1 : many | One **validated** per date, enterprise-wide | LI-16 — see DMC-04 |
| **REL-05** | Worker → Wage Card | 1 per settlement period | Per period | WKS-09, BRL-06 |
| **REL-06** | Worker → Borrowed Labour entry | 0..many | Dated | RI-11 must net to zero |
| **REL-07** | Gang → Worker | 1 : many | Dated composition history | GNG-01, GNG-02 |
| **REL-08** | Gang → Gang Leader | 1 | Dated | § 4.2 — the accountable intermediary |
| **REL-09** | Contractor → Engagement Instrument | 1 : many | Dated | AGG-02 |
| **REL-10** | Contractor → Contractor Account | 1 : 1 per instrument, rolled up | Continuous | EX-1 — instrument level is authoritative |
| **REL-11** | Engagement Instrument → Rate Schedule Item | 1 : many, **versioned** | Effective-dated versions | LI-02, FM-00 |
| **REL-12** | Engagement Instrument → Variation Instrument | 1 : many | Sanction-dated | SY-5 — only SANCTIONED enter valuation |
| **REL-13** | Engagement Instrument → Running Bill | 1 : many, sequenced | Cumulative chain | LAW-6, RBL-04 |
| **REL-14** | Engagement Instrument → Retention | 1 : 1 accrual position | Continuous | FM-15 capped |
| **REL-15** | Engagement Instrument → Final Account | 1 : 0..1 | At closure | LC-11 |
| **REL-16** | Deployment → Work Assignment | 1 : many | Assignment within deployment window | LI-04 |
| **REL-17** | Work Assignment → Activity | many : 1 | Reference to CAP-PPM | ASG-03 |
| **REL-18** | Work Assignment → Attendance Record | 1 : many | Assignment precedes attendance date | LI-03, SY-9 |
| **REL-19** | Muster Roll → Attendance Record | 1 : many | Period-bounded | ATT-17 — closed muster accepts none |
| **REL-20** | Attendance Record → Attendance Record (supersession) | 1 : 0..1 | Successor references predecessor | ATT-16, LAW-11 |
| **REL-21** | Attendance Record → Settlement Sheet | many : 1, **consuming** | One-way; consumed permanently | SY-2, ATT-20, LDG-10 |
| **REL-22** | Measurement Book → Measurement Entry | 1 : many, sequenced | Gap-free | MBK-04 |
| **REL-23** | Measurement Entry → Evidence Artefact | 1 : many | Attached at measurement | MSR-11, EV-2 |
| **REL-24** | Measurement Entry → Rate Schedule Item | many : 1, **by version** | Resolved by work date | FM-00, RR-4 |
| **REL-25** | Measurement Entry → Measurement Entry (supersession) | 1 : 0..1 | Successor references predecessor | MSR-12, RV-1 |
| **REL-26** | Measurement Entry → Running Bill | many : 1, **consuming** | One-way; reversible only under MSR-13 | SY-1, LM-6, LDG-09 |
| **REL-27** | Running Bill → Payment Voucher | 1 : 0..many | Part payment leaves the bill live | LI-09, RBL-14 |
| **REL-28** | Payment Voucher → Disbursement | 1 : 1..many | Failure reinstates | LI-24, RBL-15 |
| **REL-29** | Advance → Recovery | 1 : many | Scheduled then applied | FM-09, FM-10 |
| **REL-30** | Issued Value Record → Recovery | 1 : 1 obligation | Created at issue, automatically | LI-14, REC-01 |
| **REL-31** | Any object → Approval Record | 1 : many | Records the subject's state at approval | CP-6, AGG-16 |
| **REL-32** | Any object → Exception Record | 1 : many | Cross-cutting; attaches to any object | § 5.27 |
| **REL-33** | Any financial or evidentiary act → Audit Trail entry | 1 : 1 | Mandatory, append-only | AT-1, AT-2 |
| **REL-34** | Hindrance Record → Attendance Record | 1 : many | Cause for payable non-working time | ATT-13, CLB-05 |
| **REL-35** | Site Instruction → Variation Instrument | 1 : 0..1 | **Instruction precedes execution** | LI-20, CTL-14, VAR-03 |

**RL-1 — Every relationship crossing an aggregate boundary is by identity** (AB-3), and the
referenced object's own state governs whether the reference is usable. A bill referencing a
measurement entry cannot make that entry billable; only the entry's own state can.

**RL-2 — Consuming relationships (REL-21, REL-26) are one-way and recorded in a register**
(LDG-09, LDG-10), never inferred from the presence of the reference.

**RL-3 — Supersession relationships (REL-20, REL-25) form a chain that is never broken and never
compacted.** The chain's length is itself a monitored signal (RV-4, KPI-23).

## 15.8 Ownership model

> Part 5 assigns each object an **owner accountable for its correctness**. The model adds the
> distinction between the three kinds of ownership that Part 4 keeps separate and that are routinely
> conflated in information systems.

| Ownership kind | Question | Held by |
|---|---|---|
| **Accountable owner** | Who answers when it is wrong? | The actor named in the object's § 5.x *Owner* facet |
| **Custodial owner** | Who holds it and could alter it? | The custodian recorded under CC-1; for digital records, whoever holds administrative capability (CC-3) |
| **Authoring party** | Who created this record? | The individual named on the record (DI-2, MBK-10) |

**OW-1 — These three are recorded separately and are frequently different actors.** Conflating them
is how accountability disappears: a record authored by one person, held by another, and answered for
by a third has three points of failure and, if the model records only one, two of them are invisible.

**OW-2 — Custodial ownership of digital evidence is a governed, monitored fact** (CC-3, DI-8,
SEC-12), because the party who can alter a record silently is the party the integrity model must
constrain.

**OW-3 — Ownership never transfers implicitly.** Demobilisation, project closure, personnel change,
and system replacement are custody events requiring formal transfer (CC-2, CLS-14, EP-6).

**OW-4 — No object is unowned at any moment of its life**, including in archive (LI-33, EP-3).

## 15.9 Lifecycle binding

**LB-1 — The states in this model are exactly the states of Part 5 and Part 6.** No state is added,
renamed, merged, or split. The model contributes only the constraint that **state is a property of
the entity and is changed only through its aggregate root** (AB-2).

**LB-2 — Every state change is a State Transition value object (VO-18)** carrying from-state,
to-state, actor, moment, authority, and reason. **A state change recorded only as a new state has
destroyed the evidence of who changed it and why** (CP-6, AT-1).

**LB-3 — Permitted transitions are exactly those drawn in Part 6.** A transition not drawn does not
exist (§ 6.1.2), and the model must make undrawn transitions unreachable rather than merely
unattempted.

**LB-4 — Transition authority is the § 6.14 matrix**, evaluated against the delegation register at
the moment of the act (SEC-05), not at the moment authority was granted.

**LB-5 — Terminal states are terminal** (§ 6.16, LM-5). An object in a terminal state is never
revived; the correct construction is a new object referencing it.

**LB-6 — Consumption is a state, not a flag** (LM-6). `BILLED`, `SETTLED` and their equivalents are
states in Part 5's lifecycles, and the consumption registers (LDG-09, LDG-10) record the consuming
party.

## 15.10 Event history

**EH-1 — The twenty-two enterprise events of § 11.11.2 are the model's event vocabulary**, unchanged
and unextended (DD-2).

**EH-2 — An event is a business fact that has occurred**, recorded in the past tense, immutable, and
never deleted. **Events are not messages, notifications, or system signals** (EV-M2).

**EH-3 — Every event records: event type, subject object identity, moment of occurrence, moment of
record, actor, and the evidence fixed at that moment** (§ 11.11.2, TS-2).

**EH-4 — Event history is the enterprise's reconstruction mechanism.** The position of any object on
any past date is derivable from its event history, which is what makes RI-0 (identities evaluable for
any date) and LG-3 (point-in-time ledger derivation) possible.

**EH-5 — Evidence fixed at an event does not change afterwards** (EV-M3). Supersession adds; it does
not revise the event that occurred.

**EH-6 — Every event is a control point** (EV-M1). Where an event occurs and no control is
evaluated, the model has a gap by construction — and this is the test the model offers Part 9: **every
rule should be evaluable at a named event.**

## 15.11 Audit history

**AH-1 — Audit history is distinct from event history and both are mandatory.** An event records
*what happened in the business*; the audit trail records *what was done to the record*, including
acts that changed nothing and acts that were refused (AT-3).

**AH-2 — The audit trail records every financial and evidentiary act** with actor, time, prior
state, new state, authority relied upon, and reason where discretionary (AT-1).

**AH-3 — Refusals, rejections, and failed attempts are recorded as fully as successes** (AT-3,
EXC-09, PEL-12). **The pattern of what was attempted and refused exists nowhere else and is
frequently the most valuable investigative signal the enterprise holds.**

**AH-4 — Sensitive reads are recorded where the risk model requires** (AT-4) — payee data, exposure
positions, and evidence under investigative hold.

**AH-5 — The audit trail is retained for the full evidence-retention period and is itself subject to
retrieval testing** (AT-5, EP-4).

**AH-6 — Version history is part of the record, not a system artefact** (DI-6). Every superseded
version is retrievable, legible, and attributed, permanently.

## 15.12 Referential integrity

> **These constraints are the model's contribution to enforcement.** Each restates an existing
> invariant, identity, or rule as a condition on the information itself, so that an implementation
> can be tested against it. **None is new law.**

| ID | Constraint | Derives from | Scope |
|---|---|---|---|
| **DMC-01** | A worker identity exists exactly once enterprise-wide and is never re-issued | WRK-02, EN-1 | Global |
| **DMC-02** | No attendance record may exist without a worker identity in a payable state | WRK-01, WRK-08 | Aggregate |
| **DMC-03** | No attendance record may exist outside a covering deployment | DEP-01, ATT-04 | Cross-aggregate |
| **DMC-04** | **At most one validated attendance record per worker per date, across all projects, contractors, suppliers and engagement types** | LI-16, ATT-06 | **Global — the model's single most important constraint** |
| **DMC-05** | Attendance may be validated only where an assignment covers the date | LAW-2, ATT-07, SY-9 | Cross-aggregate |
| **DMC-06** | No deployment may overlap another for the same worker | DEP-05, CLB-11 | Global |
| **DMC-07** | A worker belongs to at most one gang on any date | GNG-03 | Global |
| **DMC-08** | No measurement entry may carry a work date later than its record date | LAW-3, MSR-04, AF-2 | Aggregate |
| **DMC-09** | No measurement entry may reference a rate schedule item version not in force at its work date | FM-00, RR-1, RR-4 | Cross-aggregate |
| **DMC-10** | Measurement entry identity is unique enterprise-wide | AF-1, MSR-13 | Global |
| **DMC-11** | A measurement entry may be consumed by at most one bill at any time; restoration is recorded | LM-6, SY-1, MSR-13, LDG-09 | Global |
| **DMC-12** | A validated attendance day may be consumed by at most one settlement, ever | SY-2, ATT-20, LDG-10 | Global |
| **DMC-13** | Measurement Book entry sequence is gap-free; a gap requires a recorded explanation | MB-2, MBK-04 | Aggregate |
| **DMC-14** | No entry in a closed Measurement Book or a closed muster | MBK-08, ATT-17 | Aggregate |
| **DMC-15** | No posting into a CLOSED period; late facts carry a past effective date in an open period | PG-2, FIN-13 | Global |
| **DMC-16** | Cumulative certified value may never exceed sanctioned value plus **sanctioned** variations | LAW-9, RI-2, FM-07 | Cross-aggregate |
| **DMC-17** | Only variations SANCTIONED on or before the bill date may enter valuation | SY-5, VAR-06, EVL-06 | Cross-aggregate |
| **DMC-18** | Every advance carries a bound recovery plan from approval | LAW-7, LI-11, ADV-01 | Aggregate |
| **DMC-19** | Every issue of enterprise value creates a recovery obligation at the moment of issue | LAW-8, LI-14, REC-01 | Cross-aggregate |
| **DMC-20** | Retention accrual is cumulative and capped; `Ret_held` is derived, never stored as an independent fact | FM-15, LG-2, § 7.2 | Aggregate |
| **DMC-21** | Amount and payee of an approved voucher are immutable | LI-23, FIN-05, PEL-07 | Aggregate |
| **DMC-22** | A bill reaches PAID only on confirmed disbursement | SY-7, RBL-15 | Cross-aggregate |
| **DMC-23** | A failed or returned disbursement reinstates the liability automatically | LI-24, WKS-10 | Cross-aggregate |
| **DMC-24** | Originator, verifier, certifier and approver of one financial instrument are four distinct individuals | LAW-4, RBL-10, SOD-2 | Cross-aggregate |
| **DMC-25** | No approval outside the approver's delegated limit or delegation validity at the approval moment | RBL-11, SEC-05 | Cross-aggregate |
| **DMC-26** | No record is altered outside the supersession mechanism, by any role | LAW-11, SEC-10, DI-1, DI-8 | Global |
| **DMC-27** | No object is deleted; archival retains and remains retrievable | LAW-11, LI-33, AB-4, EP-2 | Global |
| **DMC-28** | Every state change carries actor, moment, authority and reason | CP-6, AT-1, LB-2 | Global |
| **DMC-29** | Every financial or evidentiary act produces an audit trail entry | AT-1, REL-33 | Global |
| **DMC-30** | Every evidentiary record carries its capture method and evidence tier | ATT-10, ME-11, HR-6 | Global |
| **DMC-31** | Every recorded fact carries both effective date and record date | TS-2, VOC-4, OVR-06 | Global |
| **DMC-32** | Borrowed labour debits and credits net to zero enterprise-wide | RI-11, BRL-01 | Global |

**DMI-1 — Global constraints are guaranteed at every moment; cross-aggregate constraints are
guaranteed at a defined point** (AB-1). Where this catalogue marks a constraint **Global**, an
implementation that enforces it only periodically has not implemented it.

**DMI-2 — DMC-04 is the constraint on which the labour path depends.** It is marked Global
deliberately: enforced at validation, not detected in reporting (LI-16). An implementation that
scopes worker identity per project cannot satisfy it, which is why EDR-09 exists.

**DMI-3 — DMC-26 and DMC-27 are the constraints most often defeated by administrative capability**
(RSK-51, ARB). They apply to every role without exception, including the most privileged.

## 15.13 Conceptual constraints

**CN-1 — Temporal constraint.** Every fact is true *as of* a date and *recorded* on a date, and the
two are always both present (DMC-31). Valuation, authority, statutory position, and classification
all resolve by **effective date**, never by record date (DP-12, GP-17).

**CN-2 — Monetary constraint.** Money is never stored as a bare number: it carries currency and
precision class (VO-01). Intermediates are full-precision; only the defined rounding points
(RPT-1…RPT-6) produce presented values (RND-1, RND-3).

**CN-3 — Identity constraint.** Identity is enterprise-wide, permanent, and never re-used (EN-1,
DMC-01, DMC-10). **Identity scoped to a project, a contractor, or a period voids every
anti-duplication control simultaneously.**

**CN-4 — Immutability constraint.** `[FINANCIAL]` and `[EVIDENTIARY]` records are append-only.
Correction is supersession with both records permanently visible (LAW-11, DMC-26).

**CN-5 — Derivation constraint.** Balances, positions, and totals are derived from ledgers, never
stored as independent facts (LG-2). Where a cache exists it is a cache, and the derivation governs.

**CN-6 — Completeness constraint.** A missing value is never a zero. Where a fact is unavailable, the
model records *unavailable*, and dependent financial computation stops (DP-3, GP-16, DT-4, KP-5).

**CN-7 — Evidence constraint.** Every evidentiary record carries its tier and capture method
(DMC-30), and every derived financial record carries the confidence of its weakest input (HR-2).

**CN-8 — Attribution constraint.** Every act names an individual, never a role, a department, or a
system (DI-2, SEC-01, MBK-10).

**CN-9 — Reconstruction constraint.** The complete position of the enterprise on any past date is
derivable from event history, ledgers, and audit trail, **without access to the personnel who
created it** (objective O-9, EH-4, LG-3, SC-6).

## 15.14 What this model deliberately does not say

Recorded so that a future implementer does not read an omission as an oversight.

| # | Not specified | Why |
|---|---|---|
| **NS-1** | Storage technology, schema, keys, indexes, partitioning | CP-12; the model must survive every technology it is implemented on |
| **NS-2** | Whether ledgers are materialised or computed | LG-2 requires only that the derivation govern; how is an implementation decision |
| **NS-3** | Transaction mechanics, concurrency control, locking | AB-1 states *what* must hold together; the mechanism is implementation |
| **NS-4** | Identifier format, generation, or encoding | EN-1 requires only permanence and non-reuse |
| **NS-5** | Retention mechanism, archival medium, migration approach | EP-1…EP-7 state the obligation; the medium will change many times |
| **NS-6** | Integration protocol, message format, synchronisation | Part 2 § 2.4 states what crosses the boundary and with what obligation; not how |
| **NS-7** | Access control mechanism | Part 9 SEC states the authority model; the enforcement mechanism is implementation |
| **NS-8** | Whether history is event-sourced, log-based, or versioned in place | EH-4 and CN-9 require reconstruction; the technique is free |

> **The test of this model's longevity.** If an implementation replaces its entire technology stack
> and this Part requires no amendment, the model was correct. **If any sentence in Part 15 had to
> change because a database changed, that sentence was never conceptual.**

---

> **Part 15 complete — 16 aggregates, 30 entities unchanged from § 5.1, 18 value objects,
> 13 ledgers, 35 relationships, 32 integrity constraints, 9 conceptual constraints.**

---

# PART 16 — EXCEPTION LIBRARY

## 16.1 Purpose and constitutional standing

This Part discharges **ARB-F12**. It is referenced normatively from Parts 2, 5, 9, and 10, and § 5.27
requires that every Exception Record (OBJ-26) carry an exception type *from this library*.

> **An exception is the enterprise's record of a moment when its own rules did not hold — either
> because someone authorised a deviation, or because reality produced a condition the rules did not
> permit.** LAW-12 governs both: recorded, attributed, time-boxed, and counted.

### 16.1.1 Adopted identifiers — unchanged

Five identifiers were established in the constitutional core before this Part was authored. **They
are adopted exactly as the core uses them, and MUST NOT be reinterpreted or renumbered** (ARB-F12):

| ID | Meaning as established | Established at |
|---|---|---|
| **XCP-01** | **Ghost labour** | § 2.3 D-13 — *"Ghost labour (XCP-01) becomes undetectable"* |
| **XCP-02** | **Duplicate attendance** | § 5.2, § 5.7 — *"duplicate attendance (XCP-02)"* |
| **XCP-03** | **Duplicate billing** | § 5.13 — *"duplicate billing (XCP-03, leakage L2)"* |
| **XCP-06** | **Borrowed labour conflict** | § 5.23 — the same worker's days borne twice |
| **XCP-16** | **Control circumvention** | § 5.25 — *"control circumvention (XCP-16)"* |

### 16.1.2 Exception classes

The constitutional core uses the word *exception* in two distinct senses, and this library separates
them because they carry different obligations.

| Class | Meaning | Governing rule | Who may authorise |
|---|---|---|---|
| **Class I — Blocked condition** | The rules do not permit it; the transaction stops. **Recorded, never authorised** | PEL-04, FIN-06, EXC-01 | **Nobody.** There is no authority to permit it |
| **Class II — Authorised deviation** | A procedure is relaxed by a named authority, within a time box, and counted | LAW-12, LC-12, EXC-03 | As stated per entry |
| **Class III — Detected condition** | An abnormal state discovered by a control, requiring investigation and disposition | EXC-02, AE-1…AE-10 | Disposition, not authorisation |

**XC-1 — No Class II authorisation may relax an Immutable Law** (LI-32, EXC-01, OVR-01). A request to
do so is refused, and **the refusal is itself recorded** (EXC-09).

**XC-2 — Every exception is time-boxed at authorisation** (LI-29) and **expires; it never renews by
inaction** (EXC-05, GP-14).

**XC-3 — Every exception is counted against its authoriser and reportable by authoriser for any
period** (LI-30, EXC-08). **An exception that is not counted has not been recorded.**

**XC-4 — Frequency is itself an escalation trigger** (LI-31, EXC-07, LA-5).

**XC-5 — Every exception is reviewed after closure** and feeds rule improvement (EXC-10). Closure
without review is prohibited.

### 16.1.3 Specification format

**Identifier · Class · Description · Trigger · Detection · Business impact · Mandatory actions ·
Escalation · Closure criteria · Audit requirements · Related rules · Related risks.**

---

## 16.2 Exception library

### Labour and attendance exceptions

**XCP-01 — Ghost labour** · *Class III*
- **Description.** Wages claimed or paid for workers who did not work, do not exist, or were never on site. **Trigger.** Attendance validated for a worker whose presence cannot be established; physical verification variance; productivity collapse without cause.
- **Detection.** AUD-05 unannounced identity-level count; ATT-18 independent presence signals; ATT-19 anomaly patterns; MR-6 productivity; RI-7.
- **Business impact.** Direct compounding loss; site strength unknown; every labour-cost decision built on a false denominator.
- **Mandatory actions.** Freeze the affected settlement; preserve evidence before scoping (IV-2); establish the population affected, not only the instance; quantify by Part 7; attribute to the gang leader **and** the supervising officer (GNG-10); raise recovery at waterfall priority 3–6.
- **Escalation.** E-L4. **Closure criteria.** Population established, loss quantified, recovery pursued or formally written off, root control identified and remediated (AUD-10).
- **Audit.** Full investigation record (§ 11.10.2); superseded and cancelled records preserved (AUD-09); finding reported to CEO/MD.
- **Rules.** WRK-01, WRK-02, WRK-13, ATT-02, ATT-05, GNG-04, GNG-10, BRL-08. **Risks.** RSK-01, RSK-04, RSK-54.

**XCP-02 — Duplicate attendance** · *Class I*
- **Description.** A second validated attendance record for one worker on one date, anywhere in the enterprise. **Trigger.** The single-occupancy test at validation (DMC-04).
- **Detection.** ATT-06 enterprise-wide test at validation — **prevention, not reporting** (LI-16).
- **Business impact.** Prevented at source. Where it reaches settlement, it is duplicate payment (L2) and the identity model has failed (EDR-09).
- **Mandatory actions.** Reject the second record; record the rejection with **both** source records and both intermediaries named; investigate where the same pair recurs.
- **Escalation.** E-L2 routine; E-L4 where a pattern indicates dual engagement or collusion. **Closure criteria.** Correct record identified and validated; the other superseded with reason.
- **Audit.** Rejection log retained; **rejection rate monitored — a rate of zero for two consecutive periods triggers a control-execution check** (KPI-12).
- **Rules.** ATT-06, WRK-02, WRK-07, BRL-05, BRL-10, CLB-07. **Risks.** RSK-02, RSK-27.

**XCP-05 — Proxy attendance** · *Class III*
- **Description.** One worker registering presence for another — shared credential, shared biometric enrolment, passed token. **Trigger.** Capture anomalies: sequential captures seconds apart, one device across dispersed fronts, enrolment irregularity.
- **Detection.** Capture-sequence and device analysis; enrolment audit; AUD-05.
- **Business impact.** Undermines the strongest available attendance evidence class, degrading every downstream control that relies on it.
- **Mandatory actions.** Suspend the capture mechanism for the affected population; re-enrol under supervision; re-verify the period by independent means; recover confirmed days.
- **Escalation.** E-L3; E-L4 where enrolment collusion is indicated. **Closure criteria.** Re-enrolment complete, period re-verified, recovery pursued.
- **Audit.** Enrolment records and capture metadata preserved (DI-4, DI-5); evidence demoted for the affected period (CL-5).
- **Rules.** WRK-03, ATT-10, SEC-01. **Risks.** RSK-10, RSK-01.

**XCP-06 — Borrowed labour conflict** · *Class I*
- **Description.** The same worker's days borne by two projects or by neither; unmatched transfer entries. **Trigger.** Transfer without a matched same-date ledger entry; enterprise-wide debit/credit imbalance.
- **Detection.** RI-11 net-to-zero test; DMC-32; LI-16 at validation; KPI-20.
- **Business impact.** Cost misstated in both directions; productivity distorted on both sides; duplicate settlement where it reaches payment.
- **Mandatory actions.** Identify both sides; obtain dual acknowledgement (BRL-02); correct the ledger; recover any duplicated settlement; **attendance attribution follows ATT-06's transfer-date rule**.
- **Escalation.** E-L2; E-L3 where value has settled. **Closure criteria.** Ledger nets to zero; both officers have acknowledged; any duplicate recovered.
- **Audit.** Both project records retained; residue history preserved.
- **Rules.** BRL-01, BRL-02, BRL-03, DEP-06, CLB-11, ATT-06. **Risks.** RSK-27, RSK-02.

**XCP-07 — Labour transfer without dual acknowledgement** · *Class III*
- **Description.** A transfer recorded by one side only. **Trigger.** Deployment closed or opened without the counterpart entry within the defined window.
- **Detection.** Deployment overlap test (DMC-06); LDG-03 unmatched entries.
- **Business impact.** The precondition for XCP-06; cost lands on the wrong project.
- **Mandatory actions.** Obtain the missing acknowledgement or reverse the transfer; record which officer failed to acknowledge.
- **Escalation.** E-L2. **Closure criteria.** Both sides acknowledged and dated, or transfer reversed.
- **Audit.** Acknowledgement record retained; recurrence by officer monitored.
- **Rules.** BRL-02, DEP-05, DEP-06. **Risks.** RSK-27.

**XCP-36 — Retrospective assignment or backdating** · *Class III*
- **Description.** A record whose effective date precedes its creation date, including assignments generated to match attendance already captured. **Trigger.** Any effective-date/record-date divergence (DMC-31).
- **Detection.** OVR-06 backdating report; KPI-62; creation-timestamp clustering.
- **Business impact.** Converts LAW-2's second limb into a formality while appearing to satisfy it; degrades evidence to H-7 (HR-4).
- **Mandatory actions.** Record as backdated — **never silently accept**; require justification from an actor other than the record's creator (LI-03); label the evidence as reconstructed.
- **Escalation.** E-L2; E-L3 where concentrated by actor or period. **Closure criteria.** Justification recorded and accepted, or the record withdrawn.
- **Audit.** Both dates retained permanently; frequency reported by actor.
- **Rules.** ASG-01, ASG-11, ATT-01, OVR-06, DEP-09. **Risks.** RSK-07, RSK-09, RSK-38.

### Measurement exceptions

**XCP-03 — Duplicate billing** · *Class I*
- **Description.** A verified measurement entry consumed by more than one bill. **Trigger.** Attempt to bill an entry already in a consumed state.
- **Detection.** LDG-09 consumption register; DMC-11; RI-1; the cumulative form of the running account exposes it at the next bill (LAW-6).
- **Business impact.** Direct duplicate payment; contractor account misstated.
- **Mandatory actions.** Block the second consumption; where it has settled, correct cumulatively at the next bill and recover; investigate whether a bill cancellation restored entries without re-verification (MSR-13).
- **Escalation.** E-L3. **Closure criteria.** Consumption register consistent; duplicate recovered; restoration path audited.
- **Audit.** Consumption history for every affected entry preserved; restoration acts attributed.
- **Rules.** MSR-13, RBL-02, RBL-13. **Risks.** RSK-18, RSK-16.

**XCP-10 — Measurement cancellation after billing** · *Class II*
- **Description.** Cancellation or rejection of a bill whose entries were already consumed, requiring their restoration. **Trigger.** Bill moves to CANCELLED or REJECTED after certification.
- **Detection.** LDG-09 restoration events; MSR-13.
- **Business impact.** The mechanism by which XCP-03 occurs if restoration is silent or bulk.
- **Mandatory actions.** Return entries to `VERIFIED` **as an attributed act recorded against both the bill and each entry**; require fresh check-measurement confirmation before re-billing; **restoration may not be performed by the actor who prepared the cancelled bill**.
- **Escalation.** Authorised by Finance Controller. **Closure criteria.** Entries re-verified; re-billing complete or entries formally withdrawn.
- **Audit.** Restoration attributed; re-verification evidenced; frequency by actor monitored.
- **Rules.** MSR-13, RBL-13, MSR-06. **Risks.** RSK-18.

**XCP-11 — Disputed measurement** · *Class III*
- **Description.** A measurement contested by the contractor. **Trigger.** Dispute raised; entry moves to `DISPUTED`.
- **Detection.** State transition; ageing against the MD-4 clock; KPI-66.
- **Business impact.** Value not billable while disputed. **Ageing converts it into the bulk negotiation LI-26 prohibits** (RSK-70).
- **Mandatory actions.** Exclude the disputed entry only — **undisputed entries in the same bill proceed** (MD-1, PEL-04); joint re-measurement while the work remains measurable (MD-2); resolution produces a **new measurement, never an edit** (MD-3).
- **Escalation.** Automatic on the MD-4 clock, to Project Director then Finance Controller. **Closure criteria.** New measurement recorded and accepted, or formal dispute process concluded.
- **Audit.** Original and resolving measurements both retained; age at resolution recorded.
- **Rules.** MSR-18, MD-1…MD-4, PEL-04. **Risks.** RSK-70, RSK-45.

**XCP-12 — Missing evidence** · *Class I*
- **Description.** A measurement or attendance record lacking an artefact its method requires. **Trigger.** Evidence-completeness test at verification or validation.
- **Detection.** MSR-11, ME-12, EV-3; KPI-30; evidence confidence assessment (§ 11.4).
- **Business impact.** **Absence of evidence is not neutral** (EA-5): the record is deficient, and value resting on it cannot exceed Low confidence — insufficient for concealed work, final accounts, or disputes (CL-2).
- **Mandatory actions.** Return to the originator — **the checker does not complete the measurer's record** (ME-12); where the work has become unverifiable, record the loss of verifiability rather than substituting later evidence.
- **Escalation.** E-L2; E-L3 where the work is concealed or at final account. **Closure criteria.** Evidence supplied contemporaneously, or the deficiency recorded and the value treated per CL-2.
- **Audit.** Deficiency recorded permanently; later-attached evidence labelled as later (EV-2).
- **Rules.** MSR-11, ME-12, EV-2, EV-3, CL-2. **Risks.** RSK-58, RSK-66, RSK-61.

**XCP-30 — Evidence integrity failure** · *Class III*
- **Description.** Evidence found to be fabricated, duplicated, reused, or altered outside supersession. **Trigger.** Duplicate artefact detection; timestamp or location inconsistency; supersession chain break; integrity verification failure.
- **Detection.** § 11.7 integrity checks (DI-1…DI-8); PH-3 duplicate detection; TS-1, LV-2; MBK-12.
- **Business impact.** The evidence layer beneath CP-7 becomes unreliable; every figure derived from it is demoted (HR-2, CL-5).
- **Mandatory actions.** Preserve before examining (IV-2); void the affected records; reconstruct from independent-process evidence where it exists (EA-4); **downgrade the confidence of every dependent figure and review the payments** (CL-5).
- **Escalation.** E-L4, bypassing any actor who is a subject (ES-2). **Closure criteria.** Scope established, dependent value reviewed, control failure remediated.
- **Audit.** Restricted circulation, unrestricted evidence access (IC-1); statutory reporting obligations assessed.
- **Rules.** MBK-09, SEC-10, SEC-11, MSR-12. **Risks.** RSK-58, RSK-51, RSK-59, RSK-60.

### Valuation, rate and billing exceptions

**XCP-09 — Invalid or unauthorised rate** · *Class I*
- **Description.** Valuation attempted at a rate not in force at the work date, not in the bound schedule, or derived by analogy. **Trigger.** Rate resolution failure (FM-00, RR-1); site-agreed rate presented.
- **Detection.** DMC-09; KPI-35; RI-1 recomputation.
- **Business impact.** Silent, compounding rate leakage — L7 in its purest form (§ 1.4.11).
- **Mandatory actions.** Block valuation; route to the star-rate procedure (§ 8.10) with derivation recorded; **never price by analogy or by the nearest available rate** (PC-3).
- **Escalation.** E-L2; E-L3 where the work is already executed and pricing must occur under duress (SR-3). **Closure criteria.** Rate approved as a versioned schedule item with derivation record (SR-4).
- **Audit.** Derivation retained; proportion of value at star rates monitored (KPI-29).
- **Rules.** CTL-07, MSR-14, RBL-06, SR-1…SR-4, RR-4. **Risks.** RSK-14, RSK-44.

**XCP-25 — Ceiling breach attempt** · *Class I*
- **Description.** A bill or certification that would take cumulative certified value beyond sanctioned value plus sanctioned variations. **Trigger.** FM-07 at step 6 of § 7.8.
- **Detection.** RI-2, computable for any date; KPI-32 utilisation warning band.
- **Business impact.** Would commit the enterprise to value no authority sanctioned. **LAW-9 admits no exception whatever.**
- **Mandatory actions.** **Reject the bill.** Not approve at a higher level, not part-pass to the ceiling, not defer the excess. Raise the ceiling by sanctioned variation (LC-09) or do not pay.
- **Escalation.** E-L3 to Finance Controller; recurrence to CEO/MD. **Closure criteria.** Variation sanctioned and effective on or before the bill date, or the value withdrawn.
- **Audit.** Every rejection recorded; **repeated attempts on one instrument are an investigation trigger**.
- **Rules.** RBL-05, EVL-04, VAR-01, CLS-03. **Risks.** RSK-19, RSK-44.

**XCP-15 — Negative settlement** · *Class III*
- **Description.** A computed net payable below zero: the counterparty owes the enterprise. **Trigger.** FM-19 or FM-28 yields a negative.
- **Detection.** Computation; KPI-39.
- **Business impact.** **Legitimate and important** — the running account self-correcting a prior over-certification (PA-4). The exception exists because suppression, not occurrence, is the failure.
- **Mandatory actions.** Present as a negative figure; post as a receivable to the contractor account; pursue through the ordinary waterfall. **Never floor at zero, never net across instruments without a recorded set-off** (NEG-2, NEG-3).
- **Escalation.** E-L2; E-L3 where it arises from a discovered over-certification. **Closure criteria.** Receivable recovered or formally written off.
- **Audit.** Presentation and posting evidenced; cause traced to the over-certification.
- **Rules.** RBL-18, FIN-09, FIN-10, NEG-1…NEG-3. **Risks.** RSK-11, RSK-15.

**XCP-20 — Contract amendment out of sequence** · *Class III*
- **Description.** A variation whose executed work predates its instruction record, or work executed outside instrument scope without a recorded site instruction. **Trigger.** VAR-03 date comparison; ASG-06 scope test.
- **Detection.** REP-29 register; instruction-date against execution-date.
- **Business impact.** § 1.4.7 — the enterprise pays claims it cannot evaluate because the only contemporaneous record belongs to the claimant.
- **Mandatory actions.** Flag; require justification recorded by an actor other than the originator; evaluate and sanction or reject. **A rejected variation creates no entitlement** (LI-21) — the consequence is a commercial dispute, not a measurement adjustment.
- **Escalation.** E-L2; E-L3 where cumulative variation exceeds its threshold (VAR-10). **Closure criteria.** Variation sanctioned with derivation, or rejected with the commercial consequence routed to CAP-LEG.
- **Audit.** Instruction and variation dates retained; proportion monitored.
- **Rules.** CTL-14, VAR-02, VAR-03, VAR-08, ASG-06. **Risks.** RSK-41, RSK-44.

**XCP-35 — Unbounded day work** · *Class III*
- **Description.** Time-based payment for contracted work without cap, prior authorisation, or output reconciliation. **Trigger.** Day-work value exceeding its governed proportion, or day work with no corresponding measured output.
- **Detection.** Day-work proportion reporting; MR-6.
- **Business impact.** Converts an outcome contract into an unmeasured time contract at outcome prices, removing LAW-1 from the payment path (UG-3).
- **Mandatory actions.** Cap and authorise in advance; reconcile to output; convert to measured items where measurable. **Day work already worked is generally payable** — the control is preventive.
- **Escalation.** Executive authorisation, time-boxed, counted. **Closure criteria.** Day work concluded or converted; proportion returned within band.
- **Audit.** Authorisations and proportion trend retained.
- **Rules.** DWG-04, CTL-01, UG-3. **Risks.** RSK-13.

### Payment exceptions

**XCP-04 — Duplicate payment** · *Class I*
- **Description.** The same entitlement disbursed more than once — a re-issued voucher, a revived cancelled bill, or a second settlement of a consumed day. **Trigger.** Voucher raised against an already-settled basis; RI-6 divergence.
- **Detection.** RI-6 cumulative paid vs confirmed disbursements; XR-18; LDG-09/LDG-10 consumption registers.
- **Business impact.** Direct loss; contractor or worker account misstated; recovery depends on counterparty cooperation.
- **Mandatory actions.** Block; where disbursed, raise the receivable immediately (XCP-15 route) and recover through the waterfall; establish whether consumption marking failed or was reversed.
- **Escalation.** E-L3; E-L4 where reversal was deliberate. **Closure criteria.** Recovery complete or written off; consumption control remediated.
- **Audit.** Both payment records retained; the reversal or restoration act attributed.
- **Rules.** MSR-13, ATT-20, RBL-15, PEL-01. **Risks.** RSK-18, RSK-16, RSK-46.

**XCP-18 — Emergency or out-of-turn payment** · *Class II*
- **Description.** Payment released ahead of its normal sequence under urgency. **Trigger.** Emergency request.
- **Detection.** Exception register; KPI-60 concentration by authoriser and counterparty.
- **Business impact.** Legitimate where it bypasses **sequence**; catastrophic where it bypasses **evidence** — LA-5 makes the second permanent.
- **Mandatory actions.** **Verified evidence must exist** — PEL-10 prohibits emergency payment against unverified measurement or unvalidated attendance, and LI-32 places this beyond any authority. Record authority, reason, expiry; count it; regularise within the time box (EXC-04).
- **Escalation.** Executive authorisation; post-facto review within the time box (AE-9). **Closure criteria.** Regularised through the normal sequence, or recovered.
- **Audit.** Concentration by counterparty and authoriser monitored — **40% of one contractor's value through this route is the RSK-42 signature**.
- **Rules.** PEL-10, EXC-04, LI-32, OVR-04. **Risks.** RSK-42, RSK-43.

**XCP-19 — Settlement reversal** · *Class III*
- **Description.** A disbursement failed, returned, recalled, or reversed after instruction. **Trigger.** Channel failure notification; recall; unresolved beyond the reconciliation window.
- **Detection.** LC-10 states; LI-25 window breach; KPI-40.
- **Business impact.** **A failed payment that disappears is an unrecorded enterprise gain and an unpaid counterparty simultaneously** (LI-24).
- **Mandatory actions.** Reinstate the entitlement **automatically**; re-attempt or re-originate; where the payee is a worker, treat as a live obligation (WKS-10); never absorb.
- **Escalation.** E-L2; E-L3 where unresolved beyond the window. **Closure criteria.** Payment confirmed or entitlement reinstated and visible.
- **Audit.** Failure cause, reinstatement, and re-attempt retained.
- **Rules.** RBL-15, WKS-10, LI-24, LI-25. **Risks.** RSK-46, RSK-38.

**XCP-27 — Payee or banking identity change** · *Class II*
- **Description.** A request to change the payment destination for an existing counterparty. **Trigger.** Any such request, by any channel.
- **Detection.** Change-control workflow; SEC-07; account de-duplication across counterparties.
- **Business impact.** **The highest-value, lowest-effort fraud available to anyone with access to correspondence** (RSK-46), and it succeeds because the request looks routine.
- **Mandatory actions.** Verify through a channel **independent of the one that carried the request**; separate requester, verifier, and applier; retain the prior details permanently; **never apply to an already-approved voucher** (LI-23).
- **Escalation.** Finance Controller authorisation; AE-8 requires verification before any payment. **Closure criteria.** Verified, applied, and the first subsequent payment confirmed to the counterparty.
- **Audit.** Full change history permanent; shared-account detection across counterparties.
- **Rules.** WRK-10, SEC-07, PEL-11. **Risks.** RSK-46, RSK-52.

### Recovery, advance and retention exceptions

**XCP-13 — Recovery failure or deferral** · *Class II (deferral) / Class III (failure)*
- **Description.** Recovery due in a period not applied — deferred with authority, or simply omitted. **Trigger.** Bill or settlement verification finds recovery due and unapplied.
- **Detection.** RBL-07 gate; REC-09 completeness check; RI-3, RI-4; KPI-42, KPI-46.
- **Business impact.** L5 — the largest leakage class in aggregate and the least policed, because nothing visibly goes wrong (§ 1.5).
- **Mandatory actions.** Apply, or record a deferral with authority, reason, and expiry; **bounded in number of consecutive periods** — beyond the bound it escalates automatically (REC-10); silent omission is prohibited.
- **Escalation.** Finance Controller; automatic on consecutive-period breach. **Closure criteria.** Recovery applied, or formally waived by an authority separated from the obligation's originator (SOD-8).
- **Audit.** Deferral count by authoriser and counterparty; **rolling deferral is silent waiver and is reported as such**.
- **Rules.** REC-04, REC-09, REC-10, ADV-06, RBL-07. **Risks.** RSK-20, RSK-21, RSK-28.

**XCP-24 — Advance security lapse** · *Class III*
- **Description.** A secured advance whose security has expired, was never received, or is worth less than the outstanding. **Trigger.** Expiry date reached; outstanding exceeds security value.
- **Detection.** Security register against advance outstanding; KPI-43 with expiry alerting.
- **Business impact.** **The enterprise believes it is protected and behaves accordingly — worse than knowing it is exposed** (RSK-23).
- **Mandatory actions.** Escalate **before** expiry; demand extension or replacement; accelerate recovery; suspend further payment where the security is not restored.
- **Escalation.** Finance Controller; E-L3. **Closure criteria.** Security restored and sufficient, or the advance recovered.
- **Audit.** Expiry monitoring evidenced; lapse duration recorded.
- **Rules.** ADV-04, ADV-05, ADV-08. **Risks.** RSK-23, RSK-67.

**XCP-14 — Retention release outside conditions** · *Class II*
- **Description.** Retention released before its conditions were satisfied, or released without netting outstanding recovery. **Trigger.** Release requested or effected outside RET-04's positive condition test.
- **Detection.** Condition-test evidence at release; KPI-50; RI-5.
- **Business impact.** Removes the enterprise's residual security **exactly before the period in which defects appear** (LI-17).
- **Mandatory actions.** Refuse; where the enterprise chooses to assist a contractor's cash position, use an advance with a recovery plan (LC-06) — **not an early release**. Where executive authority releases early, require security substitution, record, and count.
- **Escalation.** Finance Controller minimum; executive authority for release before conditions. **Closure criteria.** Conditions satisfied retrospectively, security substituted, or the release recovered.
- **Audit.** Each early release reported individually; RI-5 reconciled.
- **Rules.** RET-04, RET-05, RET-06. **Risks.** RSK-29, RSK-43.

### Statutory and worker exceptions

**XCP-08 — Invalid wage** · *Class I*
- **Description.** A computed wage below the statutory minimum for trade, grade, region and date, or computed at a rate outside the authorised schedule. **Trigger.** FM-25 failure at settlement; rate not resolvable.
- **Detection.** LAB-06 per-worker test; WKS-04 approval gate; KPI-51.
- **Business impact.** Statutory breach with penalty, interest, third-party liability, and site unrest — **independent of the sum at issue**.
- **Mandatory actions.** **Block the settlement** (WKS-04). Correct the rate as an attributed act with a recorded reason — **never a silent top-up** (MW-1, LAB-07, PC-10). Pay arrears. Test against the worker's own receipt, not the intermediary's invoice (MW-2).
- **Escalation.** E-L3 to Finance Controller; E-L4 where systemic. **Closure criteria.** Rate corrected forward, arrears paid, cause identified (schedule, statutory update, or intermediary margin).
- **Audit.** Failures listed individually in REP-20; correction attributed.
- **Rules.** LAB-06, LAB-07, WGR-05, WGR-06, WKS-04, MW-1…MW-3. **Risks.** RSK-30, RSK-37.

**XCP-22 — Statutory deduction or ceiling breach** · *Class I*
- **Description.** Deductions from a worker's wages exceeding the lawful ceiling, unauthorised, or unrecorded. **Trigger.** FM-27 ceiling test at settlement.
- **Detection.** LAB-11, REC-13; KPI-55; wage-card audit.
- **Business impact.** **A statutory breach committed in pursuit of good recovery discipline** — the most common way a control becomes an offence.
- **Mandatory actions.** Cap the deduction at the ceiling; **carry the excess forward, never breach**; refund any excess already taken; where an intermediary imposed it, recover from them.
- **Escalation.** E-L3; Legal where systemic. **Closure criteria.** Refund complete; practice corrected.
- **Audit.** Per-worker evidence; intermediary conduct recorded against KPI-05.
- **Rules.** LAB-11, LAB-12, REC-13, ADV-11, FM-27. **Risks.** RSK-37, RSK-30.

**XCP-23 — Unpaid worker / intermediary default** · *Class III*
- **Description.** A contractor or supplier paid by the enterprise has not paid the workers it deployed. **Trigger.** Prior-period wage evidence absent (CTL-05); worker complaint; acknowledgement gap.
- **Detection.** CTL-05 payment gate; RI-8; KPI-53, KPI-54; direct worker enquiry.
- **Business impact.** Principal-employer liability, site stoppage, and double payment — **in that order and usually in the same week**.
- **Mandatory actions.** **Pay the validated workers directly** (CTL-06, PEL-11 — they are entitled payees, not third parties); recover from the intermediary at **waterfall priority 2**; withhold the intermediary's next settlement pending evidence. **The worker's wages are never withheld pending resolution of the commercial dispute** (PA-8).
- **Escalation.** E-L3 immediately; Legal; **the worker's grievance escalates on its own path** (ES-3). **Closure criteria.** Workers paid, recovery raised, intermediary performance recorded.
- **Audit.** Direct-payment records per named worker; intermediary conduct to CAP-SCM (integration O-4).
- **Rules.** CTL-05, CTL-06, LAB-05, LAB-10, BRL-09, BRL-13. **Risks.** RSK-32, RSK-05, RSK-33, RSK-67.

**XCP-34 — Unsettled validated attendance** · *Class III*
- **Description.** Validated attendance ageing without settlement, typically after demobilisation or intermediary termination. **Trigger.** Ageing threshold (WKS-11).
- **Detection.** RI-7; KPI-56; FC-10 at closure.
- **Business impact.** **An unrecorded enterprise gain and a statutory exposure simultaneously** — and the dues least likely to be claimed.
- **Mandatory actions.** Settle without requiring a claim (LAB-13); where the worker is unlocatable, hold as a liability with a defined statutory treatment — **never absorb as income**.
- **Escalation.** Automatic on ageing; E-L3 at closure. **Closure criteria.** Settled, or recorded as a liability with custody assigned.
- **Audit.** Ageing history retained; closure blocked while unresolved (FC-10, CLS-09).
- **Rules.** WKS-11, LAB-13, WRK-14, DEP-11, CLS-09. **Risks.** RSK-33.

### Contractual and closure exceptions

**XCP-21 — Contractor suspension** · *Class II*
- **Description.** A counterparty suspended for cause, performance, or statutory conduct. **Trigger.** Suspension decision.
- **Detection.** Instrument state; KPI-05 band change.
- **Business impact.** Suspension is frequently conflated with payment withholding, producing both unlawful withholding and abandoned recovery (WRK-12).
- **Mandatory actions.** Halt new execution and new measurement. **Continue** recovery, retention accounting, and settlement of verified work. **Crystallise outstanding advances immediately** (ADV-08, AR-2). Withholding, if any, is a **separate attributed act**, not a consequence of suspension.
- **Escalation.** Finance Controller and Project Director jointly. **Closure criteria.** Suspension lifted with recorded grounds, or converted to termination with LC-11 opened.
- **Audit.** Suspension grounds, duration, and financial treatment retained.
- **Rules.** WRK-12, CTL-11, ADV-08, REC-14. **Risks.** RSK-67, RSK-22.

**XCP-32 — Closure with open obligations** · *Class I*
- **Description.** Closure attempted while a dependent lifecycle, reconciliation, or obligation remains open. **Trigger.** Closure request with any of FC-1…FC-10 unresolved, or any dependent lifecycle non-terminal.
- **Detection.** CLS-08 terminal-state test; FC-1…FC-10; KPI-68.
- **Business impact.** § 1.4.12 — **where control collapses.** After final payment the enterprise has neither money nor leverage (LA-7).
- **Mandatory actions.** **Block closure.** Crystallise all recoveries (CLS-04); compute and levy or formally waive LD (CLS-05); carry retention past closure with assigned custody (CLS-07, RET-10); settle or record unsettled entitlement and unbilled value (CLS-09, CLS-10).
- **Escalation.** E-L3 blocking; E-L5 where a settlement above the computed figure is proposed. **Closure criteria.** All ten reconciliations to zero unexplained residue; all dependent lifecycles terminal; live obligations carried with custody.
- **Audit.** REP-55 closure report; **a no-claim certificate does not discharge any of this** (LI-28, CLS-06).
- **Rules.** CLS-02…CLS-11, FC-1…FC-10, SY-10. **Risks.** RSK-22, RSK-45, RSK-26.

**XCP-33 — Unbilled verified measurement** · *Class III*
- **Description.** Verified measurement ageing without being billed. **Trigger.** Ageing threshold; closure.
- **Detection.** RI-12; KPI-67; FC-9.
- **Business impact.** **Contractor detriment and hidden enterprise liability at the same time** — the enterprise has incurred a cost it has not recorded.
- **Mandatory actions.** Bill, or record an explicit reasoned exclusion; never allow silent lapse (CLS-10).
- **Escalation.** Automatic on ageing. **Closure criteria.** Billed or formally excluded with reason.
- **Audit.** Ageing and reason retained; closure blocked while unresolved.
- **Rules.** EVL-10, CLS-10, RI-12. **Risks.** RSK-70.

### Governance and control exceptions

**XCP-16 — Control circumvention** · *Class III*
- **Description.** Transactions split, sequenced, reclassified, or timed so that each falls within a limit or below a threshold the aggregate would breach. **Trigger.** Values clustering just below thresholds; multiple same-period instruments for one engagement; variations split.
- **Detection.** AF-5 threshold-clustering analysis; cumulative testing (GP-18, PEL-09); AUD-04 sampling **not limited to high values**.
- **Business impact.** **Splitting is the same offence as breaching, performed with more steps.** The delegation framework becomes advisory.
- **Mandatory actions.** Re-route to the correct authority; test cumulative position rather than instance size; record the circumvention as an attributed exception; **the threshold is not adjusted to accommodate the pattern**.
- **Escalation.** E-L3 to Internal Audit; E-L4 where an approver–counterparty pattern emerges. **Closure criteria.** Correct authority obtained; pattern ceased; actor recorded.
- **Audit.** Clustering analysis retained whether or not it fired; recurrence by actor monitored.
- **Rules.** RBL-12, PEL-09, VAR-07, SEC-05, SD-1. **Risks.** RSK-40, RSK-55.

**XCP-17 — Manual override** · *Class II*
- **Description.** A control bypassed by explicit authority. **Trigger.** Override exercised.
- **Detection.** Exception register; KPI-61; OVR-07 reporting by authoriser.
- **Business impact.** LA-5 — **any bypass used more than twice ceases to be an exception.**
- **Mandatory actions.** Name an individual, never a role (OVR-02); state a reason in the authoriser's own words, not a category code (OVR-03); time-box it (OVR-04); **the beneficiary may never authorise** (OVR-10); **no override may relax an Immutable Law** (OVR-01).
- **Escalation.** Automatic on frequency (OVR-08); E-L4 where self-benefiting. **Closure criteria.** Expired without renewal, or the underlying rule formally amended.
- **Audit.** Counted against the authoriser and reported (LI-30); refused requests recorded as fully as granted ones (EXC-09).
- **Rules.** OVR-01…OVR-10, EXC-03, EXC-05. **Risks.** RSK-47, RSK-42, RSK-72.

**XCP-26 — Period reopening** · *Class II*
- **Description.** A closed financial or attendance period reopened. **Trigger.** Reopening request.
- **Detection.** Period state change; OVR-05; REP-48.
- **Business impact.** A period that closes by the calendar and reopens by convenience **has no closing point at all**, and every figure already reported from it is invalidated.
- **Mandatory actions.** Finance Controller authority minimum; **both** period-reopening and any override affecting the period require separate authorisation (OVR-05); restate affected figures **visibly**; record what changed.
- **Escalation.** Finance Controller; recurrence to CEO/MD. **Closure criteria.** Period re-closed positively with a fresh checklist (PG-3) and restatements published.
- **Audit.** Reopening frequency by authoriser; restated figures retained alongside originals.
- **Rules.** PG-4, WKS-12, ATT-17, OVR-05, FIN-13. **Risks.** RSK-38, RSK-72.

**XCP-29 — Control suppression or non-execution** · *Class III*
- **Description.** A control did not run, or its threshold, tolerance, check percentage, or alerting was altered. **Trigger.** Non-execution recorded; configuration change; alert volume falling without process change.
- **Detection.** FIN-15 non-execution recording; SEC-12 configuration change with **independent** alerting; KPI-58.
- **Business impact.** **Every detective control becomes unreliable and the enterprise cannot tell which period is affected.** The absence of an alarm must never be achievable by disabling the alarm (FIN-16).
- **Mandatory actions.** Restore; **re-execute the controls over the entire suppressed period**; establish when the control last demonstrably ran (§ 11.10.3); attribute the change.
- **Escalation.** **E-L4 directly to Internal Audit and CEO/MD**, bypassing the operational line (ES-2). **Closure criteria.** Period re-executed, findings dispositioned, configuration governance restored.
- **Audit.** Configuration history with before/after values and actor; independent alert evidenced.
- **Rules.** FIN-15, FIN-16, SEC-12, AUD-06. **Risks.** RSK-50, RSK-72.

**XCP-31 — Reconciliation identity violation** · *Class I*
- **Description.** Any of RI-1…RI-12 or XR-01…XR-24 in breach, or **not computable**. **Trigger.** Identity evaluation at any date.
- **Detection.** FIN-12 on-demand evaluation; AUD-06; KPI-59.
- **Business impact.** A violated identity is **a control failure now**, not a report to investigate later — leakage detected after the leverage has gone is leakage lost (LA-7).
- **Mandatory actions.** Raise immediately; **block the dependent transaction where the identity governs it**; investigate the residue to source. **"Not computable" is itself a finding** (KP-5), never a pass.
- **Escalation.** E-L3 immediate. **Closure criteria.** Residue explained to zero or the underlying defect corrected.
- **Audit.** Identity status history retained, including periods where it could not be computed.
- **Rules.** FIN-12, AUD-06, RI-0. **Risks.** RSK-24, RSK-50.

**XCP-28 — Fraud investigation** · *Class III*
- **Description.** A suspected deliberate defeat of controls, including collusion between actors holding adjacent roles. **Trigger.** Any indicator of deliberate circumvention: pairing concentration, self-benefiting override, fabricated evidence, payee substitution, undisclosed related-party interest.
- **Detection.** AF-7 pairing analysis; KPI-37, KPI-61, KPI-62; whistleblower report; counterparty complaint.
- **Business impact.** **This is the exposure the constitution declares open** — SC-17 holds against any single actor and fails against two colluding ones (ARB-F4, § 10.8 Q2).
- **Mandatory actions.** **Preserve evidence before scoping** (IV-2) — scoping conversations alert the subjects; apply holds (EP-7); **interviews last** (IV-3); investigation conducted by an authority **outside the reporting line of every suspected participant** (IC-2); loss computed by Part 7, never estimated (IV-5).
- **Escalation.** **E-L4 or E-L5, bypassing any actor who is a subject** (ES-2); legal counsel early; statutory reporting obligations assessed.
- **Closure criteria.** Findings attributed to actors, controls and root cause (AP-6); loss quantified and recovery pursued; control remediated; **an investigation finding nothing still records what was tested** (IV-6).
- **Audit.** Restricted circulation, **unrestricted evidence access** (IC-1, AUD-09).
- **Rules.** AUD-09, AUD-10, SEC-03, OVR-10, WRK-11. **Risks.** RSK-53, RSK-54, RSK-55, RSK-56, RSK-46, RSK-52.

---

## 16.3 Library summary

| Class | Count | Meaning |
|---|---|---|
| **Class I — Blocked condition** | 10 | XCP-02, 03, 04, 08, 09, 12, 22, 25, 31, 32 |
| **Class II — Authorised deviation** | 8 | XCP-10, 13 *(deferral)*, 14, 17, 18, 21, 26, 27 |
| **Class III — Detected condition** | 18 | XCP-01, 05, 06, 07, 11, 15, 16, 19, 20, 23, 24, 28, 29, 30, 33, 34, 35, 36 |
| **Total** | **36** | |

**XS-1 — Ten of thirty-six are Class I: no authority in the enterprise may permit them.** That is
the library's principal finding, and it follows directly from § 9.32 — in a capability whose subject
is money leaving on evidence created at a distance, most rules are either structural or worthless.

**XS-2 — Every entry cites at least one business rule and one enterprise risk.** No exception exists
in this library that the constitutional core did not already anticipate.

**XS-3 — Identifier reservation.** XCP-01 … XCP-36 are permanent. **Identifiers are never reused,
renumbered, or reinterpreted** — including the five adopted from the core (§ 16.1.1). Future
exceptions are numbered from 37 onward.

---

> **Part 16 complete — 36 exceptions across 3 classes; ARB-F12 discharged.**

---

# PART 17 — ENTERPRISE GLOSSARY

## 17.1 Purpose and standing

> **LA-2: every undefined term is a leakage site.** This Part is the constitutional answer to that
> axiom. It is the canonical vocabulary of CAP-WFC-01, and it is binding: where a term is defined
> here, it carries this meaning throughout the capability and in every implementation of it.

**GL-1 — Every term defined here appears in the constitutional core or in Parts 12–16**, and cites
where. **No term is defined that the constitution does not use**, and no term the constitution uses
in a load-bearing sense is left undefined.

**GL-2 — Where general construction or accounting usage differs from the definition here, this
definition governs within this capability.** Industry usage is frequently loose in exactly the places
where money escapes — "completed", "verified", "as directed" — which is why LA-2 exists.

**GL-3 — Definitions are not restated rules.** A definition says what a word means; the cited rule
says what must be done. Where a definition appears to impose an obligation, the obligation is in the
cited rule and the definition merely names it.

**GL-4 — Terms are never redefined.** A change of meaning requires a new term, because records
written under the old meaning remain in force for the retention period (§ 3.4.4).

---

## 17.2 Glossary

### A

| Term | Definition | Source |
|---|---|---|
| **Advance** | Money paid to a contractor or worker **not against executed work**, carrying a recovery obligation from the moment of creation. Not a payment against work, and governed separately from LAW-1 | LAW-7, OBJ-17 |
| **Aggregate** | A cluster of entities and value objects that must change together to remain correct, changed only through its root | § 15.2 |
| **Anomaly signature** | A statistical pattern indicating a control failure or manipulation, distinct from an individual erroneous transaction | AF-4…AF-9, ATT-19 |
| **Approval** | An assumption of personal accountability by a named individual, at a named moment, under a named delegated authority. **Not a workflow step** | CP-6, OBJ-27 |
| **Approval base** | The figure tested against an approver's delegated limit: **cumulative certified value**, not net payable | RBL-11, B-1 |
| **Archival** | Removal from operational view with retention, legibility, and reconstructibility preserved. **Never deletion** | LI-33, EP-2 |
| **Assignment** | *See* **Work Assignment** | OBJ-07 |
| **Attendance record** | The evidentiary record that a specific worker was present on a specific date, captured at the point and time of occurrence | OBJ-09, ATT-01 |
| **Audit trail** | The append-only record of what was done *to the record* — including refused and failed acts — as distinct from event history, which records what happened in the business | AT-1…AT-5, § 15.11 |
| **Authority (engagement)** | The instrument establishing that a party may be paid at all, for what scope, at what rates, up to what ceiling | § 1.6, OBJ-04 |

### B

| Term | Definition | Source |
|---|---|---|
| **Backdating** | Recording a fact with an effective date earlier than its record date. **Legitimate; concealing that it occurred is not** | OVR-06, TS-4 |
| **Balance** | A conclusion derived from a ledger, never an independently stored fact | LG-2 |
| **Bill** | *See* **Running Bill** | OBJ-14 |
| **Borrowed labour** | Workers transferred between projects, sites, or contractors, creating a matched debit and credit and requiring dual accountability | OBJ-22, BRL-01, EDR-04 |
| **BOQ (Bill of Quantities)** | The schedule of items, units and rates consumed from CAP-DES/CAP-SCM; the basis of valuation, never authored within this capability | D-2, II-1 |

### C

| Term | Definition | Source |
|---|---|---|
| **Ceiling** | Sanctioned contract value plus formally approved variations. **Absolute; raised only by sanctioned variation** | LAW-9, FM-07 |
| **Certification** | Technical acceptance by the Project Manager that claimed work serves the project and is within delegated limit. Precedes financial approval and is distinct from it | § 6.6, RBL-10 |
| **Chain of custody** | The recorded sequence of custodians of an evidentiary object; for digital records, control of the **capability to alter** | CC-1…CC-4 |
| **Check measurement** | Independent verification of recorded measurement by test check or full re-measurement, by an actor who did not measure. **May confirm or reduce; never increase** | § 8.8, LI-06 |
| **Claim** | An assertion by a party who benefits from its content. **A claim is never evidence** | GP-13, § 4.3, HR-1 |
| **Confidence level** | The strength of a specific proposition given its supporting evidence: High, Medium, Low, or Unsupported | § 11.4 |
| **Consumption** | The permanent marking of an evidentiary unit as used by a financial instrument. **One-way; the structural defence against duplicate payment** | LM-6, GP-04, LDG-09, LDG-10 |
| **Contractor** | An external commercial counterparty executing contracted scope. **A counterparty, not an adversary** | OBJ-02, § 4.3 |
| **Contractor Account** | The ledger holding every movement against one engagement instrument; its balance is always derived | OBJ-25, LDG-01 |
| **Cumulative** | Computed from contract commencement to date, with the period figure derived as a difference. **Never accumulated forward from period figures** | LAW-6, PA-4, EDR-07 |

### D

| Term | Definition | Source |
|---|---|---|
| **Day work** | Payment for contracted work on a time basis rather than measured output. **The weakest contractual basis; must be bounded, authorised in advance, and reconciled to output** | UG-3, DWG-04, XCP-35 |
| **Defect liability period** | The period after physical completion during which retention remains a live liability and the enterprise's obligation persists | § 3.4.4, RET-10 |
| **Deployment** | The enterprise's statement of which workers are authorised to be at which project, site and front, over which dates. The outer boundary of the payable population | OBJ-06, DEP-01 |
| **Derived record** | A record computed from others, carrying the confidence of its weakest input | HR-2, § 15.2 |
| **Disbursement** | The execution of an approved payment instruction. Its mechanics belong to CAP-TRE; its authorisation belongs here | OBJ-21, § 3.4.2 |
| **Drillability** | The property that any presented figure decomposes, recursively, to primary evidence **without human explanation** | CP-7, RBL-16 |

### E

| Term | Definition | Source |
|---|---|---|
| **Earned value** | Cumulative gross value the contractor has become entitled to, before deductions, computed from verified quantities at bound rates | FM-06, EVL-01 |
| **Effective date** | The date a fact was true, as distinct from the date it was recorded. **Governs valuation, authority, and statutory position** | DP-12, VO-06 |
| **Engagement instrument** | Contract, work order, rate contract, or labour engagement establishing authority to be paid | OBJ-04 |
| **Entity** | A thing with independent identity that persists through change of every attribute | § 15.2 |
| **Escalation (delay/price)** | Contractual price variation computed on published indices. **Never estimated** | FM-05, ESC-1 |
| **Escalation (governance)** | Routing a matter to a higher authority, by severity **and** frequency independently | RG-2, § 11.10.4 |
| **Event (enterprise)** | A business fact that has occurred, recorded in the past tense, immutable. **Not a system message** | § 11.11.2, EV-M2 |
| **Evidence** | A record that constrains what can be said to have happened, as distinct from documentation, which describes what someone says happened | § 11.1 |
| **Evidence hierarchy** | The eight-tier ranking H-1…H-8 by which conflicting evidence is resolved for a given proposition | § 11.3 |
| **Evidence tier** | A property of how evidence was made; distinct from confidence, which is a property of a proposition | § 11.3, HR-6 |
| **Exception** | A recorded deviation from normal control — attributed, time-boxed, and counted against its authoriser. **An exception that is not counted has not been recorded** | LAW-12, OBJ-26, Part 16 |

### F

| Term | Definition | Source |
|---|---|---|
| **Fail closed** | The property that a financial path stops when a control cannot execute, rather than degrading to a weaker path | DP-3, FIN-06, EDR-10 |
| **Final account** | The closing settlement of an engagement, **computed before it is discussed** | OBJ-30, LI-26, EDR-08 |
| **Financial leakage** | The aggregate of all value that exits the enterprise without a corresponding, verified, earned entitlement — **regardless of intent** | § 1.5 |
| **Front (work front)** | The location granularity at which work is assigned and measured, precise enough to permit re-verification | MP-7, DEP-03 |

### G

| Term | Definition | Source |
|---|---|---|
| **Gang** | An organised group of workers under a named leader, with dated composition history | OBJ-03, GNG-01 |
| **Gang leader (Mate, Jamadar)** | The intermediary who assembles and supervises a gang. **Structurally conflicted: paid more when the headcount is higher** | § 4.2, EDR-06 |
| **Ghost labour** | Wages claimed or paid for workers who did not work, do not exist, or were never on site | XCP-01, RSK-01 |
| **Governing principle** | One of the twenty-four higher-order statements consolidating recurring rule patterns across domains | § 9.2 |

### H

| Term | Definition | Source |
|---|---|---|
| **Hindrance** | A recorded cause of non-working time attributable to site conditions or the enterprise. **Defends the enterprise as much as the contractor: unrecorded hindrance becomes an indefensible LD claim** | OBJ-28, LD-2 |

### I

| Term | Definition | Source |
|---|---|---|
| **Identity (worker)** | A permanent, enterprise-wide reference to one human being, surviving every change of contractor, site, trade, and gap in engagement | § 5.2, WRK-02, EDR-09 |
| **Immutable Law** | One of the twelve absolute statements admitting no exception, no override, no emergency bypass, and no delegated waiver | § 1.8 |
| **Independence (of verification)** | The property that a verifier is **structurally incapable of benefiting** from an incorrect verification | CP-2 |
| **Instruction (site)** | A direction given at site that changes scope, method, sequence or quantity, recorded on the day it is given | CTL-14, LI-20 |
| **Intermediary** | A gang leader, petty contractor, or labour supplier through whom workers are engaged or paid | § 4.2, § 4.4 |
| **Issued value** | Materials, plant, fuel, power, water or accommodation supplied by the enterprise to a contractor, creating a recovery obligation **at the moment of issue** | OBJ-29, LI-14 |

### J

| Term | Definition | Source |
|---|---|---|
| **Joint measurement** | Measurement taken in the presence of the contractor and recorded as such, binding both parties to the dimensions. **Mandatory before concealment.** Not verification | JM-1…JM-4, MSR-09 |

### K

| Term | Definition | Source |
|---|---|---|
| **KPI (constitutional)** | A named quantity derived from constitutional data by a stated formula, owned by one actor, bound to a rule or risk it observes. **Never adjusts entitlement** | § 12.1, KP-1 |

### L

| Term | Definition | Source |
|---|---|---|
| **Leakage form** | One of the seven classes L1 Phantom, L2 Duplicate, L3 Excess, L4 Premature, L5 Unrecovered, L6 Unenforced, L7 Erosion | § 1.5 |
| **Ledger** | An append-only running record of a cumulative position, from which balances are derived | § 15.2, § 15.6 |
| **Liquidated damages (LD)** | Contractual damages accruing automatically on established delay. **Non-levy is a waiver, not an omission** | FM-18, LD-1, REC-08 |
| **Lump sum** | An item valued by stage completion rather than by measured quantity, with stage fractions summing to at most one | FM-04, UG-3 |

---

### M

| Term | Definition | Source |
|---|---|---|
| **Mate** | *See* **Gang leader** | § 4.2 |
| **Measurement** | The recording of physically executed work in contract units, at the work, at the time. **Records reality, never intention** | MP-1, MP-2, LAW-3 |
| **Measurement Book (MB)** | The enterprise's primary evidentiary record of physical execution: custodied, sequenced, indelible, attributed | OBJ-11, § 8.3, EDR-03 |
| **Measurement entry** | One recorded measurement: item, location, dimensions, computation, quantity, dates, measurer, evidence. **Unique enterprise-wide** | OBJ-12, ME-1…ME-12, AF-1 |
| **Method of measurement** | The standard governing what is measured and what is deducted, **bound at engagement** and not variable thereafter | MM-1, E-7 |
| **Minimum wage test** | The per-worker, per-period test that effective receipt met the statutory floor. **A gate, not an adjustment** | FM-25, MW-1, LAB-06 |
| **Muster roll** | The period record of attendance for a site, closed positively, after which no capture is accepted | OBJ-10, ATT-17 |

### N

| Term | Definition | Source |
|---|---|---|
| **Negative net** | A computed net payable below zero: the counterparty owes the enterprise. **Legitimate and important; suppression is the failure** | NEG-1…NEG-3, XCP-15 |
| **Net payable** | Cumulative certified value less cumulative paid, retention **held**, cumulative recoveries and cumulative deductions | FM-19 |
| **No-claim certificate** | A contractor's extinguishment of their own claims. **Does not discharge the enterprise's unrecovered value** | LI-28, CLS-06 |
| **Non-scheduled item** | Work with no rate in force at its work date, requiring star-rate derivation before it may be billed | RR-1, SR-1…SR-4 |

### O

| Term | Definition | Source |
|---|---|---|
| **Origination** | The creation of a financial claim within the enterprise, distinct from verification, certification, and approval | RBL-10, A-2 |
| **Override** | An explicit bypass of a control by named authority. **May relax a procedure; never an Immutable Law** | OVR-01, XCP-17 |
| **Overtime** | Authorised hours beyond normal, recorded separately and paid at the higher of the statutory and contractual multiplier | FM-22, WGR-07 |
| **Ownership (accountable / custodial / authoring)** | The three distinct kinds of ownership the model records separately, because conflating them makes accountability disappear | § 15.8 |

### P

| Term | Definition | Source |
|---|---|---|
| **Part rate** | Payment for an incomplete item at a contractually defined stage fraction. **Never set at bill time** | FM-03, PT-1…PT-4 |
| **Payment chain** | The ordered sequence Authority → Assignment → Execution → Observation → Measurement → Verification → Valuation → Entitlement → Adjustment → Eligibility → Approval → Disbursement → Record | § 1.6 |
| **Period** | A bounded interval with status OPEN, CLOSING or CLOSED, governing what may be posted | PG-1…PG-4 |
| **Petty contractor / labour supplier** | An intermediary supplying labour, statutorily significant because principal-employer liability flows to the enterprise | § 4.4 |
| **Piece rate** | Payment by measured output rather than time. **Does not escape LAW-1**: it uses measurement to price labour | FM-23, PCR-01 |
| **Principal employer** | The enterprise's statutory position in respect of workers supplied by an intermediary; liability flows here on the intermediary's default | § 4.4, CTL-06 |
| **Productivity** | Measured output per validated worker-day. **Analytical, never financial; bidirectional as a signal** | FM-31, PD-1, PRD-05 |
| **Proposition** | The specific fact a piece of evidence is offered to prove; confidence attaches to propositions, not to documents | § 11.4, TE-6 |

### Q

| Term | Definition | Source |
|---|---|---|
| **Quantity** | A magnitude inseparable from its unit of measure | VO-02, U-1 |
| **Quality acceptance** | CAP-QLT's determination that work is acceptable. **A precondition to measurement, not an adjustment to it** | I-4, MP-9, LI-07 |

### R

| Term | Definition | Source |
|---|---|---|
| **Rate** | Money per unit, in force over an effective range, under a named authority. **Never rounded; never derived by analogy** | VO-03, FM-00, PC-3 |
| **Reconciliation** | The comparison of two independently created records of the same fact. **A control, not a report** | GP-23, § 11.6 |
| **Reconciliation identity** | One of the twelve statements RI-1…RI-12 that must hold at every moment and be evaluable for any date | § 7.12, RI-0 |
| **Reconstructed record** | A record created after the fact from memory or secondary sources. Admissible, **must be labelled as reconstructed**, and never presented as contemporaneous | HR-4 |
| **Recovery** | An amount owed to the enterprise, deducted at source before value leaves | LAW-8, OBJ-18, EDR-12 |
| **Recovery waterfall** | The fixed nine-priority order in which recoveries are applied when the payable amount is insufficient. **Not variable by agreement** | FM-13, WF-2 |
| **Register** | An append-only record of occurrences kept for evidence rather than for balance | § 15.2 |
| **Retention** | Amounts withheld from a contractor's certified value, remaining **the contractor's money**, recorded as an enterprise liability | LAW-10, OBJ-19 |
| **Retention held** | Retention accrued less retention released less retention forfeited — **the term used in the net-payable computation** | § 7.2, FM-19, A-1 |
| **Revision** | A superseding record that references, explains and replaces its predecessor, which remains permanently visible | RV-1, MSR-12, DR-1 |
| **Risk (enterprise)** | A specific, realistic mechanism by which value escapes, classified into a leakage form, with a named owner and a stated residual | Part 10, RP-1, RP-2 |
| **Running account** | The cumulative method by which contract payments are computed, causing prior errors to self-correct rather than compound | LAW-6, EDR-07 |
| **Running Bill** | The instrument through which contract payment is claimed and certified. **A claim until certified; never an entitlement on submission** | OBJ-14, RBL-01, EDR-01 |

### S

| Term | Definition | Source |
|---|---|---|
| **Sanctioned value** | The financially approved value of an engagement, forming the ceiling with approved variations | E-1, LAW-9 |
| **Separation of duties** | The structural prohibition of specified role combinations on the same transaction | § 4.14, SOD-1…SOD-10 |
| **Settlement sheet** | The financial instrument through which labour-path payment is computed and approved | OBJ-15 |
| **Star rate** | A rate derived for a non-scheduled item, approved before billing and recorded as a versioned schedule item | SR-1…SR-4 |
| **Supersession** | The mechanism by which records are corrected: a new record referencing the old, with the old remaining permanently visible | LAW-11, CN-4 |
| **Suspension (contractor)** | A halt on new execution and measurement. **Does not halt recovery, retention accounting, or entitlement for verified work** | WRK-12, XCP-21 |

### T

| Term | Definition | Source |
|---|---|---|
| **Terminal state** | A lifecycle state from which no object returns; revival requires a new object referencing the terminal one | LM-5, § 6.16 |
| **Test check** | A sample-based check measurement, with the sample selected by the checker and risk-weighted. **A discrepancy in a sample is evidence about the population** | CK-3, CK-4, CK-5 |
| **Testimony** | Recollection offered in explanation. Admissible; **cannot establish quantity, presence, or value on its own** | HR-5, EC-7 |
| **Time-box** | The mandatory expiry attached to every authorised exception, which never renews by inaction | LI-29, EXC-05 |
| **Traceability** | The property that every figure decomposes to primary evidence through a complete, gap-free chain | CP-7, § 11.5 |

### U

| Term | Definition | Source |
|---|---|---|
| **Unit of measure** | A property of the rate schedule item, never of the measurement. **A measurer may not select a unit** | VO-04, UG-1 |
| **Unsupported (evidence)** | A proposition resting on testimony alone or on evidence whose integrity cannot be demonstrated. **No payment** | § 11.4 |

### V

| Term | Definition | Source |
|---|---|---|
| **Validation (attendance)** | The independent act converting captured attendance into payable evidence, performed by an actor who is not the reporter | ATT-08, SOD-7 |
| **Valuation** | The application of contracted rates to verified quantities. **Arithmetic only** | § 1.6, FM-01 |
| **Value object** | A thing defined entirely by its value, without identity, immutable once formed | § 15.2, § 15.5 |
| **Variation** | The formally sanctioned instrument by which scope, rates, or ceiling change. **The only mechanism by which the ceiling rises** | OBJ-24, LI-19 |
| **Verification** | The independent confirmation of a record by a party who did not create it and does not benefit from it | CP-2, MSR-06 |
| **Voucher (payment)** | The instrument authorising disbursement, immutable in amount and payee after approval | OBJ-20, LI-23 |

### W

| Term | Definition | Source |
|---|---|---|
| **Wage card** | The per-worker record of days, rate, gross, deductions, recoveries, net and acknowledgement. **Maintained even where payment is intermediated** | OBJ-16, BRL-06 |
| **Waiver** | The extinguishment of a recovery obligation by an authority **separated from its origination**, producing a permanent loss record | REC-12, SOD-8 |
| **Work assignment** | The record establishing that a worker or gang was directed to perform specific work, at a location, before execution | OBJ-07, LI-03 |
| **Worker** | A human being engaged directly, through a contractor, through a supplier, or borrowed. **The only actor structurally unable to protect their own interest** | OBJ-01, § 4.1 |
| **Worker-day** | The atomic unit of the labour path: worker identity, date, attendance type, and fraction | VO-09, FM-20 |
| **Write-off** | Executive recognition that a receivable is irrecoverable. **Always a loss event; never a housekeeping route** | ADV-12, LI-13 |

---

## 17.3 Terms deliberately not defined

Recorded so that omission is not read as oversight. Each belongs to another capability and is
**consumed, never authored** here (II-1).

| Term | Owning capability | Why not defined here |
|---|---|---|
| Cost centre, account code, period status (accounting) | CAP-FIN | Consumed as structure; this capability feeds accounting and is not accounting (X-3) |
| Bank account, payment channel, clearing | CAP-TRE | Disbursement mechanics are outside the downstream boundary (§ 3.4.2) |
| Tax rate, threshold, return, deposit | CAP-TAX | Deduction at source is in scope; computation and filing are not (X-12) |
| Specification, drawing revision, design intent | CAP-DES | Consumed as the basis of item description (D-2) |
| Programme, critical path, float | CAP-PPM | Provides context; does not authorise payment (X-7) |
| Test regime, acceptance criteria, defect classification | CAP-QLT | Supplies acceptance as an input (I-4) |
| Recruitment, appraisal, discipline, salary | CAP-HCM | Concerns the employment relationship, not financial control of executed work (X-1, X-2) |
| Tender, evaluation, empanelment | CAP-SCM | Precedes the upstream boundary (§ 3.4.1) |

---

> **Part 17 complete — 126 canonical terms across the alphabet, each traced to its constitutional
> source, plus 8 terms explicitly deferred to owning capabilities.**

---

# ANNEX A — CROSS-REFERENCE MATRIX

> **Purpose.** To demonstrate, in one place, that the derived Parts observe the constitutional core
> and add nothing to it. **Rules → Risks → KPIs → Dashboards → Reports → Exceptions.**

**AX-1 — How to read.** Each row begins with a **control theme** — a cluster of rules addressing one
constitutional obligation — and traces it through every derived Part. **A theme with a gap in any
column is a traceability defect**, and § A.2 records that none exists.

## A.1 Traceability by control theme

| # | Control theme | Rules (Part 9) | Risks (Part 10) | KPIs (Part 12) | Dashboards (13) | Reports (14) | Exceptions (16) |
|---|---|---|---|---|---|---|---|
| **T-01** | Worker identity is enterprise-wide and permanent | WRK-01…04, BRL-04, BRL-10 | RSK-02, RSK-03 | KPI-11 | DSH-06 | REP-01, REP-18 | XCP-02 |
| **T-02** | Attendance is captured by the enterprise at the point of occurrence | ATT-01…03, ATT-10, CLB-03, GNG-04, BRL-08 | RSK-01, RSK-04, RSK-09, RSK-10 | KPI-13, KPI-14 | DSH-06, DSH-10 | REP-01, REP-02 | XCP-01, XCP-05 |
| **T-03** | One validated attendance per worker per date | ATT-06, WRK-07, BRL-05, GNG-03, CLB-07 | RSK-02, RSK-27 | KPI-12 | DSH-06 | REP-02 | XCP-02, XCP-06 |
| **T-04** | Assignment precedes execution | ASG-01, ASG-11, ATT-07, DEP-01 | RSK-07, RSK-08 | KPI-16 | DSH-10 | REP-03 | XCP-36 |
| **T-05** | Borrowed labour requires dual accountability | BRL-01…03, DEP-06, CLB-11 | RSK-27 | KPI-20 | DSH-06 | REP-25 | XCP-06, XCP-07 |
| **T-06** | Measurement records executed reality only | MSR-01…04, MBK-05, MBK-06 | RSK-11, RSK-15 | KPI-28, KPI-30 | DSH-07 | REP-43, REP-45 | XCP-12 |
| **T-07** | Measurement is independently checked | MSR-06, MSR-07, MBK-12 | RSK-15, RSK-53 | KPI-21, KPI-22, KPI-23 | DSH-07 | REP-44 | XCP-30 |
| **T-08** | Concealed work is verified before concealment | MSR-09, MSR-08 | RSK-66 | KPI-24 | DSH-07, DSH-10 | REP-44, REP-45 | XCP-12 |
| **T-09** | The Measurement Book is immutable and sequenced | MBK-01…MBK-12 | RSK-51, RSK-60 | KPI-23 | DSH-07, DSH-11 | REP-42 | XCP-30 |
| **T-10** | Nothing is consumed twice | MSR-13, ATT-20, WKS-08, PCR-05 | RSK-16, RSK-18 | KPI-39 | DSH-05 | REP-43, REP-31 | XCP-03, XCP-04 |
| **T-11** | Rates resolve by work date, from bound schedules | CTL-07, RBL-06, WGR-01…04, MSR-14 | RSK-14, RSK-31 | KPI-35 | DSH-07 | REP-05, REP-29 | XCP-09 |
| **T-12** | Bills are cumulative and reconcile | RBL-04, EVL-01, EVL-03 | RSK-18 | KPI-36 | DSH-02, DSH-05 | REP-05, REP-06 | XCP-03 |
| **T-13** | The ceiling is absolute | RBL-05, EVL-04, VAR-01, CLS-03 | RSK-19, RSK-44 | KPI-32 | DSH-04 | REP-29, REP-55 | XCP-25 |
| **T-14** | Four separated actors per financial instrument | RBL-10, WKS-06, SEC-03, WRK-11, CTL-08 | RSK-53, RSK-55 | KPI-37 | DSH-11 | REP-14 | XCP-16, XCP-28 |
| **T-15** | Approval within delegated limit; no splitting | RBL-11, RBL-12, PEL-09, VAR-07, SEC-05 | RSK-40 | KPI-38 | DSH-11 | REP-14 | XCP-16 |
| **T-16** | The computed figure is the maximum payable | PEL-06, FIN-02, CLS-13 | RSK-39, RSK-45 | KPI-69 | DSH-12 | REP-55 | XCP-25 |
| **T-17** | Recovery precedes disbursement | REC-04, REC-05, REC-09, RBL-07, PEL-05 | RSK-20, RSK-21 | KPI-06, KPI-42 | DSH-08 | REP-37 | XCP-13 |
| **T-18** | Issue creates recovery automatically | CTL-09, REC-01, REC-02, REC-03 | RSK-21, RSK-62, RSK-63, RSK-64 | KPI-44, KPI-45 | DSH-08 | REP-36 | XCP-13 |
| **T-19** | Advances carry bound recovery plans | ADV-01…ADV-14 | RSK-20, RSK-23 | KPI-41, KPI-43 | DSH-08 | REP-35 | XCP-13, XCP-24 |
| **T-20** | LD accrues automatically; non-levy is waiver | REC-08, CLS-05 | RSK-26 | KPI-48 | DSH-08, DSH-12 | REP-38 | XCP-13 |
| **T-21** | Retention is a liability, released on positive test | RET-01…RET-12 | RSK-29 | KPI-07, KPI-49, KPI-50 | DSH-02, DSH-12 | REP-39, REP-40, REP-41 | XCP-14 |
| **T-22** | Statutory minimum is a per-worker gate | LAB-06, LAB-07, WGR-05, WKS-04, PCR-06 | RSK-30 | KPI-51 | DSH-09 | REP-20 | XCP-08 |
| **T-23** | Wages reach the named worker | LAB-08, BRL-06, BRL-09, CLB-01, GNG-05, DWG-10 | RSK-05, RSK-32, RSK-34 | KPI-53, KPI-54 | DSH-09 | REP-21, REP-22, REP-23 | XCP-23 |
| **T-24** | Deductions stay within the lawful ceiling | LAB-11, REC-13, ADV-11 | RSK-37 | KPI-55 | DSH-09 | REP-20, REP-22 | XCP-22 |
| **T-25** | Entitlement is never stranded | WRK-14, LAB-13, WKS-11, DEP-11, CLS-09 | RSK-33 | KPI-56 | DSH-09 | REP-34 | XCP-34 |
| **T-26** | Payee changes are independently verified | WRK-10, SEC-07, PEL-11 | RSK-46, RSK-52 | KPI-40 | DSH-02 | REP-07 | XCP-27 |
| **T-27** | Records are append-only; correction is supersession | MSR-12, ATT-16, MBK-03, MBK-09, FIN-05, SEC-10, WRK-04 | RSK-51, RSK-60 | KPI-62, KPI-63 | DSH-11 | REP-15, REP-48 | XCP-30, XCP-26 |
| **T-28** | Controls declare their own failure | FIN-15, FIN-16, SEC-12, AUD-06 | RSK-24, RSK-50 | KPI-58, KPI-59 | DSH-03, DSH-11 | REP-13 | XCP-29, XCP-31 |
| **T-29** | Exceptions are attributed, time-boxed and counted | EXC-01…EXC-10, OVR-01…OVR-10 | RSK-42, RSK-47, RSK-72 | KPI-60, KPI-61 | DSH-03, DSH-11 | REP-47, REP-48, REP-49 | XCP-17, XCP-18, XCP-26 |
| **T-30** | Closure reconciles before it settles | CLS-01…CLS-14 | RSK-22, RSK-45 | KPI-68, KPI-69 | DSH-12 | REP-55 | XCP-32 |
| **T-31** | Evidence is preserved and retrievable | AUD-12, MBK-11, LAB-14, SEC-11, CLS-14 | RSK-61, RSK-71 | KPI-70 | DSH-11 | REP-15 | XCP-30 |
| **T-32** | Disputes resolve while still resolvable | MSR-18, REC-11, MD-1…MD-4 | RSK-70 | KPI-66 | DSH-04 | REP-46 | XCP-11 |
| **T-33** | Productivity detects in both directions | PRD-01…PRD-09, CLB-06, ASG-03 | RSK-01, RSK-15, RSK-65 | KPI-04, KPI-26 | DSH-07 | REP-26 | XCP-01 |
| **T-34** | Counterparties see their own derivation | RBL-17, LAB-09, CLB-12, RET-11, WGR-12 | RSK-70 | — *(entitlement, not indicator)* | DSH-13, DSH-14 | REP-23, REP-30 | XCP-11 |
| **T-35** | Variation follows recorded instruction | CTL-14, VAR-02, VAR-03, ASG-06 | RSK-41, RSK-44 | KPI-29 | DSH-04 | REP-29 | XCP-20 |

## A.2 Completeness assertions

| # | Assertion | Status |
|---|---|---|
| **AX-A** | Every KPI in Part 12 cites at least one Part 9 rule and at least one Part 10 risk | **Holds** — 70 of 70 |
| **AX-B** | Every dashboard in Part 13 is composed only of Part 12 indicators | **Holds** — 14 of 14 |
| **AX-C** | Every report in Part 14 states mandatory totals and reconciliations drawn from Parts 5, 7 or 11 | **Holds** — 56 of 56 |
| **AX-D** | Every exception in Part 16 cites at least one rule and one risk | **Holds** — 36 of 36 |
| **AX-E** | Every glossary term in Part 17 cites a constitutional source | **Holds** — 126 of 126 |
| **AX-F** | Every control theme traces through all six columns | **Holds with one declared blank** — T-34 has no KPI because counterparty transparency is an **entitlement**, not a measured quantity (CP-10). The blank is intentional and recorded rather than filled with an invented indicator |

---

# ANNEX B — CAPABILITY TRACEABILITY MATRIX

> **Purpose.** To demonstrate that each enterprise object flows through the full constitutional
> chain: **Object → Event → Rules → Calculation → Evidence → Audit → Report → KPI.**

**BX-1 — How to read.** One row per object that participates in the money path. Reference objects
and derived records are shown at § B.2. **A blank means the object genuinely does not participate at
that stage**, and each blank is explained.

## B.1 Object traceability

| OBJ | Object | Event | Governing rules | Calculation | Evidence class / tier | Audit | Report | KPI |
|---|---|---|---|---|---|---|---|---|
| **01** | Worker | EVT-02 | WRK-01…08 | — *(identity, not value)* | EC-3 / H-3 | AUD-05 | REP-18 | KPI-11 |
| **02** | Contractor | EVT-01 | WRK-09…13 | FM-34, FM-35 | EC-1 / H-4 | AUD-04 | REP-09, REP-27 | KPI-05 |
| **03** | Gang | EVT-02 | GNG-01…10 | FM-29 | EC-3 / H-3 | AUD-05 | REP-02 | KPI-19 |
| **04** | Engagement Instrument | EVT-01 | § 6.2 E-1…E-8, CTL-13 | FM-07 | EC-1 / H-4 | AUD-04 | REP-05 | KPI-32 |
| **05** | Rate Schedule Item | EVT-01, EVT-19 | WGR-01…04, CTL-07, MSR-14 | FM-00, RR-4 | EC-1 / H-4 | AUD-04 | REP-29 | KPI-35 |
| **06** | Deployment | EVT-02 | DEP-01…11 | — | EC-3 / H-3 | AUD-05 | REP-03 | KPI-15 |
| **07** | Work Assignment | EVT-03 | ASG-01…11 | — | EC-3 / H-3 | AUD-05 | REP-03 | KPI-16 |
| **09** | Attendance Record | EVT-04, EVT-05 | ATT-01…20 | FM-20 | EC-3 / H-2 or H-3 | AUD-05, AUD-07 | REP-02 | KPI-12, KPI-13, KPI-14 |
| **10** | Muster Roll | EVT-05 | ATT-17, WKS-01 | FM-20 | EC-3 / H-2 | AUD-11 | REP-02 | KPI-56 |
| **11** | Measurement Book | EVT-07 | MBK-01…12 | — | EC-2 / H-3 | AUD-03 | REP-42 | KPI-23 |
| **12** | Measurement Entry | EVT-07, EVT-08 | MSR-01…18 | FM-01, FM-03 | EC-2 / H-2 or H-3 | AUD-03, AUD-07 | REP-43, REP-45 | KPI-21, KPI-22, KPI-24…28 |
| **13** | Evidence Artefact | EVT-07 | MSR-11, EV-1…EV-3 | — | EC-2, EC-5, EC-6 / H-1 | AUD-12 | REP-15 | KPI-30, KPI-63 |
| **14** | Running Bill | EVT-09, EVT-10, EVT-12 | RBL-01…18 | FM-06, FM-08, FM-19 | EC-4 / H-5 | AUD-04 | REP-05, REP-06 | KPI-01, KPI-03, KPI-31…36 |
| **15** | Settlement Sheet | EVT-12, EVT-13 | WKS-01…12 | FM-24, FM-28 | EC-4 / H-5 | AUD-11 | REP-31 | KPI-09, KPI-52 |
| **16** | Wage Card | EVT-12 | BRL-06, LAB-09, WKS-09 | FM-21…FM-29 | EC-4 / H-5 | AUD-11 | REP-22, REP-23 | KPI-51, KPI-53, KPI-55 |
| **17** | Advance | EVT-16 | ADV-01…14 | FM-09, FM-10 | EC-4 / H-5 | AUD-04 | REP-35 | KPI-41, KPI-42, KPI-43 |
| **18** | Recovery | EVT-11 | REC-01…16 | FM-11…FM-14 | EC-4 / H-5 | AUD-04 | REP-37 | KPI-06, KPI-46 |
| **19** | Retention | EVT-18 | RET-01…12 | FM-15, FM-16 | EC-4 / H-5 | AUD-04 | REP-39, REP-40, REP-41 | KPI-07, KPI-49, KPI-50 |
| **20** | Payment Voucher | EVT-13 | PEL-01…14 | FM-19, FM-28 | EC-4 / H-5 | AUD-04 | REP-07 | KPI-01, KPI-38 |
| **21** | Disbursement | EVT-14, EVT-15 | RBL-15, WKS-10 | — | EC-4 / H-1 *(confirmation)* | AUD-02 | REP-07, REP-33 | KPI-40 |
| **22** | Borrowed Labour Ledger | EVT-02 | BRL-01…03 | FM-30 | EC-4 / H-5 | AUD-06 | REP-25 | KPI-20 |
| **24** | Variation Instrument | EVT-19 | VAR-01…12 | FM-06 | EC-1 / H-4 | AUD-04 | REP-29 | KPI-29, KPI-32 |
| **25** | Contractor Account | continuous | FIN-11, CTL-10 | FM-34, FM-35 | EC-4 / H-5 | AUD-06 | REP-09, REP-28 | KPI-05, KPI-08 |
| **26** | Exception Record | EVT-20 | EXC-01…10 | — | EC-3 / H-3 | AUD-07, AUD-08 | REP-47, REP-49 | KPI-60, KPI-61 |
| **27** | Approval Record | EVT-13 | SEC-01…06, RBL-11 | — | EC-1 / H-3 | AUD-04 | REP-14 | KPI-37, KPI-38 |
| **28** | Hindrance Record | EVT-04 | ATT-13, CLB-05 | FM-18 *(LD netting)* | EC-3 / H-3 | AUD-07 | REP-04 | KPI-17 |
| **29** | Issued Value Record | EVT-17 | CTL-09, REC-01, REC-02 | FM-11 | EC-4 / H-3 | AUD-06 | REP-36 | KPI-44, KPI-45 |
| **30** | Final Account | EVT-22 | CLS-01…14 | FC-1…FC-10 | EC-4 / H-5 | AUD-12 | REP-55 | KPI-68, KPI-69 |

## B.2 Objects with declared blanks

| OBJ | Object | Stage omitted | Why |
|---|---|---|---|
| **08** | Activity | No governing rule, no calculation, no KPI of its own | **Reference data consumed from CAP-PPM** (D-4, II-1). It appears as a dimension of other objects, never as a subject |
| **23** | Productivity Record | No event; no evidence tier | **A derived record**, recomputable from OBJ-09 and OBJ-12. It carries the confidence of its weakest input (HR-2) and is analytical, never financial (PD-1). Its rules are PRD-01…09; its calculation FM-31…FM-33; its report REP-26; its KPI KPI-04 |

**BX-2 — Every object with a financial or evidentiary classification traces through every stage.**
The two blanks above are the only ones, and both are structural rather than omissions.

---

> **End of Parts 1–17 and Annexes A–B.**
> **Constitutional core:** Parts 1–11, frozen, amended once by the validation amendment set.
> **Derived Parts:** 12–17, which observe the core and add no architecture.
> **Traceability:** Annex A by control theme, Annex B by enterprise object.
>
> **Remaining Architecture Freeze condition: FC-D — independent review by a reviewer who did not
> author this document.** It is unchanged, has not been reinterpreted, and cannot be discharged from
> within.
