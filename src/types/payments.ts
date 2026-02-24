export enum Providers {
	WECHATPAY = 'WECHATPAY', // 微信支付
	ALIPAY = 'ALIPAY' // 支付宝支付
}

export enum ChargeChannels {
	WEB_PC = 'PC_WEB', // 网页PC
	WEB_H5 = 'WEB_H5', // 手机网页
	SDK_IOS = 'SDK_IOS', // 手机APP IOS SDK
	SDK_ANDROID = 'SDK_ANDROID', // 手机APP Android SDK
	MP_WECHAT = 'MP_WECHAT', // 微信小程序
	MP_WECHAT_H5 = 'MP_WECHAT_H5', // 微信小程序手机网页
	MP_ALIPAY = 'MP_ALIPAY', // 支付宝小程序
	MP_ALIPAY_H5 = 'MP_ALIPAY_H5', // 支付宝小程手机入网页
	CODE_CHARGE = 'CODE_CHARGE' // 二维码收款
}

// Each Word first char combine should be unique for ID generation
export enum ChargeMethods {
	DIRECT_PAY = 'DIRECT_PAY', // 直接支付
	PRE_AUTH = 'PRE_AUTH', // 预授权
	SCAN_PAY_CODE = 'SCAN_PAY_CODE' // 扫付款码扣款
}

export enum CurrencyType {
	CNY = 'CNY'
}

export enum OrderTransactionStatus {
	AWAITING = 'AWAITING', // 等待用户操作
	AUTHORIZED = 'AUTHORIZED', // 授权成功
	RELEASED = 'RELEASED', // 解冻成功
	CHARGED = 'CHARGED', // 扣款成功
	REFUNDED = 'REFUNDED', // 退款成功
	ERROR = 'ERROR' // 交易异常
}

export enum OrderStatus {
	PENDING = 'PENDING', // 等待完成支付平台操作
	OPEN = 'OPEN', // 已经可以进行付款/扣款
	CLOSED = 'CLOSED', // 平台订单已关闭
	ERROR = 'ERROR' // 订单异常
}

export enum TransactionType {
	AUTHORIZE = 'AUTHORIZE', // 身份授权
	RELEASE = 'RELEASE', // 解冻
	CHARGE = 'CHARGE', // 扣款
	REFUND = 'REFUND' // 退款
}

export enum TransactionStatus {
	AWAITING = 'AWAITING', // 等待用户操作
	PROCESSING = 'PROCESSING', // 平台处理中
	SUCCESS = 'SUCCESS', // 交易成功
	FAILED = 'FAILED' // 交易失败
}

export interface Order {
	id: string;
	orgId: string;
	provider: Providers;
	method: ChargeMethods;
	channel: ChargeChannels;
	currency: CurrencyType;
	amountCent: number;
	chargedAmountCent: number;
	refundedAmountCent: number;
	releasedAmountCent: number;
	bizRefId: string | null;
	bizMeta: Record<string, unknown> | null;
	prvRefId: string | null;
	transactions?: Transaction[];
	transStatus: OrderTransactionStatus;
	status: OrderStatus;
	lastError: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
}

export interface Transaction {
	id: string;
	orderId: string;
	type: TransactionType;
	amountCent: number;
	bizTransId: string | null;
	bizDesc: string | null;
	prvTransId: string | null;
	extParams: Record<string, unknown> | null;
	status: TransactionStatus;
	lastError: Record<string, unknown> | null;
	expiresInSec: number | null;
	completedAt: Date | null;
	createdAt: string;
	updatedAt: string;
}
