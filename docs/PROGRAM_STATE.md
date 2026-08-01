# PROGRAM STATE — DSBC Civil

> **Future session: read this file FIRST.** It is the one-page continuity briefing.
> For the full prior conversation, run `claude --continue` (reloads the whole session).
> Ground truth order: source code > this file > other docs. Fix drift toward source.

**Repo:** `dsbc-civil` · **Version:** `1.0.0-beta.2` · **Last updated:** 2026-08-01
**Branch:** `release/1.0.0-beta.2` @ `92f702b` · clean tree, in sync with `origin`

> **Canonical repo:** https://github.com/indianhotelindustry/DSBC-Civil — the ONLY source of
> truth. No local copy is authoritative.
>
> **⚠️ Platform Stabilization v1.1 is NOT complete.** Scorecard verdict: **1 met, 1 partial,
> 4 open.** Do not describe it as done. Full scorecard:
> [`STABILIZATION_v1.1_RELEASE_REVIEW.md`](../STABILIZATION_v1.1_RELEASE_REVIEW.md) §5.
> What remains: [`NEXT_MILESTONE.md`](../NEXT_MILESTONE.md).
>
> **Engineering blockers to first deploy: zero.** Everything left is infrastructure
> (owner's Firebase account) or business policy. See
> [`DEPLOYMENT_BLOCKERS.md`](../DEPLOYMENT_BLOCKERS.md).

---

## Operating mode / standing instructions
- **Continue, don't rewrite.** Strengthen existing seams (NN-19).
- **Do NOT change** business logic, financial calculations, `firestore.rules`, or
  architecture without a governance decision (ADR). Bootstrap/hygiene changes only.
- **Verify against source, not docs.** If they disagree, code wins; fix the doc (NN-21).
- **"Green" = four gates:** `npm run lint` (`tsc --noEmit`) clean · `npm test`
  (`vitest run`) **204/204** · `npm run test:rules` **177/177** · `npm run build` succeeds.
  (Optional 5th: `npm run build --prefix functions` — the only compile gate on `functions/`.)
- Governance lives in `governance/` (Constitution `ERP_ARCHITECTURE_BIBLE.md`,
  `amendments/`, `adr/`, `CHECKLISTS.md`). Version identity is a triple that must stay
  in sync: `VERSION`, `package.json`, `src/lib/appVersion.ts` (DEP-9).
- **Backlog items are never implemented without explicit approval** ([`BACKLOG.md`](../BACKLOG.md)).

## DONE & frozen (with paths)
- **Repository bootstrap complete.** First commit `a8d4b63` ("chore: bootstrap DSBC Civil
  baseline v1.0.0-beta.1"). Evidence in [`BOOTSTRAP_REPORT.md`](../BOOTSTRAP_REPORT.md).
- **Annotated tag `v1.0.0-beta.1` created and pushed** (points at `a8d4b63`).
- **`release/1.0.0-beta.2` cut and pushed** — this was **Option B** of the promotion
  decision. `main` remains at the baseline `a8d4b63`. **Neither is "v1.1 complete."**
- **Prior product work — R2 Masters Foundation** (materialCategories, uoms, materials,
  vendors, stores, vehicles): additive masters, complete. See memory `project-r2-status`.
- **v1.1 O2 — `secureApi` fail-loud:** done. `CLIENT_FALLBACK_ENABLED` gates the client
  fallback; default is a typed throw, not a weaker write.
- **v1.1 O3 — rules tightened + PROVEN.** `tests/rules/` holds **177 emulator-backed
  tests**, all passing. Every money transition (payment→RELEASED, bill→APPROVED,
  bill→PAID, VO→APPROVED) is denied to **every** client role.
  See [`RULES_TEST_REPORT.md`](../RULES_TEST_REPORT.md).
- **ADR-0001 ACCEPTED & IMPLEMENTED (2026-07-29).** `statusUnchanged()` helper applied to
  `workOrders` PM-while-PENDING and `bills` ACCOUNTS/ADMIN-while-DRAFT. Closes R-1 (PM
  self-approval) and R-2 (ACCOUNTS self-verification).
  See [`ADR-0001_IMPLEMENTATION_REPORT.md`](../ADR-0001_IMPLEMENTATION_REPORT.md).
- **ADR-0002 ACCEPTED & IMPLEMENTED — H-3 CLOSED.** `auditLogs` create now binds
  authorship to the authenticated caller (NN-12). Merge `21b3ee8`. This was the last
  unmitigated NN violation in the rules.
- **D-1 CLOSED** — rate limiter keys on the verified uid, not the proxy IP (merge `e239e61`).
- **D-2 CLOSED** — `alerts` composite index committed and wired into deploy (merge `692174f`).
- **v1.1 O1 — functions written, wired, and VERIFIED TO BUILD** (1.3 MB ESM bundle
  exporting `api` + `dailyJobs`). Not deployed — see thread 1 below.
- **Runtime validation performed (2026-07-31)** — the app was actually run, not just read.
  Findings are recorded in [`RUNTIME_DIAGNOSTICS.md`](../RUNTIME_DIAGNOSTICS.md).

## The document map (read these, don't re-derive them)
| Question | File |
|---|---|
| What symptom am I looking at, and is it a defect? | [`RUNTIME_DIAGNOSTICS.md`](../RUNTIME_DIAGNOSTICS.md) — **the single authoritative register** |
| What actually stops a deploy? | [`DEPLOYMENT_BLOCKERS.md`](../DEPLOYMENT_BLOCKERS.md) |
| What closes v1.1, in what order? | [`NEXT_MILESTONE.md`](../NEXT_MILESTONE.md) |
| Non-blocking improvements (unapproved) | [`BACKLOG.md`](../BACKLOG.md) |
| QA defects, with lifecycle | [`DEFECT_LOG.md`](../DEFECT_LOG.md) |
| First run on a fresh machine | [`FIRST_RUN_PLAYBOOK.md`](../FIRST_RUN_PLAYBOOK.md) |
| Provisioning / env / staging deploy | `FIREBASE_PROVISIONING_GUIDE.md` · `ENVIRONMENT_SETUP_GUIDE.md` · `STAGING_DEPLOYMENT_PLAN.md` |
| Business decisions pending | [`docs/FINANCE_DECISIONS_PENDING.md`](./FINANCE_DECISIONS_PENDING.md) |

## Active / PAUSED threads — and what each is blocked on
1. **Deploy the backend (O1) — BLOCKED on Firebase provisioning.** Code and config are
   ready; the two former must-fix items (D-1, D-2) are now closed. Six infrastructure
   blockers remain (**I-1 … I-6**), all requiring the owner's Firebase account.
   See [`DEPLOYMENT_BLOCKERS.md`](../DEPLOYMENT_BLOCKERS.md) §B.
2. **Rules changes not yet deployed.** ADR-0001 and ADR-0002 ship with the next
   `npm run deploy:rules`, gated on provisioning (thread 1). Deploy rules BEFORE or WITH
   hosting so the boundary is never behind the app.
3. **Finance decisions F-1 + F-2 — BLOCKED on business approval.** The VO-approval formula
   and the overbilling ceiling. ADR-mandatory, must be decided **together**, no code
   changed. They have a **data-restatement clock**: decide before production data exists.
4. **Branch protection on `main` — status UNVERIFIED from this machine** (`gh` is not
   installed here). Owner action; treat as open until confirmed in the GitHub UI.
5. **Pre-deploy config — still placeholders, by design.** `.firebaserc`
   (`REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`) and `firebase-applet-config.json` (empty
   strings). They fail loud — do NOT deploy until set.
6. **T5 atomic money mutations — the last open money-integrity defect** (NN-5 / F-4).
   `sales.totalReceived` and `saleSchedules.paidAmount` use read-modify-write. Sprint
   work, not backlog. See `NEXT_MILESTONE.md` Workstream B.
7. **R3 Material Requests — next product phase, not started.** Gated behind P0 per
   `ENGINEERING_PHASE_2.md` ("do not build P1/P2 on an unenforced money core").

## Immediate next action(s)
1. **Confirm/enable branch protection on `main`** (+ tag protection, Dependabot, CodeQL).
   Cheapest win. Owner action — cannot be done or verified from this machine.
2. **Provision Firebase** (staging first, DEP-2) → deploy rules → indexes → functions →
   hosting. This is the only way C-1 closes, and the highest-value action available.
3. Route finance decisions **F-1 + F-2** to the business — restatement clock.
4. **T5 atomic money mutations** (Workstream B).
5. Close criterion 2 — compile the client fallback out of production builds (Workstream D).

## Key verified facts (don't re-derive)
- **This directory IS both the validated commercial baseline AND the `dsbc-civil` repo.**
  `sipl-git-audit` is a *different*, older project (remote `jabalpur26-ai/sipl-work-orders`)
  — not this product.
- Version triple all = `1.0.0-beta.2` (`VERSION`, `package.json`, `src/lib/appVersion.ts`).
  Verified 2026-08-01.
- Tests: **204 unit** (10 files — `src/lib/*.test.ts` + `tests/config/`) + **177 rules**
  (`tests/rules/`) = 381. The 204 were re-run and confirmed green 2026-08-01; the 177 are
  as recorded 2026-07-31 (needs the emulator). `npm test` is scoped so the rules suite
  never gates it.
- **`npm run test:rules` needs a JDK** (the Firestore emulator is Java). Temurin 21 is at
  `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`. Emulator port is **8085**
  (8080 is taken by Apache `httpd` locally).
- `firestore.rules` = **635 lines** (623 after ADR-0001, 606 before it). Frozen without an ADR.
  Note: `Get-Content x | Measure-Object -Line` **undercounts** (skips blank lines) — use
  `(Get-Content x).Count`.
- **Two runtime-proven first-run failures:** missing `VITE_FIREBASE_*` → **blank white page**
  with no error UI (`getAuth` throws at module-eval, before React renders — `ErrorBoundary`
  cannot catch it); missing ADC → every Admin-SDK call fails in the *server* log. Both are
  A-1 / A-2 in `RUNTIME_DIAGNOSTICS.md`.
- Backend **not deployed**: `server/` runs under `npm run dev`; `functions/` builds but has
  never been deployed. `functions/` is excluded from root `tsconfig`, so CI's
  `functions-build` job is its only compile gate.
- Financial calc libs: `financialCalculationService.ts`, `financialCalcs.ts`,
  `paymentRequestCalcs.ts`, `recoveryCalcs.ts`, `scheduleCalcs.ts`,
  `customerLedgerCalcs.ts` (all in `src/lib/`). `ledgerUtils.ts` has **zero tests**
  (Constitution TEST-1 blocks further ledger change — backlog TEST-004).
- `audit/` is a **frozen v0.9.0 snapshot** — its findings stand, its inventory figures do
  not. Superseded-figures table is in `audit/README.md`. Never "fix" numbers there.
- Env: Node `20.20.2`, npm `10.8.2`, git `2.55.0.windows.3`, firebase-tools `15.22.4`.
  `gh` is **not** installed on this machine.
- Build advisories (non-fatal, pre-existing): CSS `@import` order; JS chunk > 500 kB.
- `npm audit`: **1 critical, 6 high**, 10 moderate, 2 low. `react-router-dom` (high) is a
  runtime dep and needs an explicit disposition before deploy (**F-5**). Do **not** run
  `npm audit fix --force`.
