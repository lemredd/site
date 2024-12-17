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
});
