/**
 * Seed the two fixed company records if they don't exist.
 * Called once when an admin loads the Masters page.
 * Idempotent — checks before writing.
 */

import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const COMPANIES = [
  {
    id: 'sipl',
    code: 'SIPL',
    name: 'Satpura Infracon Pvt Ltd',
    businessType: 'CONSTRUCTION',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    tagline: 'Building Excellence Since 1998',
    isActive: true,
  },
  {
    id: 'shspl',
    code: 'SHSPL',
    name: 'Satpura Hospitality Solutions Pvt Ltd',
    businessType: 'HOSPITALITY',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    tagline: 'Hospitality Redefined',
    isActive: true,
  },
];

let seeded = false;

export async function ensureCompaniesExist(): Promise<void> {
  if (seeded) return;
  seeded = true;

  try {
    const snapshot = await getDocs(collection(db, 'companies'));
    if (snapshot.size > 0) return; // Already have companies

    const now = new Date().toISOString();
    for (const company of COMPANIES) {
      const { id, ...data } = company;
      await setDoc(doc(db, 'companies', id), {
        ...data,
        createdAt: now,
        createdBy: 'system-seed',
      });
    }
    console.log('[seed] Created 2 company records (SIPL, SHSPL)');
  } catch (error) {
    // Silently fail — companies may be created manually or user may not have permissions
    console.error('[seed] Failed to seed companies:', error);
  }
}
