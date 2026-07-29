# Cloud Functions Migration Plan

This document tracks server-side migration of sensitive operations.

## Priority 1: Financial Operations — IMPLEMENTED (Phase 8)

These operations now run as server-authoritative Express routes in `server/secureRoutes.ts`,
using Firebase Admin SDK with Firestore transactions. The client calls them via
`src/services/secureApi.ts` with the user's ID token.

### Payment Release — DONE
- **Route**: `POST /api/secure/payments/:id/release`
- **Validates**: payment status, bill status, amount vs netPayable, cumulative released total
- **Transaction**: Atomically updates payment (→ RELEASED) + bill (→ PARTIALLY_PAID or PAID)
- **Role**: ACCOUNTS, ADMIN

### Bill Verify — DONE
- **Route**: `POST /api/secure/bills/:id/verify`
- **Validates**: bill status (must be DRAFT), linked WO existence and approval status
- **Role**: PROJECT_MANAGER, ADMIN

### Bill Approve — DONE
- **Route**: `POST /api/secure/bills/:id/approve`
- **Validates**: bill status (must be VERIFIED), WO existence, cumulative billing vs WO value
- **Transaction**: Reads all bills for WO to check cumulative limit before approving
- **Role**: CEO, ADMIN

### Variation Order Approval — DONE
- **Route**: `POST /api/secure/variation-orders/:id/approve`
- **Validates**: VO status (must be DRAFT), WO existence, positive amount
- **Transaction**: Atomically updates VO (→ APPROVED) + recalculates WO financials server-side
- **Role**: CEO, ADMIN

### Migrate to Firebase Cloud Functions — WRITTEN, NOT YET DEPLOYED

Implemented differently (and more cheaply) than the `onCall` conversion originally
sketched here: rather than rewriting four handlers as callables, the **whole Express
app is re-hosted** as a single HTTPS function. Nothing was rewritten.

- [`server/app.ts`](../server/app.ts) — `createApp()` builds the Express app (health,
  admin triggers, `/api/secure` router) with **no** listener and **no** Vite.
- [`server.ts`](../server.ts) — local dev harness: `createApp()` + Vite + node-cron + listen.
- [`functions/index.ts`](../functions/index.ts) — `export const api = onRequest({region}, createApp())`.
- [`firebase.json`](../firebase.json) — Hosting rewrites `/api/secure/**` and `/api/health`
  to function `api` in `asia-south1`; `"functions": { "source": "functions" }`.
- Auth is unchanged: real ID-token verification in `server/authMiddleware.ts`, role read
  from the `users/{uid}` document (custom-claims migration remains future work, P1.5).
- The client needs no change — `secureApi.ts` already POSTs to `/api/secure/*`.

**Status: not deployed.** Blocked on a provisioned Firebase project (`.firebaserc` is
still `REPLACE_WITH_NEW_FIREBASE_PROJECT_ID`) — see
[`DEPLOYMENT_READINESS_REPORT.md`](../DEPLOYMENT_READINESS_REPORT.md) for the full
blocker list and the exact deploy sequence.

**Still open before/at deploy:**
- The two `/api/admin/*` triggers are unauthenticated. They are *not* exposed by the
  Hosting rewrite (only `/api/secure/**` and `/api/health` are), so they are unreachable
  in the deployed topology — but they must be gated before that rewrite is ever widened
  (AUDIT SECURITY H-2).
- No idempotency key on the money operations (NN-23) — handlers re-assert status inside
  the transaction, so a replay throws rather than double-effecting.

## Priority 2: Role Management (should move before multi-tenant)

### User Role Assignment
- **Current**: Admin writes directly to `/users/{uid}.role` from client
- **Risk**: Firestore rules prevent non-admin changes, but admin client could be compromised
- **Cloud Function**: `onCall` function with admin-only custom claim check
- **Trigger**: Called from admin panel

## Priority 3: Background Processing — WRITTEN, NOT YET DEPLOYED

Both jobs live in [`server/backgroundJobs.ts`](../server/backgroundJobs.ts) and now have
two callers: node-cron in `server.ts` (dev) and a scheduled function (production).

### Alert Engine
- **Dev**: `server.ts` node-cron `0 8 * * *`, plus one run at startup
- **Production**: [`functions/index.ts`](../functions/index.ts) `dailyJobs` —
  `onSchedule({ schedule: "0 8 * * *", region: "asia-south1", timeZone: "Asia/Kolkata" })`
- **Collection**: Writes to `/alerts`

### Daily Summary Generator
- **Dev / Production**: same `dailyJobs` scheduled function, run immediately after the alert engine
- **Collection**: Writes to `/dailySummaries`

Until `dailyJobs` is deployed, `/alerts` and `/dailySummaries` stay empty for deployed
users (AUDIT SECURITY L-2, MODULE_AUDIT #29-30) — the rules already deny client writes
to `dailySummaries`, so only the Admin SDK can populate it.

## Priority 4: Data Integrity Triggers

### Bill Created → Update WO billedTillDate
- **Trigger**: `onWrite` on `/bills/{billId}`
- **Action**: Recalculate `workOrders/{woId}.billing.billedTillDate`

### Payment Released → Update WO paidTillDate
- **Trigger**: `onWrite` on `/payments/{paymentId}`
- **Action**: Recalculate `workOrders/{woId}.billing.paidTillDate`

## Implementation Notes

- Use Firebase Admin SDK (already in `package.json`)
- `server.ts` alert/summary logic can be extracted directly into Cloud Functions
- All `onCall` functions should validate `auth.token.role` via custom claims
- Consider using Firestore transactions (not just batches) in Cloud Functions
  for read-then-write patterns where consistency matters
