---
title: GA4 into BigQuery into Datastudio - A Modern Marketing Stack
description: If you're switching to GA4 then this guide shows you the best route
  to move reports to Looker Studio (Previously Data Studio)
author: Liam Martin
date: 2022-12-02T00:00:00.000Z
tag:
  - cloudflare
tags:
  - analytics
---
Looker Studio (rebranded from Data Studio) is Google's WYSWIG reporting editor. Having played with GA4s custom reports in an effort to represent all the brilliant default reports that Universal Analytics (GA3) offered I've come to a simple conclusion: Looker Studio is superior in every way:

1. It's faster - with BigQuery powering the backend you don't have to wait minutes for your reports.
2. It's prettier. You can style everything and still be presenting live data.
3. It's more compatible. Data can be merged across sources, calculated upon and re-presented.

There's very little reason to be stuck in the past. This article is going to outline how you make the switch.