<!--
DSBC Civil Pull Request. Complete this template — it is the merge gate (NN-28).
See governance/CHECKLISTS.md for the full checklists. Delete non-applicable sections.
-->

## What & why
<!-- One paragraph. Link the sprint objective (CURRENT_SPRINT.md) or issue. -->

## Continuity statement
<!-- Confirm this continues/strengthens existing code and does not redesign (NN-19).
     If it appears to redesign, link the ADR that justifies it. -->
- [ ] This change continues from the current implementation (does not rewrite/redesign).

## Non-Negotiables impacted
<!-- List by number, e.g. NN-4, NN-5, NN-28. "None" is a valid answer for docs-only. -->

## ADR
<!-- Required if this is on the Article VII list (rules/functions/dependency/collection/pattern/
     financial formula/deployment/migration/AI/vertical boundary). -->
- [ ] Not ADR-required (conformant work within existing patterns), **or**
- [ ] ADR linked and accepted: ADR-____

## Enforcement layer (security/finance-material changes only)
<!-- State which REAL layer (firestore.rules / deployed function) enforces each changed invariant (SEC-11). -->

## Definition of Done (NN-28)
- [ ] `tsc --noEmit` passes · ESLint clean · `vitest run` green
- [ ] New pure logic has co-located tests (TEST-2)
- [ ] Rules change ships allow+deny rules-unit-tests (TEST-3)
- [ ] Transitions emit audit + event, precondition-in-transaction, field-scoped, typed result (WF-3)
- [ ] Financial math reuses the single shared implementation (NN-4)
- [ ] Money mutations atomic + idempotent (NN-5, NN-23)
- [ ] Company-scoped change includes a cross-company isolation test (NN-29)
- [ ] Typed errors, no silent failure, no leaked internals (NN-14)
- [ ] No dead code/controls, no magic values, no console.log, no PII in logs (NN-17, NN-30)
- [ ] Routes wrapped in ProtectedRoute + ErrorBoundary; destructive actions confirmed (NN-18)
- [ ] Docs/DATA_LIFECYCLE updated where a governed fact changed (NN-26)

## Applicable specialized checklists
<!-- Tick the ones that apply; complete them from governance/CHECKLISTS.md. -->
- [ ] Architecture Review (rules/server/secureApi/formula/deploy)
- [ ] Security
- [ ] Performance
- [ ] Financial
- [ ] Module Acceptance (new module/entity)
- [ ] AI Contribution (AI-authored)

## Migration
- [ ] No schema change, **or**
- [ ] Reversible, tested migration included (NN-25)

## Screenshots / verification
<!-- How you verified this works end-to-end (drive the flow, not just tests). -->
