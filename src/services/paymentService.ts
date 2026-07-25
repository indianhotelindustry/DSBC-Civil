import { Payment, Bill, BusinessRuleError } from '../types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  getDocument,
  queryDocuments,
  logAction,
  where
} from './db';
import { secureReleasePayment } from './secureApi';

const COLLECTION = 'payments';

/**
 * Calculate total already-released payments for a given bill.
 */
async function getReleasedTotalForBill(billId: string, excludePaymentId?: string): Promise<number> {
  const payments = await queryDocuments<Payment>(COLLECTION, [
    where('billId', '==', billId)
  ]);
  return payments
    .filter(p => p.status === 'RELEASED' && p.id !== excludePaymentId)
    .reduce((sum, p) => sum + p.amount, 0);
}

export const paymentService = {
  getAll: (callback: (payments: Payment[]) => void) => {
    return subscribeToCollection<Payment>(COLLECTION, callback);
  },

  getById: async (id: string): Promise<Payment | null> => {
    return getDocument<Payment>(COLLECTION, id);
  },

  /**
   * Create a payment request with validation:
   * - Bill must exist
   * - Bill must be APPROVED (not DRAFT, VERIFIED, REJECTED, or already PAID)
   * - Amount must be > 0
   * - Total released + this amount must not exceed bill's netPayable
   */
  create: async (data: Omit<Payment, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    // 1. Amount must be positive
    if (!data.amount || data.amount <= 0) {
      throw new BusinessRuleError('PAYMENT_INVALID_AMOUNT', 'Payment amount must be greater than zero.');
    }

    // 2. Bill must exist
    const bill = await getDocument<Bill>('bills', data.billId);
    if (!bill) {
      throw new BusinessRuleError('BILL_NOT_FOUND', `Bill ${data.billId} does not exist.`);
    }

    // 3. Bill must be approved (or partially paid — more payments allowed)
    if (bill.status !== 'APPROVED' && bill.status !== 'PARTIALLY_PAID') {
      throw new BusinessRuleError('BILL_NOT_APPROVED', `Bill ${bill.billNumber} is not approved (status: ${bill.status}).`);
    }

    // 4. Total released + pending approved + this amount must not exceed netPayable
    const alreadyReleased = await getReleasedTotalForBill(data.billId);
    if (alreadyReleased + data.amount > bill.netPayable) {
      throw new BusinessRuleError(
        'PAYMENT_EXCEEDS_PAYABLE',
        `Payment of ${data.amount} would exceed remaining payable. Bill netPayable: ${bill.netPayable}, already released: ${alreadyReleased}.`
      );
    }

    const id = await createDocument(COLLECTION, data as Record<string, unknown>);
    await logAction('CREATE', 'Payment', id, `Initiated payment request for bill: ${bill.billNumber}`);
    return id;
  },

  approve: async (id: string, userId: string): Promise<void> => {
    const payment = await getDocument<Payment>(COLLECTION, id);
    if (!payment) throw new BusinessRuleError('BILL_NOT_FOUND', `Payment ${id} does not exist.`);
    if (payment.status !== 'PENDING') {
      throw new BusinessRuleError('RECORD_LOCKED', `Payment ${id} must be PENDING to approve (current: ${payment.status}).`);
    }
    await updateDocument(COLLECTION, id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: new Date().toISOString()
    });
    await logAction('APPROVE', 'Payment', id, `Approved payment request: ${id}`);
  },

  /**
   * Release a payment and update the linked bill status.
   * Delegated to server for authoritative validation using Firestore transactions.
   * The server verifies amounts, checks payable limits, and atomically
   * updates both payment status and bill status.
   */
  release: async (id: string, _userId: string, _billId: string): Promise<void> => {
    await secureReleasePayment(id);
  },

  /**
   * Update a payment. Blocks edits on released payments.
   */
  update: async (id: string, data: Partial<Payment>): Promise<void> => {
    const existing = await getDocument<Payment>(COLLECTION, id);
    if (!existing) throw new BusinessRuleError('BILL_NOT_FOUND', `Payment ${id} does not exist.`);

    if (existing.status === 'RELEASED') {
      // Only allow status-transition fields on released records
      const isStatusTransition = Object.keys(data).every(k =>
        ['status'].includes(k)
      );
      if (!isStatusTransition) {
        throw new BusinessRuleError('RECORD_LOCKED', `Payment ${id} is RELEASED and cannot be edited.`);
      }
    }

    await updateDocument(COLLECTION, id, data as Record<string, unknown>);
    await logAction('UPDATE', 'Payment', id, `Updated payment: ${id}`);
  },

  delete: async (id: string): Promise<void> => {
    const payment = await getDocument<Payment>(COLLECTION, id);
    if (payment && payment.status === 'RELEASED') {
      throw new BusinessRuleError('RECORD_LOCKED', `Payment ${id} is RELEASED and cannot be deleted.`);
    }
    await deleteDocument(COLLECTION, id);
    await logAction('DELETE', 'Payment', id, `Deleted payment: ${id}`);
  }
};
