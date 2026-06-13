/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF1F1F",
          dark: "#E00000",
          light: "#FFE5E5",
        },
        surface: "#FFFFFF",
        bg: "#F8F9FB",
        border: "#ECECEC",
        ink: "#111111",
        muted: "#6B7280",
        dark: {
          bg: "#0F1115",
          surface: "#1A1D24",
          border: "#2A2E37",
          ink: "#F5F5F5",
          muted: "#9CA3AF",
        },
      },
      borderRadius: {
        xl: "20px",
        "2xl": "24px",
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(17, 17, 17, 0.06)",
        premium: "0 12px 40px -8px rgba(255, 31, 31, 0.18)",
        nav: "0 2px 16px rgba(17, 17, 17, 0.04)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        scaleIn: "scaleIn 0.25s ease-out",
        slideUp: "slideUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
