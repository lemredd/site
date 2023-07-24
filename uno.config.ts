import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetIcons, presetTypography, presetWind } from "unocss";

export default defineConfig({
	"presets": [
		presetTypography(),
		presetWind(),
		presetIcons()
	],
	"transformers": [
		transformerDirectives()
	]
});
