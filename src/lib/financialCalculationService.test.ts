import { describe, it, expect } from 'vitest';
import {
  recalculateBillTotals,
  computeWorkOrderFinancials,
  computeVariationOrderFinancials,
} from './financialCalculationService';

/**
 * These tests pin the CURRENT behaviour of the centralized calculations so that
 * the extraction is proven behaviour-preserving. Expected values are computed
 * from the exact formulas in the original call-sites (no rounding, as today).
 */

describe('recalculateBillTotals (verbatim from billService/Bills)', () => {
  it('reproduces the current bill totals formula', () => {
    const r = recalculateBillTotals({
      workDoneAmount: 100000,
      previousBillAmount: 50000,
      tdsPercentage: 2,
      retentionPercentage: 5,
      advanceAdjustment: 10000,
    });
    expect(r.currentBillAmount).toBe(150000);
    expect(r.tdsAmount).toBe(2000);
    expect(r.retentionAmount).toBe(5000);
    expect(r.netPayable).toBe(83000); // 100000 - 2000 - 5000 - 10000
  });

  it('preserves the (currently unfloored) negative netPayable behaviour', () => {
    const r = recalculateBillTotals({
      workDoneAmount: 10000,
      previousBillAmount: 0,
      tdsPercentage: 2,
      retentionPercentage: 5,
      advanceAdjustment: 20000,
    });
    // Current behaviour does NOT floor at 0 — this is intentionally preserved.
    expect(r.netPayable).toBeLessThan(0);
  });
});

describe('computeWorkOrderFinancials (verbatim from WorkOrderForm — canonical)', () => {
  it('reproduces the current WO form formula', () => {
    const r = computeWorkOrderFinancials({
      items: [{ amount: 100000 }, { amount: 50000 }],
      advance: 20000,
      otherCharges: 5000,
      gstPercentage: 18,
      retentionPercentage: 5,
    });
    expect(r.totalAmount).toBe(150000);
    expect(r.subtotal).toBe(130000); // 150000 - 20000
    expect(r.gstAmount).toBe(23400); // 130000 * 18%
    expect(r.retentionAmount).toBe(7500); // 150000 * 5%
    expect(r.grandTotal).toBe(150900); // 130000 + 23400 + 5000 - 7500
  });
});

describe('computeVariationOrderFinancials (verbatim from secureRoutes/secureApi)', () => {
  it('reproduces the current VO formula', () => {
    const r = computeVariationOrderFinancials({
      totalAmount: 150000,
      gstPercentage: 18,
      otherCharges: 5000,
      retentionPercentage: 5,
      voAmount: 30000,
    });
    expect(r.totalAmount).toBe(180000);
    expect(r.subtotal).toBe(185000); // 180000 + 5000 (NOT total - advance)
    expect(r.gstAmount).toBe(32400); // 180000 * 18%
    expect(r.grandTotal).toBe(217400); // 185000 + 32400 (omits advance & retention)
  });

  it('documents the KNOWN divergence from the form formula (TODO: Finance Approval)', () => {
    // Same underlying totals, expressed for each formula. The VO path yields a
    // higher grandTotal because it omits the advance and retention subtractions.
    // This test exists to make the divergence explicit and regression-visible;
    // it MUST NOT be "fixed" by changing behaviour without finance sign-off.
    const viaForm = computeWorkOrderFinancials({
      items: [{ amount: 180000 }],
      advance: 20000,
      otherCharges: 5000,
      gstPercentage: 18,
      retentionPercentage: 5,
    });
    const viaVo = computeVariationOrderFinancials({
      totalAmount: 150000,
      gstPercentage: 18,
      otherCharges: 5000,
      retentionPercentage: 5,
      voAmount: 30000,
    });
    expect(viaVo.grandTotal).not.toBe(viaForm.grandTotal);
    expect(viaVo.grandTotal).toBeGreaterThan(viaForm.grandTotal);
  });
});
