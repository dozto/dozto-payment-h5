import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

/** 周一 0:00 为当周起点（ISO 周） */
export function startOfWeek(d: Date): Date {
	return dayjs(d).startOf('isoWeek').toDate();
}

export function startOfDay(d: Date): Date {
	return dayjs(d).startOf('day').toDate();
}

export function endOfDay(d: Date): Date {
	return dayjs(d).endOf('day').toDate();
}

/** 本月 1 号 0:00 */
export function startOfMonth(d: Date): Date {
	return dayjs(d).startOf('month').toDate();
}

/** 上月同一时刻（用于「同比上月」的上期结束点） */
export function sameTimeLastMonth(d: Date): Date {
	return dayjs(d).subtract(1, 'month').toDate();
}
