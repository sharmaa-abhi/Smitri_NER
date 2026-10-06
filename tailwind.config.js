/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#E6F4F1",
          100: "#C2E5DF",
          200: "#93CEC5",
          300: "#5EB2A6",
          400: "#2F9285",
          500: "#127267",
          600: "#0B534B",
          700: "#08433C",
          800: "#06342E",
          900: "#042420",
          hover: "#08433C",
          active: "#06342E",
          soft: "#E6F4F1",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          hover: "#059669",
          active: "#047857",
          soft: "#ECFDF5",
        },
        tertiary: {
          DEFAULT: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          hover: "#B45309",
          active: "#92400E",
          soft: "#FFFBEB",
        },
        neutral: {
          DEFAULT: "#5A6A66",
          50: "#F6F8F7",
          100: "#EBF0EE",
          200: "#D5DFDC",
          300: "#B2C2BD",
          400: "#859893",
          500: "#5A6A66",
          600: "#465350",
          700: "#333D3A",
          800: "#212826",
          900: "#111615",
          dark: "#111615",
          light: "#D5DFDC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          page: "#F6F8F7",
          card: "#FFFFFF",
          mint: "#F2F8F6",
          muted: "#EBF0EE",
          dark: "#0B534B",
          darkest: "#042420",
        },
        senior: {
          blue: "#0B534B", // Harmonized to Primary Deep Teal
          teal: "#0B534B",
          emerald: "#10B981",
          amber: "#D97706",
          rose: "#DC2626",
          surface: "#F6F8F7",
          card: "#FFFFFF",
          text: "#111615",
          muted: "#5A6A66",
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
      },
      outlineColor: {
        ring: "var(--ring)",
      },
    },
  },
  plugins: [],
};
