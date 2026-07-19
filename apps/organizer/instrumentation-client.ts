import * as Sentry from '@sentry/nextjs';

/**
 * Client instrumentation for Sentry.
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset or empty (no network).
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
