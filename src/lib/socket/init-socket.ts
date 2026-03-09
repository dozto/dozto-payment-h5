import { env } from '$env/dynamic/public';
import { connect, on } from './managers/connection.js';
import { getOrgId } from '$config/app/demo.config.js';
import { bindBusinessEvents } from './events/business.events.js';
import { alertActions } from '$store/alert.store.js';

export interface SocketCallbacks {
	onConnected?: () => void;
	onConnectionError?: (err: unknown) => void;
}

export function initSocket(callbacks?: SocketCallbacks): void {
	if (typeof window === 'undefined') return;

	const socketUrl = env.PUBLIC_PAYMENTS_SOCKET_URL;
	if (!socketUrl) {
		throw new Error('PUBLIC_PAYMENTS_SOCKET_URL is required');
	}
	connect(socketUrl, getOrgId());

	on('connect', () => {
		alertActions.success('服务通知已成功连接', { title: '连接成功', dismissAfterMs: 3000 });
		callbacks?.onConnected?.();
	});

	on('connect_error', (err: unknown) => {
		const message = err instanceof Error ? err.message : '未知错误';
		alertActions.error(`服务通知连接失败: ${message}`, {
			title: '连接失败',
			dismissAfterMs: 10000
		});
		callbacks?.onConnectionError?.(err);
	});

	// 绑定业务事件
	bindBusinessEvents({
		syncBaseUrl: env.PUBLIC_PAYMENTS_API_URL,
		fetch: window.fetch.bind(window)
	});
}
