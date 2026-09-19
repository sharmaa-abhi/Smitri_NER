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
        'xs': ['0.75rem', { lineHeight: '1.4' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],      // 14px
        'base': ['1rem', { lineHeight: '1.6' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.5' }],      // 18px
        'xl': ['1.25rem', { lineHeight: '1.4' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],       // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '1.15' }],     // 36px
        '5xl': ['2.75rem', { lineHeight: '1.1' }],      // 44px
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
