/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Kanit', 'sans-serif'],
        mitr: ['Mitr', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        noto: ['Noto Sans Thai Looped', 'sans-serif'],
        embed: ['Permanent Marker', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

