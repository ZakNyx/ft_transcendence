/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{jsx,js,ts,tsx}"],  
  theme: {
    extend: {
      colors: {
        'npc-blue': '#80CEF0',
        'npc-black': '#151317',
        'npc-purple': '#BB86FC',
        'npc-cyan': '#03DAC5',
        'npc-white': '#F5FCFF',
      }
    },
  },
  plugins: [],
}

