import type { Category } from '@/types/category';
import type { RecordItem } from '@/types/record';
import type { CategoryData, DailyData, MonthStats } from '@/types/stats';
import { daysInMonth } from '@/utils/date';
import { FALLBACK_COLOR, getCategoryColor } from '@/utils/constants';

export function filterByMonth(records: RecordItem[], month: string): RecordItem[] {
  return records.filter((r) => r.date.startsWith(month));
}

export function filterByDate(records: RecordItem[], date: string): RecordItem[] {
  return records.filter((r) => r.date === date);
}

export function sumType(records: RecordItem[], type: RecordItem['type']): number {
  return records.reduce((acc, r) => (r.type === type ? acc + r.amount : acc), 0);
}

export function getDaySummary(
  records: RecordItem[],
  date: string
): { income: number; expense: number } {
  const day = records.filter((r) => r.date === date);
  return { income: sumType(day, 'income'), expense: sumType(day, 'expense') };
}

export function buildDailyTrend(records: RecordItem[], month: string): DailyData[] {
  const map = new Map<string, DailyData>();
  for (const date of daysInMonth(month)) {
    map.set(date, { date, income: 0, expense: 0 });
  }
  for (const r of records) {
    const item = map.get(r.date);
    if (!item) continue;
    if (r.type === 'income') item.income += r.amount;
    else item.expense += r.amount;
  }
  return Array.from(map.values());
}

export function buildDistribution(
  records: RecordItem[],
  month: string,
  type: RecordItem['type'],
  categories: Category[]
): CategoryData[] {
  const monthRecords = filterByMonth(records, month);
  const total = sumType(monthRecords, type);
  const grouped = new Map<string, number>();
  for (const r of monthRecords) {
    if (r.type !== type) continue;
    grouped.set(r.categoryId, (grouped.get(r.categoryId) ?? 0) + r.amount);
  }
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const list: CategoryData[] = Array.from(grouped.entries()).map(([categoryId, amount]) => {
    const cat = categoryMap.get(categoryId);
    return {
      categoryId,
      name: cat?.name ?? '未分类',
      icon: cat?.icon ?? '🔧',
      color: cat ? getCategoryColor(cat.name) : FALLBACK_COLOR,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0
    };
  });
  return list.sort((a, b) => b.amount - a.amount);
}

export function computeMonthStats(
  records: RecordItem[],
  month: string,
  categories: Category[]
): MonthStats {
  const monthRecords = filterByMonth(records, month);
  const totalIncome = sumType(monthRecords, 'income');
  const totalExpense = sumType(monthRecords, 'expense');
  const distribution = buildDistribution(records, month, 'expense', categories);
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    dailyTrend: buildDailyTrend(monthRecords, month),
    distribution,
    ranking: distribution.slice(0, 5)
  };
}

/** 指定账本某月支出总额 */
export function monthExpense(records: RecordItem[], bookId: string, month: string): number {
  return records
    .filter((r) => r.bookId === bookId && r.type === 'expense' && r.date.startsWith(month))
    .reduce((acc, r) => acc + r.amount, 0);
}