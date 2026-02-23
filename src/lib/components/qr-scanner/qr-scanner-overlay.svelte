<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className, children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<div
	class={cn(
		'pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 p-4',
		className
	)}
	data-slot="qr-scanner-overlay"
	aria-hidden="true"
>
	<div
		class="flex aspect-square w-2/3 max-w-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-transparent"
		role="presentation"
	>
		{#if children}
			{@render children()}
		{:else}
			<span class="text-center text-sm text-muted-foreground">将二维码放入框内</span>
		{/if}
	</div>
</div>
