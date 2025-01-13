import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

import { HTMLScriptElement, Window } from "happy-dom";

import { mainHandler } from "@/handlers/index.ts";

export const fakeWindowForScript = (scriptContent: string) => {
  const window = new Window();
  const document = window.document;
  const script = document.createElement("script");
  script.textContent = scriptContent;

  const appendScript = (scriptToAppend?: HTMLScriptElement) =>
    document.head.appendChild(scriptToAppend ?? script);

  return { window, document, script, appendScript };
};

describe("Main Handler", () => {
  it("returns 404", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/unknown"),
    );

    expect(response.status).toBe(404);
  });

  it("serves static files with cache control", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/favicon.ico"),
    );

    await response.blob(); // Close the response
    expect(response.status).toBe(200);

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=31536000",
    );
  });

  it("serves static `tailwind.css` and JS files with `no-cache`", async () => {
    const response = await mainHandler(
      new Request("http://localhost:8000/tailwind.css"),
    );

    await response.blob(); // Close the response
    expect(response.headers.get("Cache-Control")).toBe("no-cache");
  });
});
