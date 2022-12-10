module.exports = {
  content: ["./**/*.html", "./**/*.pug", "./**/*.md, ./src/static/**/*.js"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
