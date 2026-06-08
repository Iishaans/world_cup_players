import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#05140c",
          900: "#08200f",
          800: "#0c2d16",
        },
        gold: {
          DEFAULT: "#f5c542",
          soft: "#ffe7a3",
          deep: "#c89b2a",
        },
        ink: {
          950: "#070a12",
          900: "#0b1120",
          800: "#121a2e",
          700: "#1b263f",
          600: "#293553",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(245,197,66,0.4), 0 0 24px -6px rgba(245,197,66,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "pop-in": "pop-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
