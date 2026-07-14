import { useContext } from 'react';
import type { ApiClient } from '../../core/client/factory.js';
import { ApiClientsContext } from '../api-clients-context.js';

function useApiClientsContext() {
  const context = useContext(ApiClientsContext);

  if (!context) {
    throw new Error('API client hooks must be used within ApiClientsProvider.');
  }

  return context;
}

export function usePublicApiClient(): ApiClient {
  return useApiClientsContext().public;
}

export function useTenantApiClient(): ApiClient {
  return useApiClientsContext().tenant;
}

export function useAdminApiClient(): ApiClient {
  return useApiClientsContext().admin;
}
