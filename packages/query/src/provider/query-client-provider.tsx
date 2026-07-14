import { type ReactNode } from 'react';
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/query-defaults.js';

export type QueryClientProviderProps = {
  children: ReactNode;
  client?: typeof queryClient;
};

export function QueryClientProvider({ children, client = queryClient }: QueryClientProviderProps) {
  return <TanstackQueryClientProvider client={client}>{children}</TanstackQueryClientProvider>;
}
