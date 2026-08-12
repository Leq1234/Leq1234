/** 元 → 分 */
export const toFen = (yuan: number): number => Math.round(yuan * 100);

/** 分 → 元（字符串，两位小数） */
export const toYuan = (fen: number): string => (fen / 100).toFixed(2);

/** 分 → 带千分位的人民币字符串 */
export function formatMoney(fen: number): string {
  const yuan = toYuan(fen);
  const [int, dec] = yuan.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${grouped}.${dec}`;
}

/** 分 → 带货币符号字符串（¥1,234.00） */
export function formatCurrency(fen: number): string {
  return `¥${formatMoney(fen)}`;
}

/** 分 → 金额字符串 + 正负号 */
export function formatSigned(fen: number, income: boolean): string {
  const sign = fen === 0 ? '' : income ? '+' : '-';
  return `${sign}¥${formatMoney(Math.abs(fen))}`;
}

/** 分 → 简化金额（去掉多余的尾零，如 1220 → "12.2"，123 → "1.23"） */
export function formatCompact(fen: number): string {
  const yuan = fen / 100;
  if (Number.isInteger(yuan)) return String(yuan);
  return yuan.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}