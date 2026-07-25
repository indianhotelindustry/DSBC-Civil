# ARCHITECTURE REVIEW — DSBC Civil (formerly SIPL Work Orders)

Source-verified assessment of the current architecture, its strengths, weaknesses, and a recommended evolution path that **continues from the present code — no rewrite**.

---

## 1. Current architecture (as built)

### Topology
```
Browser (React 19 SPA, Vite build)
   │
   │  Firebase Auth (Google / email / dev-anon)
   │  ── ID token ──►  [Express /api/secure/*]  ◄── EXISTS IN CODE, NOT DEPLOYED
   │                        (verify/approve/release/VO-approve; node-cron jobs)
   │
   └── Firestore SDK (direct reads + writes) ──►  Cloud Firestore
                                                     ▲
                                     firestore.rules │ (the real production boundary)
```

- **Frontend:** React 19 + TypeScript + Vite + Tailwind v4 + shadcn/Base-UI + react-router v7. 28 pages, 15 routes, role-gated via `ProtectedRoute`. State is local + Firestore real-time subscriptions; no global store.
- **Service layer:** 30 hand-written services in `src/services/` wrapping Firestore, each owning a collection. Business rules live here (client-side).
- **Secure layer:** `src/services/secureApi.ts` tries an Express server for 4 privileged operations, **falling back to direct client writes** when the server is absent (i.e. always, in production).
- **Backend:** `server.ts` + `server/*` — Express with Firebase Admin SDK, ID-token verification, role checks from the user doc, rate limiting, Firestore transactions, server audit logging, and node-cron jobs. Runs only under `npm run dev`.
- **Database:** Firestore, ~28 collections, governed by a 614-line `firestore.rules` with per-collection role + status-transition + field-diff enforcement.
- **Deploy target:** Firebase Hosting (static `dist/`) + Firestore rules. That's the entire production surface.

### The defining architectural fact
There are **two enforcement layers designed but only one deployed.** The intended design is "client convenience + server authority." The deployed reality is "client authority + rules backstop." `secureApi.ts` bridges them by silently degrading. Every architectural strength and weakness below flows from this split.

---

## 2. Strengths

1. **Clean domain modelling.** `src/types.ts` is a single, well-organized source of truth: explicit status enums, 22 typed `BusinessRuleError` codes, documented `@deprecated` fields, embedded value objects (BOQ, financials). New developers can learn the domain from this one file.
2. **Derive-on-read financial philosophy.** The code deliberately avoids trusting cached rollups (`wo.billing.*` deprecated) and recomputes ledgers/KPIs from operational documents ([financialCalcs.ts:45-48](../src/lib/financialCalcs.ts#L45)). This eliminates a whole class of stale-cache bugs — a mature choice, at a compute cost that's currently cheap.
3. **Pure, tested calculation core.** `src/lib/*Calcs.ts` are pure functions with injectable clocks, covered by 194 passing tests. The schedule engine and access-control matrix are genuinely well-tested.
4. **Consistent service pattern.** Every collection has a predictable CRUD+subscribe service; error handling and audit logging are centralized in `db.ts`. Easy to extend.
5. **Sophisticated authorization intent.** `firestore.rules` encodes real state-machines with field-level diff guards; the `paymentRequests` block is a model for the rest. `ProtectedRoute` mirrors this on the UI.
6. **Correct concurrency where identity matters.** WO number reservation is transactional.
7. **Deliberate, consistent UX.** Responsive layout, print views, error boundaries, skeletons, toasts — the front-end is cohesive, not stitched together.

---

## 3. Weaknesses

1. **Enforcement/deployment mismatch (root weakness).** The authoritative layer isn't in the production path; the fallback is weaker than the primary and skippable by a direct SDK call. Financial invariants that span documents are unenforced in production (SECURITY C-1/C-2/C-3).
2. **Business rules duplicated across 2-3 layers, and they've drifted.** Verify/approve/release/VO-approve logic exists in the server, the client fallback, and (dead) service methods. The copies disagree — most dangerously the overbilling ceiling (gross vs net) and the VO financial formula (TECHNICAL_DEBT D-1, D-2). Duplication without a single source of truth is the core structural debt.
3. **Two parallel payment subsystems.** Bills→Payments (legacy) and WO→PaymentRequests coexist with different ceilings and no shared outflow accounting. Conceptual overlap that confuses the money model.
4. **No shared client data layer.** Each component subscribes independently; ~10 concurrent full-collection listeners on the dashboard, no cache, no pagination (PERFORMANCE §1-2). Linear scale ceiling.
5. **Read-then-write concurrency throughout.** Money totals, uniqueness checks, and ceilings are non-atomic outside the one WO-number transaction (TECHNICAL_DEBT D-6).
6. **Accounting is reporting, not bookkeeping** (see §5).
7. **Referential integrity is partial.** Delete guards exist for some parent-child links and are missing for others (sales↔units, sales↔customers, WO↔paymentRequests).
8. **Documentation actively misleads.** README is unrelated boilerplate; blueprint is two generations stale. A newcomer trusting the docs would build the wrong mental model — which is precisely why this forensic report exists.

---

## 4. The "two payment systems" problem (worth isolating)

- **Bills → Payments** (`billService`, `paymentService`, Payments.tsx): bill-centric; DRAFT→VERIFIED→APPROVED→PAID with a separate payment PENDING→APPROVED→RELEASED cycle. Ceiling = gross BOQ (create) / net grandTotal (approve).
- **Work Order → PaymentRequests** (`paymentRequestService`, PaymentRequests.tsx): WO-centric; PENDING_APPROVAL→APPROVED→PAID; forced advance amounts; cross-module ceiling that *does* count released bill-payments.

They are not integrated: the Bills path does not count PAID payment requests, so the two channels can jointly over-commit a work order. This is both a correctness risk (TECHNICAL_DEBT D-1) and an architectural smell. **Recommendation:** pick one canonical contractor-outflow ledger; route both UIs through a single `recordOutflow()`/ceiling function; deprecate the redundant path over time.

---

## 5. Accounting architecture: Derived Reporting, not Real Accounting

**Verdict (definitive, source-verified):** This system does **derived reporting**, not double-entry bookkeeping.

**Evidence:**
- Repo-wide search for `voucher|journal|doubleEntry|chartOfAccounts|trialBalance|cashbook|bankbook|generalLedger|postingEngine` yields only two cosmetic hits (a blueprint description and a KPI card subtitle). No such code exists.
- `LedgerEntry` (the only type with `debit`/`credit`/`balance`) is a transient view-model materialized on render by `calculateLedger` ([ledgerUtils.ts:5-101](../src/lib/ledgerUtils.ts#L5)) and `buildTransactionStream` ([customerLedgerCalcs.ts:161](../src/lib/customerLedgerCalcs.ts#L161)). It is never persisted.
- Persisted collections are purely operational (workOrders, bills, payments, sales, receipts…). There is no `accounts`, `journalEntries`, or period document.
- The closest artifact — `adjustments` with `DEBIT`/`CREDIT` — is a single-sided memo with no balancing entry and **no UI to create one** (TECHNICAL_DEBT D-5).

**What this means for the business:**
- Ledgers and dashboards are correct *views* but there is no immutable posted record, no trial balance, no cash/bank book, no period close. The system cannot today produce auditable statutory financials.
- Retention, TDS, and GST are arithmetic deductions, not tracked liabilities (TECHNICAL_DEBT D-4).
- Company-partitioned books are impossible: `companyId` is optional on WO/Project and absent on Bill/Payment/Adjustment.

**Gap list for trial-balance readiness** (not an implementation plan — see roadmap R5):
1. Chart of accounts entity + account dimension on transactions.
2. Persisted, immutable, balanced journal/voucher documents referencing source docs.
3. A posting engine triggered by the existing state machine (bill approved → Dr WIP/expense, Cr payable + retention + TDS; payment released → Dr payable, Cr bank; receipt → Dr bank, Cr customer; sale → Dr customer, Cr revenue).
4. Liability tracking + release for retention/TDS.
5. Reversal semantics instead of hard deletes.
6. Opening balances, financial-year, period close.
7. Company segmentation of the books.

**Strategic choice the business must make:** either (a) keep derived reporting and *market it honestly* as MIS/reporting, not accounting; or (b) build the posting engine (R5). Do not claim "ERP accounting with vouchers/double-entry" until (b) ships — the words appear in the blueprint but not the code.

---

## 6. Recommended evolution (no rewrite)

The current architecture is a sound foundation. Evolve it in place:

1. **Collapse enforcement to one authoritative path.** Move the 4 secure operations to Firebase Cloud Functions (callable) — the plan already exists. Make `secureApi.ts` call the function and **remove the silent client fallback** (or keep it only for local dev behind an explicit flag). Now "server authority" is real in production.
2. **Single source of truth for business math.** Extract `computeWorkOrderFinancials()`, one `outflowCeiling()`, and `recalculateBillTotals()` into shared pure modules imported by UI, functions, and tests. Kills D-1/D-2 drift permanently.
3. **Move roles to custom claims** set by an admin-only function; rules and functions read the claim. Removes rule `get()` cost and the forgeable-role surface.
4. **Introduce a shared client data layer** (React Query or equivalent) with company-scoped, paginated queries + committed composite indexes. Removes the listener explosion and the scale ceiling.
5. **Make money mutations transactional** (functions already do; ensure receipts/schedules use `increment()`/transactions).
6. **Decide the accounting strategy** (§5) and, if building it, add the posting engine as a Firestore-trigger function that writes immutable journal entries on state transitions — bolts onto the existing state machine without disturbing the operational model.
7. **Consolidate the two payment paths** behind one outflow function.
8. **Replace the misleading docs** with a generated architecture doc (this audit set can seed it).

Each step is additive and independently shippable. None requires rebuilding the domain model, the UI, or the rules — they are refinements of a coherent existing design.

---

## 7. One-paragraph architectural summary for a new architect

You are inheriting a real, coherent Firebase SPA ERP with strong domain types, a well-tested pure-calculation core, and unusually thorough Firestore rules — built by several hands over months, so watch for drift. The single thing to internalize: **in production there is no server in the request path; Firestore rules are the whole security and integrity boundary, and they cannot enforce cross-document financial sums.** An Express "secure" backend exists in the repo but is never deployed, and the client silently falls back to weaker direct writes. Your first architectural move is to make one enforcement path authoritative (deploy it as Cloud Functions, delete the fallback), unify the duplicated/drifted business math into shared modules, and decide whether "accounting" means the current derived reporting or a real posting engine you will build. Everything else — pagination, custom claims, payment-path consolidation, the procurement/inventory build-out — is normal forward work on a solid base.
