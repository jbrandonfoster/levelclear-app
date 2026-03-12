import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#222222',
        'dark-border': '#333333',
        'accent-gold': '#c8a961',
        'accent-gold-light': '#d4b676',
        'accent-gold-dark': '#b89450',
      },
      fontFamily: {
        'system': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
};

export default config;
