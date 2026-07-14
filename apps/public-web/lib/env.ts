export type PublicWebEnv = {
  apiPublicBaseUrl: string;
  apiTenantBaseUrl: string;
  apiAdminBaseUrl: string;
  tenancyBaseDomain: string;
};

export const publicWebEnv: PublicWebEnv = {
  apiPublicBaseUrl: process.env.NEXT_PUBLIC_API_PUBLIC_URL ?? 'http://localhost:8000/api/public',
  apiTenantBaseUrl: process.env.NEXT_PUBLIC_API_TENANT_URL ?? 'http://localhost:8000/api',
  apiAdminBaseUrl: process.env.NEXT_PUBLIC_API_ADMIN_URL ?? 'http://localhost:8000/api/admin',
  tenancyBaseDomain: process.env.NEXT_PUBLIC_TENANCY_BASE_DOMAIN ?? 'localhost',
};
