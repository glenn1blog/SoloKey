import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--sk-color-primary)",
        "primary-soft": "var(--sk-color-primary-soft)",
        accent: "var(--sk-color-accent)",
        surface: "var(--sk-color-surface)",
        "surface-soft": "var(--sk-color-surface-soft)",
        border: "var(--sk-color-border)",
        text: {
          main: "var(--sk-color-text-main)",
          muted: "var(--sk-color-text-muted)",
          invert: "var(--sk-color-text-invert)"
        },
        success: "var(--sk-color-success)",
        warning: "var(--sk-color-warning)",
        danger: "var(--sk-color-danger)",
        info: "var(--sk-color-info)"
      },
      fontFamily: {
        sans: ["Inter", '"Noto Sans TC"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
