import { expect } from "@std/expect";
import { spy, stub } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

// @deno-types="npm:@types/memory-cache"
import cache from "memory-cache";

import { Project, projectsHandler } from "@/handlers/work/index.ts";

const PROJECTS_FIXTURE = [
  {
    description: "Project 1",
    html_url: "https://example.com/1",
    name: "Project 1",
    topics: ["topic-1", "topic-2"],
  },
  {
    description: "Project 2",
    html_url: "https://example.com/2",
    name: "Project 2",
    topics: ["topic-1", "topic-2"],
  },
] satisfies Project[];

describe("Work: API Integration", () => {
  const hxRequest = new Request("http://localhost:8000/work/projects", {
    headers: {
      "HX-Request": "true",
      "HX-Current-URL": "http://localhost:8000/work",
    },
  });

  it("guards against non-hypermedia requests", async () => {
    const response = await projectsHandler(
      new Request("http://localhost:8000/work"),
    );
    expect(response.status).toBe(403);
  });

  it("checks cache first", async () => {
    using fetchSpy = spy(globalThis, "fetch");
    using cacheGetStub = stub(cache, "get", () => PROJECTS_FIXTURE);

    await projectsHandler(hxRequest);
    expect(cacheGetStub.calls).toHaveLength(1);
    expect(fetchSpy.calls).toHaveLength(0);
  });

  it("calls from GitHub API", async () => {
    using cachePutStub = stub(cache, "put");
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

    await projectsHandler(hxRequest);

    const wantedURLPattern = new URLPattern({
      protocol: "https",
      hostname: "api.github.com",
      pathname: "/users/:username/repos",
      search: "sort=created&direction=desc",
    });
    const gotRequestURL = new URL(String(fetchStub.calls[0].args[0]));
    expect(wantedURLPattern.test(gotRequestURL)).toBeTruthy();
    expect(cachePutStub.calls).toHaveLength(1);
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

    const response = await projectsHandler(hxRequest);

    expect(response.status).toBe(200);
  });
});
