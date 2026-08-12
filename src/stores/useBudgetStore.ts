import { create } from 'zustand';
import { db } from '@/services/db';
import type { Budget, CategoryBudget } from '@/types/budget';
import { genId } from '@/utils/constants';

interface BudgetState {
  budgets: Budget[];
  loaded: boolean;
  load: () => Promise<void>;
  getBudget: (bookId: string, month: string) => Budget | undefined;
  saveBudget: (params: {
    bookId: string;
    month: string;
    totalAmount: number;
    categoryBudgets: CategoryBudget[];
  }) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  loaded: false,

  load: async () => {
    const budgets = await db.budgets.toArray();
    set({ budgets, loaded: true });
  },

  getBudget: (bookId, month) =>
    get().budgets.find((b) => b.bookId === bookId && b.month === month),

  saveBudget: async ({ bookId, month, totalAmount, categoryBudgets }) => {
    const existing = get().budgets.find((b) => b.bookId === bookId && b.month === month);
    if (existing) {
      const updated: Budget = {
        ...existing,
        totalAmount,
        categoryBudgets: categoryBudgets.filter((cb) => cb.amount > 0)
      };
      await db.budgets.put(updated);
      set({ budgets: get().budgets.map((b) => (b.id === updated.id ? updated : b)) });
    } else {
      const budget: Budget = {
        id: genId(),
        bookId,
        month,
        totalAmount,
        categoryBudgets: categoryBudgets.filter((cb) => cb.amount > 0)
      };
      await db.budgets.add(budget);
      set({ budgets: [...get().budgets, budget] });
    }
  }
}));