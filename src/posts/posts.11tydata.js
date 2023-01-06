module.exports = {
  eleventyComputed: {
    "author": data => (data.author) ? data.author : data.settings.author,
    "permalink": data => (data.permalink) ? data.permalink : filters.slugify(data.title) + "/",
  },
  "layout": "post.pug",
  "tags": ["post"],
  "alpine": true
};