module.exports = {
	"root": true,
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:astro/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint"],
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 2020,
	},
	"env": {
		"browser": true,
		"es2017": true,
		"node": true
	},
	"overrides": [
		{
			// Define the configuration for `.astro` file.
			"files": ["*.astro"],
			// Enable this plugin
			"plugins": ["astro"],
			"env": {
				// Enables global variables available in Astro components.
				"node": true,
				"astro/astro": true,
				"es2020": true,
			},
			// Allows Astro components to be parsed.
			"parser": "astro-eslint-parser",
			// Parse the script in `.astro` as TypeScript by adding the following configuration.
			// It's the setting you need when using TypeScript.
			"parserOptions": {
				"parser": "@typescript-eslint/parser",
				"extraFileExtensions": [".astro"],
				// The script of Astro components uses ESM.
				"sourceType": "module",
			},
			"rules": {
				// Enable recommended rules
				"astro/no-conflict-set-directives": "error",
				"astro/no-unused-define-vars-in-style": "error",

				// override/add rules settings here, such as:
				// "astro/no-set-html-directive": "error"
			},
		},
		{
			// Define the configuration for `<script>` tag.
			// Script in `<script>` is assigned a virtual file name with the `.js` extension.
			"files": ["**/*.astro/*.js", "*.astro/*.js"],
			"env": {
				"browser": true,
				"es2020": true,
			},
			"parserOptions": {
				"sourceType": "module",
			},
			"rules": {
				// override/add rules settings here, such as:
				// "no-unused-vars": "error"

				// If you are using "prettier/prettier" rule,
				// you don't need to format inside <script> as it will be formatted as a `.astro` file.
				"prettier/prettier": "off",
			},
		},
		// ...
	],
	"rules": {
		"max-lines": "warn",
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"quote-props": ["warn", "always"],
		"require-await": "error",
		"semi": [
			"error",
			"never"
		],
		"no-unused-vars": "off",

		// typescript-eslint
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ "argsIgnorePattern": "^unused|_", "varsIgnorePattern": "^unused|_" }
		],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "variable",
				"format": ["snake_case", "UPPER_CASE"]
			}
		],
		"@typescript-eslint/explicit-function-return-type": "error",

		"space-before-function-paren": ["error", "never"],
		"object-curly-spacing": ["error", "always"],
	}
}
