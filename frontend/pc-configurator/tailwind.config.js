/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#945ea4",
          light: "#67bdcb",
        },
      },
    },
  },
  plugins: [],
}