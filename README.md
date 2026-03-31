# @theyahia/yandex-webmaster-mcp

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
