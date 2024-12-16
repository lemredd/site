import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { mainHandler } from "@/handlers/index.ts";

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
