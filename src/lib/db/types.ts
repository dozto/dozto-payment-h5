export interface Order {
	id: string;
	orgId: string;
	provider: string;
	method: string;
	channel: string | null;
	currency: string;
	amountCent: number;
	chargedAmountCent: number;
	refundedAmountCent: number;
	releasedAmountCent: number;
	bizRefId: string | null;
	bizMeta: unknown;
	prvRefId: string | null;
	transactions?: Transaction[];
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface Transaction {
	id: string;
	orderId: string;
	type: string;
	amountCent: number;
	bizTransId: string | null;
	bizDesc: string | null;
	prvTransId: string | null;
	extParams: unknown;
	status: string;
	lastError: unknown;
	expiresInSec: number | null;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
}
