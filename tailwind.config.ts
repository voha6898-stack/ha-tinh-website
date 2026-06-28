import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vn-red":   { 900: "#7B1013", 800: "#9B2226", 700: "#C62828", 600: "#E53935" },
        "vn-gold":  { 700: "#A07810", 600: "#C8960C", 500: "#D4A017", 400: "#F0C040", 300: "#F8DA80" },
        forest:     { 950: "#0D2B14", 900: "#1B4332", 800: "#1B5E20", 700: "#2E7D32", 600: "#388E3C", 100: "#E8F5E9" },
        ocean:      { 900: "#003D6B", 800: "#01579B", 700: "#0277BD", 600: "#0288D1", 100: "#E1F5FE" },
        cream:      { DEFAULT: "#FFF8E7", dark: "#F5EDD3" },
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "vn-gradient": "linear-gradient(135deg, #1B4332 0%, #1B5E20 40%, #01579B 100%)",
        "gold-gradient": "linear-gradient(90deg, #D4A017, #F0C040, #D4A017)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
}

export default config
