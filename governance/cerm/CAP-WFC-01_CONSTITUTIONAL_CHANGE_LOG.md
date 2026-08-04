# CAP-WFC-01 — CONSTITUTIONAL CHANGE LOG
## Amendment set 1 — validation remediation

---

| Attribute | Value |
|---|---|
| **Subject** | CAP-WFC-01 — Workforce Financial Control |
| **Baseline amended** | `172c045` (Parts 9–11) on `412e73c` (Parts 1–8) |
| **Originating instrument** | [`CAP-WFC-01_CONSTITUTIONAL_VALIDATION.md`](./CAP-WFC-01_CONSTITUTIONAL_VALIDATION.md) |
| **Amendments applied** | **10** — A-1…A-5 (Class A), B-1…B-5 (Class B) |
| **Amendments deliberately NOT applied** | **5** — C-1…C-5 (post-freeze backlog, per FC-E) |
| **Immutable Laws amended** | **None** |
| **Rules added, removed, or renumbered** | **None** |
| **Document class** | Change record — **non-normative**. It records amendments; it does not make them |

---

## 1. Scope discipline

Every change below traces to exactly one validation finding. **No change was made that does not.**

Specifically excluded, and verified absent from the diff:

- No opportunistic improvement, refactoring, or restyling.
- No renumbering of any identifier in any family.
- No terminology substitution.
- No change to Parts 1–5 (philosophy, scope, capability, actors, objects).
- No change to any Immutable Law, Constitutional Principle, or Design Principle.
- No change to any rule not named in a finding.
- **C-1…C-5 were not applied**, though C-1 (the advance ceiling being set outside the capability) is
  the most consequential item in the backlog. It is a *recommendation*, not an accepted amendment,
  and applying it would have introduced an architectural change the validation did not accept.

## 2. Invariants verified after amendment

| Invariant | Before | After |
|---|---|---|
| Business rules | 373 | **373** |
| Rules admitting no exception | 301 | **301** |
| Risks in register | 72 | **72** |
| Immutable Laws | 12 | **12** |
| Enterprise objects | 30 | **30** |
| Lifecycles | 12 | **12** |

**Structural checks S-1 … S-7 re-run (freeze condition FC-C): all pass.**

| Check | Result |
|---|---|
| S-1 — every `§ n.n` reference resolves | Pass — 0 unresolved |
| S-2 — every `FM-nn` referenced is defined | Pass — 0 dangling |
| S-3 — `RSK-nn` referenced ⇔ defined | Pass — 0 in both directions |
| S-4 — rule counts match the § 9.1.2 index | Pass — 373, per-domain exact |
| S-5 — exception-policy counts match § 9.32 | Pass — 301 of 373 |
| S-6 — risk distributions match the register | Pass — 72 |
| S-7 — identifier families collision-free | **Pass** (was the sole failure; closed by A-5) |

---

## 3. Amendment register

### A-1 — Retention term in the net-payable formula

| | |
|---|---|
| **Originating finding** | **A-1** — FM-19 double-counts released retention (mathematical defect) |
| **Locations** | § 7.2 (notation); § 7.8 (FM-19) |
| **Change** | FM-19: `Ret_cum` → `Ret_held`. Added a note stating why. Added two notation rows: `Ret_held` (= `Ret_cum − Ret_released − Ret_forfeited`, per RI-5) and `V_paid_cum` (cumulative confirmed net disbursement, previously defined only inside RI-6) |
| **Effect** | Removes an underpayment equal to released retention, recurring at every bill after any staged release |
| **Not changed** | FM-15 and FM-16 are untouched — they were correct. The § 7.13 worked example is untouched: no release occurs in it, so `Ret_held` = `Ret_cum` = ₹4,00,000 and every figure in it remains valid as printed |

### A-2 — Bill verification separated from origination

| | |
|---|---|
| **Originating finding** | **A-2** — § 6.14 contradicts RBL-10 (separation-of-duties defect) |
| **Location** | § 6.14, transition authority matrix |
| **Change** | `Bill → VERIFIED` annotated **(≠ originator)**, matching the treatment § 6.14 already gave `Bill → CERTIFIED` with its "(≠ verifier)" annotation |
| **Effect** | The matrix now enforces what RBL-10, SOD-2, LAW-4 and GP-03 require: origination and verification cannot collapse into one actor |
| **Not changed** | The Accountant remains the actor for both transitions — the enterprise's role allocation is unaltered. Only the separation constraint is made explicit, using the notation already established in the same table |

### A-3 — Payment channel enumeration completed

| | |
|---|---|
| **Originating finding** | **A-3** — LM-1 leaves retention release and the final account with no lawful route to payment |
| **Locations** | § 6.1.1 (LM-1); § 6.16 (terminal states) |
| **Change** | LM-1's entry list extended from `LC-05, LC-03, LC-06` to `LC-03, LC-05, LC-06, LC-08 (retention release), LC-11 (final account)`, with a sentence stating that the enumeration is exhaustive by intent. § 6.16 gains a closing note naming the five routes to disbursement |
| **Effect** | Released retention (FM-16) and the final account (CLS-04) now have a lawful route to LC-10, closing the undocumented-channel risk the rule exists to prevent |
| **Implementation note** | The validation specified adding the routes "to § 6.16's terminal-state table". **Implemented as a note beneath the table rather than as a new column**, because a column would have altered all nine existing rows — a structural change the constraint set forbids. The information recorded is the same |

### A-4 — Reconciliation identity RI-7 made falsifiable

| | |
|---|---|
| **Originating finding** | **A-4** — RI-7 is tautological: a reconciliation that cannot fail |
| **Location** | § 7.12 |
| **Change** | RI-7 restated from `Σ worker-days settled = Σ attendance records in state SETTLED` to `Σ worker-days paid across settlements in the period = Σ attendance records VALIDATED or LOCKED for that period`, with the residual investigated in both directions (per WKS-03). Detection column extended to name unsettled worker entitlement |
| **Effect** | Converts a control that always passed into one that detects days paid in excess of days validated (L1/L2) and days validated but never settled (worker detriment) |
| **Cross-consistency** | The restated identity is what WKS-03 already required and what XR-05 already tests; RI-7 previously contradicted both by comparing a record with itself, the failure mode XR-D names |

### A-5 — Rounding-point identifiers disambiguated

| | |
|---|---|
| **Originating finding** | **A-5** — `RP-` carries two meanings (sole structural-check failure) |
| **Locations** | § 7.3.2 (RND-3 table, RND-5); § 9.27 (FIN-04) |
| **Change** | Part 7's rounding points renamed `RP-1…RP-6` → **`RPT-1…RPT-6`**, in three places: the RND-3 table, RND-5's citation, and FIN-04's `round at RPT-1…RPT-6 only` |
| **Effect** | Restores unambiguous citation. Part 10's risk-posture set `RP-1…RP-5` is untouched and retains the prefix, being the more heavily cross-referenced of the two |
| **Verified** | 0 occurrences of `| RP-n |` remain; 6 `RPT-n` definitions present; all 5 Part 10 `RP-n` definitions intact |

### B-1 — Approval base defined

| | |
|---|---|
| **Originating finding** | **B-1** — the approval base is undefined for a cumulative bill |
| **Location** | § 9.19 (RBL-11) |
| **Change** | Mandatory clause now states the approval base is **cumulative certified value** (FM-06), consistent with GP-18, with net payable tested separately against disbursement authority (PEL-14). Prohibited clause now names the net-payable reading and states why it is perverse. Cross-refs extended to GP-18, RBL-12, PEL-09 |
| **Effect** | Delegated limits become testable against a single defined base, and approval tier stops varying with how much recovery happened to fall in the period |

### B-2 — Attendance attribution on a transfer date

| | |
|---|---|
| **Originating finding** | **B-2** — attendance attribution is undefined on a transfer date (LI-16 vs BRL-01/CLB-11) |
| **Locations** | § 9.10 (ATT-06); § 9.6 (BRL-01 cross-refs) |
| **Change** | ATT-06's Mandatory clause now states that on a transfer date attendance attaches to the deployment **in force at the start of the working day**, the transfer taking effect from the next working day, with a genuine same-day split carried as **one** record with split attribution. Prohibited clause now names two records on a transfer date and site-level agreement on who records it. BRL-01 cross-references ATT-06 |
| **Effect** | Removes a false positive in LI-16 — the document's most important labour-path control — in a normal operational case, and with it the site-level workaround that would otherwise have become the practice (LA-5) |
| **Implementation note** | The validation specified "add the rule to ATT". **Implemented as an amendment to ATT-06 rather than as a new ATT-21**, because a new rule would change the domain count, the § 9.1.2 index, the § 9.32 summary, the ARB-F15 figure, and the Part 11 closing summary — four cascading changes, against a constraint to preserve numbering. ATT-06 is also where the ambiguity lives: it is the single-occupancy rule itself |

### B-3 — Effective date `t` defined for spanning work

| | |
|---|---|
| **Originating finding** | **B-3** — `t` is undefined for work spanning a rate change |
| **Locations** | § 7.4 (new **RR-4**); § 8.6 (ME-6) |
| **Change** | **RR-4** added to the existing RR family: `t` is the date of completion of the element measured, the element being the smallest unit the method of measurement recognises (MM-1); where the method permits, an element spanning a rate boundary MUST be measured in two parts and each valued at its own `t`. ME-6 now cites RR-4 |
| **Effect** | Removes a rate-selection discretion worth the rate differential on the whole quantity, held by the actor § 4.6 declares conflicted |
| **Implementation note** | RR-4 is **additive within an existing family** (RR-1…RR-3), so no identifier was renumbered and no count table is affected. Part 7 carries no rule-count summary |

### B-4 — Consumption reversal on bill cancellation

| | |
|---|---|
| **Originating finding** | **B-4** — consumption reversal on bill cancellation is undefined |
| **Location** | § 9.17 (MSR-13) |
| **Change** | Mandatory clause now defines the reversal: on cancellation or rejection of a bill, consumed entries return to `VERIFIED` as an attributed act recorded against **both** the bill and each entry, requiring fresh check-measurement confirmation before re-billing. Prohibited clause now names silent, bulk, or self-performed restoration. Cross-refs extended to RBL-13 |
| **Effect** | Closes the mechanism RSK-18 describes and MSR-13 previously presupposed without defining |
| **Implementation note** | Implemented as an amendment to MSR-13 rather than a new MSR-19, for the reason given at B-2. MSR-13 is the consumption rule, so the reversal belongs to it |

### B-5 — Part 11 precedence resolutions promoted into the operative rules

| | |
|---|---|
| **Originating finding** | **B-5** — the PEL-06 / CLS-13 precedence exists only in the review narrative; ARB-F2's three resolutions share the defect |
| **Locations** | PEL-06, CLS-13, PEL-04, RET-06, PEL-11; § 11.12.2 (ARB-F1, ARB-F2 status lines) |
| **Change (four resolutions promoted)** | **(i)** PEL-06 now states that the cap applies at final account and that CLS-13 confers no payment authority; CLS-13 states the same from its own side. **(ii)** PEL-04 now states the chain is tested **per quantity, not per bill** (reconciling with MD-1/MSR-18). **(iii)** RET-06 now states that recovery-before-release does not qualify LAW-10 — the retention remains the contractor's money and LAW-8 governs only the order of application. **(iv)** PEL-11 now states that a worker paid directly under CTL-06 **is an entitled payee**, not a third party. Cross-refs added in both directions in each pair |
| **Effect** | An implementer reading only Part 9 — the operative layer — now reaches the same conclusion as a reader of Part 11. Previously they reached the opposite one in the PEL-06/CLS-13 case |
| **Consequential correction** | ARB-F1 and ARB-F2 previously read *"No text changed"* and *"Recorded for future implementers"*. Both statements became false on promotion. Their **Status** lines now record that they are superseded by amendment B-5. **This is a factual correction required by the amendment, not an additional change** |

---

## 4. Not applied

Recorded so that the boundary of this amendment set is unambiguous.

| # | Recommendation | Why not applied |
|---|---|---|
| **C-1** | WFC-side control on advance outstanding as a proportion of certified value | Class C. Would add an architectural control the validation classified as recommended, not accepted. **Highest-value backlog item** — the only unmeasured payment channel still has its ceiling set outside the capability (II-1) |
| **C-2** | Enumerate AT-4 read-logged classes | Class C (= ARB-F10, open) |
| **C-3** | Add SY-11 binding cross-path consumption at settlement | Class C (= ARB-F5, open) |
| **C-4** | Rename audit events `AE-` → `AEV-` to remove transposition with `EA-` | Class C. Cosmetic-adjacent; renaming is precisely what the constraint set forbids without an accepted finding |
| **C-5** | Add period close/reopen rows to § 6.14 | Class C |

**Also not applied:** nothing arising from ARB-F3, ARB-F4, ARB-F12, ARB-F13 or ARB-F14. These are
declared exposures and governance gaps, not defects, and three of them are outside this capability's
authority to close.

---

## 5. Freeze-condition status

| # | Condition | Status |
|---|---|---|
| **FC-A** | Adopt A-1 … A-5 | **Met** |
| **FC-B** | Adopt B-1 … B-5 | **Met** |
| **FC-C** | Re-run S-1 … S-7; all pass | **Met** — all seven pass, § 2 above |
| **FC-D** | **Independent review by a party who did not author the document** | **NOT MET — outstanding** |
| **FC-E** | Record C-1 … C-5 in a post-freeze backlog | **Met** — § 4 above |
| **FC-F** | Governance decision on Part 16 scope and XCP numbering | Outstanding (recommended, not blocking) |

> **CAP-WFC-01 is not yet frozen.** Three of the four mandatory freeze conditions are met. **FC-D
> remains outstanding and cannot be discharged by its author** (CP-2, and § 0 of the validation
> report). Architecture Freeze v1.0 requires that review.

---

*This log records amendments applied on the authority of the validation report. It is a record, not
an authority: adoption of the amendment set itself remains a governance decision to be recorded
against CAP-WFC-01.*
