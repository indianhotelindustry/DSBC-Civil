# COMPLIANCE — DSBC Civil

> **Authority:** Chartered by [`AMENDMENT-001`](./amendments/AMENDMENT-001.md) Article III; supports Non-Negotiable **NN-30** (PII inventory & minimization) and Constitution §8 (Security) / §23 (Multi-company).
> **Scope:** Indian DPDP Act posture, GST/TDS considerations, audit readiness, PII handling, data retention, vendor-data access, and multi-company isolation.
> **Disclaimer:** This is engineering-governance guidance, not legal advice. Statutory specifics (rates, thresholds, filing formats) MUST be confirmed with a qualified accountant/legal counsel before production. This document defines *how the platform is built to support compliance*, not the legal obligations themselves.
> **Honest baseline:** DSBC handles customer PII and vendor financial data today, but has no formal privacy/compliance controls yet. This document is the charter to close that gap before commercial multi-tenant deployment.

---

## 1. Indian DPDP Act (Digital Personal Data Protection Act, 2023)

The platform processes personal data of customers, users, and vendor contacts. DSBC's engineering posture:

- **Lawful basis & purpose limitation:** personal data is collected only for the operational purpose it serves (a customer record exists to manage a sale; a user record to operate the platform). No secondary use without basis.
- **Data minimization (NN-30):** no PII field ships without being recorded in the PII inventory (§4) and justified. Collect the minimum required.
- **Access control:** personal data is readable only within the requester's role and company scope (boundary-enforced, Constitution MC-2). Vendor financial data already has restricted read ([`../firestore.rules`](../firestore.rules) `vendors`); `users` read exposure is to be narrowed (SEC-7).
- **Data-principal rights:**
  - **Access/correction** — supported through the normal edit paths, scoped to entitlement.
  - **Erasure** — handled within the **reverse-don't-delete** constraint (NN-6): non-statutory PII fields are **anonymized** (e.g. name/phone tombstoned) while records required for statutory retention (financial books) are preserved with attribution keys. A financial counterparty cannot be fully erased while law requires its transaction history.
- **Breach response:** a suspected personal-data breach is a SEV-1 incident ([`RELIABILITY.md`](./RELIABILITY.md) §5) with notification obligations to be confirmed with counsel.
- **Consent (Target):** where required, capture and record consent at the point of collection; charter for the CRM completion work (P1.3).

## 2. GST considerations

- **Current state:** GST is modelled at the Work Order level (`WorkOrderFinancials.gstPercentage/gstAmount`), but **contractor bills are billed/paid net of GST with no GST liability record** (see [`../audit/`](../audit/README.md) accounting findings). There is no GST return/report today.
- **Target (Accounting Core v1.2 / Reporting P2.1):**
  - Model **GST as a tracked liability** (input/output) via the posting engine (Constitution §10 posting map), not a bare arithmetic field.
  - Capture GSTIN on vendors (already validated) and on companies/customers where applicable.
  - Produce GST-relevant reports (output tax, input credit) from the journal.
- **Engineering rule:** GST amounts use the single shared financial calculation (NN-4); no re-derived GST math.

## 3. TDS (Tax Deducted at Source)

- **Current state:** TDS is deducted on bills (`tdsAmount`, default 2%) but the withheld amount is **not tracked as a payable** (TECH-DEBT D-4) — it vanishes from the ledger.
- **Target (P0.7 / v1.2):** model **TDS withheld as a liability** with a remittance/report path, mirroring retention. This is required for statutory TDS return readiness.
- **Engineering rule:** TDS is a tracked liability with a lifecycle ([`DATA_LIFECYCLE.md`](./DATA_LIFECYCLE.md)), not a silent deduction.

## 4. PII inventory (NN-30)

Every field storing personal/sensitive data. **No new PII field ships without being added here.**

| Entity | Field(s) | Class | Read restriction | Notes |
|---|---|---|---|---|
| User | displayName, email | **HIGH** | Narrow to self + admin (target; currently broad — SEC-7) | Never deletable (audit attribution); erasure = anonymize |
| Customer | name, phone, address | **HIGH** | Company-scoped roles | DPDP data-principal; erasure within retention limits |
| SubLocation (unit) | ownerClientName (snapshot) | **MEDIUM** | Company-scoped | Follows customer policy |
| Sale | customer reference | **MEDIUM** | Company-scoped | Links to customer PII |
| Vendor | bankAccount, IFSC, GSTIN, PAN | **HIGH (financial)** | Restricted read (procurement/store/admin) — already enforced | Sensitive financial identifiers |
| Contractor | contact fields | **MEDIUM** | Auth read | Review for minimization |
| Audit log | actor uid, action detail | **SENSITIVE** | Admin/CEO read | Permanent; attribution integrity (SEC-6) |
| Payment / Receipt | payment mode/reference | **SENSITIVE** | Company-scoped | Not PII but financial-sensitive |

**Rules:** PII MUST NOT enter logs (NN-30, SEC-8) or AI prompts beyond entitlement (AI-10). The current auth-context log dump ([`../src/services/db.ts`](../src/services/db.ts):70) is a violation to fix (P1.4).

## 5. Data retention

Retention is governed per-entity in [`DATA_LIFECYCLE.md`](./DATA_LIFECYCLE.md). Compliance-relevant minimums:

| Category | Minimum retention | Basis |
|---|---|---|
| Books of account, bills, payments, journal, receipts | **8 years** | Indian statutory (Income Tax / Companies Act; confirm with counsel) |
| GST/TDS records | 8 years | Tax statutes |
| Audit log, deployment log | Permanent | Compliance/traceability |
| Operational (WOs, sales, masters) | 8 years after last transaction | Support financial records |
| Derived caches (summaries, alerts) | 12–24 months | Regenerable |

**Rule:** financial records are **retained, not deleted** (NN-6); PII within them is minimized/anonymized on erasure request while statutory records persist.

## 6. Audit readiness

DSBC is designed to be auditable:
- **Immutable audit trail** (`auditLogs`, append-only) records every transition (WF-3, NN-12) — authorship integrity hardening is P0/P1 (SEC-6).
- **Posting engine (v1.2)** provides the immutable journal and trial balance an external audit requires (Constitution §10). *Until it ships, DSBC is not audit-ready for statutory financial audit* — stated honestly (NN-7).
- **Traceability** (NN-24): every monetary transaction linkable across audit → event → journal → source by correlation id.
- **Reconciliation** (POST-6): derived vs posted agreement is a continuous self-audit.
- **Access review (Target):** periodic recertification of roles/company assignments; role changes are audited.

## 7. Vendor access

- Vendor records hold sensitive financial data (bank, GSTIN, PAN) and already have **restricted read** in the rules (procurement/store/admin roles only) — the reference pattern other PII reads should follow.
- Vendor create/update is Purchase-Manager/Admin only; delete guards (against future POs) are chartered for P1.2.
- Vendor data is company-scoped (multi-company isolation, §8).

## 8. Multi-company isolation

- Company scoping exists via `assignedCompanyIds` and [`../src/lib/userAccess.ts`](../src/lib/userAccess.ts), but is **client-side today** — a scoped user still downloads other companies' data before filtering (SECURITY M-4, PERFORMANCE §1).
- **Target (Constitution MC-2, NN-29):** boundary-enforced scoping so a scoped user **cannot read or write** another company's data, proven by a cross-company isolation test on every scoped change.
- `companyId` becomes required on financial collections (MC-1) to enable both isolation and per-company books/returns.
- Unrestricted roles (ADMIN/CEO/SUPER_ADMIN) are the explicit, audited exception.

---

## Compliance readiness (honest scorecard)

| Area | Current | Target milestone |
|---|---|---|
| DPDP posture (access control, minimization) | ⏳ partial (vendor read restricted) | v1.0 (boundary scoping) |
| Erasure/anonymization path | ❌ none | P1.3 / v1.0 |
| GST liability & reporting | ❌ arithmetic only | v1.2 / P2.1 |
| TDS liability & reporting | ❌ silent deduction | P0.7 / v1.2 |
| PII inventory | ✅ this document | maintained per NN-30 |
| Audit readiness (statutory) | ❌ no journal yet | v1.2 (posting engine) |
| Multi-company isolation (enforced) | ⏳ client-side only | v1.0 (NN-29) |
| Retention policy | ✅ defined here + lifecycle | automated enforcement in Phase 2 |

Compliance is a **v1.0 gate**. This document charters the controls; the engineering to satisfy them is sequenced in [`../ENGINEERING_PHASE_2.md`](../ENGINEERING_PHASE_2.md).
