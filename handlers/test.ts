import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "@/handlers/index.ts";
import { Direction, DIRECTIONS, getBoostDirection } from "@/handlers/utils.ts";

describe("Main Handler", () => {
  it("returns 404", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/unknown"),
    );

    expect(response.status).toBe(404);
  });

  it("serves static files with cache control", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/favicon.ico"),
    );

    await response.blob(); // Close the response
    expect(response.status).toBe(200);

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=31536000",
    );
  });

  it("serves static `tailwind.css` and JS files with `no-cache`", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/tailwind.css"),
    );

    await response.blob(); // Close the response
    expect(response.headers.get("Cache-Control")).toBe("no-cache");
  });
});

describe("Handlers: utilities", () => {
  it("returns empty string if not boosted", () => {
    const headers = new Headers({
      "HX-Current-URL": "http://localhost:8000/",
    });
    const request = new Request("http://localhost:8000/", { headers });

    expect(getBoostDirection(request)).toBe("");
  });

  it("determines boosted navigation direction", () => {
    let headers = new Headers({
      "HX-Current-URL": "http://localhost:8000/",
      "HX-Boosted": "true",
    });
    let request = new Request("http://localhost:8000/work", { headers });

    let got = getBoostDirection(request), want: Direction = DIRECTIONS[0];
    expect(got).toBe(want);

    headers = new Headers({
      "HX-Current-URL": "http://localhost:8000/work",
      "HX-Boosted": "true",
    });
    request = new Request("http://localhost:8000/", { headers });

    got = getBoostDirection(request), want = DIRECTIONS[1];
    expect(got).toBe(want);

    headers = new Headers({
      "HX-Current-URL": "http://localhost:8000/contact",
      "HX-Boosted": "true",
    });
    request = new Request("http://localhost:8000/work", { headers });

    got = getBoostDirection(request), want = DIRECTIONS[1];
    expect(got).toBe(want);
  });
});
