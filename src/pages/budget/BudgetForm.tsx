import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Popup, Toast } from 'antd-mobile';
import { toFen, toYuan } from '@/utils/amount';
import type { Budget, CategoryBudget } from '@/types/budget';
import type { Category } from '@/types/category';

interface BudgetFormProps {
  visible: boolean;
  onClose: () => void;
  monthLabel: string;
  categories: Category[];
  initial?: Budget;
  onSave: (totalAmount: number, categoryBudgets: CategoryBudget[]) => void;
}

function MoneyInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <Input
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(v) => {
        const clean = v.replace(/[^\d.]/g, '');
        onChange(clean);
      }}
    />
  );
}

/** 预算设置弹层：总预算 + 分类预算 */
export default function BudgetForm({
  visible,
  onClose,
  monthLabel,
  categories,
  initial,
  onSave
}: BudgetFormProps) {
  const [totalStr, setTotalStr] = useState('');
  const [catAmounts, setCatAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setTotalStr(initial ? toYuan(initial.totalAmount) : '');
    const map: Record<string, string> = {};
    for (const cb of initial?.categoryBudgets ?? []) {
      map[cb.categoryId] = toYuan(cb.amount);
    }
    setCatAmounts(map);
  }, [visible, initial]);

  const hasAnyBudget = useMemo(
    () => categories.some((c) => Number(catAmounts[c.id] ?? 0) > 0),
    [categories, catAmounts]
  );

  const handleSave = () => {
    const totalAmount = toFen(parseFloat(totalStr || '0'));
    if (!(totalAmount > 0)) {
      Toast.show({ content: '请设置总预算金额', duration: 1000 });
      return;
    }
    const categoryBudgets: CategoryBudget[] = categories.map((c) => ({
      categoryId: c.id,
      amount: toFen(parseFloat(catAmounts[c.id] ?? '0'))
    }));
    onSave(totalAmount, categoryBudgets);
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyClassName="popup-body"
      position="bottom"
      destroyOnClose={false}
    >
      <div className="px-4 py-5 max-h-[75vh] overflow-y-auto">
        <div className="text-base font-semibold text-ink text-center mb-4">
          设置预算 · {monthLabel}
        </div>

        <div className="rounded-md bg-card border border-divider p-4 mb-4">
          <div className="text-xs text-ink-tertiary mb-2">月度总预算（元）</div>
          <MoneyInput
            value={totalStr}
            onChange={setTotalStr}
            placeholder="例如 3000"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink">分类预算（可选）</span>
          <span className="text-xs text-ink-tertiary">
            {hasAnyBudget ? '已设置分类预算' : '不设置则仅按总预算提醒'}
          </span>
        </div>

        <div className="rounded-md bg-card border border-divider divide-y divide-divider">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg shrink-0" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="text-sm text-ink flex-1">{cat.name}</span>
              <div className="w-32">
                <MoneyInput
                  value={catAmounts[cat.id] ?? ''}
                  onChange={(v) => setCatAmounts((prev) => ({ ...prev, [cat.id]: v }))}
                  placeholder="不限制"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          color="primary"
          className="mt-5 w-full"
          onClick={handleSave}
        >
          保存预算
        </Button>
      </div>
    </Popup>
  );
}