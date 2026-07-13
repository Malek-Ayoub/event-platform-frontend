import type { defaultCssVariables } from '@event-platform/config/tailwind/tokens';

/**
 * Semantic theme overrides for a tenant.
 * Values map to CSS custom properties consumed by `@event-platform/ui`.
 */
export type TenantTheme = Partial<Record<keyof typeof defaultCssVariables, string>>;

export type TenantBranding = {
  name: string;
  slug: string;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
};

export type Tenant = {
  id: string;
  slug: string;
  branding: TenantBranding;
  theme: TenantTheme;
};

export type TenantResolutionSource = 'subdomain' | 'localhost' | 'override' | 'env' | 'fallback';

export type TenantContextValue = {
  tenant: Tenant;
  branding: TenantBranding;
  theme: TenantTheme;
  slug: string;
  isFallback: boolean;
  source: TenantResolutionSource;
};
