import { describe, expect, it } from 'vitest';
import { MemorySessionStorage } from '@event-platform/auth';
import { initializeApiClients } from '../bootstrap/initialize-api-clients.js';
import {
  ApiClientsAlreadyInitializedError,
  ApiClientsNotInitializedError,
} from '../errors/index.js';
import {
  getRegisteredApiClients,
  isApiClientsInitialized,
  resetApiClients,
} from './client-registry.js';

describe('client registry', () => {
  it('registers clients once and exposes them', () => {
    resetApiClients();
    const storage = new MemorySessionStorage();

    initializeApiClients({
      publicBaseUrl: 'https://example.com',
      tenantBaseUrl: 'https://tenant.example.com',
      adminBaseUrl: 'https://example.com/api/admin',
      sessionStorage: storage,
      tenantSlug: 'kai',
    });

    expect(isApiClientsInitialized()).toBe(true);
    expect(getRegisteredApiClients().tenant.kind).toBe('tenant');
  });

  it('throws when initialized twice', () => {
    resetApiClients();
    const storage = new MemorySessionStorage();
    const config = {
      publicBaseUrl: 'https://example.com',
      tenantBaseUrl: 'https://tenant.example.com',
      adminBaseUrl: 'https://example.com/api/admin',
      sessionStorage: storage,
    };

    initializeApiClients(config);

    expect(() => initializeApiClients(config)).toThrow(ApiClientsAlreadyInitializedError);
  });

  it('throws when accessed before initialization', () => {
    resetApiClients();
    expect(() => getRegisteredApiClients()).toThrow(ApiClientsNotInitializedError);
  });
});
