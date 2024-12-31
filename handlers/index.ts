import { serveFile } from "@std/http/file-server";

import { RouteHandler } from "@/handlers/types.ts";
import { aboutHandler } from "@/handlers/about/index.ts";
import { contactHandler } from "@/handlers/contact/index.ts";
import { projectsHandler, workHandler } from "@/handlers/work/index.ts";

const ROUTES: Record<string, RouteHandler> = {
  "(/home|/about|/)": aboutHandler,
  "/work": workHandler,
  "/work/projects": projectsHandler,
  "/contact": contactHandler,
};

const handleByURLPattern = (
  request: Request,
): [ReturnType<RouteHandler>, boolean] => {
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
  if (matched) return await response;

  try {
    const url = new URL(request.url);
    return await serveFile(request, `./static${url.pathname}`);
  } catch {
    return await response; // 404 by default
  }
}) satisfies Deno.ServeHandler;
