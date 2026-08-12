import { useState } from 'react';
import { StatsCard } from '@/components/business';
import { useStats } from '@/hooks/useStats';
import { currentMonth, monthLabel, shiftMonth } from '@/utils/date';
import TrendChart from '@/pages/stats/TrendChart';
import CategoryPie from '@/pages/stats/CategoryPie';
import RankingList from '@/pages/stats/RankingList';

export default function StatsPage() {
  const [month, setMonth] = useState(currentMonth());
  const stats = useStats(month);

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
        <StatsCard
          title="收支总览"
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
          balance={stats.balance}
        />
      </div>

      <section className="mx-4 mt-3 rounded-lg bg-card p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink mb-2">每日趋势</h2>
        <TrendChart data={stats.dailyTrend} />
      </section>

      <section className="mx-4 mt-3 rounded-lg bg-card p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink mb-2">支出分类占比</h2>
        <CategoryPie data={stats.distribution} />
      </section>

      <section className="mx-4 mt-3 mb-6 rounded-lg bg-card p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink mb-4">消费排行榜</h2>
        <RankingList data={stats.ranking} />
      </section>
    </div>
  );
}