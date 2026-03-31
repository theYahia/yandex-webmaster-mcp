#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getHostsSchema, handleGetHosts } from "./tools/hosts.js";
import { getSearchQueriesSchema, handleGetSearchQueries } from "./tools/search-queries.js";
import { getIndexingSchema, handleGetIndexing, submitUrlSchema, handleSubmitUrl } from "./tools/indexing.js";
import { getSitemapsSchema, handleGetSitemaps } from "./tools/sitemaps.js";
import { getDiagnosticsSchema, handleGetDiagnostics } from "./tools/diagnostics.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "yandex-webmaster-mcp",
    version: "1.1.0",
  });

  server.tool(
    "get_hosts",
    "List all sites in Yandex.Webmaster: URL, verification status.",
    getHostsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetHosts(params) }],
    }),
  );

  server.tool(
    "get_search_queries",
    "Search query analytics: clicks, impressions, CTR, position.",
    getSearchQueriesSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetSearchQueries(params) }],
    }),
  );

  server.tool(
    "get_indexing",
    "Indexing status summary: searchable pages, excluded, errors.",
    getIndexingSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetIndexing(params) }],
    }),
  );

  server.tool(
    "submit_url",
    "Submit a URL for re-crawling / re-indexing by Yandex.",
    submitUrlSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleSubmitUrl(params) }],
    }),
  );

  server.tool(
    "get_sitemaps",
    "List sitemaps for a host: URL, status, last checked, indexed count.",
    getSitemapsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetSitemaps(params) }],
    }),
  );

  server.tool(
    "get_diagnostics",
    "Site diagnostics: crawl errors, DNS issues, server problems.",
    getDiagnosticsSchema.shape,
    async (params) => ({
      content: [{ type: "text", text: await handleGetDiagnostics(params) }],
    }),
  );

  return server;
}

async function main() {
  const mode = process.argv[2];

  if (mode === "--http") {
    const { StreamableHTTPServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/streamableHttp.js"
    );
    const http = await import("node:http");

    const PORT = parseInt(process.env.PORT || "3100", 10);

    const httpServer = http.createServer(async (req, res) => {
      if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
        return;
      }

      if (req.url === "/mcp" && req.method === "POST") {
        const server = createServer();
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on("close", () => { void transport.close(); });
        await server.connect(transport);
        await transport.handleRequest(req, res);
        return;
      }

      res.writeHead(404);
      res.end("Not found");
    });

    httpServer.listen(PORT, () => {
      console.error(`[yandex-webmaster-mcp] HTTP server on port ${PORT}. POST /mcp`);
    });
    return;
  }

  // Default: stdio
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[yandex-webmaster-mcp] Server started. 6 tools. Requires YANDEX_WEBMASTER_TOKEN + YANDEX_WEBMASTER_USER_ID.");
}

main().catch((error) => {
  console.error("[yandex-webmaster-mcp] Startup error:", error);
  process.exit(1);
});
