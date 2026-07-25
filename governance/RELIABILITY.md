# RELIABILITY — DSBC Civil

> **Authority:** Chartered by [`AMENDMENT-001`](./amendments/AMENDMENT-001.md) Article III; supports Constitution §20 (Deployment) and §21 (Performance).
> **Scope:** backup, recovery, deployment rollback, incident response, monitoring, logging, alerting, performance monitoring, and the RPO/RTO targets that bind them.
> **Honest baseline:** Several items below describe the **target** state for the commercial platform. The current deployment is Firebase Hosting + rules only, with the authoritative backend not yet deployed (see [`../audit/EXECUTIVE_SUMMARY.md`](../audit/EXECUTIVE_SUMMARY.md)). Each section marks *Current* vs *Target*; closing the gap is part of Engineering Phase 2 P0/P1.

---

## 1. Recovery objectives (RPO / RTO)

| Class of data | RPO (max data loss) | RTO (max downtime) | Rationale |
|---|---|---|---|
| Financial records (bills, payments, journal, receipts) | **≤ 1 hour** | **≤ 4 hours** | Money; statutory books |
| Operational (work orders, sales, masters) | ≤ 24 hours | ≤ 8 hours | Recreatable with effort |
| Derived/cache (dailySummaries, alerts) | Best-effort | ≤ 24 hours | Regenerable from source |
| Audit log | **0 (no loss)** | ≤ 4 hours | Immutable compliance memory |

> These are commitments for the commercial (v1.0) platform. Until automated backups are configured (§2 Target), actual RPO is undefined — a P0-adjacent gap to close during Phase 2.

## 2. Backup strategy

- **Current:** No automated backup configured. Firestore holds the only copy.
- **Target:**
  - **Scheduled Firestore exports** (managed export to Cloud Storage) at least hourly for financial collections, daily for the full database.
  - Exports retained: hourly for 7 days, daily for 35 days, monthly for 8 years (aligns with statutory retention, [`COMPLIANCE.md`](./COMPLIANCE.md)).
  - Exports stored in a separate GCS bucket with restricted access and object-versioning.
  - **Rules & indexes are backed up as code** (source control) — already true once committed.
- **Verification:** a backup is not real until a restore is proven (§3).

## 3. Recovery strategy

- **Data recovery** is by one of:
  1. **Reversing entry** — for a wrong financial record of record (never edit/delete; NN-6). The posting engine (P0.6) makes this canonical.
  2. **Backup restore** — for infrastructure loss or corruption; restore the affected collection(s) from the latest export into a recovery project, validate, then promote.
  3. **Reactivation** — for a wrongly-deactivated operational/master record (status change).
- **Restore drill:** a restore MUST be exercised and timed at least **quarterly**; the measured restore time updates the RTO table. A release cannot claim production-readiness without a current, passing restore drill (Release Checklist).

## 4. Deployment & rollback

- **Deploy as a coordinated set:** rules + indexes + functions + hosting move together (Constitution DEP-5). A hosting deploy that expects a not-yet-deployed function is prohibited.
- **Environments (Target):** local (emulator) → staging → production. Staging is a prerequisite for the Phase-2 backend cutover.
- **Rollback:**
  - **Hosting:** Firebase Hosting keeps prior releases; roll back via `firebase hosting:rollback` (fast, near-instant).
  - **Rules/indexes:** re-deploy the previous versioned files from source control.
  - **Functions:** re-deploy the previous function version; guard risky cutovers behind a **feature flag** (NN-27) so rollback is a flag flip, not a redeploy.
  - **Data migrations:** every migration ships a documented rollback (NN-25); irreversible migrations require explicit ADR sign-off.
- **Release gating:** every production release passes the Release Checklist ([`CHECKLISTS.md`](./CHECKLISTS.md) §8), including a documented rollback plan for that release.

## 5. Incident response

- **Severity levels:**
  - **SEV-1** — money integrity at risk (over-release possible, books not reconciling), data loss, or auth/security breach. Immediate response; all-hands.
  - **SEV-2** — a core workflow broken (cannot approve/release), no data loss.
  - **SEV-3** — degraded/non-critical (alerts stale, a report wrong).
- **Response loop:** detect → triage/severity → mitigate (feature-flag off, roll back) → root-cause → fix under the normal merge gate → **post-incident ADR** if a governance gap contributed (Amendment §6.2 triggers a constitutional review on a material incident).
- **Financial incident special rule:** any suspected incorrect money movement triggers a reconciliation run (Tier-3 vs Tier-2, POST-6) before and after mitigation; corrections are reversing entries, never silent edits.

## 6. Monitoring

- **Current:** none configured; the alert/summary jobs do not even run in production (backend undeployed).
- **Target:**
  - **Uptime/health** — the `/api/health` endpoint (exists) plus Firebase Hosting/Functions monitoring.
  - **Functions** — invocation count, error rate, latency, and cold-starts per privileged operation.
  - **Reconciliation alarm** — the posting-vs-derived divergence check (POST-6) is a **first-class monitor**; any divergence is a SEV-1 candidate.
  - **Rules-denied spikes** — a surge in permission-denied writes may indicate an attack or a bug.

## 7. Logging

- **Standard:** `console.error` for genuine error paths; **no `console.log`** in committed code; **no PII in logs** (NN-30, SEC-8, ERR-7). Fix the current auth-context PII dump ([`../src/services/db.ts`](../src/services/db.ts):70) as part of P1.4.
- **Structured logging (Target):** deployed functions emit structured logs carrying the **correlation id** (NN-24) so a single transition is traceable across audit, event, and journal.
- **Retention:** operational logs 90 days; the immutable `auditLogs` collection is the permanent record (never a substitute for it).

## 8. Alerting

- **Business alerts** (overdue bills, pending approvals, high exposure) run via the alert engine — **must be deployed to run in production** (Cloud Scheduler → function; Phase-2 P0.1). Today they generate only in local dev.
- **Operational alerts (Target):** page on SEV-1 conditions — functions error-rate breach, reconciliation divergence, backup-export failure, auth anomaly.
- **Channels:** in-app `alerts` today; email/SMS/push added as reactors on the event bus (Constitution §15, NN — NOT-3), never as bespoke senders.

## 9. Performance monitoring

- Track the scale-ceiling risks from [`../audit/PERFORMANCE_AUDIT.md`](../audit/PERFORMANCE_AUDIT.md): listener counts per screen, full-collection read volumes, function latency.
- **Budgets:** a screen reaches interactive with its scoped, paginated data in < ~2s on a mid-range device (PERF-8). Full-collection unbounded reads violate this at scale and are a P1 fix (scoped queries + pagination + indexes).

---

## Reliability readiness (honest scorecard)

| Capability | Current | Target milestone |
|---|---|---|
| Automated backups | ❌ none | Phase 2 (before v1.0) |
| Restore drill | ❌ never | Phase 2 quarterly |
| Rollback (hosting) | ✅ available | — |
| Rollback (functions) | ⏳ once deployed | Phase 2 P0.1 |
| Monitoring | ❌ none | Phase 2 |
| Reconciliation alarm | ❌ (no posting yet) | Accounting Core v1.2 |
| Structured/correlated logging | ⏳ partial | Phase 2 (NN-24) |
| Production alerting | ❌ (jobs undeployed) | Phase 2 P0.1 |

Reliability is a **v1.0 gate**, not a v0.9 expectation. This document is the charter for reaching it.
