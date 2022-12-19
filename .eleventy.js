const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lazy_loading = require('markdown-it-image-lazy-loading');
const Image = require("@11ty/eleventy-img");
const postcss = require('postcss');
const fs = require('fs');
const postcss_import = require("postcss-import");
const tailwindcss_nesting = require("tailwindcss/nesting");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");

const cssPath = "./src/static/css/style.css"
const cssOutpath = "./src/static/css/tailwind.css"
var cssStore = ""

var plugins = [postcss_import, tailwindcss_nesting, tailwindcss, autoprefixer, cssnano];

async function getTailwindCSS() {
  let css = fs.readFileSync(cssPath, 'utf8');
  let result = await postcss(plugins).process(css, {
    from: cssPath
  });
  cssStore = result.css;
}

function articleImageProcess({
  src,
  alt = "",
  label = false,
  _class = false,
  sizes = "(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px",
  widths = ["auto", "500", "800", "1200"],
  formats = ["webp", "png"],
  lazy = true,
  height = false,
  width = false
}) {
  // Not waiting for the image stats, just go!
  Image(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/"
  });

  // Get image stats from the file synchonously. Images can process in the background.
  let metadata = Image.statsSync(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/",
  });
  let lowsrc = metadata.webp[0];
  let highsrc = metadata.webp[metadata.webp.length - 1];
  return `<picture> ${Object.values(metadata).map(imageFormat => {
  return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${(width) ? width : highsrc.width}"
      height="${(height) ? height : highsrc.height}"
      alt="${alt}"
      ${(lazy) ? 'loading="lazy"': ''}
      ${(_class) ? 'class="' + _class + '"' : ''}decoding="async"> </picture> 
      ${(label) ? '<p class="image-label">'+ alt + '</p>' : ''}`
}

module.exports = function (eleventyConfig) {

  eleventyConfig.on('eleventy.before', getTailwindCSS);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Prevent any loops with async file writes to tailwind.
  eleventyConfig.watchIgnores.add(cssOutpath);
  eleventyConfig.addWatchTarget(cssPath);

  // Optional filter to inline tailwind css
  eleventyConfig.addFilter("inlineTailwind", function () {
    return cssStore;
  });

  // Optional filter to inline Alpine.js
  eleventyConfig.addFilter('inlineAlpine', function (filePath) {
    return fs.readFileSync(filePath, 'utf8');
  });

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Readable date transformation. 02 Sept 2020
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return dateObj.toLocaleDateString("en-gb", {
      year: "numeric",
      day: "2-digit",
      month: "short"
    });
  });

  // Get current year.
  // Accessed in pug by doing "filters.year()"
  eleventyConfig.addFilter("year", () => `${new Date().getFullYear()}`);

  // Image processing
  eleventyConfig.addFilter('image', articleImageProcess);

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Plugin for article read time estimates
  eleventyConfig.addPlugin(emojiReadTime);

  // Broken link checker
  eleventyConfig.addPlugin(brokenLinksPlugin);

  // Copy Static Files to /_Site
  // alpine.js and style.css are being passed just in case you want to stop inlining them.
  // You can switch from inline tailwind and a separate file if it gets too large (80kb+). This will speed up loading the site.
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
    "./src/static/css/tailwind.css": "./static/css/style.css",
  });

  // Stops partial builds on eleventy's server. Necessary for Tailwind CSS updates to be refreshed via Postcss plugin.
  // Only a concern when you do 'npm run dev'
  eleventyConfig.setServerOptions({
    domdiff: false
  });

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