import { derived } from 'svelte/store';
import { browser } from '$app/environment';
import { ordersStore } from '$store/order.store.js';
import type { StatsCard } from '$types/stats.js';
import {
	computeCardToday,
	computeCardThisWeek,
	computeCardThisMonth,
	computeCardAov
} from '$utils/calculators/stats.calculator.js';

const emptyCard: StatsCard = {
	revenueCent: 0,
	orderCount: 0,
	trendPercent: null,
	trendLabel: '暂无对比'
};

function getNow(): Date {
	return new Date();
}

export const ordersList = derived(ordersStore, ($orders) => $orders ?? []);

export const statsCardToday = derived(ordersList, (orders) => {
	if (!browser) return emptyCard;
	return computeCardToday(orders, getNow());
});

export const statsCardThisWeek = derived(ordersList, (orders) => {
	if (!browser) return emptyCard;
	return computeCardThisWeek(orders, getNow());
});

export const statsCardThisMonth = derived(ordersList, (orders) => {
	if (!browser) return emptyCard;
	return computeCardThisMonth(orders, getNow());
});

export const statsCardAov = derived(ordersList, (orders) => {
	if (!browser) return emptyCard;
	return computeCardAov(orders, getNow());
});
