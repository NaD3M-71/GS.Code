/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        'verde-bg': '#4cff00'
      },
      fontFamily: {
        'Rubik': ['Rubik','Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}

