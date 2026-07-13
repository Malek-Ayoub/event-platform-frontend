/** Default platform currency (mirrors backend TICKET_SNAPSHOT_CURRENCY default). */
export const DEFAULT_CURRENCY = 'USD' as const;

/** ISO 4217 currency code used across the frontend. */
export type CurrencyCode = typeof DEFAULT_CURRENCY | (string & {});

export const DEFAULT_LOCALE = 'en-US' as const;

export const DEFAULT_PAGE_SIZE = 20 as const;

export const MAX_PAGE_SIZE = 100 as const;

export const API_DATE_FORMAT = 'yyyy-MM-dd' as const;

export const DISPLAY_DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export const TENANT_SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export const APP_NAMES = {
  publicWeb: 'Event Platform',
  organizer: 'Event Platform — Organizer',
  admin: 'Event Platform — Admin',
  scanner: 'Event Platform — Scanner',
} as const;
