/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // 🎨 animated title text
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% center",
          },
          "50%": {
            "background-position": "100% center",
          },
        },
        // 🔔 fade in/out for notifications
        fadeInOut: {
          "0%, 100%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "10%, 90%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        "fade-in-out": "fadeInOut 4s ease-in-out",
      },
    },
  },
  plugins: [],
};
