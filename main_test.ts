/**
 * TODO:
 * 1. Run web server on a separate thread
 */

import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "./main.ts";

describe("Main Handler", () => {
  it("returns 404", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/unknown"),
    );

    expect(response.status).toBe(404);
  });
});
