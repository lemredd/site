import { serveFile } from "@std/http/file-server";

// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";

nunjucks.configure("html", { autoescape: true, noCache: true });

const mainHandler = (async (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/static")) {
    return await serveFile(request, `./${url.pathname}`);
  }

  return new Response(
    nunjucks.render("home/index.html", { title: "Hello", message: "World" }),
    { headers: { "content-type": "text/html" } },
  );
}) satisfies Deno.ServeHandler;

Deno.serve(mainHandler);
