module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('postcss-pxtorem'),
    ...(process.env.NODE_ENV !== "prod" ? [require('cssnano')] : [])
  ]
};