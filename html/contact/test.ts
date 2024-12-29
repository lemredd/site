import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";

describe("Contact: Form", () => {
  const rendered = template.render("contact/form.html");
  const $ = load(rendered);

  it("has required fields", () => {
    const gotFields = $("form [name]"),
      wantedFieldNames = ["name", "email", "message"];
    gotFields.each((_idx, el) => {
      expect(wantedFieldNames).toContainEqual(el.attribs.name);
    });
  });

  it("posts to own endpoint (HTMX)", () => {
    expect($("form").attr("hx-post")).toBe("/contact");
  });

  it("uses status code target extension (HTMX)", () => {
    const rendered = template.render("contact/index.html", {
      request: new Request("http://localhost:8000/work"),
    });
    const $ = load(rendered);
    expect($("#skills").attr("hx-ext")).toBe("response-targets");
  });

  it("replaces output's contents (HTMX)", () => {
    expect($("form").attr("hx-target-*")).toBe("find output");
  });

  it("renders CloudFlare Turnstile widget implicitly", () => {
    const gotElement = $(".cf-turnstile[data-sitekey]");
    expect(gotElement.length).toBeGreaterThan(0);
  });
});

describe("Contact: Script Integration", () => {
  it("loads CDN script", () => {
    const rendered = template.render("contact/index.html", {
      request: new Request("http://localhost:8000/work"),
    });
    const $ = load(rendered);
    expect($("script[src*=turnstile]").length).toEqual(1);
  });
});
