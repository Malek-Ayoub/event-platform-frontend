import { useMemo, type ReactNode } from 'react';
import { AuthProvider } from '@event-platform/auth';
import { initializeApiClients } from '@event-platform/api-client/core';
import { ApiClientsProvider } from '@event-platform/api-client/react';
import { QueryClientProvider } from '@event-platform/query';
import { TenantProvider, TenantThemeBridge } from '@event-platform/tenant';
import { ToastProviderContext } from '@event-platform/ui';
import { scannerApiBootstrapUrls, scannerEnv } from '@/lib/env';
import { scannerSessionStorage } from '@/lib/session-storage';

let apiClientsBootstrapped = false;

function bootstrapApiClients(): void {
  if (apiClientsBootstrapped) {
    return;
  }

  initializeApiClients({
    publicBaseUrl: scannerApiBootstrapUrls.publicBaseUrl,
    tenantBaseUrl: scannerEnv.apiTenantBaseUrl,
    adminBaseUrl: scannerApiBootstrapUrls.adminBaseUrl,
    sessionStorage: scannerSessionStorage,
    tenantSlug: import.meta.env.VITE_TENANT_SLUG ?? null,
  });

  apiClientsBootstrapped = true;
}

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  bootstrapApiClients();

  const tenantOptions = useMemo(
    () => ({
      baseDomain: scannerEnv.tenancyBaseDomain,
      useEnvOverride: true,
    }),
    [],
  );

  return (
    <TenantProvider {...tenantOptions}>
      <TenantThemeBridge>
        <ApiClientsProvider>
          <QueryClientProvider>
            <AuthProvider storage={scannerSessionStorage}>
              <ToastProviderContext>{children}</ToastProviderContext>
            </AuthProvider>
          </QueryClientProvider>
        </ApiClientsProvider>
      </TenantThemeBridge>
    </TenantProvider>
  );
}
