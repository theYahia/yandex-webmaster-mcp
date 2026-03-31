import { describe, it, expect } from "vitest";
import { createServer } from "../src/index.js";

describe("createServer", () => {
  it("creates an MCP server instance", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });
});
