import { getDb } from '../db.js';
import type { Order } from '$types/payments.js';

const ordersTable = () => getDb().orders;

export async function get(id: string): Promise<Order | undefined> {
	return ordersTable().get(id);
}

export async function put(order: Order): Promise<void> {
	await ordersTable().put(order);
}

export async function bulkPut(orders: Order[]): Promise<void> {
	await ordersTable().bulkPut(orders);
}

export async function add(order: Order): Promise<void> {
	await ordersTable().add(order);
}

export async function update(id: string, updates: Partial<Omit<Order, 'id'>>): Promise<void> {
	await ordersTable().update(id, updates);
}

export async function remove(id: string): Promise<void> {
	await ordersTable().delete(id);
}

export async function clear(): Promise<void> {
	await ordersTable().clear();
}

export async function getAll(): Promise<Order[]> {
	return ordersTable().toArray();
}

export async function getByOrgId(orgId: string): Promise<Order[]> {
	return ordersTable().where('orgId').equals(orgId).toArray();
}
