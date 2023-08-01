import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetIcons, presetTypography, presetWind } from "unocss";

export default defineConfig({
	"presets": [
		presetTypography(),
		presetWind(),
		presetIcons({
			"extraProperties": { "display": "inline-block" }
		})
	],
	"transformers": [
		transformerDirectives()
	]
});
