import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

const validateContactForm = (form: Record<string, FormDataEntryValue>) => {
  const isValid = form.name && form.email && form.message;
  if (!isValid) throw new Error("Invalid form");
  return isValid;
};

export const verifyTurnstileToken = async (
  token: string,
): Promise<Response> => {
  const verifyURL = new URL(
    "/turnstile/v0/siteverify",
    "https://challenges.cloudflare.com",
  );
  const body = new FormData();
  body.append("secret", String(Deno.env.get("CF_TURNSTILE_SECRET_KEY")));
  body.append("response", token);
  const ERROR_MESSAGE =
    "Cloudflare could not verify this form right now. Please try again later.";

  return await fetch(verifyURL, {
    method: "POST",
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      const { success } = data;
      if (!success) return new Response(ERROR_MESSAGE, { status: 400 });
      return new Response("Verification succeeded", { status: 202 });
    })
    .catch(() => new Response(ERROR_MESSAGE, { status: 503 }));
};

export const postToAppScript = async (body: FormData): Promise<Response> => {
  const appScriptURL = new URL(
    `/macros/s/${Deno.env.get("GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID")}/exec`,
    "https://script.google.com",
  );
  const ERROR_MESSAGE =
    "Could not submit this form right now. Please try again later.";
  return await fetch(
    appScriptURL,
    {
      method: "POST",
      body,
    },
  ).then((response) => {
    if (!response.ok) return new Response(ERROR_MESSAGE, { status: 500 });
    return new Response("Form submitted", { status: 202 });
  })
    .catch(() => new Response(ERROR_MESSAGE, { status: 503 }));
};

const renderStatus = async (response: Response): Promise<Response> => {
  const context = {
    status: response.ok ? "success" : "error",
    message: await response.text(),
  };
  const responseInit = {
    status: response.status,
  } satisfies ResponseInit;

  return render({ context, responseInit, name: "contact/status.hx.html" });
};

const submitContactForm = (async (request: Request): Promise<Response> => {
  const formData = await request.formData();
  try {
    validateContactForm(Object.fromEntries(formData));
  } catch {
    return await renderStatus(new Response("Invalid form", { status: 400 }));
  }
  // TODO: integrate Web3Forms

  const token = String(formData.get("cf-turnstile-response")) ?? "";
  const turnstileResponse = await verifyTurnstileToken(token);
  if (!turnstileResponse.ok) return await renderStatus(turnstileResponse);
  const appScriptResponse = await postToAppScript(formData);
  if (!appScriptResponse.ok) return await renderStatus(appScriptResponse);

  return await renderStatus(
    new Response("Your message has been sent.", { status: 202 }),
  );
}) satisfies RouteHandler;

const contactHandler = (async (request: Request): Promise<Response> => {
  if (request.method === "POST") return await submitContactForm(request);
  return render({
    name: "contact/index.html",
    context: {
      request,
      title: "Contact",
      siteKey: Deno.env.get("CF_TURNSTILE_SITE_KEY"),
    },
  });
}) satisfies RouteHandler;

export { contactHandler, submitContactForm };
