/**
 * Semantic design tokens for Tailwind / CSS variables (Sprint 0.2.1).
 * Consumed by packages/ui in a later sprint.
 */
export const semanticColors = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
} as const;

export const defaultCssVariables = {
  '--color-primary': '#2563eb',
  '--color-secondary': '#64748b',
  '--color-success': '#16a34a',
  '--color-warning': '#d97706',
  '--color-danger': '#dc2626',
  '--color-info': '#0891b2',
  '--color-muted': '#94a3b8',
  '--color-border': '#e2e8f0',
  '--color-background': '#ffffff',
  '--color-surface': '#f8fafc',
} as const;

export const borderRadius = {
  default: '0.75rem',
} as const;
