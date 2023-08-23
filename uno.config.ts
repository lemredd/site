import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";

export default defineConfig({
	"presets": [
		presetTypography(),
		presetUno(),
		presetIcons({
			"extraProperties": {
				"display": "inline-block",
				"font-size": "1.5rem",
				"vertical-align": "middle"
			}
		})
	],
	"transformers": [
		transformerDirectives()
	]
});
