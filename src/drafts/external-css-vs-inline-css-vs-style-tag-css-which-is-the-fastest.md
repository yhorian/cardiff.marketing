---
title: External CSS vs Inline CSS vs Style Tag CSS - Which is the fastest?
description: There's no less than three way to apply your CSS styles - but which
  is the best for page speed and SEO?
date: 2022-12-19T15:53:19.610Z
tags:
  - CSS
  - SEO
  - pagespeed
  - core-web-vitals
thumbnail: src/static/img/yhorian_vector_art_of_a_robot_running_43897bfc-e815-4846-b8c0-cd226b74d54a.png
---
\## Why CSS is important for SEO

CSS, or Cascading Style Sheets, is a fundamental aspect of web design and development that is often overlooked in the search engine optimization (SEO) process. While the main focus of SEO is on the content and structure of a website, CSS plays a crucial role in how search engines interpret and display that content. Proper use of CSS can improve the user experience, increase website performance, and even directly impact search rankings via Core Web Vitals. 

These are the three competing methods of styling:

* External CSS - CSS loaded from a .css file.
* Style Tag CSS - CSS inlined in \<style\> tags in the header.
* Inline CSS - Elements individually styled using the style="" attribute.

No matter what system you use - be it Bootstrap, Tailwind or plan Vanilla CSS - your code will be compiled and sent as a collection of selectors and properties. These are then interpreted by the browser on the user's end to decide how the elements of a page should be arranged.

Lets start with an unstyled page:


## External CSS

* Definition and explanation of external CSS
* Pros of using external CSS (e.g., easier to maintain and update, can be shared across multiple pages)
* Cons of using external CSS (e.g., requires an additional HTTP request to load the styles)

## Style Tag CSS

* Definition and explanation of style tag CSS
* Pros of using style tag CSS (e.g., allows for easy customization of individual pages, no need to make additional HTTP requests)
* Cons of using style tag CSS (e.g., can make the HTML code cluttered and difficult to read, styles are not reusable across multiple pages)

## Inline CSS

* Definition and explanation of inline CSS
* Pros of using inline CSS (e.g., allows for precise control over specific elements, no need to make additional HTTP requests)
* Cons of using inline CSS (e.g., can make the HTML code cluttered and difficult to read, styles are not reusable across multiple pages)

## Comparison of the three methods

* Comparison of the pros and cons of each method
* When to use each method (e.g., external CSS is best for large, complex websites, inline CSS is best for small adjustments to specific elements)

## Conclusion

* Recap 
* Recommendations for which method to use in different situations
