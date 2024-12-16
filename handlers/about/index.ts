import { Environment as TemplateEnvironment } from "npm:@types/nunjucks";

import { RouteHandler } from "@/handlers/types.ts";

export const aboutHandler = (template: TemplateEnvironment) =>
  ((request: Request): Response => {
    return new Response(
      template.render("home/index.html", { request, title: "Hello" }),
      { headers: { "content-type": "text/html" } },
    );
  }) satisfies RouteHandler;
