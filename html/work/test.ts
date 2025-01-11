import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";

describe("Work: Projects", () => {
  it("displays skeletons initially", () => {
    const rendered = template.render("work/projects.hx.html", {});
    const $ = load(rendered);

    expect($("li").length).toBe(3);
    expect($("li").hasClass("animate-pulse")).toBe(true);
  });

  it("replaces its contents on load (HTMX)", () => {
    const rendered = template.render("work/index.html", {
      request: new Request("http://localhost:8000/work"),
      skills: [],
    });
    const $ = load(rendered);

    expect($("#projects").attr("hx-get")).toBe("/work/projects");
    expect($("#projects").attr("hx-trigger")).toBe("load");
  });
});
