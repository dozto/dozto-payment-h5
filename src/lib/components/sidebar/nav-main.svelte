<script lang="ts">
	import { page } from '$app/stores';
	import QrCodeIcon from '@tabler/icons-svelte/icons/qrcode';
	import ScanIcon from '@tabler/icons-svelte/icons/scan';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Icon } from '@tabler/icons-svelte';

	let { items }: { items: { title: string; url: string; icon?: Icon }[] } = $props();

	const pathname = $derived($page.url.pathname);

	function isItemActive(url: string): boolean {
		if (url === '/') return pathname === '/';
		return pathname === url || pathname.startsWith(url + '/');
	}
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-6">
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex items-stretch gap-2">
				<Sidebar.MenuButton
					class="min-w-0 flex-1 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
					tooltipContent="扫码扣款"
				>
					<ScanIcon />
					<span class="truncate">扫码扣款</span>
				</Sidebar.MenuButton>
				<Sidebar.MenuButton
					class="min-w-0 flex-1 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
					tooltipContent="生成付款码"
				>
					<QrCodeIcon />
					<span class="truncate">生成付款码</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent={item.title} isActive={isItemActive(item.url)}>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								{#if item.icon}
									<item.icon />
								{/if}
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
