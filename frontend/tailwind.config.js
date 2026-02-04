/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        calm: {
          bg: '#F8F9FA',
          card: '#FFFFFF',
          text: '#2C3E50',
          textLight: '#7F8C8D',
          primary: '#3498DB',
          primaryHover: '#2980B9',
          success: '#27AE60',
          border: '#E0E6ED',
        }
      },
      fontFamily: {
        standard: ['Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['Comic Sans MS', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
