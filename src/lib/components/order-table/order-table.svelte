<script lang="ts">
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import type { Order } from '$types/payments.js';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte';
	import { FlexRender, renderSnippet } from '$lib/components/ui/data-table/index';
	import { Badge } from '$lib/components/ui/badge/index';
	import * as Table from '$lib/components/ui/table/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Label } from '$lib/components/ui/label/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import LayoutColumnsIcon from '@tabler/icons-svelte/icons/layout-columns';
	import ChevronDownIcon from '@tabler/icons-svelte/icons/chevron-down';
	import ChevronsLeftIcon from '@tabler/icons-svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@tabler/icons-svelte/icons/chevron-left';
	import ChevronRightIcon from '@tabler/icons-svelte/icons/chevron-right';
	import ChevronsRightIcon from '@tabler/icons-svelte/icons/chevrons-right';
	import ArrowUpIcon from '@tabler/icons-svelte/icons/arrow-up';
	import ArrowDownIcon from '@tabler/icons-svelte/icons/arrow-down';
	import ArrowsUpDownIcon from '@tabler/icons-svelte/icons/arrows-up-down';
	import {
		TRANS_STATUS_LABELS,
		PROVIDER_LABELS,
		METHOD_LABELS,
		DEFAULT_PAGE_SIZE,
		PAGE_SIZE_OPTIONS,
		ORDER_TRANS_STATUS_FILTER_OPTIONS,
		CURRENCY_SYMBOLS
	} from '$config/order-table-constants.js';
	import { OrderTransactionStatus } from '$types/payments.js';
	import ClockIcon from '@tabler/icons-svelte/icons/clock';
	import CircleDotIcon from '@tabler/icons-svelte/icons/circle-dot';
	import CircleCheckFilledIcon from '@tabler/icons-svelte/icons/circle-check-filled';
	import CircleXFilledIcon from '@tabler/icons-svelte/icons/circle-x-filled';
	import IconBrandWechat from '@tabler/icons-svelte/icons/brand-wechat';
	import IconBrandAlipay from '@tabler/icons-svelte/icons/brand-alipay';
	import CreditCardIcon from '@tabler/icons-svelte/icons/credit-card';
	import CircleCheck from '@tabler/icons-svelte/icons/circle-check';
	import {
		IconAlertCircleFilled,
		IconCircleCheckFilled,
		IconCircleDashed,
		IconCircleDotFilled,
		IconCircleRectangleFilled,
		IconCircleXFilled
	} from '@tabler/icons-svelte';

	let { orders = [] }: { orders: Order[] } = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
	let sorting = $state<SortingState>([{ id: 'createdAt', desc: true }]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({ bizRefId: false });
	let transStatusFilter = $state('');
	let pageSizeSelect = $state(String(DEFAULT_PAGE_SIZE));

	const columns: ColumnDef<Order>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (ctx) => ctx.getValue(),
			enableHiding: true
		},
		{
			accessorKey: 'bizRefId',
			header: 'Biz Ref ID',
			cell: (ctx) => ctx.getValue() ?? '—',
			enableHiding: true
		},
		{
			accessorKey: 'provider',
			header: 'Provider',
			cell: ({ row }) => renderSnippet(OrderTableProvider, { row }),
			enableHiding: true
		},
		{
			accessorKey: 'method',
			header: 'Method',
			cell: ({ row }) => renderSnippet(OrderTableMethod, { row }),
			enableHiding: true
		},
		{
			id: 'amount',
			accessorFn: (row) => `${row.amountCent} ${row.currency}`,
			header: 'Amount',
			cell: (ctx) =>
				`${CURRENCY_SYMBOLS[ctx.row.original.currency as keyof typeof CURRENCY_SYMBOLS]} ${(ctx.row.original.amountCent / 100).toLocaleString()}`,
			sortingFn: (rowA, rowB) => rowA.original.amountCent - rowB.original.amountCent,
			enableHiding: true,
			meta: { class: 'text-right' }
		},
		{
			accessorKey: 'transStatus',
			header: 'Trans Status',
			cell: ({ row }) => renderSnippet(OrderTableTransStatus, { row }),
			filterFn: (row, _columnId, value) =>
				value === '' ? true : row.getValue('transStatus') === value,
			enableHiding: true
		},

		{
			accessorKey: 'createdAt',
			header: 'Created',
			cell: (ctx) => {
				const v = ctx.getValue() as string;
				return v ? new Date(v).toLocaleString() : '—';
			},
			enableHiding: true
		}
	];

	const table = createSvelteTable({
		get data() {
			return orders;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onPaginationChange: (updater) => {
			const next = typeof updater === 'function' ? updater(pagination) : updater;
			pagination = next;
			pageSizeSelect = String(next.pageSize);
		}
	});

	function setTransStatusFilter(value: string) {
		const filterValue = value === 'all' ? '' : value;
		transStatusFilter = filterValue;
		table.setColumnFilters((prev) => {
			const rest = prev.filter((f) => f.id !== 'transStatus');
			return filterValue === '' ? rest : [...rest, { id: 'transStatus', value: filterValue }];
		});
	}

	const transStatusTabValue = $derived(transStatusFilter === '' ? 'all' : transStatusFilter);
	const transStatusLabel = $derived(
		ORDER_TRANS_STATUS_FILTER_OPTIONS.find(
			(o) => (o.value === '' ? 'all' : o.value) === transStatusTabValue
		)?.label ?? 'ALL'
	);

	const transStatusOptionsWithCount = $derived(
		ORDER_TRANS_STATUS_FILTER_OPTIONS.map((opt) => {
			const count =
				opt.value === '' ? orders.length : orders.filter((o) => o.transStatus === opt.value).length;
			return { ...opt, tabValue: opt.value === '' ? 'all' : opt.value, count };
		})
	);
</script>

<div class="flex flex-col gap-4">
	<Tabs.Root
		value={transStatusTabValue}
		onValueChange={(v) => v != null && setTransStatusFilter(v)}
	>
		<div class="flex items-center justify-between">
			<Label for="order-trans-status-selector" class="sr-only">Trans Status</Label>
			<Select.Root
				type="single"
				value={transStatusTabValue}
				onValueChange={(v) => {
					const val = (Array.isArray(v) ? v[0] : v) ?? 'all';
					if (val) setTransStatusFilter(val);
				}}
			>
				<Select.Trigger
					class="flex w-fit @4xl/main:hidden"
					size="sm"
					id="order-trans-status-selector"
				>
					{transStatusLabel}
				</Select.Trigger>
				<Select.Content>
					{#each transStatusOptionsWithCount as opt (opt.tabValue)}
						<Select.Item value={opt.tabValue}>
							{opt.label}
							{#if opt.tabValue !== 'all'}
								<span class="ml-1 text-muted-foreground">({opt.count})</span>
							{/if}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Tabs.List
				class="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex"
			>
				{#each transStatusOptionsWithCount as opt (opt.tabValue)}
					<Tabs.Trigger value={opt.tabValue}>
						{opt.label}
						{#if opt.tabValue !== 'all' && opt.count > 0}
							<Badge variant="secondary">{opt.count}</Badge>
						{/if}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
			<div class="flex items-center gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>
								<LayoutColumnsIcon />
								<span class="hidden sm:inline">Columns</span>
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-48">
						{#each table.getAllColumns().filter((c) => c.getCanHide()) as column (column.id)}
							<DropdownMenu.CheckboxItem
								class="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(v) => column.toggleVisibility(!!v)}
							>
								{column.columnDef.header as string}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Tabs.Root>
	<div class="overflow-hidden rounded-md border">
		<Table.Root>
			<Table.Header class="bg-muted">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								colspan={header.colSpan}
								class={(header.column.columnDef.meta as { class?: string })?.class}
							>
								{#if header.isPlaceholder}
									&nbsp;
								{:else if header.column.getCanSort()}
									<button
										type="button"
										class="flex items-center gap-1 hover:underline"
										onclick={(e) => header.column.getToggleSortingHandler()?.(e)}
									>
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
										{#if header.column.getIsSorted() === 'asc'}
											<ArrowUpIcon class="size-4" />
										{:else if header.column.getIsSorted() === 'desc'}
											<ArrowDownIcon class="size-4" />
										{:else}
											<ArrowsUpDownIcon class="size-4 opacity-50" />
										{/if}
									</button>
								{:else}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if table.getRowModel().rows?.length}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell class={(cell.column.columnDef.meta as { class?: string })?.class}>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center text-muted-foreground">
							No orders.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-2">
			<Label for="order-table-page-size" class="text-sm font-medium">Rows per page</Label>
			<Select.Root
				type="single"
				bind:value={pageSizeSelect}
				onValueChange={(v) => {
					const s = (Array.isArray(v) ? v[0] : v) ?? '';
					if (s && Number.isFinite(Number(s))) table.setPageSize(Number(s));
				}}
			>
				<Select.Trigger size="sm" class="w-20" id="order-table-page-size">
					{pageSizeSelect}
				</Select.Trigger>
				<Select.Content side="top">
					{#each PAGE_SIZE_OPTIONS as size (size)}
						<Select.Item value={String(size)}>{size}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex items-center gap-2 text-sm font-medium">
			Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 sm:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">First page</span>
				<ChevronsLeftIcon />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Previous</span>
				<ChevronLeftIcon />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Next</span>
				<ChevronRightIcon />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 sm:flex"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Last page</span>
				<ChevronsRightIcon />
			</Button>
		</div>
	</div>
</div>

{#snippet OrderTableProvider({ row }: { row: Row<Order> })}
	<Badge
		variant="outline"
		class="inline-flex items-center gap-1 px-1.5 font-normal text-muted-foreground"
	>
		{#if row.original.provider === 'WECHATPAY'}
			<IconBrandWechat class="size-3.5" />
		{:else if row.original.provider === 'ALIPAY'}
			<IconBrandAlipay class="size-3.5" />
		{:else}
			<CreditCardIcon class="size-3.5 opacity-50" />
		{/if}
		{PROVIDER_LABELS[row.original.provider] ?? row.original.provider ?? '—'}
	</Badge>
{/snippet}

{#snippet OrderTableMethod({ row }: { row: Row<Order> })}
	<Badge variant="outline" class="px-1.5 font-normal text-muted-foreground">
		{METHOD_LABELS[row.original.method] ?? row.original.method ?? '—'}
	</Badge>
{/snippet}

{#snippet OrderTableTransStatus({ row }: { row: Row<Order> })}
	<Badge variant="outline" class="inline-flex items-center gap-1 px-1.5 text-muted-foreground">
		{#if row.original.transStatus === OrderTransactionStatus.AWAITING}
			<IconCircleDashed class="size-3.5 text-yellow-500" />
		{:else if row.original.transStatus === OrderTransactionStatus.AUTHORIZED}
			<IconCircleDotFilled class="size-3.5 fill-green-500 dark:fill-green-400" />
		{:else if row.original.transStatus === OrderTransactionStatus.RELEASED}
			<IconCircleRectangleFilled class="size-3.5 text-muted-foreground" />
		{:else if row.original.transStatus === OrderTransactionStatus.CHARGED}
			<IconCircleCheckFilled class="size-3.5 fill-green-500 dark:fill-green-400" />
		{:else if row.original.transStatus === OrderTransactionStatus.REFUNDED}
			<IconAlertCircleFilled class="size-3.5 fill-yellow-500 dark:fill-yellow-400" />
		{:else if row.original.transStatus === OrderTransactionStatus.ERROR}
			<IconCircleXFilled class="size-3.5 fill-destructive text-destructive" />
		{:else}
			<IconCircleXFilled class="size-3.5 fill-destructive text-destructive" />
		{/if}
		{TRANS_STATUS_LABELS[row.original.transStatus] ?? row.original.transStatus ?? '—'}
	</Badge>
{/snippet}
