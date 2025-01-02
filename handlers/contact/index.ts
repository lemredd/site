import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

const validateContactForm = (form: Record<string, FormDataEntryValue>) => {
  const isValid = form.name && form.email && form.message;
  if (!isValid) throw new Error("Fill in all required fields.");
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

const handleWeb3FormResponse = (response: Response): Response => {
  if (!response.ok) {
    return new Response(
      "Could not submit this form right now. Please try again later.",
      { status: 500 },
    );
  }
  return new Response("Submitted! I'll get back to you as soon as I can.", {
    status: 202,
  });
};

export const submitToWeb3Forms = async (_body: FormData): Promise<Response> => {
  const web3FormsURL = new URL("/submit", "https://api.web3forms.com");
  const body = new FormData();

  body.append("email", _body.get("email") ?? "");
  body.append("name", _body.get("name") ?? "");
  body.append("message", _body.get("message") ?? "");
  body.append("access_key", Deno.env.get("WEB3FORMS_ACCESS_KEY") ?? "");
  body.append(
    "subject",
    "You received a message from your website",
  );
  body.append("botcheck", "");

  return await fetch(web3FormsURL, { method: "POST", body }).then(
    handleWeb3FormResponse,
  );
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
  } catch (e) {
    return await renderStatus(
      new Response((e as Error).message, { status: 400 }),
    );
  }

  const token = String(formData.get("cf-turnstile-response")) ?? "";
  const turnstileResponse = await verifyTurnstileToken(token);
  if (!turnstileResponse.ok) return await renderStatus(turnstileResponse);

  const web3FormsResponse = await submitToWeb3Forms(formData);
  if (web3FormsResponse.ok) return await renderStatus(web3FormsResponse);
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
