import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ignio brand tokens — from the official Ignio brand manual. Do not alter these values.
        'ignio-purple': '#7c39ed',
        'charcoal-slate': '#38393b',
        'ice-blue-base': '#e3eeff',
        'ignio-amber': '#f39c0f',
        'warm-sand': '#efe8d8',
        'deep-forest': '#1c3a3a',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
