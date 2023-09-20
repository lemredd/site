import transformerDirectives from "@unocss/transformer-directives";
import {
	defineConfig,
	presetTypography,
	presetUno,
	presetWebFonts
} from "unocss";

const SITE_FONTS = {
	"heading": "Montserrat:400,600,700",
	"body": "Work Sans:400,600"
};

const SITE_COLORS = {
	"primary": "#DD2121",
	"secondary": "#FFDB89",
	"black": "#1F1E1C",
	"black75": "#1F1E1CC0",
	"black50": "#1F1E1C80",
	"black25": "#1F1E1C40",
	"black10": "#1F1E1C1A",
	"black05": "#1F1E1C0D",
	"footerBlack": "#33322E",
	"white": "#FFF7E6"
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
