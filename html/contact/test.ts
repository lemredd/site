import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";

describe("Contact: Form", () => {
  it("has required fields", () => {
    const rendered = template.render("contact/form.html");
    const $ = load(rendered);

    const gotFields = $("form [name]"),
      wantedFieldNames = ["name", "email", "message"];
    gotFields.each((_idx, el) => {
      expect(wantedFieldNames).toContainEqual(el.attribs.name);
    });
  });

  it("Posts to own endpoint (HTMX)", () => {
    const rendered = template.render("contact/form.html");
    const $ = load(rendered);

    expect($("form").attr("hx-post")).toBe("/contact");
  });
});
