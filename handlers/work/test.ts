import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { mainHandler } from "@/handlers/index.ts";

describe("Work: API Integration", () => {
  it("lists three projects", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/work/projects"),
    );

    expect(response.status).toBe(200);

    const $ = load(await response.text());
    expect($("li").length).toBe(3);
    expect($("ul").attr("hx-swap-oob")).toBe("true");
  });
});
