import * as Sentry from '@sentry/nextjs';

/**
 * Server/edge instrumentation for Sentry.
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset or empty (no network).
 */
export async function register(): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

  if (!dsn) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
