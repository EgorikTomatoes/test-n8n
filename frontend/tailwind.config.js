/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#070b11', panel: '#0d131c', line: '#1b2635', lime: '#b8f43d', muted: '#8b98aa' },
    fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
    boxShadow: { glow: '0 0 40px rgba(184,244,61,.08)' },
  } },
  plugins: [],
};
