import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { liveQuery } from 'dexie';
import { getDb } from './db.js';
import type { Readable } from 'svelte/store';

export async function initDb(): Promise<void> {
	if (!browser) return;
	await getDb().open();
}

export function liveQueryToStore<T>(
	querier: () => Promise<T> | T,
	onError?: (err: Error) => void
): Readable<T | undefined> {
	const observable = liveQuery(querier);
	return readable<T | undefined>(undefined, (set) => {
		const sub = observable.subscribe({
			next: set,
			error: (err) => {
				onError?.(err instanceof Error ? err : new Error(String(err)));
			}
		});
		return () => sub.unsubscribe();
	});
}
