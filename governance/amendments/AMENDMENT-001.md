# CONSTITUTIONAL AMENDMENT No. 1
### `governance/amendments/AMENDMENT-001.md`
## Ratification of the DSBC ERP Architecture Constitution, Version 1.0

> **Instrument type:** Constitutional Amendment (ratifying)
> **Enacting authority:** The Constitutional Ratification Board of the DSBC ERP Platform
> **Date of enactment:** 2026-07-07
> **Anchored to:** Codebase v0.9.0 (`v0.9-test-deployment`)
> **Governs:** [`governance/ERP_ARCHITECTURE_BIBLE.md`](../ERP_ARCHITECTURE_BIBLE.md), as reviewed in [`governance/ARCHITECTURE_BIBLE_REVIEW.md`](../ARCHITECTURE_BIBLE_REVIEW.md)
> **Status:** ENACTED
>
> **Nature of this instrument:** This amendment *ratifies and binds*. It introduces **no new architecture**, redesigns nothing, and reverses no engineering decision. It formalizes the governance framework by which the existing Architecture Bible becomes the operative constitution of the platform. It is enacted under the Bible's own Amendment Protocol (Appendix B) and is itself the first entry in the constitutional record.

---

## PREAMBLE

The DSBC ERP Platform, a commercial construction and real-estate enterprise system, having produced in [`governance/ERP_ARCHITECTURE_BIBLE.md`](../ERP_ARCHITECTURE_BIBLE.md) a complete engineering constitution grounded in verified source code; and that constitution having undergone formal constitutional review recorded in [`governance/ARCHITECTURE_BIBLE_REVIEW.md`](../ARCHITECTURE_BIBLE_REVIEW.md); and that review having returned the verdict **RATIFY WITH AMENDMENTS** — finding the constitution philosophically sound and architecturally strong, requiring not redesign but the addition of operational-governance instruments, elevated financial-integrity guarantees, and enterprise-lifecycle discipline;

The Constitutional Ratification Board now enacts this Amendment to **ratify the constitution, bind the approved amendments, establish the governance hierarchy, and set the procedures by which DSBC engineering shall be governed for the next decade** — preserving in full the constitution's prime directive: *continue from the current implementation; strengthen, do not rewrite.*

This Amendment is organized in eleven Articles.

---

## ARTICLE I — RATIFICATION OF THE CONSTITUTION

**§1.1** The document [`governance/ERP_ARCHITECTURE_BIBLE.md`](../ERP_ARCHITECTURE_BIBLE.md) is hereby ratified as the **DSBC ERP Architecture Constitution, Version 1.0** ("the Constitution"), the supreme engineering reference for the platform.

**§1.2** All twenty-five (25) Sections, the twenty-two (22) Non-Negotiables (NN-1 through NN-22), Appendix A (Canonical Glossary), and Appendix B (The Amendment Protocol) of the Constitution are ratified in full and take immediate effect.

**§1.3** The Constitution's **prime directive is entrenched**: DSBC evolves by continuation, not rewrite. No provision of this Amendment, and no future amendment, shall be read to authorize redesign or re-platforming except through the deliberately high bar set in Appendix B §4.

**§1.4** The Constitution is anchored to codebase v0.9.0. Where the Constitution and verified source code disagree, **the code prevails** and the Constitution is corrected (Constitution NN-21/NN-22). This Amendment does not alter that supremacy of source.

---

## ARTICLE II — ENACTMENT OF NON-NEGOTIABLES NN-23 THROUGH NN-30

The following eight Non-Negotiables, recommended by the constitutional review (Review §6) and approved by the Board, are hereby **added to Section 25 of the Constitution** and carry the same binding force as NN-1 through NN-22. Each is an *elevation of an existing concern* or the *fill of a named gap* — none introduces new architecture.

**§2.1 — NN-23 (Idempotency of money operations).**
Every financially-material operation MUST be idempotent. A replayed or double-submitted transition (payment release, receipt, journal post, retention release) MUST produce exactly one effect, guarded by an idempotency key derived from source document + transition. *(Elevates Constitution BE-5 from `SHOULD` to non-negotiable.)*

**§2.2 — NN-24 (End-to-end traceability).**
Every monetary transaction MUST be traceable end-to-end across its audit entry, domain event, journal entry, and source document by a single stable correlation identifier. *(Elevates Constitution ERR-7.)*

**§2.3 — NN-25 (No governed change without an ADR).**
Any architectural change, new dependency, new collection, new cross-cutting pattern, or amendment to a Non-Negotiable MUST be accompanied by an Architecture Decision Record containing, at minimum: technical justification, migration strategy (or an explicit "none required"), test-impact review, and the enumerated list of Non-Negotiables touched. *(Formalizes Constitution §4.4 / Appendix B.)*

**§2.4 — NN-26 (Lifecycle before ship).**
A new major entity MUST NOT ship until its full lifecycle — states, retention period, archival trigger, and deletion/reversal policy — is recorded in `governance/DATA_LIFECYCLE.md`.

**§2.5 — NN-27 (Feature flags for incomplete or risky features).**
Incomplete, experimental, or financially-risky features MUST ship behind a named, owned feature flag, MUST NOT be enabled in production until they pass the Release Gate (Article VIII), and MUST NOT become permanent flags; every flag carries a removal condition.

**§2.6 — NN-28 (Merge gate).**
No pull request MAY merge without passing the Definition of Done and the Pull Request Checklist of `governance/CHECKLISTS.md`. Continuous Integration MUST enforce `tsc --noEmit`, ESLint, and the test suite (Constitution TEST-7), and a human reviewer MUST verify the checklist.

**§2.7 — NN-29 (Cross-company isolation is proven, not assumed).**
Every change touching company-scoped data MUST include a test proving that a scoped user cannot read or write another company's data. *(Elevates Constitution MC-2 / TEST-3.)*

**§2.8 — NN-30 (PII is inventoried and minimized).**
No new field storing personally-identifiable information MAY ship without being recorded in the PII inventory and justified; PII MUST never enter logs or AI prompts beyond the requester's entitlement. *(Elevates Constitution SEC-8 / AI-10.)*

**§2.9** The Non-Negotiables register of the Constitution now comprises **NN-1 through NN-30**. Violation of any is, by definition, a failed change.

---

## ARTICLE III — MANDATORY SUPPORTING GOVERNANCE DOCUMENTS

**§3.1** The following documents are hereby declared **mandatory instruments of governance**. They are subordinate to the Constitution and this Amendment (Article IV) but binding on all engineering work. Documents not yet authored are **chartered** by this Amendment and MUST be created before the governance obligation that depends on them takes effect.

| Document | Status | Charter / Obligation |
|---|---|---|
| [`governance/ERP_ARCHITECTURE_BIBLE.md`](../ERP_ARCHITECTURE_BIBLE.md) | Ratified (Article I) | The Constitution. Supreme. |
| [`governance/ARCHITECTURE_BIBLE_REVIEW.md`](../ARCHITECTURE_BIBLE_REVIEW.md) | Of record | The founding constitutional review; advisory record. |
| `governance/amendments/` | Established herein | The immutable amendment record. This document is its first entry. |
| `governance/CHECKLISTS.md` | **Chartered — required for NN-28** | Definition of Done; Pull Request Checklist; Module Acceptance Checklist; Architecture Review Checklist; Release Checklist. |
| `governance/DATA_LIFECYCLE.md` | **Chartered — required for NN-26** | Per-entity lifecycle register (states, retention, archival, deletion/reversal, PII class, referential dependencies). |
| `governance/ADR/` + `governance/ADR/0000-template.md` | **Chartered — required for NN-25** | The Architecture Decision Record series and its template. |
| `governance/RELIABILITY.md` | Chartered — required before commercial multi-tenant onboarding | Backup/export policy, RPO/RTO, restore-drill cadence, observability SLOs, incident response. |
| `governance/COMPLIANCE.md` | Chartered — may begin as a stub | PII inventory and regulatory posture (India DPDP Act baseline). Matures with the first real tenant. |

**§3.2** The Board directs that the documents required by an enacted Non-Negotiable (`CHECKLISTS.md` for NN-28, `DATA_LIFECYCLE.md` for NN-26, `ADR/` for NN-25) be authored as a **Priority-0 obligation**, consistent with Review §9. Until each exists, the corresponding Non-Negotiable is *in force in principle*; the Board records that a Non-Negotiable whose instrument is not yet authored MUST NOT be used as grounds to *bypass* review — it is a duty to build the instrument, not a licence to skip the gate.

**§3.3** The Board recognizes that the **new Sections §26–§30 and the strengthenings of §22 and §24** recommended in Review §5 are approved in principle and SHALL be incorporated into the Constitution by subsequent amendment(s), each carrying its own ADR. This Amendment enacts the Non-Negotiables and charters the documents now; the section text follows through the ordinary amendment procedure (Article V) so that the Constitution's body is changed deliberately and on the record.

---

## ARTICLE IV — THE OFFICIAL GOVERNANCE HIERARCHY

**§4.1** DSBC engineering is governed by a strict hierarchy of authority. Where two instruments conflict, the higher prevails, **with one supremacy exception** (§4.3).

```
                    ┌─────────────────────────────────────────┐
   (highest)        │  1. VERIFIED SOURCE CODE                 │  ← ground truth
                    │     (the running, tested implementation) │
                    └─────────────────────────────────────────┘
                    ┌─────────────────────────────────────────┐
                    │  2. THE CONSTITUTION (Architecture Bible)│  ← supreme governance
                    │     incl. Non-Negotiables NN-1..NN-30    │
                    └─────────────────────────────────────────┘
                    ┌─────────────────────────────────────────┐
                    │  3. CONSTITUTIONAL AMENDMENTS            │  ← this record
                    │     (governance/amendments/*)            │
                    └─────────────────────────────────────────┘
                    ┌─────────────────────────────────────────┐
                    │  4. ARCHITECTURE DECISION RECORDS (ADRs) │  ← binding decisions
                    └─────────────────────────────────────────┘
                    ┌─────────────────────────────────────────┐
                    │  5. STANDARDS & SPECIFICATIONS           │  ← how-to detail
                    │     (CHECKLISTS, DATA_LIFECYCLE,         │
                    │      RELIABILITY, COMPLIANCE, specs)     │
                    └─────────────────────────────────────────┘
                    ┌─────────────────────────────────────────┐
   (lowest)         │  6. CODE COMMENTS, READMEs, TICKETS      │  ← subordinate notes
                    └─────────────────────────────────────────┘
```

**§4.2** The `governance/` directory is the only documentation directory whose contents outrank code comments (Constitution §4.4). Everything outside it that resembles documentation (README, blueprint, metadata) is subordinate and, where stale, MUST be corrected or deleted.

**§4.3 — The supremacy exception (source over constitution).**
Verified source code sits **above** the Constitution in the hierarchy for one purpose only: **as the arbiter of truth about what the platform actually does.** When code and any governance instrument disagree about a fact, the code is correct and the governance instrument MUST be corrected (Constitution NN-21/NN-22). This does **not** mean code may violate governance — governance *constrains what code is allowed to become*. The relationship is: **governance decides what SHOULD be; code reports what IS; when they diverge, either the code is a violation to be fixed, or the governance is stale to be corrected — and an ADR (Article VII) records which.** Divergence is never left unresolved.

**§4.4** No instrument below the Constitution may contradict it. An ADR, standard, or checklist that conflicts with a Non-Negotiable is void to the extent of the conflict, unless it is itself accompanied by a ratified amendment changing that Non-Negotiable.

---

## ARTICLE V — AMENDMENT PROCEDURES

**§5.1** The Constitution is amended only through this procedure, which extends and formalizes Appendix B of the Constitution.

**§5.2 — Initiation.** Any contributor (human or AI) MAY propose an amendment. A proposal MUST be accompanied by an ADR (Article VII) stating: the provision to be added or changed, the technical justification, the migration/impact strategy, the test-impact review, and the Non-Negotiables affected.

**§5.3 — Classification.** Amendments are of two classes:
- **Additive amendment** — adds a Section, a Non-Negotiable, or a supporting document without weakening any existing Non-Negotiable. Requires Board review and one ADR.
- **Entrenchment-altering amendment** — changes or removes an existing Non-Negotiable, or touches the prime directive (NN-19). Requires, in addition, an explicit ADR naming the specific seam affected and why strengthening was insufficient (Constitution Appendix B §4). The bar is deliberately high.

**§5.4 — Enactment.** An amendment takes effect when it is (a) recorded as a sequentially-numbered file in `governance/amendments/`, (b) accompanied by its ADR, and (c) marked ENACTED by the Board. Enacted amendments are **immutable**; corrections are issued as subsequent amendments, never by editing an enacted one.

**§5.5 — Section text follows procedure, not fiat.** Where an amendment approves new Constitution Sections *in principle* (as this Amendment does for §26–§30), the actual Section text MUST be incorporated by a subsequent additive amendment so the Constitution body is changed on the record.

**§5.6 — What is NOT an amendment.** Building a feature *within* existing patterns — a new service on the template, a new pure calc with tests, a new page under the composition contract, a new vertical config pack — is ordinary work requiring only conformance and the merge gate (Article VIII), never an amendment (Constitution Appendix B §3).

---

## ARTICLE VI — CONSTITUTIONAL REVIEW PROCEDURES

**§6.1** The Constitution SHALL be subject to periodic constitutional review to prevent drift between governance and the evolving platform.

**§6.2 — Cadence.** A full constitutional review MUST occur:
- **annually**, and
- on every **major version** increment of the platform, and
- upon any **entrenchment-altering amendment** (§5.3), and
- upon a **material security or financial incident** revealing a governance gap.

**§6.3 — Method.** A review MUST assess the Constitution against, at minimum, the ten criteria used in the founding review ([`ARCHITECTURE_BIBLE_REVIEW.md`](../ARCHITECTURE_BIBLE_REVIEW.md) §criteria): completeness, internal consistency, missing governance, contradictions, missing enterprise concepts, long-term maintainability, AI-collaboration readiness, multi-developer readiness, multi-company readiness, and financial integrity. A review MUST verify claims against source, not documentation.

**§6.4 — Output.** Each review produces a dated review document in `governance/` and, where it recommends change, one or more ADRs and proposed amendments. A review **never edits the Constitution directly** — it recommends to the Board (this is the model the founding review followed).

**§6.5 — Stewardship.** The Board is the standing steward of the Constitution. In its absence, the acting maintainer discharges the Board's function. The steward is responsible for convening reviews on cadence and for ensuring stale governance is corrected as a defect (NN-22).

---

## ARTICLE VII — WHEN AN ADR IS MANDATORY

**§7.1** An Architecture Decision Record is **mandatory** (per NN-25) for any of the following:

1. Adding, changing, or removing a Non-Negotiable, Section, or any provision of the Constitution.
2. Introducing a new third-party dependency (runtime or major dev).
3. Introducing a new Firestore collection or removing an existing one.
4. Introducing a new cross-cutting pattern (a new shared primitive, a new architectural layer, a new enforcement mechanism).
5. Changing the deployment topology (e.g. deploying the authoritative compute layer, adding an environment).
6. Changing a canonical financial formula, ceiling, or the posting map.
7. Changing `firestore.rules` in a way that alters who may perform a transition, or the enforcement location of any invariant.
8. Migrating a schema or backfilling a field across a collection.
9. Adopting or changing a product-AI capability that touches financial or PII data.
10. Establishing or changing a company/vertical boundary or a multi-tenancy posture.

**§7.2 — ADR contents.** Every ADR MUST contain: context; the decision; alternatives considered; technical justification; migration strategy (or explicit "none required"); test-impact review; the enumerated Non-Negotiables touched; status (proposed / accepted / superseded); and date. The template lives at `governance/ADR/0000-template.md` (chartered, Article III).

**§7.3 — ADR immutability.** ADRs are sequentially numbered and immutable once accepted. A reversed decision is recorded as a new ADR that supersedes the prior, which is marked superseded — never deleted.

**§7.4 — What does NOT require an ADR.** Conformant feature work within existing patterns (§5.6), bug fixes that restore intended behavior, test additions, and documentation corrections require no ADR — only the merge gate.

---

## ARTICLE VIII — MERGE-TIME AND RELEASE-TIME GOVERNANCE

**§8.1 — The Merge Gate (per NN-28).** No pull request MAY merge unless **all** of the following hold:
1. `tsc --noEmit` passes; ESLint passes; the test suite passes (Constitution TEST-7).
2. The **Definition of Done** (`CHECKLISTS.md`) is satisfied: for any state transition touched, it emits an audit entry and a domain event, enforces its preconditions in a transaction, scopes its writable fields, and returns a typed result (Constitution WF-3); financial math reuses the single shared implementation (NN-4); money mutations are atomic (NN-5) and idempotent (NN-23).
3. The **Pull Request Checklist** is completed by the author and verified by a reviewer, stating the Non-Negotiables impacted and — for any security- or finance-material change — which of the two REAL enforcement layers enforces each changed invariant (Constitution SEC-11).
4. If the change is one listed in Article VII, its **ADR is linked and accepted**.
5. If the change alters schema, a **reversible, tested migration** accompanies it (NN-25 migration strategy).
6. If the change touches company-scoped data, a **cross-company isolation test** is included (NN-29).
7. No dead controls, no dead code, no magic values, no `console.log`, no PII in logs (Constitution NN-17, NN-30).

**§8.2 — The Architecture Review Gate.** A change touching [`firestore.rules`](../../firestore.rules), the [`server/`](../../server/) authoritative layer, `secureApi.ts`, role logic, a financial formula, or the deployment topology MUST additionally pass the **Architecture Review Checklist**: does it continue rather than rewrite; does it enforce at the boundary; does it reuse shared math/validators; is its ADR present.

**§8.3 — The Release Gate (per NN-27).** No release to production MAY proceed unless the **Release Checklist** passes: production build strips dev-only paths (dev-login, client-fallback writes); `firestore.rules`, `firestore.indexes.json`, functions, and hosting deploy as a coordinated set (Constitution DEP-5); feature flags for incomplete work are disabled; the version constants, `VERSION`, and `package.json` are in sync and the deployment is logged (Constitution DEP-9); and — once the posting engine exists — the reconciliation report is green (Constitution POST-6).

**§8.4 — Enforcement.** The gates are not advisory. A merge or release that bypasses a gate is a governance violation to be reverted and recorded.

---

## ARTICLE IX — THE RELATIONSHIP AMONG CODE, CONSTITUTION, ADRs, STANDARDS, SPECIFICATIONS, AND CHECKLISTS

**§9.1** The six governance artifacts form one coherent system. Their relationship is defined as follows and MUST be understood by every contributor:

- **CODE** is *what is*. It is the ground truth of behavior and the arbiter of factual disputes (§4.3). Governance constrains what code may become; code never silently overrides governance — divergence is resolved, not tolerated.

- **THE CONSTITUTION** is *what must always be true*. It states the enduring principles and the Non-Negotiables. It changes slowly, deliberately, and only by amendment. It is the supreme governance instrument.

- **ADRs** are *why a specific decision was made*. Each is a dated, immutable point-decision that implements or interprets the Constitution for a concrete situation. ADRs accumulate into the reasoned history of the platform; they bind until superseded.

- **STANDARDS** (e.g. `RELIABILITY.md`, `COMPLIANCE.md`, the coding standards within the Constitution) are *the durable how*. They translate principles into repeatable practice. They are subordinate to the Constitution and ADRs and may not contradict them.

- **SPECIFICATIONS** (e.g. `DATA_LIFECYCLE.md`, per-vertical config specs, feature specs) are *the concrete what* for a given entity, vertical, or feature. They are the detailed, evolving descriptions the standards and Constitution govern.

- **CHECKLISTS** (`CHECKLISTS.md`) are *the enforcement at the moment of action*. They convert the Constitution, ADRs, standards, and specifications into pass/fail gates applied at merge and release. They are where governance meets the keyboard.

**§9.2 — The flow of authority (downward) and truth (upward).**
Authority flows **down**: the Constitution authorizes ADRs; ADRs and standards inform specifications; all of them are enforced by checklists at merge/release; the result is code. Truth flows **up**: code reports what is; where it diverges from the Constitution, either the code is corrected (a violation) or the Constitution is corrected (staleness), and an ADR records the resolution. Neither direction is ever left open — that closed loop is the platform's defense against the doc-vs-reality drift the founding audit found.

**§9.3 — One-line mnemonic for every contributor.**
> *The Constitution says what must be true; ADRs say why we decided; standards and specs say how and what; checklists prove it at merge; code is the truth we check everything against.*

---

## ARTICLE X — CONTINUITY AND NON-REGRESSION

**§10.1** This Amendment introduces **no new architecture** and reverses **no engineering decision**. Every provision either ratifies an existing part of the Constitution, elevates an existing rule to non-negotiable status, or charters a governance instrument recommended by the founding review.

**§10.2** The prime directive (NN-19) remains entrenched and is reaffirmed: DSBC is strengthened by continuation. Nothing herein may be construed to license redesign, rewrite, or re-platforming.

**§10.3** This Amendment is fully compatible with, and does not supersede, the technical roadmap in [`audit/NEXT_DEVELOPMENT_PLAN.md`](../../audit/NEXT_DEVELOPMENT_PLAN.md). The governance obligations enacted here and that roadmap's engineering priorities are to be pursued together.

---

## ARTICLE XI — RATIFICATION STATEMENT

**§11.1** By the authority of the Constitutional Ratification Board of the DSBC ERP Platform, and upon the constitutional review verdict of **RATIFY WITH AMENDMENTS**, the following is hereby declared:

> **The DSBC ERP Architecture Constitution, Version 1.0 — comprising [`governance/ERP_ARCHITECTURE_BIBLE.md`](../ERP_ARCHITECTURE_BIBLE.md) with its twenty-five Sections and Non-Negotiables NN-1 through NN-30 as extended by this Amendment — is OFFICIALLY ADOPTED as the supreme engineering constitution of the DSBC ERP Platform, effective 2026-07-07.**

**§11.2** From this date forward:
- The Constitution governs all engineering work on the platform.
- The governance hierarchy of Article IV is in force.
- The Non-Negotiables NN-1 through NN-30 are binding, and their violation is, by definition, a failed change.
- The mandatory supporting documents of Article III are chartered, with `CHECKLISTS.md`, `DATA_LIFECYCLE.md`, and the `ADR/` series designated Priority-0.
- Amendment, review, ADR, and merge/release procedures (Articles V–VIII) are operative.

**§11.3** This Amendment is entered as **AMENDMENT-001**, the first and founding entry in the constitutional record at `governance/amendments/`. It is immutable. Any correction shall issue as a subsequent numbered amendment.

**§11.4** The Board affirms the spirit under which this constitution was written and is now adopted: *to ratify what has been built, to strengthen where the platform is weak, and to govern DSBC engineering — honestly, verifiably, and continuously — for the decade ahead.*

---

**ENACTED** this 7th day of July, 2026, by the Constitutional Ratification Board of the DSBC ERP Platform.

**Ratify. Strengthen. Govern.**

*DSBC ERP Architecture Constitution, Version 1.0 — Officially Adopted.*

*End of Amendment No. 1.*
