import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";
import {
  MARQUEE_DUP_ID_PREFIX,
  MARQUEE_ID,
  MARQUEE_OBSERVER_ID,
} from "@/handlers/constants.ts";

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

describe("Work: Skills", () => {
  const rendered = template.render("work/index.html", {
    request: new Request("http://localhost:8000/work"),
    skills: ["HTML", "CSS", "JavaScript", "TypeScript"],
    marqueeData: {
      "marquee-observer-id": MARQUEE_OBSERVER_ID,
      "marquee-id": MARQUEE_ID,
      "marquee-dup-id-prefix": MARQUEE_DUP_ID_PREFIX,
    },
  });
  it("has marquee-related elements", () => {
    const $ = load(rendered);

    expect($(`#${MARQUEE_OBSERVER_ID}`).length).toBe(1);
    expect($(`#${MARQUEE_ID}`).length).toBe(1);
    expect($(`#${MARQUEE_DUP_ID_PREFIX}1`).length).toBe(1);
    expect($(`#${MARQUEE_DUP_ID_PREFIX}2`).length).toBe(1);
    const gotScriptDataset = $("script[src*=marquee.js]").data();
    const wantScriptDataset = {
      marqueeObserverId: MARQUEE_OBSERVER_ID,
      marqueeId: MARQUEE_ID,
      marqueeDupIdPrefix: MARQUEE_DUP_ID_PREFIX,
    };
    expect(gotScriptDataset).toEqual(wantScriptDataset);
  });
});
