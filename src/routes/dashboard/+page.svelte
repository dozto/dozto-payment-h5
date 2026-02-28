<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import SectionCards from '$lib/components/charts/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/charts/chart-area-interactive.svelte';
	import { OrderTable } from '$lib/components/order-table';
	import { ordersStore } from '$store/order.store.js';

	export let data: { syncError?: boolean };
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div class="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<div class="px-4 lg:px-6">
						<h2 class="mb-2 text-lg font-semibold">订单列表</h2>
						{#if data.syncError}
							<p class="text-sm text-destructive">
								同步失败，请检查网络或稍后重试。订单列表将显示本地已缓存数据。
							</p>
						{/if}
						{#if $ordersStore === undefined}
							<p class="text-sm text-muted-foreground">Loading…</p>
						{:else}
							<OrderTable orders={$ordersStore ?? []} />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
