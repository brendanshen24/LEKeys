/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brandgreen: "#00A60E",
        brandgrey: "#8D8D8D",
        brandprimary:"#2C2C2C",
        brandsecondary: "#212121",
        secondgreen: "#81DF89"
      },
    },
  },
  plugins: [],
};
