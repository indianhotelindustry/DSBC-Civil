# docs/ — Engineering Documentation

Technical and operational documentation that is neither governance (see [`../governance/`](../governance/)) nor the forensic audit (see [`../audit/`](../audit/)).

| Document | Purpose |
|---|---|
| [`GIT_STRATEGY.md`](./GIT_STRATEGY.md) | Branching, tagging, releases, semantic versioning, commit plan |
| [`FIREBASE_MIGRATION.md`](./FIREBASE_MIGRATION.md) | Provisioning the new DSBC Civil Firebase project (Auth, Firestore, Storage, Hosting, Functions, App Check, Analytics) |
| [`CLOUD_FUNCTIONS_PLAN.md`](./CLOUD_FUNCTIONS_PLAN.md) | Original plan for the authoritative backend (basis for Phase-2 P0.1 Cloud Functions deployment) |

## Where things live

- **What must always be true** → [`../governance/ERP_ARCHITECTURE_BIBLE.md`](../governance/ERP_ARCHITECTURE_BIBLE.md) (the Constitution)
- **What is true today** → [`../audit/`](../audit/README.md) (forensic baseline)
- **Why a decision was made** → [`../governance/adr/`](../governance/adr/)
- **How we ship correctly** → [`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md)
- **What we're building** → [`../ENGINEERING_PHASE_2.md`](../ENGINEERING_PHASE_2.md), [`../CURRENT_SPRINT.md`](../CURRENT_SPRINT.md)
- **How to onboard** → [`../START_HERE.md`](../START_HERE.md)

New engineering docs (API notes, runbooks, design notes) go here. Governance-binding documents go in `governance/`.
