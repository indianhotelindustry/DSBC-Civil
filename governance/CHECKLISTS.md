# GOVERNANCE CHECKLISTS — DSBC Civil

> **Authority:** Mandated by [`AMENDMENT-001`](./amendments/AMENDMENT-001.md) Article III (chartered) and Article VIII (merge/release gates). Required by Non-Negotiable **NN-28**.
> **Status:** Operative. These checklists are pass/fail gates, not suggestions. A change that skips an applicable checklist is a governance violation to be reverted (Amendment §8.4).

These checklists translate the Constitution's Non-Negotiables (NN-1…NN-30) into merge-time and release-time verification. They are the point where governance meets the keyboard. Each references the Constitution rule it enforces.

**How to use:** the author completes the applicable checklists in the PR description; a reviewer verifies. CI enforces the automatable items (`tsc`, ESLint, tests). Copy the relevant blocks into your PR (the [`.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md) pre-loads them).

---

## 1. Definition of Done (DoD)

A unit of work is **not done** until every applicable item is true.

- [ ] Code compiles: `tsc --noEmit` passes (NN-16, COD-1).
- [ ] Lint passes: ESLint clean (COD-2).
- [ ] Tests pass: `vitest run` green (TEST-7).
- [ ] New pure logic in `src/lib/` has co-located `*.test.ts` (NN-16, TEST-2).
- [ ] Any `firestore.rules` change ships rules-unit-tests proving **allow AND deny** (NN-16, TEST-3).
- [ ] Any state transition emits an **audit entry** and a **domain event**, re-asserts its precondition **in a transaction**, scopes its writable fields, and returns a typed result (NN-13, WF-3).
- [ ] Financial math reuses the **single shared implementation** — no re-derived formula (NN-4).
- [ ] Money mutations are **atomic** (`runTransaction`/`increment`) and **idempotent** (NN-5, NN-23).
- [ ] Company-scoped data is scoped at the boundary; a **cross-company isolation test** is included (NN-29).
- [ ] Rejections are typed `BusinessRuleError` with a precise code; no silent failure; no leaked internals (NN-14).
- [ ] No dead code, no handler-less controls, no magic values, no `console.log`, no PII in logs (NN-17, NN-30).
- [ ] Every route touched is wrapped in `ProtectedRoute` + `ErrorBoundary`; destructive actions confirmed (NN-18).
- [ ] Docs updated where a governed fact changed, including the entity's entry in [`DATA_LIFECYCLE.md`](./DATA_LIFECYCLE.md) if applicable (NN-26).
- [ ] If the change is ADR-mandatory (Amendment Article VII), the **ADR is linked and accepted** (NN-25).

---

## 2. Pull Request Checklist

Completed by author, verified by reviewer, in the PR description.

- [ ] **What & why** stated in one paragraph; linked to a sprint objective ([`CURRENT_SPRINT.md`](../CURRENT_SPRINT.md)) or issue.
- [ ] **Non-Negotiables impacted** listed by number (NN-#).
- [ ] **Continuity statement**: confirms this *continues/strengthens* existing code and does not redesign (NN-19). If it appears to redesign, an ADR justifies it.
- [ ] **Enforcement layer named**: for any security/finance-material change, states which of the two REAL layers (rules / deployed functions) enforces each changed invariant (SEC-11).
- [ ] **ADR linked** if the change is on the Article VII list.
- [ ] **Migration included** if schema changed — reversible and tested (NN-25).
- [ ] **Tests**: added/updated; both happy and failure paths (TEST-4).
- [ ] **Scope**: PR is focused; unrelated cleanup split out.
- [ ] DoD (§1) satisfied.

---

## 3. Architecture Review Checklist

Required for changes touching `firestore.rules`, `server/`, `secureApi.ts`, role logic, a financial formula, the posting engine, or deployment topology (Amendment §8.2).

- [ ] **Continues, not rewrites** — strengthens an existing seam (NN-19).
- [ ] **Enforcement at the boundary** — the invariant is enforced where the client cannot bypass it (NN-1, AP-6).
- [ ] **Single source of truth** — reuses shared math/validators; introduces no duplicate rule (NN-4, AP-1, AP-11).
- [ ] **Layer discipline** — respects the dependency direction; `src/lib/` stays React/Firebase-free (NN-11, §4.2).
- [ ] **State machine** — new/changed transitions are declared and guarded (AP-3, §11).
- [ ] **ADR present and accepted** with context, alternatives, migration, test-impact, NN rules touched (NN-25, Article VII).
- [ ] **No new dependency/collection/pattern** without an ADR (NN-20).

---

## 4. Security Checklist

Required for auth, rules, roles, `server/`, `secureApi`, or PII-touching changes (SEC-11).

- [ ] The invariant is enforced by a REAL layer (rules + deployed function), not by UI/service convenience (NN-1).
- [ ] No production path performs a money transition without the authoritative check (NN-2).
- [ ] Rules changes scope fields with `onlyFieldsChanged` on every transition branch (FS-3).
- [ ] Money transitions (payment→RELEASED, bill→PAID, WO-financial) are function-only, not client-writable (FS-2).
- [ ] Audit entries validate `userId == auth.uid`; append-only preserved (NN-12, SEC-6).
- [ ] Authorization derives from the boundary (role/claim), never a client parameter (APP-2).
- [ ] Separation of duties preserved: initiate ≠ approve (APP-1).
- [ ] No secret/credential committed; no PII in logs or AI prompts (NN-30, SEC-8, BE-8).
- [ ] Read exposure minimized (no unnecessary broad reads of `users`/PII) (SEC-7).
- [ ] Rules-unit-tests prove the denied cases (TEST-3).

---

## 5. Performance Checklist

Required for data-loading, subscription, or query changes.

- [ ] Every subscription `useEffect` returns its unsubscribe — no leak (NN — PERF-1, FE-3).
- [ ] No duplicate live listener on the same collection in one mounted tree (PERF-2).
- [ ] High-cardinality reads are `where`-scoped by company and paginated, not full-collection (PERF-3/4).
- [ ] Any multi-field query has its composite index committed to `firestore.indexes.json` (PERF-5, FS-5).
- [ ] Heavy derivations memoized on stable inputs; large lists virtualized where needed (PERF-7).
- [ ] Change justified by a measured cost where it claims an optimization (PERF-9).

---

## 6. Financial Checklist

Required for any change touching money: bills, payments, ceilings, formulas, posting, retention/TDS, ledgers, receipts.

- [ ] Uses the single shared formula (`computeWorkOrderFinancials` / `recalculateBillTotals` / `outflowCeiling`) — no re-implementation (NN-4).
- [ ] One authoritative overbilling ceiling applied at every relevant site (FIN-3).
- [ ] Money mutation is atomic and idempotent; a replay/double-submit produces exactly one effect (NN-5, NN-23).
- [ ] Rounding via shared `round2`; money epsilon is the named constant (FIN-7/8).
- [ ] `netPayable` and balances floored where negative is impossible (FIN-2).
- [ ] Every monetary transaction is traceable end-to-end by correlation id across audit/event/journal/source (NN-24).
- [ ] Posting (once live): entry balances (Σdebit = Σcredit), is immutable, references source + companyId, commits in-transaction with the transition (NN-6, POST-2/3/4/5).
- [ ] Retention/TDS treated as tracked liabilities with a release path, not silent deductions (FIN-4).
- [ ] Reconciliation: derived (Tier-2) and posted (Tier-3) agree on the affected records (POST-6).
- [ ] No claim of "double-entry accounting" unless the posting engine ships and reconciles (NN-7).

---

## 7. Module Acceptance Checklist

A new module/entity is accepted only when all five layers and its governance exist (§4.3).

- [ ] **Type**: interface + status enum in [`src/types.ts`](../src/types.ts).
- [ ] **Service**: `src/services/<entity>Service.ts` via `db.ts` primitives (COD-3).
- [ ] **Logic**: pure calc in `src/lib/` (+ tests) if any math.
- [ ] **UI**: page under `src/pages/` following the composition contract (FE-1).
- [ ] **Rules**: a `match` block in `firestore.rules` with status-transition + field scoping (FS-1/3).
- [ ] **Lifecycle**: an entry in [`DATA_LIFECYCLE.md`](./DATA_LIFECYCLE.md) before ship (NN-26).
- [ ] **Company dimension**: required `companyId` if company-owned financial data (MC-1).
- [ ] DoD (§1) met; ADR present if the module introduces a new pattern/collection (NN-25).

---

## 8. Release Checklist

Required before any production release (Amendment §8.3, NN-27).

- [ ] All merged work passed the merge gate; `develop` green.
- [ ] Production build **strips dev-only paths** (dev-login, client-fallback writes) via `import.meta.env.DEV` (DEP-4).
- [ ] `firestore.rules`, `firestore.indexes.json`, functions, and hosting deploy **as a coordinated set** (DEP-5/6).
- [ ] Feature flags for incomplete work are **disabled** in production (NN-27).
- [ ] Version constants, `VERSION`, and `package.json` are in sync; deployment logged to `appVersions` (DEP-9).
- [ ] Rules-unit-tests and the full suite pass against the release candidate.
- [ ] **Posting live only**: reconciliation report is green (Tier-3 == Tier-2) (POST-6).
- [ ] Backup verified and a restore drill is current (see [`RELIABILITY.md`](./RELIABILITY.md), RPO/RTO).
- [ ] Rollback plan documented for this release (RELIABILITY deployment rollback).
- [ ] [`RELEASES.md`](../RELEASES.md) and [`CHANGELOG.md`](../CHANGELOG.md) updated; git tag + GitHub Release prepared per [`docs/GIT_STRATEGY.md`](../docs/GIT_STRATEGY.md).

---

## 9. AI Contribution Checklist

Required when an AI model authors or proposes a change (Constitution §22, NN-20).

- [ ] The relevant Constitution section and the `audit/` baseline were read before editing (AI-1).
- [ ] Claims verified against **source**, not documentation; where they disagreed, code won and the doc was corrected (AI-2, NN-21).
- [ ] Reused shared math/validators; introduced no duplicate logic (AI-3, NN-4/11).
- [ ] Introduced **no** new dependency/collection/pattern without an ADR (AI-4, NN-20).
- [ ] Financial/security logic routed through human review gates (§4/§8 above) (AI-3).
- [ ] Governed fact changed → this constitution/docs updated in the same change (AI-5, NN-22).
- [ ] **AI change-proposal produced**: affected NN rules, ADR reference, test-impact statement, migration note.
- [ ] Product-AI features (if any) are **advisory only**, scope-respecting, and audited as AI-assisted (AI-7/8/9).
- [ ] No secret/PII beyond entitlement entered any prompt (AI-10, NN-30).

---

*These checklists are maintained alongside the Non-Negotiables. When an amendment adds or changes an NN rule, the corresponding checklist item is updated in the same change (Amendment §5).*
