import type { Book } from '@/types/book';

export const DEFAULT_BOOK: Book = {
  id: 'book_daily',
  name: '日常记账',
  icon: '📒',
  color: '#FF6B6B',
  isArchived: false,
  createdAt: Date.now()
};