import { formatCurrency } from '@/utils/amount';

interface StatsCardProps {
  title: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/** 统计概览卡片：收入 / 支出 / 结余 */
export default function StatsCard({ title, totalIncome, totalExpense, balance }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-primary-light to-card p-5 shadow-card">
      <div className="text-sm text-ink-secondary mb-4">{title}</div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-income leading-7">{formatCurrency(totalIncome)}</div>
          <div className="text-xs text-ink-tertiary mt-1">收入</div>
        </div>
        <div>
          <div className="text-lg font-bold text-expense leading-7">{formatCurrency(totalExpense)}</div>
          <div className="text-xs text-ink-tertiary mt-1">支出</div>
        </div>
        <div>
          <div className="text-lg font-bold text-sky leading-7">{formatCurrency(balance)}</div>
          <div className="text-xs text-ink-tertiary mt-1">结余</div>
        </div>
      </div>
    </div>
  );
}