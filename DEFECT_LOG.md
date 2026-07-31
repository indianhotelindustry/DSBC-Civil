# DEFECT LOG — DSBC Civil QA

**Opened:** 2026-07-30 · **Build under test:** `v1.0.0-beta.2` · **Environment:** staging *(not yet provisioned)*
**Plan:** [`MANUAL_QA_PLAN.md`](./MANUAL_QA_PLAN.md)

> **Status: QA has NOT started.** No defect can be logged yet, because no deployed
> environment exists to test against. This file is the register, ready to receive entries the
> moment staging is live ([`STAGING_DEPLOYMENT_PLAN.md`](./STAGING_DEPLOYMENT_PLAN.md)).
>
> Recording this plainly rather than pre-populating plausible-looking entries — an empty log
> that says "empty" is worth more than a log that implies testing happened (NN-7).

---

## 1. How to use this log

One row per **confirmed** defect. Before adding an entry, check §4 — several behaviours are
already known and accepted, and re-filing them as new defects wastes QA time.

**Workflow for every confirmed defect:**

```
Reproduce  →  Log here + GitHub issue  →  Root-cause  →  Smallest safe fix on fix/*
           →  Regression test (or record the tier gap)  →  Validate 4 gates  →  PR
```

**Governance that still applies during QA:**
- **Smallest safe fix.** No redesign, no refactoring adjacent code (NN-19).
- **`firestore.rules` and financial formulas remain ADR-mandatory.** A QA defect does not
  authorise changing either — it justifies *proposing* an ADR.
- **Every fix needs a regression test that fails before and passes after** (NN-16 / TEST-2).
  Where no test tier exists, say so in the entry — do not close silently.
- **Four gates green before any PR:** `tsc` · `npm test` · `npm run test:rules` · `npm run build`.

---

## 2. Defect register

| ID | Suite | Severity | Title | Root cause | Fix | Regression test | Status |
|---|---|---|---|---|---|---|---|
| — | — | — | *(no defects logged — QA not started)* | — | — | — | — |

**Severity:** **P0** money can be lost/created/moved without authorisation, or a security
boundary fails · **P1** a documented workflow cannot be completed · **P2** cosmetic, UX, or
performance.

**Status:** `OPEN` → `DIAGNOSED` → `FIX_IN_PROGRESS` → `FIXED_PENDING_PR` → `MERGED` ·
or `ACCEPTED` (known limitation, reason recorded) · `NOT_A_DEFECT`.

### Entry template

```markdown
### D-<n> · [QA-<suite>.<test>] <one-line symptom>

- **Severity:** P0 | P1 | P2
- **Role / environment:** e.g. ACCOUNTS on staging, v1.0.0-beta.2
- **Steps to reproduce:** 1. … 2. … 3. …
- **Expected:** …
- **Actual:** … (exact figures if money is involved)
- **Evidence:** console error, failing request + status, screenshot reference
- **Known?** checked against audit/TECHNICAL_DEBT.md, DEPLOYMENT_BLOCKERS.md, §4 below → new / known
- **Root cause:** file:line, and *why* it happens
- **Fix:** branch, the change, why it is the smallest safe one
- **Regression test:** path + what it asserts — or **TIER GAP:** which tier is missing
- **Gates:** tsc ☐ unit ☐ rules ☐ build ☐
- **GitHub issue:** #<n>
```

---

## 3. P0 escalation

If a **P0** is confirmed:

1. **Stop QA.** Do not continue other suites — a money-integrity failure may invalidate
   surrounding results.
2. Log it here and open the issue immediately.
3. **No merges to `main`** until it is diagnosed.
4. If it is a *rules* defect, the fix needs an **ADR** before implementation (AMENDMENT-001
   Article VII #7) — as with ADR-0001 and ADR-0002. Pin the behaviour with a
   characterization test in the meantime so it cannot be forgotten.
5. If it is a *financial formula* defect, it is **F-class** — business approval required. Do
   not change the formula.

---

## 4. Known and accepted — record, do not re-file

**Moved to [`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md)** — the single authoritative
register. Before filing anything, check it:

- [Register B — Silent-Danger](./RUNTIME_DIAGNOSTICS.md#3-register-b--🟠-silent-danger) holds the
  known finance divergences (**F-1**, **F-2**) and the open NN-5 concurrency defect (**F-4**).
  These are **real** issues that are **already owned elsewhere** — record what you see, do not
  re-diagnose them.
- [Register C — Benign](./RUNTIME_DIAGNOSTICS.md#4-register-c--🟢-benign) holds behaviour that
  looks like a fault and is not.

## 5. Test-tier coverage — where a regression test can actually go

| Bug type | Test location | Available? |
|---|---|---|
| Pure calculation / KPI / date logic | `src/lib/<module>.test.ts` | ✅ Yes — mature, 204 tests |
| `firestore.rules` permission | `tests/rules/<collection>.rules.test.ts` | ✅ Yes — mature, 177 tests |
| Committed configuration | `tests/config/*.test.ts` | ✅ Yes |
| Service-layer / cross-document rule | `tests/service/` | ❌ **Tier does not exist** |
| Cloud Function / transactional money | `tests/functions/` | ❌ **Tier does not exist** |
| UI behaviour / routing / dead controls | `tests/e2e/` | ❌ **Tier does not exist** |

**Three of six tiers are missing.** When a defect lands in one of them:

1. **Prefer pushing the test down.** If the root cause is pure logic, extract it into
   `src/lib/` and test it there. Usually possible, and always the better outcome.
2. **If it is a rules gap,** `tests/rules/` is mature — use it.
3. **If it is genuinely service-, function-, or UI-only,** record **TIER GAP** in the entry
   with a manual reproduction script, and note which tier is required. Do not mark the defect
   closed as though it were covered.

Creating a missing tier is real engineering work with its own decision — it is not something
to slip in mid-QA.

---

## 6. Summary

| Metric | Value |
|---|---|
| Suites executed | **0 of 9** |
| Defects logged | **0** |
| P0 open | 0 |
| Environment | **not provisioned** |
| QA status | **BLOCKED — awaiting staging** |

**Next action:** [`FIREBASE_PROVISIONING_GUIDE.md`](./FIREBASE_PROVISIONING_GUIDE.md) →
[`ENVIRONMENT_SETUP_GUIDE.md`](./ENVIRONMENT_SETUP_GUIDE.md) →
[`STAGING_DEPLOYMENT_PLAN.md`](./STAGING_DEPLOYMENT_PLAN.md) →
[`FIRST_RUN_PLAYBOOK.md`](./FIRST_RUN_PLAYBOOK.md) Step 6 smoke gate → begin
[`MANUAL_QA_PLAN.md`](./MANUAL_QA_PLAN.md) QA-1.
