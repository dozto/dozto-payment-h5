export enum OrderStatus {
	PENDING = 'PENDING', // 等待完成支付平台操作
	OPEN = 'OPEN', // 已经可以进行付款/扣款
	CLOSED = 'CLOSED', // 平台订单已关闭
	ERROR = 'ERROR' // 订单异常
}

export interface OrderStatusChangedIOEvent {
	orderId: string;
	status: OrderStatus;
	timestamp: string;
}
