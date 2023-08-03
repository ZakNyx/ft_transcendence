/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{jsx,js,ts,tsx}"],  
  theme: {
    extend: {
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

