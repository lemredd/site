<script lang="ts">
import { onMount } from "svelte";

type ColorScheme = string|null
type Viewport = "mobile"|"desktop";

export let viewport: Viewport = "mobile";

let dark_mode_checkbox: HTMLInputElement;
const { "documentElement": root } = document;

const PREFERRED_COLOR_SCHEME_KEY = "preferred_color_scheme";
const preferred_color_scheme = (): ColorScheme => localStorage.getItem(PREFERRED_COLOR_SCHEME_KEY);

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
<label for="dark-mode-toggler-{viewport}"  tabindex="0" class="dark-mode-toggler-icon">
	<div class="icon on i-material-symbols:dark-mode" />
	<div class="icon off i-material-symbols:light-mode" />
</label>

<style lang="scss">
.dark-mode-toggler-icon {
	--ICON_SIZE: 1.75rem;
	--TOP_INSET: calc(calc(var(--ICON_SIZE) * -1) / 2);
	@apply
		mr-6
		inline-flex
		relative top-$TOP_INSET
		sm:mr-8 sm:top-[-1px]
	;
}

.icon {
	@apply absolute transition-opacity duration-300 cursor-pointer;

	// `text-$var` class does not work.
	// UnoCSS gets confused in determining if variable is used for `color` or `font-size`
	font-size: var(--ICON_SIZE);

	&.off {
		@apply delay-150;
	}
	&.on {
		@apply opacity-0 pointer-events-none;
	}
}

.dark-mode-toggler:checked + .dark-mode-toggler-icon {
	.icon.on {
		@apply opacity-[1] pointer-events-auto delay-150;
	}

	.icon.off {
		@apply opacity-0 pointer-events-none delay-0;
	}
}
</style>
