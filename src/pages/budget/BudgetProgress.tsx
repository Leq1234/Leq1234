import { formatMoney } from '@/utils/amount';
import { computeBudgetProgress, BUDGET_STATUS_COLOR } from '@/services/budgetService';
import type { Category } from '@/types/category';
import ProgressBar from '@/components/ui/ProgressBar';

interface BudgetProgressProps {
  items: Array<{ categoryId: string; amount: number }>;
  categories: Category[];
  categoryUsed: (categoryId: string) => number;
}

/** 分类预算进度列表 */
export default function BudgetProgress({ items, categories, categoryUsed }: BudgetProgressProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  if (items.length === 0) {
    return (
      <div className="text-center text-sm text-ink-tertiary py-6">还没有设置分类预算</div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const cat = categoryMap.get(item.categoryId);
        const used = categoryUsed(item.categoryId);
        const progress = computeBudgetProgress(used, item.amount);
        const color = progress ? BUDGET_STATUS_COLOR[progress.status] : '#B2BEC3';
        return (
          <div key={item.categoryId} className="flex items-center gap-3">
            <span className="text-lg w-8 text-center shrink-0" aria-hidden="true">
              {cat?.icon ?? '🔧'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-ink">{cat?.name ?? '未分类'}</span>
                <span className="text-xs text-ink-secondary">
                  {formatMoney(used)} / {formatMoney(item.amount)}
                </span>
              </div>
              <ProgressBar
                percent={progress?.percent ?? 0}
                color={color}
                height={6}
              />
            </div>
            <span className="text-xs font-semibold shrink-0" style={{ color }}>
              {progress?.percent ?? 0}%
            </span>
          </div>
        );
      })}
    </div>
  );
}