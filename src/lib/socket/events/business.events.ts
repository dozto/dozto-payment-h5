import type { OrderStatusChangedIOEvent } from '$types/event.js';
import { alertActions } from '$store/alert.store.js';
import { syncPaymentsFromAPI } from '$service/order-sync.service.js';
import { on } from '../managers/connection.js';

export function bindBusinessEvents(options?: { syncBaseUrl?: string; fetch?: typeof fetch }): void {
	on('OrderStatusChangedIOEvent', (...args: unknown[]) => {
		const data = args[0] as OrderStatusChangedIOEvent;
		console.log('OrderStatusChangedIOEvent', data);

		// 触发业务数据同步
		syncPaymentsFromAPI({
			baseUrl: options?.syncBaseUrl,
			fetch: options?.fetch
		}).catch((err) => console.error('syncPaymentsFromAPI failed', err));

		// 触发全局通知
		alertActions.success(`交易状态已变更为 ${data.transactionStatus}`, {
			title: data.orderId,
			dismissAfterMs: 15000
		});
	});
}
