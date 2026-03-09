import { browser } from '$app/environment';

import { closeDb, initDb } from './index.js';

let initialized = false;

export async function bootstrapDb(): Promise<void> {
	if (!browser || initialized) return;
	initialized = true;
	try {
		await initDb();
	} catch (err) {
		initialized = false;
		throw err;
	}
}

export async function disposeDb(): Promise<void> {
	if (!browser || !initialized) return;
	initialized = false;
	await closeDb();
}
