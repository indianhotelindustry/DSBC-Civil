# CAP-WFC-01 — CONSTITUTIONAL ARCHITECTURE VALIDATION
## Freeze-readiness assessment against Architecture Freeze v1.0

---

| Attribute | Value |
|---|---|
| **Subject** | CAP-WFC-01 — Workforce Financial Control, Parts 1–11 |
| **Subject commit** | `172c045` (Parts 9–11), on `412e73c` (Parts 1–8) |
| **Subject size** | 10,166 lines · 373 business rules · 72 risks · 12 Immutable Laws |
| **Validation type** | Constitutional architecture validation — structural, semantic, and adversarial |
| **Document class** | Assessment — **non-normative**. It amends nothing |
| **Verdict** | **CONDITIONAL — not ready for freeze as it stands.** Ready on adoption of 10 amendments (5 Class A, 5 Class B) |
| **Immutable Laws requiring amendment** | **None.** Every defect is in an instrument, not in a Law |

---

## 0. Standing of this document

> **By CAP-WFC-01's own evidence hierarchy (§ 11.3), this validation is H-6 evidence — an
> interested-party record produced by the author of the subject. It is a claim, not evidence.**

CP-2 requires that a verifier be structurally incapable of benefiting from an incorrect
verification. That condition does not hold here: the same party authored and validated. The
document's own constitution therefore says what weight to give this report, and the answer is *not
much, until independently checked*.

Two things follow, and they shape everything below.

**First, the method is biased toward findings rather than assurance.** Where a judgement could
reasonably fall either way, it is recorded as a defect. A self-review that concluded "sound" would
be worthless; a self-review that produces falsifiable, located, reproducible findings is useful even
from an interested party, because **each finding can be checked in minutes by someone else.**

**Second, every finding below cites file position, quotes the text, and states the failing
scenario.** That is deliberate: it converts this document from testimony (H-8) into something a
reviewer can verify at H-2 by reading the cited lines. **Nothing here should be accepted because of
who wrote it.**

**This validation does not substitute for independent review before freeze.** It reduces the cost of
that review; it does not discharge it.

---

## 1. Method

### 1.1 Structural validation (mechanical, reproducible)

| # | Check | Result |
|---|---|---|
| S-1 | Every `§ n.n` cross-reference resolves to an existing heading | **Pass** — 0 unresolved of all references tested |
| S-2 | Every `FM-nn` referenced is defined | **Pass** — 0 dangling |
| S-3 | Every `RSK-nn` referenced is defined; every risk defined is referenced | **Pass** — 0 in both directions |
| S-4 | Business rule counts match the § 9.1.2 domain index | **Pass** — 373, per-domain exact |
| S-5 | Exception-policy counts match the § 9.32 summary | **Pass after correction** — 301, corrected pre-commit from an estimated 298 |
| S-6 | Risk severity and residual distributions match the register | **Pass after correction** — corrected pre-commit from estimates |
| S-7 | Identifier families are collision-free | **FAIL** — see **A-5** |

### 1.2 Semantic validation (adversarial)

Twenty-one attacks were constructed against the document's workflows, each attempting to reach one
of four outcomes: **money out without evidence**, **money out twice**, **money owed to the enterprise
never collected**, or **a control that cannot fail**.

**Nine landed. Twelve were repelled.** Both sets are reported — § 2 and § 4 — because a validation
that lists only successes is describing the validator, not the subject.

### 1.3 What was not validated

- **Implementability.** Whether any technology can enforce these rules economically is out of scope
  and, by CP-12, constitutionally irrelevant to the document's correctness.
- **Statutory accuracy.** The document consumes statutory parameters (D-8, I-8) and never states
  them. No Indian labour or tax provision was checked, because the document deliberately asserts
  none.
- **Parts 12–16.** Unwritten (ARB-F12, ARB-F13).

---

## 2. Findings

### Class A — Freeze-blocking

> These five prevent Architecture Freeze v1.0. Each either **produces a wrong number**, **defeats a
> separation of duties**, **leaves a payment with no lawful route**, or **creates a control that
> cannot fail**.

---

#### A-1 — FM-19 double-counts released retention *(mathematical defect — changes money)*

**Location.** § 7.8, line 3294.

**Text.** `Net = round₂( V_certified_cum − V_paid_cum − Ret_cum − Rec_cum − Ded_cum )`

**Defect.** `Ret_cum` is defined by FM-15 as retention **accrued** (`V_certified_cum × p_retention`,
capped). RI-5 explicitly distinguishes `Ret_accrued = Ret_held + Ret_released + Ret_forfeited`, and
FM-16 computes release from `Ret_held`. **FM-19 therefore subtracts retention that has already been
released and paid out — and which has simultaneously increased `V_paid_cum`.** The same rupee is
deducted twice.

**Failing scenario.** Cumulative certified ₹80,00,000; retention accrued and held ₹4,00,000;
recoveries ₹11,50,000; deductions ₹1,60,000; previously paid ₹51,00,000. Net = ₹11,90,000 — correct.

Now release half the retention at practical completion, as almost every Indian construction contract
provides. ₹2,00,000 is paid, so `V_paid_cum` becomes ₹53,00,000 and `Ret_held` becomes ₹2,00,000.
FM-19 as written still uses `Ret_cum` = ₹4,00,000:

`80,00,000 − 53,00,000 − 4,00,000 − 11,50,000 − 1,60,000 = ₹9,90,000`

The correct figure is ₹11,90,000. **The contractor is underpaid by exactly the retention released —
₹2,00,000 — and the error persists in every subsequent bill.**

**Why this is severe.** It is not an edge case: staged retention release during the contract is the
normal case, not the exception. It fails in the **contractor's** direction, which means it will
surface as a dispute rather than as a loss — but LAW-6's self-correction cannot fix it, because the
formula is wrong at every bill, not wrong once. It also silently violates LAW-10: money recorded as
the contractor's, released to the contractor, and then withheld again.

**Amendment (mandatory).** FM-19 becomes:

`Net = round₂( V_certified_cum − V_paid_cum − Ret_held − Rec_cum − Ded_cum )`

with `Ret_held = Ret_cum − Ret_released − Ret_forfeited` added to § 7.2 notation, and `V_paid_cum`
defined there as *cumulative confirmed net disbursement* (it is currently defined only inside RI-6).

**Strengthening test.** Passes — it corrects a wrong number and closes an unintended LAW-10 breach.

---

#### A-2 — § 6.14 contradicts RBL-10 on bill origination *(separation-of-duties defect)*

**Location.** § 6.14, lines 2871–2872; RBL-10, § 9.19.

**Text.**
```
| Bill → SUBMITTED | ... | Accountant ✔ (on contractor claim) |
| Bill → VERIFIED  | ... | Accountant ✔                      |
```
against **RBL-10 — "Origination, verification, certification, and approval MUST be four different
actors."**

**Defect.** The transition authority matrix assigns **both** origination and verification of a
running bill to the Accountant. Read literally, the matrix authorises exactly what RBL-10, SOD-2,
LAW-4 and GP-03 prohibit. An implementer following Part 6 builds a system that Part 9 forbids.

**Failing scenario.** An accounts officer records a contractor claim as a bill, prepares it from
measurements, and verifies its own arithmetic. RBL-09's "independent recomputation" is performed by
the person who computed it. Two of the four separated acts have collapsed into one, and the
implementation is nominally compliant with the matrix.

**Assessment of the defence.** It can be argued that the contractor *originates* the claim and the
Accountant merely records it, so no separation is breached. **That defence fails**, because RBL-03
requires the bill to be prepared from the enterprise's own verified measurements — not from the
contractor's claim — so the enterprise **is** the originator of the bill as a financial instrument.

**Amendment (mandatory).** Split the matrix row: `Bill → SUBMITTED` and `Bill → VERIFIED` must be
held by different individuals within Accounts, and the matrix must say so explicitly — the same
treatment § 6.14 already gives `Bill → CERTIFIED` with its "(≠ verifier)" annotation. Add the same
annotation to `Bill → VERIFIED`: **"(≠ originator)"**.

**Strengthening test.** Passes — it removes a contradiction in favour of the stricter rule.

---

#### A-3 — LM-1 leaves retention release and final account with no lawful route to payment

**Location.** § 6.1.1 LM-1, line 2380.

**Text.** *"No lifecycle terminates in money moving except LC-10 (Disbursement), and **LC-10 may only
be entered from LC-05, LC-03, or LC-06.**"*

**Defect.** LC-08 (Retention) and LC-11 (Closure & final account) both terminate in money moving to
the contractor. Neither is a permitted entry to LC-10. **Read literally, the constitution prohibits
paying released retention and prohibits paying the final account.**

**Failing scenario.** Retention release conditions are satisfied (RET-04). RET-06 computes the
release net of recovery. There is no lifecycle path by which that amount can reach a Payment Voucher
without violating LM-1. The same applies to every final-account settlement under CLS-04.

**Why this is Class A rather than pedantry.** LM-1's whole purpose is to enumerate the payment
channels exhaustively so that a fourth, unpoliced channel cannot exist — it is the structural
statement behind § 5.32.1's "no third path exists". **An enumeration that omits two real channels is
worse than no enumeration**, because an implementer will either block legitimate payments or, far
more likely, create an undocumented route and place no controls on it. That undocumented route would
be exactly the unpoliced channel LM-1 exists to prevent.

**Amendment (mandatory).** LM-1 becomes: *"LC-10 may only be entered from LC-03, LC-05, LC-06, LC-08
(retention release), or LC-11 (final account)."* Add to § 6.16's terminal-state table the route by
which each reaches disbursement.

**Strengthening test.** Passes — it closes the possibility of an undocumented payment channel.

---

#### A-4 — RI-7 is tautological: a reconciliation that cannot fail

**Location.** § 7.12, line 3437.

**Text.** `Σ worker-days settled = Σ attendance records in state SETTLED`

**Defect.** Both sides count the same thing. An attendance record is in state `SETTLED` *because* it
was settled (ATT-20, WKS-08). **The identity is true by construction and can never detect anything.**

**Self-evidencing.** The document diagnoses this exact failure mode itself, at XR-D: *"A
reconciliation that always passes is a candidate for review. Either the control is genuinely
effective, or it is comparing a record against itself."* RI-7 is comparing a record against itself.

**What it was meant to be.** WKS-03 states the real control — reconcile the settlement's day count
to the **closed muster**, in both directions, so that days settled in excess of days *validated* and
days validated but never settled are both detected. RI-7 should express that.

**Failing scenario.** A settlement pays 1,340 worker-days; the closed muster validated 1,290. Every
paid day is marked `SETTLED`, so RI-7 passes. The 50-day excess — leakage form L1/L2, the identity's
own stated purpose — is invisible to it.

**Amendment (mandatory).** RI-7 becomes:
`Σ worker-days paid across settlements in the period = Σ attendance records VALIDATED or LOCKED for that period`
with the residual in either direction investigated (per WKS-03).

**Strengthening test.** Passes — it converts a control that cannot fail into one that can.

---

#### A-5 — Identifier collision: `RP-` carries two meanings

**Location.** § 7.3.2 (RP-1…RP-6, rounding points) and § 10.1 (RP-1…RP-5, risk posture).

**Defect.** Two disjoint definition sets share a prefix and an overlapping numeric range. FIN-04
cites *"round at RP-1…RP-6 only"*; RG-1 cites *"a named owner (RP-2)"*. A reader arriving at either
citation from a search finds the wrong definition roughly half the time.

**Why Class A.** In a constitution whose enforcement depends on precise citation — 373 rules carry a
`Cross-refs` field — **an ambiguous identifier is a defect in the citation mechanism itself**, not a
typographical matter. It is also the only structural check of § 1.1 that failed, and it is trivially
correctable now and expensive to correct after freeze, when external documents begin citing it.

**Amendment (mandatory).** Rename the Part 7 set to **`RPT-1…RPT-6`** (rounding points), leaving
Part 10's risk-posture `RP-1…RP-5` intact — Part 10 is the newer and more heavily cross-referenced
set. Update FIN-04 and § 7.3.2's two internal citations.

**Strengthening test.** Passes — restores unambiguous citation.

---

### Class B — Material ambiguities

> Each is an undefined term on a money path. **LA-2: every undefined term is a leakage site.** These
> do not produce a wrong number today; they permit two competent officers to produce different
> numbers tomorrow, and the difference will not be visible as an error.

---

#### B-1 — The approval base is undefined for a cumulative bill

**Location.** RBL-11 — *"Test amount against limit and validity."*

**Defect.** "Amount" is not defined. A single cumulative bill presents at least three candidates: the
cumulative certified value (₹80,00,000 in the § 7.13 example), the period certified value
(₹20,00,000), and the net payable (₹11,90,000). **They differ by nearly a factor of seven, and they
determine which officer may approve.**

**Failing scenario, and why it is not benign.** A Project Manager with a ₹15,00,000 limit can
lawfully approve the § 7.13 bill on the net-payable reading and cannot on either other reading. Both
officers are acting in good faith and citing the same rule. Worse, the net-payable reading makes
delegated authority a function of *how much recovery happened to fall in the period* — so a
contractor whose advance recovery completes moves into a higher approval tier by arithmetic, with no
one deciding anything.

**Interaction with GP-18.** GP-18 requires cumulative position to govern threshold tests, which
implies the cumulative certified value. RBL-12 and PEL-09 both rest on that reading. But RBL-11 does
not say so, and the natural reading of "amount" on a payment document is the amount being paid.

**Amendment (recommended, materially strengthening).** RBL-11 states explicitly that the approval
base is **cumulative certified value** for authority determination, and that net payable is tested
separately against disbursement authority. This aligns RBL-11 with GP-18, RBL-12, and PEL-09, and
removes the perverse coupling between recovery timing and approval tier.

---

#### B-2 — Attendance attribution is undefined on a transfer date

**Location.** LI-16 / ATT-06 against BRL-01, CLB-11, DEP-05, ASG-08.

**Defect.** BRL-01 requires the lending assignment closed and the borrowing one opened **on the same
date**. LI-16 permits **at most one** validated attendance record per worker per date,
enterprise-wide. The document does not say to which side the transfer date's attendance attaches.

**Failing scenario.** A worker transfers between projects at midday. Both sites record attendance in
good faith. The second is rejected by ATT-06 as a duplicate. Either (a) the receiving project's
half-day is lost and the worker is underpaid, or (b) the sites informally agree who records it —
which is a site-level financial decision of exactly the kind CP-4 and GP-01 exist to eliminate, and
which will be resolved differently on every site.

**Why it matters beyond the half-day.** LI-16 is described in the document as *"the single most
important structural control against leakage form L1/L2 in the labour path."* A control that
produces a false positive in a normal operational case will be worked around, and the workaround —
not the control — becomes the practice (LA-5).

**Amendment (recommended).** Define attendance as attaching to the deployment **in force at the
start of the working day**, with the transfer effective from the next working day; where a genuine
same-day split is required, a single attendance record carries a split attribution across two
activities, preserving one record per worker per date. Add the rule to ATT and cross-reference from
BRL-01.

---

#### B-3 — The effective date `t` is undefined for work spanning a rate change

**Location.** FM-00, ME-6, RR-1, WGR-04, RBL-06.

**Defect.** Every rate resolution in the document keys on `t`, *"the date the work was executed"*
(§ 7.2), and ME-6 records a single *"date of execution"*. **Construction work is not executed on a
date.** A wall built over three weeks that spans a statutory wage revision or a contractual rate
version has no single `t`.

**Failing scenario.** A rate version takes effect on 1 October. A measured element is executed
15 September to 10 October. The measurer selects the completion date and the item prices at the new
rate; or selects the start date and it prices at the old. Both are defensible under FM-00 as
written. **The choice is worth the rate differential on the whole quantity and is made by the actor
§ 4.6 declares to be conflicted.**

**Why this is not covered by RR-2.** RR-2 governs *rate corrections* and retrospective change. It
does not address a single measured quantity whose execution straddles two in-force versions.

**Amendment (recommended).** Define `t` for a measured element as the **date of completion of the
element measured**, with the element being the smallest unit the method of measurement recognises;
and require that where an element spans a rate change, it is **measured in two parts at the
boundary** where the method permits. Record the rule at FM-00 and at ME-6.

---

#### B-4 — Consumption reversal on bill cancellation is undefined

**Location.** MSR-13, LM-6, SY-1, § 5.13; RSK-18.

**Defect.** A verified measurement is marked consumed when billed (`BILLED`). If the bill is
subsequently `CANCELLED` or `REJECTED`, no rule states what happens to the consumption marker.
MSR-13's cross-reference prohibits *"re-billing after cancellation of a bill without restoring and
re-verifying the entry"* — which presupposes a restoration mechanism that the document never
defines: who authorises it, on what record, and whether re-verification means a fresh check.

**Failing scenario.** RSK-18 describes it precisely: a bill is cancelled after certification, its
entries are restored, and both the restored entries and the revived original bill are paid. **The
document names the risk and does not close it.**

**Why it is Class B rather than Class A.** LAW-6's cumulative form absorbs the duplicate at the next
bill, so the loss is usually self-correcting. It becomes permanent only if the cancellation occurs
in the final billing cycle — which is also when it is most likely, because that is when bills are
cancelled and re-issued under closure pressure.

**Amendment (recommended).** Add a rule to MSR: cancellation of a bill returns its consumed entries
to `VERIFIED`, as an attributed act recorded against both the bill and each entry, requiring fresh
check-measurement confirmation before re-billing.

---

#### B-5 — The PEL-06 / CLS-13 precedence exists only in the review narrative

**Location.** PEL-06 (exception policy: **None**), CLS-13 (exception policy: executive authority),
resolved at ARB-F1 in § 11.12.2.

**Defect.** ARB-F1 resolved the conflict by declaring that CLS-13 governs only the *recording* of a
variance and creates no payment authority. **That resolution is stated in a review finding, not in
either rule.** § 9.1 places Business Rules third in constitutional authority; § 11.12 is an
assessment section with no stated authority at all. **A reader of Part 9 alone — the operative layer
for any implementer — reaches the opposite conclusion.**

**Failing scenario.** An implementer building the approval gate reads CLS-13, sees an executive
exception, and permits final settlement above the computed figure. EDR-05 and PEL-06 are defeated by
a rule that was supposed to be about record-keeping.

**Amendment (recommended).** Promote the ARB-F1 resolution into the rules themselves: PEL-06 gains
*"including at final account (CLS-13), which records variance and confers no payment authority"*;
CLS-13 gains *"a settlement above the computed figure requires the entitlement to be changed by
formal instrument (LAW-9); CLS-13 does not authorise payment."*

**General principle exposed.** Any conflict resolved in Part 11 but not reflected in Parts 6–9 is
resolved only for readers of Part 11. **ARB-F2's three precedence resolutions have the same defect**
and should be promoted the same way. That is one additional amendment, folded into this one.

---

### Class C — Recommended, not freeze-blocking

| # | Finding | Recommendation |
|---|---|---|
| **C-1** | **The only unmeasured payment channel has its ceiling set outside the capability.** LAW-1 carves out advances; ADV-03 caps them against a limit set in the engagement instrument by CAP-SCM, which WFC consumes and cannot create (II-1). WFC therefore has **no native control on the total value it may disburse without measurement** | Add a WFC-side invariant: cumulative advance outstanding may not exceed a stated proportion of cumulative certified value, tested at each advance approval, breach escalating to Finance Controller. This is a WFC control on a WFC risk and does not create contractual authority |
| **C-2** | AT-4 read-logging scope undefined (already ARB-F10) | Enumerate the read-logged classes explicitly |
| **C-3** | Cross-path consumption reconciled periodically, not structurally (already ARB-F5) | Add SY-11 binding cross-path consumption at settlement |
| **C-4** | `EA-` (evidential axioms) and `AE-` (audit events) are transpositions of each other, both in Part 11 | Rename audit events to `AEV-` |
| **C-5** | § 6.14 has no row for period close / reopen, though PG-3 and PG-4 assign the authority in prose | Add the rows |

---

## 3. Attacks repelled

> Reported because a validation that lists only what it broke is not evidence that it tried to break
> anything else.

| # | Attack | Outcome |
|---|---|---|
| R-1 | **Emergency payment as an evidence bypass** — argue that verification is "sequence" not "evidence", so PEL-10 permits emergency payment against an unchecked measurement | **Repelled.** PEL-10's Prohibited clause names it explicitly: *"Emergency payment against unverified measurement or unvalidated attendance."* LI-32 closes the general case |
| R-2 | **Ceiling breach by approval seniority** | **Repelled** at four independent points: FM-07, RBL-05, EVL-04, CLS-03. No exception policy anywhere admits it |
| R-3 | **Recovery waterfall reordered to produce a positive payment** | **Repelled.** WF-2 and PC-8 prohibit it; FM-13's order is declared constitutional |
| R-4 | **Duplicate billing of one measurement** | **Repelled** within the contract path: MSR-13 + SY-1 + AF-1 + LM-6, with LAW-6 as a second net. (Cross-path remains B-4/C-3) |
| R-5 | **Negative net suppressed to avoid an awkward figure** | **Repelled.** NEG-1…NEG-3, PC-5, FIN-09, RBL-18 — five independent statements |
| R-6 | **Retention treated as a saving** | **Repelled.** LAW-10, RT-2, RET-02, LI-17, and RI-5 as the detector |
| R-7 | **Worker wage withheld as leverage in a contractor dispute** | **Repelled.** PA-8, CTL-06, LAB-10, BRL-13, and waterfall priority 2 |
| R-8 | **Silent top-up of a below-minimum wage** | **Repelled.** MW-1, LAB-07, PC-10 |
| R-9 | **FM-19 double-counting `V_paid_cum` against deductions** | **Repelled** — the terms are consistent when `V_paid_cum` is net disbursement, confirmed against the § 7.13 worked example. (The *retention* term is not — A-1) |
| R-10 | **Splitting a bill under a delegated limit** | **Repelled.** RBL-12, PEL-09, GP-18, AF-5 — though B-1 must be fixed for the test to be well-defined |
| R-11 | **SC-17 defeated by a single actor** | **Repelled.** No single-actor path found through the four conjunctive conditions. (Two-actor collusion succeeds — already ARB-F4, not a new finding) |
| R-12 | **Contractor's claim laundered into evidence by countersignature** | **Repelled.** HR-1, CTL-03, MSR-05, ATT-03, JM-4 |

---

## 4. Assessment of the document's own admissions

A validation must also test whether the subject's self-reported weaknesses are honestly stated or
defensively minimised. Four were re-examined.

| Admission | Assessment |
|---|---|
| **ARB-F4 — SC-17 fails against two colluding actors** | **Honest and correctly scoped.** Independently re-derived: measurer + checker, or supervisor + mate, satisfies all four SC-17 conditions. The controls named (rotation, AF-7 pairing analysis, MR-2…MR-5, IC-2 externality) genuinely reduce without closing. **Not overstated in either direction** |
| **ARB-F3 — single-officer sites weaken LAW-2** | **Honest.** § 4.14.1's "by time, distance, or externality" is correctly labelled a real reduction rather than an equivalent alternative — which is the failure mode most governance documents commit here |
| **§ 10.6 — ten risks move between Low and Critical on structural-vs-procedural** | **Verified and, if anything, understated.** The same hinge applies to A-2 and A-3: both are Low-consequence as prose and Critical as an implemented matrix |
| **§ 10.8 Q4 — interested-party evidence remains fabricable** | **Honest.** EA-4 / EV-1 mitigate by hierarchy, not by prevention, and the document says so |

**No instance was found of a weakness being minimised, relabelled, or resolved by assertion.** That
is the strongest single indicator in favour of the baseline: **the document's failures are in its
arithmetic and its enumerations, not in its candour.**

---

## 5. Freeze verdict

### 5.1 Verdict

> **CAP-WFC-01 is NOT ready for Architecture Freeze v1.0 in its present state, and IS ready on
> adoption of the ten amendments in § 2 (A-1…A-5, B-1…B-5).**

### 5.2 Reasoning

**Why not freeze now.** A-1 produces a wrong payment in the normal case. A-2 authorises a
separation-of-duties breach in the operative matrix. A-3 leaves two real payment channels
unenumerated in the rule whose entire function is exhaustive enumeration. A-4 publishes a control
that cannot fail. A-5 breaks citation, which is how a 10,000-line constitution is used at all.
**Freezing these makes them expensive: after freeze they can be changed only by formal constitutional
amendment, and external documents will have begun citing the defective identifiers.**

**Why freeze is nonetheless close.** Three findings support this:

1. **No Immutable Law requires amendment.** All twelve survive every attack constructed. The
   defects are in formulae, matrices, enumerations, and identifiers — the instruments, not the
   constitution.
2. **No finding requires a rewrite.** All ten amendments are local: one formula term, one matrix
   annotation, one enumeration, one identity restatement, one rename, and five clarifications.
   Nothing in Parts 1–5 is touched.
3. **Twelve of twenty-one attacks were repelled outright**, including every attack on the ceiling,
   the waterfall, the negative net, the retention liability, the worker's statutory position, and
   single-actor overpayment. The architecture holds where it was designed to hold.

### 5.3 Freeze conditions

| # | Condition | Class |
|---|---|---|
| **FC-A** | Adopt amendments A-1 … A-5 | **Mandatory** |
| **FC-B** | Adopt amendments B-1 … B-5 | **Mandatory** — each is an undefined term on a money path (LA-2) |
| **FC-C** | Re-run structural checks S-1 … S-7 after amendment; all must pass | **Mandatory** |
| **FC-D** | **Independent review by a party who did not author the document** (§ 0, CP-2) | **Mandatory** — this report cannot discharge it |
| **FC-E** | Record C-1 … C-5 in a post-freeze amendment backlog | Recommended |
| **FC-F** | Governance decision on Part 16 scope and the XCP numbering (ARB-F12) | Recommended — freeze of Parts 1–11 need not wait on it |

### 5.4 What freeze would mean

On satisfaction of FC-A…FC-D, **Parts 1–11 constitute a complete and internally consistent
constitutional baseline for Workforce Financial Control**, suitable for freeze at v1.0 and for
citation by implementation, conformance, and audit documents — with two exposures declared, not
closed (collusion; interested-party evidence fabrication), and five items in the amendment backlog.

**The honest summary: the constitution is sound, five of its instruments are not, and the document
told the truth about itself everywhere this validation could check.**

---

## 6. Amendment set — summary

| # | Location | Change | Effect |
|---|---|---|---|
| **A-1** | FM-19, § 7.2 | `Ret_cum` → `Ret_held`; define `Ret_held` and `V_paid_cum` in notation | Corrects underpayment equal to released retention at every bill |
| **A-2** | § 6.14 | Annotate `Bill → VERIFIED` as **(≠ originator)** | Restores four-actor separation on the contract path |
| **A-3** | LM-1, § 6.16 | Add LC-08 and LC-11 as permitted entries to LC-10 | Closes an undocumented payment channel |
| **A-4** | RI-7 | Restate against validated attendance, both directions | Converts a tautology into a control |
| **A-5** | § 7.3.2, FIN-04 | `RP-` → `RPT-` for rounding points | Restores unambiguous citation |
| **B-1** | RBL-11 | Define the approval base as cumulative certified value | Makes delegated limits testable; removes coupling to recovery timing |
| **B-2** | ATT, BRL-01 | Attendance attaches to the deployment in force at start of working day | Removes a false positive in the labour path's primary control |
| **B-3** | FM-00, ME-6 | Define `t` as element completion; split elements at a rate boundary | Removes a rate-selection discretion held by a conflicted actor |
| **B-4** | MSR | Define consumption reversal on bill cancellation | Closes the mechanism named in RSK-18 |
| **B-5** | PEL-06, CLS-13 (+ ARB-F2 trio) | Promote Part 11 precedence resolutions into the operative rules | Ensures Part 9 readers reach the correct conclusion |

---

*Validation performed against commit `172c045`. This document is an assessment and amends nothing.
Adoption of any amendment requires a governance decision recorded against CAP-WFC-01.*
