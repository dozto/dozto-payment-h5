import { writable } from 'svelte/store';

export type AlertVariant = 'default' | 'destructive';

export interface AlertItem {
	id: string;
	title?: string;
	description: string;
	variant?: AlertVariant;
	dismissAfterMs?: number;
}

function createAlertStore() {
	const { subscribe, update } = writable<AlertItem[]>([]);

	function show(options: Omit<AlertItem, 'id'> & { id?: string }) {
		const id = options.id ?? `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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

	function dismiss(id: string) {
		update((list) => list.filter((a) => a.id !== id));
	}

	function dismissAll() {
		update(() => []);
	}

	return { subscribe, show, dismiss, dismissAll };
}

export const alertStore = createAlertStore();
