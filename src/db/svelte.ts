import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { liveQuery } from 'dexie';
import { getDb } from './db.js';
import type { Readable } from 'svelte/store';
import { alertActions } from '$store/alert.store.js';

export async function initDb(): Promise<void> {
	if (!browser) return;
	await getDb().open();
	console.log('[db] initialized.');
}

export function liveQueryToStore<T>(querier: () => Promise<T> | T): Readable<T | undefined> {
	const observable = liveQuery(querier);
	return readable<T | undefined>(undefined, (set) => {
		const sub = observable.subscribe({
			next: set,
			error: (err) => {
				console.error('[db] liveQuery error', err);
				const message = err instanceof Error ? err.message : String(err);
				alertActions.error(`本地数据查询异常: ${message}`, {
					title: '数据错误',
					dismissAfterMs: 10000
				});
			}
		});
		return () => sub.unsubscribe();
	});
}
