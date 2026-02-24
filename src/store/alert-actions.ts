import type { AlertItem } from './alert-data.js';
import { alertStore } from './alert-data.js';

/** 展示与生命周期逻辑：展示条、自动关闭、快捷方法 */
export const alertActions = {
	show(options: Omit<AlertItem, 'id'> & { id?: string }): string {
		const id = options.id ?? `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		const item: AlertItem = {
			id,
			title: options.title,
			description: options.description,
			variant: options.variant ?? 'default',
			dismissAfterMs: options.dismissAfterMs
		};
		alertStore.update((list) => [...list, item]);
		if (typeof item.dismissAfterMs === 'number' && item.dismissAfterMs > 0) {
			setTimeout(() => alertActions.dismiss(id), item.dismissAfterMs);
		}
		return id;
	},

	dismiss(id: string): void {
		alertStore.update((list) => list.filter((a) => a.id !== id));
	},

	dismissAll(): void {
		alertStore.set([]);
	},

	success(description: string, options?: { title?: string; dismissAfterMs?: number }): string {
		return alertActions.show({
			description,
			variant: 'default',
			title: options?.title,
			dismissAfterMs: options?.dismissAfterMs
		});
	},

	error(description: string, options?: { title?: string; dismissAfterMs?: number }): string {
		return alertActions.show({
			description,
			variant: 'destructive',
			title: options?.title ?? '错误',
			dismissAfterMs: options?.dismissAfterMs
		});
	}
};
