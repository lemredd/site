import nunjucks from "https://deno.land/x/nunjucks@3.2.4/mod.js";

nunjucks.configure("html", { autoescape: true, noCache: true });

Deno.serve((_req) => {
  return new Response(
    nunjucks.render("index.html", { title: "Hello", message: "World" }),
    { headers: { "content-type": "text/html" } },
  );
});
