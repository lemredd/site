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

const handleByURLPattern = (request: Request): Response => {
  const url = new URL(request.url);
  for (const pathname in ROUTES) {
    const pattern = new URLPattern({ pathname });
    if (pattern.test(url)) return ROUTES[pathname](request);
  }

  return new Response("Not Found", { status: 404 });
};

export const mainHandler = (async (request: Request) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/static") || url.pathname === "/favicon.ico") {
    return await serveFile(request, `./${url.pathname}`);
  }

  return handleByURLPattern(request);
}) satisfies Deno.ServeHandler;
