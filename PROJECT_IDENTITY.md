# PROJECT IDENTITY

| Field | Value |
|---|---|
| **Product Name** | DSBC Civil |
| **Full Product Name** | DSBC Civil — Enterprise Construction ERP Platform |
| **Short Name** | DSBC Civil |
| **Repository Name** | `DSBC-Civil` on GitHub · `dsbc-civil` as the npm package name in `package.json` (npm requires lowercase). Both are correct; they are not a drift. |
| **Current Version** | `1.0.0-beta.2` (see [`VERSION`](./VERSION), [`package.json`](./package.json), [`src/lib/appVersion.ts`](./src/lib/appVersion.ts)) — an interim increment of Platform Stabilization v1.1, **not** its completion |
| **Product Status** | Commercial beta — Platform Stabilization (Engineering Phase 2) in progress |
| **Product Family** | DSBC ERP (construction vertical; hospitality/manufacturing verticals chartered as future config packs — Constitution §24) |
| **Owner** | DSBC |
| **License** | Proprietary — © DSBC Civil. All rights reserved (`UNLICENSED`) |
| **Canonical Repository** | **`https://github.com/indianhotelindustry/DSBC-Civil`** — the single source of truth (set 2026-07-29). No alternate repository is authoritative. |
| **Canonical Firebase Project** | `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID` *(placeholder — set per [`docs/FIREBASE_MIGRATION.md`](./docs/FIREBASE_MIGRATION.md))* |

## Naming rules

- **DSBC Civil** is the product. Use the full name with subtitle on first mention in customer-facing material.
- **SIPL / SHSPL** are *operating companies inside the ERP's data model* (`CompanyCode`), not product names. They must never be renamed as part of branding work (see [`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md) §3).
- Version identity lives in three synchronized places (Constitution DEP-9): `VERSION`, `package.json`, `src/lib/appVersion.ts`.

## Lineage

DSBC Civil is the commercial rebranding of the internal platform *SIPL Work Orders* (v0.9.0). The rename was a controlled migration with zero functional change — [`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md) is the authoritative record.
