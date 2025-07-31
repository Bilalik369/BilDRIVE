/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
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
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
    },
  },
  plugins: [],
}