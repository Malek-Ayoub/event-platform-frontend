import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@event-platform/api-client',
    '@event-platform/auth',
    '@event-platform/query',
    '@event-platform/shared',
    '@event-platform/tenant',
    '@event-platform/ui',
  ],
  experimental: {
    optimizePackageImports: ['@event-platform/ui'],
  },
};

export default nextConfig;
