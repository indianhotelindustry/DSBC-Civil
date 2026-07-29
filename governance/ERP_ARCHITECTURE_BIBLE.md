# THE DSBC ERP PLATFORM — ENGINEERING CONSTITUTION
### `governance/ERP_ARCHITECTURE_BIBLE.md`

> **Status:** Ratified baseline · **Version:** 1.0 (anchored to codebase v0.9.0 / `v0.9-test-deployment`) · **Date:** 2026-07-07
>
> **Authority:** This document is the supreme engineering reference for the DSBC ERP Platform. Where any other document, comment, ticket, or model output conflicts with this constitution, **this constitution wins** — except that where this constitution conflicts with *verified current source code*, the code wins and this document must be corrected (see the Amendment Protocol at the end).
>
> **Audience:** Every human developer and every AI model that touches this repository. You are required to read the section governing your task before you change code in that area.
>
> **Prime directive:** *Continue from the current implementation. Do not redesign. Do not rewrite. Strengthen what exists.* Every rule below is written to harden the platform that is already built, not to replace it.

---

## HOW TO READ THIS DOCUMENT

This constitution is grounded in the **actual, verified code** of this repository as of the forensic audit in [`/audit`](../audit/README.md). It is not aspirational fiction. When it says "the platform does X," X is in the source at a cited path. When it says "the platform must evolve to Y," Y is a strengthening of an existing seam, with the seam named.

Three reading conventions:

- **`MUST` / `MUST NOT` / `SHALL`** — non-negotiable. Violating these fails code review by definition. All are consolidated in Section 25.
- **`SHOULD` / `SHOULD NOT`** — strong default. Deviation requires a written reason in the PR description.
- **`MAY`** — discretion permitted.

Every section ends with a **"Continuity Contract"** — the explicit statement of what already exists that the section builds on, so no future contributor mistakes a strengthening rule for a license to rewrite.

Cross-references to the audit use the form (AUDIT: SECURITY C-1). Cross-references to code use clickable relative links.

---

## TABLE OF CONTENTS

1. Vision of the DSBC Platform
2. Platform Philosophy
3. Architecture Principles
4. Folder Structure Standards
5. Frontend Architecture
6. Backend Architecture
7. Firestore Architecture
8. Security Architecture
9. Financial Architecture
10. Posting Engine Philosophy
11. Workflow Engine
12. Approval Engine
13. Event Bus
14. Audit System
15. Notification System
16. Validation Framework
17. Error Handling Standards
18. Coding Standards
19. Testing Standards
20. Deployment Architecture
21. Performance Standards
22. AI Integration Strategy
23. Multi-Company Architecture
24. Future Industry Verticals
25. Non-Negotiable Engineering Rules
— Appendix A: Canonical Glossary
— Appendix B: The Amendment Protocol

---
---

# SECTION 1 — VISION OF THE DSBC PLATFORM

## 1.1 What DSBC is

DSBC is a **commercial, multi-company Construction and Real-Estate ERP platform**, delivered today as a role-based web application on the Firebase platform. Its verified current surface — the thing this vision must remain faithful to — is:

- A React 19 + TypeScript single-page application ([`src/`](../src/)), served as static assets from Firebase Hosting.
- A domain of construction and real-estate operations: **Projects, Work Orders (with embedded BOQ), Variation Orders, Bills, Payments, Payment Requests, Contractors, Customers, Plot/Unit inventory (SubLocations), Sales, Sale Receipts, Sale Schedules, Contractor & Customer Ledgers, Recovery**, plus a **procurement master-data foundation** (Materials, Vendors, Stores, Vehicles, UOMs, Material Categories).
- An **8-role, multi-stage approval organization**: CEO, PROJECT_MANAGER, ACCOUNTS, ADMIN, SUPER_ADMIN, PURCHASE_MANAGER, STORE_MANAGER, STORE_KEEPER ([`src/types.ts:5-6`](../src/types.ts)).
- A **two-company reality today** (SIPL / Construction and SHSPL / Hospitality, [`src/lib/companyLabels.ts`](../src/lib/companyLabels.ts)) with a design intent toward many companies and multiple industry verticals.

DSBC is **not** a greenfield idea. It is a running system at version 0.9.0. This constitution governs its maturation from a "works for a trusted operator" product into a "safe for untrusted commercial, multi-tenant deployment" platform.

## 1.2 The vision statement

> **DSBC will be the definitive financial-operational backbone for construction and real-estate businesses in India and comparable markets — a platform where every rupee of contractor payable, customer receivable, retention, and tax is provably correct, every privileged action is authoritatively enforced and auditable, and every industry vertical is a configuration of the same trustworthy core rather than a fork of it.**

Each clause of that sentence is a commitment with a concrete anchor in the present code:

| Vision clause | Present anchor | Maturation obligation |
|---|---|---|
| "every rupee … provably correct" | Derive-on-read financial core, [`src/lib/financialCalcs.ts`](../src/lib/financialCalcs.ts), 199 passing tests | Add the posting engine (Section 10); unify the drifted business math (AUDIT: TECHNICAL_DEBT D-1/D-2) |
| "authoritatively enforced" | [`firestore.rules`](../firestore.rules), [`server/secureRoutes.ts`](../server/secureRoutes.ts) | Make one enforcement path real in production (Section 8; AUDIT: SECURITY C-1) |
| "auditable" | [`server/auditLog.ts`](../server/auditLog.ts), `db.logAction` | Make audit writes trusted and readable (Section 14) |
| "every industry vertical a configuration" | `BusinessType` CONSTRUCTION/HOSPITALITY, [`companyLabels.ts`](../src/lib/companyLabels.ts) | Formalize the vertical-config seam (Section 24) |

## 1.3 What DSBC is deliberately NOT

To keep the vision disciplined, the platform explicitly rejects certain identities:

- **DSBC is not a generic no-code ERP builder.** It is an opinionated construction/real-estate system. Configurability serves verticals within that domain, not arbitrary business modelling.
- **DSBC is not, today, a double-entry accounting system** — and it MUST NOT claim to be until the posting engine of Section 10 exists. It is currently a *derived-reporting* system (AUDIT: ARCHITECTURE §5). Honesty about this is a vision-level commitment, because the credibility of the whole platform rests on not overstating its financial guarantees.
- **DSBC is not a thick-client desktop application.** It is a web platform. Offline-first and native shells are out of scope unless a future amendment adds them.
- **DSBC is not a single-company tool.** Multi-company is structural (Section 23), even though only two companies exist today.

## 1.4 The North-Star metric

The single number by which DSBC's engineering health is judged: **the fraction of financially-material state transitions that are enforced by an authoritative, transactional, audited path in production.** Today that fraction is effectively low, because the authoritative server is not deployed and the production path falls back to client writes (AUDIT: SECURITY C-1). Driving that fraction to 100% is the platform's central engineering quest, and Sections 8, 9, 10, and 20 exist to serve it.

## 1.5 Continuity Contract for Section 1

This vision **builds on** the existing domain model in [`src/types.ts`](../src/types.ts), the existing role set, the existing two-company structure, and the existing derive-on-read financial philosophy. It **does not** authorize replacing any of them. The domain is correct; the vision is to make its guarantees enforceable and its verticals configurable.

---
---

# SECTION 2 — PLATFORM PHILOSOPHY

The philosophy is the "why" behind every later rule. Nine tenets, each traceable to a decision already visible in the code.

## 2.1 Truth is derived, then it will be posted

The platform's founding financial insight — visible in [`financialCalcs.ts:45-48`](../src/lib/financialCalcs.ts) — is that **cached rollups lie**. The code deliberately deprecated `wo.billing.billedTillDate/paidTillDate/balancePayable` and recomputes every ledger and KPI from the operational documents (bills, payments, adjustments, receipts). This is correct and MUST be preserved.

The philosophy's forward edge: derivation is the *reporting* truth; the platform will add a **posted** truth (immutable journal entries) *on top of* derivation, not instead of it (Section 10). The two must agree — derived reports become the continuous reconciliation check on the posting engine. This is a uniquely strong position: most ERPs have posting but no independent derived check; DSBC will have both.

## 2.2 Enforcement belongs at the lowest trustworthy layer

Today the platform has three enforcement layers — UI (`ProtectedRoute`, form validation), service layer (client-side business rules), and the boundary (`firestore.rules` + the intended server). The philosophy: **UI enforcement is convenience, service enforcement is ergonomics, and only the boundary is trust.** Every financial invariant MUST ultimately be enforced at a layer the client cannot bypass. The current gap — invariants that live only in undeployed server code — is the single largest philosophical violation in the system (AUDIT: SECURITY C-1) and the reason Section 8 is written as it is.

## 2.3 State machines over free-form mutation

Every important entity in DSBC moves through an explicit status enum, and transitions are gated, not free (`WorkOrderStatus`, `BillStatus`, `PaymentStatus`, `SaleStatus`, `PaymentRequestStatus` in [`src/types.ts`](../src/types.ts); enforced in [`firestore.rules`](../firestore.rules) via `currentStatus()` + `isStatusTransitionTo()` + `onlyFieldsChanged()`). This is a deliberate, mature choice. The philosophy: **an entity's lifecycle is a finite state machine, and every transition is a named, guarded, audited event.** Sections 11 and 12 formalize this into an explicit workflow/approval engine rather than scattered per-collection rules.

## 2.4 Deriving developers should fall into the pit of success

The service pattern is uniform: every collection has a `getAll` subscription, CRUD methods, and centralized error/audit handling via [`src/services/db.ts`](../src/services/db.ts). A new developer copying an existing service gets audit logging, error normalization, and `createdAt/createdBy` stamping for free. The philosophy: **the easy path and the correct path are the same path.** Every framework we add (validation, events, posting) MUST preserve this — the correct behavior comes from using the shared primitive, not from remembering a rule.

## 2.5 Explicit typed errors, never silent failure

The domain defines 22 typed `BusinessRuleError` codes ([`src/types.ts:776-801`](../src/types.ts)). Business rules throw these; the UI catches them and shows toasts. The philosophy: **every rejection is a typed, named, user-legible business fact — never a swallowed exception, never a raw string.** Section 17 hardens this; Section 16 feeds it.

## 2.6 Multi-company is structural, not bolted on

Company scoping already runs through [`src/lib/userAccess.ts`](../src/lib/userAccess.ts) (`getEffectiveCompanyScope`) and is applied across WorkOrders, Bills, Payments, Sales, and dashboards. The philosophy: **a user sees and touches only their assigned companies' data, and this is a property of the platform, not of each feature.** Section 23 elevates this from a client-side filter into a boundary-enforced guarantee.

## 2.7 Verticals are configuration of one core

`BusinessType` (CONSTRUCTION/HOSPITALITY) and the label maps in [`companyLabels.ts`](../src/lib/companyLabels.ts) already show the intended shape: the same engine, re-labelled and re-ruled per vertical. The philosophy: **a new vertical is a config pack, never a fork.** Section 24 defines the config surface.

## 2.8 The audit trail is a first-class product, not a side effect

`db.logAction` is called across the codebase, and [`firestore.rules`](../firestore.rules) makes `auditLogs` append-only. The philosophy: **who did what, when, and whether it succeeded is durable, immutable platform memory.** Its current weakness — forgeable authorship and no read UI (AUDIT: SECURITY H-3) — is a defect against this philosophy, corrected in Section 14.

## 2.9 Honesty over optimism in all self-description

The build label is literally `v0.9-test-deployment` ([`src/lib/appVersion.ts`](../src/lib/appVersion.ts)) — the app tells the truth about its own maturity. The README, by contrast, is misleading boilerplate (AUDIT: docs §1.1). The philosophy: **the platform describes itself accurately, in code and in docs.** No module is marked complete until it is; no financial claim is made until it is enforceable. This constitution itself is bound by this tenet (see the Amendment Protocol).

## 2.10 Continuity Contract for Section 2

These tenets are **descriptions of decisions already made in the code**, promoted to principles. None asks for a rewrite. The only tenet that demands new construction is 2.1's posting engine and 2.2's enforcement relocation — both additive, both bolting onto existing seams (the state machine and the service layer).

---
---

# SECTION 3 — ARCHITECTURE PRINCIPLES

Twelve principles. Each is stated as a rule, justified from the current architecture, and given a concrete "how you obey it here."

### AP-1 · One authoritative enforcement path per invariant
**Rule:** Every financially-material or security-material invariant MUST have exactly one authoritative implementation, at a layer the client cannot bypass, and every other layer's copy MUST be presentation-only (fast feedback) that defers to it.
**Why:** Today the overbilling ceiling and VO-financial formula are implemented 2–3 times and have drifted (AUDIT: TECHNICAL_DEBT D-1/D-2). Duplication without a designated source of truth is how correctness dies.
**Here:** The authoritative layer is (target state) Cloud Functions callable from [`secureApi.ts`](../src/services/secureApi.ts); the shared math lives in pure modules under `src/lib/` imported by both UI and functions.

### AP-2 · Derive-on-read is the reporting truth
**Rule:** Reports, ledgers, and KPIs MUST be derived from operational documents, never from mutable cached rollups, unless the cache is a performance denormalization that is transactionally maintained and independently reconcilable.
**Why:** [`financialCalcs.ts:45-48`](../src/lib/financialCalcs.ts) already mandates this; the deprecated `wo.billing.*` fields are the cautionary tale.
**Here:** `src/lib/*Calcs.ts` are the derivation engines. Any new cache (like `sale.totalReceived`) MUST ship with a reconcile tool (AUDIT: TECHNICAL_DEBT G-9).

### AP-3 · Every entity is a guarded state machine
**Rule:** New domain entities MUST declare an explicit status enum and MUST expose transitions as named operations, never as arbitrary field writes.
**Here:** Model on `BillStatus`/`PaymentStatus`; enforce transitions in [`firestore.rules`](../firestore.rules) with `onlyFieldsChanged()` scoping and (Section 12) the approval engine.

### AP-4 · Services own collections; nothing else touches Firestore directly
**Rule:** All Firestore access MUST go through a service in [`src/services/`](../src/services/) that owns that collection. Pages and components MUST NOT construct raw Firestore queries.
**Why:** Two pages already violate this by reading `saleReceipts` directly ([`CustomerLedger.tsx:491`](../src/pages/CustomerLedger.tsx), [`RecoveryDashboard.tsx:43`](../src/pages/RecoveryDashboard.tsx)) — and both duplicated the same helper. One owner per collection is how invariants stay enforceable.

### AP-5 · Money moves only inside transactions
**Rule:** Any mutation that changes a monetary total MUST be atomic (Firestore `runTransaction` or `FieldValue.increment`). Read-modify-write on money is forbidden.
**Why:** `sales.totalReceived` and schedule `paidAmount` currently use read-then-write and can lose money under concurrency (AUDIT: TECHNICAL_DEBT D-6).
**Here:** The one correct example to copy is `reserveNextWorkOrderNumber` ([`numberSeriesService.ts:47-67`](../src/services/numberSeriesService.ts)).

### AP-6 · The boundary is the only trust
**Rule:** No security or financial guarantee MAY depend on client code or undeployed server code. If `firestore.rules` plus deployed functions do not enforce it, it is not enforced.
**Here:** This is the direct lesson of AUDIT: SECURITY C-1. Section 8 operationalizes it.

### AP-7 · Typed errors are the contract between layers
**Rule:** Business rejections MUST be `BusinessRuleError` with a code from the canonical enum. New codes MUST be added to [`src/types.ts`](../src/types.ts) with intent, not reused approximately.
**Why:** Codes are currently misused (`WORK_ORDER_NOT_FOUND` for a missing sale, AUDIT: TECHNICAL_DEBT G-10). Precise codes are how the UI, logs, and future automation stay legible.

### AP-8 · Multi-company scope is a cross-cutting property
**Rule:** Every collection holding company-owned data MUST carry a resolvable company dimension, and every read/write MUST respect the user's effective scope from [`userAccess.ts`](../src/lib/userAccess.ts).
**Why:** `companyId` is currently optional on WO/Project and absent on Bill/Payment/Adjustment (AUDIT: ARCHITECTURE §5), which blocks per-company books. Section 23 fixes this structurally.

### AP-9 · Pure logic is separated from I/O and tested
**Rule:** Business math MUST live in pure functions (injectable clock, no Firestore) in `src/lib/`, and MUST be unit-tested. I/O wrappers (services) orchestrate; they do not compute.
**Why:** This is why the calc core has 199 passing tests while `ledgerUtils.ts` — which mixed concerns less cleanly — has zero (AUDIT: TECHNICAL_DEBT D-3).

### AP-10 · Additive evolution; deprecate, don't delete-in-place
**Rule:** Schema and API evolution MUST be additive with explicit `@deprecated` markers and read-time fallbacks, as already practiced (`wo.billing.*`, receipt `linkedScheduleId` → `allocations[]`, [`types.ts:421-428`](../src/types.ts)). Breaking changes require a migration tool committed alongside.
**Why:** Several silent schema drifts already exist; the ones handled this way (receipts) are safe, the ones that weren't (blueprint drift) caused confusion.

### AP-11 · One shared primitive per cross-cutting concern
**Rule:** Cross-cutting concerns — audit, validation, events, error normalization, data subscription — MUST each have exactly one shared primitive that all features use. Re-implementing a concern locally is prohibited.
**Why:** `assert*Unique` is re-implemented 7× while [`src/lib/masterValidations.ts`](../src/lib/masterValidations.ts) already ships pure equivalents (AUDIT: TECHNICAL_DEBT G-8).

### AP-12 · Configuration over forking for verticals and companies
**Rule:** Variation between companies or verticals MUST be expressed as data/config consumed by one engine, never as branched code paths per company.
**Here:** Extend the [`companyLabels.ts`](../src/lib/companyLabels.ts) pattern into a formal vertical-config registry (Section 24).

## 3.13 Continuity Contract for Section 3
Ten of these twelve principles are already substantially practiced in the code and are here promoted to law. Only AP-5 (transactional money) and AP-6/AP-1 (authoritative enforcement) require net-new work, and that work is *relocation and hardening of existing logic*, never redesign.

---
---

# SECTION 4 — FOLDER STRUCTURE STANDARDS

## 4.1 The canonical tree (current, verified)

The repository's real structure — which this standard ratifies and extends — is:

```
/                         Root: build & platform config
├── src/                  Frontend SPA (React 19 + TS)
│   ├── main.tsx          Entry → App
│   ├── App.tsx           Router + route table (15 routes + /login)
│   ├── index.css         Tailwind v4 + print styles
│   ├── types.ts          THE domain model — single source of truth
│   ├── context/          React context providers (AuthContext)
│   ├── components/       Reusable UI
│   │   ├── ui/           shadcn/Base-UI primitives (do not hand-edit lightly)
│   │   └── dashboards/   Role-specific dashboard compositions
│   ├── pages/            Route-level + Masters-tab-level screens
│   ├── services/         ONE service per Firestore collection (I/O layer)
│   └── lib/              Pure logic: *Calcs.ts, validations, access, utils
├── server/               Express secure backend (Admin SDK)
│   ├── secureRoutes.ts   Privileged transactional operations
│   ├── authMiddleware.ts Token verify + role load
│   ├── auditLog.ts       Server-side audit writer
│   ├── backgroundJobs.ts node-cron alert/summary generators
│   ├── apiResponse.ts    Response envelope + error normalization
│   └── firebaseAdmin.ts  Admin SDK init
├── server.ts             Express bootstrap (dev: Vite middleware)
├── firestore.rules       THE production security/integrity boundary
├── firebase.json         Deploy config (hosting + rules today)
├── audit/                The forensic baseline (READ THIS FIRST)
└── governance/           This constitution and future governance docs
```

## 4.2 Layer responsibility law

Each directory has a single responsibility and a strict dependency direction. **Dependencies point downward only:**

```
pages / components  →  services  →  lib (pure)
      │                   │
      └───────────────────┴──────→  types.ts   (everyone may import types)
server/*             →  lib (pure, shared math)   ← Section 10/AP-1 target
```

| Layer | MAY import | MUST NOT import | Responsibility |
|---|---|---|---|
| `pages/`, `components/` | services, lib, types, ui | another page's internals; raw `firebase/firestore` query builders | Render, gather input, call services, show typed errors |
| `services/` | lib, types, `db.ts`, `secureApi.ts` | React, pages, components | Own a collection; orchestrate I/O; enforce client-side rules; audit |
| `lib/` | types, date-fns, pure utils | React, services, firebase | Pure computation; unit-tested; injectable clock |
| `server/` | lib (shared math), Admin SDK, types | client `src/services/*` (client SDK), React | Authoritative transactional enforcement |
| `types.ts` | (leaf) | everything | The domain vocabulary |

**Non-negotiable:** `src/lib/` MUST remain free of React and Firebase imports so it can be shared with `server/` (this is the mechanical enabler of AP-1). This is the most important structural rule in the section.

## 4.3 Placement rules for new code

- **A new domain entity** → add its interface + status enum to [`src/types.ts`](../src/types.ts); create `src/services/<entity>Service.ts`; add pure math to `src/lib/` if any; add a page under `src/pages/`; add rules to `firestore.rules`. All five, or the entity is incomplete.
- **A new calculation** → `src/lib/`, pure, with a co-located `*.test.ts`. Never inline non-trivial math in a component or service.
- **A new cross-cutting concern** → one shared module (Section 3 AP-11), placed in `src/lib/` (pure) or `src/services/` (I/O). Never per-feature copies.
- **A new privileged operation** → `server/secureRoutes.ts` (target: a Cloud Function) AND the matching `firestore.rules` transition AND the `secureApi.ts` client shim. Never client-only.
- **A shared React primitive** → `src/components/` (not `ui/` unless it is a generic design-system atom).

## 4.4 The `governance/` directory

This constitution lives here. Future governance artifacts — ADRs (Architecture Decision Records), the amendment log, per-vertical config specs — also live here. Rule: **`governance/` is the only directory whose documents outrank code comments.** Everything else that looks like documentation (README, blueprint, metadata) is subordinate and, where stale, MUST be corrected or deleted (AUDIT: TECHNICAL_DEBT G-21).

## 4.5 Naming conventions

- Services: `<entity>Service.ts`, exporting a single `const <entity>Service = { ... }`.
- Pure calc modules: `<domain>Calcs.ts` with `<domain>Calcs.test.ts` beside them.
- Pages: `PascalCase.tsx`, one default-exported component named for the route.
- Types: `PascalCase` interfaces; `PascalCaseStatus` string-literal-union enums.
- Firestore collections: `camelCase` plural (`workOrders`, `saleReceipts`) — matching the existing convention exactly.
- Business rule codes: `SCREAMING_SNAKE_CASE` in the `BusinessRuleCode` union.

## 4.6 Continuity Contract for Section 4
This is the **existing** tree, formalized. The only additions are `governance/` (new, for this document) and the *rule* that `src/lib/` stays pure so it can be shared serverward. No file moves are mandated; the structure is already sound.

---
---

# SECTION 5 — FRONTEND ARCHITECTURE

## 5.1 The stack (verified, ratified)

- **React 19** with `StrictMode` ([`main.tsx`](../src/main.tsx)).
- **TypeScript** (strict via `tsc --noEmit` as the lint gate).
- **Vite 6** build; Tailwind v4 + `tw-animate-css`; shadcn/Base-UI components under [`src/components/ui/`](../src/components/ui/).
- **react-router-dom v7** ([`App.tsx`](../src/App.tsx)).
- **sonner** for toasts; **recharts** for charts (wrapped by `SafeChart`); **react-hook-form** + **zod** available; **lucide-react** icons; **date-fns** for all date math.

This stack is fixed for v1.x of the constitution. Adding a major dependency (state manager, data-fetching library, component kit) is an **amendment-level decision** (Appendix B), because it changes the shape of every future feature.

## 5.2 The composition contract

Every routed screen MUST follow the exact wrapping order already established in [`App.tsx`](../src/App.tsx):

```
<ProtectedRoute allowedRoles={[...]}>
  <Layout>
    <ErrorBoundary>
      <Page />
    </ErrorBoundary>
  </Layout>
</ProtectedRoute>
```

- **`ProtectedRoute`** ([`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx)) — auth + status + role gate. SUPER_ADMIN bypasses role checks; ADMIN/SUPER_ADMIN bypass PENDING/INACTIVE gating. This is **UI convenience gating only** — it hides screens, it does not protect data (AP-6). Data protection is the boundary's job.
- **`Layout`** ([`src/components/Layout.tsx`](../src/components/Layout.tsx)) — sidebar (desktop) / drawer (mobile), nav, `AlertBell`, secure-mode indicator.
- **`ErrorBoundary`** ([`src/components/ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx)) — catches render throws so one bad document cannot white-screen the app. **MUST wrap every page.** (This is why the legacy-WO print crash is survivable — AUDIT: UI §7.)

**Rule FE-1:** New routes MUST use this exact composition. A route without `ProtectedRoute` or without `ErrorBoundary` fails review.

**Rule FE-2:** [`App.tsx`](../src/App.tsx) MUST gain a catch-all `*` route rendering a NotFound screen. Today an unknown URL renders blank (AUDIT: UI §1) — this is a required, additive fix, not a redesign.

## 5.3 Data flow: subscriptions in, typed errors out

The established pattern, which MUST be followed:

1. A page `useEffect` subscribes via `service.getAll(setState)` and **returns the unsubscribe** for cleanup.
2. Derived/scoped views are computed in `useMemo` over the raw collection + `getEffectiveCompanyScope(profile)`.
3. Mutations call a service method inside a `try/catch`; on `BusinessRuleError` show `toast.error(err.message)`, else a generic message.

**Rule FE-3 (cleanup):** Every subscription `useEffect` MUST return its unsubscribe. The known leak in [`CustomerLedger.tsx:78`](../src/pages/CustomerLedger.tsx) (discarded `customerService.getAll` unsubscribe) is a defect to fix and the canonical anti-example.

**Rule FE-4 (no raw Firestore in the view):** Pages/components MUST NOT import `firebase/firestore` query builders. The direct `saleReceipts` reads in `CustomerLedger`/`RecoveryDashboard` are legacy violations to be migrated behind `saleReceiptService` (AP-4).

**Rule FE-5 (shared data layer — forward):** As collections grow, the platform MUST introduce one shared subscription/cache layer (React Query or a memoized-subscription context) so each collection has a single listener instead of the current ~10 concurrent dashboard listeners (AUDIT: PERFORMANCE §2). Until then, minimize duplicate subscriptions and never subscribe to the same collection twice in one mounted tree.

## 5.4 Scoping is mandatory and must be consistent

Company scoping via [`userAccess.ts`](../src/lib/userAccess.ts) MUST be applied to **all** derived views on a screen, not some. The `PaymentCalendar` fed unscoped data while its sibling tables are scoped ([`Payments.tsx:135`](../src/pages/Payments.tsx)) is a consistency bug (AUDIT: UI top-findings) and the anti-pattern to avoid: **one screen, one scope.**

## 5.5 Forms

- Forms SHOULD use `react-hook-form` + `zod` resolvers for new work; existing controlled-state forms (e.g. `WorkOrderForm`) are acceptable but MUST validate before submit.
- **Rule FE-6:** A form MUST NOT submit with unselected required relations. The Bills form allowing submit without a selected Work Order (AUDIT: UI §2) is a defect class to eliminate.
- Financial fields displayed in forms MUST use the shared `computeWorkOrderFinancials` / `recalculateBillTotals` (Section 9), never a re-implemented copy — this is how form and server stop drifting.

## 5.6 Destructive actions

**Rule FE-7:** Every destructive action (delete, cancel, waive) MUST require explicit confirmation (`window.confirm` minimum; a dialog preferred). The unconfirmed deletes on WorkOrders and Bills (AUDIT: UI §2) violate this and must be brought in line with the confirmed-delete pattern used elsewhere.

## 5.7 No dead controls

**Rule FE-8:** A rendered interactive control MUST have a working handler or MUST NOT be rendered. The ~15 handler-less buttons (CEODashboard "Executive Actions," ContractorLedger "Add Adjustment/Export/Upload," AUDIT: UI §2/§8) are prohibited going forward: either wire them or delete them. Dead controls corrupt every future audit's read of "what's done."

## 5.8 Responsiveness & print

- The mobile drawer + `overflow-x-auto` table pattern in [`Layout.tsx`](../src/components/Layout.tsx) and the `@media print` regime in [`index.css`](../src/index.css) are ratified standards. New screens MUST be mobile-usable (no horizontal body scroll) and new print documents MUST follow the `data-print-root` / `.print-document` convention.
- **Rule FE-9:** Financial print/render MUST use optional chaining against legacy documents (the `WorkOrderPrint` un-chained `financials.*` access is a latent crash, AUDIT: UI §7).

## 5.9 Continuity Contract for Section 5
Every rule here is the existing composition/subscription/scoping/error pattern promoted to law, plus four additive fixes (catch-all route, cleanup discipline, shared data layer, no dead controls). The component kit, router, and styling system are unchanged.

---
---

# SECTION 6 — BACKEND ARCHITECTURE

## 6.1 What the backend is (and the one hard truth)

The backend today is an **Express application** ([`server.ts`](../server.ts) + [`server/`](../server/)) that verifies Firebase ID tokens, loads roles, and performs four privileged operations inside Firestore transactions, plus two node-cron background jobs. **It is correctly written and it is not deployed** — `firebase.json` ships only hosting + rules, so in production `secureApi.ts` falls back to direct client writes (AUDIT: SECURITY C-1). This is the platform's defining backend problem, and Section 6 exists to resolve it by *continuation*, not replacement.

## 6.2 The target backend topology

The backend logic MUST be preserved and **relocated to a deployed runtime**. The sanctioned path (already planned in `CLOUD_FUNCTIONS_PLAN.md`, never executed):

- The four privileged operations (`verifyBill`, `approveBill`, `releasePayment`, `approveVariationOrder`) become **Firebase Cloud Functions (callable)**, reusing the exact transactional bodies in [`secureRoutes.ts`](../server/secureRoutes.ts).
- The two background jobs move to **Cloud Scheduler → function**, so alerts and daily summaries actually run in production (today they never do).
- `server.ts` remains the **local-dev** harness (Express + Vite middleware) for fast iteration.

**Rule BE-1:** No new privileged operation MAY be shipped as client-only. It MUST exist as a deployed function (or Express route pending migration) AND a `firestore.rules` transition AND a `secureApi` shim.

## 6.3 The `secureApi` contract must invert

Currently [`secureApi.ts:57-96`](../src/services/secureApi.ts) tries the server and **silently degrades** to weaker client writes on any failure. The constitution mandates the inversion:

- **Target:** `secureApi` calls the deployed function. If the function is unreachable, it **fails loudly** (typed error, toast) — it MUST NOT perform a weaker write that skips server invariants.
- The client-fallback implementations (`clientReleasePayment`, etc.) MAY remain **only** behind an explicit `import.meta.env.DEV` guard for offline local development, never in a production build.

**Rule BE-2:** Production builds MUST NOT contain a code path that writes a financially-material transition without the authoritative check. The current fallback is the single largest violation and its removal is a P0 (AUDIT: NEXT_DEVELOPMENT R1).

## 6.4 Backend responsibilities (layering)

The server mirrors the client's layering discipline:

| Server layer | File | Responsibility |
|---|---|---|
| Bootstrap | [`server.ts`](../server.ts) | Wire middleware, routes, cron (dev), static serve (prod-legacy) |
| Auth middleware | [`authMiddleware.ts`](../server/authMiddleware.ts) | `verifyIdToken` → load role from `users/{uid}` → `requireRole` |
| Routes/handlers | [`secureRoutes.ts`](../server/secureRoutes.ts) | Transactional business operations |
| Response envelope | [`apiResponse.ts`](../server/apiResponse.ts) | `sendSuccess`/`sendError` with typed codes |
| Audit | [`auditLog.ts`](../server/auditLog.ts) | Server-authored audit entries (`source: 'server'`) |
| Jobs | [`backgroundJobs.ts`](../server/backgroundJobs.ts) | Alert engine, summary generator |
| Admin init | [`firebaseAdmin.ts`](../server/firebaseAdmin.ts) | Admin SDK credential bootstrap |

**Rule BE-3 (shared math):** Server handlers MUST import business math from `src/lib/` (the pure, React-free modules), not re-implement it. The VO-financial divergence between server and form (AUDIT: TECHNICAL_DEBT D-2) is exactly the bug this rule prevents. This is why Section 4 forbids React/Firebase imports in `src/lib/`.

## 6.5 Transactions and idempotency

- **Rule BE-4:** Every handler that touches money or status MUST use `db.runTransaction` and re-assert preconditions *inside* the transaction (as `releasePayment` already does, [`secureRoutes.ts:144-182`](../server/secureRoutes.ts)). Preconditions checked before the transaction are advisory only.
- **Rule BE-5:** Callable functions SHOULD be idempotent or guarded against double-submit (client disables the button; server re-checks current status so a replayed "release" on an already-RELEASED payment is a typed no-op/error, not a double effect).

## 6.6 Auth in the backend

- Tokens are verified with `admin.auth().verifyIdToken` — real verification, keep it.
- Role currently loads from the `users/{uid}` document. **Rule BE-6 (forward):** roles MUST migrate to **Firebase custom claims** set by an admin-only function; middleware and rules then read `request.auth.token.role`. This removes the per-request `get()` cost and closes the forgeable-role surface (AUDIT: SECURITY M-1/H-3). Until migrated, the doc-based role is acceptable but is a known weakness.

## 6.7 The admin trigger endpoints

`/api/admin/run-alerts` and `/api/admin/run-summary` are currently **unauthenticated** ([`server.ts:37-45`](../server.ts)). **Rule BE-7:** before the backend is deployed anywhere reachable, these MUST be gated behind `requireAuth` + admin role and placed under the rate limiter. No exceptions (AUDIT: SECURITY H-2).

## 6.8 Secrets & credentials

- Admin SDK init MUST use Application Default Credentials in deployed runtimes; no service-account JSON is committed (good — keep it that way).
- **Rule BE-8:** No credential or private key MAY be committed. The committed `firebase-applet-config.json` holds only a client-exposed web key (low secrecy) but MUST be documented as such and SHOULD move to env injection for hygiene (AUDIT: SECURITY M-5).

## 6.9 Continuity Contract for Section 6
The backend **code stays**; it changes *runtime* (Express-only-in-dev → deployed functions) and the `secureApi` fallback **inverts** from silent-degrade to fail-loud. Every handler body, the middleware, the audit writer, and the jobs are preserved and re-hosted. This is continuation of `CLOUD_FUNCTIONS_PLAN.md`, not a new backend.

---
---

# SECTION 7 — FIRESTORE ARCHITECTURE

## 7.1 Firestore is the system of record and the trust boundary

Every persistent fact lives in Firestore, and — because the server is not (yet) in the production request path — [`firestore.rules`](../firestore.rules) is simultaneously the **data model's access policy and the platform's primary integrity boundary**. This dual role makes the rules file the single most security-critical artifact in the repository. Treat every edit to it as a security change.

## 7.2 The collection catalog (verified)

~28 collections, owned one-to-one by services (AP-4). Grouped by domain:

- **Identity/People:** `users`, `contractors`, `customers`.
- **Org/Masters:** `companies`, `projects`, `subLocations`, `workCategories`, `termsTemplates`, `numberSeries`, `materialCategories`, `uoms`, `materials`, `vendors`, `stores`, `vehicles`.
- **Construction financial:** `workOrders`, `variationOrders`, `bills`, `payments`, `paymentRequests`, `adjustments`.
- **Sales financial:** `sales`, `saleReceipts`, `saleSchedules`, `saleAdjustments` (reserved).
- **Platform:** `auditLogs`, `alerts`, `dailySummaries`, `appVersions`.

**Rule FS-1:** Every collection MUST have (a) an owning service, (b) a typed interface in [`types.ts`](../src/types.ts), and (c) a `match` block in `firestore.rules`. A collection missing any of these three is a defect. (`saleAdjustments` is rules-reserved but serviceless — it is *planned*, and MUST NOT receive writes until its service and type exist.)

## 7.3 The rules doctrine

The rules already encode a strong doctrine that MUST be preserved and extended:

1. **Authenticated read, role-gated write.** Most collections read to any authenticated user and restrict writes by role.
2. **Status state-machines with field scoping.** Transitions are gated by `currentStatus()` + `isStatusTransitionTo()` + `onlyFieldsChanged([...])`. The `paymentRequests` block ([`firestore.rules:538-554`](../firestore.rules)) is the reference implementation — every new financial collection MUST match its rigor.
3. **Identity immutability.** WO `woNumber/createdAt/createdBy` cannot change on any path.
4. **Append-only ledgers of record.** `auditLogs`, `appVersions` allow create, forbid update/delete.
5. **Self-escalation blocked.** A user cannot change their own role/status.

## 7.4 The rules' hard limitation, stated plainly

Firestore rules **cannot cross-query collections**, so they cannot enforce cumulative sums (billed-vs-WO-value, released-vs-payable). The rules file says so itself ([`firestore.rules:176-177,228,278`](../firestore.rules)). This is not a bug in the rules; it is a property of the platform. The consequences:

- Cross-document financial invariants MUST be enforced by deployed functions (Section 6), not rules.
- Rules MUST still do everything single-document enforcement allows: role, status transition, field scoping, type checks, and — critically — **forbidding the direct financial transitions that should only happen via a function.**

**Rule FS-2:** The transitions payment→RELEASED, bill→PAID/PARTIALLY_PAID, and WO-financial-rewrite MUST be tightened so clients cannot perform them directly; they become function-only once Section 6 lands (AUDIT: SECURITY C-2/C-3/H-4). This is the rules-side half of closing the production enforcement gap.

## 7.5 Field-scoping is mandatory on every transition

**Rule FS-3:** Every status-transition `allow update` branch MUST include `onlyFieldsChanged([...])` limiting exactly which fields may move. The one branch that omits it — the VO-approval path on APPROVED WOs ([`firestore.rules:208-209`](../firestore.rules)) — is a HIGH finding (AUDIT: SECURITY H-4) and the anti-pattern: an unscoped transition lets a permitted role rewrite arbitrary fields.

## 7.6 Denormalization & caches

Some collections carry denormalized caches (`sale.totalReceived`, `saleSchedules.paidAmount/balanceAmount`, denormalized company/project ids on schedules). These are permitted **only** under AP-2's conditions:

**Rule FS-4:** A denormalized/cached field MUST be (a) written only inside the same atomic transaction as its source-of-truth change, and (b) reconcilable by a committed repair tool. The project-`companyId` backfill ([`legacyDataCleanup.ts`](../src/lib/legacyDataCleanup.ts)) is the template for such tools.

## 7.7 Indexes

**Rule FS-5:** The repository MUST contain a committed `firestore.indexes.json`, deployed alongside rules. Composite queries (e.g. the multi-clause `where` in [`backgroundJobs.ts:20-25`](../server/backgroundJobs.ts)) currently rely on manually-created console indexes (AUDIT: PERFORMANCE §5). Any new multi-field query MUST add its index to that file in the same PR.

## 7.8 Company dimension on every financial collection

**Rule FS-6 (forward, structural):** `bills`, `payments`, `adjustments`, and every future financial collection MUST carry a `companyId` (resolvable, not optional), so the boundary can scope reads/writes per company and the future posting engine can segment the books (Section 23; AUDIT: ARCHITECTURE §5). Backfill via a migration tool per AP-10.

## 7.9 Data lifecycle: reverse, don't delete (for financial records)

**Rule FS-7:** Financial documents of record (bills post-APPROVED, released payments, receipts) MUST NOT be hard-deleted in the mature platform; corrections happen via reversing entries (Section 10). Hard delete remains acceptable for DRAFT/operational masters with reference guards. The current ADMIN hard-deletes of bills/payments are a transitional allowance to be retired once posting exists.

## 7.10 Continuity Contract for Section 7
The collection model and the rules doctrine are **kept in full** — this section ratifies them and mandates four additive strengthenings: tighten the three client-writable financial transitions, add `onlyFieldsChanged` to the one unscoped branch, commit an indexes file, and add `companyId` to financial collections. No collection is renamed or removed.

---
---

# SECTION 8 — SECURITY ARCHITECTURE

## 8.1 The one-sentence threat model

**In production, DSBC is a static SPA talking directly to Firestore; therefore `firestore.rules` plus deployed functions are the entire security perimeter, and anything they permit, a crafted client can do.** Every rule in this section follows from that sentence. It restates AP-6 as an operational doctrine.

## 8.2 The defense-in-depth layers (and which ones are real)

| Layer | Mechanism | Trust level |
|---|---|---|
| UI gating | `ProtectedRoute`, role-hidden nav | **Cosmetic** — hides, does not protect |
| Service validation | client-side business rules | **Cosmetic** — bypassable via direct SDK |
| Firestore rules | [`firestore.rules`](../firestore.rules) | **REAL** — the production boundary |
| Deployed functions | (target) callable Cloud Functions | **REAL** — once deployed (Section 6) |
| Undeployed Express | [`server/`](../server/) | **Not in production path today** |

**Rule SEC-1:** Never claim a control as a security control unless it lives in the two REAL layers. Reviewers MUST reject "we validate it in the service" as a security argument.

## 8.3 The critical gap and its closure (the security spine)

The forensic audit's CRITICAL findings all trace to one root: authoritative checks live in undeployed code, and the client falls back to weaker writes (AUDIT: SECURITY C-1 → C-2, C-3, H-1, H-4). The mandated closure sequence, in order:

1. **Deploy the authoritative path** (Section 6, R1). Functions enforce cross-document sums transactionally.
2. **Invert `secureApi`** to fail-loud, remove the production fallback (Rule BE-2).
3. **Tighten rules** so the money transitions are function-only (Rule FS-2), and add the missing `onlyFieldsChanged` (Rule FS-3).
4. **Verify** by attempting a direct-SDK over-payable release and confirming rules reject it.

Until step 4 passes, the platform MUST be described as "safe for a single trusted operator only" (Section 2.9 honesty tenet).

## 8.4 Authentication

- Firebase Auth (Google, email registration, dev-anon triple-guarded). Sessions handled by the SDK; role live-subscribed via `AuthContext`.
- **Rule SEC-2:** The dev-login path MUST remain triple-guarded (`import.meta.env.DEV` + `VITE_ENABLE_DEV_LOGIN` + anonymous auth) and MUST never grant more than PROJECT_MANAGER. It MUST be stripped from production builds.
- **Rule SEC-3:** New-user default (PROJECT_MANAGER / PENDING) MUST be preserved; `PENDING` is the gate that makes a write-capable default safe. No signup path may create an ACTIVE privileged user.

## 8.5 Authorization

- **Rule SEC-4:** Roles MUST migrate to custom claims (Rule BE-6). The rules' `getUserData().role` pattern is acceptable transitionally but is both a cost (a `get()` per check) and a coupling to a client-readable doc.
- **Rule SEC-5:** SUPER_ADMIN's guard-bypass and ADMIN's cross-user write power are concentrated privileges; any operation that grants or changes roles MUST be audited and SHOULD (post-migration) be a function-only operation, not a direct `users` doc write.

## 8.6 The audit trail's integrity

**Rule SEC-6:** `auditLogs` create MUST validate `request.resource.data.userId == request.auth.uid` in the rules, closing the current forgeable-authorship hole ([`firestore.rules:350`](../firestore.rules); AUDIT: SECURITY H-3). Ideally, security-material audit entries are written only by functions. Immutability (no update/delete) MUST remain.

## 8.7 Data exposure

- **Rule SEC-7:** `users` currently reads to any authenticated user, exposing all emails/roles (AUDIT: SECURITY M-4). Reads SHOULD be narrowed (self + admin/relevant roles). `vendors` already models the correct pattern (restricted read, [`firestore.rules:593-599`](../firestore.rules)).
- **Rule SEC-8:** No PII in client logs. The auth-context dump in [`db.ts:70`](../src/services/db.ts) MUST be reduced to non-PII diagnostics.

## 8.8 Input & injection

- Firestore parameterization makes SQL-style injection a non-issue, but **Rule SEC-9:** all externally-influenced writes MUST be validated by the Section 16 framework before persistence, and functions MUST validate request bodies (adopt `zod`, currently a dependency but unused server-side).

## 8.9 Transport & headers

- **Rule SEC-10:** Deployed hosting SHOULD set security headers (CSP, HSTS, X-Frame-Options) via `firebase.json`. None are set today (AUDIT: SECURITY M-3).

## 8.10 The security review gate

**Rule SEC-11:** Any PR touching [`firestore.rules`](../firestore.rules), [`server/`](../server/), `secureApi.ts`, `authMiddleware.ts`, or role logic MUST receive an explicit security review and MUST state, in the PR description, which of the two REAL layers enforces each changed invariant.

## 8.11 Continuity Contract for Section 8
The existing rules and auth flow are **the foundation** — strong, and kept. Security work is (1) deploy what already exists, (2) invert the fallback, (3) tighten specific existing rules, (4) migrate roles to claims. All continuation; none redesign.

---
---

# SECTION 9 — FINANCIAL ARCHITECTURE

## 9.1 The two-tier financial model

DSBC's finance is, and will remain, a **two-tier** model:

- **Tier 1 — Operational documents** (the source of truth): work orders, bills, payments, payment requests, adjustments, sales, receipts, schedules. These are what users create and move through state machines.
- **Tier 2 — Derived views** (computed on read): contractor ledgers, customer ledgers, KPIs, aging, recovery — all produced by the pure functions in [`src/lib/*Calcs.ts`](../src/lib/) from Tier 1.

Section 10 adds a **Tier 3 — Posted records** (immutable journal), which sits alongside, fed by Tier 1 transitions and continuously checked against Tier 2. Tiers 1 and 2 exist today and are correct in design; Tier 3 is the additive frontier.

## 9.2 The canonical money formulas (single source of truth)

The platform's money math MUST be defined once and imported everywhere. These are the formulas as verified in the code; the constitution's job is to make them **singular**.

**Work Order financials** (today in [`WorkOrderForm.tsx:215-218`](../src/components/WorkOrderForm.tsx), and *divergently* in [`secureRoutes.ts:220-234`](../server/secureRoutes.ts)):
```
gst        = (totalAmount − advance) × gstPercentage / 100
subtotal   = (totalAmount − advance) + otherCharges
retention  = totalAmount × retentionPercentage / 100
grandTotal = subtotal + gst − retention
```
**Rule FIN-1:** This MUST be extracted into `src/lib/workOrderFinancials.ts` as one pure function `computeWorkOrderFinancials()` and imported by the form, the server/function, and tests. The current divergence (VO approval omits the advance and retention subtractions) is a P0 correctness defect (AUDIT: TECHNICAL_DEBT D-2) that this extraction permanently fixes.

**Bill financials** (in both [`Bills.tsx:131-143`](../src/pages/Bills.tsx) and [`billService.ts:21-33`](../src/services/billService.ts) — already duplicated):
```
currentBillAmount = workDoneAmount + previousBillAmount
tds               = workDoneAmount × tdsPercentage / 100        (default 2%)
retention         = workDoneAmount × retentionPercentage / 100  (default 5%)
netPayable        = workDoneAmount − tds − retention − advanceAdjustment
```
**Rule FIN-2:** `recalculateBillTotals` is the sole implementation; the UI MUST import it, not re-derive. `netPayable` MUST be floored at 0 (today it can go negative, AUDIT: TECHNICAL_DEBT).

## 9.3 The overbilling ceiling — one definition

Three divergent ceilings exist today (gross BOQ at create, net grandTotal at approve, net at WO-edit; AUDIT: TECHNICAL_DEBT D-1). **Rule FIN-3:** there MUST be exactly one authoritative ceiling function, `outflowCeiling(wo)`, applied at bill create, bill update, bill approve, and both payment paths. The constitution designates **gross BOQ value** (`woGrossValue`) as the work-done ceiling — the client comment at [`billService.ts:74-81`](../src/services/billService.ts) already identifies the net figure as the historical bug. Payment ceilings track `netPayable` separately. One function, four call sites, zero drift.

## 9.4 Tax and retention are liabilities, not just deductions

Today TDS and retention are arithmetic subtractions that then **vanish** — no liability is tracked and retention has no release flow (AUDIT: TECHNICAL_DEBT D-4). This is the largest *modelling* gap in the finance tier.

**Rule FIN-4:** Retention and TDS MUST be modelled as tracked liabilities:
- Withheld retention accrues to a per-contractor (and per-company) retention-payable balance.
- A **retention release** is an explicit, guarded, audited transaction (a new state transition), mirroring payment release.
- TDS withheld accrues to a TDS-payable balance for statutory remittance reporting.
This is additive: it introduces new operational records and derived views; it does not change how bills are created.

## 9.5 Partial billing & payment — preserved

Multi-bill-per-WO partial billing (auto-derived `previousBillAmount`) and partial payment (bill → PARTIALLY_PAID/PAID on release) are correct and MUST be preserved. **Rule FIN-5:** partial-payment status math (`isFullyPaid = totalReleased ≥ netPayable − 0.01`) lives in one place (the release function), never re-implemented.

## 9.6 The two payment systems must converge

Bills→Payments and WO→PaymentRequests coexist with independent ceilings (AUDIT: ARCHITECTURE §4). **Rule FIN-6:** all contractor outflow MUST pass through one accounting function `getTotalFinancialOutflow(wo)` (which already exists in [`paymentRequestCalcs.ts:136`](../src/lib/paymentRequestCalcs.ts) but is not used by the Bills path). Both UIs may remain; the *accounting* underneath MUST be single. Longer term, designate one canonical outflow path and deprecate the other per AP-10.

## 9.7 Rounding discipline

**Rule FIN-7:** All monetary computation MUST use a shared `round2()` to two decimals. The sale-side modules already do; `financialCalcs.ts`/`ledgerUtils.ts` do not (AUDIT: TECHNICAL_DEBT G-6). Display continues to round to whole rupees via `formatCurrency`, but stored/summed values MUST be paise-exact.

## 9.8 Money epsilon

The `0.01` tolerance used in payable comparisons is a deliberate float-guard. **Rule FIN-8:** it MUST be a single named constant (`MONEY_EPSILON`) in `src/lib/`, not the scattered literals present today.

## 9.9 Continuity Contract for Section 9
Every formula here is the **current** formula; the section's mandate is to make each singular and to add liability tracking for retention/TDS. The operational documents, the derive-on-read tier, and the partial-billing model are untouched in shape.

---
---

# SECTION 10 — POSTING ENGINE PHILOSOPHY

## 10.1 Where the platform stands (the honest baseline)

DSBC today performs **derived reporting, not double-entry accounting.** Verified: a repo-wide search for voucher/journal/chartOfAccounts/trialBalance/postingEngine yields zero implementation (AUDIT: ARCHITECTURE §5). `LedgerEntry` is a transient view-model, never persisted. This section defines the engine that closes that gap — **the single largest net-new construction sanctioned by this constitution** — and it is designed to bolt onto the existing state machine, not disturb it.

## 10.2 The founding principle: post on transition, reconcile against derivation

The posting engine's philosophy is unique to DSBC and follows directly from AP-2:

> **Every financially-material state transition emits a balanced, immutable journal entry (Tier 3). The existing derived ledgers (Tier 2) become the continuous, independent reconciliation check on those postings.**

Most ERPs post and hope. DSBC posts *and* keeps deriving, so the two must always agree — a permanent, automatic audit of its own books. This is a strength the current architecture uniquely enables because derivation already exists and is tested.

## 10.3 What must be built (the gap list, as design not code)

1. **Chart of Accounts** — a new `accounts` collection: account entity with type (asset/liability/income/expense/equity), code, company scope. Seeded per vertical.
2. **Journal entries** — a new immutable `journalEntries` collection: each entry has a set of balanced lines (Σdebit = Σcredit), a posting date, a source-document reference, and a company. Append-only in rules, like `auditLogs`.
3. **The posting engine** — a set of Firestore-trigger (or callable-invoked) functions that, on each sanctioned transition, write the corresponding balanced entry.
4. **Reversal** — corrections post a reversing entry; financial records are never mutated in place (Rule FS-7).
5. **Periods & opening balances** — financial-year and period-close concepts (only WO-number FY rollover exists today).
6. **Trial balance & statements** — derived reports over `journalEntries`, cross-checked against Tier 2.

## 10.4 The posting map (transition → entry)

The engine posts on these existing transitions (illustrative double-entry, to be finalized with the client's accountant):

| Existing transition | Debit | Credit |
|---|---|---|
| Bill APPROVED | WIP / Expense | Contractor Payable + Retention Payable + TDS Payable |
| Payment RELEASED | Contractor Payable | Bank |
| Advance paid | Contractor Advance | Bank |
| Retention released (new, FIN-4) | Retention Payable | Bank |
| Sale BOOKED/SOLD | Customer Receivable | Sales Revenue |
| Sale Receipt | Bank / Cash | Customer Receivable |
| Adjustment (DEBIT/CREDIT) | per direction | per direction |

**Rule POST-1:** The posting engine MUST be driven by the *existing* state transitions (Section 11/12), not by a parallel data-entry surface. Users keep creating bills and payments exactly as now; posting is an automatic consequence.

## 10.5 Non-negotiable invariants of the engine

- **Rule POST-2:** Every journal entry MUST balance (Σdebit = Σcredit to `MONEY_EPSILON`) — enforced in the writing function and re-checkable in rules by structure.
- **Rule POST-3:** Journal entries are **immutable**. No update, no delete. Corrections are reversing entries.
- **Rule POST-4:** Every entry MUST reference its source operational document and carry a `companyId` (Section 23).
- **Rule POST-5:** Posting MUST be transactional with the transition it records — a released payment and its journal entry commit together or not at all. (This is why the release must be a deployed function, Section 6.)
- **Rule POST-6:** The engine MUST expose a reconciliation report comparing Tier 3 balances to Tier 2 derived balances; a divergence is a P0 alarm.

## 10.6 Migration & honesty

**Rule POST-7:** Until Sections 10's engine ships and reconciles, the platform, its marketing, and this document MUST describe DSBC's accounting as "derived reporting / MIS," never as "double-entry accounting." Overstating this is a vision-level violation (Section 1.3, 2.9).

## 10.7 Continuity Contract for Section 10
This is the one large *addition*. It is explicitly designed as a bolt-on: it consumes existing transitions, reuses the existing derivation as its checksum, and adds new append-only collections without altering any operational document or state machine. It is continuation of the platform's own trajectory (the audit named it the top financial gap), not a redesign.

---
---

# SECTION 11 — WORKFLOW ENGINE

## 11.1 Workflows already exist implicitly; formalize them

Every core entity moves through a status enum, and transitions are enforced in three places (UI, service, rules). Today each entity's workflow is *implicit* — spread across a status enum, service methods, rule branches, and UI buttons. The constitution's direction: **make the state machine an explicit, declared, single-sourced artifact per entity**, without changing the machines themselves.

## 11.2 The canonical state machines (verified)

These are the machines as they exist and MUST be preserved:

- **Work Order:** `PENDING → APPROVED → COMPLETED`; `PENDING → REJECTED`.
- **Bill:** `DRAFT → VERIFIED → APPROVED → PARTIALLY_PAID → PAID`; pre-APPROVED `→ REJECTED`.
- **Payment:** `PENDING → APPROVED → RELEASED`; `PENDING → REJECTED`.
- **Variation Order:** `DRAFT → APPROVED`; `DRAFT → REJECTED`.
- **Payment Request:** `PENDING_APPROVAL → APPROVED → PAID`; `PENDING_APPROVAL → REJECTED`.
- **Sale:** `BOOKED → SOLD → POSSESSION_GIVEN`; `→ CANCELLED`.
- **Sale Schedule:** `PENDING → PARTIALLY_PAID → PAID`; sticky `WAIVED`/`CANCELLED`.

## 11.3 The workflow declaration standard

**Rule WF-1:** Each entity's state machine MUST be declared as data — a transition table (`fromStatus`, `toStatus`, `allowedRoles`, `guardedFields`, `preconditions`, `sideEffects`) — in one module per entity (e.g. `src/lib/workflows/billWorkflow.ts`). The rules, the service/function, and the UI all consume that declaration. This is the mechanism that ends the "logic drifts across three layers" problem (AP-1) for lifecycle logic specifically.

**Rule WF-2:** A transition MUST be a named operation (`verifyBill`, `releasePayment`), never a raw status write from the UI. The `firestore.rules` `onlyFieldsChanged` scoping is the boundary-side expression of the same declaration.

## 11.4 Guarantees a workflow transition must provide

Every transition, on execution, MUST:
1. Re-assert its precondition inside a transaction (BE-4).
2. Move only its declared fields (FS-3).
3. Emit an audit entry (Section 14).
4. Emit a domain event (Section 13).
5. Trigger posting if financially material (Section 10).
6. Return a typed result or throw a `BusinessRuleError` (Section 17).

**Rule WF-3:** These six are the fixed contract of a transition. A transition that skips audit, event, or posting is incomplete.

## 11.5 Sticky and terminal states

`WAIVED`/`CANCELLED` schedules and `PAID` payment requests are terminal/sticky today ([`scheduleCalcs.ts`](../src/lib/scheduleCalcs.ts), [`paymentRequestCalcs.ts`](../src/lib/paymentRequestCalcs.ts)). **Rule WF-4:** terminal states MUST be declared as such and MUST reject all further transitions except ADMIN reversal-via-new-entry.

## 11.6 Continuity Contract for Section 11
The state machines are **exactly today's** machines. The section adds a *declaration format* that unifies their three current enforcement copies into one source consumed by all layers. No lifecycle is changed; the change is representational and additive.

---
---

# SECTION 12 — APPROVAL ENGINE

## 12.1 Approval is DSBC's spine

The platform's reason to exist commercially is **enforced multi-stage approval**: no bill is paid without verification and approval, no payment released without CEO approval, no VO applied without CEO sign-off. This is verified in the rules and services. The approval engine is a specialization of the workflow engine (Section 11) for the transitions that require a *different role than the initiator*.

## 12.2 The canonical approval chains (verified)

| Object | Initiate | Verify | Approve | Execute |
|---|---|---|---|---|
| Bill | ACCOUNTS/ADMIN (DRAFT) | PROJECT_MANAGER (→VERIFIED) | CEO (→APPROVED) | — |
| Payment | ACCOUNTS/ADMIN (PENDING) | — | CEO (→APPROVED) | ACCOUNTS (→RELEASED) |
| Variation Order | PM/ADMIN (DRAFT) | — | CEO (→APPROVED) | — |
| Payment Request | PM/ADMIN | — | CEO (→APPROVED) | ACCOUNTS (→PAID) |

## 12.3 Separation-of-duties is law

**Rule APP-1:** For any financially-material object, the role that **initiates** MUST NOT be the same identity that **approves**, and (where a distinct execute step exists) approval and execution SHOULD be different roles. This is already the design; the constitution forbids collapsing it. Convenience features that let one person do all steps are prohibited.

**Rule APP-2:** Approval authority derives from **role at the boundary**, never from a UI state or a service parameter. The `_userId` params ignored in `billService.verify/approve` (AUDIT: services §2.6) are harmless only because the real check is elsewhere; the real check MUST always be the boundary.

## 12.4 Approval transitions are function-only in the mature platform

**Rule APP-3:** Approve/release/execute transitions on money objects MUST run through the deployed authoritative path (Section 6) so the cross-document checks (ceiling, cumulative payable) run transactionally. The rules permit the *role* to make the transition; the *amount correctness* is the function's job. This is the direct fix for the client-fallback bypass (AUDIT: SECURITY C-2/C-3).

## 12.5 Approval metadata

Every approval transition MUST stamp `approvedBy`/`approvedAt` (or `verifiedBy`/`paidBy` equivalents) — already the convention, and scoped by `onlyFieldsChanged` in rules. **Rule APP-4:** these audit-of-approval fields MUST be part of the transition's declared field set and MUST never be client-writable outside the transition.

## 12.6 Rejection & reasons

Rejections with mandatory reasons already exist (payment request reject requires a reason). **Rule APP-5:** every rejection transition MUST capture a reason and MUST be as audited as an approval. Silent rejection is prohibited.

## 12.7 Future: configurable approval thresholds

The `₹50,000` advance-reason threshold ([`paymentRequestService.ts:32`](../src/services/paymentRequestService.ts)) hints at value-based approval routing. **Rule APP-6 (forward):** approval chains SHOULD become configurable per company/vertical (e.g. amounts above a threshold require an extra approver) via the Section 24 config surface — declared as data, consumed by the one engine (AP-12). Do not hardcode new thresholds; add them to config.

## 12.8 Continuity Contract for Section 12
The approval chains, roles, and separation-of-duties are **today's design**, ratified. The additions are: route approvals through the deployed authoritative path, and make thresholds configurable. Both continue the existing model.

---
---

# SECTION 13 — EVENT BUS

## 13.1 Why an event bus, and why now

Today, side effects of a transition are **inline and coupled**: releasing a payment directly updates the bill in the same batch; approving a VO directly rewrites WO financials. This works but couples every producer to every consumer, and it is why adding the posting engine (Section 10) or richer notifications (Section 15) otherwise means editing every transition. The event bus **decouples "what happened" from "what should follow."** It is a new seam, introduced additively.

## 13.2 The principle: transitions emit events; reactors subscribe

> **A workflow transition's job is to change its own state and emit a domain event. Everything that must happen *because* of that transition — posting, notification, alert, cache update, reconciliation — is a separate reactor subscribed to the event.**

This directly serves AP-11 (one primitive per concern) and makes Section 10 and 15 clean bolt-ons rather than invasive edits.

## 13.3 The canonical event set

Events mirror the state transitions (Section 11), named `<Entity><PastTenseTransition>`:
`BillApproved`, `PaymentReleased`, `VariationOrderApproved`, `PaymentRequestPaid`, `SaleBooked`, `SaleReceiptRecorded`, `RetentionReleased`, etc. Each event carries: the entity id, the company id, the actor, the timestamp, and the minimal payload a reactor needs.

## 13.4 Implementation constraint: fit the platform, don't import a broker

**Rule EVT-1:** The event bus MUST be implemented within the existing platform primitives — **Firestore-trigger Cloud Functions** reacting to document writes are the sanctioned mechanism (a document reaching a status *is* the event). No external message broker (Kafka, PubSub-beyond-Firestore) MAY be introduced without an amendment. This keeps the bus inside the deployment model of Section 20.

**Rule EVT-2:** Reactors MUST be idempotent (a re-fired trigger MUST NOT double-post or double-notify) — because Firestore triggers can fire more than once. Idempotency keys derive from the source document + transition.

## 13.5 Ordering & consistency

- **Rule EVT-3:** Financially-material reactions (posting) that MUST be atomic with the transition MUST run *inside* the transition's transaction, not as an async reactor (POST-5). The event bus is for reactions that MAY be eventually consistent (notifications, alerts, denormalized read models). Choosing the wrong side of this line is a correctness bug.

## 13.6 Migration path (incremental, non-breaking)

The bus is adopted transition-by-transition:
1. Keep the current inline side effect working.
2. Emit the event alongside it.
3. Move eventually-consistent consumers (notifications, future read models) to reactors.
4. Leave atomic consumers (bill-status-on-release, posting) inside the transaction.

**Rule EVT-4:** Introducing the bus MUST NOT remove an existing atomic guarantee. The `payment-release-also-updates-bill` batch stays atomic; only decoupled side effects migrate.

## 13.7 Continuity Contract for Section 13
The event bus is **new but native** — built from Firestore triggers already available in the platform, adopted incrementally, and forbidden from weakening any existing atomic transition. It exists to make Sections 10 and 15 additive rather than invasive. No current behavior is removed.

---
---

# SECTION 14 — AUDIT SYSTEM

## 14.1 The audit trail is platform memory

DSBC already writes an audit trail: `db.logAction` on the client ([`db.ts:225`](../src/services/db.ts)) and `writeAuditLog` on the server ([`auditLog.ts`](../server/auditLog.ts)), both into the append-only `auditLogs` collection. This is a first-class product surface (Tenet 2.8), and it MUST be hardened, not left as-is.

## 14.2 The three defects to correct

The current audit system has three verified weaknesses:
1. **Forgeable authorship** — any authenticated user can write an entry with an arbitrary `userId` ([`firestore.rules:350`](../firestore.rules); AUDIT: SECURITY H-3).
2. **Never runs server-side in production** — the server audit path is undeployed, so all production entries are client-authored.
3. **No read UI** — the trail is write-only from the app's perspective (AUDIT: MODULE #28).

## 14.3 The audit doctrine

- **Rule AUD-1 (integrity):** `auditLogs` create MUST enforce `userId == request.auth.uid` in rules (SEC-6). Immutability (no update/delete) MUST remain — this part is already correct.
- **Rule AUD-2 (authoritative authorship):** Security- and finance-material audit entries MUST be written by the deployed function performing the transition (`source: 'server'`), inside the transition's transaction, so the record cannot diverge from the act.
- **Rule AUD-3 (completeness):** Every workflow transition (Section 11) MUST emit an audit entry. This is one of the six transition guarantees (WF-3). A transition without an audit entry is incomplete.
- **Rule AUD-4 (readability):** The platform MUST provide an admin-facing audit-trail read UI (the collection is admin/CEO-readable in rules but has no screen). Filtering by entity, actor, action, outcome, and date.
- **Rule AUD-5 (content standard):** Every entry MUST carry: actor uid, resolved role, action (verb), entity type, entity id, outcome (`SUCCESS`/`BLOCKED`/`ERROR`), a human detail string, timestamp, and (Section 23) company id.

## 14.4 Audit vs Events vs Posting — three distinct records

Do not conflate them:
- **Audit** = *who attempted what and what happened* (security/compliance memory).
- **Event** (Section 13) = *what changed, so reactors can respond* (integration).
- **Journal** (Section 10) = *the financial consequence in debits/credits* (accounting).
A single payment release produces all three: one audit entry, one `PaymentReleased` event, one balanced journal entry. **Rule AUD-6:** these are separate collections with separate purposes; never overload one to do another's job.

## 14.5 Continuity Contract for Section 14
`auditLogs`, `logAction`, and the append-only rule are **kept**. The section mandates integrity validation, server authorship for material actions, a read UI, and completeness across transitions — all additive hardening of an existing system.

---
---

# SECTION 15 — NOTIFICATION SYSTEM

## 15.1 What exists

An in-app alert system exists: `AlertBell` ([`src/components/AlertBell.tsx`](../src/components/AlertBell.tsx)) reads the `alerts` collection; the server's `runAlertEngine` ([`backgroundJobs.ts`](../server/backgroundJobs.ts)) generates overdue/upcoming/high-payable alerts; `dailySummaries` feeds dashboards. **But the generators never run in production** (backend undeployed), so alerts and summaries are permanently empty for deployed users (AUDIT: MODULE #29-30). Toasts (`sonner`) provide synchronous per-action feedback.

## 15.2 The two notification planes

DSBC has two distinct notification planes, and they MUST stay distinct:
- **Synchronous feedback** — `sonner` toasts for the result of the user's own action (success/typed-error). This works and is correct.
- **Asynchronous alerts** — durable `alerts` documents for things the user should know about but didn't just do (overdue bills, pending approvals, high exposure). This is the plane that's currently dead in production.

## 15.3 The notification doctrine

- **Rule NOT-1:** The alert generators MUST run on a deployed schedule (Cloud Scheduler → function, Section 6/20). An alert system that only runs on a developer's laptop is not an alert system.
- **Rule NOT-2 (event-driven, forward):** Beyond scheduled sweeps, alerts SHOULD be generated by reactors on domain events (Section 13) — e.g. `BillApproved` notifies the CEO's approval queue immediately, rather than waiting for the daily cron. This is why Section 13 exists.
- **Rule NOT-3 (channels):** In-app alerts are the baseline. Email/SMS/push are future channels and MUST be added as additional reactors behind the same event/alert model, never as bespoke per-feature senders (AP-11). Firebase Cloud Messaging is the sanctioned push mechanism when added.
- **Rule NOT-4 (scoping):** Alerts MUST respect company scope (Section 23) — a scoped user MUST NOT receive alerts about companies they cannot see.
- **Rule NOT-5 (user control):** Alert read-state is user-controllable (already: users may set `read=true`, [`firestore.rules:362-364`](../firestore.rules)); this MUST remain the only field a user can mutate on an alert.

## 15.4 Toasts: the standard

- **Rule NOT-6:** Every mutation MUST give synchronous feedback: `toast.success` on success, `toast.error(err.message)` on `BusinessRuleError`, generic message otherwise. This is the established pattern and MUST be universal — no silent success, no silent failure (Tenet 2.5).

## 15.5 Continuity Contract for Section 15
The `alerts`/`AlertBell`/toast system is **kept**. The mandate is to deploy the generators so they actually run, add event-driven immediacy, and route future channels through the same model. Additive.

---
---

# SECTION 16 — VALIDATION FRAMEWORK

## 16.1 The current state: validation exists but is scattered and duplicated

Validation lives in three forms today: pure helpers in [`src/lib/masterValidations.ts`](../src/lib/masterValidations.ts) (`isNameUnique`, `isCodeUnique`, etc.), per-service `assert*Unique` methods (re-implemented ~7×, AUDIT: TECHNICAL_DEBT G-8), and inline form checks. The framework's goal: **one validation vocabulary, used at every layer.**

## 16.2 The three validation tiers and their jobs

| Tier | Where | Job | Trust |
|---|---|---|---|
| Form validation | pages (react-hook-form + zod) | Immediate UX; block obviously-bad input | None |
| Service validation | `src/services/` via shared validators | Ergonomic rejection with typed errors | None |
| Boundary validation | rules + functions | The actual guarantee | REAL |

**Rule VAL-1:** The same rule expressed at multiple tiers MUST call the same underlying pure validator from `src/lib/`. The 7 duplicated `assert*Unique` methods MUST be collapsed to call `masterValidations` (AP-11). Duplicated validation is drift waiting to happen.

## 16.3 Validation is pure and testable

**Rule VAL-2:** Validation *logic* MUST be pure functions in `src/lib/` (given data, return valid/invalid + reason), separate from the *I/O* that fetches comparison data. `masterValidations.ts` (44 tests) is the model. This keeps validators unit-testable and shareable with functions.

## 16.4 Uniqueness and the race caveat

Uniqueness checks are read-then-write and inherently racy (the code even acknowledges this at [`subLocationService.ts:166-172`](../src/services/subLocationService.ts)). **Rule VAL-3:** for uniqueness that MUST hold absolutely (financial identifiers, number series), enforcement MUST be transactional or use a deterministic doc id that Firestore's create-if-absent guarantees. For soft uniqueness (display names), the pre-write check is acceptable with the race documented. Never present a racy check as a hard guarantee.

## 16.5 The zod standard for new boundaries

**Rule VAL-4:** New Cloud Functions MUST validate their input with `zod` schemas (the dependency exists, unused). A schema per callable, co-located, shared with the client form where possible. This gives the boundary real input validation (SEC-9).

## 16.6 Validation returns typed errors, never booleans-that-throw-strings

**Rule VAL-5:** A failed validation MUST surface as a `BusinessRuleError` with a precise code (Section 17), not a raw string or a generic code. The current misuse (`PAYMENT_INVALID_AMOUNT` for a missing name) is prohibited (AP-7).

## 16.7 Continuity Contract for Section 16
`masterValidations.ts` is **the seed** of the framework; the section mandates consolidating the duplicated service validators onto it, keeping validators pure, and adopting zod at new boundaries. No validation behavior is removed; it is unified.

---
---

# SECTION 17 — ERROR HANDLING STANDARDS

## 17.1 The typed-error contract

DSBC's error model is already good: [`BusinessRuleError`](../src/types.ts) with a `BusinessRuleCode` union of 22 codes, thrown by services, caught by pages, shown as toasts, and normalized server-side by [`apiResponse.ts`](../server/apiResponse.ts). This is the contract, and it is law.

## 17.2 The taxonomy

Errors fall into exactly three classes:
1. **Business rule violations** — expected, typed, user-legible. `BusinessRuleError` with a specific code. The user did something the domain forbids.
2. **System/infrastructure errors** — unexpected (network, Firestore, null deref). Caught, logged (non-PII), surfaced as a generic "something went wrong," never exposing internals.
3. **Programmer errors** — bugs. Surface loudly in dev; caught by `ErrorBoundary` in prod so one bad document never white-screens the app.

**Rule ERR-1:** Every catch site MUST distinguish class 1 (show `err.message`) from classes 2/3 (show generic message). The established `error instanceof BusinessRuleError ? error.message : 'generic'` pattern is the required shape.

## 17.3 Codes are precise and intentional

**Rule ERR-2:** A `BusinessRuleCode` MUST describe the actual violation. Reusing an approximate code (the many misuses in AUDIT: TECHNICAL_DEBT G-10) is prohibited. Adding a new code to [`types.ts`](../src/types.ts) is cheap and required when no existing code fits.

**Rule ERR-3:** New codes MUST be added to the `BusinessRuleCode` union with a one-line intent comment, so the union stays a legible catalog of everything the domain can reject.

## 17.4 No silent failure, ever

**Rule ERR-4:** No `catch` block may swallow an error without either handling it meaningfully or re-throwing. `logAction`'s silent no-op when logged-out ([`db.ts:226`](../src/services/db.ts)) is acceptable *only* because it is a deliberate, documented non-critical path; general swallowing is forbidden (Tenet 2.5).

## 17.5 Server error envelopes

**Rule ERR-5:** Functions/routes MUST return the `apiResponse` envelope: `{success, message, code}`. System errors MUST NOT leak `error.message` to the client (the current leak, AUDIT: SECURITY M-2) — log server-side, return a generic code.

## 17.6 Error boundaries are mandatory

**Rule ERR-6:** Every route is wrapped in `ErrorBoundary` (FE-1). Financial renders MUST additionally guard against legacy-shaped documents with optional chaining (FE-9) so a missing `financials` object degrades gracefully instead of throwing.

## 17.7 Logging discipline

**Rule ERR-7:** `console.error` is permitted for genuine error paths; `console.log` is prohibited in committed code. No log may contain PII (SEC-8). Structured logging in functions SHOULD carry correlation ids for tracing a transition across audit/event/journal.

## 17.8 Continuity Contract for Section 17
The `BusinessRuleError` model is **kept intact** and elevated to law. The section mandates precise codes, no silent failure, no leaked internals, and universal error boundaries — hardening an already-sound error system.

---
---

# SECTION 18 — CODING STANDARDS

## 18.1 Language & style

- **TypeScript, strict.** `tsc --noEmit` (`npm run lint`) MUST pass with zero errors before merge. **Rule COD-1.**
- **ESLint MUST be added** (only `tsc` runs today, AUDIT: TECHNICAL_DEBT G-20) and MUST pass in CI. **Rule COD-2.**
- Types over `any`. `any` requires a written justification. Prefer discriminated unions (the status enums are the model).
- Functional React components with hooks; no class components except `ErrorBoundary` (React requires it there).

## 18.2 The service template

Every service MUST follow the verified shape:
```ts
const COLLECTION = 'things';
export const thingService = {
  getAll: (cb) => subscribeToCollection<Thing>(COLLECTION, cb),
  getById: (id) => getDocument<Thing>(COLLECTION, id),
  create: async (data) => { /* validate → createDocument → logAction */ },
  update: async (id, data) => { /* guard status → updateDocument → logAction */ },
  delete: async (id) => { /* reference-guard → deleteDocument → logAction */ },
};
```
**Rule COD-3:** Services MUST go through [`db.ts`](../src/services/db.ts) primitives (`createDocument`, `updateDocument`, `subscribeToCollection`, `logAction`, `executeBatch`, `runTransaction`), never raw Firestore, so audit/stamping/error-normalization come for free (Tenet 2.4).

## 18.3 Purity boundary

**Rule COD-4:** `src/lib/` MUST NOT import React or Firebase (Section 4). Business math is pure, clock-injectable, and unit-tested.

## 18.4 No magic values

**Rule COD-5:** Magic numbers/strings MUST be named constants: `MONEY_EPSILON` (0.01), `ADVANCE_REASON_THRESHOLD` (50000), batch limits (400/500), emulator URL, series defaults (AUDIT: TECHNICAL_DEBT G-16). Financial and threshold constants live in one module and, where company/vertical-variable, move to config (AP-12).

## 18.5 No dead code

**Rule COD-6:** Committed code MUST be reachable. Dead methods (`billService.markAsPaid`, unused getters), dead imports, unreachable branches, and handler-less buttons (FE-8) are prohibited. If it's not used, delete it; git history preserves it.

## 18.6 File size & decomposition

**Rule COD-7:** A component file SHOULD stay under ~500 lines. The oversized pages (SubLocations 1259, SaleDetail 1000, AdminUsers 893, AUDIT: PERFORMANCE §6) are to be decomposed opportunistically — extract dialogs, tables, and sections into child components. New pages MUST NOT be born oversized.

## 18.7 DRY within reason

**Rule COD-8:** Logic duplicated across ≥2 sites MUST be extracted to a shared module: the ×3 `loadSaleOrThrow`, ×2 `normName`, ×3 badge components, ×7 master CRUD pages, status-color ternaries (AUDIT: TECHNICAL_DEBT G-8). The 7 master pages SHOULD collapse into one generic CRUD-table component. Extraction is continuation, not redesign.

## 18.8 Comments

- Comment the *why* and the *constraint*, not the *what*. The rules file and `types.ts` deprecation notes are the model — they explain intent and history.
- **Rule COD-9:** `@deprecated` markers MUST accompany any field/method kept for back-compat, with the replacement named (AP-10).

## 18.9 Imports & references

- Use the clickable `file:line` convention in docs and PRs.
- No circular dependencies; the layer dependency direction (Section 4.2) MUST hold.

## 18.10 Continuity Contract for Section 18
These standards codify **how the codebase is already mostly written** (service template, purity, typed errors) and add the missing hygiene gates (ESLint, CI, constant extraction, dead-code removal, decomposition). Nothing here asks for a stylistic rewrite; it asks for consistency with the best of what exists.

---
---

# SECTION 19 — TESTING STANDARDS

## 19.1 The current baseline

The platform has **199 passing tests across 9 files** (Vitest 3.2.x): `financialCalcs` (26), `customerLedgerCalcs` (14), `paymentRequestCalcs` (15), `pmDashboardCalcs` (10), `recoveryCalcs` (13), `scheduleCalcs` (33), `userAccess` (39), `masterValidations` (44), `financialCalculationService` (5). The pure-calc core is genuinely well-tested; the schedule engine and access matrix are exemplary. This is the foundation the testing standard builds on.

> *Corrected 2026-07-29 under NN-22 / Amendment Protocol §1 (code wins; a stale constitution is a defect). The prior figure — 194 tests across 8 files — was the v0.9.0 audit baseline, taken before `financialCalculationService.test.ts` was added by Platform Stabilization v1.1. The audit documents intentionally retain the original figure as a historical record.*

## 19.2 The critical gaps to close

- **`ledgerUtils.ts` has zero tests** — the most accounting-like module in the repo (AUDIT: TECHNICAL_DEBT D-3). **Rule TEST-1:** this MUST be covered before any further ledger change.
- **No service tests** — client-side business rules (overbilling, payment ceilings, receipt cache atomicity) are untested.
- **No function/route tests** — the transactional money invariants (where correctness actually lives) have no coverage.
- ~~**No integration/emulator tests** — rules and cross-document behavior are unverified end-to-end.~~
  **CLOSED for rules (2026-07-29):** `tests/rules/` now holds **161 emulator-backed
  rules-unit-tests** across bills, payments, payment requests, work orders, variation
  orders, the audit trail and the server-only collections, proving allow AND deny
  (TEST-3). Run with `npm run test:rules`. Cross-document behaviour remains uncovered —
  rules cannot cross-query, so that belongs to `tests/functions/`, still pending.
  Findings: [`RULES_TEST_REPORT.md`](../RULES_TEST_REPORT.md).

## 19.3 The testing pyramid for DSBC

| Level | Tool | Covers | Requirement |
|---|---|---|---|
| Unit (pure) | Vitest | `src/lib/*` math & validation | MANDATORY for all new lib code |
| Service | Vitest + Firestore emulator | service business rules | MANDATORY for financial services |
| Function | Vitest + emulator | transactional invariants | MANDATORY for money functions |
| Rules | `@firebase/rules-unit-testing` | boundary enforcement | MANDATORY for every rules change |
| E2E | (future) Playwright | critical user journeys | SHOULD for approval/payment flows |

## 19.4 Non-negotiable testing rules

- **Rule TEST-2:** Every new pure function in `src/lib/` MUST ship with a co-located `*.test.ts` in the same PR. No exceptions — this is why the calc core is trustworthy.
- **Rule TEST-3:** Every `firestore.rules` change MUST ship with rules-unit-tests proving both the allowed and the denied cases — especially the money transitions (a test that a client CANNOT directly release an over-payable payment is the single most important test in the suite).
- **Rule TEST-4:** Every financial invariant (ceiling, posting balance, retention accrual) MUST have a test asserting the failure case, not just the happy path. Bugs live in the rejection branches.
- **Rule TEST-5:** Date-dependent tests MUST inject a fixed clock (the calc modules already accept `now`/`today` — this is why they're deterministic). Real `Date.now()` in a test is prohibited.
- **Rule TEST-6:** The posting engine (Section 10) MUST have a reconciliation test proving Tier 3 (journal) balances equal Tier 2 (derived) balances on a representative dataset.

## 19.5 CI gate

**Rule TEST-7:** CI MUST run `tsc --noEmit`, ESLint, and `vitest run` on every PR, and MUST block merge on failure. No CI exists today (AUDIT: TECHNICAL_DEBT G-20); establishing it is a P1.

## 19.6 Test data & determinism

- Tests MUST be hermetic (no live Firestore, no network). Use the emulator for I/O-level tests.
- Fixtures MUST pin dates and ids; randomness is prohibited except via a seeded, documented generator.

## 19.7 Continuity Contract for Section 19
The excellent pure-calc suite is **the model to extend**, not replace. The mandate is to close the ledger/service/function/rules coverage gaps and gate CI on them. Additive throughout.

---
---

# SECTION 20 — DEPLOYMENT ARCHITECTURE

## 20.1 The current deployment and its central flaw

Today `firebase.json` deploys **only** static hosting (`dist/`) + `firestore.rules`. There is no `functions/`, no Cloud Run, no CI, no `firestore.indexes.json`, no emulator config. The Express backend and node-cron jobs **never run in production** (AUDIT: docs §2). This is the deployment-topology root of the platform's biggest correctness/security problem.

## 20.2 The target topology

```
Firebase Hosting        ← static SPA (dist/)            [EXISTS]
Firestore + rules       ← data + boundary               [EXISTS]
Cloud Functions         ← privileged ops + event bus    [TARGET — from server/secureRoutes.ts]
Cloud Scheduler         ← alert/summary jobs            [TARGET — from server/backgroundJobs.ts]
Firestore indexes       ← firestore.indexes.json        [TARGET — committed]
```

**Rule DEP-1:** Production MUST include a deployed authoritative compute layer (Cloud Functions). Shipping privileged logic that only runs in `npm run dev` is prohibited (this is the C-1 closure).

## 20.3 Environments

- **Rule DEP-2:** Three environments MUST exist: local (emulator + dev server), staging, production. The legacy single-project setup MUST gain at least a staging project so rules/functions are verified before prod.
- **Rule DEP-3:** Firebase config MUST come from environment variables per environment; the committed `firebase-applet-config.json` fallback (now placeholder-only after the DSBC Civil migration) is acceptable only for local dev and MUST NOT be the production config source (AUDIT: SECURITY M-5).

## 20.4 Build & release

- Build: `vite build` → `dist/`. **Rule DEP-4:** production builds MUST strip dev-only paths (dev-login, client-fallback writes) via `import.meta.env.DEV` guards verified at build time.
- **Rule DEP-5:** Deployment MUST be scripted and, ultimately, CI-driven: build → test → deploy rules+indexes+functions+hosting together. Deploying hosting without the matching rules/functions is prohibited (they must move as a set to avoid a client expecting a function that isn't there).

## 20.5 Indexes & rules as code

**Rule DEP-6:** `firestore.rules` and `firestore.indexes.json` are source-controlled deployment artifacts and MUST be deployed from the repo, never edited in the console. Console drift is prohibited.

## 20.6 Migrations

**Rule DEP-7:** Schema migrations (AP-10) MUST be committed tools (the `legacyDataCleanup` pattern) and run deliberately, with the migration and its triggering UI/where-clause documented. `companyId` backfills for Section 23 follow this.

## 20.7 Observability

**Rule DEP-8:** Deployed functions MUST emit structured logs; the reconciliation report (POST-6) and audit trail (Section 14) are the financial observability surface. A production without running alert jobs and without a readable audit trail is under-observed (both are current gaps).

## 20.8 Versioning

The manual `appVersions` deployment log + `appVersion.ts` constants are honest and kept. **Rule DEP-9:** the version constants, `VERSION` file, and `package.json` version MUST stay in sync (they are today at 0.9.0); a release SHOULD bump them together and log the deployment.

## 20.9 Continuity Contract for Section 20
Hosting + rules deployment is **kept**; the mandate is to *add* the functions/scheduler/indexes deployment that was always planned (`CLOUD_FUNCTIONS_PLAN.md`) and to add staging + CI. This is the deployment continuation that makes every prior section's "authoritative path" real.

---
---

# SECTION 21 — PERFORMANCE STANDARDS

## 21.1 The current profile and its ceiling

DSBC reads **entire collections via real-time listeners and filters on the client, with zero pagination** — up to ~10 concurrent full-collection listeners on the admin dashboard (AUDIT: PERFORMANCE §1-2). Fine at hundreds of documents; linearly degrading toward tens of thousands. There is one real memory leak. The performance standard's job: keep the responsive real-time feel while removing the scale ceiling — by strengthening the existing subscription model, not abandoning it.

## 21.2 The standards

- **Rule PERF-1 (no leaks):** Every subscription `useEffect` MUST return its unsubscribe (FE-3). The `CustomerLedger` leak is a P1 fix.
- **Rule PERF-2 (shared listeners):** As data grows, one shared data layer MUST dedupe collection listeners (FE-5). No screen may hold two live listeners on the same collection.
- **Rule PERF-3 (scoped queries):** High-cardinality collections (bills, payments, sales, saleReceipts, subLocations, auditLogs) MUST move to server-side company-scoped, `orderBy`+`limit`+cursor-paginated queries. Client-side scoping of full downloads is both a cost and a data-exposure problem (it downloads other companies' data then hides it).
- **Rule PERF-4 (targeted reads):** Full-collection-fetch-then-filter-in-memory (e.g. `getActivePaymentsForWO` reading all payments, `findUsersByEmail` reading all users) MUST become `where`-constrained queries. This also removes read-then-write race windows (double win with AP-5).
- **Rule PERF-5 (indexes):** Every multi-field query MUST have its composite index committed (FS-5/DEP-6).
- **Rule PERF-6 (custom claims):** Migrating roles to custom claims (BE-6) removes a `get()` per rule evaluation — a per-operation cost reduction, not just a security win.
- **Rule PERF-7 (render):** Large lists SHOULD be virtualized; heavy derivations MUST be memoized on stable inputs (the `useMemo` scoping pattern is correct — keep it). Oversized pages (COD-7) re-render large trees on every tick; decompose them.

## 21.3 Performance budgets

- **Rule PERF-8:** A screen SHOULD reach interactive on a mid-range device with its scoped, paginated data in under ~2s. A screen that requires downloading an entire unbounded collection to render violates this at scale and MUST be paginated before onboarding data-heavy tenants.

## 21.4 Measurement before optimization

**Rule PERF-9:** Optimizations MUST be justified by a measured cost (Firestore read counts, listener counts, render profiles), not guessed. The audit's structural findings are the starting map; profiling confirms priorities.

## 21.5 Continuity Contract for Section 21
The real-time subscription + `useMemo` model is **kept** — it is what makes the app feel live. The mandate is to fix the one leak, dedupe listeners, and add scoping/pagination/indexes for high-cardinality data. Every item strengthens the existing model; none replaces it.

---
---

# SECTION 22 — AI INTEGRATION STRATEGY

## 22.1 Two distinct meanings of "AI" here — keep them separate

1. **AI as a contributor** — models (like the ones that built much of this codebase and produced the forensic audit) writing and reviewing code.
2. **AI as a product feature** — LLM-powered capabilities inside DSBC for end users.

The strategy governs both. Note: the repo's README references a `GEMINI_API_KEY` and AI Studio origins, but **no AI feature code exists** (the key is consumed by nothing, AUDIT: docs §1.1). So product-AI is greenfield, and contributor-AI is the present reality.

## 22.2 AI as a contributor — the governing rules

Because multiple AI models have contributed over months and produced drift (blueprint vs reality, duplicated business math), the constitution binds AI contributors explicitly:

- **Rule AI-1:** An AI model MUST read the relevant section of this constitution and the [`/audit`](../audit/README.md) baseline before modifying code in that area. This document exists precisely so a fresh model inherits ground truth, not stale docs.
- **Rule AI-2:** An AI model MUST verify claims against source, never against documentation (README/blueprint are known-stale). Where docs and code disagree, code wins (the audit's founding rule).
- **Rule AI-3:** AI-generated financial or security logic MUST NOT be merged without the human review gates of Sections 8.11 and 19, and MUST reuse the shared math/validators (never re-implement, AP-1/AP-11) — duplication is exactly how prior AI contributions drifted.
- **Rule AI-4:** An AI model MUST NOT introduce a new dependency, collection, or architectural pattern without an amendment (Appendix B). Additive features within existing patterns are permitted.
- **Rule AI-5:** AI contributions MUST update this constitution when they change a governed fact (the Amendment Protocol applies to models too).

## 22.3 AI as a product feature — the boundaries

When product-AI is built, it MUST respect the platform's integrity model:

- **Rule AI-6:** AI features MUST use the latest sanctioned Claude models via the Anthropic API as the default provider; model ids and integration follow the API reference, not memory.
- **Rule AI-7 (advisory, not authoritative):** An LLM MAY *suggest* (draft a bill narrative, summarize a ledger, flag an anomaly, answer a question about data the user may see) but MUST NOT *perform* a financially-material transition autonomously. Every money/state change still goes through the human approval engine (Section 12) and the authoritative boundary (Section 8). AI is never an approver.
- **Rule AI-8 (scope-respecting):** AI features MUST operate within the requesting user's company scope and role (Section 23) — an LLM MUST NOT read or surface data the user cannot see. Prompts and retrieval MUST be scoped server-side.
- **Rule AI-9 (auditable):** AI-assisted actions MUST be audited as AI-assisted (actor + "via AI assist"), so the trail distinguishes human from machine-suggested actions.
- **Rule AI-10 (no secrets to the model):** No credential, no other tenant's data, and no PII beyond what the user is entitled to MAY enter a prompt.

## 22.4 Sanctioned product-AI use cases (illustrative, all advisory)

Anomaly flagging on ledgers, natural-language search over scoped data, draft-generation for bill/WO narratives, approval-queue summarization, recovery-risk explanation. Each is a reactor/assistant on top of existing data; none is a new authoritative path.

## 22.5 Continuity Contract for Section 22
Contributor-AI rules formalize the discipline this very audit-and-constitution process embodies. Product-AI is greenfield and is fenced to *advisory* roles that respect the existing approval, scope, and audit systems. No AI capability may become an authoritative financial actor.

---
---

# SECTION 23 — MULTI-COMPANY ARCHITECTURE

## 23.1 The current reality

Multi-company already runs: `Company` with `CompanyCode` (SIPL/SHSPL) and `BusinessType` (CONSTRUCTION/HOSPITALITY); users carry `assignedCompanyIds`; scope resolves via [`getEffectiveCompanyScope`](../src/lib/userAccess.ts); ADMIN/CEO/SUPER_ADMIN are unrestricted; scoping is applied client-side across WorkOrders, Bills, Payments, Sales, dashboards. This is a genuine multi-company foundation — but scoping is **client-side after a full read**, and `companyId` is **optional or absent** on several financial collections (AUDIT: ARCHITECTURE §5).

## 23.2 The doctrine: company is a first-class, boundary-enforced dimension

- **Rule MC-1:** Every company-owned document MUST carry a non-optional `companyId`. Today it is optional on WO/Project and absent on Bill/Payment/Adjustment — these MUST be backfilled (AP-10 migration) and made required. Without this, per-company books (Section 10) are impossible.
- **Rule MC-2:** Company scoping MUST become **boundary-enforced**, not just client-filtered — rules/functions MUST restrict a scoped user's reads/writes to their `assignedCompanyIds`. Client-side filtering of a full download is a data-exposure hole (a scoped ACCOUNTS user currently downloads all companies' data, AUDIT: SECURITY M-4 / PERFORMANCE §1). This pairs with the scoped-query performance work (PERF-3).
- **Rule MC-3:** The unrestricted roles (ADMIN/CEO/SUPER_ADMIN) are a deliberate exception and MUST stay explicit in `userAccess.ts`; no other role may see cross-company data.

## 23.3 Books, numbering, and config per company

- **Rule MC-4:** Financial derivation and (future) posting MUST be segmentable by company — a trial balance is *per company*. This requires MC-1.
- **Rule MC-5:** Number series (WO#, and future bill/payment series) SHOULD be per-company where the business requires distinct sequences; the `numberSeries` singleton pattern extends to per-company docs without redesign.
- **Rule MC-6:** Company-level configuration (labels, terms, approval thresholds, vertical type) lives in the `companies` document and the vertical-config registry (Section 24), consumed by one engine (AP-12).

## 23.4 Tenancy model

DSBC is **multi-company within one tenant** today (one Firebase project, companies as documents). **Rule MC-7:** if true multi-*tenant* isolation is ever required (separate customers' data fully partitioned), it is an **amendment-level** decision — the current model scales to many companies under shared ownership, which is the near-term need. Do not conflate multi-company (built) with multi-tenant (future, unbuilt).

## 23.5 Continuity Contract for Section 23
`companies`, `assignedCompanyIds`, and `userAccess.ts` are **the foundation**, ratified. The mandate: make `companyId` required on financial collections, move scoping to the boundary, and enable per-company books. Every step strengthens the existing multi-company model; none rebuilds it.

---
---

# SECTION 24 — FUTURE INDUSTRY VERTICALS

## 24.1 The seam already exists

`BusinessType` (CONSTRUCTION/HOSPITALITY) and the per-type label maps in [`companyLabels.ts`](../src/lib/companyLabels.ts) (Plot/Singlex/Duplex vs hospitality terms) prove the platform was designed for verticals from the start. The Sales module strips ownership fields for HOSPITALITY companies ([`subLocationService.ts`](../src/services/subLocationService.ts)). This is the seam to formalize — **not invent**.

## 24.2 The doctrine: a vertical is a config pack over one engine

- **Rule VERT-1:** A new vertical MUST be expressed as configuration consumed by the existing engines — labels, enabled modules, status-machine variants, approval thresholds, chart-of-accounts template, validation rules — never as a forked code path per industry (AP-12).
- **Rule VERT-2:** Vertical config MUST live in a declared registry (extend `companyLabels.ts` into `src/lib/verticals/`), keyed by `BusinessType`, and MUST be the single source every engine consults for vertical-variable behavior.

## 24.3 The vertical config surface

A vertical config declares:
1. **Terminology** — entity/label maps (already modelled).
2. **Enabled modules** — which of Projects/WorkOrders/Sales/Procurement/etc. are active.
3. **State-machine variants** — vertical-specific statuses or transitions (declared per Section 11's transition-table format).
4. **Financial templates** — chart of accounts, tax rules, retention/TDS applicability (Section 10 seeds per vertical).
5. **Approval routing** — thresholds and chains (Section 12, APP-6).
6. **Validation rules** — vertical-specific field requirements.

## 24.4 Candidate verticals (illustrative)

Construction (present), Real-estate/Colonizer sales (present via Sales), Hospitality (partially modelled), Infrastructure contracting, Facility management, Manufacturing procurement. Each MUST be a config pack; the first non-trivial new vertical will prove the registry design and MUST NOT be allowed to fork the engine.

## 24.5 The anti-fork rule

**Rule VERT-3:** `if (company.businessType === 'X')` branches scattered through feature code are prohibited beyond the config-lookup layer. If a vertical needs different behavior, that behavior is *data in the registry*, and the engine reads it. The existing HOSPITALITY-strip logic SHOULD migrate into the registry as it grows, so business logic never hardcodes an industry.

## 24.6 Continuity Contract for Section 24
The `BusinessType`/`companyLabels` seam is **the seed**; the section formalizes it into a config registry and forbids per-vertical forks. This is continuation of an existing design intent, not a new subsystem imposed from outside.

---
---

# SECTION 25 — NON-NEGOTIABLE ENGINEERING RULES

These are the constitution's hard constraints — the subset of all `MUST`/`MUST NOT` rules that, if violated, mean the change is wrong regardless of anything else. A PR violating any of these fails review by definition. They are consolidated here for quick reference; each links to its section for rationale.

## 25.1 Trust & enforcement
- **NN-1** No security or financial guarantee may depend on client code or undeployed server code. If `firestore.rules` + deployed functions don't enforce it, it isn't enforced. (§8, AP-6)
- **NN-2** No production code path may perform a financially-material state transition without the authoritative transactional check. The silent client-fallback for release/approve is prohibited in production. (§6 BE-2, §8)
- **NN-3** Every financially-material transition runs through a deployed, transactional, audited function; approve ≠ initiate (separation of duties). (§12 APP-1/APP-3)

## 25.2 Money correctness
- **NN-4** Each money formula (WO financials, bill totals, overbilling ceiling, outflow) has exactly ONE implementation in `src/lib/`, imported everywhere. No re-implementation. (§9 FIN-1/FIN-2/FIN-3)
- **NN-5** Every mutation of a monetary total is atomic (`runTransaction`/`increment`). Read-then-write on money is forbidden. (§9, AP-5)
- **NN-6** Journal entries (once posting exists) always balance and are immutable; financial records of record are reversed, never mutated or hard-deleted. (§10 POST-2/POST-3, §7 FS-7)
- **NN-7** The platform MUST NOT claim double-entry accounting until the posting engine ships and reconciles against derived ledgers. (§10 POST-7, §1.3)

## 25.3 Data & boundary
- **NN-8** All Firestore access goes through the owning service; no raw Firestore queries in pages/components. (§4 AP-4)
- **NN-9** Every status-transition rule branch scopes its writable fields with `onlyFieldsChanged`. (§7 FS-3)
- **NN-10** Every company-owned financial document carries a required `companyId`; scoping is boundary-enforced. (§23 MC-1/MC-2)
- **NN-11** `src/lib/` never imports React or Firebase (so it is shareable with functions). (§4, §18 COD-4)

## 25.4 Integrity of record
- **NN-12** `auditLogs` create validates `userId == auth.uid`; entries are immutable; every transition emits an audit entry. (§14 AUD-1/AUD-3, §8 SEC-6)
- **NN-13** Every workflow transition provides all six guarantees: precondition-in-transaction, field-scope, audit, event, posting-if-material, typed result. (§11 WF-3)

## 25.5 Errors & validation
- **NN-14** Business rejections are `BusinessRuleError` with a precise code; no silent failure; no leaked internal error messages to clients. (§17 ERR-1/ERR-4/ERR-5)
- **NN-15** A rule expressed at multiple layers calls one shared pure validator; no duplicated validation logic. (§16 VAL-1, AP-11)

## 25.6 Quality gates
- **NN-16** Every new pure function ships with tests; every rules change ships with rules-unit-tests proving allow AND deny; CI blocks merge on `tsc` + ESLint + tests. (§19 TEST-2/TEST-3/TEST-7)
- **NN-17** No dead code, no handler-less controls, no magic values, no `console.log` in committed code. (§18 COD-5/COD-6, §5 FE-8)
- **NN-18** Every route is wrapped in `ProtectedRoute` + `ErrorBoundary`; every destructive action is confirmed. (§5 FE-1/FE-7)

## 25.7 Process & evolution
- **NN-19** Continue from the current implementation. No rewrite, no redesign, no re-platforming without an amendment. Strengthen existing seams. (Prime directive)
- **NN-20** New dependencies, collections, or architectural patterns require an amendment (Appendix B). AI and human contributors alike are bound. (§22 AI-4, Appendix B)
- **NN-21** Verify against source, not documentation; where docs and code disagree, code wins and the doc is corrected. (§22 AI-2, Amendment Protocol)
- **NN-22** This constitution is corrected whenever code changes a governed fact; stale governance is a defect. (Appendix B)

---
---

# APPENDIX A — CANONICAL GLOSSARY

- **Authoritative path** — the deployed, transactional, boundary-level enforcement of an invariant (rules + functions). The only place a guarantee is real.
- **Boundary** — `firestore.rules` + deployed Cloud Functions; the production trust perimeter.
- **Derived reporting (Tier 2)** — ledgers/KPIs computed on read from operational documents; DSBC's present financial model.
- **Posting engine (Tier 3)** — the future immutable double-entry journal, fed by transitions, reconciled against Tier 2.
- **Operational document (Tier 1)** — the user-created records (bills, payments, sales…) that are the source of truth.
- **Transition** — a named, guarded move of an entity from one status to another, with six mandatory guarantees (WF-3).
- **Reactor** — a function subscribed to a domain event that performs an eventually-consistent side effect.
- **Company scope** — the set of `assignedCompanyIds` a user may see/touch; unrestricted for ADMIN/CEO/SUPER_ADMIN.
- **Vertical** — an industry configuration (config pack) over the one engine; never a fork.
- **Client-fallback** — the current, prohibited-in-production mechanism by which the client performs privileged writes when the server is absent.
- **Derive-on-read** — the principle that reports come from operational documents, not cached rollups.

---

# APPENDIX B — THE AMENDMENT PROTOCOL

This constitution is living but not casually mutable.

1. **Code wins over this document.** If verified source contradicts a statement here, the code is correct and this document MUST be corrected in the same or an immediately-following PR (NN-21/NN-22). A stale constitution is a defect.
2. **Amendments are explicit.** Changing a `MUST`/`MUST NOT`, adding a dependency/collection/pattern, or altering an architectural principle requires an **Architecture Decision Record** in `governance/` (dated, rationale, superseded rule) and review by the maintainer acting as Chief Architect.
3. **Additive change is not amendment.** Building a new feature *within* existing patterns (a new service following the template, a new calc with tests, a new page with the composition contract) is normal work and needs no amendment — only conformance.
4. **The prime directive is entrenched.** NN-19 (no rewrite/redesign) may itself be amended only by an ADR that names the specific seam being replaced and why strengthening was insufficient. The bar is deliberately high.
5. **Every amendment updates Section 25** if it touches a non-negotiable, and updates the affected section's Continuity Contract.

**Ratification:** This document, version 1.0, is the engineering constitution of the DSBC ERP Platform as of 2026-07-07, anchored to codebase v0.9.0 and the forensic audit in [`/audit`](../audit/README.md). It governs all future work until amended.

*End of constitution.*
