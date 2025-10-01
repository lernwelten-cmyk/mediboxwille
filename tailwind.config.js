/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'senior-sm': '1.125rem',   // 18px
        'senior-base': '1.25rem',  // 20px
        'senior-lg': '1.5rem',     // 24px
        'senior-xl': '2rem',       // 32px
        'senior-2xl': '2.5rem',    // 40px
      },
      spacing: {
        'touch': '3rem',  // 48px minimum touch target
      }
    },
  },
  plugins: [],
}
