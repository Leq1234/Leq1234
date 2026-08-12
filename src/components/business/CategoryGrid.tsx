import type { Category } from '@/types/category';
import { getCategoryColor } from '@/utils/constants';

interface CategoryGridProps {
  categories: Category[];
  selectedId: string;
  onSelect: (category: Category) => void;
  columns?: 4 | 5;
}

/** 分类选择网格，选中项放大 + 主色边框 */
export default function CategoryGrid({
  categories,
  selectedId,
  onSelect,
  columns = 5
}: CategoryGridProps) {
  return (
    <div
      className="grid gap-y-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {categories.map((cat) => {
        const selected = cat.id === selectedId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat)}
            className={`flex flex-col items-center gap-1.5 transition-transform ${
              selected ? 'scale-110' : 'scale-100'
            }`}
            aria-pressed={selected}
          >
            <span
              className={`inline-flex items-center justify-center rounded-full transition-all ${
                selected ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{
                width: 36,
                height: 36,
                backgroundColor: getCategoryColor(cat.name)
              }}
            >
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
            </span>
            <span
              className={`text-xs ${
                selected ? 'text-primary font-semibold' : 'text-ink-secondary'
              }`}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}