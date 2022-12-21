module.exports = {
  content: ["./**/*.pug", "./**/*.md", "./static/js/*.js"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: "70ch",
          },
        },
      })
    },
  },
  variants: {
    extend: {
      display: ['dark']
    },
  },
  plugins: [require("@tailwindcss/typography")],
};