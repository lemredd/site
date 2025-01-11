/** @type {import('npm:tailwindcss').Config} */
export default {
  content: ["./html/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#2EEBAA",
        secondary: "#FFEE4A",
        tertiary: "#44AAFF",
        fg: "#FFFFFF",
        "fg-2": "#999",
        bg: "#000000",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        "scroll-rtl": {
          to: { transform: "translateX(-100%)" },
        },
        "scroll-ltr": {
          to: { transform: "translateX(45%)" },
        },
      },
    },
  },
  plugins: [],
};
