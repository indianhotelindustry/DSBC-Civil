# RELEASE READINESS — DSBC Civil v1.0.0-beta.1

**Gate date:** 2026-07-09 · **Scope:** first Git commit of the canonical `dsbc-civil` repository
**Reviewer:** Release Readiness Check (structure, docs, build, Firebase, git, production checklist)

---

## 1. Repository Status

### Structure — ✅ PASS
- **Orphan files:** none. The two known AI-Studio orphans (`metadata.json`, `firebase-blueprint.json`) were removed at rebranding; every remaining root file is referenced by the doc index or the toolchain.
- **Duplicate assets/configs:** none. One tsconfig, one vite config, one firebase.json, one `.env.example`; `firebase-applet-config.json` (client dev fallback, placeholder-only) and `.env.example` serve distinct documented roles (Constitution DEP-3).
- **Unused branding:** none. Residual "SIPL" strings are exclusively (a) domain company codes (`SIPL`/`SHSPL` in the data model — must never be renamed), (b) historical audit/governance records, (c) the migration's own changelog/report.
- **Broken imports:** none — `tsc --noEmit` clean; production build resolves all 3,759 modules.
- **Circular imports:** none — `madge --circular` over 122 source files: *"No circular dependency found."*
- **Environment examples:** `.env.example` present and complete (7 `VITE_FIREBASE_*` keys + 3 documented dev flags).

### Documentation consistency — ✅ PASS
Cross-checked README ↔ PROJECT_IDENTITY ↔ ROADMAP ↔ BASELINE ↔ DECISIONS ↔ CHANGELOG ↔ START_HERE ↔ RELEASES:
- Version `1.0.0-beta.1` consistent across `VERSION`, `package.json`, `package-lock.json`, `appVersion.ts`, README, PROJECT_IDENTITY, BASELINE, CHANGELOG, RELEASES.
- Test count (199) consistent across living docs; historical audit/constitution intentionally retain their v0.9.0-anchored figures.
- Fixed at this gate: `RELEASES.md` was missing the v1.0.0-beta.1 milestone that `CHANGELOG.md` records — row + detail section added.
- Ratified governance documents keep their enacted names ("DSBC ERP Architecture Constitution v1.0") by design; `PROJECT_IDENTITY.md` documents the naming rules.

### Build — ✅ PASS (re-verified at this gate)
| Check | Result |
|---|---|
| `tsc --noEmit` | 0 errors |
| `vitest run` | 199/199 tests, 9 files |
| `vite build` | success, 3,759 modules (known chunk-size warning — see Limitations) |

### Firebase — ✅ PASS
Swept for `AIzaSy*` keys, `*.firebaseapp.com`, `*.firebasestorage.app`, `*.appspot.com`, OAuth client IDs, sender IDs, and the legacy project ID:
- **No hardcoded credentials or project IDs anywhere.** `.firebaserc` = `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`; `firebase-applet-config.json` = empty placeholders; client config comes only from `VITE_FIREBASE_*`.
- Admin SDK (`server/firebaseAdmin.ts`) degrades correctly: blank config → Application Default Credentials (same behavior as the Cloud Functions runtime).
- `asia-south1` in `firebase.json`/`functions/index.ts` is region configuration, not project identity (adjust at provisioning if desired).
- Legacy project mentions survive only inside historical/migration records (CHANGELOG, REBRANDING_REPORT, FIREBASE_MIGRATION §8) — correct.

### Git readiness — ✅ PASS
- No `.git` yet (expected — ZIP-derived working copy; history intentionally starts fresh).
- `.gitignore` covers `node_modules/`, `dist/`, `.env*` (keeps `.env.example`), `.firebase/`, logs, editor dirs, `.claude/`, and — added at this gate — `functions/lib/` + `functions/node_modules/` (functions build output).
- No temporary files, no `.env.local`, no OS junk present. `dist/` exists locally but is ignored.
- First commit message + annotated tag recommendation: see `REBRANDING_REPORT.md` §deliverables (message: *"chore: rebrand SIPL Work Orders → DSBC Civil …"*, tag: `v1.0.0-beta.1`).

## 2. Outstanding Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R-1 | Authoritative backend (`functions/`) not yet deployed — financially-material server routes absent in production until Phase 2/3 completes | **High (known, chartered)** | `VITE_ALLOW_CLIENT_FALLBACK=false` fails loud; v1.1 sprint closes it. Beta operation restricted to trusted users |
| R-2 | Company/project scoping is client-side after full collection reads | Medium | Constitution §23 charters boundary enforcement; acceptable for trusted-operator beta |
| R-3 | 9 npm audit advisories (1 low, 8 moderate), dev/transitive | Low | Review before first deployment; none in the runtime financial path |
| R-4 | No favicon/logo/manifest (never existed) | Low | Cosmetic; commission assets before public exposure |
| R-5 | `firebase deploy` will fail until `.firebaserc` placeholder is replaced | None (by design) | Loud failure is the intended guard against deploying to the wrong project |

## 3. Known Limitations (accepted for beta — detailed in `BASELINE_v1.0.0-beta.1.md`)

1. Derived financial reporting, not double-entry accounting (posting engine = Phase 4).
2. Procurement/inventory are masters-only; no transactions yet (Phases 5–6).
3. Unscoped, unpaginated Firestore queries (RC hardening, Phase 8).
4. Single main JS chunk > 500 kB (tracked in `audit/PERFORMANCE_AUDIT.md`).
5. ESLint chartered but not configured; rules-unit-tests pending Phase 2 (CI steps stubbed).

## 4. Deployment Order (first commercial deployment)

1. **GitHub:** create `YOUR-ORG/dsbc-civil` → `git init` → first commit → annotated tag `v1.0.0-beta.1` → push; replace `YOUR-ORG` placeholders (README, package.json, PROJECT_IDENTITY).
2. **Firebase project:** create per `docs/FIREBASE_MIGRATION.md`; set `.firebaserc`; fill `.env.local`/CI with `VITE_FIREBASE_*`.
3. **Authentication:** enable Google + Email/Password; add hosting domains to authorized domains.
4. **Firestore:** create (default) database; **deploy rules first** (`npm run deploy:rules`) — the trust boundary precedes all data.
5. **Indexes:** none required at baseline (queries are unfiltered single-collection; add composite indexes when console errors demand — none are committed).
6. **Functions:** `cd functions && npm install && npm run deploy` (region `asia-south1` or your choice).
7. **Hosting:** `npm run deploy:hosting` (build bakes env vars — set them in the build environment).
8. **Bootstrap:** sign in once → promote first user to `role: ADMIN`, `status: ACTIVE` in console → seed companies/masters from the Masters page.
9. **Number Series:** configure WO Number Series in Masters (WO creation is hard-blocked without it).
10. **Admin account:** verify the admin can create a WO end-to-end; record the deployment in Version History (`v1.0.0-beta.1`).

## 5. Rollback Strategy

- **Code:** every release is an annotated tag; rollback = `git checkout <previous-tag>` → rebuild → `firebase deploy --only hosting`. Hosting keeps prior releases — one-click rollback in the Firebase console is also available.
- **Rules:** rules are versioned in-repo; redeploy the prior tag's `firestore.rules`. (Firebase console also retains rules history.)
- **Functions:** redeploy prior tag; functions are stateless — no migration to unwind.
- **Data:** no schema migrations ship in this baseline (rename touched zero collections/fields), so there is **no data rollback surface**. Before any future migration: Firestore export first (NN-25 requires reversible, tested migrations).
- **Emergency financial-ops fallback:** `VITE_ALLOW_CLIENT_FALLBACK=true` exists as a documented emergency rollback while the backend is unavailable — use only per its warning in `.env.example`.

## 6. Go / No-Go Recommendation

### ✅ **GO** — for `git init`, first commit, tag `v1.0.0-beta.1`, and publication as the canonical DSBC Civil repository.

The repository is internally consistent, credential-free, validation-green (0 type errors, 199/199 tests, clean build, no circular imports), and every placeholder fails loud rather than silently pointing at legacy infrastructure.

**Conditional GO** for first *deployment*: proceed only after steps 1–4 of the Deployment Order (new Firebase project + rules deployed) and with the beta operated by trusted users — full production (untrusted multi-tenant) remains gated on Platform Stabilization v1.1 (R-1/R-2), exactly as the platform's own governance requires.
