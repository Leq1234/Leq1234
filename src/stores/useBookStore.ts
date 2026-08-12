import { create } from 'zustand';
import { db } from '@/services/db';
import type { Book } from '@/types/book';
import { DEFAULT_BOOK } from '@/data/defaultBooks';
import { genId } from '@/utils/constants';

interface BookState {
  books: Book[];
  activeBookId: string;
  loaded: boolean;
  load: () => Promise<void>;
  setActiveBook: (id: string) => void;
  addBook: (data: { name: string; icon: string; color: string }) => Promise<Book>;
  updateBook: (id: string, patch: Partial<Book>) => Promise<void>;
  archiveBook: (id: string, archived: boolean) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  activeBookId: '',
  loaded: false,

  load: async () => {
    const books = await db.books.toArray();
    const active =
      books.find((b) => b.id === get().activeBookId) ??
      books.find((b) => !b.isArchived) ??
      books[0];
    set({
      books,
      activeBookId: active?.id ?? DEFAULT_BOOK.id,
      loaded: true
    });
  },

  setActiveBook: (id) => set({ activeBookId: id }),

  addBook: async (data) => {
    const book: Book = { ...data, id: genId(), isArchived: false, createdAt: Date.now() };
    await db.books.add(book);
    set({ books: [...get().books, book] });
    return book;
  },

  updateBook: async (id, patch) => {
    const books = get().books.map((b) => (b.id === id ? { ...b, ...patch, id } : b));
    await db.books.put(books.find((b) => b.id === id)!);
    set({ books });
  },

  archiveBook: async (id, archived) => {
    await get().updateBook(id, { isArchived: archived });
  },

  deleteBook: async (id) => {
    await db.books.delete(id);
    if (get().activeBookId === id) {
      const next = get().books.find((b) => b.id !== id && !b.isArchived);
      set({ activeBookId: next?.id ?? DEFAULT_BOOK.id });
    }
    set({ books: get().books.filter((b) => b.id !== id) });
  }
}));

export const useActiveBook = (): Book | undefined =>
  useBookStore((s) => s.books.find((b) => b.id === s.activeBookId));