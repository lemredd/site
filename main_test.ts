import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import puppeteer from "puppeteer";
import { HTMLScriptElement, Window } from "happy-dom";

export const fakeWindowForScript = (scriptContent: string) => {
  const window = new Window();
  const document = window.document;
  const script = document.createElement("script");
  script.textContent = scriptContent;

  const appendScript = (scriptToAppend?: HTMLScriptElement) =>
    document.head.appendChild(scriptToAppend ?? script);

  return { window, document, script, appendScript };
};

describe("PWA registration", () => {
  it("has registered service worker", async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:8000/");
    const registeredServiceWorkers = await page.evaluate(async () => {
      return await globalThis.navigator.serviceWorker.getRegistrations();
    });
    expect(registeredServiceWorkers.length).toBeGreaterThan(0);
    await page.close();
    await browser.close();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
});
