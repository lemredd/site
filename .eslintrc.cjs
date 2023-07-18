module.exports = {
	"root": true,
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
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

		"space-before-function-paren": ["error", "never"],
		"object-curly-spacing": ["error", "always"],
	}
}
