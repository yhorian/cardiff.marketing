module.exports = {
  content: ["./**/*.pug"],
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