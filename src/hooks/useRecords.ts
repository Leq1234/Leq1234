import { useEffect, useMemo } from 'react';
import { useBookStore } from '@/stores/useBookStore';
import { useRecordStore } from '@/stores/useRecordStore';
import type { RecordItem } from '@/types/record';

export function useRecords(bookId?: string): RecordItem[] {
  const all = useRecordStore((s) => s.records);
  const loaded = useRecordStore((s) => s.loaded);
  const load = useRecordStore((s) => s.load);
  const activeBookId = useBookStore((s) => s.activeBookId);

  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);

  const target = bookId ?? activeBookId;
  return useMemo(() => {
    if (!target) return [];
    return all
      .filter((r) => r.bookId === target)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [all, target]);
}