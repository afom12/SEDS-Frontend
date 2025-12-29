/** @type {import('tailwindcss').Config} */
export default {
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
          DEFAULT: '#1a365d', // Deep Navy Blue (real estate style)
          dark: '#0f172a',
          light: '#2d4a6b',
          lighter: '#4a6fa5',
        },
        secondary: {
          DEFAULT: '#c9a961', // Warm Gold/Amber accent
          dark: '#a68b4f',
          light: '#d4b87a',
        },
        accent: {
          DEFAULT: '#5b7c99', // Soft Blue-Gray
          light: '#7a9bb8',
        },
        neutral: {
          DEFAULT: '#f5f3f0', // Warm off-white
          light: '#faf9f7',
          dark: '#e8e6e1',
        },
        background: {
          DEFAULT: '#faf9f7', // Cream/off-white background
          light: '#ffffff',
          warm: '#f5f3f0',
        },
        text: {
          DEFAULT: '#2d3748', // Charcoal gray
          dark: '#1a202c',
          light: '#718096',
        }
      },
    },
  },
  plugins: [],
}

