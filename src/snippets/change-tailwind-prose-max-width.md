---
title: How to change 'max-width' on Tailwind Typography
description: Current max-width on tailwind prose is 65ch. But you can change this easily in the config.
date: 2023-01-07
tags:
  - tailwind
  - css
  - javascript
prism: true
---

The Tailwind CSS Typography plugin is a tool that allows developers to easily apply consistent and visually appealing typography styles to their web pages using the utility-based CSS framework, Tailwind CSS. The plugin includes a set of pre-defined classes that can be used to style text elements such as headings, paragraphs, lists, and blockquotes, as well as other typographic elements such as horizontal rules and tables. To use Tailwind Prose, you simply add the `prose` class to the `<article>` element of your content. Simple right?

My problem using the plugin came when I tried to edit the max-width for the .prose class. I fumbled when I tried to extend it in the css file as Tailwind overwrote my changes. Being new to the platform, I soon discovered there is a better way to edit the plugins and themes existing settings: Using config file `tailwind.config.js`.

For starters, this is the default setup for the Tailwind Prose plugin:

```css
.prose {
  color: var(--tw-prose-body);
  max-width: 65ch;
}
```

That's the recommended default and it has [some impressive thought and research](https://tailwindcss.com/docs/max-width#reading-width) behind why it's styled this way. Despite that, if you change font or have a layout outside the norm you might find something else fits.

## How to change the max-width value for the .prose class

Open up your tailwind.config.js and edit it to add this theme extension:

```js
module.exports = {
  content: [...],
  theme: {
    container: {
      center: true,
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: "70ch",
          },
        },
      })
    },
  },
  plugins: [require("@tailwindcss/typography"), ]
};
```

And voila! Next time you refresh the CSS, Tailwind will compile Typography's prose class to have the maxwidth you set instead. In my case, I just pushed it from 65ch to 70ch but you can add any value you'd like!

