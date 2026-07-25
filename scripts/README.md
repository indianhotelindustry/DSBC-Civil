# scripts/ — Operational & Migration Scripts

Repeatable operational tooling: data migrations, backfills, seeding, deployment helpers, and one-off maintenance scripts.

## Current state

Seeding and migration logic exists today **inside the app** as pure/service code, invoked from the UI:
- `src/lib/seedCompanies.ts`, `src/lib/seedWorkCategories.ts` — seed defaults (triggered from the Masters page).
- `src/lib/legacyDataCleanup.ts` — the project-`companyId` backfill (the template migration pattern).

## What belongs here

As the platform matures, standalone operational scripts move here — especially:
- **Migrations** for schema evolution (Constitution AP-10 / NN-25): every schema change ships a reversible, tested migration. The `legacyDataCleanup` pattern is the model.
- **Backfills** — e.g. adding required `companyId` to financial collections (Constitution MC-1, Phase 2).
- **Backup/restore helpers** — Firestore export/import wrappers ([`../governance/RELIABILITY.md`](../governance/RELIABILITY.md)).
- **Deployment helpers** — coordinated rules+indexes+functions+hosting deploys (Constitution DEP-5).

## Rules for scripts

- A migration script MUST be **reversible** (or its ADR explicitly justifies irreversibility) and **tested** before running against production (NN-25).
- Scripts that touch money or PII are governed by the same checklists as app code ([`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md)).
- Destructive scripts require confirmation and a documented rollback.
