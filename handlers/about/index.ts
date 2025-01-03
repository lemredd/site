import { getBoostDirection, render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const aboutHandler = ((request: Request): Response => {
  return render({
    name: "about/index.html",
    context: {
      request,
      title: "About",
      boostDirection: getBoostDirection(request),
    },
  });
}) satisfies RouteHandler;
