/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [...defaultConfig.content, "./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        primary: "#9929EA",
        "text-primary": "#5E2A8A",
        "text-secondary": "#7D4BC1",
        "text-dark": "#3E1E5A",
        "placeholder-text": "#BCA3D6",
        "bg-main": "#F4ECFB",
        "card-bg": "#E8D6FA",
        "input-bg": "#F0E3FC",
        "border-color": "#C792EF",
        white: "#ffffff",
        black: "#000000",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
