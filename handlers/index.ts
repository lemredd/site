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

export const mainHandler = (async (request: Request) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/static") || url.pathname === "/favicon.ico") {
    return await serveFile(request, `./${url.pathname}`);
  }
  try {
    return ROUTES[url.pathname](request);
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}) satisfies Deno.ServeHandler;
