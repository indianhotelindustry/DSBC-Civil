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
LC-10 (Disbursement), and LC-10 may only be entered from LC-05, LC-03, or LC-06.**

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
| Bill → VERIFIED | | | | | **✔** | | |
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
| RP-1 | Item value — `round₂` of `Qᵢ × Rᵢ` |
| RP-2 | Each recovery amount, individually |
| RP-3 | Each retention accrual |
| RP-4 | Each statutory deduction |
| RP-5 | Net payable on a voucher |
| RP-6 | Each worker's net wage |

**RND-4 — Sums are sums of rounded components.** Gross measured value is `Σ round₂(item value)`, not
`round₂(Σ item value)`. This makes the bill's line items add up on paper — a CP-10 requirement — and
is the only place where the "round once" rule is deliberately relaxed, at the item boundary.

**RND-5 — No rounding may increase the enterprise's outflow.** Where a rounding convention is
genuinely ambiguous, the resolution favours the enterprise's exposure being lower (CP-8) — **except
in worker wage computation (RP-6), where ambiguity resolves in the worker's favour** (§ 1.8 LAW-8
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
> `Net = round₂( V_certified_cum − V_paid_cum − Ret_cum − Rec_cum − Ded_cum )`

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
| **RI-7** | `Σ worker-days settled = Σ attendance records in state SETTLED` | L1/L2 — phantom or duplicate labour |
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
| **ME-6** | Date of execution (`t`) and date of measurement | Rate resolution uses `t` (FM-00); the gap between them is itself a signal |
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

> **End of Parts 1–8.**
> Continues with **Part 9 — Business Rules**, **Part 10 — Risk & Leakage Model**, and
> **Part 11 — Evidence, Audit & Investigation**.
