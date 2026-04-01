import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("client", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env.YANDEX_WEBMASTER_TOKEN = "test-token-123";
    process.env.YANDEX_WEBMASTER_USER_ID = "12345";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("getUserId returns env var", async () => {
    const { getUserId } = await import("../src/client.js");
    expect(getUserId()).toBe("12345");
  });

  it("getUserId throws when not set", async () => {
    delete process.env.YANDEX_WEBMASTER_USER_ID;
    const { getUserId } = await import("../src/client.js");
    expect(() => getUserId()).toThrow("YANDEX_WEBMASTER_USER_ID is not set");
  });

  it("apiGet throws when token not set", async () => {
    delete process.env.YANDEX_WEBMASTER_TOKEN;
    const { apiGet } = await import("../src/client.js");
    await expect(apiGet("/hosts/")).rejects.toThrow("YANDEX_WEBMASTER_TOKEN is not set");
  });

  it("apiGet constructs correct URL and calls fetch", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ hosts: [] }) };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as any);

    const { apiGet } = await import("../src/client.js");
    const result = await apiGet("/hosts/");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/user/12345/hosts/");
    expect(calledUrl).toContain("api.webmaster.yandex.net");
    expect(result).toEqual({ hosts: [] });
  });

  it("apiGet passes Bearer token header", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as any);

    const { apiGet } = await import("../src/client.js");
    await apiGet("/hosts/");

    const calledOptions = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(calledOptions.headers).toEqual(
      expect.objectContaining({ Authorization: "Bearer test-token-123" }),
    );
  });

  it("apiGet appends query params", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as any);

    const { apiGet } = await import("../src/client.js");
    await apiGet("/hosts/abc/search-queries/all/history", {
      date_from: "2024-01-01",
      date_to: "2024-01-07",
    });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("date_from=2024-01-01");
    expect(calledUrl).toContain("date_to=2024-01-07");
  });

  it("apiGet retries on 500", async () => {
    const fail = { ok: false, status: 500, statusText: "ISE", text: () => Promise.resolve("") };
    const success = { ok: true, json: () => Promise.resolve({ ok: true }) };
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(fail as any)
      .mockResolvedValueOnce(success as any);

    const { apiGet } = await import("../src/client.js");
    const result = await apiGet("/hosts/");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ ok: true });
  });
});
