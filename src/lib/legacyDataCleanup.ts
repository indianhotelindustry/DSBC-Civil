/**
 * Legacy data cleanup utilities.
 *
 * Identifies and backfills projects that are missing companyId.
 * These were created before multi-company support was added.
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Company } from '../types';

export interface LegacyProjectInfo {
  id: string;
  name: string;
}

/**
 * Returns projects that have no companyId set.
 * These are legacy records created before multi-company support.
 */
export async function findLegacyProjects(): Promise<LegacyProjectInfo[]> {
  const snapshot = await getDocs(collection(db, 'projects'));
  const legacy: LegacyProjectInfo[] = [];

  snapshot.docs.forEach(d => {
    const data = d.data();
    if (!data.companyId) {
      legacy.push({ id: d.id, name: data.name || 'Unnamed' });
    }
  });

  return legacy;
}

/**
 * Assign a companyId to all projects that don't have one.
 * This is a one-time migration — safe to run multiple times (idempotent).
 *
 * @param targetCompanyId - The company ID to assign (e.g., 'sipl')
 * @returns Number of projects updated
 */
export async function backfillProjectCompanyId(targetCompanyId: string): Promise<number> {
  const legacy = await findLegacyProjects();
  let updated = 0;

  for (const project of legacy) {
    await updateDoc(doc(db, 'projects', project.id), {
      companyId: targetCompanyId
    });
    updated++;
  }

  return updated;
}
