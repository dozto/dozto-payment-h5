import { z } from 'zod';
import type { Order } from '$types/payments.js';
import { PAYMENTS_PAGE_LIMIT } from '$config/api.config.js';

export interface PageInfo {
	limit?: number;
	offset?: number;
	totalCount?: number;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
}

export interface GetPaymentsResponse {
	pageInfo: PageInfo;
	orders: Order[];
}

const PageInfoSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	totalCount: z.number().optional(),
	hasNextPage: z.boolean().optional(),
	hasPreviousPage: z.boolean().optional()
});

export const TransactionSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	type: z.string(),
	amountCent: z.number(),
	bizTransId: z.string().nullable().optional(),
	bizDesc: z.string().nullable().optional(),
	prvTransId: z.string().nullable().optional(),
	extParams: z.record(z.string(), z.unknown()).nullable().optional(),
	status: z.string(),
	lastError: z.record(z.string(), z.unknown()).nullable().optional(),
	expiresInSec: z.number().nullable().optional(),
	completedAt: z.union([z.string(), z.date()]).nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export const OrderSchema = z.object({
	id: z.string(),
	orgId: z.string(),
	provider: z.string(),
	method: z.string(),
	channel: z.string(),
	currency: z.string(),
	amountCent: z.number(),
	chargedAmountCent: z.number(),
	refundedAmountCent: z.number(),
	releasedAmountCent: z.number(),
	bizRefId: z.string().nullable().optional(),
	bizMeta: z.record(z.string(), z.unknown()).nullable().optional(),
	prvRefId: z.string().nullable().optional(),
	transactions: z.array(TransactionSchema).optional(),
	transStatus: z.string(),
	status: z.string(),
	lastError: z.record(z.string(), z.unknown()).nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

const GetPaymentsResponseSchema = z.object({
	pageInfo: PageInfoSchema,
	orders: z.array(OrderSchema)
});

function resolveFetch(fetchFn?: typeof fetch): typeof fetch {
	const f =
		fetchFn ??
		(typeof globalThis !== 'undefined' && 'fetch' in globalThis ? globalThis.fetch : undefined);
	if (!f) throw new Error('getPayments: fetch not available');
	return f as typeof fetch;
}

export async function getPayments(
	baseUrl: string,
	query?: Record<string, string | number>,
	fetchFn?: typeof fetch
): Promise<GetPaymentsResponse> {
	const request = resolveFetch(fetchFn);
	const url = new URL('/payments', baseUrl.replace(/\/$/, ''));

	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
		}
	}

	const res = await request(url.toString());
	if (!res.ok) {
		throw new Error(`GET ${url.toString()} failed: ${res.status} ${res.statusText}`);
	}

	const raw = await res.json();
	const parsed = GetPaymentsResponseSchema.safeParse(raw);
	if (!parsed.success) {
		throw new Error(`Payments API response validation failed: ${parsed.error.message}`, {
			cause: parsed.error
		});
	}
	return parsed.data as GetPaymentsResponse;
}

export async function getAllPayments(baseUrl: string, fetchFn?: typeof fetch): Promise<unknown[]> {
	const all: unknown[] = [];
	let offset = 0;
	let hasNextPage = true;
	while (hasNextPage) {
		const res = await getPayments(baseUrl, { limit: PAYMENTS_PAGE_LIMIT, offset }, fetchFn);
		all.push(...res.orders);
		hasNextPage = res.pageInfo.hasNextPage === true;
		offset += PAYMENTS_PAGE_LIMIT;
	}
	return all;
}
