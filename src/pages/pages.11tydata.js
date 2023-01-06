module.exports = {
  eleventyComputed: {
    "author": data => (data.author) ? data.author : data.settings.author,
    "permalink": data => (data.permalink) ? data.permalink : filters.slugify(data.title) + "/",
  },
  "layout": "page.pug",
  "tags": ["page"],
  "alpine": true
};