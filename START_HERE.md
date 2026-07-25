# START HERE — DSBC Civil Developer Onboarding

Welcome to DSBC Civil, the Enterprise Construction ERP Platform. This document is your **guided reading order**. Follow it in sequence; do not skip ahead to code before you have read the constitution's relevant section. This platform is governed — architectural change proceeds through documented decisions, not ad hoc edits.

> **Estimated onboarding time: ~1 working day (6–8 hours) to productive; ~2–3 days to confident.** The breakdown per step is noted below.

---

## Why this order matters

Several AI models and developers built DSBC Civil over months, and its *documentation once drifted from its code*. That is now corrected: the code is the ground truth, and the `governance/` directory is the authoritative account of how the platform is built and how it must evolve. Reading in the order below means you inherit **verified reality**, not stale assumptions.

---

## The reading order

### 1 — The Architecture Constitution *(~2 hours)*
Read [`governance/ERP_ARCHITECTURE_BIBLE.md`](./governance/ERP_ARCHITECTURE_BIBLE.md).

This is the supreme engineering reference: 25 Sections covering vision, architecture principles, frontend/backend/Firestore/security, the financial and posting model, workflow/approval/event/audit systems, and coding/testing/deployment standards. **You do not need to memorize it, but you must read Sections 1–4 and 25 (Non-Negotiables) fully**, and skim the rest so you know where to return. Pay special attention to:
- The prime directive: *continue from the current implementation; strengthen, do not rewrite.*
- The trust-boundary insight (§8): in production, `firestore.rules` + deployed functions are the only real enforcement.
- Non-Negotiables NN-1…NN-30 (§25) — the rules that fail a change by definition.

### 2 — Constitutional Amendment No. 1 *(~30 minutes)*
Read [`governance/amendments/AMENDMENT-001.md`](./governance/amendments/AMENDMENT-001.md).

This ratifies the constitution as v1.0, enacts NN-23…NN-30, and — most important for your daily work — defines the **governance hierarchy** (Article IV), **when an ADR is mandatory** (Article VII), and the **merge/release gates** (Article VIII). If you only remember one thing: *governed changes need an ADR; every PR passes the merge gate.*

### 3 — Project State *(~2 hours)*
Read the forensic audit, starting at [`audit/README.md`](./audit/README.md), then:
- [`audit/EXECUTIVE_SUMMARY.md`](./audit/EXECUTIVE_SUMMARY.md) — health, maturity, top risks.
- [`audit/MODULE_AUDIT.md`](./audit/MODULE_AUDIT.md) — every module's status and completion %.
- [`audit/ARCHITECTURE_REVIEW.md`](./audit/ARCHITECTURE_REVIEW.md) — how it's actually built, and the accounting verdict.
- Skim [`audit/TECHNICAL_DEBT.md`](./audit/TECHNICAL_DEBT.md), [`audit/SECURITY_AUDIT.md`](./audit/SECURITY_AUDIT.md), [`audit/PERFORMANCE_AUDIT.md`](./audit/PERFORMANCE_AUDIT.md).

This tells you *what is real, what is partial, and what is planned-only* — verified from source. Trust it over any older document.

### 4 — Current Sprint *(~20 minutes)*
Read [`CURRENT_SPRINT.md`](./CURRENT_SPRINT.md) and [`ENGINEERING_PHASE_2.md`](./ENGINEERING_PHASE_2.md).

This is what the team is doing *right now* (Platform Stabilization v1.1) and the ordered engineering roadmap. Your first task will come from here.

### 5 — Relevant ADRs *(~30 minutes, ongoing)*
Browse [`governance/adr/`](./governance/adr/), starting with [`governance/adr/ADR-TEMPLATE.md`](./governance/adr/ADR-TEMPLATE.md).

ADRs are the reasoned decision history. Before you touch an area, read its ADRs. Before you make a governed change (Amendment Article VII), you write one.

### 6 — Engineering Standards *(~1 hour)*
Read the standards that gate your work:
- [`governance/CHECKLISTS.md`](./governance/CHECKLISTS.md) — Definition of Done, PR/security/financial/performance/module/release/AI checklists. **You will use these on every change.**
- [`governance/DATA_LIFECYCLE.md`](./governance/DATA_LIFECYCLE.md) — each entity's states, retention, and deletion policy.
- [`governance/RELIABILITY.md`](./governance/RELIABILITY.md) and [`governance/COMPLIANCE.md`](./governance/COMPLIANCE.md) — for ops- and data-touching work.
- Constitution §18 (Coding) and §19 (Testing) — the how of writing DSBC Civil code.

---

## Set up your environment *(~1 hour, do in parallel with reading)*

```bash
npm install
cp .env.example .env.local     # fill VITE_FIREBASE_* values (ask the team lead)
npm run dev                    # Express + Vite dev server (local secure API included)
npm test                       # vitest run — confirm 199 tests pass
npm run lint                   # tsc --noEmit
```

Read the code in this order to match the layers: [`src/types.ts`](./src/types.ts) (the domain) → a service in [`src/services/`](./src/services/) → its pure calc in [`src/lib/`](./src/lib/) → its page in [`src/pages/`](./src/pages/) → its rules block in [`firestore.rules`](./firestore.rules). The Bill lifecycle is the best worked example to trace end-to-end.

---

## The five rules you must internalize on day one

1. **Continue, don't rewrite.** Strengthen existing seams. (NN-19)
2. **The boundary is the only trust.** Client/service validation is convenience; `firestore.rules` + deployed functions are enforcement. (NN-1)
3. **Money moves only in transactions, idempotently, with one shared formula.** (NN-4, NN-5, NN-23)
4. **Governed changes need an ADR; every PR passes the merge gate.** (NN-25, NN-28)
5. **Verify against source, not docs. If they disagree, code wins and the doc is fixed.** (NN-21)

---

## Where to get help

- **What is true about the platform?** → `audit/`
- **What must always be true?** → the Constitution (`governance/ERP_ARCHITECTURE_BIBLE.md`)
- **Why was this decided?** → `governance/adr/`
- **How do I ship it correctly?** → `governance/CHECKLISTS.md`
- **What am I working on?** → `CURRENT_SPRINT.md`

Welcome aboard. Read, then strengthen.
