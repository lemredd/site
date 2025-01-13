import { expect } from "@std/expect";
import { Spy, spy } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";

import { Window } from "happy-dom";

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

describe("PWA", () => {
  it("caches images for PWA", async () => {
    const module = await mainHandler(
      new Request("http://localhost:8000/pwa.js"),
    ).then((res) => res.text());
    const window = new Window();
    window.workbox = {
      setConfig: spy(),
      routing: {
        registerRoute: spy(),
      },
      strategies: { CacheFirst: spy() },
    };
    const registerRouteSpy = window.workbox.routing.registerRoute as Spy;
    const setConfigSpy = window.workbox.setConfig as Spy;
    const cacheFirstSpy = window.workbox.strategies.CacheFirst as Spy;
    const importScriptsSpy = spy();
    window.importScripts = importScriptsSpy;

    window.eval(module);
    await window.happyDOM.waitUntilComplete();

    expect(importScriptsSpy.calls).toHaveLength(1);
    expect(setConfigSpy.calls).toHaveLength(1);
    expect(registerRouteSpy.calls).toHaveLength(1);
    expect(cacheFirstSpy.calls).toHaveLength(1);
  });
});
