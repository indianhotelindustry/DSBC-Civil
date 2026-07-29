/**
 * firestore.rules — WORK ORDERS
 *
 * Status flow: PENDING → APPROVED → COMPLETED · PENDING → REJECTED
 * Identity fields (woNumber/createdAt/createdBy) are immutable for EVERY role.
 * The VO-approval path that rewrites APPROVED-WO financials is server-authoritative
 * and intentionally has no client branch (Platform Stabilization v1.1).
 */

import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  UIDS, WO_ID, NOW, as, asAnonymous, getTestEnv, resetWithUsers, seed, teardown, workOrder,
} from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => { env = await getTestEnv(); });
afterAll(async () => { await teardown(); });
beforeEach(async () => { await resetWithUsers(env); });

const woRef = (db: ReturnType<typeof as>) => doc(db, 'workOrders', WO_ID);

describe('workOrders — read', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder() }]);
  });

  it('ALLOWS any authenticated user to read', async () => {
    await assertSucceeds(getDoc(woRef(as(env, 'accounts'))));
  });

  it('DENIES an unauthenticated caller', async () => {
    await assertFails(getDoc(woRef(asAnonymous(env))));
  });
});

describe('workOrders — create', () => {
  it('ALLOWS a PM to create a PENDING work order', async () => {
    await assertSucceeds(setDoc(woRef(as(env, 'pm')), workOrder()));
  });

  it('ALLOWS an ADMIN to create a PENDING work order', async () => {
    await assertSucceeds(setDoc(woRef(as(env, 'admin')), workOrder()));
  });

  it('DENIES ACCOUNTS creating a work order', async () => {
    await assertFails(setDoc(woRef(as(env, 'accounts')), workOrder()));
  });

  it('DENIES CEO creating a work order', async () => {
    await assertFails(setDoc(woRef(as(env, 'ceo')), workOrder()));
  });

  it('DENIES creating a work order that is already APPROVED (self-approval at birth)', async () => {
    await assertFails(setDoc(woRef(as(env, 'pm')), workOrder({ status: 'APPROVED' })));
  });

  it('DENIES an authenticated user with no profile document', async () => {
    await assertFails(setDoc(woRef(as(env, 'outsider')), workOrder()));
  });
});

describe('workOrders — PM edits while PENDING', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder() }]);
  });

  it('ALLOWS a PM to edit any field while PENDING', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'pm')), { title: 'Revised scope', amount: 1_200_000 }));
  });

  it('ALLOWS a PM to reject: PENDING → REJECTED (status only)', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'pm')), { status: 'REJECTED' }));
  });

  // ---------------------------------------------------------------
  // GAP R-1 — CLOSED by ADR-0001 (accepted 2026-07-29).
  //
  // firestore.rules:193 was `(isPM() && currentStatus() == 'PENDING')` — an
  // UNSCOPED branch permitting a PM to change ANY field while the WO was
  // PENDING, `status` included. It subsumed the field-scoped CEO-approval
  // branch, letting a PROJECT_MANAGER self-approve and bypass the CEO gate.
  //
  // The branch now carries `statusUnchanged()`. It still grants full edit
  // rights over every OTHER field — that is intended behaviour and is
  // covered by the ALLOW tests above. Only the status change is removed.
  // ---------------------------------------------------------------
  it('DENIES a PM self-APPROVING their own PENDING work order (ADR-0001 / R-1)', async () => {
    await assertFails(updateDoc(woRef(as(env, 'pm')), {
      status: 'APPROVED', approvedBy: UIDS.pm, approvedAt: NOW,
    }));
  });

  it('DENIES a PM setting status to APPROVED alone', async () => {
    await assertFails(updateDoc(woRef(as(env, 'pm')), { status: 'APPROVED' }));
  });

  it('DENIES a PM jumping a PENDING work order to COMPLETED', async () => {
    await assertFails(updateDoc(woRef(as(env, 'pm')), { status: 'COMPLETED' }));
  });

  it('DENIES a PM rejecting while ALSO editing another field', async () => {
    await assertFails(updateDoc(woRef(as(env, 'pm')), { status: 'REJECTED', amount: 1 }));
  });

  // Regression guard for the real client write pattern: WorkOrders.tsx strips
  // `status` before calling workOrderService.update, but Bills-style payloads
  // that echo the CURRENT status back must keep working — statusUnchanged()
  // compares values, it does not forbid the field being present.
  it('ALLOWS a PM to edit while echoing the unchanged status back in the payload', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'pm')), {
      status: 'PENDING', title: 'Revised title', amount: 1_100_000,
    }));
  });

  it('DENIES ACCOUNTS editing a PENDING work order', async () => {
    await assertFails(updateDoc(woRef(as(env, 'accounts')), { title: 'Nope' }));
  });
});

describe('workOrders — CEO approval', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder() }]);
  });

  it('ALLOWS CEO: PENDING → APPROVED with exactly the approval fields', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW,
    }));
  });

  it('DENIES CEO approving while ALSO rewriting financials (field-scope guard)', async () => {
    await assertFails(updateDoc(woRef(as(env, 'ceo')), {
      status: 'APPROVED',
      approvedBy: UIDS.ceo,
      approvedAt: NOW,
      amount: 9_999_999,
    }));
  });

  it('DENIES CEO skipping the workflow: PENDING → COMPLETED', async () => {
    await assertFails(updateDoc(woRef(as(env, 'ceo')), { status: 'COMPLETED' }));
  });

  it('DENIES ACCOUNTS approving a work order', async () => {
    await assertFails(updateDoc(woRef(as(env, 'accounts')), {
      status: 'APPROVED', approvedBy: UIDS.accounts, approvedAt: NOW,
    }));
  });
});

describe('workOrders — post-approval lock (server-authoritative financials)', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder({ status: 'APPROVED' }) }]);
  });

  it('ALLOWS CEO: APPROVED → COMPLETED (status only)', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'ceo')), { status: 'COMPLETED' }));
  });

  it('DENIES CEO rewriting financials on an APPROVED work order (VO path is server-only)', async () => {
    await assertFails(updateDoc(woRef(as(env, 'ceo')), {
      amount: 1_050_000,
      financials: { ...workOrder().financials, totalAmount: 1_050_000, grandTotal: 1_189_000 },
    }));
  });

  it('DENIES a PM editing an APPROVED work order', async () => {
    await assertFails(updateDoc(woRef(as(env, 'pm')), { title: 'Sneaky edit' }));
  });

  it('DENIES ACCOUNTS editing an APPROVED work order', async () => {
    await assertFails(updateDoc(woRef(as(env, 'accounts')), { amount: 5 }));
  });
});

describe('workOrders — identity fields are immutable for every role', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder() }]);
  });

  it('DENIES an ADMIN rotating woNumber', async () => {
    await assertFails(updateDoc(woRef(as(env, 'admin')), { woNumber: 'WO-2026-9999' }));
  });

  it('DENIES an ADMIN rewriting createdBy', async () => {
    await assertFails(updateDoc(woRef(as(env, 'admin')), { createdBy: UIDS.admin }));
  });

  it('DENIES an ADMIN rewriting createdAt', async () => {
    await assertFails(updateDoc(woRef(as(env, 'admin')), { createdAt: '2020-01-01T00:00:00.000Z' }));
  });

  it('ALLOWS an ADMIN override that leaves identity intact (documented escape hatch)', async () => {
    await assertSucceeds(updateDoc(woRef(as(env, 'admin')), { title: 'Admin correction' }));
  });
});

describe('workOrders — delete', () => {
  beforeEach(async () => {
    await seed(env, [{ path: ['workOrders', WO_ID], data: workOrder() }]);
  });

  it('ALLOWS an ADMIN to delete', async () => {
    await assertSucceeds(deleteDoc(woRef(as(env, 'admin'))));
  });

  it('DENIES a PM deleting', async () => {
    await assertFails(deleteDoc(woRef(as(env, 'pm'))));
  });

  it('DENIES CEO deleting', async () => {
    await assertFails(deleteDoc(woRef(as(env, 'ceo'))));
  });
});
