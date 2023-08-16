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
	class="dark-mode-toggler-btn"
	id="dark-mode-toggler-{viewport}"
	bind:this={dark_mode_button}
	aria-pressed={dark_mode_button_state}
	on:click|self={toggle_color_scheme}
>
	<div class="icon i-material-symbols:{preferred_color_scheme}-mode" />
</button>

<style lang="scss">
.dark-mode-toggler-btn {
	--TOP_INSET: calc(calc(1.5rem * -1) / 2);
	--at-apply:
		inline-flex
		top-$TOP_INSET
		border border-neutral rounded-full
		w-12
		p-1
		sm:top-[-1px]
	;
}

.icon {
	--at-apply:
		transition-opacity transition-transform duration-300
		cursor-pointer pointer-events-none
		translate-x-0
		text-4
	;
}

.dark-mode-toggler-btn[aria-pressed=true] {
	.dark-mode-toggler-btn {
		--at-apply: bg-dark;
	}
	.icon {
		--at-apply: translate-x-6;
	}
}
</style>
