import { useMemo, useState } from 'react';
import { Toast } from 'antd-mobile';
import { BudgetCard } from '@/components/business';
import BudgetForm from '@/pages/budget/BudgetForm';
import BudgetProgress from '@/pages/budget/BudgetProgress';
import { useBudget } from '@/hooks/useBudget';
import { useBookStore } from '@/stores/useBookStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBudgetStore } from '@/stores/useBudgetStore';
import { getBudgetStatus } from '@/services/budgetService';
import { currentMonth, monthLabel, shiftMonth } from '@/utils/date';

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonth());
  const [formVisible, setFormVisible] = useState(false);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const { budget, used, progress, categoryUsed } = useBudget(month);
  const categories = useCategoryStore((s) => s.categories);
  const saveBudget = useBudgetStore((s) => s.saveBudget);

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense').sort((a, b) => a.sort - b.sort),
    [categories]
  );

  const status = progress?.status ?? getBudgetStatus(0);

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          className="w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center text-ink-secondary btn-press"
          onClick={() => setMonth(shiftMonth(month, -1))}
          aria-label="上个月"
        >
          ‹
        </button>
        <h1 className="text-base font-semibold text-ink">{monthLabel(month)}</h1>
        <button
          className="w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center text-ink-secondary btn-press"
          onClick={() => setMonth(shiftMonth(month, 1))}
          aria-label="下个月"
        >
          ›
        </button>
      </div>

      <div className="px-4">
        <BudgetCard
          budget={budget}
          used={used}
          percent={progress?.percent ?? 0}
          status={status}
          monthLabel={monthLabel(month)}
        />
      </div>

      <div className="px-4 mt-3">
        <button
          className="w-full h-11 rounded-md bg-primary text-white text-sm font-medium shadow-fab btn-press"
          onClick={() => setFormVisible(true)}
        >
          {budget ? '修改预算' : '设置预算'}
        </button>
      </div>

      <section className="mx-4 mt-3 mb-6 rounded-lg bg-card p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink mb-4">分类预算</h2>
        <BudgetProgress
          items={budget?.categoryBudgets ?? []}
          categories={expenseCategories}
          categoryUsed={categoryUsed}
        />
      </section>

      <BudgetForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        monthLabel={monthLabel(month)}
        categories={expenseCategories}
        initial={budget}
        onSave={(totalAmount, categoryBudgets) => {
          void saveBudget({ bookId: activeBookId, month, totalAmount, categoryBudgets });
          Toast.show({ content: '预算已保存', duration: 1000 });
        }}
      />
    </div>
  );
}