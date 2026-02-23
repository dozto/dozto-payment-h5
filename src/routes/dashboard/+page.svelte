<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import { OrderTable } from '$lib/components/order-table';
	import { ordersStore } from '$lib/dashboard/payments-data';
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
						<h2 class="mb-2 text-lg font-semibold">Payments Orders</h2>
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
