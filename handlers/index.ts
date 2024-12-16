import { serveFile } from "@std/http/file-server";

// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";

import { RouteHandler } from "@/handlers/types.ts";
import { workHandler } from "@/handlers/work/index.ts";
import { aboutHandler } from "@/handlers/about/index.ts";
import { contactHandler } from "@/handlers/contact/index.ts";

export const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

const ROUTES: Record<string, RouteHandler> = {
  "/": aboutHandler(template),
  "/home": aboutHandler(template),
  "/about": aboutHandler(template),
  "/work": workHandler(template),
  "/contact": contactHandler(template),
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
