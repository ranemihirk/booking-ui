import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  theme: {
    container: {
      center: true,
      padding: "1rem", // Default padding
    },
    extend: {
      colors: {
        light: colors.neutral[50],
        dark: colors.zinc[900],
        blue: colors.blue[700],
        gray: colors.gray[400],
        red: colors.red[600],
        green: colors.emerald[900],
        waiting: colors.amber[400],
        approved: colors.lime[400],
        rejected: colors.red[500],
      },
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [],
};
export default config;
