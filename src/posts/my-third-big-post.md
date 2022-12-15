---
title: Exporting events from BigQuery to Datastudio using SQLs UNNEST
description: Events in GA4's BigQuery data are 'nested' - to make the best use
  of them you'll need to 'flatten' them into indivudal rows with this statement.
author: Liam Martin
date: 2022-12-04T00:00:00.000Z
tags:
  - bigquery
  - datastudio
  - SQL
thumbnail: src/static/img/rain.jpeg
thumbnaildesc: rain
---
| event_name | event_params.key | event_params.value |
| ---------- | ------------- | ------------- |
| page_view |  |  |
| | url | https://cardiff.marketing/about |
| | ga_session_id | xxx1234 |
| | medium | organic |



```
// UNNEST example - lets get each parameter and key into it's own row for manipulation.
select
  event_name,
  (select value.string_value from unnest(event_params) where key = 'url') as page
from
  `<your-project>.<ga4-dataset>.<ga4-table>`
```