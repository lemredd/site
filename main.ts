import { serveFile } from "@std/http/file-server";
// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";
const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});
const homeHandler = (request: Request): Response => {
  return new Response(
    template.render("home/index.html", { request, title: "Hello" }),
    { headers: { "content-type": "text/html" } },
  );
};
const workHandler = (request: Request): Response => {
  return new Response(
    template.render("work/index.html", { request, title: "Hello" }),
    { headers: { "content-type": "text/html" } },
  );
};
const contactHandler = (request: Request): Response => {
  return new Response(
    template.render("contact/index.html", { request, title: "Hello" }),
    { headers: { "content-type": "text/html" } },
  );
};
const ROUTES: Record<string, (request: Request) => Response> = {
  "/": homeHandler,
  "/home": homeHandler,
  "/about": homeHandler,
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
Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000) }, mainHandler);
