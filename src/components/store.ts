import { writable } from "svelte/store";

const PREFERRED_COLOR_SCHEME_KEY = "preferred_color_scheme";

export const preferred_color_scheme = writable(localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY));

export function set_preferred_color_scheme(color_scheme: "dark" | "light"): void {
	localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, color_scheme);
	preferred_color_scheme.update(color_scheme => color_scheme = localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY));
}
