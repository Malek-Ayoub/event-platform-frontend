import { useMemo, type ReactNode } from 'react';
import { resolveTenant, type TenantResolverOptions } from '../resolver/tenant-resolver.js';
import { TenantContext } from './tenant-context.js';

export type TenantProviderProps = Omit<TenantResolverOptions, 'hostname'> & {
  children: ReactNode;
  hostname?: string;
};

function resolveHostname(explicitHostname?: string): string {
  if (explicitHostname) {
    return explicitHostname;
  }

  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }

  return 'localhost';
}

export function TenantProvider({
  children,
  hostname,
  baseDomain,
  fallbackTenant,
  registry,
  slugOverride,
  excludedSubdomains,
  useEnvOverride,
}: TenantProviderProps) {
  const resolvedHostname = resolveHostname(hostname);

  const value = useMemo(
    () =>
      resolveTenant({
        hostname: resolvedHostname,
        baseDomain,
        fallbackTenant,
        registry,
        slugOverride,
        excludedSubdomains,
        useEnvOverride,
      }),
    [
      resolvedHostname,
      baseDomain,
      fallbackTenant,
      registry,
      slugOverride,
      excludedSubdomains,
      useEnvOverride,
    ],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}
