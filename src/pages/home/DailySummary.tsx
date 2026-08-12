import { formatCurrency } from '@/utils/amount';
import { todayStr } from '@/utils/date';

interface DailySummaryProps {
  income: number;
  expense: number;
}

/** 今日收支概览 */
export default function DailySummary({ income, expense }: DailySummaryProps) {
  return (
    <div className="mx-4 mt-3 rounded-lg bg-card p-4 shadow-card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: '#FFE0E0' }}
          aria-hidden="true"
        >
          📅
        </span>
        <div>
          <div className="text-sm font-semibold text-ink">今日支出</div>
          <div className="text-xs text-ink-tertiary mt-0.5">{todayStr()}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-expense">{formatCurrency(expense)}</div>
        <div className="text-xs text-ink-tertiary mt-0.5">收入 {formatCurrency(income)}</div>
      </div>
    </div>
  );
}