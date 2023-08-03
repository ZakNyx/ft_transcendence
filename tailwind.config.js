/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{jsx,js,ts,tsx}"],  
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },  
      },
      animation: {
        float: 'float 3s ease-in-out infinite', // Adjust the animation duration and easing for a smoother effect
      },
      fontSize: {
        'sm': '0.875rem', // Small screens
        'base': '1rem',   // Default size
        'lg': '1.125rem', // Large screens
        'xl': '1.25rem',  // Extra-large screens
      },
      colors: {
        'npc-blue': '#80CEF0',
        'npc-black': '#151317',
        'npc-purple': '#BB86FC',
        'npc-cyan': '#03DAC5',
        'npc-white': '#F5FCFF',
        'purple-hover': '#A66DDA',
      }
    },
  },
  plugins: [],
}

