import { useEffect, useState } from 'react';
import { Button, Input, Popup, Toast } from 'antd-mobile';
import type { Book, BookInput } from '@/types/book';
import { BOOK_TEMPLATES, CATEGORY_PALETTE, EMOJI_LIST } from '@/utils/constants';

interface BookFormProps {
  visible: boolean;
  onClose: () => void;
  initial?: Book;
  onSave: (data: BookInput) => void;
}

/** 新建 / 编辑账本弹层 */
export default function BookForm({ visible, onClose, initial, onSave }: BookFormProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📒');
  const [color, setColor] = useState('#FF6B6B');

  useEffect(() => {
    if (!visible) return;
    setName(initial?.name ?? '');
    setIcon(initial?.icon ?? '📒');
    setColor(initial?.color ?? '#FF6B6B');
  }, [visible, initial]);

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({ content: '请输入账本名称', duration: 1000 });
      return;
    }
    onSave({ name: name.trim(), icon, color });
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyClassName="popup-body"
      position="bottom"
    >
      <div className="px-4 py-5 max-h-[78vh] overflow-y-auto">
        <div className="text-base font-semibold text-ink text-center mb-4">
          {initial ? '编辑账本' : '新建账本'}
        </div>

        <div className="rounded-md bg-card border border-divider p-4 mb-4">
          <div className="text-xs text-ink-tertiary mb-2">账本名称</div>
          <Input placeholder="例如：日常记账" value={name} onChange={setName} maxLength={10} />
        </div>

        <div className="rounded-md bg-card border border-divider p-4 mb-4">
          <div className="text-xs text-ink-tertiary mb-3">选择图标</div>
          <div className="grid grid-cols-6 gap-2">
            {BOOK_TEMPLATES.map((t) => (
              <button
                key={t.icon + t.name}
                className={`h-10 rounded-md flex items-center justify-center text-xl ${
                  icon === t.icon ? 'ring-2 ring-primary' : 'bg-page'
                }`}
                onClick={() => setIcon(t.icon)}
                aria-label={t.name}
              >
                {t.icon}
              </button>
            ))}
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                className={`h-10 rounded-md flex items-center justify-center text-xl ${
                  icon === e ? 'ring-2 ring-primary' : 'bg-page'
                }`}
                onClick={() => setIcon(e)}
                aria-label={e}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-card border border-divider p-4 mb-5">
          <div className="text-xs text-ink-tertiary mb-3">选择颜色</div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_PALETTE.map((c) => (
              <button
                key={c}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  color === c ? 'ring-2 ring-ink ring-offset-2' : ''
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              >
                {color === c && <span className="text-white text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <Button color="primary" className="w-full" onClick={handleSave}>
          {initial ? '保存修改' : '创建账本'}
        </Button>
      </div>
    </Popup>
  );
}