/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      borderRadius: {
        xl: '0.75rem',
      },
      spacing: {
        4: '0.25rem',
        8: '0.5rem',
        12: '0.75rem',
        16: '1rem',
        24: '1.5rem',
        32: '2rem',
        48: '3rem',
        64: '4rem',
      },
      colors: {
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
      },
    },
  },
};
