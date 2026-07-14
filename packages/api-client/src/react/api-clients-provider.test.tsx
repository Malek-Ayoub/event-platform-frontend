import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemorySessionStorage } from '@event-platform/auth';
import { initializeApiClients } from '../core/bootstrap/initialize-api-clients.js';
import { resetApiClients } from '../core/registry/client-registry.js';
import { ApiClientsProvider } from './api-clients-provider.js';
import { useTenantApiClient } from './hooks/use-api-clients.js';

function TenantClientProbe() {
  const client = useTenantApiClient();
  return <span data-testid="kind">{client.kind}</span>;
}

describe('ApiClientsProvider', () => {
  it('exposes clients through context hooks', () => {
    resetApiClients();
    const storage = new MemorySessionStorage();

    initializeApiClients({
      publicBaseUrl: 'https://example.com',
      tenantBaseUrl: 'https://tenant.example.com',
      adminBaseUrl: 'https://example.com/api/admin',
      sessionStorage: storage,
    });

    render(
      <ApiClientsProvider>
        <TenantClientProbe />
      </ApiClientsProvider>,
    );

    expect(screen.getByTestId('kind').textContent).toBe('tenant');
  });
});
