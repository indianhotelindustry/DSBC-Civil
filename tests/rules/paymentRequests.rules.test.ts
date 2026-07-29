/**
 * firestore.rules — PAYMENT REQUESTS
 *
 * Workflow: Work Order → Payment Request (PM/Admin)
 *           → CEO approval (PENDING_APPROVAL → APPROVED | REJECTED)
 *           → Accounts payment (APPROVED → PAID)
 *
 * This block is the field-scoping exemplar in firestore.rules: each branch is
 * BOTH status-gated and field-scoped via diff().affectedKeys().hasOnly(...),
 * so a direct write cannot rewrite arbitrary fields while posing as a
 * transition. PAID is terminal for everyone except ADMIN.
 */

import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  UIDS, PR_ID, NOW, as, asAnonymous, getTestEnv, paymentRequest, resetWithUsers, seed, teardown,
} from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => { env = await getTestEnv(); });
afterAll(async () => { await teardown(); });
beforeEach(async () => { await resetWithUsers(env); });

const prRef = (db: ReturnType<typeof as>) => doc(db, 'paymentRequests', PR_ID);
const seedPR = (status: string) =>
  seed(env, [{ path: ['paymentRequests', PR_ID], data: paymentRequest({ status }) }]);

describe('paymentRequests — read', () => {
  beforeEach(() => seedPR('PENDING_APPROVAL'));

  it('ALLOWS any authenticated user to read (dashboards count scoped requests)', async () => {
    await assertSucceeds(getDoc(prRef(as(env, 'accounts'))));
  });

  it('DENIES an unauthenticated caller', async () => {
    await assertFails(getDoc(prRef(asAnonymous(env))));
  });
});

describe('paymentRequests — create', () => {
  it('ALLOWS a PM to raise a payment request', async () => {
    await assertSucceeds(setDoc(prRef(as(env, 'pm')), paymentRequest()));
  });

  it('ALLOWS an ADMIN to raise a payment request', async () => {
    await assertSucceeds(setDoc(prRef(as(env, 'admin')), paymentRequest()));
  });

  it('DENIES ACCOUNTS raising a payment request', async () => {
    await assertFails(setDoc(prRef(as(env, 'accounts')), paymentRequest()));
  });

  it('DENIES CEO raising a payment request (they approve, they do not initiate)', async () => {
    await assertFails(setDoc(prRef(as(env, 'ceo')), paymentRequest()));
  });

  it('DENIES an authenticated user with no profile document', async () => {
    await assertFails(setDoc(prRef(as(env, 'outsider')), paymentRequest()));
  });
});

describe('paymentRequests — CEO approval stage', () => {
  beforeEach(() => seedPR('PENDING_APPROVAL'));

  it('ALLOWS CEO: PENDING_APPROVAL → APPROVED within the permitted field set', async () => {
    await assertSucceeds(updateDoc(prRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW, updatedAt: NOW,
    }));
  });

  it('ALLOWS CEO: PENDING_APPROVAL → REJECTED with a reason', async () => {
    await assertSucceeds(updateDoc(prRef(as(env, 'ceo')), {
      status: 'REJECTED', rejectionReason: 'Budget exhausted', updatedAt: NOW,
    }));
  });

  it('DENIES CEO approving while ALSO inflating requestedAmount (field-scope guard)', async () => {
    await assertFails(updateDoc(prRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW, requestedAmount: 9_999_999,
    }));
  });

  it('DENIES CEO retargeting the work order during approval', async () => {
    await assertFails(updateDoc(prRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW, workOrderId: 'wo_other',
    }));
  });

  it('DENIES a PM approving their own request', async () => {
    await assertFails(updateDoc(prRef(as(env, 'pm')), {
      status: 'APPROVED', approvedBy: UIDS.pm, approvedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS approving a request', async () => {
    await assertFails(updateDoc(prRef(as(env, 'accounts')), {
      status: 'APPROVED', approvedBy: UIDS.accounts, approvedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS paying a request that has not been approved (stage skip)', async () => {
    await assertFails(updateDoc(prRef(as(env, 'accounts')), {
      status: 'PAID', paidBy: UIDS.accounts, paidAt: NOW, paymentMode: 'BANK_TRANSFER',
    }));
  });
});

describe('paymentRequests — ACCOUNTS payment stage', () => {
  beforeEach(() => seedPR('APPROVED'));

  it('ALLOWS ACCOUNTS: APPROVED → PAID within the permitted field set', async () => {
    await assertSucceeds(updateDoc(prRef(as(env, 'accounts')), {
      status: 'PAID',
      paidBy: UIDS.accounts,
      paidAt: NOW,
      paymentMode: 'BANK_TRANSFER',
      paymentReference: 'UTR123456',
      paymentRemarks: 'Released',
      updatedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS paying while ALSO changing the amount', async () => {
    await assertFails(updateDoc(prRef(as(env, 'accounts')), {
      status: 'PAID', paidBy: UIDS.accounts, paidAt: NOW, requestedAmount: 5_000_000,
    }));
  });

  it('DENIES a PM marking an approved request PAID', async () => {
    await assertFails(updateDoc(prRef(as(env, 'pm')), {
      status: 'PAID', paidBy: UIDS.pm, paidAt: NOW,
    }));
  });

  it('DENIES CEO marking an approved request PAID', async () => {
    await assertFails(updateDoc(prRef(as(env, 'ceo')), {
      status: 'PAID', paidBy: UIDS.ceo, paidAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS reverting an APPROVED request to PENDING_APPROVAL', async () => {
    await assertFails(updateDoc(prRef(as(env, 'accounts')), { status: 'PENDING_APPROVAL' }));
  });
});

describe('paymentRequests — PAID is terminal (except ADMIN)', () => {
  beforeEach(() => seedPR('PAID'));

  it('DENIES ACCOUNTS re-paying a PAID request (double-payment guard)', async () => {
    await assertFails(updateDoc(prRef(as(env, 'accounts')), {
      status: 'PAID', paidAt: NOW, paymentReference: 'UTR-DUPLICATE',
    }));
  });

  it('DENIES CEO reopening a PAID request', async () => {
    await assertFails(updateDoc(prRef(as(env, 'ceo')), { status: 'PENDING_APPROVAL' }));
  });

  it('DENIES a PM editing a PAID request', async () => {
    await assertFails(updateDoc(prRef(as(env, 'pm')), { requestedAmount: 1 }));
  });

  it('ALLOWS an ADMIN emergency data fix on a PAID request (documented override)', async () => {
    await assertSucceeds(updateDoc(prRef(as(env, 'admin')), { remarks: 'Corrected UTR' }));
  });
});

describe('paymentRequests — delete', () => {
  beforeEach(() => seedPR('PENDING_APPROVAL'));

  it('ALLOWS an ADMIN to delete', async () => {
    await assertSucceeds(deleteDoc(prRef(as(env, 'admin'))));
  });

  it('DENIES a PM deleting their own request', async () => {
    await assertFails(deleteDoc(prRef(as(env, 'pm'))));
  });

  it('DENIES CEO deleting', async () => {
    await assertFails(deleteDoc(prRef(as(env, 'ceo'))));
  });
});
