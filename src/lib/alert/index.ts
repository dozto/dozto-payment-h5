import { alertStore } from './alert-store.js';
import type { AlertItem, AlertVariant } from './alert-store.js';

export { alertStore, type AlertItem, type AlertVariant };
export { default as GlobalAlertStack } from './GlobalAlertStack.svelte';

export const alertService = {
	show(options: Omit<AlertItem, 'id'> & { id?: string }) {
		return alertStore.show(options);
	},
	success(description: string, options?: { title?: string; dismissAfterMs?: number }) {
		return alertStore.show({
			description,
			variant: 'default',
			title: options?.title,
			dismissAfterMs: options?.dismissAfterMs
		});
	},
	error(description: string, options?: { title?: string; dismissAfterMs?: number }) {
		return alertStore.show({
			description,
			variant: 'destructive',
			title: options?.title ?? '错误',
			dismissAfterMs: options?.dismissAfterMs
		});
	}
};
