module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        goudy: ['"Goudy Bookletter 1911"', 'serif'], // Note the quotes
      },

      colors: {
        col1: '#800000', // your custom color
        col2: '#BBB474', // you can add more here
      }
    },
  },
  plugins: [],
}