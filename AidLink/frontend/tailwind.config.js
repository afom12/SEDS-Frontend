/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#2d3250', // Deep slate blue
          dark: '#1f2338',
          light: '#3d4468',
          lighter: '#4f5984',
        },
        secondary: {
          DEFAULT: '#f9b17a', // Warm accent
          dark: '#dd9c6b',
          light: '#fbc196',
        },
        accent: {
          DEFAULT: '#f9b17a', // Keep accent aligned with brand
          light: '#fbc196',
        },
        neutral: {
          DEFAULT: '#f7f7fa',
          light: '#ffffff',
          dark: '#e3e5ed',
        },
        background: {
          DEFAULT: '#f7f7fa',
          light: '#ffffff',
          warm: '#f0f1f6',
        },
        text: {
          DEFAULT: '#2d3250',
          dark: '#1f2338',
          light: '#5a5f7a',
        }
      },
    },
  },
  plugins: [],
}

