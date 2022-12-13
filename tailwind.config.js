module.exports = {
  content: ["./**/*.html", "./**/*.pug", "./**/*.md, ./src/static/**/*.js"],
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
