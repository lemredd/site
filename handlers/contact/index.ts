import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

const validateContactForm = (form: Record<string, FormDataEntryValue>) => {
  const isValid = form.name && form.email && form.message;
  if (!isValid) throw new Error("Invalid form");
  return isValid;
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

export const verifyTurnstileToken = async (token: string) => {
  const verifyURL = new URL(
    "/turnstile/v0/siteverify",
    "https://challenges.cloudflare.com",
  );
  const body = new FormData();
  body.append("secret", String(Deno.env.get("CF_TURNSTILE_SECRET_KEY")));
  body.append("token", token);
  const response = await fetch(verifyURL, {
    method: "POST",
    body,
  });
  return response.json();
};

const submitContactForm = (async (request: Request): Promise<Response> => {
  const formData = await request.formData();
  try {
    validateContactForm(Object.fromEntries(formData));
  } catch {
    return new Response("Invalid form", { status: 400 });
  }
  // TODO: integrate Web3Forms

  //const response = await postToAppScript(formData);
  //if (!response.ok) { TODO: return error hypermedia }

  return new Response("TODO");
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
