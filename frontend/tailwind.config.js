/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          50: '#f0f2fe',
          100: '#e6e9fd',
          200: '#d1d7fb',
          300: '#b4bef7',
          400: '#969cf2',
          500: '#7c7beb',
          600: '#6a5adb',
          700: '#5b4bc0',
          800: '#4c3f9c',
          900: '#42387d',
          950: '#292049',
        },
      },
    },
  },
  plugins: [],
}