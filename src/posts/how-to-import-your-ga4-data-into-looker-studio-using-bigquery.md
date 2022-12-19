---
title: How to import your GA4 data into Looker Studio using BigQuery
description: Get away from GA4s terrible custom reporting and dive into the joys
  of Looker Studio (previously Data Studio) using BigQuery for speedier reports.
date: 2022-12-14T09:44:15.511Z
tags:
  - Analytics
  - BigQuery
  - Looker-Studio
thumbnail: src/static/img/ga4-bigquery-looker.webp
thumbnaildesc: Google Analytics 4 to BigQuery to Looker Studio 
---
## Taking data the long way around

Google Analytics 4 (GA4) is the latest version of Google Analytics, and it offers a variety of new and improved features for tracking and analyzing your website's data. One of the most useful features is the ability to export your GA4 data to Google BigQuery, a powerful cloud-based data warehouse that allows you to store and analyze large datasets.

Once you have your GA4 data in BigQuery, you can use Google Looker Studio (Previously Data Studio) to create beautiful, interactive reports and dashboards that help you better understand your website's performance. In this article, we'll show you how to export your GA4 data to BigQuery and then connect it to Data Studio.

## Export your GA4 data to BigQuery

First, you'll need to export your GA4 data to BigQuery. To do this, go to the "Admin" section of your GA4 account, and select the "Data Import" option from the menu on the left.

Next, click the "New Import" button, and select "Google Analytics 4" from the list of data sources. Give your import a name and select the property and view you want to export data from.

Then, choose the "BigQuery" option from the list of destinations, and select a BigQuery project and dataset where you want to store your GA4 data. You can also choose to create a new project or dataset if you don't have one already.

Once you've made your selections, click the "Create Import" button to start the export process. It may take a few minutes for your GA4 data to be exported to BigQuery, so be patient.

## Connect your BigQuery data to Looker Studio

Once your GA4 data is in BigQuery, you can connect it to Looker Studio to create interactive reports and dashboards. To do this, go to the "Data Sources" page in Looker Studio, and click the "Create New Data Source" button.

