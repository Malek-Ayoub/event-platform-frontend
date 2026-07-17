'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@event-platform/auth';
import { initializeApiClients } from '@event-platform/api-client/core';
import { ApiClientsProvider } from '@event-platform/api-client/react';
import { QueryClientProvider } from '@event-platform/query';
import { ToastProviderContext } from '@event-platform/ui';
import { adminEnv, adminTenantBootstrapUrl } from '@/lib/env';
import { adminSessionStorage } from '@/lib/session-storage';

let apiClientsBootstrapped = false;

function bootstrapApiClients(): void {
  if (apiClientsBootstrapped) {
    return;
  }

  initializeApiClients({
    publicBaseUrl: adminEnv.apiPublicBaseUrl,
    tenantBaseUrl: adminTenantBootstrapUrl,
    adminBaseUrl: adminEnv.apiAdminBaseUrl,
    sessionStorage: adminSessionStorage,
    tenantSlug: null,
  });

  apiClientsBootstrapped = true;
}

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  bootstrapApiClients();

  return (
    <ApiClientsProvider>
      <QueryClientProvider>
        <AuthProvider storage={adminSessionStorage}>
          <ToastProviderContext>{children}</ToastProviderContext>
        </AuthProvider>
      </QueryClientProvider>
    </ApiClientsProvider>
  );
}
