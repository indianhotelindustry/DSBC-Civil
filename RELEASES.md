# RELEASES — DSBC Civil Product Milestone History

This is the **product milestone timeline** for DSBC Civil: what shipped, what is shipping, and what is planned. It is the high-level companion to the commit-level [`CHANGELOG.md`](./CHANGELOG.md). Milestones map to git tags and GitHub Releases per [`docs/GIT_STRATEGY.md`](./docs/GIT_STRATEGY.md).

Legend: ✅ shipped · ▶ in progress · ⏳ planned

---

## Timeline

| Milestone | Version | Status | Git tag | Summary |
|---|---|---|---|---|
| **Governance v1.0** | governance-v1.0 | ✅ | `governance-v1.0` | Ratified constitution, forensic audit baseline, amendment process, governance instruments |
| **Commercial Baseline — DSBC Civil** | v1.0.0-beta.1 | ✅ | `v1.0.0-beta.1` | Rebranding SIPL Work Orders → DSBC Civil; repository & Firebase identity externalized; zero functional change |
| **Enforcement Boundary Proven** | v1.0.0-beta.2 | ✅ | `v1.0.0-beta.2` | **Interim increment of v1.1, not its completion.** Rules boundary proven (177 tests) & hardened (ADR-0001/0002); deployment blockers D-1/D-2 closed |
| **Platform Stabilization** | v1.1 | ▶ **(1 of 6 exit criteria met)** | `v1.1.0` (planned) | Deploy authoritative backend, compile out client fallback, unify financial math, atomic money mutations |
| **Accounting Core** | v1.2 | ⏳ | `v1.2.0` | Posting engine, journal, retention/TDS liabilities, trial-balance readiness, per-company books |
| **Construction ERP Beta** | v1.3-beta | ⏳ | `v1.3.0-beta` | Procurement transactions (PR→PO→GRN), inventory posting, reporting foundation |
| **Construction ERP RC** | v1.4-rc | ⏳ | `v1.4.0-rc.1` | Hardening, performance (scoped queries + pagination), security closure, e2e coverage |
| **Construction ERP v1.0** | v1.5 | ⏳ | `v1.5.0` | First production-grade, multi-tenant-safe construction release |
| **Hospitality Foundation** | v1.6 | ⏳ | `v1.6.0` | Hospitality vertical as a config pack over the same core (Constitution §24) |
| **Manufacturing Foundation** | v1.7 | ⏳ | `v1.7.0` | Manufacturing vertical config pack; procurement/inventory reuse |

> Versioning follows Semantic Versioning (see [`docs/GIT_STRATEGY.md`](./docs/GIT_STRATEGY.md)). The `governance-v1.0` tag is a governance milestone, not a code version, and is intentionally named separately from the `vX.Y.Z` product line.

---

## Milestone detail

### ✅ Governance v1.0 — *2026-07-07*
The platform's engineering foundation, not a code change.
- **Delivered:** [`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md) (Constitution, 25 sections, NN-1…NN-30); [`audit/`](./audit/README.md) (7-document forensic baseline); [`governance/ARCHITECTURE_BIBLE_REVIEW.md`](./governance/ARCHITECTURE_BIBLE_REVIEW.md); [`governance/amendments/AMENDMENT-001.md`](./governance/amendments/AMENDMENT-001.md); governance instruments (checklists, data lifecycle, ADR template, reliability, compliance).
- **Meaning:** engineering now proceeds under governance; architectural change flows through ADRs and amendments.
- **Recorded in:** [`governance/MILESTONES.md`](./governance/MILESTONES.md).

### ✅ Commercial Baseline — DSBC Civil v1.0.0-beta.1 — *2026-07-09*
The product's first commercial identity; a controlled rename, not a code release.
- **Delivered:** product renamed **SIPL Work Orders → DSBC Civil** (Enterprise Construction ERP Platform); package identity `dsbc-civil@1.0.0-beta.1`; Firebase/GitHub identity externalized to placeholders; obsolete AI-Studio artifacts removed; baseline documents ([`PROJECT_IDENTITY.md`](./PROJECT_IDENTITY.md), [`ROADMAP.md`](./ROADMAP.md), [`BASELINE_v1.0.0-beta.1.md`](./BASELINE_v1.0.0-beta.1.md), [`DECISIONS.md`](./DECISIONS.md), [`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md)).
- **Invariant:** no business rules, workflows, financial calculations, Firestore rules, collections, or endpoints changed.

### ✅ Enforcement Boundary Proven — DSBC Civil v1.0.0-beta.2 — *2026-07-30*
An **interim validated increment** of Platform Stabilization v1.1. **It does not complete that
sprint** — see the honest scorecard below.
- **Delivered:** Firestore Rules emulator test suite (**177 tests**, allow *and* deny, NN-29);
  **ADR-0001** (closes work-order self-approval R-1 and bill self-verification R-2) and
  **ADR-0002** (closes forgeable audit-log authorship H-3, satisfying **NN-12**);
  deployment blockers **D-1** (rate limiter throttled all users as one) and **D-2** (missing
  `alerts` composite index, failing silently) closed; Cloud Functions bundle verified to
  build; CI extended to rules tests, production build and the functions bundle;
  documentation drift corrected toward source with history preserved.
- **Validation:** `tsc` clean · 204/204 unit · 177/177 rules · build green · functions bundle
  builds. **381 automated tests.**
- **Invariant:** no business rule, workflow, financial calculation, or collection changed.
- **Deliberately NOT claimed:** nothing is deployed (**C-1 open**); NN-5 still violated
  (non-atomic money mutations); the two finance decisions remain open; still derived
  reporting, not double-entry accounting (**NN-7**).

### ▶ Platform Stabilization v1.1 — *opened 2026-07-08, still open*
Close the audit's CRITICAL enforcement gap.
- **Scope:** deploy `server/` as Cloud Functions; remove the `secureApi` production fallback;
  tighten money-transition rules; extract the single FinancialCalculationService; make money
  mutations atomic; begin the posting-engine foundation.
- **Exit criteria:** see [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md).
  **Status: 1 met · 1 partial · 4 open.**

  | # | Criterion | Status |
  |---|---|---|
  | 1 | Client-SDK money transitions rejected by rules | ✅ Met (exceeded) |
  | 2 | No money-transition code path in the production build | 🟡 Partial — code ships, unreachable |
  | 3 | Four privileged ops as **deployed** Cloud Functions | ⬜ Open — needs Firebase |
  | 4 | One money formula; VO divergence gone | ⬜ Open — business decision |
  | 5 | Atomic money mutations (NN-5) | ⬜ Open — not started |
  | 6 | *(Stretch)* First `journalEntries` posting | ⬜ Deferred to v1.2 |

- **Closes when all six hold:** SECURITY C-1/C-2/C-3/H-1/H-4; TECH-DEBT D-1/D-2/D-6.
  C-2, C-3 and H-3 are closed at the boundary; **C-1 is not.**
- **What remains, ordered:** [`NEXT_MILESTONE.md`](./NEXT_MILESTONE.md).

### ⏳ Accounting Core v1.2
Turn derived reporting into real, reconciled double-entry.
- **Scope:** chart of accounts; immutable `journalEntries`; posting engine on all financial transitions; retention/TDS liability lifecycle; reconciliation alarm; per-company book segmentation.
- **Gate to claim "accounting":** Constitution NN-7 — no double-entry claim until this ships and reconciles.

### ⏳ Construction ERP Beta / RC / v1.0
Complete the construction vertical to production grade.
- **Beta:** procurement transactions, inventory posting, reporting foundation.
- **RC:** performance (shared data layer, scoped/paginated queries, indexes), security closure (custom claims, boundary-enforced scoping), e2e tests, DR drills.
- **v1.0:** the first multi-tenant-safe, commercially-deployable construction release.

### ⏳ Hospitality & Manufacturing Foundations
New industry verticals delivered as **config packs over the unchanged core** (Constitution §24, VERT-1…VERT-3) — never forks.

---

## How milestones are cut

1. Work lands on `develop` via PRs passing the merge gate.
2. A milestone stabilizes on a `release/vX.Y.Z` branch (Release Checklist, [`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md)).
3. Merge to `main`, annotate a `vX.Y.Z` tag, publish a GitHub Release, and add the entry here + in [`CHANGELOG.md`](./CHANGELOG.md).
