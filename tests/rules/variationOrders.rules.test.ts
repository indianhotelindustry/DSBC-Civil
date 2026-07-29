/**
 * firestore.rules — VARIATION ORDERS
 *
 * Status flow: DRAFT → APPROVED (server) · DRAFT → REJECTED (CEO, client)
 *
 * SERVER-AUTHORITATIVE (Platform Stabilization v1.1): VO APPROVAL has NO client
 * branch, because approving a VO also rewrites the parent work order's
 * financials — a money mutation that must happen inside one server transaction
 * (server/secureRoutes.ts approveVariationOrder). Approved VOs can never be
 * deleted, since they have already moved WO money.
 */

import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  UIDS, VO_ID, NOW, as, asAnonymous, getTestEnv, resetWithUsers, seed, teardown, variationOrder,
} from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => { env = await getTestEnv(); });
afterAll(async () => { await teardown(); });
beforeEach(async () => { await resetWithUsers(env); });

const voRef = (db: ReturnType<typeof as>) => doc(db, 'variationOrders', VO_ID);
const seedVO = (status: string) =>
  seed(env, [{ path: ['variationOrders', VO_ID], data: variationOrder({ status }) }]);

describe('variationOrders — read', () => {
  beforeEach(() => seedVO('DRAFT'));

  it('ALLOWS any authenticated user to read', async () => {
    await assertSucceeds(getDoc(voRef(as(env, 'accounts'))));
  });

  it('DENIES an unauthenticated caller', async () => {
    await assertFails(getDoc(voRef(asAnonymous(env))));
  });
});

describe('variationOrders — create', () => {
  it('ALLOWS a PM to create a DRAFT variation order', async () => {
    await assertSucceeds(setDoc(voRef(as(env, 'pm')), variationOrder()));
  });

  it('ALLOWS an ADMIN to create a DRAFT variation order', async () => {
    await assertSucceeds(setDoc(voRef(as(env, 'admin')), variationOrder()));
  });

  it('DENIES ACCOUNTS creating a variation order', async () => {
    await assertFails(setDoc(voRef(as(env, 'accounts')), variationOrder()));
  });

  it('DENIES CEO creating a variation order', async () => {
    await assertFails(setDoc(voRef(as(env, 'ceo')), variationOrder()));
  });

  it('DENIES creating a variation order that is already APPROVED', async () => {
    await assertFails(setDoc(voRef(as(env, 'pm')), variationOrder({ status: 'APPROVED' })));
  });

  it('DENIES creating a variation order with no workOrderId string', async () => {
    await assertFails(setDoc(voRef(as(env, 'pm')), variationOrder({ workOrderId: 7 })));
  });
});

describe('variationOrders — DRAFT editing', () => {
  beforeEach(() => seedVO('DRAFT'));

  it('ALLOWS a PM to edit a DRAFT variation order', async () => {
    await assertSucceeds(updateDoc(voRef(as(env, 'pm')), { amount: 75_000 }));
  });

  it('ALLOWS an ADMIN to edit a DRAFT variation order', async () => {
    await assertSucceeds(updateDoc(voRef(as(env, 'admin')), { description: 'Revised' }));
  });

  it('DENIES ACCOUNTS editing a DRAFT variation order', async () => {
    await assertFails(updateDoc(voRef(as(env, 'accounts')), { amount: 1 }));
  });

  it('ALLOWS CEO to reject a DRAFT variation order (status only)', async () => {
    await assertSucceeds(updateDoc(voRef(as(env, 'ceo')), { status: 'REJECTED' }));
  });

  it('DENIES CEO rejecting while also changing the amount', async () => {
    await assertFails(updateDoc(voRef(as(env, 'ceo')), { status: 'REJECTED', amount: 0 }));
  });

  it('DENIES a PM rejecting a variation order', async () => {
    await assertFails(updateDoc(voRef(as(env, 'pm')), { status: 'REJECTED' }));
  });
});

describe('variationOrders — APPROVAL is server-authoritative (it moves WO money)', () => {
  beforeEach(() => seedVO('DRAFT'));

  it('DENIES CEO approving a variation order from the client', async () => {
    await assertFails(updateDoc(voRef(as(env, 'ceo')), {
      status: 'APPROVED', approvedBy: UIDS.ceo, approvedAt: NOW,
    }));
  });

  it('DENIES ADMIN approving a variation order from the client', async () => {
    await assertFails(updateDoc(voRef(as(env, 'admin')), {
      status: 'APPROVED', approvedBy: UIDS.admin, approvedAt: NOW,
    }));
  });

  it('DENIES a PM approving their own variation order', async () => {
    await assertFails(updateDoc(voRef(as(env, 'pm')), { status: 'APPROVED' }));
  });
});

describe('variationOrders — APPROVED is locked', () => {
  beforeEach(() => seedVO('APPROVED'));

  it('DENIES an ADMIN deleting an APPROVED variation order (it changed WO financials)', async () => {
    await assertFails(deleteDoc(voRef(as(env, 'admin'))));
  });

  it('DENIES a PM editing an APPROVED variation order', async () => {
    await assertFails(updateDoc(voRef(as(env, 'pm')), { amount: 1 }));
  });

  it('DENIES CEO reverting an APPROVED variation order to DRAFT', async () => {
    await assertFails(updateDoc(voRef(as(env, 'ceo')), { status: 'DRAFT' }));
  });
});

describe('variationOrders — delete', () => {
  it('ALLOWS an ADMIN to delete a DRAFT variation order', async () => {
    await seedVO('DRAFT');
    await assertSucceeds(deleteDoc(voRef(as(env, 'admin'))));
  });

  it('DENIES a PM deleting a DRAFT variation order', async () => {
    await seedVO('DRAFT');
    await assertFails(deleteDoc(voRef(as(env, 'pm'))));
  });
});
