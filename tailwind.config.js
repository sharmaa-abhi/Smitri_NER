/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        senior: {
          blue: "#1E3A8A",
          teal: "#0F766E",
          amber: "#D97706",
          rose: "#BE123C",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          text: "#0F172A",
          muted: "#475569"
        }
      },
      fontSize: {
        'senior-base': '1.125rem',
        'senior-lg': '1.25rem',
        'senior-xl': '1.5rem',
        'senior-2xl': '1.875rem',
        'senior-3xl': '2.25rem',
        'senior-4xl': '3rem',
      }
    },
  },
  plugins: [],
}
