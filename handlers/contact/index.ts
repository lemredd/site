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

export const postToAppScript = async (body: FormData): Promise<Response> =>
  await fetch(
    `https://script.google.com/macros/s/${
      Deno.env.get("GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID")
    }/exec`,
    {
      method: "POST",
      body,
    },
  );

const submitContactForm = (async (request: Request): Promise<Response> => {
  const formData = await request.formData();
  try {
    validateContactForm(Object.fromEntries(formData));
  } catch {
    return new Response("Invalid form", { status: 400 });
  }
  // TODO: integrate Web3Forms

  const turnstileResponse = await verifyTurnstileToken(
    String(formData.get("cf-turnstile-response")) ?? "",
  );
  if (!turnstileResponse.ok) return turnstileResponse;

  const appScriptResponse = await postToAppScript(formData);
  if (!appScriptResponse.ok) return appScriptResponse;

  return render({
    name: "contact/status.hx.html",
    context: { status: "success", message: "Your message has been sent." },
  });
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
