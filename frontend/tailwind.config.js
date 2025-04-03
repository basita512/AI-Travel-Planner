/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4a94e8',
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        secondary: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#c2410c',
        },
        dark: {
          light: '#475569',
          DEFAULT: '#334155',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
} 