'use client';

import { useMemo, type ReactNode } from 'react';
import { AuthProvider } from '@event-platform/auth';
import { initializeApiClients } from '@event-platform/api-client/core';
import { ApiClientsProvider } from '@event-platform/api-client/react';
import { QueryClientProvider } from '@event-platform/query';
import { TenantProvider, TenantThemeBridge } from '@event-platform/tenant';
import { ToastProviderContext } from '@event-platform/ui';
import { organizerApiBootstrapUrls, organizerEnv } from '@/lib/env';
import { organizerSessionStorage } from '@/lib/session-storage';

let apiClientsBootstrapped = false;

function bootstrapApiClients(): void {
  if (apiClientsBootstrapped) {
    return;
  }

  initializeApiClients({
    publicBaseUrl: organizerApiBootstrapUrls.publicBaseUrl,
    tenantBaseUrl: organizerEnv.apiTenantBaseUrl,
    adminBaseUrl: organizerApiBootstrapUrls.adminBaseUrl,
    sessionStorage: organizerSessionStorage,
    tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG ?? null,
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
      baseDomain: organizerEnv.tenancyBaseDomain,
      useEnvOverride: true,
    }),
    [],
  );

  return (
    <TenantProvider {...tenantOptions}>
      <TenantThemeBridge>
        <ApiClientsProvider>
          <QueryClientProvider>
            <AuthProvider storage={organizerSessionStorage}>
              <ToastProviderContext>{children}</ToastProviderContext>
            </AuthProvider>
          </QueryClientProvider>
        </ApiClientsProvider>
      </TenantThemeBridge>
    </TenantProvider>
  );
}
