import type { RecordType } from '@/types/record';
import { cn } from '@/utils/cn';

interface TypeSwitchProps {
  type: RecordType;
  onChange: (type: RecordType) => void;
}

/** 收入 / 支出 切换开关 */
export default function TypeSwitch({ type, onChange }: TypeSwitchProps) {
  return (
    <div className="flex rounded-full bg-divider p-1 mx-4">
      {(
        [
          { value: 'expense', label: '支出', active: 'bg-expense', color: 'text-expense' },
          { value: 'income', label: '收入', active: 'bg-income', color: 'text-income' }
        ] as const
      ).map((item) => {
        const active = type === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'flex-1 h-9 rounded-full text-sm font-medium transition-all btn-press',
              active ? `${item.active} text-white shadow-card` : 'text-ink-secondary'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}