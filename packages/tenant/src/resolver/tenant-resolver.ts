import { createFallbackTenant, DEFAULT_EXCLUDED_SUBDOMAINS } from '../constants/defaults.js';
import type { Tenant, TenantContextValue, TenantResolutionSource } from '../types/tenant.js';
import { getTenantFromHostname, isLocalhostDevelopment } from '../utils/hostname.js';
import { readBaseDomainFromEnv, readTenantSlugFromEnv } from './env.js';

export type TenantRegistry = Record<string, Tenant>;

export type TenantResolverOptions = {
  hostname: string;
  baseDomain?: string;
  fallbackTenant?: Tenant;
  registry?: TenantRegistry;
  slugOverride?: string | null;
  excludedSubdomains?: readonly string[];
  useEnvOverride?: boolean;
};

export type TenantResolution = TenantContextValue;

function lookupTenant(registry: TenantRegistry | undefined, slug: string): Tenant | null {
  if (!registry) {
    return null;
  }

  return registry[slug] ?? null;
}

function buildContext(
  tenant: Tenant,
  source: TenantResolutionSource,
  isFallback: boolean,
): TenantContextValue {
  return {
    tenant,
    branding: tenant.branding,
    theme: tenant.theme,
    slug: tenant.slug,
    isFallback,
    source,
  };
}

function tenantFromSlug(
  slug: string,
  registry: TenantRegistry | undefined,
  fallbackTenant: Tenant,
): { tenant: Tenant; isFallback: boolean } {
  const tenant = lookupTenant(registry, slug);

  if (tenant) {
    return { tenant, isFallback: false };
  }

  return {
    tenant: {
      ...fallbackTenant,
      id: `${fallbackTenant.id}-${slug}`,
      slug,
      branding: {
        ...fallbackTenant.branding,
        slug,
        name: fallbackTenant.branding.name,
      },
    },
    isFallback: true,
  };
}

export class TenantResolver {
  private readonly baseDomain: string;
  private readonly fallbackTenant: Tenant;
  private readonly registry: TenantRegistry;
  private readonly excludedSubdomains: readonly string[];
  private readonly useEnvOverride: boolean;

  constructor(options: Omit<TenantResolverOptions, 'hostname' | 'slugOverride'> = {}) {
    this.baseDomain = options.baseDomain ?? readBaseDomainFromEnv() ?? 'localhost';
    this.fallbackTenant = options.fallbackTenant ?? createFallbackTenant();
    this.registry = options.registry ?? {};
    this.excludedSubdomains = options.excludedSubdomains ?? DEFAULT_EXCLUDED_SUBDOMAINS;
    this.useEnvOverride = options.useEnvOverride ?? true;
  }

  resolve(options: Pick<TenantResolverOptions, 'hostname' | 'slugOverride'>): TenantResolution {
    const hostname = options.hostname;

    if (options.slugOverride) {
      const { tenant, isFallback } = tenantFromSlug(
        options.slugOverride,
        this.registry,
        this.fallbackTenant,
      );

      return buildContext(tenant, 'override', isFallback);
    }

    if (this.useEnvOverride) {
      const envSlug = readTenantSlugFromEnv();
      if (envSlug) {
        const { tenant, isFallback } = tenantFromSlug(envSlug, this.registry, this.fallbackTenant);
        return buildContext(tenant, 'env', isFallback);
      }
    }

    const slug = getTenantFromHostname(hostname, {
      baseDomain: this.baseDomain,
      excludedSubdomains: this.excludedSubdomains,
    });

    if (slug) {
      const { tenant, isFallback } = tenantFromSlug(slug, this.registry, this.fallbackTenant);
      const source: TenantResolutionSource = isLocalhostDevelopment(hostname, this.baseDomain)
        ? 'localhost'
        : 'subdomain';

      return buildContext(tenant, source, isFallback);
    }

    return buildContext(this.fallbackTenant, 'fallback', true);
  }
}

/**
 * Resolve tenant context from hostname with optional overrides.
 */
export function resolveTenant(options: TenantResolverOptions): TenantResolution {
  const resolver = new TenantResolver(options);
  return resolver.resolve({
    hostname: options.hostname,
    slugOverride: options.slugOverride,
  });
}
