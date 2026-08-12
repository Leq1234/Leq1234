import { db } from '@/services/db';
import type { RecordInput, RecordItem } from '@/types/record';
import { genId } from '@/utils/constants';

export const recordService = {
  async getAll(bookId?: string): Promise<RecordItem[]> {
    let query = db.records.toCollection();
    if (bookId) query = db.records.where('bookId').equals(bookId);
    const list = await query.toArray();
    return list.sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt
    );
  },

  async getById(id: string): Promise<RecordItem | undefined> {
    return db.records.get(id);
  },

  async add(input: RecordInput): Promise<RecordItem> {
    const now = Date.now();
    const record: RecordItem = { ...input, id: genId(), createdAt: now, updatedAt: now };
    await db.records.add(record);
    return record;
  },

  async bulkAdd(items: RecordItem[]): Promise<number> {
    const now = Date.now();
    const prepared: RecordItem[] = items.map((item) => ({
      ...item,
      id: item.id || genId(),
      createdAt: item.createdAt || now,
      updatedAt: now
    }));
    await db.records.bulkAdd(prepared);
    return prepared.length;
  },

  async update(id: string, patch: Partial<RecordItem>): Promise<void> {
    const current = await db.records.get(id);
    if (!current) return;
    await db.records.put({ ...current, ...patch, id, updatedAt: Date.now() });
  },

  async remove(id: string): Promise<void> {
    await db.records.delete(id);
  },

  async removeByBook(bookId: string): Promise<void> {
    await db.records.where('bookId').equals(bookId).delete();
  }
};