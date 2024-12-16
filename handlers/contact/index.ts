import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const contactHandler = ((request: Request): Response => {
  return render({
    name: "contact/index.html",
    context: { request, title: "Contact" },
  });
}) satisfies RouteHandler;
