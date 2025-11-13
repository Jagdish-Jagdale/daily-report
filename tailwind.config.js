/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canva-purple': '#8b5cf6',
        'canva-blue': '#3b82f6',
        'canva-gradient-start': '#e0f2fe',
        'canva-gradient-end': '#f3e8ff',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
