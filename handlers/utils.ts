// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";
import { Environment as TemplateEnvironment } from "npm:@types/nunjucks";

interface RenderParameters {
  name: Parameters<TemplateEnvironment["render"]>[0];
  context: Parameters<TemplateEnvironment["render"]>[1];
  responseInit?: ResponseInit;
}

export const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

export const render = (
  { name, context, responseInit }: RenderParameters,
): Response =>
  new Response(
    template.render(name, context), // TODO(perf): trim whitespaces manually
    {
      ...responseInit,
      headers: { ...responseInit?.headers ?? {}, "Content-Type": "text/html" },
    },
  );

export const DIRECTIONS = ["R", "L"] as const;
export type Direction = typeof DIRECTIONS[number];
const NAVIGATION_DIRECTIONS: Record<Direction, [string, string][]> = {
  [DIRECTIONS[0]]: [
    ["/", "/work"],
    ["/home", "/work"],
    ["/about", "/work"],
    ["/", "/contact"],
    ["/home", "/contact"],
    ["/about", "/contact"],
    ["/work", "/contact"],
  ],
  [DIRECTIONS[1]]: [
    ["/work", "/"],
    ["/work", "/home"],
    ["/work", "/about"],
    ["/contact", "/"],
    ["/contact", "/home"],
    ["/contact", "/about"],
    ["/contact", "/work"],
  ],
};
export const getBoostDirection = (request: Request): Direction | "" => {
  if (!request.headers.has("HX-Boosted")) return "";

  const from = new URL(request.headers.get("HX-Current-URL") ?? "").pathname;
  const to = new URL(request.url).pathname;

  for (const navigationDirection in NAVIGATION_DIRECTIONS) {
    const directions = NAVIGATION_DIRECTIONS[navigationDirection as Direction];
    for (const direction of directions) {
      if (direction[0] === from && direction[1] === to) {
        return navigationDirection as Direction;
      }
    }
  }
  return DIRECTIONS[0];
};
