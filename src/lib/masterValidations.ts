// Pure validation and normalisation utilities for R2 Master data.
// No Firestore imports — all functions are stateless and testable.

export function normaliseName(name: string): string {
  return name.trim();
}

export function normaliseCode(code: string): string {
  return code.trim().toUpperCase();
}

export function normaliseSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

export function normaliseRegistrationNumber(regNum: string): string {
  return regNum.replace(/[\s\-]+/g, '').toUpperCase();
}

export function isNameUnique(
  items: { id: string; name: string }[],
  name: string,
  excludeId?: string,
): boolean {
  const target = name.trim().toLowerCase();
  return !items.some(
    item => item.id !== excludeId && item.name.trim().toLowerCase() === target,
  );
}

export function isCodeUnique(
  items: { id: string; code: string }[],
  code: string,
  excludeId?: string,
): boolean {
  const target = code.trim().toUpperCase();
  return !items.some(
    item => item.id !== excludeId && item.code.trim().toUpperCase() === target,
  );
}

export function isSymbolUnique(
  items: { id: string; symbol: string }[],
  symbol: string,
  excludeId?: string,
): boolean {
  const target = symbol.trim().toUpperCase();
  return !items.some(
    item => item.id !== excludeId && item.symbol.trim().toUpperCase() === target,
  );
}

export function isRegistrationNumberUnique(
  items: { id: string; registrationNumber: string }[],
  regNum: string,
  excludeId?: string,
): boolean {
  const target = normaliseRegistrationNumber(regNum);
  return !items.some(
    item =>
      item.id !== excludeId &&
      normaliseRegistrationNumber(item.registrationNumber) === target,
  );
}

// Indian GSTIN: 15 characters — 2-digit state + 10-char PAN + 1 entity digit + Z + 1 checksum
export function validateGSTIN(gstin: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    gstin.trim().toUpperCase(),
  );
}

// PAN: 5 alpha + 4 digits + 1 alpha
export function validatePAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

// IFSC: 4 alpha (bank) + 0 (fifth char, always zero) + 6 alphanumeric
export function validateIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

// Loose Indian phone validation: 10 digits, optionally preceded by +91 / 0
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-().+]/g, '');
  if (digits.startsWith('91') && digits.length === 12) return true;
  return /^[6-9][0-9]{9}$/.test(digits);
}
