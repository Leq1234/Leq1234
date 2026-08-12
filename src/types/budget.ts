export interface CategoryBudget {
  categoryId: string;
  /** 金额，单位分 */
  amount: number;
}

export interface Budget {
  id: string;
  bookId: string;
  /** YYYY-MM */
  month: string;
  /** 总预算，单位分 */
  totalAmount: number;
  categoryBudgets: CategoryBudget[];
}

export type BudgetStatus = 'healthy' | 'warning' | 'danger' | 'over';

export interface BudgetProgress {
  used: number;
  budget: number;
  percent: number;
  status: BudgetStatus;
}