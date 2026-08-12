import { useEffect, useMemo } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useRecordStore } from '@/stores/useRecordStore';
import { computeMonthStats } from '@/services/statsService';
import type { MonthStats } from '@/types/stats';
import { useRecords } from '@/hooks/useRecords';

const EMPTY: MonthStats = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  dailyTrend: [],
  distribution: [],
  ranking: []
};

export function useStats(month: string): MonthStats {
  const records = useRecords();
  const categories = useCategoryStore((s) => s.categories);
  const categoriesLoaded = useCategoryStore((s) => s.loaded);
  const loadCategories = useCategoryStore((s) => s.load);
  const recordsLoaded = useRecordStore((s) => s.loaded);

  useEffect(() => {
    if (!categoriesLoaded) void loadCategories();
  }, [categoriesLoaded, loadCategories]);

  return useMemo(() => {
    if (!recordsLoaded || records.length === 0) return EMPTY;
    return computeMonthStats(records, month, categories);
  }, [records, month, categories, recordsLoaded]);
}