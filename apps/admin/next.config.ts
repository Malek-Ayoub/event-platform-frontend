import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@event-platform/api-client',
    '@event-platform/auth',
    '@event-platform/query',
    '@event-platform/shared',
    '@event-platform/ui',
  ],
  experimental: {
    optimizePackageImports: ['@event-platform/ui'],
  },
};

export default withSentryConfig(nextConfig, {
  // No auth token / org / project — sourcemap upload and release creation stay off.
  silent: true,
  telemetry: false,
  sourcemaps: {
    disable: true,
  },
  release: {
    create: false,
  },
});
