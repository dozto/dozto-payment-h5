import { env } from '$env/dynamic/public';
import { alertService } from '$lib/alert';
import { connect, on } from './handlers.js';
import type { OrderStatusChangedIOEvent } from './types.js';

const DEFAULT_SOCKET_URL = 'http://localhost:3001';
const DEFAULT_ORG_ID = 'test-org-nWJB993R';

export function initSocket(): void {
	if (typeof window === 'undefined') return;

	const socketUrl = env.PUBLIC_PAYMENTS_SOCKET_URL ?? DEFAULT_SOCKET_URL;
	connect(socketUrl, DEFAULT_ORG_ID);

	on('connect', () => {
		alertService.success('服务通知已成功连接', { title: '连接成功', dismissAfterMs: 3000 });
	});

	on('OrderStatusChangedIOEvent', (...args: unknown[]) => {
		const data = args[0] as OrderStatusChangedIOEvent;
		console.log('OrderStatusChangedIOEvent', data);

		alertService.success(`订单状态已变更为 ${data.status}`, {
			title: data.orderId,
			dismissAfterMs: 15000
		});
	});
}
