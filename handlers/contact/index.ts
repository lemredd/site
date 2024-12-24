import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

const submitContactForm = (async (request: Request): Promise<Response> => {
  const formData = await request.formData();
  // TODO: validate required fields
  //const formDataObject = Object.fromEntries(formData);

  const response = await fetch(
    `https://script.google.com/macros/s/${
      Deno.env.get("GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID")
    }/exec`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    // TODO: return error hypermedia
  }
  return new Response("TODO");
}) satisfies RouteHandler;

export const contactHandler = (async (request: Request): Promise<Response> => {
  if (request.method === "POST") return await submitContactForm(request);
  return render({
    name: "contact/index.html",
    context: { request, title: "Contact" },
  });
}) satisfies RouteHandler;
