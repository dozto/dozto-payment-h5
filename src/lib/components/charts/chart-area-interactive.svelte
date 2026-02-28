<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { scaleUtc } from 'd3-scale';
	import { Area, AreaChart } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import { chartRangeDays, statsChartData } from '$store/stats.store.js';

	const strToRange = (s: string): 7 | 30 | 90 => (s === '7d' ? 7 : s === '30d' ? 30 : 90);

	const timeRange = $derived($chartRangeDays === 7 ? '7d' : $chartRangeDays === 30 ? '30d' : '90d');

	function setRange(s: '7d' | '30d' | '90d') {
		chartRangeDays.set(strToRange(s));
	}

	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case '90d':
				return '过去 90 天';
			case '30d':
				return '过去 30 天';
			case '7d':
				return '过去 7 天';
			default:
				return '过去 7 天';
		}
	});

	// 图表数据：收入转为元便于同轴展示，订单数保持
	const chartData = $derived(
		($statsChartData ?? []).map((p: { date: Date; revenueCent: number; orderCount: number }) => ({
			date: p.date,
			revenueYuan: p.revenueCent / 100,
			orderCount: p.orderCount
		}))
	);

	const chartConfig = {
		revenueYuan: { label: '收入（元）', color: 'var(--primary)' },
		orderCount: { label: '订单数', color: 'hsl(var(--chart-2))' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>收入与订单趋势</Card.Title>
		<Card.Description>
			<span class="hidden @[540px]/card:block"> 按日汇总已扣款订单 </span>
			<span class="@[540px]/card:hidden">按日汇总</span>
		</Card.Description>
		<Card.Action>
			<ToggleGroup.Root
				type="single"
				value={timeRange}
				onValueChange={(v) => v && setRange(v as '7d' | '30d' | '90d')}
				variant="outline"
				class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
			>
				<ToggleGroup.Item value="7d">过去 7 天</ToggleGroup.Item>
				<ToggleGroup.Item value="30d">过去 30 天</ToggleGroup.Item>
				<ToggleGroup.Item value="90d">过去 90 天</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Select.Root
				type="single"
				value={timeRange}
				onValueChange={(v) => v && setRange(v as '7d' | '30d' | '90d')}
			>
				<Select.Trigger
					size="sm"
					class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
					aria-label="选择时间范围"
				>
					<span data-slot="select-value">{selectedLabel}</span>
				</Select.Trigger>
				<Select.Content class="rounded-xl">
					<Select.Item value="7d" class="rounded-lg">过去 7 天</Select.Item>
					<Select.Item value="30d" class="rounded-lg">过去 30 天</Select.Item>
					<Select.Item value="90d" class="rounded-lg">过去 90 天</Select.Item>
				</Select.Content>
			</Select.Root>
		</Card.Action>
	</Card.Header>
	<Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
		<Chart.Container config={chartConfig} class="aspect-auto h-[250px] w-full">
			<AreaChart
				legend
				data={chartData}
				x="date"
				xScale={scaleUtc()}
				series={[
					{
						key: 'revenueYuan',
						label: '收入（元）',
						color: chartConfig.revenueYuan.color
					},
					{
						key: 'orderCount',
						label: '订单数',
						color: chartConfig.orderCount.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						ticks: timeRange === '7d' ? 7 : undefined,
						format: (v: Date) =>
							v.toLocaleDateString('zh-CN', {
								month: 'short',
								day: 'numeric'
							})
					},
					yAxis: { format: (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(0)) }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					<defs>
						<linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-revenueYuan)" stop-opacity={1.0} />
							<stop offset="95%" stop-color="var(--color-revenueYuan)" stop-opacity={0.1} />
						</linearGradient>
						<linearGradient id="fillOrderCount" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-orderCount)" stop-opacity={0.8} />
							<stop offset="95%" stop-color="var(--color-orderCount)" stop-opacity={0.1} />
						</linearGradient>
					</defs>
					{#each series as s, i (s.key)}
						<Area
							{...getAreaProps(s, i)}
							fill={s.key === 'revenueYuan' ? 'url(#fillRevenue)' : 'url(#fillOrderCount)'}
						/>
					{/each}
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) =>
							v.toLocaleDateString('zh-CN', {
								month: 'short',
								day: 'numeric'
							})}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
