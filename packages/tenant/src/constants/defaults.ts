import { defaultCssVariables } from '@event-platform/config/tailwind/tokens';
import type { Tenant } from '../types/tenant.js';

export const DEFAULT_FALLBACK_TENANT_SLUG = 'default' as const;

export const DEFAULT_EXCLUDED_SUBDOMAINS = [
  'www',
  'api',
  'admin',
  'organizer',
  'scanner',
  'app',
] as const;

export function createFallbackTenant(overrides: Partial<Tenant> = {}): Tenant {
  const slug = overrides.slug ?? DEFAULT_FALLBACK_TENANT_SLUG;

  return {
    id: overrides.id ?? 'tenant-fallback',
    slug,
    branding: {
      name: 'Event Platform',
      slug,
      logo: null,
      favicon: null,
      primaryColor: defaultCssVariables['--color-primary'],
      secondaryColor: defaultCssVariables['--color-secondary'],
      ...overrides.branding,
    },
    theme: {
      ...overrides.theme,
    },
  };
}
