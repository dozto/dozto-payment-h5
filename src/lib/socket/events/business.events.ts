import type { OrderStatusChangedIOEvent } from '$types/event.js';
import { alertActions } from '$store/alert.store.js';
import { syncPaymentsFromAPI } from '$service/order-sync.service.js';
import { off, on } from '../managers/connection.js';

export function bindBusinessEvents(options?: {
	syncBaseUrl?: string;
	fetch?: typeof fetch;
}): () => void {
	const handler = (...args: unknown[]) => {
		const data = args[0] as OrderStatusChangedIOEvent;

		// 触发业务数据同步
		syncPaymentsFromAPI({
			baseUrl: options?.syncBaseUrl,
			fetch: options?.fetch
		}).catch((err) =>
			alertActions.error(`订单数据同步失败: ${(err as Error).message}`, { title: '同步失败' })
		);

		// 触发全局通知
		alertActions.success(`交易状态已变更为 ${data.transactionStatus}`, {
			title: data.orderId,
			dismissAfterMs: 15000
		});
	};

	on('OrderStatusChangedIOEvent', handler);
	return () => off('OrderStatusChangedIOEvent', handler);
}
