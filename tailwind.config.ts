import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-fira)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        factorial: {
          red: "#E51943",      // Radical Red (Factorial primary)
          green: "#009698",    // Viridian Green (secondary)
          // optional neutrals you can lean on:
          ink: "#111827",
          mist: "#F9FAFB",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
