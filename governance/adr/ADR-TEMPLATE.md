# ADR-NNNN: <short decision title>

> Copy this file to `NNNN-short-kebab-title.md`, fill every section, and link it from your PR.
> ADRs are immutable once accepted. See [`README.md`](./README.md) for when an ADR is mandatory (NN-25, Amendment Article VII).

| Field | Value |
|---|---|
| **ADR** | NNNN |
| **Title** | <short decision title> |
| **Status** | Proposed \| Accepted \| Superseded by ADR-NNNN |
| **Date** | YYYY-MM-DD |
| **Author(s)** | <name / model> |
| **Deciders** | <who approved> |
| **Non-Negotiables touched** | NN-# , NN-# (list every one this decision affects) |
| **Supersedes** | ADR-NNNN \| none |

---

## 1. Context

*What is the situation that forces a decision? What is true in the code today (cite `file:line` / audit findings)? What constraint or problem are we responding to? State the forces at play — technical, governance, business.*

## 2. Decision

*The decision, stated in the imperative and unambiguously. "We will …". Name the exact files/collections/rules affected. Confirm explicitly that this **continues from the current implementation** and does not redesign (NN-19); if it appears to redesign, justify why strengthening was insufficient (Amendment §5.3).*

## 3. Alternatives considered

*At least two, each with why it was rejected. "Do nothing" is a valid alternative to evaluate.*

| Alternative | Pros | Cons | Rejected because |
|---|---|---|---|
| A. | | | |
| B. | | | |

## 4. Consequences

*What becomes easier, harder, or newly constrained. Positive and negative. Include the effect on the two REAL enforcement layers (rules / functions) if security- or finance-material.*

- **Positive:**
- **Negative / trade-offs:**
- **Enforcement impact:** *which invariant moves to which layer, if any (SEC-11).*

## 5. Migration

*How existing data/code moves to the new decision. Reversible? Backfill tool committed (AP-10 / NN-25)? If none required, state "None required" and why.*

- **Migration required:** Yes / No
- **Tool / steps:**
- **Rollback plan:**

## 6. Testing

*Test-impact review (required by NN-25). What tests are added/changed? For rules changes, the allow AND deny cases (TEST-3). For money, the failure case and idempotency (TEST-4, NN-23). For scoped data, the cross-company isolation test (NN-29).*

- **New/changed tests:**
- **Rules-unit-tests (if rules changed):**
- **Reconciliation impact (if posting/financial):**

## 7. Approval

*Record of acceptance. An ADR is not in force until Accepted.*

- **Approved by:**
- **Date accepted:**
- **Linked PR(s):**
- **Checklist gate passed:** [ ] Architecture Review · [ ] Security (if applicable) · [ ] Financial (if applicable)
