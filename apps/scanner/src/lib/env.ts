export type ScannerEnv = {
  apiTenantBaseUrl: string;
  tenancyBaseDomain: string;
};

/**
 * OpenAPI paths already include `/api/...`; axios concatenates baseURL + path,
 * so these must be origin-only (no `/api` or `/api/tenant` suffix).
 */
export const scannerEnv: ScannerEnv = {
  apiTenantBaseUrl: import.meta.env.VITE_API_TENANT_URL ?? 'http://localhost:8000',
  tenancyBaseDomain: import.meta.env.VITE_TENANCY_BASE_DOMAIN ?? 'localhost',
};

/** Defaults required by initializeApiClients; scanner does not call these clients yet. */
export const scannerApiBootstrapUrls = {
  publicBaseUrl: import.meta.env.VITE_API_PUBLIC_URL ?? 'http://localhost:8000',
  adminBaseUrl: import.meta.env.VITE_API_ADMIN_URL ?? 'http://localhost:8000',
} as const;
