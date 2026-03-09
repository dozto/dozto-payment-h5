import { browser } from '$app/environment';

import { bootstrapDb, disposeDb } from '$lib/db/bootstrap.js';
import { initSocket } from '$socket';
import { alertActions } from '$store/alert.store.js';

let dispose: (() => void) | null = null;

export function startAppServices() {
	if (!browser || dispose) return;

	let stopSocket = () => {};
	bootstrapDb().catch((err) => {
		alertActions.error(`数据库初始化失败: ${(err as Error).message}`, { title: '初始化失败' });
	});

	try {
		stopSocket = initSocket();
	} catch (err) {
		alertActions.error(`Socket 初始化失败: ${(err as Error).message}`, { title: '初始化失败' });
	}

	dispose = () => {
		stopSocket();
		disposeDb().catch((err) => {
			alertActions.error(`数据库关闭失败: ${(err as Error).message}`, { title: '系统警告' });
		});
		dispose = null;
	};
}

export function stopAppServices() {
	dispose?.();
	dispose = null;
}
