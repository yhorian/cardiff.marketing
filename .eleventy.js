const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const postcss = require('postcss');
const fs = require('fs');
const postcss_import = require("postcss-import");
const tailwindcss_nesting = require("tailwindcss/nesting");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const favGen = require("eleventy-plugin-gen-favicons/favicon-gen");
const favHtml = require("eleventy-plugin-gen-favicons/html-gen");
const markdownItToC = require("markdown-it-toc-done-right")

const cssPath = "./src/static/css/style.css"
const cssOutpath = "./src/static/css/tailwind.css"
var cssStore = ""
var favicons = ""

const plugins = [postcss_import, tailwindcss_nesting, tailwindcss, autoprefixer, cssnano];

async function getTailwindCSS() {
  let css = fs.readFileSync(cssPath, 'utf8');
  let result = await postcss(plugins).process(css, {
    from: cssPath
  });
  cssStore = result.css;
}

async function getFavicons() {
  let result = await favGen("./src/static/img/cm-icon.png", "./_site", {
    manifestData: {},
    generateManifest: false,
    skipCache: false
  }).then(
    (result) => {
      return favHtml(result)
    }
  );
  favicons = result;
}

function articleImageProcess({
  src,
  alt = "",
  label = false,
  _class = false,
  sizes = "(max-width: 1000px) 800px, 1200px",
  widths = ["auto", "800", "1200"],
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

  // Build the img element
  let img = `<img
    src="${lowsrc.url}"
    width="${(width) ? width : highsrc.width}"
    height="${(height) ? height : highsrc.height}"
    alt="${alt}"
    ${(lazy) ? 'loading="lazy"' : ''}
    ${(_class) ? 'class="' + _class + '"' : ''}
    decoding="async">`;

  // Build the picture element
  let picture = `<picture> ${Object.values(metadata).map(imageFormat => {
    return imageFormat.map(image => {
      return `<source type="${image.sourceType}" srcset="${image.srcset}" sizes="${sizes}">`;
    }).join("\n");
  }).join("\n")}${img}</picture>`;

  // Build the figure element
  let figure = `<figure>${picture}${(label) ? '<figcaption>' + alt + '</figcaption>' : ''}</figure>`;

  return figure;
}


// Set up markdown-it instance with anchor plugin
const markdownLib = markdownIt({
  html: true,
  breaks: true,
  linkify: false
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    class: "no-underline absolute -translate-x-full",
    symbol: `<span aria-hidden="true" class="text-base">🔗</span>`,
    placement: "before",
  })
}).use(markdownItToC);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {

  // Set Eleventy to use our markdown-it instance
  eleventyConfig.setLibrary('md', markdownLib);

  // Run PostCSS and get the output
  eleventyConfig.on('eleventy.before', getTailwindCSS);
  eleventyConfig.on('eleventy.before', getFavicons);

  // Less terminal output
  eleventyConfig.setQuietMode(false);

  // Force the use of full layout file names to speed building
  eleventyConfig.setLayoutResolution(false);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Prevent any loops with async file writes to tailwind.
  eleventyConfig.watchIgnores.add(cssOutpath);
  eleventyConfig.addWatchTarget(cssPath);

  // Optional filter to inline tailwind css
  eleventyConfig.addFilter("inlineTailwind", () => {
    return cssStore;
  });

  // Optional filter to inline Alpine.js
  eleventyConfig.addFilter('inlineAlpine', (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
  });

  // Filter to add favicon data
  eleventyConfig.addFilter("favicons", () => {
    return favicons;
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