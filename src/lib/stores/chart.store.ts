import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { StatsChartPoint, ChartRangeDays } from '$types/stats.js';
import { ordersList } from './stats.store.js';
import { computeChartData } from '$utils/calculators/stats.calculator.js';

const emptyChart: StatsChartPoint[] = [];

function getNow(): Date {
	return new Date();
}

export const chartRangeDays = writable<ChartRangeDays>(7);

const chartDataRaw = derived([ordersList, chartRangeDays], ([orders, range]) => {
	if (!browser) return emptyChart;
	return computeChartData(orders, range, getNow());
});

/** 折线图用：date 转为 Date 对象，便于 layerchart 使用（本地 0 点） */
export const statsChartData = derived(chartDataRaw, (points) =>
	points.map((p) => {
		const [y, m, d] = p.date.split('-').map(Number);
		return { ...p, date: new Date(y, m - 1, d) };
	})
);

/** 原始按日数据（date 为 YYYY-MM-DD），供需要字符串日期的场景使用 */
export const statsChartDataRaw = chartDataRaw;
