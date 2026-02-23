export interface PageInfo {
	limit: number;
	offset: number;
	total?: number;
}

export interface GetPaymentsResponse {
	pageInfo: PageInfo;
	orders: unknown[];
}

export async function getPayments(
	baseUrl: string,
	query?: Record<string, string>,
	fetchFn?: typeof fetch
): Promise<GetPaymentsResponse> {
	const f =
		fetchFn ??
		(typeof globalThis !== 'undefined' && 'fetch' in globalThis ? globalThis.fetch : undefined);
	if (!f) throw new Error('getPayments: fetch not available');
	const url = new URL('/payments', baseUrl.replace(/\/$/, ''));
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== '') url.searchParams.set(k, v);
		}
	}
	const res = await f(url.toString());
	if (!res.ok) {
		throw new Error(`GET /payments failed: ${res.status} ${res.statusText}`);
	}

	return res.json() as Promise<GetPaymentsResponse>;
}
