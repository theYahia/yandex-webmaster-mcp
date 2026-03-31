---
name: seo-check
description: "Проверка SEO-позиций сайта в Яндексе"
argument-hint: <host or URL>
allowed-tools:
  - Bash
  - Read
---

# /seo-check

1. Call get_hosts to find the site
2. Call get_search_queries for top queries
3. Call get_indexing for indexing status
4. Format summary with positions, impressions, clicks, indexed pages
