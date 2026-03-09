import { get, derived, type Readable } from 'svelte/store';

import { DEMO_ORG_ID } from '$config/app/demo.config.js';
import { userStore } from '$store/user.store.js';

const normalizeOrgId = (orgId: string | undefined): string => {
	if (orgId && orgId.trim() !== '') return orgId.trim();
	return DEMO_ORG_ID;
};

export const orgIdStore: Readable<string> = derived(userStore, ($user) =>
	normalizeOrgId($user?.orgId)
);

export function getOrgId(): string {
	return get(orgIdStore);
}
