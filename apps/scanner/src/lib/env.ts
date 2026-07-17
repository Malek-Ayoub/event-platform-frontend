export type ScannerEnv = {
  apiTenantBaseUrl: string;
  tenancyBaseDomain: string;
};

export const scannerEnv: ScannerEnv = {
  apiTenantBaseUrl: import.meta.env.VITE_API_TENANT_URL ?? 'http://localhost:8000/api',
  tenancyBaseDomain: import.meta.env.VITE_TENANCY_BASE_DOMAIN ?? 'localhost',
};

/** Defaults required by initializeApiClients; scanner does not call these clients yet. */
export const scannerApiBootstrapUrls = {
  publicBaseUrl: import.meta.env.VITE_API_PUBLIC_URL ?? 'http://localhost:8000/api/public',
  adminBaseUrl: import.meta.env.VITE_API_ADMIN_URL ?? 'http://localhost:8000/api/admin',
} as const;
