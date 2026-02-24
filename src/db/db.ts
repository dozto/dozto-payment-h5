import Dexie, { type Table } from 'dexie';
import { env } from '$env/dynamic/public';
import type { Order, Transaction } from '$types/payments.js';

const DB_NAME = env.PUBLIC_DB_NAME ?? 'dozto-payment-h5';

export class AppDexie extends Dexie {
	orders!: Table<Order, string>;
	transactions!: Table<Transaction, string>;

	constructor(name: string = DB_NAME) {
		super(name);
		this.version(1).stores({
			orders:
				'id, orgId, provider, method, channel, bizRefId, prvRefId, status, [orgId+status+createdAt]'
		});
	}
}

let dbInstance: AppDexie | null = null;

export function getDb(): AppDexie {
	if (!dbInstance) {
		dbInstance = new AppDexie(DB_NAME);
	}
	return dbInstance;
}

export const db = getDb();
