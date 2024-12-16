import { serveFile } from "@std/http/file-server";

import { RouteHandler } from "@/handlers/types.ts";
import { workHandler } from "@/handlers/work/index.ts";
import { aboutHandler } from "@/handlers/about/index.ts";
import { contactHandler } from "@/handlers/contact/index.ts";

const ROUTES: Record<string, RouteHandler> = {
  "(/home|/about|/)": aboutHandler,
  "/work": workHandler,
  "/contact": contactHandler,
};

const handleByURLPattern = (request: Request): [Response, boolean] => {
  // TODO: use `@std/http/route` once stable
  const url = new URL(request.url);
  for (const pathname in ROUTES) {
    const pattern = new URLPattern({ pathname });
    if (pattern.test(url)) return [ROUTES[pathname](request), true];
  }

  return [new Response("Not Found", { status: 404 }), false];
};

export const mainHandler = (async (request: Request) => {
  const [response, matched] = handleByURLPattern(request);
  if (matched) return response;

  try {
    const url = new URL(request.url);
    return await serveFile(request, `./static${url.pathname}`);
  } catch {
    return response; // 404 by default
  }
}) satisfies Deno.ServeHandler;
