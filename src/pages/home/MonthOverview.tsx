import { formatCurrency } from '@/utils/amount';
import type { MonthStats } from '@/types/stats';
import { monthLabel, shiftMonth } from '@/utils/date';

interface MonthOverviewProps {
  month: string;
  stats: MonthStats;
  onMonthChange: (month: string) => void;
}

/** 月度收支概览卡片（可切换月份） */
export default function MonthOverview({ month, stats, onMonthChange }: MonthOverviewProps) {
  return (
    <div className="mx-4 rounded-lg bg-gradient-to-br from-primary-light via-card to-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <button
          className="w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center text-ink-secondary btn-press"
          onClick={() => onMonthChange(shiftMonth(month, -1))}
          aria-label="上个月"
        >
          ‹
        </button>
        <span className="text-base font-semibold text-ink">{monthLabel(month)}</span>
        <button
          className="w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center text-ink-secondary btn-press disabled:opacity-30"
          onClick={() => onMonthChange(shiftMonth(month, 1))}
          aria-label="下个月"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-xl font-bold text-income leading-7">
            {formatCurrency(stats.totalIncome)}
          </div>
          <div className="text-xs text-ink-tertiary mt-1">收入</div>
        </div>
        <div>
          <div className="text-xl font-bold text-expense leading-7">
            {formatCurrency(stats.totalExpense)}
          </div>
          <div className="text-xs text-ink-tertiary mt-1">支出</div>
        </div>
        <div>
          <div className="text-xl font-bold text-sky leading-7">
            {formatCurrency(stats.balance)}
          </div>
          <div className="text-xs text-ink-tertiary mt-1">结余</div>
        </div>
      </div>
    </div>
  );
}