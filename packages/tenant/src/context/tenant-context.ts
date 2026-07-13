import { createContext } from 'react';
import type { TenantContextValue } from '../types/tenant.js';

export const TenantContext = createContext<TenantContextValue | null>(null);
