/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        ahv: {
          blue: "#020617", // very dark navy
          primary: "#0D99FF", // Noble primary accent from Figma
          primarySoft: "#E0F2FE", // sky-100 - soft background
          accent: "#6366F1", // indigo-500 - secondary accent
        },
      },
    },
  },
  plugins: [],
};

