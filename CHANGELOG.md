# Changelog

All notable changes to DSBC Civil (Enterprise Construction ERP Platform) are recorded here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/) for its `vX.Y.Z` product line. Governance milestones (e.g. `governance-v1.0`) are recorded separately in [`RELEASES.md`](./RELEASES.md) and [`governance/MILESTONES.md`](./governance/MILESTONES.md).

This is the commit-level log; for product milestones see [`RELEASES.md`](./RELEASES.md).

---

## [1.0.0-beta.1] — 2026-07-09 — Commercial rebranding: SIPL Work Orders → DSBC Civil

Controlled commercial rebranding and repository migration. **No business rules, workflows, financial calculations, Firestore rules, collections, or API endpoints changed.**

### Changed
- Product renamed **SIPL Work Orders → DSBC Civil** (subtitle: *Enterprise Construction ERP Platform*) across browser title, login screen, sidebar, daily-summary footer, README, START_HERE, RELEASES, CHANGELOG, audit headers, CI, and PR template.
- Package identity: `sipl-work-orders@0.9.0` → `dsbc-civil@1.0.0-beta.1`; `VERSION` and `src/lib/appVersion.ts` aligned.
- Firebase identity externalized: legacy project (`work-orders-4436d`) references removed; configuration now comes exclusively from `VITE_FIREBASE_*` environment variables (see `docs/FIREBASE_MIGRATION.md`).
- GitHub references replaced with placeholders pending the new commercial repository.

### Removed
- Obsolete AI Studio applet artifacts proven unused by the forensic audit (TECH-DEBT G-21): `metadata.json`, `firebase-blueprint.json`, dead `GEMINI_API_KEY`/`APP_URL` config.

> Domain identifiers are intentionally untouched: company codes `SIPL`/`SHSPL`, Firestore collection names, the `/work-orders` route, and all `workOrder*` code identifiers are business/domain names, not product branding.

---

## [Unreleased] — Platform Stabilization v1.1 (in progress)

Engineering Phase 2 is active. Planned for this cycle (see [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md)):
### Planned
- Deploy the secure backend as Firebase Cloud Functions.
- Invert `secureApi` to fail-loud; remove the production client fallback.
- Extract the single FinancialCalculationService (`computeWorkOrderFinancials`, `outflowCeiling`, `recalculateBillTotals`).
- Make receipt/schedule money mutations atomic.
- Posting engine foundation (chart of accounts, `journalEntries`) and retention/TDS liability tracking.

---

## [governance-v1.0] — 2026-07-07

The founding governance release. No application code changed; this establishes how the platform is governed.

### Added
- **Forensic audit baseline** (`audit/`): executive summary, module audit, technical-debt register, security audit, performance audit, architecture review, next-development plan.
- **Architecture Constitution v1.0** (`governance/ERP_ARCHITECTURE_BIBLE.md`): 25 sections, Non-Negotiables NN-1…NN-30.
- **Constitutional review** (`governance/ARCHITECTURE_BIBLE_REVIEW.md`): verdict RATIFY WITH AMENDMENTS.
- **Constitutional Amendment No. 1** (`governance/amendments/AMENDMENT-001.md`): ratifies the constitution, enacts NN-23…NN-30, defines the governance hierarchy, amendment/ADR/merge/release procedures.
- **Governance milestone record** (`governance/MILESTONES.md`) and tagging handoff (`governance/GOVERNANCE_V1_TAGGING.md`).
- **Governance operating instruments**: `governance/CHECKLISTS.md`, `governance/DATA_LIFECYCLE.md`, `governance/adr/ADR-TEMPLATE.md`, `governance/RELIABILITY.md`, `governance/COMPLIANCE.md`.
- **Repository navigation**: `README.md` (rewritten), `START_HERE.md`, `CURRENT_SPRINT.md`, `RELEASES.md`, `CHANGELOG.md`, `ENGINEERING_PHASE_2.md`.
- **Repository structure**: `docs/`, `tests/`, `scripts/`, `.github/` (PR template, CI workflow, issue templates); enhanced `.gitignore`.

### Changed
- `README.md` replaced the obsolete AI Studio boilerplate with an accurate platform overview.
- `CLOUD_FUNCTIONS_PLAN.md` relocated to `docs/`.

### Notes
- No `src/`, `server/`, or `firestore.rules` behavior was altered in this release. The codebase remains v0.9.0 (`v0.9-test-deployment`).

---

## [0.9.0] — pre-governance baseline

The state of the platform at the time of the forensic audit. Documented retrospectively; see [`audit/`](./audit/README.md) for the verified description of this baseline. Not itself a governed release.
