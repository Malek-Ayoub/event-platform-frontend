export type AdminEnv = {
  apiPublicBaseUrl: string;
  apiAdminBaseUrl: string;
};

export const adminEnv: AdminEnv = {
  apiPublicBaseUrl: process.env.NEXT_PUBLIC_API_PUBLIC_URL ?? 'http://localhost:8000/api/public',
  apiAdminBaseUrl: process.env.NEXT_PUBLIC_API_ADMIN_URL ?? 'http://localhost:8000/api/admin',
};

/**
 * initializeApiClients always registers public + tenant + admin clients.
 * Admin never calls the tenant client; this URL only satisfies the registry contract.
 */
export const adminTenantBootstrapUrl =
  process.env.NEXT_PUBLIC_API_TENANT_URL ?? 'http://localhost:8000/api';
