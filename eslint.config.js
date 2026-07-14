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
      'packages/api-client/src/core/generated/**',
      'packages/api-client/openapi/filtered/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['packages/api-client/src/core/client/http-client.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message: 'Import axios only from packages/api-client/src/core/client/http-client.ts.',
            },
            {
              group: [
                '**/packages/api-client/src/core/generated/**',
                '@event-platform/api-client/**/generated/**',
              ],
              message:
                'Import generated OpenAPI artifacts only via @event-platform/api-client/core.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/api-client/src/**/*.{ts,tsx}'],
    ignores: ['packages/api-client/src/core/client/http-client.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Import axios only from packages/api-client/src/core/client/http-client.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['packages/api-client/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Use @event-platform/api-client instead of fetch().',
        },
      ],
    },
  },
];
