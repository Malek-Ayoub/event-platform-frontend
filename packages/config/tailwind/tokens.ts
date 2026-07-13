/**
 * Semantic design tokens for Tailwind / CSS variables.
 * Consumed by packages/ui ThemeProvider and app Tailwind configs.
 */
export const semanticColors = {
  primary: 'var(--color-primary)',
  primaryForeground: 'var(--color-primary-foreground)',
  secondary: 'var(--color-secondary)',
  secondaryForeground: 'var(--color-secondary-foreground)',
  success: 'var(--color-success)',
  successForeground: 'var(--color-success-foreground)',
  warning: 'var(--color-warning)',
  warningForeground: 'var(--color-warning-foreground)',
  danger: 'var(--color-danger)',
  dangerForeground: 'var(--color-danger-foreground)',
  info: 'var(--color-info)',
  infoForeground: 'var(--color-info-foreground)',
  muted: 'var(--color-muted)',
  mutedForeground: 'var(--color-muted-foreground)',
  border: 'var(--color-border)',
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  surface: 'var(--color-surface)',
} as const;

export const defaultCssVariables = {
  '--color-primary': '#2563eb',
  '--color-primary-foreground': '#ffffff',
  '--color-secondary': '#64748b',
  '--color-secondary-foreground': '#ffffff',
  '--color-success': '#16a34a',
  '--color-success-foreground': '#ffffff',
  '--color-warning': '#d97706',
  '--color-warning-foreground': '#ffffff',
  '--color-danger': '#dc2626',
  '--color-danger-foreground': '#ffffff',
  '--color-info': '#0891b2',
  '--color-info-foreground': '#ffffff',
  '--color-muted': '#f1f5f9',
  '--color-muted-foreground': '#64748b',
  '--color-border': '#e2e8f0',
  '--color-background': '#ffffff',
  '--color-foreground': '#0f172a',
  '--color-surface': '#f8fafc',
} as const;

export const borderRadius = {
  default: '0.75rem',
} as const;
