import { expect } from "@std/expect";
import { stub } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "@/handlers/index.ts";

const PROJECTS_FIXTURE = [
  { id: 1 },
  { id: 2 },
];

describe("Work: API Integration", () => {
  it("lists projects from GitHub", async () => {
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

    const response = await mainHandler(
      new Request("http://localhost:8000/work/projects"),
    );

    expect(response.status).toBe(200);
    console.log(fetchStub);
  });
});
