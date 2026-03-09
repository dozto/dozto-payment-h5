export const DEMO_ORG_ID = 'dozto-demo';

export function getOrgId(): string {
	// TODO: 从 userStore / token / session 读取当前用户的 orgId
	return DEMO_ORG_ID;
}
