// ===============================================================
// Enums / Union Types for Statuses
// ===============================================================

export type UserRole = 'CEO' | 'PROJECT_MANAGER' | 'ACCOUNTS' | 'ADMIN'
  | 'SUPER_ADMIN' | 'PURCHASE_MANAGER' | 'STORE_MANAGER' | 'STORE_KEEPER';

/**
 * Payment Request workflow (Phase 1). Sits alongside the existing
 * Bills/Payments module — does NOT replace it. Drives advance/part/
 * final payments raised directly off a Work Order.
 *
 *   Work Order → Payment Request (PM/Admin) → CEO Approval → Accounts Payment
 */
export type PaymentRequestType = 'ADVANCE' | 'PART' | 'FINAL';
export type PaymentRequestStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID';
export type PaymentRequestMode = 'BANK_TRANSFER' | 'UPI' | 'QR' | 'CASH' | 'CHEQUE';

export interface PaymentRequest {
  id: string;

  companyId: string;
  projectId: string;
  workOrderId: string;
  contractorId: string;

  type: PaymentRequestType;

  requestedAmount: number;
  requestedBy: string;      // uid
  requestedAt: string;      // ISO — same as createdAt on create; kept separate for clarity

  status: PaymentRequestStatus;

  reason?: string;
  remarks?: string;

  approvedBy?: string;      // uid
  approvedAt?: string;
  rejectionReason?: string;

  paidBy?: string;          // uid
  paidAt?: string;
  paymentMode?: PaymentRequestMode;
  paymentReference?: string;
  paymentRemarks?: string;

  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export type WorkOrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type BillStatus = 'DRAFT' | 'VERIFIED' | 'APPROVED' | 'PARTIALLY_PAID' | 'PAID' | 'REJECTED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'RELEASED' | 'REJECTED';

export type PaymentType = 'PAYMENT' | 'ADVANCE';

export type VariationOrderStatus = 'DRAFT' | 'APPROVED' | 'REJECTED';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertType = 'PAYMENT_DUE' | 'OVERDUE' | 'HIGH_PAYABLE' | 'SYSTEM';

export type AdjustmentDirection = 'DEBIT' | 'CREDIT';

export type AdjustmentCategory = 'PENALTY' | 'RECOVERY' | 'BONUS' | 'OTHER';

export type LedgerEntryType = 'BILL' | 'PAYMENT' | 'ADVANCE' | 'ADJUSTMENT';

export type RiskItemType = 'OVERDUE' | 'UPCOMING';

export type CompanyCode = 'SIPL' | 'SHSPL';
export type BusinessType = 'CONSTRUCTION' | 'HOSPITALITY';
export type WOScopeType = 'SUB_LOCATION_LEVEL' | 'PROJECT_LEVEL';

/** SubLocation ownership (SIPL / CONSTRUCTION only).
 *  UNSOLD = unit belongs to SIPL; SOLD = owned by an external customer. */
export type UnitOwnershipStatus = 'UNSOLD' | 'SOLD';

/** Operational sale-pipeline status on a SubLocation.
 *  AVAILABLE  = no active sale
 *  BOOKED     = advance/token taken, ownership still with company
 *  SOLD       = agreement signed; ownership transferred (matches ownershipStatus=SOLD)
 *  POSSESSION_GIVEN = physical handover complete (ownership still SOLD)
 *  CANCELLED  = reserved; today we reset to AVAILABLE on cancel
 *  Legacy sub-locations without this field are read as AVAILABLE. */
export type UnitSaleStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD' | 'POSSESSION_GIVEN' | 'CANCELLED';

/** Status on the Sale document itself. AVAILABLE never appears here
 *  because a Sale record only exists from BOOKED onward. */
export type SaleStatus = 'BOOKED' | 'SOLD' | 'POSSESSION_GIVEN' | 'CANCELLED';

/** How the buyer funds the unit. Drives expected receipt mode mix. */
export type FundingModel = 'CASH' | 'LOAN' | 'MIXED' | 'INSTALLMENT';

/** Mode of a single receipt against a sale. */
export type ReceiptMode = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'LOAN_DISBURSEMENT';

// ===============================================================
// Core Interfaces
// ===============================================================

export interface Company {
  id: string;
  code: CompanyCode;
  name: string;
  businessType: BusinessType;
  address: string;
  gstin: string;
  phone: string;
  email: string;
  tagline?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface SubLocation {
  id: string;
  companyId: string;
  projectId: string;
  type: string;
  name: string;
  code?: string;
  isActive: boolean;
  /** Ownership (SIPL only — ignored on HOSPITALITY sub-locations).
   *  Missing status on legacy docs is treated as UNSOLD on read. */
  ownershipStatus?: UnitOwnershipStatus;
  ownerClientId?: string;
  /** Snapshot of the customer's name at the moment of sale — kept stable
   *  even if the underlying customer record is renamed later. */
  ownerClientName?: string;
  soldAt?: string;
  /** Operational pipeline status. Missing/legacy → AVAILABLE. */
  saleStatus?: UnitSaleStatus;
  /** Pointer to the currently-active (non-cancelled) Sale document.
   *  Cleared on cancel so the unit can be re-sold. */
  activeSaleId?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Sale master (SIPL only). Tracks a unit's pipeline from BOOKED through
 * SOLD / POSSESSION_GIVEN / CANCELLED. Authoritative for SubLocation
 * ownership once a Sale exists — manual ownership edits on the Unit
 * dialog are disabled while activeSaleId is set.
 */
export interface Sale {
  id: string;
  companyId: string;       // must be CONSTRUCTION
  projectId: string;
  subLocationId: string;
  customerId: string;
  saleDate: string;        // ISO date
  saleStatus: SaleStatus;
  fundingModel: FundingModel;

  /** Headline price before discount. */
  agreementValue: number;
  /** Discount off the headline price. 0 if none. */
  discountAmount: number;
  /** What the customer is ultimately expected to pay.
   *  Service enforces finalSaleValue == agreementValue - discountAmount. */
  finalSaleValue: number;

  /** Expected-funding breakdown. Sum may not equal finalSaleValue —
   *  UI warns but does not block (explicit Phase 1 policy). */
  bookingAmount: number;
  advanceAmount: number;
  loanAmount: number;
  selfFundingAmount: number;

  /** Snapshots so display stays stable across master renames. */
  customerNameSnapshot: string;
  unitNameSnapshot: string;

  /** Cached sum of saleReceipts.amount for this sale; kept fresh by
   *  saleReceiptService so list views don't need per-row queries. */
  totalReceived: number;

  remarks?: string;
  cancelledAt?: string;
  cancelReason?: string;
  possessionGivenAt?: string;

  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

/** A single money-received event against a Sale. */
export interface SaleReceipt {
  id: string;
  saleId: string;
  amount: number;
  receivedAt: string;      // ISO
  mode: ReceiptMode;
  reference?: string;      // UTR / cheque no / loan reference
  remarks?: string;
  /** @deprecated Phase 2A single-link. Superseded by `allocations`.
   *  Read-side fallback remains so existing receipts keep working:
   *  when `allocations` is absent but this field is set, treated as
   *  a one-item allocation for the full receipt amount. New writes
   *  use `allocations`. */
  linkedScheduleId?: string;
  /** Phase 2B multi-schedule allocation. One receipt may apply to
   *  several schedules, typically from the auto-distribute flow in
   *  the Record Receipt dialog. Every element contributes to its
   *  schedule's `paidAmount` atomically with the receipt write.
   *  Sum may be less than the receipt `amount` — the remainder is
   *  unallocated but still counted in `sale.totalReceived`. */
  allocations?: ReceiptAllocation[];
  /** Phase 2B alignment: how this receipt was allocated at write time.
   *  UNALLOCATED = no schedule link; SPECIFIC = single user-chosen
   *  schedule (legacy linkedScheduleId or a one-item allocations[]);
   *  AUTO = multi-schedule FIFO distribution. Optional for legacy
   *  receipts written before this field existed — readers must fall
   *  back to the shape of allocations[] / linkedScheduleId. */
  allocationMode?: AllocationMode;
  /** Denormalized sum of allocations[].amount, written at create time.
   *  Optional for legacy receipts — readers should recompute from
   *  allocations[] via `getReceiptAllocatedAmount` when absent. */
  allocatedAmount?: number;
  /** Denormalized remainder (`amount - allocatedAmount`), written at
   *  create time. Optional for legacy receipts — readers should
   *  recompute via `getReceiptUnappliedAmount` when absent. */
  unappliedAmount?: number;
  createdAt: string;
  createdBy: string;
}

export type AllocationMode = 'UNALLOCATED' | 'SPECIFIC' | 'AUTO';

/**
 * Master-managed counter for Work Order numbers. One singleton doc per
 * series, keyed by id (e.g. 'workOrder'). The service uses a Firestore
 * transaction to read-then-write `nextNumber` so concurrent creates
 * can't issue the same WO#.
 *
 * The legacy timestamp-suffixed format (`WO-2026-K7E2N9`) remains the
 * fallback whenever this doc is absent — keeps existing deployments
 * working until the admin opens Masters → Work Order Number Series.
 */
export interface NumberSeries {
  id: string;
  prefix: string;          // e.g. "WO"
  year: number;            // e.g. 2026 — also stored to detect FY rollover
  nextNumber: number;      // next sequence to issue (1-based)
  paddingLength: number;   // e.g. 4 → "0001"
  /** Whether to include the `year` segment in the formatted number. */
  includeYear: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ReceiptAllocation {
  scheduleId: string;
  amount: number;
}

/** What an installment represents in the schedule. Narrower than
 *  ReceiptMode — a BOOKING schedule might later be paid by CASH or
 *  BANK_TRANSFER. */
export type ScheduleType =
  | 'BOOKING'
  | 'ADVANCE'
  | 'INSTALLMENT'
  | 'LOAN_DISBURSEMENT'
  | 'POSSESSION'
  | 'REGISTRY'
  | 'OTHER';

/** Status of a single installment row.
 *  WAIVED and CANCELLED are admin-set and "sticky" — auto-derivation
 *  from paidAmount does not move them back. */
export type ScheduleStatus =
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'WAIVED'
  | 'CANCELLED';

/**
 * Installment plan row for a Sale (Phase 2A). Written by
 * `saleScheduleService`. The denormalized companyId / projectId /
 * subLocationId / customerId let dashboard queries filter without
 * joining back to the sale. `paidAmount` and `balanceAmount` are
 * cached — maintained atomically by `saleReceiptService` when a
 * receipt with `linkedScheduleId` is created or deleted.
 */
export interface SaleSchedule {
  id: string;
  saleId: string;
  companyId: string;
  projectId: string;
  subLocationId: string;
  customerId: string;
  installmentNo: number;
  scheduleType: ScheduleType;
  dueDate: string;                 // ISO date, required
  amount: number;                  // > 0, required
  status: ScheduleStatus;
  paidAmount: number;              // cached; bumped atomically by receipts
  balanceAmount: number;           // = max(0, amount - paidAmount), cached
  remarks?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

/**
 * Post-sale adjustment (penalty, write-off, refund, late discount).
 * Phase 2 — shape reserved only.
 */
export interface SaleAdjustment {
  id: string;
  saleId: string;
  type: 'DISCOUNT' | 'PENALTY' | 'WRITE_OFF' | 'REFUND';
  amount: number;
  appliedAt: string;
  remarks?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Customer master — broader than unit buyers (reusable for future SIPL
 * customer records). SIPL-only; HOSPITALITY does not use this collection.
 */
export interface Customer {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  panNumber?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  /** PENDING = awaiting admin approval; ACTIVE = full app access; INACTIVE = revoked.
   *  Legacy users written before this field existed are treated as ACTIVE on read. */
  status?: UserStatus;
  /** @deprecated Single-company legacy field. Kept in sync with the first
   *  entry of `assignedCompanyIds` for migration safety — always read via
   *  `getAssignedCompanyIds()` in `src/lib/userAccess.ts`, which prefers
   *  the multi-company array and falls back to this field. */
  companyId?: string;
  /** Companies this user has access to. Empty/missing means no scope
   *  (PM / ACCOUNTS see no data; ADMIN + CEO remain unrestricted). */
  assignedCompanyIds?: string[];
  assignedStoreIds?: string[];
  approvedBy?: string;
  approvedAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  companyId?: string;
  name: string;
  description: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  createdAt: string;
  createdBy: string;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  trade: string;
  createdAt: string;
  createdBy: string;
}

export interface BOQItem {
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface WorkOrderFinancials {
  totalAmount: number;
  advance: number;
  subtotal: number;
  gstPercentage: number;
  gstAmount: number;
  retentionPercentage: number;
  retentionAmount: number;
  otherCharges: number;
  grandTotal: number;
}

export interface WorkOrderBilling {
  totalValue: number;
  /** @deprecated Stale snapshot. Derive from bills/payments via financialCalcs instead. */
  billedTillDate?: number;
  /** @deprecated Stale snapshot. Derive from bills/payments via financialCalcs instead. */
  paidTillDate?: number;
  /** @deprecated Stale snapshot. Derive from bills/payments via financialCalcs instead. */
  balancePayable?: number;
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  companyId?: string;
  projectId: string;
  subLocationId?: string;
  subLocationType?: string;
  scopeType?: WOScopeType;
  contractorId: string;
  title: string;
  description: string;
  amount: number;
  status: WorkOrderStatus;

  location?: string;
  contractorGST?: string;
  workCategory?: string;
  issueDate: string;
  startDate: string;
  endDate: string;

  preparedBy: string;
  checkedBy?: string;
  approvedBy?: string;
  approvedAt?: string;

  scopeOfWork: string;
  additionalNotes?: string;
  termsTemplateId?: string;
  termsAndConditions?: string;

  boqItems: BOQItem[];
  financials: WorkOrderFinancials;
  billing: WorkOrderBilling;

  createdAt: string;
  createdBy: string;
}

/** The shape submitted by WorkOrderForm (before service adds woNumber, createdAt, etc.) */
export type WorkOrderCreateData = Omit<WorkOrder, 'id' | 'createdAt' | 'createdBy' | 'woNumber'>;

export interface Bill {
  id: string;
  billNumber: string;
  workOrderId: string;
  billDate: string;

  workDoneAmount: number;
  previousBillAmount: number;
  currentBillAmount: number;

  tdsPercentage: number;
  tdsAmount: number;
  retentionPercentage: number;
  retentionAmount: number;
  advanceAdjustment: number;

  netPayable: number;

  status: BillStatus;

  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidBy?: string;
  paidAt?: string;

  createdAt: string;
  createdBy: string;
}

/**
 * Master-managed work category (Plumbing Work, Electric Work, …).
 *
 * WorkOrder.workCategory stores the category NAME as a plain string
 * for display, reporting, and printing — not the id. That keeps legacy
 * free-text values readable without migration and lets admins rename a
 * category without hunting down references. `id` is stable (slugified
 * name at seed time) so the seed is idempotent.
 */
export interface WorkCategory {
  id: string;
  name: string;
  /** Ascending sort order shown in the New Work Order dropdown. */
  displayOrder: number;
  /** Inactive categories are hidden from the form dropdown but still
   *  render correctly when editing a WO that was saved against them. */
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  createdBy: string;
  type?: PaymentType;
  status: PaymentStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Adjustment {
  id: string;
  contractorId: string;
  projectId?: string;
  workOrderId?: string;
  amount: number;
  type: AdjustmentDirection;
  category: AdjustmentCategory;
  description: string;
  date: string;
  createdAt: string;
  createdBy: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerEntryType;
  referenceNumber: string;
  projectName: string;
  workOrderNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: string;
  relatedId: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface VariationOrder {
  id: string;
  workOrderId: string;
  voNumber: string;
  description: string;
  reason: string;
  amount: number;
  status: VariationOrderStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface DailySummaryRiskItem {
  title: string;
  amount: number;
  dueDate: string;
  type: RiskItemType;
}

export interface DailySummary {
  id: string;
  date: string;
  totalOutstanding: number;
  payable7Days: number;
  overdueAmount: number;
  topRiskItems: DailySummaryRiskItem[];
  formattedText: string;
  createdAt: string;
}

// ===============================================================
// Terms & Conditions Templates
// ===============================================================

export interface TermsTemplate {
  id: string;
  name: string;
  language: 'en' | 'hi' | 'both';
  content: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ===============================================================
// Dashboard KPIs (shared across CEO/Accounts dashboards)
// ===============================================================

export interface DashboardKPIs {
  payable7Days: number;
  payable15Days: number;
  payable30Days: number;
  totalApprovedLiability: number;
  totalWorkOrderValue: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  outstandingPayable: number;
  unbilledLiability: number;
  overduePayments: number;
  /** Pending bills with billDate == today. Subset of payable7Days, distinct from overdue. */
  dueToday: number;
  advanceOutstanding: number;
}

// ===============================================================
// App Version / Deployment Log
// ===============================================================

export interface AppVersion {
  id: string;
  version: string;
  buildLabel: string;
  gitTag?: string;
  gitCommit?: string;
  deployedBy: string;
  deployedAt: string;
  environment: 'development' | 'staging' | 'production';
  notes: string;
}

// ===============================================================
// Firestore document helpers
// ===============================================================

/** Fields automatically added by createDocument — never supplied by callers */
export interface FirestoreMetadata {
  createdAt: string;
  createdBy?: string;
}

// ===============================================================
// Business Rule Errors
// ===============================================================

// ===============================================================
// R2 — Procurement & Inventory Master Types
// ===============================================================

export type VehicleType = 'TRUCK' | 'PICKUP' | 'CRANE' | 'EXCAVATOR' | 'OTHER';

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface UOM {
  id: string;
  name: string;
  symbol: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  materialCategoryId: string;
  categoryName: string;
  uomId: string;
  uomSymbol: string;
  description?: string;
  specifications?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  code?: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  pan?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  contactPerson?: string;
  paymentTermsDays?: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  code: string;
  name: string;
  companyId: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make?: string;
  model?: string;
  capacityTons?: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export type BusinessRuleCode =
  | 'WORK_ORDER_NOT_FOUND'
  | 'WORK_ORDER_NOT_APPROVED'
  | 'WORK_ORDER_LOCKED'
  | 'WORK_ORDER_HAS_BILLS'
  | 'WORK_ORDER_HAS_PAYMENTS'
  | 'WORK_ORDER_FINANCIAL_CONFLICT'
  | 'DUPLICATE_BILL_NUMBER'
  | 'BILL_EXCEEDS_WO_BALANCE'
  | 'BILL_NOT_FOUND'
  | 'BILL_NOT_APPROVED'
  | 'BILL_HAS_PAYMENTS'
  | 'PAYMENT_EXCEEDS_PAYABLE'
  | 'PAYMENT_INVALID_AMOUNT'
  | 'VARIATION_ORDER_NOT_FOUND'
  | 'VARIATION_ORDER_LOCKED'
  | 'VARIATION_ORDER_INVALID_STATUS'
  | 'RECORD_LOCKED'
  | 'DELETE_BLOCKED'
  | 'LIMIT_EXCEEDED'
  | 'REASON_REQUIRED'
  | 'CONFIG_REQUIRED'
  | 'DUPLICATE_NAME'
  | 'DUPLICATE_CODE';

export class BusinessRuleError extends Error {
  public readonly code: BusinessRuleCode;

  constructor(code: BusinessRuleCode, message: string) {
    super(message);
    this.name = 'BusinessRuleError';
    this.code = code;
  }
}
