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

