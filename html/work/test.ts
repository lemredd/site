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

  it("replaces itself on load (HTMX)", () => {
    const rendered = template.render("work/projects.hx.html", {});
    const $ = load(rendered);

    expect($("ul").attr("hx-get")).toBe("/work/projects");
    expect($("ul").attr("hx-swap")).toBe("outerHTML");
    expect($("ul").attr("hx-target")).toBe("this");
    expect($("ul").attr("hx-trigger")).toBe("load");
  });
});
