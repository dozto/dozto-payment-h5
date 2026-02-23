import { browser } from '$app/environment';
import { PUBLIC_PAYMENTS_API_URL } from '$env/static/public';
import { getPayments } from '$lib/api/payments';
import * as orderRepository from '$lib/db/repositories/order.repository';
import type { Order } from '$lib/db/types';

export async function syncPaymentsFromApi(options?: {
	baseUrl?: string;
	fetch?: typeof fetch;
}): Promise<void> {
	if (!browser) return;
	const baseUrl = options?.baseUrl ?? PUBLIC_PAYMENTS_API_URL;
	const fetchFn =
		options?.fetch ??
		(typeof globalThis !== 'undefined' && 'fetch' in globalThis ? globalThis.fetch : undefined);
	if (!fetchFn) return;
	const { orders } = await getPayments(baseUrl, undefined, fetchFn);
	for (const o of orders) {
		const order = o as Partial<Order>;
		const normalized: Order = {
			id: order.id!,
			orgId: order.orgId!,
			provider: order.provider!,
			method: order.method!,
			channel: order.channel ?? null,
			currency: order.currency!,
			amountCent: order.amountCent!,
			chargedAmountCent: order.chargedAmountCent ?? 0,
			refundedAmountCent: order.refundedAmountCent ?? 0,
			releasedAmountCent: order.releasedAmountCent ?? 0,
			bizRefId: order.bizRefId ?? null,
			bizMeta: order.bizMeta,
			prvRefId: order.prvRefId ?? null,
			transactions: order.transactions ?? [],
			status: order.status!,
			createdAt: order.createdAt!,
			updatedAt: order.updatedAt!
		};
		await orderRepository.put(normalized);
	}
}
