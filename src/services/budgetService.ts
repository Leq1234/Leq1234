import type { Budget, BudgetProgress, BudgetStatus } from '@/types/budget';

export function getBudgetStatus(percent: number): BudgetStatus {
  if (percent >= 100) return 'over';
  if (percent >= 80) return 'danger';
  if (percent >= 50) return 'warning';
  return 'healthy';
}

export function computeBudgetProgress(used: number, budget: number): BudgetProgress | null {
  if (budget <= 0) return null;
  const percent = Math.min(Math.round((used / budget) * 100), 999);
  return { used, budget, percent, status: getBudgetStatus(percent) };
}

export function computeBudgetProgressOf(budget: Budget | undefined, used: number): BudgetProgress | null {
  if (!budget || budget.totalAmount <= 0) return null;
  return computeBudgetProgress(used, budget.totalAmount);
}

export const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  healthy: '健康',
  warning: '注意',
  danger: '预警',
  over: '超支'
};

export const BUDGET_STATUS_COLOR: Record<BudgetStatus, string> = {
  healthy: '#51CF66',
  warning: '#FF922B',
  danger: '#FF6B6B',
  over: '#C0392B'
};