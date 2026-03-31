#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getHostsSchema, handleGetHosts } from "./tools/hosts.js";
import { getSearchQueriesSchema, handleGetSearchQueries } from "./tools/search-queries.js";
import { getIndexingSchema, handleGetIndexing } from "./tools/indexing.js";

const server = new McpServer({
  name: "yandex-webmaster-mcp",
  version: "1.0.0",
});

server.tool(
  "get_hosts",
  "Список сайтов в Яндекс.Вебмастере: URL, статус верификации.",
  getHostsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetHosts(params) }],
  }),
);

server.tool(
  "get_search_queries",
  "Поисковые запросы сайта в Яндексе: клики, показы, CTR, позиция.",
  getSearchQueriesSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetSearchQueries(params) }],
  }),
);

server.tool(
  "get_indexing",
  "Статус индексации сайта: количество страниц в поиске, исключённые, ошибки.",
  getIndexingSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetIndexing(params) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[yandex-webmaster-mcp] Сервер запущен. 3 инструмента. Требуется YANDEX_WEBMASTER_TOKEN.");
}

main().catch((error) => {
  console.error("[yandex-webmaster-mcp] Ошибка запуска:", error);
  process.exit(1);
});
