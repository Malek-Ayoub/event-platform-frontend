export {
  createFallbackTenant,
  DEFAULT_EXCLUDED_SUBDOMAINS,
  DEFAULT_FALLBACK_TENANT_SLUG,
} from './constants/index.js';
export { TenantContext, TenantProvider, useOptionalTenant, useTenant } from './context/index.js';
export type { TenantProviderProps } from './context/index.js';
export {
  readBaseDomainFromEnv,
  readTenantSlugFromEnv,
  resolveTenant,
  TenantResolver,
} from './resolver/index.js';
export type { TenantRegistry, TenantResolution, TenantResolverOptions } from './resolver/index.js';
export type {
  Tenant,
  TenantBranding,
  TenantContextValue,
  TenantResolutionSource,
  TenantTheme,
} from './types/index.js';
export { brandingToThemeVariables, TenantThemeBridge } from './theme/index.js';
export type { TenantThemeBridgeProps } from './theme/index.js';
export {
  buildTenantApiBaseUrl,
  buildTenantPublicUrl,
  getTenantFromHostname,
  isLocalhostDevelopment,
  isMainDomain,
} from './utils/index.js';
export type { HostnameParseOptions, TenantUrlOptions } from './utils/index.js';
