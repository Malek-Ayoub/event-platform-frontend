import uiConfig from '@event-platform/ui/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiConfig],
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
};
