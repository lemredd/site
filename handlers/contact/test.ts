import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, stub } from "@std/testing/mock";

import {
  postToAppScript,
  submitContactForm,
  submitToWeb3Forms,
  verifyTurnstileToken,
} from "@/handlers/contact/index.ts";

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
  it("verifies Cloudflare Turnstile client token", async () => {
    const mockHeaders = {
        "Content-Type": "application/json",
      } satisfies HeadersInit,
      mockResponse = new Response(JSON.stringify({}), { headers: mockHeaders });
    using fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(mockResponse),
    );

    const token = "sample-token";
    await verifyTurnstileToken(token);

    const gotFetchURL = fetchStub.calls[0].args[0],
      gotRequestInit = fetchStub.calls[0].args[1];
    const wantedURLPattern = new URLPattern({
        baseURL: "https://challenges.cloudflare.com",
        pathname: "/turnstile/v0/siteverify",
      }),
      wantedRequestInit = { method: "POST", body: new FormData() };
    wantedRequestInit.body.append(
      "secret",
      String(Deno.env.get("CF_TURNSTILE_SECRET_KEY")),
    );
    wantedRequestInit.body.append("response", token);

    expect(wantedURLPattern.test(String(gotFetchURL))).toBeTruthy();
    expect(gotRequestInit).toEqual(wantedRequestInit);
  });

  it("submits to Web3Forms", async () => {
    const mockHeaders = { "Content-Type": "text/html" } satisfies HeadersInit,
      mockResponse = new Response("Test response", { headers: mockHeaders });
    using fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(mockResponse),
    );

    const body = new FormData();
    const name = "John Doe";
    body.append("email", "R2eQ3@example.com");
    body.append("name", name);
    body.append("message", "Test message");
    body.append("unknown-field", ""); // Should not be included in request
    const response = await submitToWeb3Forms(body);

    expect(response.status).toBe(202);

    const gotFetchURL = fetchStub.calls[0].args[0];
    const wantedURLPattern = new URLPattern({
      baseURL: "https://api.web3forms.com",
      pathname: "/submit",
    });
    const gotRequestInit = fetchStub.calls[0].args[1] as RequestInit;
    const wantedRequestInit = {
      method: "POST",
      body,
    };
    wantedRequestInit.body.delete("unknown-field");
    wantedRequestInit.body.append(
      "access_key",
      Deno.env.get("WEB3FORMS_ACCESS_KEY") ?? "",
    );
    wantedRequestInit.body.append(
      "subject",
      "You received a message from your website",
    );
    wantedRequestInit.body.append("botcheck", "");

    assertSpyCalls(fetchStub, 1);
    expect(wantedURLPattern.test(gotFetchURL.toString())).toBeTruthy();
    expect(gotRequestInit).toEqual(wantedRequestInit);
    expect((gotRequestInit.body as FormData).get("unknown-field"))
      .toBeNull();
  });

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
    await postToAppScript(body);

    const gotFetchURL = fetchStub.calls[0].args[0],
      wantedURLPattern = new URLPattern({
        baseURL: "https://script.google.com",
        pathname: "macros/s/:deploymentId/exec",
      });
    assertSpyCalls(fetchStub, 1);
    expect(wantedURLPattern.test(String(gotFetchURL))).toBeTruthy();
  });
});
