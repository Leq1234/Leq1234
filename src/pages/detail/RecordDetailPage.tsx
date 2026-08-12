import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { Header } from '@/components/layout';
import { EmptyState, CategoryIcon } from '@/components/ui';
import { useRecordStore } from '@/stores/useRecordStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBookStore } from '@/stores/useBookStore';
import { toYuan } from '@/utils/amount';

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, deleteRecord } = useRecordStore();
  const categories = useCategoryStore((s) => s.categories);
  const books = useBookStore((s) => s.books);

  useEffect(() => {
    if (!useRecordStore.getState().loaded) void useRecordStore.getState().load();
    if (!useCategoryStore.getState().loaded) void useCategoryStore.getState().load();
  }, []);

  const record = records.find((r) => r.id === id);
  if (!record) {
    return (
      <div>
        <Header title="记录详情" isBack />
        <EmptyState emoji="🔍" title="没有找到这条记录" desc="可能已被删除" />
      </div>
    );
  }

  const category = categories.find((c) => c.id === record.categoryId);
  const book = books.find((b) => b.id === record.bookId);

  const handleDelete = async () => {
    const confirmed = await Dialog.confirm({
      content: '确定删除这条记录吗？删除后不可恢复。',
      confirmText: '删除',
      cancelText: '取消'
    });
    if (!confirmed) return;
    await deleteRecord(record.id);
    Toast.show({ content: '已删除', duration: 800 });
    navigate('/', { replace: true });
  };

  const income = record.type === 'income';

  return (
    <div>
      <Header
        title="记录详情"
        isBack
        right={
          <button
            className="px-3 h-9 rounded-full bg-primary-light text-primary text-sm font-medium btn-press"
            onClick={() => navigate(`/add?edit=${record.id}`)}
          >
            编辑
          </button>
        }
      />

      <div className="mx-4 mt-3 rounded-lg bg-card p-6 shadow-card text-center">
        <div className="flex justify-center mb-4">
          <CategoryIcon icon={category?.icon ?? '🔧'} name={category?.name ?? '未分类'} size={56} />
        </div>
        <div className="text-xs text-ink-tertiary mb-1">{income ? '收入' : '支出'}</div>
        <div
          className={`text-[32px] font-bold leading-10 ${
            income ? 'text-income' : 'text-expense'
          }`}
        >
          {income ? '+' : '-'}
          {toYuan(record.amount)}
        </div>
        <div className="text-sm text-ink mt-1">{category?.name ?? '未分类'}</div>
        {record.note && (
          <div className="text-sm text-ink-secondary mt-3 bg-page rounded-md px-4 py-2 inline-block">
            {record.note}
          </div>
        )}
      </div>

      <div className="mx-4 mt-3 rounded-lg bg-card shadow-card divide-y divide-divider">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-sm text-ink-tertiary">日期</span>
          <span className="text-sm text-ink">{dayjs(record.date).format('YYYY年MM月DD日 dddd')}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-sm text-ink-tertiary">账本</span>
          <span className="text-sm text-ink">
            {book?.icon} {book?.name ?? '未知账本'}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-sm text-ink-tertiary">创建时间</span>
          <span className="text-sm text-ink-secondary">
            {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm')}
          </span>
        </div>
      </div>

      <div className="mx-4 mt-4 mb-8">
        <button
          className="w-full h-11 rounded-md bg-primary-light text-expense text-sm font-medium btn-press"
          onClick={() => void handleDelete()}
        >
          删除这条记录
        </button>
      </div>
    </div>
  );
}