import { browser } from '$app/environment';
import { syncPaymentsFromAPI } from '$service/order-sync.service.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	if (!browser) {
		return {
			syncError: false,
			syncMessage: undefined
		};
	}

	try {
		await syncPaymentsFromAPI();
		return {
			syncError: false,
			syncMessage: undefined
		};
	} catch (err) {
		return {
			syncError: true,
			syncMessage: err instanceof Error ? err.message : '同步失败'
		};
	}
};
