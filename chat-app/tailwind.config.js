/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 Includes React component files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],   // 👈 DaisyUI plugin
}