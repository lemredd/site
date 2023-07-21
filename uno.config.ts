import { defineConfig, presetTypography, presetWind } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
	"presets": [
		presetTypography(),
		presetWind()
	],
	"transformers": [
		transformerDirectives()
	]
});
