/**
 * Seed the default work-category list the first time Masters loads.
 *
 * Idempotent via predictable doc ids (slugified names):
 *   workCategories/plumbing-work, workCategories/electric-work, …
 * Re-running the seed with the same defaults is a no-op; custom
 * categories added later by admins are never touched.
 *
 * Assumes Firestore rules permit admin/PM writes on workCategories.
 * Failures (network, permission) are logged, not thrown — the seed is
 * best-effort and the Masters page still works without it.
 */

import { collection, getDocs, doc, setDoc, query } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_WORK_CATEGORIES: Array<{ id: string; name: string; displayOrder: number }> = [
  { id: 'plumbing-work',  name: 'Plumbing Work',  displayOrder: 10 },
  { id: 'electric-work',  name: 'Electric Work',  displayOrder: 20 },
  { id: 'civil-work',     name: 'Civil Work',     displayOrder: 30 },
  { id: 'paint-putty',    name: 'Paint Putty',    displayOrder: 40 },
  { id: 'carpenter',      name: 'Carpenter',      displayOrder: 50 },
  { id: 'refrigeration',  name: 'Refrigeration',  displayOrder: 60 },
  { id: 'tiles-marble',   name: 'Tiles & Marble', displayOrder: 70 },
  { id: 'boaring',        name: 'Boaring',        displayOrder: 80 },
];

let seeded = false;

export async function ensureWorkCategoriesExist(): Promise<void> {
  if (seeded) return;
  seeded = true;

  try {
    // Index by id to see which defaults are missing. We do NOT bail on
    // "collection non-empty" (as the company seed does) because an
    // admin may have added custom categories before the default set —
    // we still want to backfill any missing defaults.
    const snapshot = await getDocs(query(collection(db, 'workCategories')));
    const existingIds = new Set(snapshot.docs.map(d => d.id));
    const missing = DEFAULT_WORK_CATEGORIES.filter(c => !existingIds.has(c.id));
    if (missing.length === 0) return;

    const now = new Date().toISOString();
    for (const cat of missing) {
      await setDoc(doc(db, 'workCategories', cat.id), {
        name: cat.name,
        displayOrder: cat.displayOrder,
        isActive: true,
        createdAt: now,
        createdBy: 'system-seed',
        updatedAt: now,
      });
    }
    console.log(`[seed] Created ${missing.length} default work categories`);
  } catch (error) {
    // Best-effort seed. If rules block (non-admin user opened Masters)
    // or the network fails, the Masters page still loads — just
    // without auto-seeded defaults. Admins can add them manually.
    console.error('[seed] Failed to seed work categories:', error);
  }
  // `seeded` stays true so repeated Masters navigations don't hammer
  // the collection with getDocs. A full reload resets the flag, which
  // is exactly when we'd want to re-check.
}
