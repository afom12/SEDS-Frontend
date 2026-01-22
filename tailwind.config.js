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
          DEFAULT: '#2563eb', // Brighter blue for a lighter UI
          dark: '#1e40af',
          light: '#3b82f6',
          lighter: '#60a5fa',
        },
        secondary: {
          DEFAULT: '#f59e0b', // Warmer, brighter amber
          dark: '#d97706',
          light: '#fbbf24',
        },
        accent: {
          DEFAULT: '#0ea5e9', // Fresh sky-blue accent
          light: '#38bdf8',
        },
        neutral: {
          DEFAULT: '#f8fafc', // Light neutral
          light: '#ffffff',
          dark: '#e2e8f0',
        },
        background: {
          DEFAULT: '#f8fafc', // Lighter, cooler background
          light: '#ffffff',
          warm: '#f1f5f9',
        },
        text: {
          DEFAULT: '#334155', // Softer slate
          dark: '#1e293b',
          light: '#64748b',
        }
      },
    },
  },
  plugins: [],
}

