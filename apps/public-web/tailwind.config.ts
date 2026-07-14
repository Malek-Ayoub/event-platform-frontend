import uiConfig from '@event-platform/ui/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiConfig],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
