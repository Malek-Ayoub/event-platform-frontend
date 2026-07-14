'use client';

import { useMemo, type ReactNode } from 'react';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import { initializeApiClients } from '@event-platform/api-client/core';
import { ApiClientsProvider } from '@event-platform/api-client/react';
import { QueryClientProvider } from '@event-platform/query';
import { TenantProvider, TenantThemeBridge } from '@event-platform/tenant';
import { ToastProviderContext } from '@event-platform/ui';
import { publicWebEnv } from '@/lib/env';

const sessionStorage = new MemorySessionStorage();

let apiClientsBootstrapped = false;

function bootstrapApiClients(): void {
  if (apiClientsBootstrapped) {
    return;
  }

  initializeApiClients({
    publicBaseUrl: publicWebEnv.apiPublicBaseUrl,
    tenantBaseUrl: publicWebEnv.apiTenantBaseUrl,
    adminBaseUrl: publicWebEnv.apiAdminBaseUrl,
    sessionStorage,
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
      baseDomain: publicWebEnv.tenancyBaseDomain,
      useEnvOverride: true,
    }),
    [],
  );

  return (
    <TenantProvider {...tenantOptions}>
      <TenantThemeBridge>
        <ApiClientsProvider>
          <QueryClientProvider>
            <AuthProvider storage={sessionStorage}>
              <ToastProviderContext>{children}</ToastProviderContext>
            </AuthProvider>
          </QueryClientProvider>
        </ApiClientsProvider>
      </TenantThemeBridge>
    </TenantProvider>
  );
}
