import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { orderRepository } from '$db/index.js';
import { normalizeOrder, type PartialOrder } from '$lib/adapters/order-api.adapter.js';
import { getAllPayments } from '$api/payments.js';

export async function syncPaymentsFromAPI(options?: {
	baseUrl?: string;
	fetch?: typeof fetch;
}): Promise<void> {
	if (!browser) return;
	const baseUrl = options?.baseUrl ?? env.PUBLIC_PAYMENTS_API_URL;
	if (!baseUrl) {
		throw new Error('PUBLIC_PAYMENTS_API_URL is required');
	}
	const fetchFn =
		options?.fetch ??
		(typeof globalThis !== 'undefined' && 'fetch' in globalThis ? globalThis.fetch : undefined);
	if (!fetchFn) return;
	const raw = await getAllPayments(baseUrl, fetchFn);
	const normalized = (raw as PartialOrder[]).map(normalizeOrder);
	await orderRepository.clear();
	await orderRepository.bulkPut(normalized);
}
