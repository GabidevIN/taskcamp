/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js",], // REQUIRED ILAGAY GABO {js,jsx,ts,tsx} if needed
  theme: {
    screens: {
    sm: '640px',
    md: '768px',
    lg: '1200px', // changed from 1024px
    xl: '1400px',
  },
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        heptoslab: ['Heptoslab', 'serif'],
      },
    },
  },
  plugins: [],
}
