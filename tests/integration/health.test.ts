import http from "node:http";
import type { AddressInfo } from "node:net";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { dispatch } from "../../src/api/router.js";

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  server = http.createServer(dispatch);
  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe("GET /health", () => {
  it('returns 200 with application/json content-type and { status: "ok" } body', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");

    const body: unknown = await response.json();
    expect(body).toEqual({ status: "ok" });
  });
});

describe("GET /nope (unmatched route)", () => {
  it("returns 404 with a not_found error payload", async () => {
    const response = await fetch(`${baseUrl}/nope`);

    expect(response.status).toBe(404);

    const body: unknown = await response.json();
    expect(body).toEqual({ error: "not_found" });
  });
});
