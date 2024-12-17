import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const workHandler = ((request: Request): Response => {
  return render({
    name: "work/index.html",
    context: { request, title: "Work" },
  });
}) satisfies RouteHandler;

export const projectsHandler = ((request: Request): Response => {
  return render({
    name: "work/projects.hx.html",
    context: { request, title: "Projects" },
  });
}) satisfies RouteHandler;
