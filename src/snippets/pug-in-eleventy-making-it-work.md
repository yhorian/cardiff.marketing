---
title: >
  Pug in Eleventy: How to make it work
description: >
  Pug does not interface with Eleventy well. But there's good news! It can integrated smoothly with some tweaks.
date: 2022-12-22
tags:
  - pug
  - eleventy
  - javascript
permalink: "/pug-in-eleventy-making-it-work/"
alpine: true
---

## Getting started: How to get basic Eleventy features working with Pug

Integrating Pug (formerly Jade) with Eleventy is a great way to maximize the power of both technologies. The combination of Pug's powerful and expressive templating language, along with Eleventy’s flexibility in content management, makes it possible to create dynamic and interactive websites quickly and easily. While Pug comes pre-installed with Eleventy; there are some kinks to it. In this blog post, I'll provide an overview of how you can get started using these two tools together to produce amazing sites at blazing speeds.

Here's the things we'll cover in basic integration:

<a href="#getting-eleventy-filters-and-shortcodes-to-work">1. Getting Eleventy filters and shortcodes to work</a>

<a href="#header2">2. Interpolation: !{ codes }, #{ codes }</a>

<a href="#header3">3. Pug Include/Extends vs Eleventy Layout/Content</a>

<a href="#header4">4. Front Matter and Permalinks</a>

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
doctype html
html(lang='en')
  head
    meta(charset="UTF-8")
    meta(http-equiv="x-ua-compatible" content="ie=edge")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Test Page
  body
    h1 #{ uppercase("my test page")}
```
