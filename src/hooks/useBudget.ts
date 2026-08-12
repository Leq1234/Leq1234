import { useEffect, useMemo } from 'react';
import { useBudgetStore } from '@/stores/useBudgetStore';
import { useBookStore } from '@/stores/useBookStore';
import { computeBudgetProgressOf } from '@/services/budgetService';
import type { BudgetProgress } from '@/types/budget';
import { monthExpense } from '@/services/statsService';
import { useRecords } from '@/hooks/useRecords';

export function useBudget(month: string): {
  budget: ReturnType<typeof useBudgetStore.getState>['budgets'][number] | undefined;
  used: number;
  progress: BudgetProgress | null;
  categoryUsed: (categoryId: string) => number;
} {
  const activeBookId = useBookStore((s) => s.activeBookId);
  const budgets = useBudgetStore((s) => s.budgets);
  const loaded = useBudgetStore((s) => s.loaded);
  const load = useBudgetStore((s) => s.load);
  const records = useRecords(activeBookId);

  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);

  const budget = useMemo(
    () => budgets.find((b) => b.bookId === activeBookId && b.month === month),
    [budgets, activeBookId, month]
  );

  const used = useMemo(() => monthExpense(records, activeBookId, month), [records, activeBookId, month]);

  const progress = useMemo(() => computeBudgetProgressOf(budget, used), [budget, used]);

  const categoryUsed = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      if (r.type !== 'expense' || !r.date.startsWith(month)) continue;
      map.set(r.categoryId, (map.get(r.categoryId) ?? 0) + r.amount);
    }
    return (categoryId: string) => map.get(categoryId) ?? 0;
  }, [records, month]);

  return { budget, used, progress, categoryUsed };
}