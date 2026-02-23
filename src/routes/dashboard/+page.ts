import { syncPaymentsFromApi } from '$lib/dashboard/payments-data';

export async function load({ fetch }) {
	await syncPaymentsFromApi({ fetch });
	return {};
}
