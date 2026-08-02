# DEFECT LOG — DSBC Civil QA

**Opened:** 2026-07-30 · **Build under test:** `v1.0.0-beta.2` · **Environment:** `dsbc-civil-staging`
**Plan:** [`MANUAL_QA_PLAN.md`](./MANUAL_QA_PLAN.md) · **Evidence:** [`RUNTIME_VALIDATION_EVIDENCE.md`](./RUNTIME_VALIDATION_EVIDENCE.md)

> **Status: manual QA has NOT started.** Staging is now partially provisioned — Firestore rules
> and indexes are deployed — but **Cloud Functions deployment failed (defect D-1)**, so the
> privileged-operation paths cannot be exercised. Hosting was deliberately **not** deployed:
> the sequence forbids continuing past a failed layer.
>
> The one entry below came from **deployment**, not from QA. Recording that distinction rather
> than implying a QA pass happened (NN-7).

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

> **ID namespace note:** these `D-<n>` ids are the **defect** series and are *not* the same as
> the `D-1`/`D-2`/`D-3` **deployment-blocker** ids in
> [`DEPLOYMENT_BLOCKERS.md`](./DEPLOYMENT_BLOCKERS.md). Always say "defect D-1" or
> "blocker D-1" explicitly.

| ID | Suite | Severity | Title | Root cause | Fix | Regression test | Status |
|---|---|---|---|---|---|---|---|
| **D-1** | Deployment (RV-03) | **P0** | Cloud Functions bundle cannot load — `Dynamic require of "path" is not supported` | ESM output (`"type":"module"` + `--format=esm`) with **inlined CommonJS** deps (express → body-parser → `depd`), which `require()` at module scope | ✅ `createRequire` banner + `verify:bundle` load gate (`functions/package.json`) | ✅ `npm run verify:bundle` — proven to fail on the broken artifact | **FIXED — pending deploy re-verification (RV-03)** |

**Severity:** **P0** money can be lost/created/moved without authorisation, or a security
boundary fails · **P1** a documented workflow cannot be completed · **P2** cosmetic, UX, or
performance.

**Status:** `OPEN` → `DIAGNOSED` → `FIX_IN_PROGRESS` → `FIXED_PENDING_PR` → `MERGED` ·
or `ACCEPTED` (known limitation, reason recorded) · `NOT_A_DEFECT`.

### D-1 · [RV-03] `firebase deploy --only functions` fails — the bundle cannot be loaded

- **Severity:** **P0** — blocks AUDIT C-1, sprint criterion 3, and all four privileged operations
- **Role / environment:** deploy-time, `dsbc-civil-staging`, `v1.0.0-beta.2` @ `58d51e9`
- **Steps to reproduce:** 1. `npm run deploy:functions` · 2. observe the codebase-analysis step
- **Expected:** two functions deployed to `asia-south1` — `api` (HTTP) and `dailyJobs` (scheduled)
- **Actual:** `Error: Functions codebase could not be analyzed successfully`, preceded by
  `Error: Dynamic require of "path" is not supported` at `functions/lib/index.js:11`
- **Evidence:** deploy output 2026-08-02; reproduced locally twice —
  `cd functions && node --input-type=module -e "import('./lib/index.js')"` →
  `LOAD FAILED: Dynamic require of "path" is not supported`
- **Known?** Checked against `DEPLOYMENT_BLOCKERS.md`, `audit/TECHNICAL_DEBT.md` and §4 → **new.**
  It was *masked* by a build gate that never loaded the artifact
- **Root cause:** `functions/package.json:4` declares `"type": "module"` and the build emitted
  `--format=esm`, but esbuild **inlines CommonJS dependencies** (express → body-parser → `depd`).
  `depd` calls `require('path')` at module scope. ESM has no `require`, so esbuild's shim at
  `lib/index.js:11` throws. `createApp()` runs at module evaluation (`functions/index.ts:24`),
  so no cold start could ever avoid it
- **Fix:** committed directly to `release/1.0.0-beta.2` under the Phase D1 directive (not a
  `fix/*` branch). Two additive changes to `functions/package.json`, no application code:
  1. `--banner:js="import{createRequire}from'module';const require=createRequire(import.meta.url);"`
     — defines a real `require` in the ESM output, so esbuild's shim (`typeof require !== "undefined"`)
     delegates to it instead of throwing.
  2. A new `verify:bundle` script, chained onto `build` with `&&`.

  **Why this is the smallest safe fix (NN-19):** it changes only how the bundle is *linked*.
  The alternatives — switching the artifact to CommonJS, or abandoning bundling and shipping
  `node_modules` — both alter the module system or the deployment shape. This alters neither.
- **Regression test:** `functions/package.json` → `verify:bundle`, which performs a real ESM
  `import()` of the built artifact. **Proven in both directions:** exit **1** against a
  deliberately un-bannered rebuild, exit **0** against the fixed one. A gate that has never been
  observed to fail is not a gate — that was the original defect
- **Gates:** tsc ☑ · unit ☑ 204/204 · rules ☑ 177/177 · build ☑ 3,759 modules · functions ☑ (with load check)
- **GitHub issue:** *(not filed —* `gh` *is not installed on this machine; file manually)*

#### Build-gate improvement — rationale, rollback, residual risk

**Rationale.** `npm run build --prefix functions` proved only that esbuild *emitted* a file. It
never executed it. That gap let "Cloud Functions bundle builds — ✅ Runtime Proven" stand in the
register from 2026-07-29 until the first real deploy on 2026-08-02, and the claim was repeated in
`PROGRAM_STATE.md`, `DEPLOYMENT_BLOCKERS.md` and the release review. **The bundle had never
loaded, anywhere, at any point.** Only executing the artifact can prove the artifact runs.

**Rollback.** Fully reversible, no data or topology implications:
```bash
git revert <commit>          # or drop the two additions from functions/package.json
npm run build --prefix functions
```
The `--banner` flag affects only the emitted file's prologue; removing it restores the previous
(broken) artifact byte-for-byte. `verify:bundle` is additive — deleting it removes the check and
nothing else. **Neither the deployed rules nor the indexes are touched by any of this.**

**Residual risks — stated, not hand-waved:**
1. **The load check is not a functional test.** It proves the module *evaluates* and exports
   `api` + `dailyJobs`. It does not invoke a handler, reach Firestore, or verify behaviour. A
   function that loads and then misbehaves still passes. Real proof is **RV-11**.
2. **`createRequire` resolves relative to the emitted file.** Any future dependency doing a
   *dynamic* `require(variable)` for a module not inlined by esbuild would still fail — at
   runtime, on the request path, not at build. Not currently the case; worth knowing.
3. **Cold-start cost is unmeasured.** The banner adds one `module` import. Expected negligible,
   but not measured, so not claimed.
4. **Windows-only verification so far.** The check runs identically in CI (Linux), but that has
   not been observed yet — it will be on the next CI run.
5. **The gate is only as good as its `--input-type=module` flag.** Without it, `node -e` runs as
   CommonJS, `require` exists in scope, and the check reports a **false pass** — the exact trap
   that caught the first diagnosis attempt. Do not "simplify" that flag away.
6. **N-1 is now dated, and unrelated to this fix.** Node 20 is decommissioned **2026-10-30**.
   This fix does not extend that deadline.

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
