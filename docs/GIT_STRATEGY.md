# GIT STRATEGY — DSBC Civil

Branching, tagging, releases, semantic versioning, and the Governance-v1.0 commit plan. This operationalizes the Constitution's deployment discipline (§20) and the merge/release gates ([`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md)).

> The `governance-v1.0` tagging handoff (for applying the milestone tag on the canonical repo) lives at [`../governance/GOVERNANCE_V1_TAGGING.md`](../governance/GOVERNANCE_V1_TAGGING.md). This document is the broader, ongoing strategy.

---

## 1. Branch strategy (enterprise Git flow)

```
main                         ← always releasable; every commit is a tagged or tag-able state
 └── develop                 ← integration branch; PRs land here first
      ├── platform/stabilization-v1.1   ← long-lived milestone integration branch
      │    ├── feature/cloud-functions
      │    ├── feature/remove-secureapi-fallback
      │    ├── feature/financial-calculation-service
      │    ├── feature/posting-engine
      │    └── feature/accounting-core
      ├── feature/*          ← one branch per unit of work, off develop (or the milestone branch)
      ├── release/vX.Y.Z     ← stabilization branch cut from develop for a release
      └── hotfix/*           ← urgent fixes off main, merged to main + develop
```

**Rules:**
- `main` is protected: no direct pushes; merges only from `release/*` or `hotfix/*`; every merge is releasable.
- `develop` is the integration line; `feature/*` branch off it (or off the active `platform/*` milestone branch).
- **Every merge passes the merge gate** ([`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md), NN-28) — CI + reviewer.
- Milestone branches (`platform/stabilization-v1.1`) collect a milestone's features before promotion to `develop`/`release`.
- `hotfix/*` fixes production; merges to `main` **and** back to `develop`.

**Naming:** `feature/<kebab-topic>`, `fix/<kebab-topic>`, `hotfix/<kebab-topic>`, `release/vX.Y.Z`, `platform/<milestone>`, `docs/<topic>`, `chore/<topic>`.

## 2. Commit conventions

Use **Conventional Commits**: `type(scope): summary`.
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`, `ci`.
- Scope: the area (`governance`, `payments`, `rules`, `functions`, `financial`, `repo`).
- Governed changes reference their ADR in the body: `Refs: ADR-0001`.
- Co-authorship trailer where applicable.

## 3. Tag strategy

- **Product versions:** annotated tags `vX.Y.Z` on `main` at each release.
- **Governance milestones:** `governance-vX.Y` (e.g. `governance-v1.0`) — deliberately separate from the product line, because governance versions independently of code.
- **Pre-release:** `vX.Y.Z-beta`, `vX.Y.Z-rc.N`.
- Tags are **annotated** (`git tag -a`) with a message; never lightweight for a release/milestone.

## 4. Release strategy

1. Cut `release/vX.Y.Z` from `develop`.
2. Run the **Release Checklist** ([`../governance/CHECKLISTS.md`](../governance/CHECKLISTS.md) §8): build strips dev paths; rules+indexes+functions+hosting deploy as a set; flags disabled; versions in sync; backups/restore current.
3. Merge to `main`, annotate the `vX.Y.Z` tag, publish a **GitHub Release** with notes drawn from [`../CHANGELOG.md`](../CHANGELOG.md).
4. Update [`../RELEASES.md`](../RELEASES.md) and [`../CHANGELOG.md`](../CHANGELOG.md); merge `main` back to `develop`.

## 5. Semantic versioning

`MAJOR.MINOR.PATCH`:
- **MAJOR** — breaking change to data model or public contract (rare; requires an ADR and likely a migration).
- **MINOR** — new capability, backward-compatible (most milestones: v1.1, v1.2…).
- **PATCH** — bug/security fix, no new capability.
Pre-release suffixes `-beta`, `-rc.N`. Keep `package.json` `version`, the `VERSION` file, and `src/lib/appVersion.ts` **in sync** (Constitution DEP-9) — a version bump touches all three in one commit.

## 6. Governance v1.0 commit plan

The recommended commit sequence to land the governance + repository-preparation work on the canonical repository. Run these on a branch (`docs/governance-v1.0`) and open a PR (honors NN-28), then tag after merge.

```bash
# On a branch off the canonical develop/main:
git checkout -b docs/governance-v1.0

# Commit 1 — the constitution and audit baseline
git add governance/ERP_ARCHITECTURE_BIBLE.md governance/ARCHITECTURE_BIBLE_REVIEW.md \
        governance/amendments/ audit/
git commit -m "docs(governance): establish DSBC governance v1.0

Constitution v1.0 (NN-1..NN-30), forensic audit baseline, and Amendment-001.
Refs: AMENDMENT-001"

# Commit 2 — onboarding and repository navigation
git add README.md START_HERE.md CURRENT_SPRINT.md RELEASES.md CHANGELOG.md ENGINEERING_PHASE_2.md
git commit -m "docs(project): add onboarding and repository navigation"

# Commit 3 — governance operating instruments
git add governance/CHECKLISTS.md governance/DATA_LIFECYCLE.md governance/adr/ \
        governance/RELIABILITY.md governance/COMPLIANCE.md governance/MILESTONES.md \
        governance/GOVERNANCE_V1_TAGGING.md
git commit -m "docs(operations): add lifecycle, reliability, compliance, checklists and ADR process"

# Commit 4 — repository preparation
git add .gitignore .github/ docs/ tests/ scripts/
git commit -m "chore(repo): prepare repository for Platform Stabilization"

# Push and open a PR; after it passes the merge gate and merges to main:
git checkout main && git pull --ff-only
git tag -a governance-v1.0 -m "DSBC Governance v1.0 — Constitution ratified (AMENDMENT-001)"
git push origin governance-v1.0
```

Then publish a **GitHub Release** named **"Governance Version 1.0"** off the `governance-v1.0` tag, with notes from [`../CHANGELOG.md`](../CHANGELOG.md).

> **Reminder:** this working copy is a detached ZIP (no `.git`); apply the above on the **canonical** repository, reconciling with its current state first (`git status` / `git diff`). See [`../governance/GOVERNANCE_V1_TAGGING.md`](../governance/GOVERNANCE_V1_TAGGING.md).
