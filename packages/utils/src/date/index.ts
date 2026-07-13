/**
 * Parse an ISO-8601 or `yyyy-MM-dd` string into a Date (UTC midnight for date-only).
 */
export function parseIsoDate(value: string): Date | null {
  const trimmed = value.trim();

  if (trimmed === '') {
    return null;
  }

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
  const parsed = new Date(dateOnly ? `${trimmed}T00:00:00.000Z` : trimmed);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toIsoDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function endOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

export function isWithinRange(
  value: Date | string,
  range: { from: Date | string | null; to: Date | string | null },
): boolean {
  const moment = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(moment.getTime())) {
    return false;
  }

  if (range.from !== null) {
    const from = range.from instanceof Date ? range.from : new Date(range.from);
    if (moment < from) {
      return false;
    }
  }

  if (range.to !== null) {
    const to = range.to instanceof Date ? range.to : new Date(range.to);
    if (moment > to) {
      return false;
    }
  }

  return true;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
