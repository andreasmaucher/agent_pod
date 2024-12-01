/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'ripple': 'ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(2)',
            opacity: '0.1',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};