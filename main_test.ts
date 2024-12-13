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
  it("serves static or `/favicon.ico`", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/favicon.ico"),
    );

    response.blob(); // Close the response
    expect(response.status).toBe(200);
  });
});
