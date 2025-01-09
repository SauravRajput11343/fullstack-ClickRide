/** @type {import('tailwindcss').Config} */
const textShadow = require('tailwindcss-textshadow');
const scrollbarHide = require('tailwind-scrollbar-hide');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    textShadow, // Add text shadow plugin
    scrollbarHide, // Add scrollbar hide plugin
  ],
}
