// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";
import { Environment as TemplateEnvironment } from "npm:@types/nunjucks";

interface RenderParameters {
  name: Parameters<TemplateEnvironment["render"]>[0];
  context: Parameters<TemplateEnvironment["render"]>[1];
  headers?: HeadersInit;
}

export const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

export const render = (
  { name, context, headers }: RenderParameters,
): Response =>
  new Response(
    template.render(name, context),
    { headers: { ...headers, "content-type": "text/html" } },
  );
