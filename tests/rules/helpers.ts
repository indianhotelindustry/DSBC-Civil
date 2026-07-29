/**
 * Shared harness for the Firestore rules-unit-test suite (NN-29 / TEST-3).
 *
 * These tests exercise `firestore.rules` — the production trust boundary
 * (NN-1) — against the Firestore emulator. They assert BOTH directions:
 * that permitted transitions still succeed, and that forbidden ones are
 * denied. Nothing here may weaken a rule; the suite only observes.
 *
 * IMPORTANT — how roles resolve:
 * `firestore.rules` reads the caller's role from the `users/{uid}` document
 * via `get()`, not from a custom claim. Every test therefore seeds a users
 * document per persona (see `seedUsers`). A user with NO profile document
 * causes `getUserData().role` to error, which Firestore treats as a denial —
 * that is the `outsider` persona, and it is a legitimate negative case.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, type Firestore } from 'firebase/firestore';

/** Personas. Keys are stable; values are the emulator uids. */
export const UIDS = {
  admin: 'uid_admin',
  superAdmin: 'uid_super_admin',
  ceo: 'uid_ceo',
  pm: 'uid_pm',
  pm2: 'uid_pm_2',
  accounts: 'uid_accounts',
  purchase: 'uid_purchase_manager',
  storeManager: 'uid_store_manager',
  storeKeeper: 'uid_store_keeper',
  /** Authenticated, but has NO users/{uid} profile — role lookup fails. */
  outsider: 'uid_outsider',
} as const;

export type PersonaKey = keyof typeof UIDS;

const ROLE_BY_PERSONA: Record<Exclude<PersonaKey, 'outsider'>, string> = {
  admin: 'ADMIN',
  superAdmin: 'SUPER_ADMIN',
  ceo: 'CEO',
  pm: 'PROJECT_MANAGER',
  pm2: 'PROJECT_MANAGER',
  accounts: 'ACCOUNTS',
  purchase: 'PURCHASE_MANAGER',
  storeManager: 'STORE_MANAGER',
  storeKeeper: 'STORE_KEEPER',
};

/** Fixed clock — tests must be hermetic (TEST-5). */
export const NOW = '2026-01-15T10:00:00.000Z';

let testEnv: RulesTestEnvironment | null = null;

export async function getTestEnv(): Promise<RulesTestEnvironment> {
  if (testEnv) return testEnv;
  const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'dsbc-civil-rules-test',
    firestore: {
      rules,
      // `firebase emulators:exec` injects FIRESTORE_EMULATOR_HOST; the literals
      // are only a fallback and must match firebase.json → emulators.firestore.
      host: process.env.FIRESTORE_EMULATOR_HOST?.split(':')[0] ?? '127.0.0.1',
      port: Number(process.env.FIRESTORE_EMULATOR_HOST?.split(':')[1] ?? 8085),
    },
  });
  return testEnv;
}

export async function teardown(): Promise<void> {
  if (testEnv) {
    await testEnv.cleanup();
    testEnv = null;
  }
}

/** Firestore handle acting as the given persona. */
export function as(env: RulesTestEnvironment, persona: PersonaKey): Firestore {
  return env
    .authenticatedContext(UIDS[persona], {
      email: `${persona}@dsbc.test`,
      email_verified: true,
    })
    .firestore() as unknown as Firestore;
}

/** Firestore handle for a signed-out caller. */
export function asAnonymous(env: RulesTestEnvironment): Firestore {
  return env.unauthenticatedContext().firestore() as unknown as Firestore;
}

/**
 * Seed one `users/{uid}` profile per persona, bypassing rules.
 * `outsider` is intentionally NOT seeded.
 */
export async function seedUsers(env: RulesTestEnvironment): Promise<void> {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore() as unknown as Firestore;
    for (const [persona, role] of Object.entries(ROLE_BY_PERSONA)) {
      const uid = UIDS[persona as PersonaKey];
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: `${persona}@dsbc.test`,
        displayName: persona,
        role,
        status: 'ACTIVE',
        createdAt: NOW,
      });
    }
  });
}

/** Write arbitrary fixture documents with rules bypassed. */
export async function seed(
  env: RulesTestEnvironment,
  docs: Array<{ path: [collection: string, id: string]; data: Record<string, unknown> }>,
): Promise<void> {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore() as unknown as Firestore;
    for (const d of docs) {
      await setDoc(doc(db, d.path[0], d.path[1]), d.data);
    }
  });
}

/** Reset data and re-seed the personas. Call in `beforeEach`. */
export async function resetWithUsers(env: RulesTestEnvironment): Promise<void> {
  await env.clearFirestore();
  await seedUsers(env);
}

// ===============================================================
// Domain fixtures — minimal shapes matching src/types.ts
// ===============================================================

export const WO_ID = 'wo_1';
export const BILL_ID = 'bill_1';
export const PAYMENT_ID = 'pay_1';
export const VO_ID = 'vo_1';
export const PR_ID = 'pr_1';

export function workOrder(overrides: Record<string, unknown> = {}) {
  return {
    woNumber: 'WO-2026-0001',
    projectId: 'proj_1',
    contractorId: 'contractor_1',
    title: 'Structural works',
    description: 'Phase 1',
    amount: 1_000_000,
    status: 'PENDING',
    issueDate: NOW,
    startDate: NOW,
    endDate: NOW,
    preparedBy: UIDS.pm,
    scopeOfWork: 'As per BOQ',
    boqItems: [{ description: 'Item', unit: 'cum', quantity: 10, rate: 100, amount: 1000 }],
    financials: {
      totalAmount: 1_000_000,
      advance: 0,
      subtotal: 1_000_000,
      gstPercentage: 18,
      gstAmount: 180_000,
      retentionPercentage: 5,
      retentionAmount: 50_000,
      otherCharges: 0,
      grandTotal: 1_130_000,
    },
    billing: { totalValue: 1_130_000 },
    createdAt: NOW,
    createdBy: UIDS.pm,
    ...overrides,
  };
}

export function bill(overrides: Record<string, unknown> = {}) {
  return {
    billNumber: 'BILL-001',
    workOrderId: WO_ID,
    billDate: NOW,
    workDoneAmount: 100_000,
    previousBillAmount: 0,
    currentBillAmount: 100_000,
    tdsPercentage: 2,
    tdsAmount: 2_000,
    retentionPercentage: 5,
    retentionAmount: 5_000,
    advanceAdjustment: 0,
    netPayable: 93_000,
    status: 'DRAFT',
    createdAt: NOW,
    createdBy: UIDS.accounts,
    ...overrides,
  };
}

export function payment(overrides: Record<string, unknown> = {}) {
  return {
    billId: BILL_ID,
    amount: 93_000,
    paymentDate: NOW,
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING',
    createdAt: NOW,
    createdBy: UIDS.accounts,
    ...overrides,
  };
}

export function variationOrder(overrides: Record<string, unknown> = {}) {
  return {
    workOrderId: WO_ID,
    voNumber: 'VO-001',
    description: 'Additional works',
    reason: 'Client request',
    amount: 50_000,
    status: 'DRAFT',
    createdAt: NOW,
    createdBy: UIDS.pm,
    ...overrides,
  };
}

export function paymentRequest(overrides: Record<string, unknown> = {}) {
  return {
    companyId: 'company_1',
    projectId: 'proj_1',
    workOrderId: WO_ID,
    contractorId: 'contractor_1',
    type: 'ADVANCE',
    requestedAmount: 200_000,
    requestedBy: UIDS.pm,
    requestedAt: NOW,
    status: 'PENDING_APPROVAL',
    createdAt: NOW,
    createdBy: UIDS.pm,
    ...overrides,
  };
}
