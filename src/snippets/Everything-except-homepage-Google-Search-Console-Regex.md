---
title: "Everything except the homepage - Google Search Console Regex"
description: This is a regex code for filtering out everything except the front page of your site in Google Search Console.
date: 2023-01-09
tags:
  - regex
  - googlesearchconsole
  - analytics
prism: true
---

Filtering specific pages using regex in Google Search Console can help you better understand and analyze your website's performance. Sometimes you just need to remove one or two pages from your view. For example, do you need to review your Google Search Console data but don't want the front page?

Try this regex code:

```regex
^https://www.example.com/$
```

It'll match everything that **isn't** your example homepage URL. And it's easy to use it to filter out other pages too:

```regex
^https://www.(example.com|example.com/about|example.com/contact)/$
```

Perfect for removing a small number of pages from your view.
