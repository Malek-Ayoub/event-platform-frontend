import { useMemo, type ReactNode } from 'react';
import { getRegisteredApiClients } from '../core/registry/client-registry.js';
import { ApiClientsContext } from './api-clients-context.js';

export type ApiClientsProviderProps = {
  children: ReactNode;
};

export function ApiClientsProvider({ children }: ApiClientsProviderProps) {
  const clients = useMemo(() => getRegisteredApiClients(), []);

  return <ApiClientsContext.Provider value={clients}>{children}</ApiClientsContext.Provider>;
}
