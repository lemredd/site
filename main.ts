import { serveFile } from "@std/http/file-server";

import nunjucks from "https://deno.land/x/nunjucks@3.2.4/mod.js";

nunjucks.configure("html", { autoescape: true, noCache: true });

Deno.serve(async (_req) => {
	const url = new URL(_req.url);

	if (url.pathname.startsWith("/static")) {
		return await serveFile(_req, `./${url.pathname}`);
	}

	return new Response(
		nunjucks.render("index.html", { title: "Hello", message: "World" }),
		{ headers: { "content-type": "text/html" } },
	);
});
