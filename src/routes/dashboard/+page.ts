import { syncPaymentsFromAPI } from '$service/order-sync.service.js';

export async function load({ fetch }) {
	try {
		await syncPaymentsFromAPI({ fetch });
		return { syncError: false };
	} catch (err) {
		console.error('[dashboard] syncPaymentsFromAPI failed', err);
		return { syncError: true };
	}
}
