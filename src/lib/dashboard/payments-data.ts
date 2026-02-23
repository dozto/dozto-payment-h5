import { liveQueryToStore, orderRepository } from '$lib/db';
import { syncPaymentsFromApi } from './sync-payments';

export { syncPaymentsFromApi };

export const ordersStore = liveQueryToStore(() => orderRepository.getAll());
