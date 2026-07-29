# PROGRAM STATE — DSBC Civil

> **Future session: read this file FIRST.** It is the one-page continuity briefing.
> For the full prior conversation, run `claude --continue` (reloads the whole session).
> Ground truth order: source code > this file > other docs. Fix drift toward source.

**Repo:** `dsbc-civil` · **Version:** `1.0.0-beta.1` · **Last updated:** 2026-07-29

---

## Operating mode / standing instructions
- **Continue, don't rewrite.** Strengthen existing seams (NN-19).
- **Do NOT change** business logic, financial calculations, `firestore.rules`, or
  architecture without a governance decision (ADR). Bootstrap/hygiene changes only.
- **Verify against source, not docs.** If they disagree, code wins; fix the doc (NN-21).
- **"Green" = four gates:** `npm run lint` (`tsc --noEmit`) clean · `npm test`
  (`vitest run`) **199/199** · `npm run test:rules` **170/170** · `npm run build` succeeds.
  (Optional 5th: `npm run build --prefix functions` — the only compile gate on `functions/`.)
- Governance lives in `governance/` (Constitution `ERP_ARCHITECTURE_BIBLE.md`,
  `amendments/`, `adr/`, `CHECKLISTS.md`). Version identity is a triple that must stay
  in sync: `VERSION`, `package.json`, `src/lib/appVersion.ts` (DEP-9).

## DONE & frozen (with paths)
- **Repository bootstrap complete.** `git init` here; first commit `a8d4b63`
  ("chore: bootstrap DSBC Civil baseline v1.0.0-beta.1"), 190 files, clean tree on
  `master`. Evidence in [`BOOTSTRAP_REPORT.md`](../BOOTSTRAP_REPORT.md).
- **Prior product work — R2 Masters Foundation** (materialCategories, uoms, materials,
  vendors, stores, vehicles): additive masters, complete. See memory `project-r2-status`.
- **v1.1 O2 — `secureApi` fail-loud:** done. `CLIENT_FALLBACK_ENABLED` gates the client
  fallback; default is a typed throw, not a weaker write.
- **v1.1 O3 — rules tightened + PROVEN (2026-07-29).** `tests/rules/` holds **170
  emulator-backed tests**, all passing. Every money transition (payment→RELEASED,
  bill→APPROVED, bill→PAID, VO→APPROVED) is denied to **every** client role.
  See [`RULES_TEST_REPORT.md`](../RULES_TEST_REPORT.md).
- **ADR-0001 ACCEPTED & IMPLEMENTED (2026-07-29).** `firestore.rules` gained a
  `statusUnchanged()` helper (`:74`) applied to two broad branches — `workOrders` PM-while-
  PENDING (`:207`) and `bills` ACCOUNTS/ADMIN-while-DRAFT (`:262`). Closes R-1 (PM
  self-approval) and R-2 (ACCOUNTS self-verification). Strictly a tightening; every
  legitimate workflow verified intact before and after. Rules now **623 lines**.
  See [`ADR-0001_IMPLEMENTATION_REPORT.md`](../ADR-0001_IMPLEMENTATION_REPORT.md).
- **v1.1 O1 — functions written, wired, and VERIFIED TO BUILD** (1.3 MB ESM bundle
  exporting `api` + `dailyJobs`). Not deployed — see thread 1 below.

## Active / PAUSED threads — and what each is blocked on
1. **Deploy the backend (O1) — BLOCKED on Firebase provisioning.** Code and config are
   ready. **Two must-fix items first** (both new, both would fail silently in production):
   `trust proxy` unset → global 30 req/min throttle on the money path; missing `alerts`
   composite index → alert engine silently produces nothing. Full list + corrected deploy
   sequence: [`DEPLOYMENT_READINESS_REPORT.md`](../DEPLOYMENT_READINESS_REPORT.md).
2. **ADR-0001 — DONE (accepted + implemented 2026-07-29).** Not a blocker any more.
   The rules change is **not yet deployed** — it ships with the next
   `npm run deploy:rules`, which is gated on Firebase provisioning (thread 1).
   Deploy rules BEFORE or WITH hosting so the boundary is never behind the app.
3. **Finance decisions — BLOCKED on business approval.** The VO-approval formula and the
   overbilling ceiling. Both ADR-mandatory, must be decided **together**, no code changed.
   See [`docs/FINANCE_DECISIONS_PENDING.md`](./FINANCE_DECISIONS_PENDING.md).
4. **Annotated tag `v1.0.0-beta.1` — NOT created, recommended only.**
   Blocked on: user go-ahead. Command is in `BOOTSTRAP_REPORT.md` §6. Tag AFTER commit.
5. **Pre-deploy config — PARTIALLY RESOLVED.** Repository URL is now set
   (`indianhotelindustry/DSBC-Civil`). Still placeholders, by design:
   `.firebaserc` (`REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`) and
   `firebase-applet-config.json` (empty strings). They fail loud — do NOT deploy until set.
6. **`.gitattributes` — DONE** (2026-07-29). `* text=auto eol=lf` plus binary and
   generated-file rules. Verified to cause zero content renormalization.
7. **H-3 audit-log forgery — still open.** `auditLogs` create lacks
   `userId == request.auth.uid` (`firestore.rules:341`). Pinned by a characterization
   test. Needs its own ADR. Last unmitigated NN violation in the rules.
8. **R3 Material Requests — next product phase, not started.** Gated behind P0 per
   `ENGINEERING_PHASE_2.md` ("do not build P1/P2 on an unenforced money core").

## Immediate next action(s)
1. Fix D-1 + D-2 from the deployment report, then provision Firebase and deploy (thread 1).
   The ADR-0001 rules tightening is waiting on that same deploy.
2. Route the two finance questions to the business owner (thread 3).
3. Open an ADR for H-3 (audit-log authorship) — last unmitigated NN violation (thread 7).

## Key verified facts (don't re-derive)
- **This directory IS both the validated commercial baseline AND the `dsbc-civil` repo.**
  No separate empty DSBC-Civil repo exists on disk. `sipl-git-audit` is a *different*,
  older project (remote `jabalpur26-ai/sipl-work-orders`) — not this product.
- Version triple all = `1.0.0-beta.1` (`VERSION`, `package.json`, `src/lib/appVersion.ts`).
- Tests: **199 unit** (9 files, `src/lib/*.test.ts`) + **170 rules** (6 files,
  `tests/rules/`). `npm test` is scoped to `src/**` so the rules suite never gates it.
- **`npm run test:rules` needs a JDK** (the Firestore emulator is Java). Temurin 21 is
  installed on this machine at `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`.
  Emulator port is **8085** (8080 is taken by Apache `httpd` locally).
- `firestore.rules` = **623 lines** (606 before ADR-0001). Treat as frozen without an ADR.
  Note: `Get-Content x | Measure-Object -Line` **undercounts** (skips blank lines) — use
  `(Get-Content x).Count`.
- Backend **not deployed**: `server/` runs under `npm run dev`; `functions/` builds but has
  never been deployed (no Firebase project). `functions/` is excluded from root `tsconfig`,
  so CI's `functions-build` job is its only compile gate.
- Financial calc libs: `financialCalculationService.ts`, `financialCalcs.ts`,
  `paymentRequestCalcs.ts`, `recoveryCalcs.ts`, `scheduleCalcs.ts`,
  `customerLedgerCalcs.ts` (all in `src/lib/`).
- `audit/` is a **frozen v0.9.0 snapshot** — its findings stand, its inventory figures do
  not. Superseded-figures table is in `audit/README.md`. Never "fix" numbers there.
- Env: Node `20.20.2`, npm `10.8.2`, git `2.55.0.windows.3`, firebase-tools `15.22.4`.
- Build advisories (non-fatal, pre-existing): CSS `@import` order; JS chunk > 500 kB.
- `npm audit`: **1 critical, 6 high**, 10 moderate, 2 low — drift since the 2026-07-09
  gate, not caused by new dependencies. `react-router-dom` (high) is a runtime dep and
  needs an explicit disposition before deploy.
