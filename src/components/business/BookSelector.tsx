import { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { useBookStore } from '@/stores/useBookStore';

interface BookSelectorProps {
  popupTitle?: string;
}

/** 账本选择器：当前账本触发按钮 + 底部弹层列表 */
export default function BookSelector({ popupTitle = '选择账本' }: BookSelectorProps) {
  const books = useBookStore((s) => s.books);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const setActiveBook = useBookStore((s) => s.setActiveBook);
  const [visible, setVisible] = useState(false);

  const active = books.find((b) => b.id === activeBookId);

  return (
    <>
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-card btn-press"
        onClick={() => setVisible(true)}
        aria-label="切换账本"
      >
        <span className="text-base leading-none">{active?.icon ?? '📒'}</span>
        <span className="text-sm font-medium text-ink max-w-[80px] truncate">
          {active?.name ?? '账本'}
        </span>
        <span className="text-xs text-ink-tertiary">▾</span>
      </button>

      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyClassName="popup-body"
        position="bottom"
      >
        <div className="px-4 py-5">
          <div className="text-base font-semibold text-ink text-center mb-4">{popupTitle}</div>
          <div className="grid grid-cols-2 gap-3">
            {books
              .filter((b) => !b.isArchived)
              .map((book) => {
                const isActive = book.id === activeBookId;
                return (
                  <button
                    key={book.id}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 border-2 transition-all btn-press ${
                      isActive ? 'border-primary bg-primary-light' : 'border-divider bg-card'
                    }`}
                    onClick={() => {
                      setActiveBook(book.id);
                      setVisible(false);
                      Toast.show({ content: `已切换到「${book.name}」`, duration: 800 });
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                      style={{ backgroundColor: book.color }}
                    >
                      {book.icon}
                    </span>
                    <span
                      className={`text-sm font-medium truncate ${
                        isActive ? 'text-primary' : 'text-ink'
                      }`}
                    >
                      {book.name}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </Popup>
    </>
  );
}