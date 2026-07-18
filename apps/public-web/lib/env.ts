import { buildTenantPublicUrl } from '@event-platform/tenant';

export type PublicWebEnv = {
  apiPublicBaseUrl: string;
  apiTenantBaseUrl: string;
  apiAdminBaseUrl: string;
  tenancyBaseDomain: string;
};

/**
 * OpenAPI paths already include `/api/...`, and axios concatenates baseURL + path.
 * Base URLs must be origin-only (optionally with a tenant subdomain host).
 *
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when accessed with a static key —
 * never via `process.env[dynamicKey]`.
 */
const DEFAULT_API_ORIGIN = 'http://localhost:8000';
const DEFAULT_API_PORT = 8000;

function stripLegacyApiPathSuffix(url: string): string {
  return url
    .replace(/\/+$/, '')
    .replace(/\/api\/(?:public|admin|tenant)?$/, '')
    .replace(/\/api$/, '');
}

function resolveLocalApiOrigin(tenancyBaseDomain: string): string {
  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim();

  if (!slug) {
    return DEFAULT_API_ORIGIN;
  }

  return buildTenantPublicUrl(slug, {
    baseDomain: tenancyBaseDomain,
    protocol: 'http',
    port: DEFAULT_API_PORT,
  });
}

const tenancyBaseDomain = process.env.NEXT_PUBLIC_TENANCY_BASE_DOMAIN?.trim() || 'localhost';
const localApiOrigin = resolveLocalApiOrigin(tenancyBaseDomain);

export const publicWebEnv: PublicWebEnv = {
  apiPublicBaseUrl: stripLegacyApiPathSuffix(
    process.env.NEXT_PUBLIC_API_PUBLIC_URL?.trim() || localApiOrigin,
  ),
  apiTenantBaseUrl: stripLegacyApiPathSuffix(
    process.env.NEXT_PUBLIC_API_TENANT_URL?.trim() || localApiOrigin,
  ),
  apiAdminBaseUrl: stripLegacyApiPathSuffix(
    process.env.NEXT_PUBLIC_API_ADMIN_URL?.trim() || DEFAULT_API_ORIGIN,
  ),
  tenancyBaseDomain,
};
