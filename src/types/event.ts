import type { TransactionStatus } from './payments';

export enum CallbackTypes {
	PA_AUTHORIZED = 'PA_AUTHORIZED', // 预授权冻结
	PA_RELEASED = 'PA_RELEASED', // 预授权解冻
	PA_CHARGED = 'PA_CHARGED', // 预授权扣款
	PA_REFUNDED = 'PA_REFUNDED', // 预授权退款
	DP_CHARGED = 'DP_CHARGED' // 直接支付扣款
}

export interface OrderStatusChangedIOEvent {
	orderId: string;
	transactionId: string;
	type: CallbackTypes;
	transactionStatus: TransactionStatus;
	timestamp: string;
}
