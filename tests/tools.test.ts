import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("tool handlers", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.YANDEX_WEBMASTER_TOKEN = "test-token";
    process.env.YANDEX_WEBMASTER_USER_ID = "99";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handleGetHosts returns JSON string", async () => {
    const mockHosts = { hosts: [{ host_id: "a", ascii_host_url: "https://example.com", verified: true }] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHosts),
    } as any);

    const { handleGetHosts } = await import("../src/tools/hosts.js");
    const result = await handleGetHosts({});
    const parsed = JSON.parse(result);
    expect(parsed.hosts).toHaveLength(1);
    expect(parsed.hosts[0].host_id).toBe("a");
  });

  it("handleGetIndexing returns summary", async () => {
    const mockData = { searchable_count: 100, excluded_count: 5, site_error_count: 2 };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as any);

    const { handleGetIndexing } = await import("../src/tools/indexing.js");
    const result = await handleGetIndexing({ host_id: "abc" });
    const parsed = JSON.parse(result);
    expect(parsed.searchable_count).toBe(100);
  });

  it("handleGetSitemaps returns sitemaps list", async () => {
    const mockData = { sitemaps: [{ sitemap_url: "https://example.com/sitemap.xml" }] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as any);

    const { handleGetSitemaps } = await import("../src/tools/sitemaps.js");
    const result = await handleGetSitemaps({ host_id: "abc" });
    const parsed = JSON.parse(result);
    expect(parsed.sitemaps).toHaveLength(1);
  });

  it("handleGetDiagnostics returns diagnostics", async () => {
    const mockData = { problems: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as any);

    const { handleGetDiagnostics } = await import("../src/tools/diagnostics.js");
    const result = await handleGetDiagnostics({ host_id: "abc" });
    const parsed = JSON.parse(result);
    expect(parsed.problems).toEqual([]);
  });

  it("handleGetSearchQueries passes date range", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ queries: [] }),
    } as any);

    const { handleGetSearchQueries } = await import("../src/tools/search-queries.js");
    const result = await handleGetSearchQueries({
      host_id: "abc",
      date_from: "2024-01-01",
      date_to: "2024-01-07",
    });
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty("queries");
  });
});
