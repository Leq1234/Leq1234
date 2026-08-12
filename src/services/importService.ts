import type { RecordType } from '@/types/record';

export interface ParsedBill {
  date: string;
  type: RecordType;
  amount: number;
  note: string;
}

export type BillPlatform = 'alipay' | 'wechat';

/** 简易 CSV 解析（支持带引号的字段） */
export function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let inQuotes = false;
  const current: string[] = [];

  const pushField = () => {
    current.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(current.splice(0));
  };

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      pushField();
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && content[i + 1] === '\n') i++;
      if (current.length > 0 || field !== '') pushRow();
    } else {
      field += ch;
    }
  }
  if (current.length > 0 || field !== '') pushRow();
  return rows.map((row) => row.map((cell) => cell.trim()));
}

/** 支付宝 CSV：日期,交易号,对方,商品说明,收/支,金额,状态,分类,input */
export function parseAlipayCsv(content: string): ParsedBill[] {
  const rows = parseCsvRows(content);
  const result: ParsedBill[] = [];
  for (const row of rows) {
    const dateCell = row[0];
    const dirCell = row[4];
    const amountCell = row[5];
    if (!/^\d{4}/.test(dateCell || '') || !dirCell) continue;
    const dir = dirCell.trim();
    const type: RecordType = dir === '支出' || dir === '退款' ? 'expense' : dir === '收入' ? 'income' : 'expense';
    const amount = Math.abs(parseFloat(String(amountCell).replace(/[^\d.-]/g, '')));
    if (Number.isNaN(amount) || amount <= 0) continue;
    const payer = row[3] ?? '';
    const goods = row[6] ?? '支付宝账单';
    result.push({
      date: normalizeDate(dateCell),
      type,
      amount: Math.round(amount * 100),
      note: [payer, goods].filter(Boolean).join('·') || '支付宝账单'
    });
  }
  return result;
}

/** 微信支付 CSV：交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,... */
export function parseWechatCsv(content: string): ParsedBill[] {
  const rows = parseCsvRows(content);
  const result: ParsedBill[] = [];
  for (const row of rows) {
    const dateCell = row[0];
    const dirCell = row[4];
    const amountCell = row[5];
    if (!/^\d{4}/.test(dateCell || '') || !dirCell) continue;
    const dir = dirCell.trim();
    if (!['收入', '支出', '对方退款'].includes(dir)) continue;
    const type: RecordType = dir === '收入' ? 'income' : 'expense';
    const amount = Math.abs(parseFloat(String(amountCell).replace(/[^\d.-]/g, '')));
    if (Number.isNaN(amount) || amount <= 0) continue;
    const peer = row[2] ?? '';
    const goods = row[3] ?? '微信账单';
    result.push({
      date: normalizeDate(dateCell),
      type,
      amount: Math.round(amount * 100),
      note: [peer, goods].filter(Boolean).join('·') || '微信账单'
    });
  }
  return result;
}

export function parseBill(content: string, platform: BillPlatform): ParsedBill[] {
  if (platform === 'wechat') return parseWechatCsv(content);
  return parseAlipayCsv(content);
}

function normalizeDate(cell: string): string {
  const m = cell.match(/(\d{4})[年./-](\d{1,2})[月./-](\d{1,2})/);
  if (!m) return cell.slice(0, 10);
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}