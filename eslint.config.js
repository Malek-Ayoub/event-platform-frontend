import baseConfig from '@event-platform/config/eslint/base.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/dev-dist/**',
      '**/next-env.d.ts',
    ],
  },
];
