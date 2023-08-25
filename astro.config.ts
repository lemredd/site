import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	"integrations": [
		svelte(),
		UnoCSS({
			"injectReset": true
		})
	],
	"output": "hybrid"
});
