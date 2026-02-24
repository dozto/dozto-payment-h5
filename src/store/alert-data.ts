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

/** 数据结构与 store（无持久化，初始为空列表） */
export const alertStore = writable<AlertItem[]>([]);

export const hasAlerts = derived(alertStore, (list) => list.length > 0);
export const alertCount = derived(alertStore, (list) => list.length);
