# BOOTSTRAP REPORT — DSBC Civil

**Repository:** `dsbc-civil` (DSBC Civil — Enterprise Construction ERP Platform)
**Version:** `1.0.0-beta.1`
**Date:** 2026-07-25
**Prepared by:** Repository bootstrap pass (no business-logic changes)

---

## 1. Summary

The DSBC-Civil repository has been bootstrapped from the validated local commercial
baseline. All three release gates pass against the imported source:

| Gate | Command | Result |
|---|---|---|
| TypeScript compiles | `npm run lint` (`tsc --noEmit`) | ✅ Clean (exit 0) |
| Tests pass | `npm test` (`vitest run`) | ✅ **199 / 199** across 9 files |
| Production build | `npm run build` (`vite build`) | ✅ Success (exit 0), 3759 modules |

No business logic, financial calculations, Firestore rules, or architecture were
modified. The only working-tree change made during bootstrap was a hygiene addition
to `.gitignore` (see §5). No new features were implemented.

---

## 2. Baseline mapping (important)

The task framed two locations — a *fresh DSBC-Civil repository* and a *validated local
commercial baseline*. On inspection of the filesystem:

- **No separate empty `dsbc-civil` git repository exists on disk.** The nearest git
  repo, `Downloads/sipl-git-audit`, is an older, differently-branded SIPL project
  pointing at a different GitHub remote (`jabalpur26-ai/sipl-work-orders`) — not this
  product.
- **This working directory (`sipl-work-orders-master`) *is* the validated commercial
  baseline.** It already carries the full DSBC Civil identity (`PROJECT_IDENTITY.md`,
  `package.json` name `dsbc-civil`, the version triple, `BASELINE_v1.0.0-beta.1.md`),
  and it was **not** under version control (`git status` → "not a git repository").

Interpretation applied: **this directory is the DSBC-Civil repository to bootstrap.**
Because Git history was empty (no repo at all), "preserve Git history" reduces to
initializing a fresh repository whose **first commit is the validated baseline** — there
is no prior history to lose and no A→B file copy to perform, since the validated project
already lives here. If a distinct pre-existing DSBC-Civil repository was intended, point
me at its path and I will re-run the import against it; nothing here is destructive or
hard to reverse.

---

## 3. Imported files

Git was initialized and the full validated tree staged, honoring `.gitignore`.

- **Files tracked in the first commit: 189**
- **Excluded (correctly) by `.gitignore`:** `node_modules/`, `dist/` (2.2 MB build
  output), `.env*` (except `.env.example`), `.claude/`, `.kilo/`.
- **Verification:** a scan of the staged set for `node_modules`, `dist`, `.kilo`, and
  real `.env` files returned **none** — the index is clean.

### Breakdown

| Area | Files | Notes |
|---|---|---|
| `src/` | 121 | Application source (see below) |
| `governance/` | 13 | Constitution, amendments, ADRs, checklists |
| `server/` | 8 | Express secure API (dev-only per baseline) |
| `audit/` | 8 | Source-verified forensic audit |
| `docs/` | 5 | Migration, git strategy, specs |
| `functions/` | 2 | Cloud Functions (`index.ts`, `package.json`) — present, not deployed |
| Root config | ~24 | `package.json`, `tsconfig.json`, `vite.config.ts`, `firebase.json`, `firestore.rules`, `.github/`, release/governance markdown |

`src/` detail: `pages` 29, `services` 30, `lib` 27 (incl. 9 test files), `components` 30,
`context` 1, plus `App.tsx`, `main.tsx`, `types.ts`, `index.css`.

Financial-integrity surfaces imported **verbatim**: `firestore.rules` (606 lines),
`src/lib/financialCalculationService.ts`, `src/lib/financialCalcs.ts`,
`src/lib/paymentRequestCalcs.ts`, `src/lib/recoveryCalcs.ts`,
`src/lib/scheduleCalcs.ts`, `src/lib/customerLedgerCalcs.ts`.

---

## 4. Validation results (evidence)

**TypeScript — `tsc --noEmit`:** exit 0, no diagnostics.

**Tests — `vitest run` v3.2.7:** 9 files, **199 tests, 199 passed, 0 failed** (~2.1 s):

| Test file | Tests |
|---|---|
| `financialCalculationService.test.ts` | 5 |
| `userAccess.test.ts` | 39 |
| `masterValidations.test.ts` | 44 |
| `paymentRequestCalcs.test.ts` | 15 |
| `financialCalcs.test.ts` | 26 |
| `recoveryCalcs.test.ts` | 13 |
| `customerLedgerCalcs.test.ts` | 14 |
| `pmDashboardCalcs.test.ts` | 10 |
| `scheduleCalcs.test.ts` | 33 |

This matches the documented baseline exactly (`BASELINE_v1.0.0-beta.1.md`: "199/199
Vitest tests").

**Build — `vite build` v6.4.3:** exit 0, 3759 modules transformed. Output:

```
dist/index.html                0.53 kB │ gzip:   0.32 kB
dist/assets/index-*.css       96.89 kB │ gzip:  17.25 kB
dist/assets/index-*.js     2,117.19 kB │ gzip: 563.01 kB
```

**Version triple (Constitution DEP-9) — consistent:**

| Source | Value |
|---|---|
| `VERSION` | `1.0.0-beta.1` |
| `package.json` | `1.0.0-beta.1` |
| `src/lib/appVersion.ts` | `1.0.0-beta.1` |

Environment: Node `v20.20.2`, npm `10.8.2`, Git `2.55.0.windows.3`.

---

## 5. Issues & observations

None block the first commit. Recorded for transparency:

1. **`.gitignore` hygiene (change made).** `.kilo/` (a Kilo Code editor artifact that
   carries its own `node_modules/`) was **not** ignored and would have polluted the
   first commit. Added `.kilo/` to the `# Tooling` block alongside `.claude/`. This is
   tooling exclusion only — no source, logic, rules, or architecture touched.

2. **Line endings (informational).** On staging, Git warned it will normalize LF→CRLF
   on this Windows checkout. Harmless, but for a cross-platform team a `.gitattributes`
   with `* text=auto eol=lf` would pin consistent storage. **Recommended, not applied**
   (kept the bootstrap minimal). See §7.

3. **Build warnings (pre-existing, non-fatal).** `vite build` emits two advisories that
   do not fail the build and match the "production build green" baseline:
   - A CSS `@import` (Google Fonts) ordering warning.
   - Main JS chunk > 500 kB (563 kB gzipped) — code-splitting is a known future
     optimization, not a release blocker.

4. **Placeholders are intentional and unfilled (do not commit real secrets here).**
   `.firebaserc` → `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`, `firebase-applet-config.json`
   → empty strings, `package.json` repository URL → `YOUR-ORG/dsbc-civil`. These are set
   at GitHub/Firebase initialization per `docs/FIREBASE_MIGRATION.md`; they are correct
   to leave as placeholders in the baseline commit.

5. **Backend not deployed (by design).** `server/` runs only under `npm run dev` and
   `functions/` exists but is not live — consistent with `BASELINE_v1.0.0-beta.1.md` §2.
   `functions/` was imported but not separately built/deployed as part of this bootstrap
   (out of scope; deferred per baseline).

---

## 6. Repository preparation

- `git init` completed; default branch as configured locally.
- `.gitignore` verified effective (189 files staged, zero ignored-path leakage).
- Full validated tree staged and ready for the first commit.

### Recommended first commit

```bash
git commit -m "chore: bootstrap DSBC Civil baseline v1.0.0-beta.1

Import validated commercial baseline. tsc clean, 199/199 tests, build green.
No business-logic, financial, Firestore-rule, or architecture changes."
```

### Recommended annotated tag

Per `BASELINE_v1.0.0-beta.1.md` (planned tag `v1.0.0-beta.1`) and matching the version
triple:

```bash
git tag -a v1.0.0-beta.1 -m "DSBC Civil v1.0.0-beta.1 — first commercial beta baseline

Validation: tsc --noEmit clean · 199/199 Vitest tests · production build green.
Commercial beta; trusted-operator trust model. See BASELINE_v1.0.0-beta.1.md."
```

Tag **after** the first commit lands. Do not push until the canonical GitHub remote and
Firebase project IDs are set (§5.4).

---

## 7. Follow-ups (recommended, out of scope for bootstrap)

- Add `.gitattributes` (`* text=auto eol=lf`) to normalize line endings across the team.
- Set canonical remote (`git remote add origin …`) and update `package.json` repository
  URL + `.firebaserc` / `firebase-applet-config.json` at initialization.
- Confirm `.github/workflows/ci.yml` runs the same three gates (lint, test, build) in CI.
