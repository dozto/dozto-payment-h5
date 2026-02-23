export const STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pending',
	OPEN: 'Open',
	CLOSED: 'Closed',
	ERROR: 'Error'
};

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

export const ORDER_STATUS_FILTER_OPTIONS = [
	{ value: '', label: 'ALL' },
	{ value: 'PENDING', label: 'PENDING' },
	{ value: 'OPEN', label: 'OPEN' },
	{ value: 'CLOSED', label: 'CLOSED' },
	{ value: 'ERROR', label: 'ERROR' }
];

export const CURRENCY_SYMBOLS = {
	USD: '$',
	CNY: '¥',
	EUR: '€',
	GBP: '£',
	JPY: '¥',
	KRW: '₩',
	INR: '₹',
	PHP: '₱',
	MXN: '₱',
	NZD: '$'
};
