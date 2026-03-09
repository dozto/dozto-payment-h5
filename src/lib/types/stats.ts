/** 单张卡片的统计结果（金额、订单数、趋势） */
export interface StatsCard {
	revenueCent: number;
	orderCount: number;
	/** 与上期对比的百分比变化，如 12.5 表示 +12.5%；上期为 0 时为 null */
	trendPercent: number | null;
	/** 趋势描述，如 "较上周同期 +12.5%" */
	trendLabel: string;
}

/** 折线图按天的数据点 */
export interface StatsChartPoint {
	date: string;
	revenueCent: number;
	orderCount: number;
}

/** 图表时间范围（天） */
export type ChartRangeDays = 7 | 30 | 90;
