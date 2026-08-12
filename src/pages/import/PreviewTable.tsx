import { toYuan } from '@/utils/amount';
import type { ParsedBill } from '@/services/importService';

interface PreviewTableProps {
  items: ParsedBill[];
  categoryOf: (item: ParsedBill) => string;
}

/** 导入预览：表格列出待导入账单 */
export default function PreviewTable({ items, categoryOf }: PreviewTableProps) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 rounded-lg bg-card shadow-card overflow-hidden">
      <div className="px-4 py-3 text-sm font-semibold text-ink border-b border-divider">
        待导入 {items.length} 条
      </div>
      <div className="max-h-[40vh] overflow-y-auto divide-y divide-divider">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-ink truncate">{item.note}</div>
              <div className="text-xs text-ink-tertiary mt-0.5">
                {item.date} · {categoryOf(item)}
              </div>
            </div>
            <span
              className={`text-sm font-semibold shrink-0 ${
                item.type === 'income' ? 'text-income' : 'text-expense'
              }`}
            >
              {item.type === 'income' ? '+' : '-'}
              {toYuan(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}