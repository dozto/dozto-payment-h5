import { OrderTransactionStatus } from '$types/payments.js';

/** 交易状态标签与筛选项 */
export const TRANS_STATUS_LABELS: Record<string, string> = {
	[OrderTransactionStatus.AWAITING]: '待支付',
	[OrderTransactionStatus.AUTHORIZED]: '已授权',
	[OrderTransactionStatus.RELEASED]: '已释放',
	[OrderTransactionStatus.CHARGED]: '已扣款',
	[OrderTransactionStatus.REFUNDED]: '已退款',
	[OrderTransactionStatus.ERROR]: '异常'
};

export const ORDER_TRANS_STATUS_FILTER_OPTIONS = [
	{ value: '', label: '全部' },
	{ value: OrderTransactionStatus.AWAITING, label: '待支付' },
	{ value: OrderTransactionStatus.AUTHORIZED, label: '已授权' },
	{ value: OrderTransactionStatus.CHARGED, label: '已扣款' },
	{ value: OrderTransactionStatus.REFUNDED, label: '已退款' },
	{ value: OrderTransactionStatus.ERROR, label: '异常' }
];

/** data-table 列标题配置，统一在此管理 */
export const ORDER_TABLE_COLUMN_HEADERS = {
	id: '订单号',
	bizRefId: '业务单号',
	provider: '支付渠道',
	method: '支付方式',
	amount: '金额',
	chargedAmount: '已扣款',
	refundedAmount: '已退款',
	transStatus: '交易状态',
	createdAt: '创建时间'
} as const;

/** data-table 其他文案配置 */
export const ORDER_TABLE_TEXT = {
	transStatusLabel: '交易状态',
	columnsLabel: '显示列'
} as const;

export const PROVIDER_LABELS: Record<string, string> = {
	WECHATPAY: '微信支付',
	ALIPAY: '支付宝'
};

export const METHOD_LABELS: Record<string, string> = {
	PRE_AUTH: '预授权',
	DIRECT_PAY: '直接付款',
	SCAN_PAY_CODE: '扫码支付'
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
