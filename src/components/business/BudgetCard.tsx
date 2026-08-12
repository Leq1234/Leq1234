import { useNavigate } from 'react-router-dom';
import type { Budget, BudgetStatus } from '@/types/budget';
import { formatCurrency } from '@/utils/amount';
import { BUDGET_STATUS_COLOR, BUDGET_STATUS_LABEL } from '@/services/budgetService';
import ProgressBar from '@/components/ui/ProgressBar';

interface BudgetCardProps {
  budget?: Budget;
  used: number;
  percent: number;
  status: BudgetStatus;
  monthLabel: string;
}

/** 月度总预算卡片：预算金额 + 进度条 + 状态 */
export default function BudgetCard({ budget, used, percent, status, monthLabel }: BudgetCardProps) {
  const navigate = useNavigate();
  const color = BUDGET_STATUS_COLOR[status];

  return (
    <div
      className="rounded-lg bg-gradient-to-br from-primary-light to-card p-5 shadow-card cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => navigate('/budget')}
      role="button"
      aria-label="查看预算"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-secondary">本月预算 · {monthLabel}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color, backgroundColor: `${color}1A` }}
        >
          {BUDGET_STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-[26px] font-bold leading-9" style={{ color }}>
            {formatCurrency(used)}
          </div>
          <div className="text-xs text-ink-tertiary mt-0.5">已用支出</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-ink">{formatCurrency(budget?.totalAmount ?? 0)}</div>
          <div className="text-xs text-ink-tertiary mt-0.5">预算总额</div>
        </div>
      </div>

      <ProgressBar percent={percent} color={color} height={10} />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-ink-tertiary">剩余 {formatCurrency(Math.max((budget?.totalAmount ?? 0) - used, 0))}</span>
        <span className="text-xs text-primary font-medium">{percent}%</span>
      </div>
    </div>
  );
}