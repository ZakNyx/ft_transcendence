/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{jsx,js,ts,tsx}"],  
  theme: {
    extend: {
      colors: {
        'npc-blue': '#80CEF0'
      }
    },
  },
  plugins: [],
}

