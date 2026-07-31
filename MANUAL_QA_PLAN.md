# MANUAL QA PLAN — DSBC Civil v1.0.0-beta.2

**Date:** 2026-07-30 · **Candidate:** `release/1.0.0-beta.2`
**Purpose:** the application-validation plan for the QA phase — what to test, in what order,
how to report defects, and where each confirmed bug's regression test must live.

---

## ⚠️ 0. QA cannot start yet — one blocker, and it is not optional

**Manual end-to-end testing is impossible in the current environment.** Stated plainly per
NN-7 rather than producing a plan that cannot be executed:

1. **No Firebase project exists.** `.firebaserc` is `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`
   and the 7 `VITE_FIREBASE_*` values are unset, so the app cannot reach Auth or Firestore.
   Sign-in — the entry point to every workflow below — cannot happen.
2. **Emulator mode is half-wired, and setting the flag makes things worse.** *(Corrected
   2026-07-31 — an earlier version of this section said "not wired", which was inaccurate.)*
   `connectAuthEmulator` **does** exist (`src/services/auth.ts:18-20`), but there is **no**
   `connectFirestoreEmulator` anywhere in `src/`, and `firebase.json` declares only the
   *firestore* emulator — nothing ever listens on 9099. Setting
   `VITE_USE_FIREBASE_EMULATOR=true` therefore either fails to connect, or authenticates you
   as an emulator user whose uid is absent from the **real** Firestore `users` collection,
   which denies every role-gated operation. So "just run it against the emulators" is not
   available. See `RUNTIME_READINESS_CHECKLIST.md` §7.1.

### Two ways to unblock — the choice is the owner's

| Path | What it takes | Trade-off |
|---|---|---|
| **A — Provision Firebase staging** *(recommended)* | Owner creates `dsbc-civil-staging`, sets `.firebaserc` + `.env.local`, deploys rules → indexes → functions → hosting | Tests the **real** stack, including the Cloud Functions path and the deployed rules. This is the only way to validate C-1 closure. Follows `RELEASE_CANDIDATE_CHECKLIST.md` Stage 3–4 |
| **B — Complete emulator mode** (backlog **APP-002**) | Smaller than first estimated — Auth is already wired. Needs `connectFirestoreEmulator`, an `auth` entry in `firebase.json`, port alignment, and a way to seed emulator `users/{uid}` docs (without them the role lookup still denies everything) | No cloud account needed; fast, disposable, free. **But** it is a code change, and this phase is explicitly not for development — so it needs your go-ahead. It also cannot test the deployed-function path, so it does **not** close C-1 |

**Recommendation: A, then optionally B later** as a developer convenience. B validates the
client and the rules but leaves the single most important unverified claim — that the four
privileged operations actually execute server-side — untested.

Everything below is **ready to execute** the moment either path lands.

---

## 1. Scope

**In scope:** the workflows that exist and are ≥75% complete per `audit/MODULE_AUDIT.md` —
authentication/RBAC, work orders, bills, payments, payment requests, variation orders, the
sales/receipt pipeline, ledgers and dashboards.

**Out of scope** (does not exist — do not raise as defects): posting engine, journal /
double-entry, voucher engine, cash/bank book, purchase requests/orders/GRN, inventory
transactions, stock ledger, inter-store transfer, material consumption, measurement book,
document management, asset management, formal reports, sale adjustments.
`BASELINE_v1.0.0-beta.1.md` §"Not built" is the authoritative list.

**Known limitations — not defects:**
- Alerts and daily summaries stay empty until `dailyJobs` is deployed and has run at 08:00 IST.
- Company/project scoping is client-side after a full read (chartered, Constitution §23).
- Retention is deducted but not tracked as a liability (TECH-DEBT D-4).
- Ledgers are derived on render, not posted (NN-7 — this is **not** double-entry accounting).
- A single JS chunk >500 kB; first load is slow on poor connections.

---

## 2. Environment setup (once)

| Step | Action |
|---|---|
| 1 | Confirm the deployed build reports **`v1.0.0-beta.2`** (Version History page / `appVersion.ts`) |
| 2 | Confirm `VITE_ALLOW_CLIENT_FALLBACK` is unset or `false` — **fail-loud must be active** |
| 3 | Create one test user per role: ADMIN, CEO, PROJECT_MANAGER, ACCOUNTS (+ optionally SUPER_ADMIN, PURCHASE_MANAGER, STORE_MANAGER, STORE_KEEPER) |
| 4 | Promote the first user to `role: ADMIN`, `status: ACTIVE` in the Firebase console |
| 5 | **Configure Masters → WO Number Series** — work-order creation hard-blocks without it |
| 6 | Seed a company (SIPL), a project, a contractor, a customer, and at least one sub-location/unit |
| 7 | Keep the browser devtools **console and network tab open** for every session — a silent `PERMISSION_DENIED` or a 429 is the signal that matters |

---

## 3. Test suites

Priority: **P0** must pass to ship · **P1** should pass · **P2** nice to have.

### QA-1 · Authentication, approval and RBAC — P0

| # | Test | Expected |
|---|---|---|
| 1.1 | Self-signup a new account | Created as `PROJECT_MANAGER` / `PENDING`; **no app access** |
| 1.2 | Sign in while `PENDING` | Blocked with a clear "awaiting approval" message |
| 1.3 | Admin approves → user signs in | Full role-appropriate access |
| 1.4 | Admin sets a user `INACTIVE`; that user retries | Access revoked |
| 1.5 | **Attempt self-promotion** — edit own `role` to ADMIN via the UI/console | **DENIED** (rules) |
| 1.6 | ADMIN attempts to change **their own** role | **DENIED** — another admin must do it |
| 1.7 | Visit each route as each role | Matches the `allowedRoles` matrix in `src/App.tsx`; no blank screens |
| 1.8 | ACCOUNTS opens `/masters` (not permitted) | Redirected/blocked, not a crash |
| 1.9 | Sign out, then use the browser Back button | Cannot reach protected content |

### QA-2 · Work order lifecycle — P0

| # | Test | Expected |
|---|---|---|
| 2.1 | PM creates a WO with BOQ lines, GST %, retention %, advance | Saves as `PENDING`; WO# from the series (no timestamp fallback) |
| 2.2 | Verify financials on screen | `totalAmount` = Σ BOQ; `grandTotal` = (total − advance) + GST − retention + other |
| 2.3 | Create two WOs in rapid succession (two tabs) | **No duplicate WO#** (transactional series) |
| 2.4 | PM edits the PENDING WO (title, dates, BOQ) | Allowed |
| 2.5 | **PM attempts to approve their own WO** | **DENIED** — ADR-0001 / R-1. *This is a headline regression check* |
| 2.6 | CEO approves the PENDING WO | Succeeds; `approvedBy`/`approvedAt` recorded |
| 2.7 | PM edits the WO **after** approval | **DENIED** |
| 2.8 | ACCOUNTS attempts to approve a WO | **DENIED** |
| 2.9 | PM rejects a PENDING WO with no bills | Succeeds |
| 2.10 | Reject a WO that **has** active bills | Blocked with `WORK_ORDER_HAS_BILLS` |
| 2.11 | Delete a WO with bills / payments / approved VOs | Blocked with a precise typed error |
| 2.12 | Print/PDF a work order | Renders correctly; totals match the screen |

### QA-3 · Billing — P0

| # | Test | Expected |
|---|---|---|
| 3.1 | ACCOUNTS creates a bill against an APPROVED WO | Saves as `DRAFT`; TDS/retention/netPayable computed |
| 3.2 | Create a bill against a **PENDING** WO | Blocked — `WORK_ORDER_NOT_APPROVED` |
| 3.3 | Duplicate bill number on the same WO | Blocked — `DUPLICATE_BILL_NUMBER` |
| 3.4 | Bill exceeding the WO ceiling | Blocked — `BILL_EXCEEDS_WO_BALANCE`. **Record the exact numbers** — see §5 (F-2 is unresolved; a bill valid at create may be blocked at approve) |
| 3.5 | ACCOUNTS edits a DRAFT bill's amounts | Allowed; derived fields recalculate |
| 3.6 | **ACCOUNTS attempts to verify its own bill** | **DENIED** — ADR-0001 / R-2. *Headline regression check* |
| 3.7 | PM verifies the DRAFT bill | Succeeds → `VERIFIED` |
| 3.8 | CEO approves the VERIFIED bill | Succeeds → `APPROVED`. **Must be served by the Cloud Function** — check the network tab for `/api/secure/bills/:id/approve` |
| 3.9 | Edit amounts on a VERIFIED or APPROVED bill | **DENIED** |
| 3.10 | PM/CEO reject a DRAFT or VERIFIED bill | Succeeds |
| 3.11 | Reject an APPROVED bill | **DENIED** |
| 3.12 | Print a bill | Renders; totals match |

### QA-4 · Payments and the money path — P0 (highest risk)

| # | Test | Expected |
|---|---|---|
| 4.1 | ACCOUNTS creates a payment against an APPROVED bill | Saves as `PENDING` |
| 4.2 | Zero / negative amount | Blocked |
| 4.3 | Amount exceeding remaining payable | Blocked — `PAYMENT_EXCEEDS_PAYABLE` |
| 4.4 | **ACCOUNTS attempts to approve its own payment** | **DENIED** |
| 4.5 | CEO approves the payment | Succeeds → `APPROVED` |
| 4.6 | ACCOUNTS releases the APPROVED payment | Succeeds → `RELEASED`; bill → `PARTIALLY_PAID`/`PAID`. **Must go through `/api/secure/payments/:id/release`** |
| 4.7 | Partial release, then a second release completing the bill | Bill `PARTIALLY_PAID` → `PAID`; totals reconcile |
| 4.8 | Attempt to edit or delete a RELEASED payment | **DENIED** |
| 4.9 | **Boundary test:** with the app closed, use the Firebase console/SDK to set a payment `APPROVED → RELEASED` directly | **DENIED by rules.** *The single most important test in this plan — it is the sprint's exit criterion* |
| 4.10 | **Boundary test:** set a bill `APPROVED → PAID` directly via the console | **DENIED by rules** |
| 4.11 | **D-1 verification:** two different users each make ~20 privileged calls within one minute | Neither throttles the other. A 429 for user B caused by user A is a **P0 regression** |
| 4.12 | **Fail-loud test:** block `/api/secure/*` in devtools, then attempt an approval | A clear typed error toast. **No silent success, and no weaker client write** |

### QA-5 · Variation orders — P1

| # | Test | Expected |
|---|---|---|
| 5.1 | PM creates a VO against a WO | Saves as `DRAFT` |
| 5.2 | CEO approves the VO | Succeeds via `/api/secure/variation-orders/:id/approve`; parent WO financials update |
| 5.3 | **Record the WO `grandTotal` before and after approval** | **Expected to INCREASE more than the VO amount** — this is the known F-1 divergence, **not a new bug**. Record exact figures for the finance decision |
| 5.4 | CEO rejects a DRAFT VO | Succeeds |
| 5.5 | Edit or delete an APPROVED VO | **DENIED** |

### QA-6 · Sales, receipts and schedules — P1

| # | Test | Expected |
|---|---|---|
| 6.1 | Book a unit for a customer | Sale `BOOKED`; unit `saleStatus` = BOOKED; `activeSaleId` set |
| 6.2 | Book the **same unit** for a second customer | Blocked |
| 6.3 | `finalSaleValue` vs `agreementValue − discountAmount` | Enforced equal |
| 6.4 | Generate an installment schedule | Rows created; amounts and due dates correct |
| 6.5 | Record a receipt against a schedule row | `paidAmount`/`balanceAmount` update; `sale.totalReceived` bumps |
| 6.6 | Auto-distribute a receipt across several schedules (FIFO) | Allocations correct; remainder unallocated but counted in `totalReceived` |
| 6.7 | **⚠️ Concurrency:** two browser tabs record a receipt on the **same sale** at the same instant | **`totalReceived` may be WRONG — this is the known NN-5 defect (F-4), not a new bug.** Record it. Do not spend time diagnosing |
| 6.8 | Cancel a sale | Unit returns to `AVAILABLE`; `activeSaleId` cleared. Receipts are **not** reversed (known gap) |
| 6.9 | Give possession | `POSSESSION_GIVEN`; ownership stays SOLD |

### QA-7 · Ledgers, dashboards, audit — P1

| # | Test | Expected |
|---|---|---|
| 7.1 | Contractor ledger | **Header totals equal the sum of the rows.** A mismatch is the known TECH-DEBT D-3 |
| 7.2 | Customer ledger + recovery dashboard | Figures reconcile with the underlying receipts |
| 7.3 | CEO / Accounts / PM dashboards | KPIs match manual arithmetic over the seeded data. **WO Value must be GROSS BOQ**, not net |
| 7.4 | Overdue / Due Today / Upcoming classification | `billDate` < today = overdue; == today = due today; > today = upcoming |
| 7.5 | Audit trail (as ADMIN or CEO) | Entries exist for every transition, attributed to the acting user |
| 7.6 | **Attempt to write an audit entry with another user's `userId`** (console) | **DENIED** — ADR-0002 / H-3. *Headline regression check* |
| 7.7 | PM or ACCOUNTS attempts to read the audit trail | **DENIED** |
| 7.8 | Version History page | Shows `v1.0.0-beta.2` |

### QA-8 · Masters and referential integrity — P2

Create/edit/deactivate each master (projects, contractors, customers, sub-locations, work
categories, terms templates, number series, material categories, UOMs, materials, vendors,
stores, vehicles). Verify duplicate-name/code guards, and that deleting a master referenced
by a live record is **blocked with a precise error** rather than orphaning data.
Note: vendors carry bank/GSTIN data — confirm PM and ACCOUNTS **cannot** read them.

### QA-9 · Cross-cutting — P2

Mobile/responsive drawer nav; print views; error boundaries (no white screens); destructive
actions confirm before acting; no dead buttons (~15 are known — record which); no PII in the
console; no unhandled `PERMISSION_DENIED` surfacing as a raw Firebase error.

---

## 4. Defect reporting

File every defect as a GitHub issue using `.github/ISSUE_TEMPLATE/bug_report.md`, with:

- **Title:** `[QA-<suite>.<test>] <one-line symptom>`
- **Role** used, and the **exact steps** to reproduce
- **Expected vs actual**, with figures where money is involved
- **Console + network evidence** (the failing request, status code, error code)
- **Severity:** P0 money-integrity or security · P1 workflow-blocking · P2 cosmetic/UX
- **Classification — is it new?** Check against `audit/TECHNICAL_DEBT.md`,
  `DEPLOYMENT_BLOCKERS.md` and §5 below **before** filing. Known-and-accepted items should be
  recorded, not re-filed as new defects.

### Triage rules

| Severity | Definition | Response |
|---|---|---|
| **P0** | Money can be lost, created, or moved without authorisation; or a security boundary fails | **Stop QA. Report immediately.** No further merges until diagnosed |
| **P1** | A documented workflow cannot be completed | Fix on a `fix/*` branch before the next release |
| **P2** | Cosmetic, UX, or performance | Log for a hygiene sweep |

---

## 5. Expected findings — record, do **not** re-diagnose

**Moved to [`RUNTIME_DIAGNOSTICS.md`](./RUNTIME_DIAGNOSTICS.md).** Several behaviours are already
known and owned — confirming them is useful, diagnosing them is wasted QA time.

Read both registers before starting a suite:
[B — Silent-Danger](./RUNTIME_DIAGNOSTICS.md#3-register-b--🟠-silent-danger) (looks fine, result
is invalid) and [C — Benign](./RUNTIME_DIAGNOSTICS.md#4-register-c--🟢-benign) (looks broken, is
not). Register B matters most: **B-1** will make an entire QA session invalid without announcing
itself.

## 6. Regression-test policy — every confirmed bug gets a test

**Mandatory (NN-16 / TEST-2):** a confirmed defect is not closed until a test exists that
**fails before the fix and passes after**. Where that test lives depends on the layer:

| Bug type | Test location | Runs in | Status |
|---|---|---|---|
| Pure calculation / KPI / date logic | `src/lib/<module>.test.ts` (co-located) | `npm test` | ✅ Available |
| `firestore.rules` permission | `tests/rules/<collection>.rules.test.ts` | `npm run test:rules` | ✅ Available |
| Committed configuration | `tests/config/*.test.ts` | `npm test` | ✅ Available |
| Service-layer / cross-document rule | `tests/service/` | *(needs Firestore emulator harness)* | ⚠️ **Tier does not exist** |
| Cloud Function / transactional money | `tests/functions/` | *(needs emulator)* | ⚠️ **Tier does not exist** |
| UI behaviour, dead controls, routing | `tests/e2e/` (Playwright) | — | ⚠️ **Tier does not exist** |

**Honest gap:** three of the six tiers do not exist yet (`tests/README.md` marks them
⏳ Phase 2). A UI-only defect found in manual QA therefore has **nowhere to get an automated
regression test today**. Options when that happens:

1. If the root cause is pure logic, push the test **down** into `src/lib/` — usually possible
   and always preferable.
2. If it is a rules gap, it belongs in `tests/rules/` — that tier is mature.
3. If it is genuinely UI-only, record it in the issue with a manual reproduction script and
   **flag that a test tier is required**. Do not silently close it untested.

Creating `tests/service/` or `tests/e2e/` is real engineering work and needs its own
decision — it is not something to slip in mid-QA.

---

## 7. Exit criteria for the QA phase

| | Criterion |
|---|---|
| ⬜ | Every **P0** suite (QA-1 … QA-4) executed and passing |
| ⬜ | The four boundary tests (4.9, 4.10, 2.5, 3.6, 7.6) **all denied** |
| ⬜ | D-1 verified under real proxy conditions (4.11) |
| ⬜ | Fail-loud verified (4.12) |
| ⬜ | Every privileged operation confirmed served by the Cloud Function, not a fallback |
| ⬜ | Every confirmed defect has an issue **and** a regression test (or a recorded tier gap) |
| ⬜ | No unresolved **P0** defects |
| ⬜ | All four validation gates still green on the QA build |

**QA is complete when the P0 suites pass and every confirmed defect is either fixed with a
regression test or explicitly accepted with a recorded reason.** Not before.
