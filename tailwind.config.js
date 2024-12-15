/** @type {import('npm:tailwindcss').Config} */
export default {
  content: ["./html/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#2EEBAA",
        fg: "#FFFFFF",
        "fg-2": "#999",
        bg: "#000000",
      },
    },
  },
  plugins: [],
};
