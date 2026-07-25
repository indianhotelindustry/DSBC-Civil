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

### Future: Migrate to Firebase Cloud Functions
When moving from Express to Firebase Cloud Functions hosting:
- Convert each route handler to an `onCall` or HTTPS function
- Replace `global.__sipl_db` with `admin.firestore()` in the function context
- Replace `admin.auth().verifyIdToken()` with `context.auth` from callable context
- The validation and transaction logic stays the same

## Priority 2: Role Management (should move before multi-tenant)

### User Role Assignment
- **Current**: Admin writes directly to `/users/{uid}.role` from client
- **Risk**: Firestore rules prevent non-admin changes, but admin client could be compromised
- **Cloud Function**: `onCall` function with admin-only custom claim check
- **Trigger**: Called from admin panel

## Priority 3: Background Processing (already partially implemented in server.ts)

### Alert Engine
- **Current**: Runs in `server.ts` via node-cron
- **Migration**: Cloud Scheduler + Cloud Function (runs daily)
- **Collection**: Writes to `/alerts`

### Daily Summary Generator
- **Current**: Runs in `server.ts` via node-cron
- **Migration**: Cloud Scheduler + Cloud Function (runs daily at 8 AM)
- **Collection**: Writes to `/dailySummaries`

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
