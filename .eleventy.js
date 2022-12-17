const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const lazy_loading = require('markdown-it-image-lazy-loading');
const Image = require("@11ty/eleventy-img");
const postcss = require('postcss');
const fs = require('fs');
const cssPath = "./src/static/css/style.css"
const cssOutpath = "./src/static/css/tailwind.css"
const css = fs.readFileSync(cssPath, 'utf8');
const postcss_import = require("postcss-import");
const tailwindcss_nesting = require("tailwindcss/nesting");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

var plugins = [postcss_import, tailwindcss_nesting, tailwindcss, autoprefixer, cssnano];

async function getTailwindCSS() {
  const result = await postcss(plugins).process(css, { from: cssPath });
  return result.css;
}

async function createCSSFile() {
  const tailwindCss = await getTailwindCSS();
  fs.writeFileSync(cssOutpath, tailwindCss);
}

function imageShortcode({src, alt="", sizes="(max-width: 600px) 500px, (max-width: 1200px) 800px, 1200px", widths=["500","800", "1200"], formats=["webp", "jpeg"], lazy=true}) {
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
    loading: (lazy) ? "lazy" : true,
    decoding: "async"
    
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.on('eleventy.before', createCSSFile);
  
  eleventyConfig.addFilter("inlineTailwind", function() {
    return fs.readFileSync(cssOutpath, 'utf8');
  });  
  
  eleventyConfig.addFilter('inlineAlpine', function(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  });

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
  // alpine.js and style.css are being passed just in case you want to stop inlining them.
  // You can switch from inline tailwind and a separate file if it gets too large (80kb+). This will speed up loading the site.
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
      "./src/static/css/tailwind.css":
        "./static/css/style.css",
  });

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
