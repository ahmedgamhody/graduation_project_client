const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  plugins: [flowbite.plugin()],
  theme: {
    extend: {
      colors: {
        primary: "#4E4FEB",
        secondary: "#068FFF",
        background: "#EEEEEE",
        section: "#E9E9E9",
        text: "#767676",
      },
    },
  },
};
