import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/business';
import type { RecordItem } from '@/types/record';

interface RecentRecordsProps {
  records: RecordItem[];
  hasAny: boolean;
}

/** 最近记录列表（首页展示） */
export default function RecentRecords({ records, hasAny }: RecentRecordsProps) {
  const navigate = useNavigate();
  return (
    <section className="mt-6">
      <h2 className="px-4 mb-2 text-base font-semibold text-ink">最近记录</h2>
      <RecordList
        records={records}
        showEmpty={!hasAny}
        emptyEmoji="🐱"
        emptyText="还没有记录哦~"
        emptyActionText="记一笔"
        onEmptyAction={() => navigate('/add')}
      />
    </section>
  );
}