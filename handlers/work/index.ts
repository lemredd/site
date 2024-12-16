import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const workHandler = ((request: Request): Response => {
  return render({
    name: "work/index.html",
    context: { request, title: "Work" },
  });
}) satisfies RouteHandler;
