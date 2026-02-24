import { env } from '$env/dynamic/public';
import { syncPaymentsFromAPI } from '$service/order-sync.service.js';
import { alertActions } from '$store/alert.store.js';
import { connect, on } from './handlers.js';
import type { OrderStatusChangedIOEvent } from '$types/event.js';
import { getOrgId } from '$config/demo.config.js';

export function initSocket(): void {
	if (typeof window === 'undefined') return;

	const socketUrl = env.PUBLIC_PAYMENTS_SOCKET_URL;
	if (!socketUrl) {
		throw new Error('PUBLIC_PAYMENTS_SOCKET_URL is required');
	}
	connect(socketUrl, getOrgId());

	on('connect', () => {
		alertActions.success('服务通知已成功连接', { title: '连接成功', dismissAfterMs: 3000 });
	});

	on('connect_error', (err: unknown) => {
		const message = err instanceof Error ? err.message : '未知错误';
		alertActions.error(`服务通知连接失败: ${message}`, {
			title: '连接失败',
			dismissAfterMs: 10000
		});
	});

	on('OrderStatusChangedIOEvent', (...args: unknown[]) => {
		const data = args[0] as OrderStatusChangedIOEvent;
		console.log('OrderStatusChangedIOEvent', data);

		syncPaymentsFromAPI({
			baseUrl: env.PUBLIC_PAYMENTS_API_URL,
			fetch: window.fetch.bind(window)
		}).catch((err) => console.error('syncPaymentsFromAPI failed', err));

		alertActions.success(`交易状态已变更为 ${data.transactionStatus}`, {
			title: data.orderId,
			dismissAfterMs: 15000
		});
	});
}
