<script lang="ts">
import { onMount } from "svelte";

import { preferred_color_scheme, set_preferred_color_scheme } from "@components/store"

type Viewport = "mobile"|"desktop";

export let viewport: Viewport = "mobile";

let dark_mode_button: HTMLButtonElement;

let initial_pressed_state: "true" | "false" = $preferred_color_scheme === "dark" ? "true" : "false";
$: prefers_dark = $preferred_color_scheme === "dark";

function toggle_color_scheme(): void {
		const { "documentElement": root } = document;
		const pressed = dark_mode_button.getAttribute("aria-pressed");

		if (pressed === "false") {
			set_preferred_color_scheme("dark");
			dark_mode_button.setAttribute("aria-pressed", "true");
		} else {
			set_preferred_color_scheme("light");
			dark_mode_button.setAttribute("aria-pressed", "false");
		}
		root.classList.toggle("dark");
}

onMount(() => {
	if (!$preferred_color_scheme) set_preferred_color_scheme("light");
	else if ($preferred_color_scheme === "dark") dark_mode_button.setAttribute("aria-pressed", "true");
})
</script>

<button
	class="dark-mode-toggler-btn"
	id="dark-mode-toggler-{viewport}"
	bind:this={dark_mode_button}
	aria-pressed={initial_pressed_state}
	on:click|self={toggle_color_scheme}
>
	<div
		class="icon"
		class:i-material-symbols-dark-mode={prefers_dark}
		class:i-material-symbols-light-mode={!prefers_dark}
	/>
</button>

<style lang="scss">
.dark-mode-toggler-btn {
	--TOP_INSET: calc(calc(1.5rem * -1) / 2);
	--at-apply:
		w-12
		inline-flex
		border border-neutral rounded-full
		p-1
		sm:top-[-1px]
		sm:absolute sm:-right-20
		dark:bg-dark-200
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
	.icon {
		--at-apply: translate-x-6;
	}
}
</style>
