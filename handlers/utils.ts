// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";
import { Environment as TemplateEnvironment } from "npm:@types/nunjucks";

interface RenderParameters {
  name: Parameters<TemplateEnvironment["render"]>[0];
  context: Parameters<TemplateEnvironment["render"]>[1];
  requestInit?: RequestInit;
}

export const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

export const render = (
  { name, context, requestInit }: RenderParameters,
): Response =>
  new Response(
    template.render(name, context), // TODO(perf): trim whitespaces manually
    {
      ...requestInit,
      headers: { ...requestInit?.headers ?? {}, "Content-Type": "text/html" },
    },
  );
