// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5D5DFF", // Replace with your desired color
        "primary-content": "#ffffff", // Optional: text color on primary background
      },
    },
  },
  plugins: [],
};
