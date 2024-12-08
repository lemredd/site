import { serveFile } from "@std/http/file-server";

// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";

const template = nunjucks.configure("html", {
  autoescape: true,
  noCache: true,
  trimBlocks: true,
  lstripBlocks: true,
});

const mainHandler = (async (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/static")) {
    return await serveFile(request, `./${url.pathname}`);
  }

  return new Response(
    template.render("home/index.html", { request, title: "Hello" }),
    { headers: { "content-type": "text/html" } },
  );
}) satisfies Deno.ServeHandler;

Deno.serve(mainHandler);
