import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "@/handlers/index.ts";

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

    await response.blob(); // Close the response
    expect(response.status).toBe(200);
  });
});

describe("HTMX on templates", () => {
  it("navigates with boost", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/"),
    );
    const html = await response.text();
    expect(html.includes('hx-boost="true')).toBe(true);
    expect(response.status).toBe(200);
  });
});
