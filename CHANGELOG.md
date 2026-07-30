# Changelog

All notable changes to DSBC Civil (Enterprise Construction ERP Platform) are recorded here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/) for its `vX.Y.Z` product line. Governance milestones (e.g. `governance-v1.0`) are recorded separately in [`RELEASES.md`](./RELEASES.md) and [`governance/MILESTONES.md`](./governance/MILESTONES.md).

This is the commit-level log; for product milestones see [`RELEASES.md`](./RELEASES.md).

---

## [1.0.0-beta.2] — 2026-07-30 — Enforcement boundary proven & hardened

An **interim validated increment** of Platform Stabilization v1.1 — **not the completion of
that sprint** (see the Unreleased section below for what remains). Security hardening, test
infrastructure, and deployment-blocker closure. **No business rule, workflow, financial
calculation, or collection changed.**

### Added
- **Firestore Rules emulator test suite** — 177 tests across 6 files (`tests/rules/`),
  covering bills, payments, payment requests, work orders, variation orders, the audit trail
  and the server-only collections. Asserts **both** allow and deny (NN-29 / TEST-3). Run with
  `npm run test:rules`; requires a JDK (the Firestore emulator is a Java process).
- **`firestore.indexes.json`** — the `alerts(type, relatedId, timestamp)` composite index the
  alert engine requires, wired into `firebase.json` so `firebase deploy` ships it. Pinned by
  5 hermetic tests in `tests/config/`.
- **ADR-0001** — field-scope the unscoped status-transition branches in `firestore.rules`.
- **ADR-0002** — bind audit-log authorship to the authenticated caller (NN-12).
- **`.gitattributes`** — pins LF in the repository and working tree; marks lockfiles generated.
- **CI jobs** — Firestore rules tests (with JDK 21 + emulator caching), production build, and
  a Cloud Functions bundle job (`functions/` is excluded from the root `tsconfig`, so this is
  its only compile gate).

### Fixed
- **Work-order self-approval (R-1)** — `firestore.rules` permitted a PROJECT_MANAGER to write
  `status: 'APPROVED'` directly, bypassing the CEO approval gate. The broad
  "PM may edit while PENDING" branch subsumed the field-scoped CEO branch beside it. Closed by
  a new `statusUnchanged()` guard (ADR-0001). NN-9, NN-3.
- **Bill self-verification (R-2)** — the same shape let ACCOUNTS verify the very bills it
  creates, bypassing PM verification. Closed by the same guard (ADR-0001).
- **Forgeable audit-log authorship (H-3)** — `auditLogs` create had no authorship binding, so
  any signed-in user could write an entry attributed to someone else; entries are immutable,
  so a forged one could never be corrected. Now requires
  `request.resource.data.userId == request.auth.uid` (ADR-0002). Satisfies **NN-12**.
- **Rate limiter throttled all users as one (D-1)** — the secure-route limiter used
  `req.ip`, which behind Firebase Hosting resolves to the Google Front End, placing every
  user in a single 30/min bucket: the 31st privileged request org-wide would have returned
  429 and taken the money path down. Now keys on the verified Firebase ID-token subject,
  which is correct regardless of proxy topology. Invisible in local dev, where there is no proxy.
- **Missing composite index would have failed silently (D-2)** — the alert engine's dedupe
  query needs a composite index; none was committed and `firebase.json` had no `indexes`
  pointer, so the scheduled job would have reported success while producing zero alerts.

### Changed
- Repository identity set to the canonical `indianhotelindustry/DSBC-Civil` (was a placeholder).
- `npm test` scoped to `src/**` and `tests/config/**` so the pure suite stays hermetic; the
  emulator-backed rules suite runs separately via `npm run test:rules`.
- Version identity → `1.0.0-beta.2` across `VERSION`, `package.json`, `package-lock.json`,
  `src/lib/appVersion.ts` (DEP-9); build label `v1.0.0-beta.2-stabilization`.

### Documentation
- Living documents corrected toward source (NN-21): stale test counts in the Constitution,
  the "no `functions/` directory" claim, the `secureApi` fallback description, and the
  `financialCalcs.ts` header that contradicted its own code.
- Historical records **marked, not rewritten** — `audit/` carries a superseded-figures table;
  `PLATFORM_STABILIZATION_v1.1.md` carries a task-status banner. Findings left intact.
- Added: `RULES_TEST_REPORT.md`, `DEPLOYMENT_READINESS_REPORT.md`,
  `ADR-0001_IMPLEMENTATION_REPORT.md`, `FIRST_PUSH_REPORT.md`, `REPOSITORY_HEALTH.md`,
  `STABILIZATION_v1.1_RELEASE_REVIEW.md`, `DEPLOYMENT_BLOCKERS.md`,
  `RELEASE_CANDIDATE_CHECKLIST.md`, `NEXT_MILESTONE.md`, `docs/FINANCE_DECISIONS_PENDING.md`.
- Corrected `.env.example`: `VITE_USE_FIREBASE_EMULATOR` is documented but **not implemented**
  in `src/lib/firebase.ts` — marked as reserved so it is not mistaken for working behaviour.

### Validation
`tsc --noEmit` clean · **204/204** unit tests · **177/177** rules tests · production build
green (3,759 modules) · Cloud Functions bundle builds (1.3 MB ESM). **381 automated tests.**

### Known limitations (NN-7)
- **Nothing is deployed.** Firebase remains unprovisioned by design; the four privileged
  operations fail loud in a hosting-only deployment. **AUDIT SECURITY C-1 is still open.**
- **NN-5 is still violated** — `sales.totalReceived` and `saleSchedules.paidAmount` use
  read-modify-write, so two concurrent receipts on one sale can silently lose money.
- **The client fallback code still ships** in the production bundle (unreachable at runtime).
  The `import.meta.env.DEV` compile-out guard (DEP-4) was not applied.
- **Two finance decisions remain open** — the variation-order approval formula and the
  authoritative overbilling ceiling. No financial formula was changed.
- Still **derived financial reporting, not double-entry accounting** (NN-7).

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

## [Unreleased] — Platform Stabilization v1.1 (**still in progress**)

> **v1.1 is NOT complete.** `1.0.0-beta.2` shipped an increment of it, not the sprint. Of the
> six exit criteria in [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md), **one is met, one is
> partial, four are open.** Scorecard:
> [`STABILIZATION_v1.1_RELEASE_REVIEW.md`](./STABILIZATION_v1.1_RELEASE_REVIEW.md) §5.

### Done (shipped in 1.0.0-beta.2)
- ✅ Criterion 1 — client-SDK money transitions rejected by `firestore.rules`, proven by 177 tests.
- ✅ `secureApi` inverted to fail-loud (behaviourally).
- ✅ Money-transition rules tightened; R-1, R-2 and H-3 closed.

### Remaining
- 🟡 **Criterion 2** — the production build still *contains* the client fallback code paths
  (unreachable at runtime). Needs the `import.meta.env.DEV` compile-out guard (DEP-4).
- ⬜ **Criterion 3** — deploy the secure backend as Firebase Cloud Functions. Blocked on
  Firebase provisioning (**C-1**).
- ⬜ **Criterion 4** — one implementation per money formula; remove the variation-order
  divergence; pin `form == function`. **Blocked on business approval** (see
  [`docs/FINANCE_DECISIONS_PENDING.md`](./docs/FINANCE_DECISIONS_PENDING.md)).
- ⬜ **Criterion 5** — make receipt/schedule money mutations atomic (NN-5); a
  concurrent-receipt test must prove no lost money.
- ⬜ **Criterion 6** *(stretch)* — posting-engine foundation (chart of accounts,
  `journalEntries`) and retention/TDS liability tracking. Deferred to v1.2.

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
