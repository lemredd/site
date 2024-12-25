import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, stub } from "@std/testing/mock";

import { mainHandler } from "@/handlers/index.ts";
import { submitContactForm } from "@/handlers/contact/index.ts";

describe("contact: Form Validation", () => {
  it("validates form", async () => {
    const body = new FormData();
    // body.append("name", "John Doe"); // missing `name`
    body.append("email", "R2eQ3@example.com");
    body.append("message", "Test message");
    const request = new Request("http://localhost:8000/contact", {
      method: "POST",
      body,
    });

    const gotResponse = await submitContactForm(request),
      wantedResponseStatus = 400;
    expect(gotResponse.status).toBeGreaterThanOrEqual(wantedResponseStatus);
  });
});

describe("Contact: API Integration", () => {
  it("submits to Google Apps Script", async () => {
    const mockHeaders = { "Content-Type": "text/html" } satisfies HeadersInit,
      mockResponse = new Response("Test response", { headers: mockHeaders });
    using fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(mockResponse),
    );

    const body = new FormData();
    body.append("name", "John Doe");
    body.append("email", "R2eQ3@example.com");
    body.append("message", "Test message");
    const request = new Request("http://localhost:8000/contact", {
      method: "POST",
      body,
    });
    await mainHandler(request);

    const gotFetchURL = fetchStub.calls[0].args[0],
      wantedURLPattern = new URLPattern({
        baseURL: "https://script.google.com",
        pathname: "macros/s/:deploymentId/exec",
      });
    assertSpyCalls(fetchStub, 1);
    expect(wantedURLPattern.test(String(gotFetchURL))).toBeTruthy();
  });
});
