import { NumberSeries } from '../types';
import { doc, runTransaction, onSnapshot, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { logAction } from './db';

const COLLECTION = 'numberSeries';
const WORK_ORDER_DOC = 'workOrder';

/**
 * Pads `n` to at least `length` digits.
 */
function pad(n: number, length: number): string {
  const s = String(n);
  return s.length >= length ? s : '0'.repeat(length - s.length) + s;
}

/**
 * Format a sequence number using the series config.
 *   prefix=WO, year=2026, includeYear=true, paddingLength=4 → "WO-2026-0001"
 *   prefix=WO, includeYear=false, paddingLength=5 → "WO-00001"
 */
export function formatSeriesNumber(series: NumberSeries, seq: number): string {
  const padded = pad(seq, series.paddingLength || 4);
  if (series.includeYear) {
    return `${series.prefix}-${series.year}-${padded}`;
  }
  return `${series.prefix}-${padded}`;
}

/**
 * Atomically reserve the next sequence in a series and return the
 * formatted Work Order number. Uses a Firestore transaction so two
 * concurrent creates can never receive the same number.
 *
 * If the year segment is enabled and the calendar year has rolled
 * over since the last issue, the counter resets to 1 and the new
 * year is stamped on the doc — admins don't have to remember to
 * manually reset on January 1.
 *
 * Returns null when the series doc doesn't exist yet (the caller
 * should fall back to its legacy generator). The Masters seed
 * creates the doc on first admin visit.
 */
export async function reserveNextWorkOrderNumber(): Promise<string | null> {
  const ref = doc(db, COLLECTION, WORK_ORDER_DOC);
  try {
    const formatted = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return null;
      const series = snap.data() as NumberSeries;
      const currentYear = new Date().getFullYear();
      // Year-rollover: if includeYear and the calendar year moved on,
      // reset the counter for the new year.
      const useYear = series.includeYear ? currentYear : series.year;
      const nextSeq = series.includeYear && currentYear !== series.year ? 1 : (series.nextNumber || 1);
      const issued = formatSeriesNumber(
        { ...series, year: useYear },
        nextSeq,
      );
      tx.update(ref, {
        nextNumber: nextSeq + 1,
        year: useYear,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || '',
      });
      return issued;
    });
    return formatted;
  } catch (error) {
    // Transient Firestore errors: signal "no series" and let the caller
    // fall back to its legacy generator. Logged for observability.
    console.error('[numberSeries] Failed to reserve next WO number:', error);
    return null;
  }
}

export const numberSeriesService = {
  /** Live subscription on the WO series doc. */
  subscribeWorkOrderSeries: (callback: (series: NumberSeries | null) => void) => {
    const ref = doc(db, COLLECTION, WORK_ORDER_DOC);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return callback(null);
      callback({ id: snap.id, ...(snap.data() as Omit<NumberSeries, 'id'>) });
    }, (error) => {
      console.error('[numberSeries] Subscription error:', error);
      callback(null);
    });
  },

  getWorkOrderSeries: async (): Promise<NumberSeries | null> => {
    const snap = await getDoc(doc(db, COLLECTION, WORK_ORDER_DOC));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<NumberSeries, 'id'>) };
  },

  /** Admin-only — overwrite series config. nextNumber is the source
   *  of truth for the next issued sequence. */
  updateWorkOrderSeries: async (series: Omit<NumberSeries, 'id' | 'updatedAt' | 'updatedBy'>): Promise<void> => {
    const ref = doc(db, COLLECTION, WORK_ORDER_DOC);
    const exists = (await getDoc(ref)).exists();
    const payload = {
      ...series,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.uid || '',
    };
    if (exists) {
      await updateDoc(ref, payload as Record<string, unknown>);
    } else {
      // Stamp createdAt-equivalent metadata when seeding from the UI.
      await setDoc(ref, payload as Record<string, unknown>);
    }
    await logAction(
      'UPDATE',
      'NumberSeries',
      WORK_ORDER_DOC,
      `Updated WO number series: ${series.prefix} · next ${series.nextNumber}`
    );
    void serverTimestamp; // avoid unused-import warning if future variants use it
  },
};

export const WORK_ORDER_SERIES_DEFAULT: Omit<NumberSeries, 'id' | 'updatedAt' | 'updatedBy'> = {
  prefix: 'WO',
  year: new Date().getFullYear(),
  nextNumber: 1,
  paddingLength: 4,
  includeYear: true,
};
