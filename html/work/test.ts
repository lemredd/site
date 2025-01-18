import { expect } from "@std/expect";
import { spy } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

import { load } from "cheerio";

import { template } from "@/handlers/utils.ts";
import {
  MARQUEE_DUP_ID_PREFIX,
  MARQUEE_ID,
  MARQUEE_OBSERVER_ID,
} from "@/handlers/constants.ts";

import { mainHandler } from "@/handlers/index.ts";
import { IntersectionObserverEntry } from "happy-dom";
import { fakeWindowForScript } from "@/test/utils.ts";

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
  it("has marquee-related elements", () => {
    const rendered = template.render("work/index.html", {
      request: new Request("http://localhost:8000/work"),
      skills: ["HTML", "CSS", "JavaScript", "TypeScript"],
      marqueeData: {
        "marquee-observer-id": MARQUEE_OBSERVER_ID,
        "marquee-id": MARQUEE_ID,
        "marquee-dup-id-prefix": MARQUEE_DUP_ID_PREFIX,
      },
    });
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

  it("resets marquee animation", async () => {
    const module = await mainHandler(
      new Request("http://localhost:8000/marquee.js"),
    ).then((res) => res.text());

    const { window, document, script, appendScript } = fakeWindowForScript(
      module,
    );

    script.dataset.marqueeObserverId = MARQUEE_OBSERVER_ID;
    const marqueeObserverElement = document.createElement("div");
    marqueeObserverElement.id = MARQUEE_OBSERVER_ID;
    document.body.appendChild(marqueeObserverElement);

    script.dataset.marqueeId = MARQUEE_ID;
    const marqueeElement = document.createElement("div");
    marqueeElement.id = MARQUEE_ID;
    document.body.appendChild(marqueeElement);

    script.dataset.marqueeDupIdPrefix = MARQUEE_DUP_ID_PREFIX;
    const marqueeDupElement = document.createElement("div");
    marqueeDupElement.id = `${MARQUEE_DUP_ID_PREFIX}1`;
    document.body.appendChild(marqueeDupElement);

    using intersectionObserverSpy = spy(window, "IntersectionObserver");
    using requestAnimationFrameSpy = spy(window, "requestAnimationFrame");
    using marqueeElementRemoveAttrSpy = spy(marqueeElement, "removeAttribute");
    appendScript();

    const gotIntersectionObserverCallback = intersectionObserverSpy.calls[0]
      .args[0] as (entries: IntersectionObserverEntry[]) => void;
    const intersectionObserverEntry = new IntersectionObserverEntry({
      isIntersecting: false,
    });

    gotIntersectionObserverCallback([intersectionObserverEntry]);
    expect(marqueeElement.style.animation).toBe("none");
    await window.happyDOM.waitUntilComplete();

    expect(requestAnimationFrameSpy.calls).toHaveLength(1);
    expect(marqueeElementRemoveAttrSpy.calls).toHaveLength(1);
  });
});
