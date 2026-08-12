import { create } from 'zustand';
import { db } from '@/services/db';
import { recordService } from '@/services/recordService';
import type { RecordInput, RecordItem } from '@/types/record';

interface RecordState {
  records: RecordItem[];
  loaded: boolean;
  load: () => Promise<void>;
  addRecord: (input: RecordInput) => Promise<RecordItem>;
  updateRecord: (id: string, patch: Partial<RecordItem>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  loaded: false,

  load: async () => {
    const records = await recordService.getAll();
    set({ records, loaded: true });
  },

  addRecord: async (input) => {
    const record = await recordService.add(input);
    set({ records: [...get().records, record] });
    return record;
  },

  updateRecord: async (id, patch) => {
    await recordService.update(id, patch);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...patch, id } : r))
    });
  },

  deleteRecord: async (id) => {
    await recordService.remove(id);
    set({ records: get().records.filter((r) => r.id !== id) });
  }
}));

export function refreshRecordsFromDb(): Promise<void> {
  return useRecordStore.getState().load();
}