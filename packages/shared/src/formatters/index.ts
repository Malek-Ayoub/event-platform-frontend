import { DEFAULT_CURRENCY, DEFAULT_LOCALE, DISPLAY_DATETIME_FORMAT } from '../constants/index.js';
import type { CurrencyCode } from '../constants/index.js';
import type { MoneyAmount } from '../types/index.js';

export function formatCurrency(
  amount: MoneyAmount | number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  const numeric = typeof amount === 'number' ? amount : Number.parseFloat(amount);

  if (!Number.isFinite(numeric)) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatDecimal(
  value: number | string,
  fractionDigits = 2,
  locale: string = DEFAULT_LOCALE,
): string {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);

  if (!Number.isFinite(numeric)) {
    return '0.00';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
}

export function formatPercentage(
  value: number | string,
  fractionDigits = 2,
  locale: string = DEFAULT_LOCALE,
): string {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);

  if (!Number.isFinite(numeric)) {
    return '0.00%';
  }

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric)}%`;
}

export function formatDateTime(
  value: Date | string | number,
  locale: string = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = DISPLAY_DATETIME_FORMAT,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDate(value: Date | string | number, locale: string = DEFAULT_LOCALE): string {
  return formatDateTime(value, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatInteger(value: number, locale: string = DEFAULT_LOCALE): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
