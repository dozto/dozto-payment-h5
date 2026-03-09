import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
	name: string;
	email: string;
	orgId?: string;
	avatar?: string;
}

// 从 localStorage 恢复初始值
const getInitialUser = (): User | null => {
	if (!browser) return null;
	const stored = localStorage.getItem('user');
	if (!stored) {
		return {
			name: 'Guest',
			email: 'guest@example.com'
		};
	}

	try {
		return JSON.parse(stored) as User;
	} catch {
		localStorage.removeItem('user');
		return {
			name: 'Guest',
			email: 'guest@example.com'
		};
	}
};

// 创建 store
export const userStore = writable<User | null>(getInitialUser());

// 持久化到 localStorage
if (browser) {
	userStore.subscribe((user) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	});
}

// 派生 store（计算属性）
export const userName = derived(userStore, ($user) => $user?.name ?? 'Guest');
export const userEmail = derived(userStore, ($user) => $user?.email ?? '');
export const isAuthenticated = derived(userStore, ($user) => $user !== null);

// 辅助方法
export const userActions = {
	setUser: (user: User) => userStore.set(user),
	clearUser: () => userStore.set(null),
	updateUser: (updates: Partial<User>) => {
		userStore.update((user) => (user ? { ...user, ...updates } : null));
	}
};
