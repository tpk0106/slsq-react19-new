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
    screens: {
      xxs: "320px",
      xs: "325px",
      sm: "425px",
      // "sm-between": {
      //   "min": "540px",
      //   "max": "667px"
      // },
      smh: "667px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
