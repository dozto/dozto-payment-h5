import { OrderTransactionStatus } from '$types/payments.js';

export const TRANS_STATUS_LABELS: Record<string, string> = {
	[OrderTransactionStatus.AWAITING]: '待支付',
	[OrderTransactionStatus.AUTHORIZED]: '已授权',
	[OrderTransactionStatus.RELEASED]: '已释放',
	[OrderTransactionStatus.CHARGED]: '已扣款',
	[OrderTransactionStatus.REFUNDED]: '已退款',
	[OrderTransactionStatus.ERROR]: '异常'
};

export const ORDER_TRANS_STATUS_FILTER_OPTIONS = [
	{ value: '', label: 'ALL' },
	{ value: OrderTransactionStatus.AWAITING, label: 'AWAITING' },
	{ value: OrderTransactionStatus.AUTHORIZED, label: 'AUTHORIZED' },
	{ value: OrderTransactionStatus.RELEASED, label: 'RELEASED' },
	{ value: OrderTransactionStatus.CHARGED, label: 'CHARGED' },
	{ value: OrderTransactionStatus.REFUNDED, label: 'REFUNDED' },
	{ value: OrderTransactionStatus.ERROR, label: 'ERROR' }
];

export const PROVIDER_LABELS: Record<string, string> = {
	WECHATPAY: 'WeChat',
	ALIPAY: 'Alipay'
};

export const METHOD_LABELS: Record<string, string> = {
	PRE_AUTH: 'PreAuth',
	DIRECT_PAY: 'DirectPay',
	SCAN_PAY_CODE: 'ScanCode'
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const CURRENCY_SYMBOLS: Record<string, string> = {
	// USD: '$',
	CNY: '¥'
	// EUR: '€',
	// GBP: '£',
	// JPY: '¥',
	// KRW: '₩',
	// INR: '₹',
	// PHP: '₱',
	// MXN: '₱',
	// NZD: '$'
};
