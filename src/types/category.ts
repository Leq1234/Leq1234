import type { RecordType } from '@/types/record';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: RecordType;
  isCustom: boolean;
  sort: number;
}