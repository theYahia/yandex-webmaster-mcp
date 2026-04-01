import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("skill-queries", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.YANDEX_WEBMASTER_TOKEN = "test-token";
    process.env.YANDEX_WEBMASTER_USER_ID = "99";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("runQueriesSkill returns report with defaults", async () => {
    const mockQueries = [
      { query: "test", clicks: 10, impressions: 100, ctr: 0.1, position: 3 },
      { query: "hello", clicks: 5, impressions: 50, ctr: 0.1, position: 5 },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockQueries),
    } as any);

    const { runQueriesSkill } = await import("../src/skills/skill-queries.js");
    const report = await runQueriesSkill("host1");

    expect(report.host_id).toBe("host1");
    expect(report.total_clicks).toBe(15);
    expect(report.total_impressions).toBe(150);
    expect(report.top_queries).toHaveLength(2);
    expect(report.top_queries[0].query).toBe("test");
  });
});

describe("skill-indexing", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.YANDEX_WEBMASTER_TOKEN = "test-token";
    process.env.YANDEX_WEBMASTER_USER_ID = "99";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("runIndexingSkill returns combined report", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = typeof url === "string" ? url : url.toString();
      if (urlStr.includes("summary")) {
        return { ok: true, json: () => Promise.resolve({ searchable_count: 50 }) } as any;
      }
      if (urlStr.includes("diagnostics")) {
        return { ok: true, json: () => Promise.resolve({ problems: [] }) } as any;
      }
      if (urlStr.includes("recrawl")) {
        return { ok: true, json: () => Promise.resolve({ quota_remaining: 9 }) } as any;
      }
      return { ok: true, json: () => Promise.resolve({}) } as any;
    });

    const { runIndexingSkill } = await import("../src/skills/skill-indexing.js");
    const report = await runIndexingSkill("host1", ["https://example.com/page1"]);

    expect(report.host_id).toBe("host1");
    expect(report.summary).toEqual({ searchable_count: 50 });
    expect(report.submitted_urls).toEqual(["https://example.com/page1"]);
  });
});
