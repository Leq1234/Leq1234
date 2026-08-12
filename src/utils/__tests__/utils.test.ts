import { describe, expect, it } from 'vitest';
import { formatCompact, formatCurrency, formatMoney, toFen, toYuan } from '@/utils/amount';
import { currentMonth, daysInMonth, shiftMonth } from '@/utils/date';

describe('amount utils', () => {
  it('toFen 元转分', () => {
    expect(toFen(12.5)).toBe(1250);
    expect(toFen(0.1)).toBe(10);
    expect(toFen(0)).toBe(0);
  });

  it('toYuan 分转元', () => {
    expect(toYuan(1250)).toBe('12.50');
    expect(toYuan(0)).toBe('0.00');
  });

  it('formatMoney 千分位', () => {
    expect(formatMoney(123456789)).toBe('1,234,567.89');
    expect(formatMoney(99)).toBe('0.99');
  });

  it('formatCurrency 带货币符号', () => {
    expect(formatCurrency(1234)).toBe('¥12.34');
  });

  it('formatCompact 简化金额', () => {
    expect(formatCompact(1220)).toBe('12.2');
    expect(formatCompact(123)).toBe('1.23');
  });
});

describe('date utils', () => {
  it('shiftMonth 月份偏移', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
  });

  it('daysInMonth 返回当月全部日期', () => {
    const days = daysInMonth('2026-02');
    expect(days).toHaveLength(28);
    expect(days[0]).toBe('2026-02-01');
    expect(days[27]).toBe('2026-02-28');
  });

  it('currentMonth 格式为 YYYY-MM', () => {
    expect(currentMonth()).toMatch(/^\d{4}-\d{2}$/);
  });
});