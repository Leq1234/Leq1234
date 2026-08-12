export type RecordType = 'income' | 'expense';

export interface RecordItem {
  id: string;
  type: RecordType;
  /** 金额，单位为分（整数） */
  amount: number;
  categoryId: string;
  bookId: string;
  /** YYYY-MM-DD */
  date: string;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface RecordInput {
  type: RecordType;
  amount: number;
  categoryId: string;
  bookId: string;
  date: string;
  note: string;
}