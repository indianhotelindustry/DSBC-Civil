# SECURITY AUDIT — DSBC Civil (formerly SIPL Work Orders)

**Scope:** authentication, authorization, Firestore rules, API security, business-rule bypass, secrets. Source-verified; no live penetration testing performed (no network calls). Severity: **CRITICAL / HIGH / MEDIUM / LOW**.

**Trust model in one line:** In production the app is a static SPA talking directly to Firestore. There is no server in the request path (see C-1). Therefore **`firestore.rules` is the entire security boundary** — anything the rules permit, a crafted client can do, regardless of what the UI or services enforce.

---

## CRITICAL

### C-1 · The "secure" server layer is not deployed; production falls back to direct client writes
**Evidence:** `firebase.json` configures only `hosting` + `firestore.rules` — no `functions`, Cloud Run, or App Hosting block, and no deploy script ships `server.ts` ([package.json:13-15](../package.json#L13)). [secureApi.ts:1-10,57-96](../src/services/secureApi.ts#L57-L96) documents and implements the fallback: when `/api/secure/*` returns the SPA HTML (content-type not JSON) or any fetch error occurs, it sets `client-fallback` and runs `clientVerifyBill/clientApproveBill/clientReleasePayment/clientApproveVariationOrder` as direct Firestore writes ([:102-210,216-238](../src/services/secureApi.ts#L216-L238)).
**Impact:** Every server-side guarantee — Firestore transactions, cross-document sum checks, server-written audit logs — is absent in the deployed product. Enforcement collapses to Firestore rules, which by their own comments cannot cross-query collections ([firestore.rules:176-177,228,278](../firestore.rules#L176)). This is the parent of C-2/C-3/H-1.
**Recommendation:** Deploy the routes as Cloud Functions (callable) or remove the fallback and accept the rules' limits explicitly. Until then, treat all financial integrity as advisory. See NEXT_DEVELOPMENT_PLAN R1.

### C-2 · Payments can be RELEASED by a direct client write with no amount/payable check
**Evidence:** [firestore.rules:299-301](../firestore.rules#L299-L301) allows ACCOUNTS to transition a payment APPROVED→RELEASED with only `onlyFieldsChanged(['status'])`. The cumulative-released-vs-`netPayable` guard exists only in the undeployed server ([secureRoutes.ts:167-177](../server/secureRoutes.ts#L167)) and the skippable client fallback ([secureApi.ts:159](../src/services/secureApi.ts#L159)).
**Impact:** An ACCOUNTS user (or anyone who obtains that role) can release payments exceeding the payable amount straight to the database via the Firestore SDK, bypassing all overpayment protection.
**Recommendation:** Move release behind a Cloud Function that transactionally validates sums; rules cannot express this.

### C-3 · Bills can be marked PAID/PARTIALLY_PAID directly, decoupled from any payment
**Evidence:** [firestore.rules:253-259](../firestore.rules#L253-L259) lets ACCOUNTS/ADMIN flip APPROVED/PARTIALLY_PAID bills to PAID with only `status,paidBy,paidAt` changed — no linkage to a released payment or amount reconciliation.
**Impact:** Bill payment status is forgeable; a bill can show PAID with no money recorded.
**Recommendation:** Only allow bill payment-status transitions as a side effect of a validated payment release (server/function-driven).

---

## HIGH

### H-1 · DRAFT bill financial fields are fully client-writable with no consistency check
**Evidence:** [firestore.rules:242](../firestore.rules#L242) ("Accounts can edit DRAFT bills (all fields)"); create rule only type-checks `netPayable`/`workOrderId`/`billNumber` ([:234-238](../firestore.rules#L234)). No validation that amounts are consistent with the work order; the cumulative check is only at approve time in the undeployed server, and bill `update` skips it entirely ([billService.ts:109-145](../src/services/billService.ts#L109-L145), TECHNICAL_DEBT D-7).
**Impact:** Arbitrary `netPayable`/`workDoneAmount` can be set on a DRAFT bill.

### H-2 · Unauthenticated admin job-trigger endpoints
**Evidence:** [server.ts:37-45](../server.ts#L37-L45): `/api/admin/run-alerts` and `/api/admin/run-summary` have no `requireAuth`/`requireRole` and sit outside the rate limiter (which is mounted only under `/api/secure`, [secureRoutes.ts:249](../server/secureRoutes.ts#L249)).
**Impact:** In any environment where the server is reachable, anyone can trigger background jobs (resource abuse, alert spam). Low exposure today only because the server isn't deployed — becomes live the moment it is.
**Recommendation:** Gate behind auth + admin role before deploying the backend.

### H-3 · Audit-log entries are forgeable / spoofable
**Evidence:** [firestore.rules:350](../firestore.rules#L350) — `allow create: if isAuthenticated()` with no field validation. Client writes `userId` from `auth.currentUser.uid` ([db.ts:227-234](../src/services/db.ts#L227)) but nothing stops a crafted write with an arbitrary `userId`, `action`, or `outcome`.
**Impact:** Any authenticated user can plant misleading audit records or impersonate another user's `userId`. Entries are immutable (update/delete `false`, [:352](../firestore.rules#L352)) so they can't be erased — but "who did what" is not trustworthy, undermining the audit trail's purpose.
**Recommendation:** Validate `request.resource.data.userId == request.auth.uid` in the rule; ideally write audit entries only from a trusted server/function.

### H-4 · APPROVED work-order financials rewritable without field scoping
**Evidence:** [firestore.rules:208-209](../firestore.rules#L208-L209): the VO-approval path `(isCEO() || isAdmin()) && currentStatus()=='APPROVED' && isStatusTransitionTo('APPROVED')` has **no `onlyFieldsChanged` guard**, so a CEO/Admin can rewrite `amount`, `financials`, `billing` to any values via a direct write, bypassing VO math.
**Impact:** Arbitrary WO value manipulation by CEO/Admin, decoupled from any variation order.

---

## MEDIUM

### M-1 · Authorization derived from a client-readable user doc, not custom claims
Both the server ([authMiddleware.ts:38-47](../server/authMiddleware.ts#L38)) and the rules ([firestore.rules:17-23](../firestore.rules#L17)) read the role from `users/{uid}.role`. No Firebase custom claims are ever set. Trust is centralized in a document; a single compromised ADMIN cascades to full control (admins can rewrite any other user's role, [:131](../firestore.rules#L131)). Every rule evaluation also incurs a `get()` (cost/latency). **Recommendation:** move role to custom claims set by a trusted function; rules read `request.auth.token.role`.

### M-2 · System error messages leaked to client
[apiResponse.ts:57-63](../server/apiResponse.ts#L57) returns raw `error.message` for uncaught errors. Internal detail disclosure (only where the server runs).

### M-3 · No CORS / security headers
`server.ts` sets none; `firebase.json` sets only cache headers. No CSP, HSTS, or X-Frame-Options on hosting. Same-origin design mitigates CORS need, but clickjacking/XSS hardening headers are absent.

### M-4 · Every authenticated user can read every user profile
[firestore.rules:96](../firestore.rules#L96) — `allow read: if isAuthenticated()` on `users`. Enables enumeration of all emails, roles, and statuses by any signed-in user.

### M-5 · Live Firebase web config committed and shipped in every bundle
[firebase-applet-config.json](../firebase-applet-config.json) holds a live `apiKey` and project id, imported unconditionally by [firebase.ts:16](../src/lib/firebase.ts#L16) and read by [firebaseAdmin.ts:11-13](../server/firebaseAdmin.ts#L11). Firebase web keys are client-exposed by design, so low secrecy impact — but it directly contradicts the repo's stated "avoid committing keys" intent and couples the code to one live project reachable by anyone with the bundle + permissive rules.

### M-6 · Client-side seeding writes on page mount
`seedCompanies`/`seedWorkCategories` fire when any user opens Masters ([Masters.tsx:39,43](../src/pages/Masters.tsx#L39)) / the WO form. A non-admin triggers a silently-failing write attempt; a permitted role could reseed. Move seeding to an admin-only or server-only path.

---

## LOW

### L-1 · Default new-user role is write-capable
`PROJECT_MANAGER` by default ([auth.ts:55](../src/services/auth.ts#L55)); mitigated by `PENDING` status gating ([ProtectedRoute.tsx:73](../src/components/ProtectedRoute.tsx#L73)) — but on activation the user immediately has broad create/update rights.

### L-2 · Alerts/summaries silently absent in production
Because node-cron never runs (backend undeployed), `alerts`/`dailySummaries` stay empty — a monitoring gap, not a breach.

### L-3 · `zod` present but unused server-side; no request-body shape validation on secure routes
[package.json:45]; secure routes validate only `req.params.id`. Low risk today (routes take no body) but no schema discipline for future endpoints.

### L-4 · PII in browser console
[db.ts:70](../src/services/db.ts#L70) logs email/provider on Firestore errors.

---

## What the rules DO get right (defensive strengths)
- Genuine per-collection role gating and status state-machines with `onlyFieldsChanged` field-diff scoping for workOrders, bills, payments, variationOrders, and (best of all) paymentRequests ([firestore.rules:538-554](../firestore.rules#L538)).
- Self-role/status escalation is correctly blocked ([:128-130](../firestore.rules#L128)).
- Audit logs, appVersions immutable (no update/delete).
- `vendors` reads restricted to procurement/store/admin roles ([:593-599](../firestore.rules#L593)) — the only collection with restricted read.
- WO identity fields (woNumber/createdAt/createdBy) immutable across all paths.
- Real Firebase ID-token verification on the server when it does run.

---

## Priority remediation order
1. **C-1** — decide and implement the production enforcement strategy (deploy functions or harden rules). Everything else depends on this.
2. **C-2, C-3, H-1, H-4** — the money-path bypasses; resolved largely by C-1 if release/approve/mark-paid move to trusted functions with transactional checks.
3. **H-3, M-1** — audit-log authorship validation and custom-claims-based roles.
4. **H-2** — gate admin job endpoints before any backend deploy.
5. **M-4, M-5, M-6, M-2/M-3** — reduce read exposure, seeding, headers.

**Bottom line:** The rules are well-crafted but structurally cannot enforce financial invariants that span documents, and the layer that was supposed to (the Express server) isn't in the production path. The security posture is acceptable for a single trusted operator and unacceptable for untrusted or multi-tenant use until C-1 is resolved.
