import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordItem from '@/components/business/RecordItem';
import { useCategoryMap } from '@/stores/useCategoryStore';
import { toYuan } from '@/utils/amount';
import { friendlyDate } from '@/utils/date';
import type { RecordItem as RecordItemType } from '@/types/record';

interface RecordListProps {
  records: RecordItemType[];
  showEmpty?: boolean;
  emptyEmoji?: string;
  emptyText?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
}

interface DayGroup {
  date: string;
  income: number;
  expense: number;
  records: RecordItemType[];
}

export default function RecordList({
  records,
  showEmpty = false,
  emptyEmoji = '🐱',
  emptyText = '还没有记录哦~',
  emptyActionText,
  onEmptyAction
}: RecordListProps) {
  const navigate = useNavigate();
  const categoryMap = useCategoryMap();

  const groups = useMemo<DayGroup[]>(() => {
    const map = new Map<string, DayGroup>();
    for (const r of records) {
      let group = map.get(r.date);
      if (!group) {
        group = { date: r.date, income: 0, expense: 0, records: [] };
        map.set(r.date, group);
      }
      if (r.type === 'income') group.income += r.amount;
      else group.expense += r.amount;
      group.records.push(r);
    }
    return Array.from(map.values());
  }, [records]);

  if (records.length === 0 && !showEmpty) return null;

  return (
    <div>
      {records.length === 0 && showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[56px] leading-none mb-4">{emptyEmoji}</div>
          <div className="text-lg font-semibold text-ink mb-6">{emptyText}</div>
          {emptyActionText && onEmptyAction && (
            <button
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium shadow-fab btn-press"
              onClick={onEmptyAction}
            >
              {emptyActionText}
            </button>
          )}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-xs text-ink-tertiary">{friendlyDate(group.date)}</span>
            <span className="text-xs text-ink-tertiary">
              收 {toYuan(group.income)}  支 {toYuan(group.expense)}
            </span>
          </div>
          <div className="bg-card rounded-lg mx-4 overflow-hidden shadow-card divide-y divide-divider">
            {group.records.map((r) => {
              const cat = categoryMap.get(r.categoryId);
              return (
                <RecordItem
                  key={r.id}
                  id={r.id}
                  categoryId={r.categoryId}
                  categoryName={cat?.name ?? '未分类'}
                  icon={cat?.icon ?? '🔧'}
                  type={r.type}
                  amount={r.amount}
                  note={r.note}
                  onSelect={(id) => navigate(`/detail/${id}`)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}