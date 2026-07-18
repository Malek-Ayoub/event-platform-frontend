export type OrganizerEnv = {
  apiTenantBaseUrl: string;
  tenancyBaseDomain: string;
};

/**
 * OpenAPI paths already include `/api/...`; axios concatenates baseURL + path,
 * so these must be origin-only (no `/api` or `/api/tenant` suffix).
 */
export const organizerEnv: OrganizerEnv = {
  apiTenantBaseUrl: process.env.NEXT_PUBLIC_API_TENANT_URL ?? 'http://localhost:8000',
  tenancyBaseDomain: process.env.NEXT_PUBLIC_TENANCY_BASE_DOMAIN ?? 'localhost',
};

/** Defaults required by initializeApiClients; organizer does not call these clients yet. */
export const organizerApiBootstrapUrls = {
  publicBaseUrl: process.env.NEXT_PUBLIC_API_PUBLIC_URL ?? 'http://localhost:8000',
  adminBaseUrl: process.env.NEXT_PUBLIC_API_ADMIN_URL ?? 'http://localhost:8000',
} as const;
