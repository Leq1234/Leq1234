import dayjs, { type Dayjs } from 'dayjs';

export const todayStr = (): string => dayjs().format('YYYY-MM-DD');

export const currentMonth = (): string => dayjs().format('YYYY-MM');

export const formatDay = (d: string | Date | Dayjs): string => dayjs(d).format('YYYY-MM-DD');

export const shiftMonth = (month: string, offset: number): string =>
  dayjs(`${month}-01`).add(offset, 'month').format('YYYY-MM');

export const monthLabel = (month: string): string => {
  const d = dayjs(`${month}-01`);
  return `${d.format('YYYY年')}${d.format('M月')}`;
};

/** 月份内所有日期 YYYY-MM-DD */
export const daysInMonth = (month: string): string[] => {
  const year = Number(month.slice(0, 4));
  const mon = Number(month.slice(5, 7));
  const count = new Date(year, mon, 0).getDate();
  return Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
};

/** 当天 / 昨天 / 周几 的友好日期文案 */
export const friendlyDate = (date: string): string => {
  const d = dayjs(date);
  if (d.isSame(dayjs(), 'day')) return '今天';
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return '昨天';
  return d.format('MM月DD日 ddd');
};

export const weekdayLabel = (date: string): string => dayjs(date).format('ddd');