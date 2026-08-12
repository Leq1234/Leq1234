import { useMemo } from 'react';
import { useRecordStore } from '@/stores/useRecordStore';
import { CategoryIcon } from '@/components/ui';
import { toYuan } from '@/utils/amount';

interface RecordItemProps {
  id: string;
  categoryId: string;
  categoryName: string;
  icon: string;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  onSelect: (id: string) => void;
}

export default function RecordItem({
  id,
  categoryId,
  categoryName,
  icon,
  type,
  amount,
  note,
  onSelect
}: RecordItemProps) {
  const records = useRecordStore((s) => s.records);
  const live = useMemo(() => records.find((r) => r.id === id), [records, id]);
  const finalAmount = live?.amount ?? amount;
  const finalType = live?.type ?? type;
  const sign = finalType === 'income' ? '+' : '-';

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 bg-card active:bg-page transition-colors cursor-pointer"
      onClick={() => onSelect(id)}
      role="button"
      aria-label={`${categoryName} ${toYuan(finalAmount)}元`}
    >
      <CategoryIcon icon={icon} name={categoryName} size={36} />
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-ink leading-6">{categoryName}</div>
        {note && (
          <div className="text-xs text-ink-tertiary truncate mt-0.5" title={note}>
            {note}
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div
          className={`text-base font-semibold leading-6 ${
            finalType === 'income' ? 'text-income' : 'text-expense'
          }`}
        >
          {sign}
          {toYuan(finalAmount)}
        </div>
        <div className="text-xs text-ink-tertiary mt-0.5">{finalType === 'income' ? '收入' : '支出'}</div>
      </div>
    </div>
  );
}