import { expect } from "@std/expect";
import { stub } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "@/handlers/index.ts";

const PROJECTS_FIXTURE = [
  { id: 1 },
  { id: 2 },
];

describe("Work: API Integration", () => {
  it("calls from GitHub API", async () => {
    const mockHeaders = {
      "Content-Type": "application/json",
    } satisfies HeadersInit;
    const mockResponse = new Response(
      JSON.stringify(PROJECTS_FIXTURE) satisfies BodyInit,
      { headers: mockHeaders },
    );
    using fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(mockResponse),
    );

    await mainHandler(new Request("http://localhost:8000/work/projects"));

    const wantedURLPattern = new URLPattern({
      protocol: "https",
      hostname: "api.github.com",
      pathname: "/users/:username/repos",
      search: "sort=created&direction=desc",
    });
    const gotRequestURL = new URL(String(fetchStub.calls[0].args[0]));
    expect(wantedURLPattern.test(gotRequestURL)).toBeTruthy();
  });
  it("falls back to local data", async () => {
    const mockHeaders = {
      "Content-Type": "application/json",
    } satisfies HeadersInit;
    const mockResponseInit = {
      headers: mockHeaders,
      status: 429, // Rate limited
    } satisfies ResponseInit;
    const mockResponse = new Response(
      JSON.stringify({ "message": "Rate Limit Exceeded" }) satisfies BodyInit,
      mockResponseInit,
    );
    using _fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(mockResponse),
    );

    const response = await mainHandler(
      new Request("http://localhost:8000/work/projects"),
    );

    expect(response.status).toBe(200);
  });
});
