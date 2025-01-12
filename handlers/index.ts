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

const staticFileHandler = (async (request: Request) => {
  const url = new URL(request.url);
  const STATIC_FILE_CACHE_AGE = 1 * 60 * 60 * 24 * 365;
  const response = await serveFile(
    request,
    `./static${url.pathname}`,
  );

  response.headers.set(
    "Cache-Control",
    `public, max-age=${STATIC_FILE_CACHE_AGE}`,
  );
  (url.pathname.endsWith("tailwind.css") || url.pathname.endsWith(".js")) &&
    response.headers.set(
      "Cache-Control",
      "no-cache",
    );

  return response;
}) satisfies RouteHandler;

export const mainHandler = (async (request: Request) => {
  const [response, matched] = handleByURLPattern(request);
  if (matched) return await response;

  try {
    return await staticFileHandler(request);
  } catch {
    return await response; // 404 by default
  }
}) satisfies Deno.ServeHandler;
