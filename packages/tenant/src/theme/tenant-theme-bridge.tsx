import { ThemeProvider } from '@event-platform/ui';
import { useMemo, type ReactNode } from 'react';
import { useTenant } from '../context/use-tenant.js';
import { brandingToThemeVariables } from './branding-to-theme-variables.js';

export type TenantThemeBridgeProps = {
  children: ReactNode;
};

/**
 * Applies the active tenant theme via `@event-platform/ui` ThemeProvider.
 */
export function TenantThemeBridge({ children }: TenantThemeBridgeProps) {
  const { branding, theme } = useTenant();
  const variables = useMemo(() => brandingToThemeVariables(branding, theme), [branding, theme]);

  return <ThemeProvider variables={variables}>{children}</ThemeProvider>;
}
