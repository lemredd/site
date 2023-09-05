import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	"integrations": [
		svelte(),
		UnoCSS({
			"injectReset": true
		})
	],
	"output": "server",
	"adapter": cloudflare({ "mode": "directory" })
});
