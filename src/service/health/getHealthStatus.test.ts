import { describe, it, expect } from "vitest";
import { getHealthStatus } from "./getHealthStatus.js";

describe("getHealthStatus", () => {
  it('returns exactly { status: "ok" }', () => {
    expect(getHealthStatus()).toEqual({ status: "ok" });
  });
});
