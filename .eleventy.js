const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const PostCSSPlugin = require("eleventy-plugin-postcss");
// const lazy_loading = require('markdown-it-image-lazy-loading');
const Image = require("@11ty/eleventy-img");

function imageShortcode(src, alt="", sizes="100vw", widths=["300w","500w","800w","1200w"], formats=["webp", "jpeg"]) {
  let metadata = Image.statsSync(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/",
  });
  Image(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/"
  });
  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);
 
  // Readable date transformation. 02 Sept 2020
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return dateObj.toLocaleDateString("en-gb", {year: "numeric", day: "2-digit", month: "short"});
  });

  // Get current year.
  // Accessed in pug by doing "filters.year()"
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Image processing
  eleventyConfig.addShortcode('image', imageShortcode);

  // Automatically add Lazy loading to markdown image tags
  // eleventyConfig.amendLibrary("md", mdLib => mdLib.use(lazy_loading, { base_path: "./src" ,image_size: true,decoding: true}));

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Runs PostCSS as part of Eleventy's pipeline. Will respect postcss.config.js. Also runs tailwind using tailwind.config.js.
  eleventyConfig.addPlugin(PostCSSPlugin);

  // Stops partial builds on eleventy's server. Necessary for Tailwind CSS updates to be refreshed via Postcss plugin.
  // Only a concern when you do 'npm run dev'
  eleventyConfig.setServerOptions({domdiff: false});

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Fix for lack of filters access in pug.
  // https://github.com/11ty/eleventy/issues/1523
  global.filters = eleventyConfig.javascriptFunctions; 
  eleventyConfig.setPugOptions({
      globals: ['filters'], 
      debug: false
  });

  // Markdown files will be run through the nunjucks parser. Lets us embed {% nunjuck code %}.
  return {
    dir: {
      input: "src",
    },
    markdownTemplateEngine: "njk"
  };
};
