# FIRST PUSH REPORT — DSBC Civil

**Date:** 2026-07-29 · **Event:** First canonical publication (repository establishment)
**Performed by:** Repository establishment pass (Claude Opus 5)
**Outcome:** ✅ **SUCCESS** — all branches and tags published and independently verified

---

## 1. Repository

| Field | Value |
|---|---|
| **Canonical URL** | **https://github.com/indianhotelindustry/DSBC-Civil.git** |
| **Owner / name** | `indianhotelindustry` / `DSBC-Civil` |
| **Default branch** | `main` |
| **State before push** | **Empty** — zero refs (verified by `git ls-remote` before any write) |
| **Authentication** | Git Credential Manager (HTTPS) |
| **Product version** | `1.0.0-beta.1` |

> **This repository is now the single source of truth for DSBC Civil.** No alternate
> repository is authoritative. The local working copy is no longer canonical.
> `PROJECT_IDENTITY.md` has been updated to record this.

**Pre-push safety:** the remote was probed read-only and confirmed to contain **zero refs**
before anything was written. No existing work could be overwritten. No force-push was used
at any point; no history was rewritten; no commit was squashed.

---

## 2. Branches published

| Branch | Commit | Role |
|---|---|---|
| **`main`** | `a8d4b63d6822575ed89ee8090db50198d1315a91` | Protected default. The validated commercial baseline, exactly as tagged. |
| **`platform/stabilization-v1.1`** | `9370c3c4e0f8f9275d2a54f9d9df88f3cc516541` | Milestone integration branch carrying the v1.1 work. |

Both verified byte-for-byte against the remote after push (`local == origin/…` → `True`).

### Why the stabilization work is not on `main`

`docs/GIT_STRATEGY.md` §1 states: *"`main` is protected: no direct pushes; merges only from
`release/*` or `hotfix/*`; every merge is releasable."* Committing the v1.1 work directly to
`main` would have violated the repository's own strategy on its first day.

**Consequence you should be aware of:** a visitor landing on the GitHub default branch sees
the **v1.0.0-beta.1 baseline**, not the stabilization work. The rules test suite, ADR-0001,
and the four new reports live on `platform/stabilization-v1.1` until promoted. GitHub has
already offered the PR link:

```
https://github.com/indianhotelindustry/DSBC-Civil/pull/new/platform/stabilization-v1.1
```

Opening that PR is the correct next governance step (NN-28 merge gate). **See §8.**

---

## 3. Tags published

| Tag | Type | Tag object | Targets commit |
|---|---|---|---|
| **`v1.0.0-beta.1`** | **Annotated** (`git cat-file -t` → `tag`) | `67b0b4bdc5243977c676564e321af0117f081cf3` | `a8d4b63` |

Annotated as required by `docs/GIT_STRATEGY.md` §3 (*"never lightweight for a
release/milestone"*). Tagger: Devendra Singh Sehgal, 2026-07-29 17:17:23 +0530.

**The tag points at the baseline commit `a8d4b63`, not at the stabilization commit.** This
is deliberate. `BASELINE_v1.0.0-beta.1.md` and `BOOTSTRAP_REPORT.md` §6 both define
`v1.0.0-beta.1` as the validated baseline state — 199 tests, 606-line `firestore.rules`, no
ADRs. The stabilization work is **v1.1 in progress** and must not be retro-labelled as the
beta baseline. The tag message records this explicitly.

---

## 4. Commits

Two commits exist in the canonical history. **Neither was squashed, amended after push, or
rewritten.**

| SHA | Date | Branch | Subject |
|---|---|---|---|
| `a8d4b63` | 2026-07-25 | `main` | `chore: bootstrap DSBC Civil baseline v1.0.0-beta.1` |
| `9370c3c` | 2026-07-29 | `platform/stabilization-v1.1` | `chore(platform): Platform Stabilization v1.1` |

`9370c3c` — **33 files changed, 3,115 insertions, 49 deletions** — is one coherent
engineering unit as instructed, following Conventional Commits and carrying `Refs: ADR-0001`
per `GIT_STRATEGY.md` §2. It contains:

- Documentation alignment (drift corrected toward source; history preserved, not rewritten)
- The Firestore Rules emulator suite (170 tests, 7 new files)
- ADR-0001 implementation (`firestore.rules` +21/−4)
- Deployment readiness review and reports
- Cloud Functions build validation (`functions/package-lock.json` committed)

---

## 5. Validation summary

Every gate was run **before** the push. No regression.

| Gate | Command | Result |
|---|---|---|
| **TypeScript** | `tsc --noEmit` | ✅ **0 errors** |
| **Unit tests** | `npm test` | ✅ **199 / 199** passed (9 files) |
| **Rules tests** | `npm run test:rules` | ✅ **170 / 170** passed (6 files) |
| **Production build** | `npm run build` | ✅ Success — 3,759 modules |
| **Functions bundle** | `npm run build --prefix functions` | ✅ 1.3 MB ESM (`api`, `dailyJobs`) |

**Total automated tests: 369** (199 unit + 170 rules).

Build advisories (pre-existing, non-fatal, unchanged from baseline): CSS `@import` ordering;
main JS chunk 2.12 MB / 563 kB gzipped.

---

## 6. Integrity and security verification

| Check | Result |
|---|---|
| Working tree clean at push time | ✅ Clean |
| Unstaged changes | ✅ None |
| Untracked source files | ✅ None (all 15 new files intentionally staged) |
| Accidentally ignored source | ✅ None |
| `node_modules/` committed | ✅ No |
| `dist/` committed | ✅ No |
| `functions/lib/`, `functions/node_modules/` committed | ✅ No |
| `.env` / `.env.local` committed | ✅ No (`.env.example` only, placeholders) |
| Editor/temp artifacts (`.orig`, `.bak`, `.DS_Store`, …) | ✅ None found |
| **Service-account JSON / private keys** | ✅ **None** (`BEGIN PRIVATE KEY`, `service_account`, `private_key_id` — zero hits) |
| **Firebase API keys (`AIzaSy…`)** | ✅ **None** — only prose in `RELEASE_READINESS.md` describing the sweep |
| **Live Firebase domains** | ✅ **None** — only `<project>.firebaseapp.com` templates in migration docs |
| Legacy project ID (`work-orders-4436d`) | ✅ Historical records only (CHANGELOG, REBRANDING_REPORT, migration doc) — intentional |
| `.gitignore` correct | ✅ Verified effective |
| `.gitattributes` | ✅ **Created** this pass (was missing) |
| Duplicate documentation | ✅ None |
| Broken doc cross-references | ✅ **Zero** across 51 markdown files |

**No credentials, secrets, or API keys are present in the published repository.**

### `.gitattributes` (new)

Pins `* text=auto eol=lf` plus explicit text/binary classes and marks both lockfiles
`linguist-generated -diff`. Verified with `git add --renormalize .` that it caused **zero
content churn** — the blobs were already LF, so no mass-renormalization diff polluted the
commit.

---

## 7. Placeholder configuration still requiring user action

These are **intentional and documented**. They fail loud rather than silently pointing at
the wrong infrastructure.

| Placeholder | File | Effect until set | Action |
|---|---|---|---|
| `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` | `.firebaserc` | **All** `firebase deploy` commands fail | Set after creating the Firebase project(s) — `docs/FIREBASE_MIGRATION.md` §1 |
| Empty strings | `firebase-applet-config.json` | Client cannot reach Firebase unless `VITE_FIREBASE_*` are set | Leave empty; supply config via env vars |
| `VITE_FIREBASE_*` (7 keys) | build environment | App cannot reach Firebase | Set in `.env.local` and the CI build environment |

**Resolved this pass:** the `YOUR-ORG/dsbc-civil` repository placeholder is gone — set to
`indianhotelindustry/DSBC-Civil` in `package.json`, `README.md` and `PROJECT_IDENTITY.md`.

> **Naming note:** GitHub repo is `DSBC-Civil`; the npm package name in `package.json`
> stays `dsbc-civil` (npm requires lowercase). Both are correct — recorded in
> `PROJECT_IDENTITY.md` so it is not mistaken for drift later.

---

## 8. Remaining deployment blockers

Publication is complete; **deployment is not, and was not attempted.** Nothing was deployed
to Firebase. Full detail in [`DEPLOYMENT_READINESS_REPORT.md`](./DEPLOYMENT_READINESS_REPORT.md).

| ID | Blocker | Severity | Fix |
|---|---|---|---|
| **D-1** | `trust proxy` unset → behind Hosting all users share ONE 30 req/min bucket; the 31st privileged request org-wide gets 429 | **High** | 1 line in `createApp()` |
| **D-2** | Missing `alerts` composite index; no `firestore.indexes.json`. The failure is swallowed by a `catch`, so the alert job reports success while producing nothing | **High** | Commit index file + wire into `firebase.json` |
| **D-6** | Firebase project not provisioned | By design | `docs/FIREBASE_MIGRATION.md` |
| **D-3** | Functions ignore named-database config → client/server split-brain if a non-default DB is used | Medium | Use `(default)`, or add an env var |
| **D-5** | `npm audit`: 1 critical, 6 high — incl. `react-router-dom` (runtime) | Medium | Per-advisory disposition before deploy |

**C-1 remains open:** the authoritative backend is written, wired and verified to build, but
is not deployed. The four privileged operations fail loud in a hosting-only deployment.

### Recommended next actions, in order

1. **Open the PR** for `platform/stabilization-v1.1` → `main` and pass the merge gate
   (`governance/CHECKLISTS.md`, NN-28). Until then `main` shows only the baseline.
2. Configure GitHub branch protection on `main` so §1 of `GIT_STRATEGY.md` is enforced by
   the platform, not just documented.
3. Fix **D-1** and **D-2** before any deploy.
4. Provision Firebase (staging first, per Constitution DEP-2), then deploy **rules first**.
5. Route the two finance decisions to the business owner
   ([`docs/FINANCE_DECISIONS_PENDING.md`](./docs/FINANCE_DECISIONS_PENDING.md)).
6. Open an ADR for **H-3** (forgeable audit-log authorship) — the last unmitigated NN
   violation in the rules.

---

## 9. Success criteria

| Criterion | Status |
|---|---|
| Repository integrity verified | ✅ |
| Documentation internally consistent (0 broken links / 51 files) | ✅ |
| TypeScript clean | ✅ |
| Unit tests pass (199/199) | ✅ |
| Rules tests pass (170/170) | ✅ |
| Production build passes | ✅ |
| Annotated tag exists | ✅ `v1.0.0-beta.1` → `a8d4b63` |
| Repository pushed successfully | ✅ 2 branches + 1 tag |
| Remote verified | ✅ SHAs match; refs confirmed via `git ls-remote` |
| Reports generated | ✅ This report + `REPOSITORY_HEALTH.md` |
| **Canonical source of truth established** | ✅ |
