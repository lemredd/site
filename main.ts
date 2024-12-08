import { serveFile } from "@std/http/file-server";

// @deno-types="npm:@types/nunjucks"
import nunjucks from "nunjucks";

nunjucks.configure("html", { autoescape: true, noCache: true });

Deno.serve(async (_req: Request) => {
  const url = new URL(_req.url);

  if (url.pathname.startsWith("/static")) {
    return await serveFile(_req, `./${url.pathname}`);
  }

  return new Response(
    nunjucks.render("index.html", { title: "Hello", message: "World" }),
    { headers: { "content-type": "text/html" } },
  );
});
