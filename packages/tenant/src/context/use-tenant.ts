import { useContext } from 'react';
import { TenantContext } from './tenant-context.js';
import type { TenantContextValue } from '../types/tenant.js';

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
}

export function useOptionalTenant(): TenantContextValue | null {
  return useContext(TenantContext);
}
