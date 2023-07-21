import { defineConfig, presetTypography } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
	"presets": [
		presetTypography()
	],
	"transformers": [
		transformerDirectives()
	]
});
