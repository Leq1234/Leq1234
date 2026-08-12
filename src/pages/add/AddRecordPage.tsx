import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker, Input, Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { CategoryGrid, BookSelector } from '@/components/business';
import { Header } from '@/components/layout';
import NumberKeyboard from '@/pages/add/NumberKeyboard';
import TypeSwitch from '@/pages/add/TypeSwitch';
import { useBookStore } from '@/stores/useBookStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useRecordStore } from '@/stores/useRecordStore';
import { recordService } from '@/services/recordService';
import { toFen, toYuan } from '@/utils/amount';
import { formatDay, todayStr } from '@/utils/date';
import { MAX_NOTE_LENGTH } from '@/utils/constants';
import type { RecordType } from '@/types/record';

export default function AddRecordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const categories = useCategoryStore((s) => s.categories);
  const loadCategories = useCategoryStore((s) => s.load);
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);
  const activeBookId = useBookStore((s) => s.activeBookId);

  const [type, setType] = useState<RecordType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayStr());
  const [editBookId, setEditBookId] = useState('');
  const [dateVisible, setDateVisible] = useState(false);

  const isEdit = Boolean(editId);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!editId) return;
    void (async () => {
      const record = await recordService.getById(editId);
      if (!record) return;
      setType(record.type);
      setAmountInput(toYuan(record.amount));
      setCategoryId(record.categoryId);
      setNote(record.note);
      setDate(record.date);
      setEditBookId(record.bookId);
    })();
  }, [editId]);

  const typeCategories = useMemo(
    () => categories.filter((c) => c.type === type).sort((a, b) => a.sort - b.sort),
    [categories, type]
  );

  useEffect(() => {
    const list = categories.filter((c) => c.type === type).sort((a, b) => a.sort - b.sort);
    if (!list.some((c) => c.id === categoryId)) {
      setCategoryId(list[0]?.id ?? '');
    }
  }, [type, categories, categoryId]);

  const handleTypeChange = (next: RecordType) => {
    setType(next);
    const first = categories.find((c) => c.type === next);
    setCategoryId(first?.id ?? '');
  };

  const handleKey = (key: string) => {
    setAmountInput((prev) => {
      if (key === 'backspace') return prev.slice(0, -1);
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return prev === '' ? '0.' : prev + key;
      }
      if (!/^\d$/.test(key)) return prev;
      if (prev.includes('.')) {
        const decimals = prev.split('.')[1] ?? '';
        if (decimals.length >= 2) return prev;
      }
      if (prev === '0') return key;
      if (prev.length >= 9) return prev;
      return prev + key;
    });
  };

  const handleDone = async () => {
    const fen = toFen(parseFloat(amountInput || '0'));
    if (!(fen > 0)) {
      Toast.show({ content: '请输入金额', duration: 1000 });
      return;
    }
    if (!categoryId) {
      Toast.show({ content: '请选择分类', duration: 1000 });
      return;
    }

    const bookId = isEdit ? editBookId : activeBookId;

    if (isEdit && editId) {
      await updateRecord(editId, { type, amount: fen, categoryId, date, note, bookId });
      Toast.show({ content: '已保存修改', duration: 1000 });
      navigate(`/detail/${editId}`);
    } else {
      await addRecord({ type, amount: fen, categoryId, bookId, date, note });
      Toast.show({
        content: type === 'expense' ? '支出已记录 ✓' : '收入已记录 ✓',
        duration: 1000
      });
      navigate(-1);
    }
  };

  const displayAmount = amountInput === '' ? '0.00' : amountInput;

  return (
    <div className="app-container flex flex-col min-h-full bg-page">
      <Header title={isEdit ? '编辑记录' : '记一笔'} isBack />
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="pt-3">
          <TypeSwitch type={type} onChange={handleTypeChange} />
        </div>

        <div className="mx-4 mt-4 rounded-md bg-card p-4 shadow-card">
          <CategoryGrid
            categories={typeCategories}
            selectedId={categoryId}
            onSelect={(cat) => setCategoryId(cat.id)}
          />
        </div>

        <div className="mx-4 mt-3 rounded-md bg-card p-3 shadow-card">
          <Input
            placeholder="添加备注（可选，最多 50 字）"
            value={note}
            onChange={setNote}
            maxLength={MAX_NOTE_LENGTH}
          />
        </div>

        <div className="mx-4 mt-3 flex items-center justify-between">
          <button
            className="px-4 py-2.5 rounded-md bg-card shadow-card text-sm text-ink-secondary btn-press"
            onClick={() => setDateVisible(true)}
          >
            📅 {dayjs(date).format('MM月DD日')}
          </button>
          <BookSelector popupTitle="记入哪个账本？" />
        </div>
      </div>

      <div className="shrink-0 bg-page safe-bottom">
        <div className="flex items-center justify-end px-4 pt-1">
          <span className="text-[32px] font-bold text-ink">
            <span className="text-lg font-medium text-ink-tertiary mr-1">¥</span>
            {displayAmount}
          </span>
        </div>
        <NumberKeyboard onKey={handleKey} onDateClick={() => setDateVisible(true)} onDone={handleDone} />
      </div>

      <DatePicker
        visible={dateVisible}
        onClose={() => setDateVisible(false)}
        onConfirm={(value) => setDate(formatDay(value))}
        precision="day"
        min={new Date(2000, 0, 1)}
        max={new Date()}
        title="选择日期"
      />
    </div>
  );
}