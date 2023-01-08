module.exports = {
  content: ["./**/*.pug", ".eleventy.js"],
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
  plugins: [require("@tailwindcss/typography"), ]
};