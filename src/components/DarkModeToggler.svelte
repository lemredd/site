<script lang="ts">
import { onMount } from "svelte";

type Viewport = "mobile"|"desktop";

export let viewport: Viewport = "mobile";

let dark_mode_checkbox: HTMLInputElement;
const { "documentElement": root } = document;

const PREFERRED_COLOR_SCHEME_KEY = "preferred_color_scheme";
let preferred_color_scheme = localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY);
$: prefers_dark = preferred_color_scheme === "dark";
$: prefers_light = preferred_color_scheme === "light";

function toggle_checkbox(event: Event): void {
	const { checked } = event.target as HTMLInputElement;
	if (checked) localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "dark");
	else localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "light");

	root.classList.toggle("dark");
}

onMount(() => {
	if (!preferred_color_scheme) {
		localStorage.setItem(PREFERRED_COLOR_SCHEME_KEY, "light");
	} else if (preferred_color_scheme() === "dark") {
		dark_mode_checkbox.checked = true;
		root.classList.add("dark");
	}
	dark_mode_checkbox.addEventListener("change", toggle_checkbox);
})
</script>

<input
	type="checkbox"
	id="dark-mode-toggler-{viewport}"
	class="dark-mode-toggler"
	bind:this={dark_mode_checkbox}
	hidden
/>
<label for="dark-mode-toggler-{viewport}" class="dark-mode-toggler-icon">
	<div
		class="icon"
		class:i-material-symbols-dark-mode={prefers_dark}
		class:i-material-symbols-light-mode={prefers_light}
	/>
</label>

<style lang="scss">
.dark-mode-toggler-icon {
	--TOP_INSET: calc(calc(var(--ICON_SIZE) * -1) / 2);
	--at-apply:
		mr-6
		inline-flex
		relative top-$TOP_INSET
		sm:mr-8 sm:top-[-1px]
	;
}

.icon {
	--at-apply: absolute transition-opacity duration-300 cursor-pointer;

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
