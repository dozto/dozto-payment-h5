<script lang="ts">
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		statsCardToday,
		statsCardThisWeek,
		statsCardThisMonth,
		statsCardAov
	} from '$store/stats.store.js';
	import { CURRENCY_SYMBOLS } from '$config/app/currency.config.js';

	const symbol = CURRENCY_SYMBOLS.CNY ?? '¥';

	function formatYuan(cent: number): string {
		return (cent / 100).toLocaleString('zh-CN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}
</script>

<div
	class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>今日收入</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{symbol}{formatYuan($statsCardToday.revenueCent)}
			</Card.Title>
			<Card.Action>
				{#if $statsCardToday.trendPercent !== null}
					<Badge variant="outline">
						{#if $statsCardToday.trendPercent >= 0}
							<TrendingUpIcon />
							+{$statsCardToday.trendPercent.toFixed(1)}%
						{:else}
							<TrendingDownIcon />
							{$statsCardToday.trendPercent.toFixed(1)}%
						{/if}
					</Badge>
				{/if}
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{$statsCardToday.trendLabel}
				{#if $statsCardToday.trendPercent !== null && $statsCardToday.trendPercent >= 0}
					<TrendingUpIcon class="size-4" />
				{:else if $statsCardToday.trendPercent !== null && $statsCardToday.trendPercent < 0}
					<TrendingDownIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">今日订单数：{$statsCardToday.orderCount}</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>本周收入</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{symbol}{formatYuan($statsCardThisWeek.revenueCent)}
			</Card.Title>
			<Card.Action>
				{#if $statsCardThisWeek.trendPercent !== null}
					<Badge variant="outline">
						{#if $statsCardThisWeek.trendPercent >= 0}
							<TrendingUpIcon />
							+{$statsCardThisWeek.trendPercent.toFixed(1)}%
						{:else}
							<TrendingDownIcon />
							{$statsCardThisWeek.trendPercent.toFixed(1)}%
						{/if}
					</Badge>
				{/if}
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{$statsCardThisWeek.trendLabel}
				{#if $statsCardThisWeek.trendPercent !== null && $statsCardThisWeek.trendPercent >= 0}
					<TrendingUpIcon class="size-4" />
				{:else if $statsCardThisWeek.trendPercent !== null && $statsCardThisWeek.trendPercent < 0}
					<TrendingDownIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">本周订单数：{$statsCardThisWeek.orderCount}</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>本月收入</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{symbol}{formatYuan($statsCardThisMonth.revenueCent)}
			</Card.Title>
			<Card.Action>
				{#if $statsCardThisMonth.trendPercent !== null}
					<Badge variant="outline">
						{#if $statsCardThisMonth.trendPercent >= 0}
							<TrendingUpIcon />
							+{$statsCardThisMonth.trendPercent.toFixed(1)}%
						{:else}
							<TrendingDownIcon />
							{$statsCardThisMonth.trendPercent.toFixed(1)}%
						{/if}
					</Badge>
				{/if}
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{$statsCardThisMonth.trendLabel}
				{#if $statsCardThisMonth.trendPercent !== null && $statsCardThisMonth.trendPercent >= 0}
					<TrendingUpIcon class="size-4" />
				{:else if $statsCardThisMonth.trendPercent !== null && $statsCardThisMonth.trendPercent < 0}
					<TrendingDownIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">本月订单数：{$statsCardThisMonth.orderCount}</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>本月平均客单价</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{symbol}{formatYuan($statsCardAov.revenueCent)}
			</Card.Title>
			<Card.Action>
				{#if $statsCardAov.trendPercent !== null}
					<Badge variant="outline">
						{#if $statsCardAov.trendPercent >= 0}
							<TrendingUpIcon />
							+{$statsCardAov.trendPercent.toFixed(1)}%
						{:else}
							<TrendingDownIcon />
							{$statsCardAov.trendPercent.toFixed(1)}%
						{/if}
					</Badge>
				{/if}
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{$statsCardAov.trendLabel}
				{#if $statsCardAov.trendPercent !== null && $statsCardAov.trendPercent >= 0}
					<TrendingUpIcon class="size-4" />
				{:else if $statsCardAov.trendPercent !== null && $statsCardAov.trendPercent < 0}
					<TrendingDownIcon class="size-4" />
				{/if}
			</div>
			<div class="text-muted-foreground">同比上月客单价</div>
		</Card.Footer>
	</Card.Root>
</div>
