/**
 * Guards the Firestore composite-index definition (DEPLOYMENT_READINESS_REPORT D-2).
 *
 * WHY THIS TEST EXISTS
 * `server/backgroundJobs.ts` → `createAlert` runs a query with TWO equality
 * filters and ONE range filter:
 *
 *   alerts.where('type','==',…).where('relatedId','==',…).where('timestamp','>=',…)
 *
 * Firestore rejects that with FAILED_PRECONDITION unless a matching composite
 * index exists. The failure mode is the dangerous part: `runAlertEngine` wraps
 * its body in `try { … } catch { console.error(…) }`, so a missing index makes
 * the scheduled job report SUCCESS while producing zero alerts — externally
 * indistinguishable from "nothing to alert about".
 *
 * So the index is load-bearing and its absence is silent. This test pins it.
 * It is hermetic — it only reads two JSON files, no emulator, no network.
 *
 * NOTE: the Firestore emulator does NOT enforce composite indexes (it serves any
 * query), so an emulator test cannot catch a missing index. Static pinning here
 * plus verification against a real project post-deploy is the only coverage
 * available. See DEPLOYMENT_READINESS_REPORT.md §4 step 8.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IndexField {
  fieldPath: string;
  order?: string;
  arrayConfig?: string;
}

interface CompositeIndex {
  collectionGroup: string;
  queryScope: string;
  fields: IndexField[];
}

interface IndexFile {
  indexes: CompositeIndex[];
  fieldOverrides?: unknown[];
}

const repoRoot = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(resolve(repoRoot, relativePath), 'utf8')) as T;
}

describe('firestore.indexes.json', () => {
  const indexFile = readJson<IndexFile>('firestore.indexes.json');

  it('is wired into firebase.json so `firebase deploy` actually ships it', () => {
    const firebaseConfig = readJson<{ firestore?: { rules?: string; indexes?: string } }>('firebase.json');
    expect(firebaseConfig.firestore?.indexes).toBe('firestore.indexes.json');
    // The rules pointer must survive alongside it — they deploy as a set.
    expect(firebaseConfig.firestore?.rules).toBe('firestore.rules');
  });

  it('declares at least one composite index', () => {
    expect(Array.isArray(indexFile.indexes)).toBe(true);
    expect(indexFile.indexes.length).toBeGreaterThan(0);
  });

  it('covers the alert-engine dedupe query (type + relatedId + timestamp)', () => {
    const alertIndex = indexFile.indexes.find(i => i.collectionGroup === 'alerts');
    expect(alertIndex, 'no composite index declared for the `alerts` collection').toBeDefined();
    expect(alertIndex!.queryScope).toBe('COLLECTION');

    // Field ORDER matters to Firestore: equality filters first, range filter last.
    expect(alertIndex!.fields.map(f => f.fieldPath)).toEqual([
      'type',
      'relatedId',
      'timestamp',
    ]);
  });

  it('orders every alert-index field ASCENDING (the range filter is >=)', () => {
    const alertIndex = indexFile.indexes.find(i => i.collectionGroup === 'alerts')!;
    for (const field of alertIndex.fields) {
      expect(field.order, `field ${field.fieldPath} must declare an order`).toBe('ASCENDING');
    }
  });

  it('declares no duplicate composite index for the same collection + field set', () => {
    const signatures = indexFile.indexes.map(
      i => `${i.collectionGroup}:${i.fields.map(f => `${f.fieldPath}/${f.order ?? f.arrayConfig}`).join(',')}`,
    );
    expect(new Set(signatures).size).toBe(signatures.length);
  });
});
