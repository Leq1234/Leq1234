import { useState } from 'react';
import { Dialog, Toast } from 'antd-mobile';
import { Header } from '@/components/layout';
import BookForm from '@/pages/books/BookForm';
import { useBookStore } from '@/stores/useBookStore';
import { recordService } from '@/services/recordService';
import { useRecordStore } from '@/stores/useRecordStore';
import type { Book, BookInput } from '@/types/book';

export default function BooksPage() {
  const { books, activeBookId, setActiveBook, addBook, updateBook, archiveBook, deleteBook } =
    useBookStore();
  const refreshRecords = useRecordStore((s) => s.load);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>(undefined);

  const sorted = [...books].sort((a, b) => {
    if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
    if (a.id === activeBookId) return -1;
    if (b.id === activeBookId) return 1;
    return a.createdAt - b.createdAt;
  });

  const openCreate = () => {
    setEditing(undefined);
    setFormVisible(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    setFormVisible(true);
  };

  const handleDelete = async (book: Book) => {
    const count = await recordService.getAll(book.id);
    const confirmed = await Dialog.confirm({
      content: `删除「${book.name}」将同时删除其名下 ${count.length} 条记录，且不可恢复。确认删除？`,
      confirmText: '删除',
      cancelText: '取消'
    });
    if (!confirmed) return;
    await recordService.removeByBook(book.id);
    await deleteBook(book.id);
    await refreshRecords();
    Toast.show({ content: '已删除账本', duration: 800 });
  };

  return (
    <div>
      <Header
        title="账本管理"
        isBack
        right={
          <button
            className="w-9 h-9 rounded-full bg-primary text-white text-xl shadow-fab btn-press"
            onClick={openCreate}
            aria-label="新建账本"
          >
            +
          </button>
        }
      />

      <div className="px-4 mt-3 space-y-3">
        {sorted.map((book) => {
          const active = book.id === activeBookId;
          return (
            <div
              key={book.id}
              className={`rounded-lg bg-card p-4 shadow-card border-2 transition-colors ${
                active ? 'border-primary' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: book.color }}
                >
                  {book.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-ink truncate">{book.name}</span>
                    {active && (
                      <span className="text-xs text-primary bg-primary-light px-2 py-0.5 rounded-full font-medium">
                        当前
                      </span>
                    )}
                    {book.isArchived && (
                      <span className="text-xs text-ink-tertiary bg-divider px-2 py-0.5 rounded-full">
                        已归档
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-tertiary mt-1">
                    {book.isArchived ? '归档账本 · 记录仍保留' : '独立记录与预算'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {!active && !book.isArchived && (
                  <button
                    className="flex-1 h-9 rounded-md bg-primary-light text-primary text-sm font-medium btn-press"
                    onClick={() => {
                      setActiveBook(book.id);
                      Toast.show({ content: `已切换到「${book.name}」`, duration: 800 });
                    }}
                  >
                    切换
                  </button>
                )}
                <button
                  className="flex-1 h-9 rounded-md bg-page text-ink-secondary text-sm font-medium btn-press"
                  onClick={() => openEdit(book)}
                >
                  编辑
                </button>
                <button
                  className="flex-1 h-9 rounded-md bg-page text-ink-secondary text-sm font-medium btn-press"
                  onClick={() => void archiveBook(book.id, !book.isArchived)}
                >
                  {book.isArchived ? '取消归档' : '归档'}
                </button>
                {book.id !== 'book_daily' && (
                  <button
                    className="flex-1 h-9 rounded-md bg-primary-light text-expense text-sm font-medium btn-press"
                    onClick={() => void handleDelete(book)}
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button
          className="w-full h-12 rounded-lg border-2 border-dashed border-primary/40 text-primary text-sm font-medium btn-press"
          onClick={openCreate}
        >
          + 新建账本
        </button>
      </div>

      <BookForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        initial={editing}
        onSave={async (data: BookInput) => {
          if (editing) {
            await updateBook(editing.id, data);
            Toast.show({ content: '账本已更新', duration: 800 });
          } else {
            const book = await addBook(data);
            setActiveBook(book.id);
            Toast.show({ content: '账本已创建', duration: 800 });
          }
          setFormVisible(false);
        }}
      />
    </div>
  );
}