import transformerDirectives from "@unocss/transformer-directives";
import {
	defineConfig,
	presetTypography,
	presetUno,
	presetWebFonts
} from "unocss";

const SITE_FONTS = {
	"heading": "Montserrat:400,600",
	"body": "Work Sans:400,600"
};

const SITE_COLORS = {
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
		presetUno(),
		presetWebFonts({
			"provider": "google",
			"fonts": SITE_FONTS
		})
	],
	"transformers": [
		transformerDirectives()
	],
	"theme": {
		"colors": { "site": SITE_COLORS }
	}
});
