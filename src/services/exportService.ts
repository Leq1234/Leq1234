import type { Category } from '@/types/category';
import type { RecordItem } from '@/types/record';
import { formatCompact } from '@/utils/amount';

function escapeCsv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** 导出记录为 CSV 并触发下载 */
export function exportRecordsToCsv(records: RecordItem[], categories: Category[], fileName = '黑马记账'): void {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const lines: string[] = ['日期,类型,分类,金额(元),备注,账本ID'];
  for (const r of records) {
    const cat = categoryMap.get(r.categoryId);
    lines.push(
      [
        r.date,
        r.type === 'income' ? '收入' : '支出',
        cat?.name ?? '未分类',
        formatCompact(r.amount),
        escapeCsv(r.note || ''),
        r.bookId
      ].join(',')
    );
  }
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}