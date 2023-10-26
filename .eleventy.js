const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToC = require("markdown-it-toc-done-right")
const PostCSSPlugin = require("eleventy-plugin-postcss");
const postcssrc = require('postcss-load-config')

console.log(`Running as ${process.env.NODE_ENV}.`);

// Load PostCSS options
var plugins, options = postcssrc({
  parser: true,
  map: 'inline'
})

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
  // Lazy return method for dev that does no processing.
  if (process.env.NODE_ENV == "dev") {
    return `<figure><picture> 
      <img
        src="${src.replace("src", "")}"
        width="${width}"
        height="${height}"
        alt="${alt}"
        ${(lazy) ? 'loading="lazy"': ''}
        ${(_class) ? 'class="' + _class + '"' : ''}decoding="async"> </picture> 
        ${(label) ? '<figcaption>'+ alt + '</figcaption>' : ''}
        </figure>`
  }

  // Not waiting for the image stats, just go! Pug can't do asynchonous calls.
  Image(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/"
  });

  // Get image stats from the file synchonously. Images process in the background.
  let metadata = Image.statsSync(src, {
    widths: widths,
    formats: formats,
    urlPath: "/static/img/",
    outputDir: "./_site/static/img/",
  });
  let lowsrc = metadata.webp[0];
  let highsrc = metadata.webp[metadata.webp.length - 1];

  let img = `<img
    src="${lowsrc.url}"
    width="${(width) ? width : highsrc.width}"
    height="${(height) ? height : highsrc.height}"
    alt="${alt}"
    ${(lazy) ? 'loading="lazy"' : ''}
    ${(_class) ? 'class="' + _class + '"' : ''}
    decoding="async">`;

  let picture = `<picture> ${Object.values(metadata).map(imageFormat => {
    return imageFormat.map(image => {
      return `<source type="${image.sourceType}" srcset="${image.srcset}" sizes="${sizes}">`;
    }).join("\n");
  }).join("\n")}${img}</picture>`;

  let figure = `<figure>${picture}${(label) ? '<figcaption>' + alt + '</figcaption>' : ''}</figure>`;

  return figure;
}

// Set up markdown-it instance with Anchor/Table of Contents plugin
const markdownLib = markdownIt({
  html: true,
  breaks: true,
  linkify: false
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    class: "no-underline absolute -translate-x-full",
    symbol: `<span aria-hidden="true" x-data="{ tooltip: false }" class="text-base">🔗</span>`,
    placement: "before",
  })
}).use(markdownItToC);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {

  // Copy Static Files to /_Site
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy({
    "./src/static/img": "./static/img",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
    "./src/favicon.ico": "./favicon.ico",
    "./src/icon-192.png": "./icon-192.png",
    "./src/icon-512.png": "./icon-512.png",
    "./src/apple-touch-icon.png": "./apple-touch-icon.png",
  });

  // Set Eleventy to use our markdown-it instance
  eleventyConfig.setLibrary('md', markdownLib);

  // Less terminal output
  eleventyConfig.setQuietMode(true);

  // Force the use of full layout file names to speed building. Can't use layouts with no extension if false.
  eleventyConfig.setLayoutResolution(false);

  // Automatic use of your .gitignore setting
  eleventyConfig.setUseGitIgnore(true);

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

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Plugin for article read time estimates
  eleventyConfig.addPlugin(emojiReadTime);

  // Fix for lack of filters access in pug.
  // https://github.com/11ty/eleventy/issues/1523
  global.filters = eleventyConfig.javascriptFunctions;
  eleventyConfig.setPugOptions({
    globals: ['filters'],
    debug: false
  });

  // Postcss plugin for processing and minifying tailwind.
  eleventyConfig.addPlugin(PostCSSPlugin, plugins, options);

  // Image processing plugin.
  eleventyConfig.addFilter('image', articleImageProcess);

  // Markdown files will be run through the nunjucks parser. Lets us embed {% nunjuck code %}.
  return {
    dir: {
      input: "src",
    },
    markdownTemplateEngine: "njk"
  };
};