---
title: >
  Pug in Eleventy: How to make it work
description: Pug does not interface with Eleventy well. But there's good news! It can integrated smoothly with some tweaks.
date: 2022-12-22
tags:
  - pug
  - eleventy
  - javascript
prism: true
permalink: "/pug-in-eleventy-making-it-work/"
thumbnail: src/static/img/pugxeleventy.png
thumbnaildesc: Pug HTML code processed by Eleventy
---

[[_toc_]]

## Getting started: How to get basic Eleventy features working with Pug

Integrating Pug (formerly Jade) with Eleventy is a great way to maximize the power of both technologies. The combination of Pug's powerful and expressive templating language, along with Eleventy’s flexibility in content management, makes it possible to create dynamic and interactive websites quickly and easily. While Pug comes pre-installed with Eleventy; there are some kinks to it. In this blog post, I'll provide an overview of how you can get started using these two tools together to produce amazing sites at blazing speeds.

## Getting Eleventy filters and shortcodes to work

Pug has [it's own filter system](https://pugjs.org/language/filters.html) that can be compiled and called but Pug based functions have a number of drawbacks that make them inferior: Namely it's inabiltiy to access Eleventy's runtime information and datacascade. For that reason, I highly recommend going with Eleventy's built in shortcode and filter environment.

Shortcodes are code snippets that will be repeated within a template. In Eleventy, these are defined and passed to the template compilers. They can also be compiled as javascript functions to make more complex queries and calls before returning a string. Unfortunately, Pug's filter system does not lend itself well to allowing shortcode integration in the same way other templating languages have. Thankfully we can reformat the shortcodes as filter functions to get the same result.

Eleventy uses it's configuration file '.eleventy.js' to implement shortcodes and filters. If you open up this file you'll see something like this:

```js
/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {
  // Return your Object options:
  return {
    dir: {
      input: "src"
    }
    markdownTemplateEngine: "pug"
  }
};
```

This file is the key to customising Eleventy's output. Either with a ready to go Plugin or your own custom code using Eleventy's hooks such as Transform, Filter or Input/Output capture.

For now, lets add a filter in there to demostrate the issue and how to get around it:

```js
/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("uppercase", function(string) {
    return string.toUpperCase();
  });

  // Return your Object options:
  return {
    dir: {
      input: "src"
    }
    markdownTemplateEngine: "pug"
  }
};
```

This adds the 'uppercase' filter that can be called in templates to take an input string and return an uppercase version. Here's the pug code to call it:

```pug
// index.pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(http-equiv="x-ua-compatible", content="ie=edge")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Test Page
  body
    h1 #{ uppercase("my test page") }
```

Anything between curly brackets is run as escaped javascript with Eleventy's data passed to it. For an unescaped version, you can use !{ uppercase("test") } to prevent Pug from parsing the output. Let's run this code and see it in action...

```powershell
[11ty] Problem writing Eleventy templates: (more in DEBUG output)
[11ty] 1. Having trouble rendering pug template ./src/index.pug (via TemplateContentRenderError)
[11ty] 2. ./src/index.pug:4
[11ty]
[11ty] Cannot read properties of undefined (reading 'uppercase') (via TypeError)
[11ty]
[11ty] Original error stack trace: TypeError: ./src/index.pug:4
[11ty]     2| title Test Page
[11ty]     3| body
[11ty]   > 4| h1 #{ uppercase("my test page") }
[11ty]
[11ty] Cannot read properties of undefined (reading 'uppercase')
```

And we encounter our first error. Filters are not an integrated feature of Eleventy with Pug. Checking the [official feature list](https://www.11ty.dev/docs/languages/pug/), the only things officially support are 'Includes' and 'Extends' commands! But don't panic. We have ways of **making** it work. Add this to eleventy's config in .eleventy.js:

```js
  // .eleventy.js
  module.exports = function (eleventyConfig) {
  [...]
  // Fix for lack of filters access in pug.
  // https://github.com/11ty/eleventy/issues/1523
  global.filters = eleventyConfig.javascriptFunctions;
  eleventyConfig.setPugOptions({
    globals: ['filters'],
    debug: false
  });
  [...]
  }
```

This exports Eleventy's collection of functions (including Shortcodes) and extends them into the Pug templating engine. You can now access any Eleventy built function like our example 'uppercase' by calling #{ filters.uppercase("my test page")}. Great!

```pug
// index.pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(http-equiv="x-ua-compatible", content="ie=edge")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Test Page
  body
    h1 #{ filters.uppercase("my test page") }
```

And when we give it a whirl:

<div class="unstyled">
<h1> MY TEST PAGE </h1>
</div>

It works!

## Front Matter and Permalinks

Front matter in Eleventy comes in three flavours: Javascript, JSON or YAML format. All of these are processed using their respective engines except for Permalinks and Computed data in YAML. These are processed by the template first! This can produce unusual behaviour when you're dealing with them. For example:

```pug
// index.pug
---
title: My Test page
permalink: /test-page/
---
doctype html
html(lang='en')
  head
  [...]
```

```powershell
[11ty] unexpected token "slash" (via Error)
[11ty]
[11ty] Original error stack trace: Error: ./src/index.pug:1:1
[11ty]   > 1| /test-page/
[11ty] -------^
[11ty]
```

Whoops. We've run into [another documented bug](https://github.com/11ty/eleventy/issues/286). What you'll want to do is this:

```pug
// index.pug
---
title: My Test page
permalink: "| /test-page/"
---
doctype html
html(lang='en')
  head
  [...]
```

<div class="unstyled">
<h1> MY TEST PAGE </h1>
</div>

Because the pipe "|" character is also used in YAML and Pug can't handle the forward slashes, you'll need to wrap the whole thing in quotes to get it past the preprocess and then have a pipe inside so that Pug maintains the whitespace. This is also true for the Eleventy ComputedData method of processing YAML. Here, we'll try setting the heading to a random number with Javascript:

```pug
// index.pug
---
eleventyComputed:
    title: "#{ Math.random() }"
permalink: "| /test-page/"
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
```

<div class="unstyled">
<h1>&lt;0.6104364606799926&gt;&lt;/0.5040259614573321&gt;</h1>
</div>

Eek. Something has gone wrong. Yet another quirk is in play here. We need to add a pipe AND make sure the function is unescaped to prevent it running twice.

```pug
// index.pug
---
eleventyComputed:
    title: "| !{ Math.random() }"
permalink: "| /test-page/"
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
```

<div class="unstyled">
<h1>0.5377797838045952</h1>
</div>

That's better! Now that functions are working in the YAML, we can combine this with our first trick to use filters on it:

```pug
// index.pug
---
eleventyComputed:
    title: "| !{ filters.uppercase("my test page") }"
permalink: "| /test-page/"
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
```

<div class="unstyled">
<h1>MY TEST PAGE</h1>
</div>

## Pug Include/Extends vs Eleventy Layout/Content

The one thing that Eleventy does support is the include/extends language used by Pug. Where this quickly falls down is that it won't pass front matter data. This is something that Eleventy's Layout/Content method and the data cascade does support. Layouts can also be in any templating language!

That means we could use both - but we're more likely to want the functionality that Eleventy can provide with Layout chaining. Here is an example of what both could achieve:

```pug
// index.pug
---
title My Test Page
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
    include footer.pug
```

```pug
// footer.pug
footer
  p Written by: Me
```

<div class="unstyled">
<h1>MY TEST PAGE</h1>
<br>
<p> thanks for including me </p>
</div>

Simple but effective and allows us to break up our code to re-use across multiple templates.

But what could we achieve if we used Layout chaining?

```pug
// index.pug
---
title My Test Page
layout: footer.pug
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
    include footer.pug
```

```pug
// footer.pug
- --
author: Me
- --
#{ content }
footer
  p Written by: #{ author }
```

<div class="unstyled">
<h1>&lt;Test content>Test content></h1>
<br>
<p>Written by: Me</p>
</div>

Uh oh, it's doing it again. But it's not as simple as switching to unescaped code again. We need to also add a pipe to the content function:

```pug
!{ content }
```

And our finished code:

```pug
// index.pug
---
title My Test Page
layout: footer.pug
---
doctype html
html(lang='en')
  head
    [...]
  body
    h1 #{ title }
    include footer.pug
```

```pug
// footer.pug
- --
author: Me
- --
| !{ content }
footer
  p Written by: #{ author }
```

<div class="unstyled">
<h1 >Test content</h1>
<br>
<p >Written by: Me</p>
</div>

## After all that, should I be using Pug in Eleventy?

It may be easier to go with one of the more popular templating languages such as Liquid or Nunjucks. Pug support in Eleventy is basic at it's best. But if you are determined to power anyway: Then know you're not alone. I'll probably still be using it too!

If you are new to Eleventy then take the opportunity to look at the many starter templates out there on Github. Here are a few that feature Pug:

- [Cardiff.marketing source code](https://github.com/yhorian/cardiff.marketing)
- [Pugsum: A 11ty starter kit using Pug Templates and TailwindCSS](https://github.com/vktrwlt/pugsum)
- [11ty Pug Example](https://gitlab.com/cekvenich2/11pug)
- [The Brutalist Blog Site Built & Designed By Muhammad D. R.](https://docs.miayam.io/)
