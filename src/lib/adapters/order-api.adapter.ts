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

export function normalizeOrder(rawOrder: PartialOrder): Order {
	const parsed = OrderSchema.safeParse(rawOrder);
	if (!parsed.success) {
		throw new Error(
			`order.normalizer: invalid order shape (id=${(rawOrder as { id?: string }).id ?? '?'}): ${parsed.error.message}`,
			{ cause: parsed.error }
		);
	}

	const parsedOrder = parsed.data;
	const transactions: Transaction[] = (parsedOrder.transactions ?? []).map((t) => ({
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
		id: parsedOrder.id,
		orgId: parsedOrder.orgId,
		provider: parsedOrder.provider as Providers,
		method: parsedOrder.method as ChargeMethods,
		channel: parsedOrder.channel as ChargeChannels,
		currency: parsedOrder.currency as CurrencyType,
		amountCent: parsedOrder.amountCent,
		chargedAmountCent: parsedOrder.chargedAmountCent,
		refundedAmountCent: parsedOrder.refundedAmountCent,
		releasedAmountCent: parsedOrder.releasedAmountCent,
		bizRefId: parsedOrder.bizRefId ?? null,
		bizMeta: parsedOrder.bizMeta ?? null,
		prvRefId: parsedOrder.prvRefId ?? null,
		transactions,
		transStatus: parsedOrder.transStatus as OrderTransactionStatus,
		status: parsedOrder.status as OrderStatus,
		lastError: parsedOrder.lastError ?? null,
		createdAt: parsedOrder.createdAt,
		updatedAt: parsedOrder.updatedAt
	};
}
