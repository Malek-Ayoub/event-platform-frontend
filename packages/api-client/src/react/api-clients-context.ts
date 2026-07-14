import { createContext } from 'react';
import type { RegisteredApiClients } from '../core/registry/client-registry.js';

export const ApiClientsContext = createContext<RegisteredApiClients | null>(null);
