/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(222, 60%, 28%)",
        "primary-hover": "hsl(222, 60%, 24%)",
        secondary: "hsl(35, 90%, 55%)",
        "secondary-hover": "hsl(35, 90%, 50%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
