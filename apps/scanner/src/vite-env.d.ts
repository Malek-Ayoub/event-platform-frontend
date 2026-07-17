/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_TENANT_URL?: string;
  readonly VITE_API_PUBLIC_URL?: string;
  readonly VITE_API_ADMIN_URL?: string;
  readonly VITE_TENANCY_BASE_DOMAIN?: string;
  readonly VITE_TENANT_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
