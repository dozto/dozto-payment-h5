<script lang="ts">
	import { alertStore, alertActions } from '$store/alert.store.js';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="fixed top-16 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
	{#each $alertStore as item (item.id)}
		<Alert variant={item.variant ?? 'default'}>
			<div class="col-span-2 flex items-start justify-between gap-2">
				<div class="grid gap-1">
					{#if item.title}
						<AlertTitle>{item.title}</AlertTitle>
					{/if}
					<AlertDescription>{item.description}</AlertDescription>
				</div>
				<Button
					variant="ghost"
					size="icon"
					class="size-6 shrink-0"
					onclick={() => alertActions.dismiss(item.id)}
					aria-label="关闭"
				>
					×
				</Button>
			</div>
		</Alert>
	{/each}
</div>
