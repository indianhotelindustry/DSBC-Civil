# Architecture Decision Records (ADRs)

This directory holds DSBC Civil's **Architecture Decision Records** — the immutable, reasoned history of every governed decision. It is chartered by [`../amendments/AMENDMENT-001.md`](../amendments/AMENDMENT-001.md) Article III and required by Non-Negotiable **NN-25**.

## When an ADR is mandatory

Per [`AMENDMENT-001`](../amendments/AMENDMENT-001.md) Article VII, an ADR is required for any of:
1. Adding/changing/removing a Non-Negotiable, Section, or constitutional provision.
2. A new third-party dependency.
3. A new Firestore collection (or removal).
4. A new cross-cutting pattern (shared primitive, layer, enforcement mechanism).
5. A deployment-topology change.
6. A change to a canonical financial formula, ceiling, or the posting map.
7. A `firestore.rules` change altering who may perform a transition, or the enforcement location of an invariant.
8. A schema migration / field backfill.
9. Adopting/changing a product-AI capability touching financial or PII data.
10. Establishing/changing a company/vertical boundary or multi-tenancy posture.

Conformant feature work *within* existing patterns does **not** need an ADR — only the merge gate ([`../CHECKLISTS.md`](../CHECKLISTS.md)).

## How to write one

1. Copy [`ADR-TEMPLATE.md`](./ADR-TEMPLATE.md) to `NNNN-short-kebab-title.md`, where `NNNN` is the next zero-padded sequence number (e.g. `0001-deploy-secure-backend-as-cloud-functions.md`).
2. Fill every section. Do not leave placeholders.
3. Link it from the PR (required by the PR checklist).
4. Once accepted, the ADR is **immutable**. A reversed decision is a new ADR that supersedes the prior; mark the old one `Superseded by ADR-NNNN`.

## Naming note (reconciliation)

[`AMENDMENT-001`](../amendments/AMENDMENT-001.md) and [`../MILESTONES.md`](../MILESTONES.md) refer to the chartered path as `governance/ADR/0000-template.md`. That charter is fulfilled by **this directory** (`governance/adr/`) with the operative template at [`ADR-TEMPLATE.md`](./ADR-TEMPLATE.md). The lowercase `adr/` path and `ADR-TEMPLATE.md` filename are the canonical, operative names; the amendment's reference is a chartered placeholder, satisfied here. (Recorded here rather than by editing the immutable amendment.)

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| — | *(none accepted yet — first ADRs arrive with Engineering Phase 2 P0 work)* | — | — |

> Expected early ADRs (from [`../../ENGINEERING_PHASE_2.md`](../../ENGINEERING_PHASE_2.md)): deploy secure backend as Cloud Functions; remove `secureApi` fallback; adopt custom-claims roles; introduce `journalEntries` + chart of accounts; unify the overbilling ceiling.
