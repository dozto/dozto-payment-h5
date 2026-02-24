import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { orderRepository } from '$db/index.js';
import { liveQueryToStore } from '$db/svelte.js';
import type { Order } from '$types/payments.js';

export const ordersStore = browser
	? liveQueryToStore(() => orderRepository.getAll())
	: readable<Order[] | undefined>(undefined);
