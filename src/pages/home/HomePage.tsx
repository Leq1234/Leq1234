import { useState } from 'react';
import { BookSelector } from '@/components/business';
import DailySummary from '@/pages/home/DailySummary';
import MonthOverview from '@/pages/home/MonthOverview';
import RecentRecords from '@/pages/home/RecentRecords';
import { useRecords } from '@/hooks/useRecords';
import { useStats } from '@/hooks/useStats';
import { getDaySummary } from '@/services/statsService';
import { currentMonth, todayStr } from '@/utils/date';

export default function HomePage() {
  const [month, setMonth] = useState(currentMonth());
  const records = useRecords();
  const stats = useStats(month);
  const today = getDaySummary(records, todayStr());

  const recent = records.slice(0, 30);

  return (
    <div>
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-ink leading-7">黑马记账</h1>
          <p className="text-xs text-ink-tertiary mt-0.5">记录每一笔，让生活更清晰</p>
        </div>
        <BookSelector />
      </header>

      <MonthOverview month={month} stats={stats} onMonthChange={setMonth} />
      <DailySummary income={today.income} expense={today.expense} />
      <RecentRecords records={recent} hasAny={records.length > 0} />
    </div>
  );
}