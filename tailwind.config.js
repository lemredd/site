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
          to: { transform: "translateX(0%)" },
        },
        "swipe-l": {
          from: {
            transform: "translateX(-5%)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0%)",
            opacity: "1",
          },
        },
        "swipe-r": {
          from: {
            transform: "translateX(5%)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0%)",
            opacity: "1",
          },
        },
      },
      animation: {
        "swipe-l": "swipe-l 300ms ease-in-out 1",
        "swipe-r": "swipe-r 300ms ease-in-out 1",
      },
    },
  },
  plugins: [],
};
