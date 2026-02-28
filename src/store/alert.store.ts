import { writable, derived } from 'svelte/store';

/** 业务侧 alert 展示类型，与 UI 组件的 variant 取值一致 */
export type AlertItemVariant = 'default' | 'destructive';

export interface AlertItem {
	id: string;
	title?: string;
	description: string;
	variant?: AlertItemVariant;
	dismissAfterMs?: number;
}

const DEFAULT_DISMISS_MS = 5000;

function createAlertStore() {
	const { subscribe, set, update } = writable<AlertItem[]>([]);

	function show(options: Omit<AlertItem, 'id'> & { id?: string }): string {
		const id =
			options.id ?? `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		const item: AlertItem = {
			id,
			title: options.title,
			description: options.description,
			variant: options.variant ?? 'default',
			dismissAfterMs: options.dismissAfterMs
		};
		update((list) => [...list, item]);
		if (typeof item.dismissAfterMs === 'number' && item.dismissAfterMs > 0) {
			setTimeout(() => dismiss(id), item.dismissAfterMs);
		}
		return id;
	}

	function dismiss(id: string): void {
		update((list) => list.filter((a) => a.id !== id));
	}

	function dismissAll(): void {
		set([]);
	}

	function success(
		description: string,
		options?: { title?: string; dismissAfterMs?: number }
	): string {
		return show({
			description,
			variant: 'default',
			title: options?.title,
			dismissAfterMs: options?.dismissAfterMs ?? DEFAULT_DISMISS_MS
		});
	}

	function error(
		description: string,
		options?: { title?: string; dismissAfterMs?: number }
	): string {
		return show({
			description,
			variant: 'destructive',
			title: options?.title ?? '错误',
			dismissAfterMs: options?.dismissAfterMs ?? DEFAULT_DISMISS_MS
		});
	}

	return {
		subscribe,
		show,
		dismiss,
		dismissAll,
		success,
		error
	};
}

const alertStore = createAlertStore();

export { alertStore };

export const hasAlerts = derived(alertStore, (list) => list.length > 0);
export const alertCount = derived(alertStore, (list) => list.length);

export const alertActions = {
	show: alertStore.show,
	dismiss: alertStore.dismiss,
	dismissAll: alertStore.dismissAll,
	success: alertStore.success,
	error: alertStore.error
};
