import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { Direction, DIRECTIONS, getBoostDirection } from "@/handlers/utils.ts";

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
