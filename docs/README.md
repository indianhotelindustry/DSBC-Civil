# docs/ — Engineering Documentation

Technical and operational documentation that is neither governance (see [`../governance/`](../governance/)) nor the forensic audit (see [`../audit/`](../audit/)).

| Document | Purpose |
|---|---|
| [`PROGRAM_STATE.md`](./PROGRAM_STATE.md) | **Read first each session** — one-page continuity briefing: what is done, what is paused, what is next |
| [`GIT_STRATEGY.md`](./GIT_STRATEGY.md) | Branching, tagging, releases, semantic versioning, commit plan |
| [`FIREBASE_MIGRATION.md`](./FIREBASE_MIGRATION.md) | Provisioning the new DSBC Civil Firebase project (Auth, Firestore, Storage, Hosting, Functions, App Check, Analytics) |
| [`CLOUD_FUNCTIONS_PLAN.md`](./CLOUD_FUNCTIONS_PLAN.md) | The authoritative backend: what is implemented, what remains before deploy |
| [`FINANCE_DECISIONS_PENDING.md`](./FINANCE_DECISIONS_PENDING.md) | **Awaiting business approval** — the VO-approval formula and the overbilling ceiling. Both ADR-mandatory; no code changes until decided |
| [`PLATFORM_STABILIZATION_v1.1_SPECS.md`](./PLATFORM_STABILIZATION_v1.1_SPECS.md) | Detailed specs for the v1.1 sprint objectives |

Sprint deliverables at the repository root:
[`../RULES_TEST_REPORT.md`](../RULES_TEST_REPORT.md) (rules-unit-test results and findings) ·
[`../DEPLOYMENT_READINESS_REPORT.md`](../DEPLOYMENT_READINESS_REPORT.md) (pre-deploy blockers) ·
[`../ADR-0001_IMPLEMENTATION_REPORT.md`](../ADR-0001_IMPLEMENTATION_REPORT.md) (rules tightening) ·
[`../FIRST_PUSH_REPORT.md`](../FIRST_PUSH_REPORT.md) (canonical publication record) ·
[`../REPOSITORY_HEALTH.md`](../REPOSITORY_HEALTH.md) (health snapshot and scores).

## Where things live

- **What must always be true** → [`../governance/ERP_ARCHITECTURE_BIBLE.md`](../governance/ERP_ARCHITECTURE_BIBLE.md) (the Constitution)
- **What is true today** → [`../audit/`](../audit/README.md) (forensic baseline)
- **Why a decision was made** → [`../governance/adr/`](../governance/adr/)
- **How we ship correctly** → [`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md)
- **What we're building** → [`../ENGINEERING_PHASE_2.md`](../ENGINEERING_PHASE_2.md), [`../CURRENT_SPRINT.md`](../CURRENT_SPRINT.md)
- **How to onboard** → [`../START_HERE.md`](../START_HERE.md)

New engineering docs (API notes, runbooks, design notes) go here. Governance-binding documents go in `governance/`.
