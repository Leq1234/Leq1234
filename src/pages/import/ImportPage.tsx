import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { Header } from '@/components/layout';
import PreviewTable from '@/pages/import/PreviewTable';
import { useBookStore } from '@/stores/useBookStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useRecordStore } from '@/stores/useRecordStore';
import { parseBill, type BillPlatform, type ParsedBill } from '@/services/importService';
import { recordService } from '@/services/recordService';
import type { RecordItem } from '@/types/record';
import { cn } from '@/utils/cn';

export default function ImportPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState<BillPlatform>('alipay');
  const [items, setItems] = useState<ParsedBill[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);

  const activeBookId = useBookStore((s) => s.activeBookId);
  const categories = useCategoryStore((s) => s.categories);
  const loadCategories = useCategoryStore((s) => s.load);
  const refreshRecords = useRecordStore((s) => s.load);

  const matchCategory = (item: ParsedBill): string => {
    const pool = categories.filter((c) => c.type === item.type);
    const fallback = pool.find((c) => c.name === '其他')?.id ?? pool[0]?.id ?? '';
    const keyword = pool.find(
      (c) => c.name !== '其他' && item.note.includes(c.name)
    );
    return keyword?.id ?? fallback;
  };

  const handleFile = async (file: File) => {
    if (!/\.(csv|txt)$/i.test(file.name)) {
      Toast.show({ content: '请选择 CSV 或 TXT 账单文件', duration: 1500 });
      return;
    }
    const content = await file.text();
    const parsed = parseBill(content, platform);
    if (parsed.length === 0) {
      Toast.show({
        content: '未识别到有效账单，请确认格式与所选平台一致',
        duration: 2000
      });
      setItems([]);
      setFileName('');
      return;
    }
    setItems(parsed);
    setFileName(file.name);
    Toast.show({ content: `解析成功，共 ${parsed.length} 条`, duration: 1200 });
  };

  const handleImport = async () => {
    if (items.length === 0) return;
    setImporting(true);
    const records: RecordItem[] = items.map((item) => ({
      id: '',
      type: item.type,
      amount: item.amount,
      categoryId: matchCategory(item),
      bookId: activeBookId,
      date: item.date,
      note: item.note,
      createdAt: 0,
      updatedAt: 0
    }));
    const count = await recordService.bulkAdd(records);
    await refreshRecords();
    setImporting(false);
    setItems([]);
    setFileName('');
    Toast.show({ content: `成功导入 ${count} 条记录`, duration: 1200 });
    navigate('/', { replace: true });
  };

  return (
    <div>
      <Header title="账单导入" isBack />

      <div className="mx-4 mt-3">
        <div className="flex rounded-full bg-divider p-1">
          {(
            [
              { value: 'alipay', label: '支付宝账单' },
              { value: 'wechat', label: '微信账单' }
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              className={cn(
                'flex-1 h-9 rounded-full text-sm font-medium transition-all btn-press',
                platform === item.value ? 'bg-primary text-white shadow-card' : 'text-ink-secondary'
              )}
              onClick={() => {
                setPlatform(item.value);
                setItems([]);
                setFileName('');
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-lg bg-card p-6 shadow-card text-center">
        <div className="text-4xl mb-3" aria-hidden="true">
          📥
        </div>
        <div className="text-base font-semibold text-ink mb-1">
          {platform === 'alipay' ? '导入支付宝账单' : '导入微信账单'}
        </div>
        <p className="text-xs text-ink-tertiary leading-5 mb-5">
          请在支付宝 / 微信「账单」页导出 CSV 文件
          <br />
          数据仅在本机解析，不会上传到任何服务器
        </p>
        <button
          className="w-full h-11 rounded-md bg-primary text-white text-sm font-medium shadow-fab btn-press"
          onClick={() => fileRef.current?.click()}
        >
          选择账单文件
        </button>
        {fileName && (
          <div className="text-xs text-ink-secondary mt-3">已选择：{fileName}</div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      <PreviewTable items={items} categoryOf={matchCategory} />

      {items.length > 0 && (
        <div className="mx-4 mt-4 mb-8 space-y-2">
          <button
            className="w-full h-11 rounded-md bg-success text-white text-sm font-medium shadow-card btn-press disabled:opacity-50"
            disabled={importing}
            onClick={() => void handleImport()}
          >
            {importing ? '导入中…' : `确认导入 ${items.length} 条`}
          </button>
          <button
            className="w-full h-11 rounded-md bg-page text-ink-secondary text-sm font-medium btn-press"
            onClick={() => {
              setItems([]);
              setFileName('');
            }}
          >
            取消
          </button>
        </div>
      )}

      <div className="mx-4 mt-4 mb-6">
        <h3 className="text-sm font-semibold text-ink mb-2">导入说明</h3>
        <ul className="text-xs text-ink-tertiary leading-6 list-disc pl-4 space-y-1">
          <li>分类会自动根据账单备注中的关键词匹配，匹配不到归入「其他」</li>
          <li>导入的记录将写入当前账本「{useBookStore.getState().books.find((b) => b.id === activeBookId)?.name ?? '日常记账'}」</li>
          <li>重复导入会造成重复记录，请导入前检查</li>
        </ul>
      </div>
    </div>
  );
}