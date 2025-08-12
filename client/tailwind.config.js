/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js",], // REQUIRED ILAGAY GABO {js,jsx,ts,tsx} if needed
  theme: {
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
