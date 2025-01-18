import { expect } from "@std/expect";
import { Spy, spy } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";
import { mainHandler } from "@/handlers/index.ts";
import { fakeWindowForScript } from "@/test/utils.ts";
import { TURNSTILE_WIDGET_ID } from "@/handlers/constants.ts";

describe("Contact: Form", () => {
  const rendered = template.render("contact/form.html", {
    turnstileWidgetId: TURNSTILE_WIDGET_ID,
  });
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
});

describe("Contact: Script Integration", () => {
  it("loads CDN script", () => {
    const rendered = template.render("contact/index.html", {
      request: new Request("http://localhost:8000/work"),
    });
    const $ = load(rendered);
    expect($("script[src*=render=explicit]")).toHaveLength(1);
    expect($("script[src*=turnstile.js]")).toHaveLength(1);
  });

  it("renders widget explicitly", async () => {
    const module = await mainHandler(
      new Request("http://localhost:8000/turnstile.js"),
    ).then((res) => res.text());

    const { window, appendScript } = fakeWindowForScript(module);
    window.turnstile = {
      ready: spy(),
      render: spy(),
    };
    const readySpy = window.turnstile.ready as Spy;
    const renderSpy = window.turnstile.render as Spy;

    appendScript();
    readySpy.calls[0].args[0]();
    await window.happyDOM.waitUntilComplete();

    expect(readySpy.calls).toHaveLength(1);
    expect(renderSpy.calls).toHaveLength(1);
    const renderSpyArgs = renderSpy.calls[0].args;
    expect(renderSpyArgs[0]).toContain(TURNSTILE_WIDGET_ID);
  });
});
