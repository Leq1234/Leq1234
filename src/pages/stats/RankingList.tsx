import { formatMoney } from '@/utils/amount';
import type { CategoryData } from '@/types/stats';

interface RankingListProps {
  data: CategoryData[];
}

const RANK_COLORS = ['#FF6B6B', '#FF922B', '#FFD93D', '#4ECDC4', '#6C9BCF'];

/** 消费分类排行榜 */
export default function RankingList({ data }: RankingListProps) {
  if (data.length === 0) {
    return <div className="text-center text-sm text-ink-tertiary py-8">本月暂无支出数据</div>;
  }
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.categoryId} className="flex items-center gap-3">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: RANK_COLORS[index % RANK_COLORS.length] }}
          >
            {index + 1}
          </span>
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
            style={{ backgroundColor: `${item.color}26` }}
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink truncate">{item.name}</div>
            <div className="w-full bg-divider rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="progress-anim h-full rounded-full"
                style={{ width: `${Math.max(item.percent, 3)}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-ink">{formatMoney(item.amount)}</div>
            <div className="text-xs text-ink-tertiary mt-0.5">{item.percent}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}