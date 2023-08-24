import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetTypography, presetUno } from "unocss";

export default defineConfig({
	"presets": [
		presetTypography(),
		presetUno()
	],
	"transformers": [
		transformerDirectives()
	]
});
