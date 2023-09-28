/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        lato: ["Lato"],
        garamond: ["Garamond"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in-top": {
          "0%": {
            transform: "translateY(-50px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite", // Adjust the animation duration and easing for a smoother effect
        "fade-in-top": "fade-in-top 0.6s linear both",
      },
      fontSize: {
        td: {'min': '768px', 'max': '1023px'},
        sm: "0.875rem", // Small screens
        base: "1rem", // Default size
        lg: "1.125rem", // Large screens
        xl: "1.25rem", // Extra-large screens
      },
      colors: {
        "npc-blue": "#80CEF0",
        "npc-gray": "#252526",
        "npc-light-gray": "#7c7c7d",
        "npc-black": "#151317",
        "npc-purple": "#BB86FC",
        "npc-cyan": "#03DAC5",
        "npc-white": "#F5FCFF",
        "purple-hover": "#A66DDA",
        "purple-active": "#9255E5",
        "red-hover": "#c71e1e",
      },
    },
  },
  plugins: [],
};
