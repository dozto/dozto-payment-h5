import { OrderTransactionStatus } from '$types/payments.js';
import type { Order } from '$types/payments.js';
import type { StatsCard, StatsChartPoint, ChartRangeDays } from '$types/stats.js';
import {
	startOfWeek,
	startOfDay,
	endOfDay,
	startOfMonth,
	sameTimeLastMonth
} from '$utils/date.helper.js';

const CHARGED = OrderTransactionStatus.CHARGED;

function parseCreatedAt(createdAt: string): Date {
	return new Date(createdAt);
}

function isCharged(order: Order): boolean {
	return order.transStatus === CHARGED;
}

function inRange(order: Order, from: Date, to: Date): boolean {
	const t = parseCreatedAt(order.createdAt).getTime();
	return t >= from.getTime() && t <= to.getTime();
}

function trendLabel(percent: number | null): string {
	if (percent === null) return '暂无对比';
	if (percent > 0) return `较上期 +${percent.toFixed(1)}%`;
	if (percent < 0) return `较上期 ${percent.toFixed(1)}%`;
	return '与上期持平';
}

function trendPercent(current: number, previous: number): number | null {
	if (previous === 0) return current > 0 ? null : 0;
	return ((current - previous) / previous) * 100;
}

export function computeCardToday(orders: Order[], now: Date): StatsCard {
	const charged = orders.filter(isCharged);
	const startToday = startOfDay(now);
	const endToday = new Date(now);
	const startLastWeek = startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
	const endLastWeek = new Date(startLastWeek.getTime() + (now.getTime() - startToday.getTime()));

	const thisRevenue = charged
		.filter((o) => inRange(o, startToday, endToday))
		.reduce((s, o) => s + o.chargedAmountCent, 0);
	const thisCount = charged.filter((o) => inRange(o, startToday, endToday)).length;
	const prevRevenue = charged
		.filter((o) => inRange(o, startLastWeek, endLastWeek))
		.reduce((s, o) => s + o.chargedAmountCent, 0);

	const percent = trendPercent(thisRevenue, prevRevenue);
	return {
		revenueCent: thisRevenue,
		orderCount: thisCount,
		trendPercent: percent,
		trendLabel: trendLabel(percent)
	};
}

export function computeCardThisWeek(orders: Order[], now: Date): StatsCard {
	const charged = orders.filter(isCharged);
	const weekStart = startOfWeek(now);
	const weekEnd = new Date(now);
	const lastWeekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
	const lastWeekEnd = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

	const thisRevenue = charged
		.filter((o) => inRange(o, weekStart, weekEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);
	const thisCount = charged.filter((o) => inRange(o, weekStart, weekEnd)).length;
	const prevRevenue = charged
		.filter((o) => inRange(o, lastWeekStart, lastWeekEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);

	const percent = trendPercent(thisRevenue, prevRevenue);
	return {
		revenueCent: thisRevenue,
		orderCount: thisCount,
		trendPercent: percent,
		trendLabel: trendLabel(percent)
	};
}

export function computeCardThisMonth(orders: Order[], now: Date): StatsCard {
	const charged = orders.filter(isCharged);
	const monthStart = startOfMonth(now);
	const monthEnd = new Date(now);
	const lastMonthStart = startOfMonth(sameTimeLastMonth(now));
	const lastMonthEnd = sameTimeLastMonth(now);

	const thisRevenue = charged
		.filter((o) => inRange(o, monthStart, monthEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);
	const thisCount = charged.filter((o) => inRange(o, monthStart, monthEnd)).length;
	const prevRevenue = charged
		.filter((o) => inRange(o, lastMonthStart, lastMonthEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);

	const percent = trendPercent(thisRevenue, prevRevenue);
	return {
		revenueCent: thisRevenue,
		orderCount: thisCount,
		trendPercent: percent,
		trendLabel: trendLabel(percent)
	};
}

export function computeCardAov(orders: Order[], now: Date): StatsCard {
	const charged = orders.filter(isCharged);
	const monthStart = startOfMonth(now);
	const monthEnd = new Date(now);
	const lastMonthStart = startOfMonth(sameTimeLastMonth(now));
	const lastMonthEnd = sameTimeLastMonth(now);

	const thisRevenue = charged
		.filter((o) => inRange(o, monthStart, monthEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);
	const thisCount = charged.filter((o) => inRange(o, monthStart, monthEnd)).length;
	const prevRevenue = charged
		.filter((o) => inRange(o, lastMonthStart, lastMonthEnd))
		.reduce((s, o) => s + o.chargedAmountCent, 0);
	const prevCount = charged.filter((o) => inRange(o, lastMonthStart, lastMonthEnd)).length;

	const thisAov = thisCount > 0 ? thisRevenue / thisCount : 0;
	const prevAov = prevCount > 0 ? prevRevenue / prevCount : 0;
	const percent = trendPercent(thisAov, prevAov);

	return {
		revenueCent: Math.round(thisAov),
		orderCount: thisCount,
		trendPercent: percent,
		trendLabel: trendLabel(percent)
	};
}

export function computeChartData(
	orders: Order[],
	rangeDays: ChartRangeDays,
	now: Date
): StatsChartPoint[] {
	const charged = orders.filter(isCharged);
	const points: StatsChartPoint[] = [];

	for (let i = rangeDays - 1; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(d.getDate() - i);
		const start = startOfDay(d);
		const end = endOfDay(d);

		const revenueCent = charged
			.filter((o) => inRange(o, start, end))
			.reduce((s, o) => s + o.chargedAmountCent, 0);
		const orderCount = charged.filter((o) => inRange(o, start, end)).length;
		points.push({
			date: start.toISOString().slice(0, 10),
			revenueCent,
			orderCount
		});
	}
	return points;
}
