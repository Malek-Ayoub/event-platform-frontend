import type { MoneyAmount } from '@event-platform/shared';

const AMOUNT_PATTERN = /^-?\d+(\.\d{1,2})?$/;

/**
 * Normalize a monetary string to two decimal places (backend-compatible).
 */
export function normalizeAmount(value: string | number): MoneyAmount {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);

  if (!Number.isFinite(numeric)) {
    return '0.00';
  }

  return numeric.toFixed(2);
}

export function parseAmount(value: string | number): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const trimmed = value.trim();

  if (!AMOUNT_PATTERN.test(trimmed)) {
    return null;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidAmount(value: string): boolean {
  return AMOUNT_PATTERN.test(value.trim());
}

export function addAmounts(left: MoneyAmount, right: MoneyAmount): MoneyAmount {
  return normalizeAmount(parseAmount(left)! + parseAmount(right)!);
}

export function subtractAmounts(left: MoneyAmount, right: MoneyAmount): MoneyAmount {
  return normalizeAmount(parseAmount(left)! - parseAmount(right)!);
}

export function compareAmounts(left: MoneyAmount, right: MoneyAmount): number {
  return parseAmount(left)! - parseAmount(right)!;
}

export function isPositiveAmount(value: MoneyAmount): boolean {
  return compareAmounts(value, '0.00') > 0;
}
