module.exports = {
  content: ["./**/*.pug", "./**/*.md", "./static/js/*.js"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
  },
  variants: {
    extend: {
      display: ['dark']
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
