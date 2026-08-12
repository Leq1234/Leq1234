import Dexie, { type Table } from 'dexie';
import type { RecordItem } from '@/types/record';
import type { Category } from '@/types/category';
import type { Book } from '@/types/book';
import type { Budget } from '@/types/budget';
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories';
import { DEFAULT_BOOK } from '@/data/defaultBooks';

export class HeimaDB extends Dexie {
  records!: Table<RecordItem, string>;
  categories!: Table<Category, string>;
  books!: Table<Book, string>;
  budgets!: Table<Budget, string>;

  constructor() {
    super('HeimaAccountDB');
    this.version(1).stores({
      records: 'id, type, categoryId, bookId, date, createdAt',
      categories: 'id, type, isCustom, sort',
      books: 'id, isArchived, createdAt',
      budgets: 'id, bookId, month'
    });
  }
}

export const db = new HeimaDB();

/** 首次启动时写入默认账本与预设分类 */
export async function ensureSeedData(): Promise<string> {
  if ((await db.books.count()) === 0) {
    await db.books.add(DEFAULT_BOOK);
  }
  if ((await db.categories.count()) === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }
  const first = await db.books.orderBy('createdAt').first();
  return first?.id ?? DEFAULT_BOOK.id;
}