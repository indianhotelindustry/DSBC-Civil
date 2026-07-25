import { describe, it, expect } from 'vitest';
import {
  normaliseName,
  normaliseCode,
  normaliseSymbol,
  normaliseRegistrationNumber,
  isNameUnique,
  isCodeUnique,
  isSymbolUnique,
  isRegistrationNumberUnique,
  validateGSTIN,
  validatePAN,
  validateIFSC,
  validatePhone,
} from './masterValidations';

// ── normaliseName ────────────────────────────────────────────────

describe('normaliseName', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normaliseName('  Cement  ')).toBe('Cement');
  });

  it('preserves internal spacing', () => {
    expect(normaliseName('Ready Mix Concrete')).toBe('Ready Mix Concrete');
  });

  it('returns empty string for blank input', () => {
    expect(normaliseName('   ')).toBe('');
  });
});

// ── normaliseCode ────────────────────────────────────────────────

describe('normaliseCode', () => {
  it('uppercases and trims the code', () => {
    expect(normaliseCode('  mat-001 ')).toBe('MAT-001');
  });

  it('preserves hyphens and digits', () => {
    expect(normaliseCode('vnd-42')).toBe('VND-42');
  });
});

// ── normaliseSymbol ──────────────────────────────────────────────

describe('normaliseSymbol', () => {
  it('uppercases and trims', () => {
    expect(normaliseSymbol('  kg ')).toBe('KG');
  });

  it('already-uppercased symbol is unchanged (except trim)', () => {
    expect(normaliseSymbol('MT')).toBe('MT');
  });
});

// ── normaliseRegistrationNumber ──────────────────────────────────

describe('normaliseRegistrationNumber', () => {
  it('removes spaces and uppercases', () => {
    expect(normaliseRegistrationNumber('mh 12 ab 1234')).toBe('MH12AB1234');
  });

  it('removes hyphens embedded in the number', () => {
    expect(normaliseRegistrationNumber('MH-12-AB-1234')).toBe('MH12AB1234');
  });
});

// ── isNameUnique ─────────────────────────────────────────────────

describe('isNameUnique', () => {
  const items = [
    { id: '1', name: 'Cement' },
    { id: '2', name: 'Steel' },
  ];

  it('returns true when name is not in the list', () => {
    expect(isNameUnique(items, 'Sand')).toBe(true);
  });

  it('returns false when name exists (exact match)', () => {
    expect(isNameUnique(items, 'Cement')).toBe(false);
  });

  it('comparison is case-insensitive', () => {
    expect(isNameUnique(items, 'cement')).toBe(false);
    expect(isNameUnique(items, 'STEEL')).toBe(false);
  });

  it('ignores leading/trailing whitespace in the candidate', () => {
    expect(isNameUnique(items, '  cement  ')).toBe(false);
  });

  it('returns true for the same item when excluded by id', () => {
    expect(isNameUnique(items, 'Cement', '1')).toBe(true);
  });

  it('returns false when name clashes with a different id', () => {
    expect(isNameUnique(items, 'Steel', '1')).toBe(false);
  });

  it('returns true for an empty list', () => {
    expect(isNameUnique([], 'AnyName')).toBe(true);
  });
});

// ── isCodeUnique ─────────────────────────────────────────────────

describe('isCodeUnique', () => {
  const items = [
    { id: '1', code: 'MAT-001' },
    { id: '2', code: 'MAT-002' },
  ];

  it('returns true for a new code', () => {
    expect(isCodeUnique(items, 'MAT-003')).toBe(true);
  });

  it('returns false when code exists (case-insensitive)', () => {
    expect(isCodeUnique(items, 'mat-001')).toBe(false);
  });

  it('returns true when the matching id is excluded', () => {
    expect(isCodeUnique(items, 'MAT-001', '1')).toBe(true);
  });

  it('ignores whitespace in the candidate', () => {
    expect(isCodeUnique(items, '  MAT-002  ')).toBe(false);
  });
});

// ── isSymbolUnique ───────────────────────────────────────────────

describe('isSymbolUnique', () => {
  const items = [
    { id: '1', symbol: 'KG' },
    { id: '2', symbol: 'MT' },
  ];

  it('returns true for a new symbol', () => {
    expect(isSymbolUnique(items, 'NOS')).toBe(true);
  });

  it('returns false for a duplicate (case-insensitive)', () => {
    expect(isSymbolUnique(items, 'kg')).toBe(false);
  });

  it('returns true when the matching id is excluded', () => {
    expect(isSymbolUnique(items, 'KG', '1')).toBe(true);
  });
});

// ── isRegistrationNumberUnique ───────────────────────────────────

describe('isRegistrationNumberUnique', () => {
  const items = [
    { id: '1', registrationNumber: 'MH12AB1234' },
    { id: '2', registrationNumber: 'DL1CAB5678' },
  ];

  it('returns true for a new number', () => {
    expect(isRegistrationNumberUnique(items, 'GJ01XY9999')).toBe(true);
  });

  it('returns false for a duplicate (normalisation applied)', () => {
    expect(isRegistrationNumberUnique(items, 'mh 12 ab 1234')).toBe(false);
  });

  it('returns true when the matching id is excluded', () => {
    expect(isRegistrationNumberUnique(items, 'MH12AB1234', '1')).toBe(true);
  });
});

// ── validateGSTIN ────────────────────────────────────────────────

describe('validateGSTIN', () => {
  it('accepts a well-formed GSTIN', () => {
    expect(validateGSTIN('27AAPFU0939F1ZV')).toBe(true);
    expect(validateGSTIN('23ABCDE1234F1ZX')).toBe(true);
  });

  it('rejects GSTINs that are too short or too long', () => {
    expect(validateGSTIN('27AAPFU0939F1Z')).toBe(false);
    expect(validateGSTIN('27AAPFU0939F1ZVV')).toBe(false);
  });

  it('accepts lowercase input by normalising to uppercase', () => {
    expect(validateGSTIN('27aapfu0939f1zv')).toBe(true);
  });

  it('rejects an all-numeric string of correct length', () => {
    expect(validateGSTIN('123456789012345')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateGSTIN('')).toBe(false);
  });
});

// ── validatePAN ──────────────────────────────────────────────────

describe('validatePAN', () => {
  it('accepts a well-formed PAN', () => {
    expect(validatePAN('ABCDE1234F')).toBe(true);
  });

  it('accepts lowercase input by normalising', () => {
    expect(validatePAN('abcde1234f')).toBe(true);
  });

  it('rejects PANs that are too short', () => {
    expect(validatePAN('ABCD1234F')).toBe(false);
  });

  it('rejects PANs with digits in wrong positions', () => {
    expect(validatePAN('1BCDE1234F')).toBe(false);
  });
});

// ── validateIFSC ─────────────────────────────────────────────────

describe('validateIFSC', () => {
  it('accepts a well-formed IFSC', () => {
    expect(validateIFSC('HDFC0001234')).toBe(true);
    expect(validateIFSC('SBIN0001234')).toBe(true);
  });

  it('rejects IFSC without the mandatory zero in position 5', () => {
    expect(validateIFSC('HDFC1001234')).toBe(false);
  });

  it('rejects too-short IFSC', () => {
    expect(validateIFSC('HDFC000123')).toBe(false);
  });

  it('accepts lowercase input by normalising', () => {
    expect(validateIFSC('hdfc0001234')).toBe(true);
  });
});

// ── validatePhone ────────────────────────────────────────────────

describe('validatePhone', () => {
  it('accepts a 10-digit Indian mobile number starting with 6-9', () => {
    expect(validatePhone('9876543210')).toBe(true);
    expect(validatePhone('6543210987')).toBe(true);
  });

  it('accepts number with spaces and dashes', () => {
    expect(validatePhone('98765 43210')).toBe(true);
    expect(validatePhone('98765-43210')).toBe(true);
  });

  it('accepts number with +91 prefix', () => {
    expect(validatePhone('+919876543210')).toBe(true);
  });

  it('rejects numbers starting with digits below 6', () => {
    expect(validatePhone('5876543210')).toBe(false);
  });

  it('rejects numbers shorter than 10 digits', () => {
    expect(validatePhone('987654321')).toBe(false);
  });
});
