import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig, presetTypography, presetUno } from "unocss";

// site colors
const site = {
	"primary": "#DD2121",
	"secondary": "#FFDB89",
	"black": "#1F1E1C",
	"black-75": "#1F1E1CC0",
	"black-50": "#1F1E1C80",
	"black-25": "#1F1E1C40",
	"black-10": "#1F1E1C1A",
	"black-05": "#1F1E1C0D",
	"footer-black": "#33322E"
};

export default defineConfig({
	"presets": [
		presetTypography(),
		presetUno()
	],
	"transformers": [
		transformerDirectives()
	],
	"theme": {
		"colors": { site }
	}
});
