export interface DailyData {
  /** YYYY-MM-DD */
  date: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  /** 占该类型总额的百分比（0-100 整数） */
  percent: number;
}

export interface MonthStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  dailyTrend: DailyData[];
  distribution: CategoryData[];
  ranking: CategoryData[];
}