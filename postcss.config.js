module.exports = {
    plugins: [
      require('postcss-import'),
      require('autoprefixer'),
      require('tailwindcss'),
      require('postcss-pxtorem'),
      require('postcss-preset-env'),
      require('cssnano'),
    ]
  }