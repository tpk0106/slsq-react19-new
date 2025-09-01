/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", ...fontFamily.sans],
        montserrat: ["Montserrat", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
