import type { SessionStorageAdapter } from '@event-platform/auth';
import { createAdminClient, createPublicClient, createTenantClient } from '../client/factory.js';
import { registerApiClients } from '../registry/client-registry.js';

export type InitializeApiClientsConfig = {
  publicBaseUrl: string;
  tenantBaseUrl: string;
  adminBaseUrl: string;
  sessionStorage: SessionStorageAdapter;
  tenantSlug?: string | null;
  timeoutMs?: number;
};

export function initializeApiClients(config: InitializeApiClientsConfig): void {
  const shared = {
    sessionStorage: config.sessionStorage,
    timeoutMs: config.timeoutMs,
  };

  registerApiClients({
    public: createPublicClient({
      ...shared,
      baseUrl: config.publicBaseUrl,
    }),
    tenant: createTenantClient({
      ...shared,
      baseUrl: config.tenantBaseUrl,
      tenantSlug: config.tenantSlug,
    }),
    admin: createAdminClient({
      ...shared,
      baseUrl: config.adminBaseUrl,
    }),
  });
}
