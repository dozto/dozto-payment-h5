import type { Order, Transaction } from '$types/payments.js';
import {
	ChargeChannels,
	ChargeMethods,
	CurrencyType,
	OrderStatus,
	OrderTransactionStatus,
	Providers
} from '$types/payments.js';
import { OrderSchema } from '$api/payments.js';
import type { z } from 'zod';

type OrderSchemaOutput = z.infer<typeof OrderSchema>;
type ParsedTransaction = NonNullable<OrderSchemaOutput['transactions']>[number];

export type PartialOrder = Record<string, unknown> & {
	id?: string;
	orgId?: string;
	status?: string;
};

function mapTransactionCompletedAt(t: ParsedTransaction): Date | null {
	const completedAt = t?.completedAt;
	if (completedAt == null) return null;
	return typeof completedAt === 'string' ? new Date(completedAt) : completedAt;
}

export function normalizeOrder(o: PartialOrder): Order {
	const parsed = OrderSchema.safeParse(o);
	if (!parsed.success) {
		throw new Error(
			`order.normalizer: invalid order shape (id=${(o as { id?: string }).id ?? '?'}): ${parsed.error.message}`,
			{ cause: parsed.error }
		);
	}
	const p = parsed.data;
	const transactions: Transaction[] = (p.transactions ?? []).map((t) => ({
		id: t.id,
		orderId: t.orderId,
		type: t.type as Transaction['type'],
		amountCent: t.amountCent,
		bizTransId: t.bizTransId ?? null,
		bizDesc: t.bizDesc ?? null,
		prvTransId: t.prvTransId ?? null,
		extParams: t.extParams ?? null,
		status: t.status as Transaction['status'],
		lastError: t.lastError ?? null,
		expiresInSec: t.expiresInSec ?? null,
		completedAt: mapTransactionCompletedAt(t),
		createdAt: t.createdAt,
		updatedAt: t.updatedAt
	}));
	return {
		id: p.id,
		orgId: p.orgId,
		provider: p.provider as Providers,
		method: p.method as ChargeMethods,
		channel: p.channel as ChargeChannels,
		currency: p.currency as CurrencyType,
		amountCent: p.amountCent,
		chargedAmountCent: p.chargedAmountCent,
		refundedAmountCent: p.refundedAmountCent,
		releasedAmountCent: p.releasedAmountCent,
		bizRefId: p.bizRefId ?? null,
		bizMeta: p.bizMeta ?? null,
		prvRefId: p.prvRefId ?? null,
		transactions,
		transStatus: p.transStatus as OrderTransactionStatus,
		status: p.status as OrderStatus,
		lastError: p.lastError ?? null,
		createdAt: p.createdAt,
		updatedAt: p.updatedAt
	};
}
