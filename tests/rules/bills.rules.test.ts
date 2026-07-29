/**
 * firestore.rules — BILLS
 *
 * Status flow: DRAFT → VERIFIED → APPROVED → PARTIALLY_PAID → PAID
 *              DRAFT | VERIFIED → REJECTED
 *
 * SERVER-AUTHORITATIVE (Platform Stabilization v1.1): bill APPROVE
 * (VERIFIED → APPROVED) and payment-driven MARK PAID have NO client branch —
 * they are reachable only through the Admin SDK. These are the tests that
 * close AUDIT SECURITY C-3 and satisfy CURRENT_SPRINT Definition-of-Success #1.
 */

import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  UIDS, BILL_ID, NOW, as, asAnonymous, bill, getTestEnv, resetWithUsers, seed, teardown,
} from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => { env = await getTestEnv(); });
afterAll(async () => { await teardown(); });
beforeEach(async () => { await resetWithUsers(env); });

const billRef = (db: ReturnType<typeof as>) => doc(db, 'bills', BILL_ID);
const seedBill = (status: string) =>
  seed(env, [{ path: ['bills', BILL_ID], data: bill({ status }) }]);

describe('bills — read', () => {
  beforeEach(() => seedBill('DRAFT'));

  it('ALLOWS any authenticated user to read', async () => {
    await assertSucceeds(getDoc(billRef(as(env, 'pm'))));
  });

  it('DENIES an unauthenticated caller', async () => {
    await assertFails(getDoc(billRef(asAnonymous(env))));
  });
});

describe('bills — create', () => {
  it('ALLOWS ACCOUNTS to create a DRAFT bill', async () => {
    await assertSucceeds(setDoc(billRef(as(env, 'accounts')), bill()));
  });

  it('ALLOWS ADMIN to create a DRAFT bill', async () => {
    await assertSucceeds(setDoc(billRef(as(env, 'admin')), bill()));
  });

  it('DENIES a PM creating a bill', async () => {
    await assertFails(setDoc(billRef(as(env, 'pm')), bill()));
  });

  it('DENIES CEO creating a bill', async () => {
    await assertFails(setDoc(billRef(as(env, 'ceo')), bill()));
  });

  it('DENIES creating a bill that starts at VERIFIED', async () => {
    await assertFails(setDoc(billRef(as(env, 'accounts')), bill({ status: 'VERIFIED' })));
  });

  it('DENIES creating a bill that starts at APPROVED', async () => {
    await assertFails(setDoc(billRef(as(env, 'accounts')), bill({ status: 'APPROVED' })));
  });

  it('DENIES creating a bill whose netPayable is not a number', async () => {
    await assertFails(setDoc(billRef(as(env, 'accounts')), bill({ netPayable: 'lots' })));
  });

  it('DENIES creating a bill with no workOrderId string', async () => {
    await assertFails(setDoc(billRef(as(env, 'accounts')), bill({ workOrderId: 42 })));
  });
});

describe('bills — DRAFT editing and verification', () => {
  beforeEach(() => seedBill('DRAFT'));

  it('ALLOWS ACCOUNTS to edit a DRAFT bill', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'accounts')), { workDoneAmount: 120_000 }));
  });

  it('ALLOWS a PM to verify: DRAFT → VERIFIED with exactly the verify fields', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'pm')), {
      status: 'VERIFIED', verifiedBy: UIDS.pm, verifiedAt: NOW,
    }));
  });

  it('DENIES a PM verifying while also changing the amount', async () => {
    await assertFails(updateDoc(billRef(as(env, 'pm')), {
      status: 'VERIFIED', verifiedBy: UIDS.pm, verifiedAt: NOW, netPayable: 999_999,
    }));
  });

  // ---------------------------------------------------------------
  // GAP R-2 — CLOSED by ADR-0001 (accepted 2026-07-29).
  //
  // firestore.rules:245 was `((isAccounts() || isAdmin()) && currentStatus() == 'DRAFT')`
  // — an UNSCOPED branch permitting ANY field change on a DRAFT bill,
  // `status` included. It subsumed the field-scoped PM-verify branch, so
  // ACCOUNTS could verify the very bills it creates.
  //
  // The branch now carries `statusUnchanged()`. ACCOUNTS keeps full edit
  // rights over every other field on a DRAFT bill (covered above); only the
  // status change is removed. Verification is now PM-only at the boundary,
  // matching server/secureRoutes.ts verifyBill and the rule's own comment.
  // ---------------------------------------------------------------
  it('DENIES ACCOUNTS self-VERIFYING a DRAFT bill (ADR-0001 / R-2)', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), {
      status: 'VERIFIED', verifiedBy: UIDS.accounts, verifiedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS setting status to VERIFIED alone', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { status: 'VERIFIED' }));
  });

  it('DENIES ACCOUNTS jumping a DRAFT bill straight to APPROVED', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), {
      status: 'APPROVED', approvedBy: UIDS.accounts, approvedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS jumping a DRAFT bill straight to PAID', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { status: 'PAID' }));
  });

  // ADR-0001 consequence, pinned deliberately: ADMIN also loses the
  // client-side verify path (it flowed through the same broad branch).
  // The sanctioned ADMIN route is server/secureRoutes.ts verifyBill, which
  // writes via the Admin SDK and bypasses rules entirely — so no supported
  // workflow regresses. Only a direct client-SDK write is blocked.
  it('DENIES ADMIN verifying a DRAFT bill from the client (server route is the ADMIN path)', async () => {
    await assertFails(updateDoc(billRef(as(env, 'admin')), {
      status: 'VERIFIED', verifiedBy: UIDS.admin, verifiedAt: NOW,
    }));
  });

  // Regression guard for the real client write pattern: Bills.tsx sends the
  // whole form payload including `status: bill.status` on every DRAFT edit.
  // statusUnchanged() compares values, so echoing DRAFT back is still fine.
  it('ALLOWS ACCOUNTS to edit a DRAFT bill while echoing the unchanged status back', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'accounts')), {
      status: 'DRAFT', workDoneAmount: 150_000, netPayable: 139_500,
    }));
  });

  it('ALLOWS ADMIN to edit a DRAFT bill while echoing the unchanged status back', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'admin')), {
      status: 'DRAFT', workDoneAmount: 90_000,
    }));
  });

  it('DENIES a DRAFT bill jumping straight to APPROVED', async () => {
    await assertFails(updateDoc(billRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW,
    }));
  });

  it('ALLOWS a PM to reject a DRAFT bill', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'pm')), { status: 'REJECTED' }));
  });

  it('ALLOWS CEO to reject a DRAFT bill', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });
});

describe('bills — APPROVE is server-authoritative (no client branch exists)', () => {
  beforeEach(() => seedBill('VERIFIED'));

  it('DENIES CEO approving a VERIFIED bill from the client', async () => {
    await assertFails(updateDoc(billRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW,
    }));
  });

  it('DENIES ADMIN approving a VERIFIED bill from the client', async () => {
    await assertFails(updateDoc(billRef(as(env, 'admin')), {
      status: 'APPROVED', approvedBy: UIDS.admin, approvedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS approving a VERIFIED bill from the client', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), {
      status: 'APPROVED', approvedBy: UIDS.accounts, approvedAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS editing amounts once VERIFIED', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { netPayable: 1 }));
  });

  it('ALLOWS CEO to reject a VERIFIED bill (rejection stays client-side)', async () => {
    await assertSucceeds(updateDoc(billRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });
});

describe('bills — MARK PAID is server-authoritative (closes AUDIT SECURITY C-3)', () => {
  beforeEach(() => seedBill('APPROVED'));

  it('DENIES ACCOUNTS marking an APPROVED bill PAID with no payment behind it', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), {
      status: 'PAID', paidBy: UIDS.accounts, paidAt: NOW,
    }));
  });

  it('DENIES ADMIN marking an APPROVED bill PAID from the client', async () => {
    await assertFails(updateDoc(billRef(as(env, 'admin')), {
      status: 'PAID', paidBy: UIDS.admin, paidAt: NOW,
    }));
  });

  it('DENIES ACCOUNTS marking an APPROVED bill PARTIALLY_PAID from the client', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { status: 'PARTIALLY_PAID' }));
  });

  it('DENIES ACCOUNTS rewriting the payable amount on an APPROVED bill', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { netPayable: 10_000_000 }));
  });

  it('DENIES rejecting a bill that is already APPROVED', async () => {
    await assertFails(updateDoc(billRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });
});

describe('bills — PAID is terminal on the client', () => {
  beforeEach(() => seedBill('PAID'));

  it('DENIES ACCOUNTS reopening a PAID bill', async () => {
    await assertFails(updateDoc(billRef(as(env, 'accounts')), { status: 'APPROVED' }));
  });

  it('DENIES ADMIN editing a PAID bill', async () => {
    await assertFails(updateDoc(billRef(as(env, 'admin')), { netPayable: 0 }));
  });
});

describe('bills — delete', () => {
  beforeEach(() => seedBill('DRAFT'));

  it('ALLOWS an ADMIN to delete', async () => {
    await assertSucceeds(deleteDoc(billRef(as(env, 'admin'))));
  });

  it('DENIES ACCOUNTS deleting', async () => {
    await assertFails(deleteDoc(billRef(as(env, 'accounts'))));
  });

  it('DENIES a PM deleting', async () => {
    await assertFails(deleteDoc(billRef(as(env, 'pm'))));
  });
});
