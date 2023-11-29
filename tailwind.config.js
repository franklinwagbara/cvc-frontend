/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // primary: "#074287",
        primary: "#031236ed",
        primary_accent: "#92D4FA",
        background: "#e5f0f6",
        light: "#F1F1F1",
        dark: "#191919",
        card: "",
        card_shadow: "",
        content_area: "#e5f0f6",
      },
      width: {
        side_nav: "17rem",
      },

      height: {
        card_area: "23.5rem",
        card_area_lg: "60rem",
      },

      margin: {
        content_mt: "5rem",
      },

      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
};
