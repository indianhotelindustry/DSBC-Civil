# PERFORMANCE AUDIT — DSBC Civil (formerly SIPL Work Orders)

Source-verified. Runtime profiling was not performed; findings are structural. The dominant theme: **the app reads whole collections in real time and filters on the client, with no pagination anywhere.** This is fine at hundreds of documents and degrades linearly toward tens of thousands.

---

## 1. Full-collection real-time reads, zero pagination (primary scale ceiling)

**Evidence:** The core primitive `subscribeToCollection` ([db.ts:134-146](../src/services/db.ts#L134)) issues `query(collection(db, name), ...queries)` with `queries` defaulting to `[]`. Almost every `service.getAll()` passes no constraints → full-collection `onSnapshot` with no `limit()`, no server-side `orderBy`, no cursor. Grep for `limit(` in db.ts: none. Multi-company "scoping" is applied **client-side after the full read** on WorkOrders, Bills, Payments, PaymentRequests, Sales, Recovery, and AccountsDashboard.

**Impact:**
- Firestore is billed per document read; a full-collection listener re-downloads on every change and bills for every document. Cost and latency grow linearly with collection size.
- The scoped ACCOUNTS/PM user still downloads *all* companies' data, then hides most of it — a data-exposure concern (SECURITY M-4) as well as a cost one.
- Initial dashboard payload = sum of many entire collections.

**Only 3 scoped subscriptions exist**, all on SaleDetail (`subscribeById`, `subscribeBySale` ×2, [SaleDetail.tsx:85-87](../src/pages/SaleDetail.tsx#L85)). Two pages bypass the service layer to read **all** receipts directly ([CustomerLedger.tsx:491-500](../src/pages/CustomerLedger.tsx#L491), [RecoveryDashboard.tsx:43-48](../src/pages/RecoveryDashboard.tsx#L43)).

**Recommendation:** Introduce query constraints (`where` company scoping server-side, `orderBy` + `limit` + cursor pagination) for the high-cardinality collections (bills, payments, sales, saleReceipts, subLocations, auditLogs). Requires composite indexes (see §5).

---

## 2. Duplicate / concurrent subscriptions

**Evidence:**
- Admin/CEO landing on `/`: [Dashboard.tsx:70-104](../src/pages/Dashboard.tsx#L70) subscribes to projects, workOrders, bills, contractors, payments, variationOrders, companies, dailySummaries; [CEODashboard.tsx:93-96](../src/components/dashboards/CEODashboard.tsx#L93) *additionally* subscribes paymentRequests; `AlertBell` (mounted in Layout on every page) subscribes alerts → **~10 concurrent full-collection listeners on one screen**.
- ACCOUNTS landing: same Dashboard set + [AccountsDashboard.tsx:179-182](../src/components/dashboards/AccountsDashboard.tsx#L179) subscribes paymentRequests again.
- No shared cache/store: `workOrderService.getAll` is independently subscribed by 8 pages, `projectService.getAll` by 9, `companyService.getAll` by 10. Every navigation tears down and re-subscribes from scratch.

**Impact:** Redundant reads, redundant listener overhead, no cross-component data reuse.

**Recommendation:** Introduce a lightweight shared data layer (React Query, Zustand, or a context of memoized subscriptions) so each collection has one live listener shared across components. This alone would cut the dashboard's listener count by more than half.

---

## 3. Memory leak

**Evidence:** [CustomerLedger.tsx:78](../src/pages/CustomerLedger.tsx#L78) — `customerService.getAll(...)`'s returned unsubscribe is discarded; cleanup ([:87](../src/pages/CustomerLedger.tsx#L87)) only tears down `u2..u6`. The effect keys on `[id]`, so each visit to a different customer ledger leaks another full-collection `customers` listener that lives until page reload.
**Everything else is clean** — all other `useEffect`s return their unsubscribers (verified across ~25 files).
**Recommendation:** Capture and return the unsubscribe (one-line fix, TECHNICAL_DEBT G-2).

---

## 4. In-memory scans over full collections (N+1-like patterns)

Not classic N+1 (no per-row round-trips), but repeated full-collection fetches followed by in-memory filtering in the service layer:
- `getActivePaymentsForWO` fetches the **entire** `payments` collection then filters ([workOrderService.ts:33-34](../src/services/workOrderService.ts#L33)).
- `billPaymentsForWO` fetches **all** payments ([paymentRequestService.ts:118](../src/services/paymentRequestService.ts#L118)).
- `findUsersByEmail` reads all users, filters in memory ([userService.ts:283-287](../src/services/userService.ts#L283)).
- All `assert*Unique` guards (customers, subLocations, work categories, 6 masters, users) read the whole collection to check one value.

**Recommendation:** Replace with targeted `where(...)` queries (e.g. `where('billId','==',id)`, `where('email','==',x)`), which also removes many read-then-write race windows (TECHNICAL_DEBT D-6).

---

## 5. Missing indexes / query configuration

**Evidence:** No `firestore.indexes.json` exists and `firebase.json` has no `indexes` key. Composite queries — e.g. the three-clause `where` in [backgroundJobs.ts:20-25](../server/backgroundJobs.ts#L20) and `status in [...]` filters — will require composite indexes created manually in the console, undocumented. Any future move to server-side scoped/paginated queries (§1) will need indexes committed to source.
**Recommendation:** Add `firestore.indexes.json`, deploy with rules, and document required indexes.

---

## 6. Large components / render cost

Oversized files that re-render large trees on every subscription tick (line counts): SubLocations 1259, SaleDetail 1000, AdminUsers 893, WorkOrderForm 889, AccountsDashboard 761, Bills 683, PaymentRequests 595, WorkOrders 530, CEODashboard 514, Sales 502, CustomerLedger 500. Client-side filtering/derivation runs inside `useMemo` in most (good), but the derivations recompute over full collections on each snapshot.
**Recommendation:** Split the largest pages; ensure heavy derivations are memoized on stable inputs; virtualize long tables (none are virtualized today).

---

## 7. Rules-evaluation cost

Every `hasRole()` in `firestore.rules` performs a `get(/users/$(uid))` ([:17-23](../firestore.rules#L17)), and many rules call it multiple times per evaluation. On write-heavy screens this multiplies billed reads and adds latency. Moving roles to custom claims (SECURITY M-1) would eliminate these `get()`s entirely.

---

## 8. What's already efficient
- Derive-on-read financial model avoids stale-cache bugs (a correctness win, at a compute cost that's currently cheap).
- `useMemo` used consistently for scoping/derivation.
- Injectable `now`/`today` in calc modules (deterministic, testable).
- WO number reservation uses a transaction (correct, not a perf issue).
- Print views are pure renders.
- Mobile layout uses CSS, not JS, for responsiveness.

---

## Prioritized optimization roadmap
| Priority | Action | Effort | Payoff |
|---|---|---|---|
| 1 | Fix CustomerLedger listener leak | S | Stops unbounded listener growth |
| 2 | Shared subscription layer (dedupe the ~10 dashboard listeners) | M | Large read-cost + latency cut |
| 3 | Replace full-collection in-memory scans with `where` queries | M | Cost + removes race windows |
| 4 | Server-side company scoping + pagination on high-cardinality collections | L | The real scale unlock; needs indexes |
| 5 | Add `firestore.indexes.json` | S | Prerequisite for #3/#4 |
| 6 | Move roles to custom claims (removes rule `get()`s) | M | Per-operation read savings |
| 7 | Split/virtualize the largest pages/tables | M | Render smoothness at scale |

**Net:** No urgent runtime hazard at current (small) data volumes beyond the one listener leak. The architecture, however, has a hard linear scale ceiling; items 2-5 should land before onboarding data-heavy tenants.
