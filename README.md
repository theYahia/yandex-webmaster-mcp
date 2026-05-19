# @theyahia/yandex-webmaster-mcp

> 📦 Part of **[WWmcp — Emerging Markets MCP](https://github.com/theYahia/WWmcp)** — 114 MCP servers for non-Western APIs (Brazil/MENA/Gulf/SE Asia/Africa/CIS).

MCP-сервер для API Яндекс.Вебмастер — сайты, поисковые запросы, индексация. Требуется OAuth-токен.

[![npm](https://img.shields.io/npm/v/@theyahia/yandex-webmaster-mcp)](https://www.npmjs.com/package/@theyahia/yandex-webmaster-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "yandex-webmaster": {
      "command": "npx",
      "args": ["-y", "@theyahia/yandex-webmaster-mcp"],
      "env": {
        "YANDEX_WEBMASTER_TOKEN": "ваш_токен"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add yandex-webmaster -e YANDEX_WEBMASTER_TOKEN=ваш_токен -- npx -y @theyahia/yandex-webmaster-mcp
```

## Try this prompt

> *"Покажи топ-10 поисковых запросов на сайте за последний месяц + ошибки индексации"*

The agent will call `get_hosts` → `get_search_queries` (with month range, sorted by clicks) → `get_indexing` and surface both ranking and crawl-health data in one report.

## Pairs well with

- **[yandex-direct-mcp](https://github.com/theYahia/yandex-direct-mcp)** — paid search campaigns (cross-reference organic vs paid)
- **[yandex-metrika-mcp](https://github.com/theYahia/yandex-metrika-mcp)** — user behavior on the same site
- **[appmetrica-mcp](https://github.com/theYahia/appmetrica-mcp)** — mobile app analytics counterpart

Browse all 114 servers in the [WWmcp catalog](https://github.com/theYahia/WWmcp).

## Авторизация

`YANDEX_WEBMASTER_TOKEN` — OAuth-токен Яндекс.Вебмастер.

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `get_hosts` | Список сайтов в Вебмастере |
| `get_search_queries` | Поисковые запросы: клики, показы, CTR, позиция |
| `get_indexing` | Статус индексации сайта |

## Примеры запросов

```
Какие сайты у меня в Вебмастере?
По каким запросам находят мой сайт?
Сколько страниц проиндексировано?
```

## Лицензия

MIT

---

**Part of [WWmcp](https://github.com/theYahia/WWmcp)** — the emerging-markets MCP catalog. ⭐ Star the catalog if you find these servers useful, and [open an issue](https://github.com/theYahia/WWmcp/issues) to request a server for another non-Western API.
