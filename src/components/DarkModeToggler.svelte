<script lang="ts">
import { onMount } from "svelte";

type Viewport = "mobile"|"desktop";

export let viewport: Viewport = "mobile";

let dark_mode_button: HTMLButtonElement;

const PREFERRED_COLOR_SCHEME_KEY = "preferred_color_scheme";
let preferred_color_scheme = localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY);
$: dark_mode_button_state = preferred_color_scheme === "dark" ? "true" : "false";

function toggle_color_scheme(): void {
		const { "documentElement": root } = document;
		const pressed = dark_mode_button.getAttribute("aria-pressed");

		if (pressed === "false") {
			localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "dark");
			dark_mode_button.setAttribute("aria-pressed", "true");
		} else {
			localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "light")
			dark_mode_button.setAttribute("aria-pressed", "false");
		}
		preferred_color_scheme = localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY);
		root.classList.toggle("dark");
}

onMount(() => {
	if (!preferred_color_scheme) localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "light");
	else if (preferred_color_scheme === "dark") dark_mode_button.setAttribute("aria-pressed", "true");
})
</script>

<button
	class="dark-mode-toggler-icon"
	id="dark-mode-toggler-{viewport}"
	bind:this={dark_mode_button}
	aria-pressed={dark_mode_button_state}
	on:click|self={toggle_color_scheme}
>
	<div class="icon on i-material-symbols:dark-mode" />
	<div class="icon off i-material-symbols:light-mode" />
</button>

<style lang="scss">
.dark-mode-toggler-icon {
	--TOP_INSET: calc(calc(1.5rem * -1) / 2);
	--at-apply:
		mr-6
		inline-flex
		top-$TOP_INSET
		sm:mr-6 sm:top-[-1px]
	;
	width: fit-content;
}

.icon {
	--at-apply:
		transition-opacity duration-300
		cursor-pointer pointer-events-none
	;

	// `text-$var` class does not work.
	// UnoCSS gets confused in determining if variable is used for `color` or `font-size`

	&.off {
		--at-apply: delay-150;
	}
	&.on {
		--at-apply: opacity-0 pointer-events-none;
	}
}

.dark-mode-toggler:checked + .dark-mode-toggler-icon {
	.icon.on {
		--at-apply: opacity-[1] pointer-events-auto delay-150;
	}

	.icon.off {
		--at-apply: opacity-0 pointer-events-none delay-0;
	}
}
</style>
