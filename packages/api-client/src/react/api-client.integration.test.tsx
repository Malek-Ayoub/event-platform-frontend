import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemorySessionStorage } from '@event-platform/auth';
import { initializeApiClients } from '../core/bootstrap/initialize-api-clients.js';
import { HttpClient } from '../core/client/http-client.js';
import { ApiClientsAlreadyInitializedError } from '../core/errors/index.js';
import { getRegisteredApiClients, resetApiClients } from '../core/registry/client-registry.js';
import { ApiClientsProvider } from './api-clients-provider.js';
import {
  useAdminApiClient,
  usePublicApiClient,
  useTenantApiClient,
} from './hooks/use-api-clients.js';

const baseConfig = {
  publicBaseUrl: 'https://example.com',
  tenantBaseUrl: 'https://kai.example.com',
  adminBaseUrl: 'https://example.com/api/admin',
  tenantSlug: 'kai',
};

function AllClientsProbe() {
  const publicClient = usePublicApiClient();
  const tenantClient = useTenantApiClient();
  const adminClient = useAdminApiClient();

  return (
    <div>
      <span data-testid="public-kind">{publicClient.kind}</span>
      <span data-testid="tenant-kind">{tenantClient.kind}</span>
      <span data-testid="admin-kind">{adminClient.kind}</span>
      <span data-testid="public-is-http">{String(publicClient instanceof HttpClient)}</span>
      <span data-testid="tenant-is-http">{String(tenantClient instanceof HttpClient)}</span>
      <span data-testid="admin-is-http">{String(adminClient instanceof HttpClient)}</span>
    </div>
  );
}

describe('api client integration', () => {
  afterEach(() => {
    cleanup();
    resetApiClients();
  });

  it('wires bootstrap → registry → provider → hooks end-to-end', () => {
    const storage = new MemorySessionStorage();

    initializeApiClients({
      ...baseConfig,
      sessionStorage: storage,
    });

    const registered = getRegisteredApiClients();
    expect(registered.public).toBeInstanceOf(HttpClient);
    expect(registered.tenant).toBeInstanceOf(HttpClient);
    expect(registered.admin).toBeInstanceOf(HttpClient);

    render(
      <ApiClientsProvider>
        <AllClientsProbe />
      </ApiClientsProvider>,
    );

    expect(screen.getByTestId('public-kind').textContent).toBe('public');
    expect(screen.getByTestId('tenant-kind').textContent).toBe('tenant');
    expect(screen.getByTestId('admin-kind').textContent).toBe('admin');
    expect(screen.getByTestId('public-is-http').textContent).toBe('true');
    expect(screen.getByTestId('tenant-is-http').textContent).toBe('true');
    expect(screen.getByTestId('admin-is-http').textContent).toBe('true');
  });

  it('rejects re-initialization after bootstrap', () => {
    const storage = new MemorySessionStorage();

    initializeApiClients({
      ...baseConfig,
      sessionStorage: storage,
    });

    expect(() =>
      initializeApiClients({
        ...baseConfig,
        sessionStorage: storage,
      }),
    ).toThrow(ApiClientsAlreadyInitializedError);
  });
});
