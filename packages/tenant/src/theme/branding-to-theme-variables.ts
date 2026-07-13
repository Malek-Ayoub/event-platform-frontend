import type { ThemeVariables } from '@event-platform/ui';
import type { TenantBranding, TenantTheme } from '../types/tenant.js';

/**
 * Map tenant branding and theme overrides to CSS variables for ThemeProvider.
 */
export function brandingToThemeVariables(
  branding: TenantBranding,
  theme: TenantTheme = {},
): ThemeVariables {
  return {
    '--color-primary': branding.primaryColor,
    '--color-secondary': branding.secondaryColor,
    ...theme,
  } as ThemeVariables;
}
