/**
 * firestore.rules — PAYMENTS
 *
 * Status flow: PENDING → APPROVED → RELEASED · PENDING → REJECTED
 *
 * SERVER-AUTHORITATIVE (Platform Stabilization v1.1): payment RELEASE
 * (APPROVED → RELEASED) has NO client branch. This is the single most
 * important denial in the platform — it closes AUDIT SECURITY C-2 and is
 * CURRENT_SPRINT Definition-of-Success #1 ("a direct client-SDK attempt to
 * release an over-payable payment is rejected by firestore.rules").
 *
 * Note on the over-payable case: rules cannot cross-query the bill to compare
 * cumulative released against netPayable. The boundary closes that hole by a
 * stronger route — it denies the RELEASE transition outright, for every role
 * and every amount. The amount check lives in the transactional server handler
 * (server/secureRoutes.ts releasePayment).
 */

import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  UIDS, PAYMENT_ID, NOW, as, asAnonymous, getTestEnv, payment, resetWithUsers, seed, teardown,
} from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => { env = await getTestEnv(); });
afterAll(async () => { await teardown(); });
beforeEach(async () => { await resetWithUsers(env); });

const payRef = (db: ReturnType<typeof as>) => doc(db, 'payments', PAYMENT_ID);
const seedPayment = (status: string, overrides: Record<string, unknown> = {}) =>
  seed(env, [{ path: ['payments', PAYMENT_ID], data: payment({ status, ...overrides }) }]);

describe('payments — read', () => {
  beforeEach(() => seedPayment('PENDING'));

  it('ALLOWS any authenticated user to read', async () => {
    await assertSucceeds(getDoc(payRef(as(env, 'pm'))));
  });

  it('DENIES an unauthenticated caller', async () => {
    await assertFails(getDoc(payRef(asAnonymous(env))));
  });
});

describe('payments — create', () => {
  it('ALLOWS ACCOUNTS to create a PENDING payment', async () => {
    await assertSucceeds(setDoc(payRef(as(env, 'accounts')), payment()));
  });

  it('ALLOWS ADMIN to create a PENDING payment', async () => {
    await assertSucceeds(setDoc(payRef(as(env, 'admin')), payment()));
  });

  it('DENIES a PM creating a payment', async () => {
    await assertFails(setDoc(payRef(as(env, 'pm')), payment()));
  });

  it('DENIES CEO creating a payment', async () => {
    await assertFails(setDoc(payRef(as(env, 'ceo')), payment()));
  });

  it('DENIES creating a payment that starts at APPROVED', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ status: 'APPROVED' })));
  });

  it('DENIES creating a payment that starts at RELEASED (bypass attempt)', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ status: 'RELEASED' })));
  });

  it('DENIES a zero-amount payment', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ amount: 0 })));
  });

  it('DENIES a negative-amount payment', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ amount: -1_000 })));
  });

  it('DENIES a payment whose amount is not a number', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ amount: '93000' })));
  });

  it('DENIES a payment with no billId string', async () => {
    await assertFails(setDoc(payRef(as(env, 'accounts')), payment({ billId: null })));
  });
});

describe('payments — CEO approval', () => {
  beforeEach(() => seedPayment('PENDING'));

  it('ALLOWS ACCOUNTS to edit a PENDING payment (status stays PENDING)', async () => {
    await assertSucceeds(updateDoc(payRef(as(env, 'accounts')), { amount: 80_000 }));
  });

  it('ALLOWS CEO: PENDING → APPROVED with exactly the approval fields', async () => {
    await assertSucceeds(updateDoc(payRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW,
    }));
  });

  it('DENIES CEO approving while also raising the amount', async () => {
    await assertFails(updateDoc(payRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW, amount: 10_000_000,
    }));
  });

  it('DENIES ACCOUNTS approving their own payment (separation of duties)', async () => {
    await assertFails(updateDoc(payRef(as(env, 'accounts')), {
      status: 'APPROVED', approvedBy: UIDS.accounts, approvedAt: NOW,
    }));
  });

  it('DENIES a PENDING payment jumping straight to RELEASED', async () => {
    await assertFails(updateDoc(payRef(as(env, 'accounts')), { status: 'RELEASED' }));
  });

  it('ALLOWS CEO to reject a PENDING payment', async () => {
    await assertSucceeds(updateDoc(payRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });

  it('ALLOWS ADMIN to reject a PENDING payment', async () => {
    await assertSucceeds(updateDoc(payRef(as(env, 'admin')), { status: 'REJECTED' }));
  });
});

describe('payments — RELEASE is server-authoritative (closes AUDIT SECURITY C-2)', () => {
  beforeEach(() => seedPayment('APPROVED'));

  it('DENIES ACCOUNTS releasing an APPROVED payment from the client', async () => {
    await assertFails(updateDoc(payRef(as(env, 'accounts')), { status: 'RELEASED' }));
  });

  it('DENIES ADMIN releasing an APPROVED payment from the client', async () => {
    await assertFails(updateDoc(payRef(as(env, 'admin')), { status: 'RELEASED' }));
  });

  it('DENIES CEO releasing an APPROVED payment from the client', async () => {
    await assertFails(updateDoc(payRef(as(env, 'ceo')), { status: 'RELEASED' }));
  });

  it('DENIES releasing an OVER-PAYABLE amount (the sprint exit criterion)', async () => {
    // Even inflating the amount first is impossible: APPROVED payments are not
    // client-editable, and the RELEASE transition itself has no client branch.
    await assertFails(updateDoc(payRef(as(env, 'accounts')), {
      status: 'RELEASED', amount: 99_999_999,
    }));
  });

  it('DENIES ACCOUNTS editing the amount of an APPROVED payment', async () => {
    await assertFails(updateDoc(payRef(as(env, 'accounts')), { amount: 10_000_000 }));
  });

  it('DENIES rejecting a payment that is already APPROVED', async () => {
    await assertFails(updateDoc(payRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });
});

describe('payments — RELEASED is immutable and undeletable on the client', () => {
  beforeEach(() => seedPayment('RELEASED'));

  it('DENIES ADMIN deleting a RELEASED payment', async () => {
    await assertFails(deleteDoc(payRef(as(env, 'admin'))));
  });

  it('DENIES ACCOUNTS reversing a RELEASED payment', async () => {
    await assertFails(updateDoc(payRef(as(env, 'accounts')), { status: 'PENDING' }));
  });

  it('DENIES ADMIN editing a RELEASED payment amount', async () => {
    await assertFails(updateDoc(payRef(as(env, 'admin')), { amount: 1 }));
  });
});

describe('payments — delete', () => {
  it('ALLOWS an ADMIN to delete a PENDING payment', async () => {
    await seedPayment('PENDING');
    await assertSucceeds(deleteDoc(payRef(as(env, 'admin'))));
  });

  it('DENIES ACCOUNTS deleting a PENDING payment', async () => {
    await seedPayment('PENDING');
    await assertFails(deleteDoc(payRef(as(env, 'accounts'))));
  });
});
