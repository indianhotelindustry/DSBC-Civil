<div align="center">

# DSBC Civil

**Enterprise Construction ERP Platform**
A commercial, multi-company Construction & Real-Estate ERP built on React 19 · TypeScript · Firebase · Firestore

`v1.0.0-beta.1` · Governance `v1.0` · Status: **Platform Stabilization (Engineering Phase 2)**

</div>

---

> **New here? Start with [`START_HERE.md`](./START_HERE.md).** It gives the exact reading order and onboarding path. This README is the map; `START_HERE.md` is the guided tour.

---

## Overview

DSBC Civil is the financial-operational backbone for construction and real-estate businesses: work orders, bills, payments, variation orders, contractor and customer ledgers, unit/plot inventory, sales, receipts, installment schedules, and recovery — governed by an 8-role, multi-stage approval workflow across multiple companies.

The platform is at **v1.0.0-beta.1** and operates today as a role-based web application. It is governed by a ratified engineering constitution (Governance v1.0) and is entering **Engineering Phase 2 — Platform Stabilization**, whose first objective is to make every financially-material action authoritatively enforced in production.

> **Honest status (per the platform's own honesty principle):** DSBC Civil currently performs **derived financial reporting, not double-entry accounting** — the posting engine is designed but not yet built. It is **safe for a single trusted operator today** and is being hardened for untrusted, multi-tenant commercial deployment. See [`audit/EXECUTIVE_SUMMARY.md`](./audit/EXECUTIVE_SUMMARY.md).

## Architecture

```
Browser (React 19 SPA, Vite)
   │  Firebase Auth (ID token)
   │
   ├── Firestore SDK (reads + writes) ──►  Cloud Firestore
   │                                          ▲
   │                          firestore.rules │  ← the production trust boundary
   │
   └── secureApi ──►  [ Cloud Functions ]  ← authoritative transactional ops
                      [ Express, dev only ]   (server/ — same handlers, dev harness)
```

Both hosts run the **same** handlers: `server/secureRoutes.ts` is built into an Express
app by `server/app.ts` (`createApp`), which `server.ts` serves locally and
`functions/index.ts` wraps as the `api` HTTPS Function. `functions/` is written and
wired in `firebase.json` (hosting rewrites `/api/secure/**` → `api`, region
`asia-south1`) but **is not yet deployed** — no Firebase project is provisioned.
Until it is, the four privileged operations fail loud in a hosting-only deployment.

- **Frontend** — `src/` : pages, components, one service per Firestore collection, pure calculation libs.
- **Backend** — `server/` : token verification, role checks, transactional privileged operations, background jobs. `functions/` re-hosts these verbatim as Cloud Functions (deploy pending a Firebase project).
- **Boundary** — `firestore.rules` : per-collection role + status-transition enforcement; the real production security perimeter.
- **Governance** — `governance/` : the engineering constitution and its operating instruments.

Full detail: [`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md) and [`audit/ARCHITECTURE_REVIEW.md`](./audit/ARCHITECTURE_REVIEW.md).

## Features

| Domain | Capabilities |
|---|---|
| **Work Orders** | Create/edit with embedded BOQ, financials (GST/retention/advance), approval workflow, variation orders, print/PDF |
| **Billing** | Partial billing, TDS/retention deduction, 3-stage approval (verify → approve), overbilling guards |
| **Payments** | Bill-based payments + WO-based payment requests, CEO approval, release workflow |
| **Contractors** | Master data, derived ledgers, adjustments |
| **Sales / CRM** | Unit/plot inventory, bookings, sales lifecycle, receipts, FIFO installment schedules, customer ledgers, recovery |
| **Procurement** | Master data foundation (materials, vendors, stores, vehicles, UOMs) — transactional layer in roadmap |
| **Platform** | 8-role RBAC, multi-company scoping, approval engine, audit trail, alerts, dashboards (CEO/Accounts/PM) |

Per-module status and completion %: [`audit/MODULE_AUDIT.md`](./audit/MODULE_AUDIT.md).

## Technology Stack

- **Frontend:** React 19, TypeScript (strict), Vite 6, Tailwind CSS v4, shadcn/Base-UI, react-router v7, react-hook-form + zod, recharts, sonner, lucide-react, date-fns
- **Backend:** Express (dev harness) → Firebase Cloud Functions (target), Firebase Admin SDK, node-cron → Cloud Scheduler
- **Data:** Cloud Firestore (~28 collections) with `firestore.rules` enforcement
- **Testing:** Vitest (199 tests today)
- **Hosting:** Firebase Hosting (static SPA) + Firestore rules

## Current Status

- **Codebase:** v1.0.0-beta.1 (commercial rebranding of the v0.9.0 platform)
- **Governance:** v1.0 ratified ([`AMENDMENT-001`](./governance/amendments/AMENDMENT-001.md))
- **Engineering:** entering Phase 2 — Platform Stabilization ([`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md), [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md))
- **Tests:** 199 passing (Vitest)
- **Known P0s:** authoritative backend not yet deployed; divergent financial math; non-atomic money mutations — see [`audit/NEXT_DEVELOPMENT_PLAN.md`](./audit/NEXT_DEVELOPMENT_PLAN.md)

## Roadmap

| Milestone | Focus |
|---|---|
| ✅ Governance v1.0 | Constitution, audit baseline, amendment process |
| ▶ Platform Stabilization v1.1 | Deploy authoritative backend, remove client fallback, unify financial math |
| Accounting Core v1.2 | Posting engine, journal, retention/TDS liabilities, trial balance |
| Construction ERP Beta → RC → v1.0 | Procurement transactions, inventory, reporting, hardening |
| Hospitality / Manufacturing Foundations | New verticals as config packs |

Full history and forward plan: [`RELEASES.md`](./RELEASES.md) · [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md).

## Getting Started

**Prerequisites:** Node.js 20+, a Firebase project, and access to environment configuration.

```bash
git clone https://github.com/indianhotelindustry/DSBC-Civil.git
cd DSBC-Civil
npm install
cp .env.example .env.local     # fill in VITE_FIREBASE_* values (REQUIRED — no fallback config ships in the repo)
npm run dev                    # Express + Vite dev server (includes local secure API)
```

> **Firebase:** this repository ships with **no Firebase project configured**. Follow
> [`docs/FIREBASE_MIGRATION.md`](./docs/FIREBASE_MIGRATION.md) to provision the new Firebase
> project and wire it in via `.env.local` / hosting environment variables.

Other scripts:

```bash
npm run build          # production SPA build (vite)
npm run lint           # tsc --noEmit (type check)
npm test               # vitest run
npm run deploy:hosting # build + firebase deploy --only hosting
npm run deploy:rules   # firebase deploy --only firestore:rules
```

> **Note:** `npm run dev` runs the Express secure backend locally. In a hosting-only
> deployment that backend is absent, and `secureApi` **fails loud** rather than falling
> back to client writes (`VITE_ALLOW_CLIENT_FALLBACK` defaults to `false`). Deploying
> `functions/` closes the gap — it is the first Phase 2 objective.

## Documentation Index

| Area | Entry point |
|---|---|
| **Product identity** | [`PROJECT_IDENTITY.md`](./PROJECT_IDENTITY.md) · [`DECISIONS.md`](./DECISIONS.md) |
| **Baseline & roadmap** | [`BASELINE_v1.0.0-beta.1.md`](./BASELINE_v1.0.0-beta.1.md) · [`ROADMAP.md`](./ROADMAP.md) · [`REBRANDING_REPORT.md`](./REBRANDING_REPORT.md) |
| **Onboarding** | [`START_HERE.md`](./START_HERE.md) |
| **Current work** | [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md) · [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md) |
| **Releases & changes** | [`RELEASES.md`](./RELEASES.md) · [`CHANGELOG.md`](./CHANGELOG.md) |
| **Constitution** | [`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md) |
| **Domain model (DDD)** | [`governance/DOMAIN_MODEL.md`](./governance/DOMAIN_MODEL.md) |
| **Governance ops** | [`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md) · [`governance/DATA_LIFECYCLE.md`](./governance/DATA_LIFECYCLE.md) · [`governance/RELIABILITY.md`](./governance/RELIABILITY.md) · [`governance/COMPLIANCE.md`](./governance/COMPLIANCE.md) |
| **Decisions** | [`governance/adr/`](./governance/adr/) |
| **Forensic audit** | [`audit/README.md`](./audit/README.md) |
| **Engineering docs** | [`docs/`](./docs/) · [`docs/GIT_STRATEGY.md`](./docs/GIT_STRATEGY.md) |

## Governance

DSBC engineering is governed by a ratified constitution. **Architectural change proceeds through ADRs and constitutional amendments, not ad hoc decisions.** Before contributing, read [`START_HERE.md`](./START_HERE.md) and the relevant [`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md). Every pull request passes the merge gate (Non-Negotiable NN-28).

- **Constitution:** [`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md) (Sections 1–25, Non-Negotiables NN-1…NN-30)
- **Founding amendment:** [`governance/amendments/AMENDMENT-001.md`](./governance/amendments/AMENDMENT-001.md)
- **Milestones:** [`governance/MILESTONES.md`](./governance/MILESTONES.md)

## License

Proprietary — © DSBC Civil. All rights reserved. Not licensed for redistribution.

---

<div align="center">
<sub>DSBC Civil · Enterprise Construction ERP Platform · Governance v1.0 · Ratify · Strengthen · Govern</sub>
</div>
