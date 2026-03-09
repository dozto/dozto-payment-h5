import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { orderRepository, liveQueryToStore } from '$db/index.js';
import { alertActions } from './alert.store.js';
import type { Order } from '$types/payments.js';

export const ordersStore = browser
	? liveQueryToStore(
			() => orderRepository.getAll(),
			(err) =>
				alertActions.error(`本地数据查询异常: ${err.message}`, {
					title: '数据错误',
					dismissAfterMs: 10000
				})
		)
	: readable<Order[] | undefined>(undefined);
