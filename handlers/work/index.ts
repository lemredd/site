import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const workHandler = ((request: Request): Response => {
  return render({
    name: "work/index.html",
    context: { request, title: "Work" },
  });
}) satisfies RouteHandler;

export const projectsHandler = (async (request: Request): Promise<Response> => {
  const sample = await fetch("https://example.com");
  const result = await sample.text();
  return render({
    name: "work/projects.hx.html",
    context: { request, title: "Projects" },
  });
}) satisfies RouteHandler;
