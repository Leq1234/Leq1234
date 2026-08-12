interface NumberKeyboardProps {
  onKey: (key: string) => void;
  onDateClick: () => void;
  onDone: () => void;
}

/** 记账数字键盘：数字 + 小数点 + 退格 + 日期入口 + 完成 */
export default function NumberKeyboard({ onKey, onDateClick, onDone }: NumberKeyboardProps) {
  const Key = ({ value, onClick, className = '', label }: {
    value?: string;
    onClick?: () => void;
    className?: string;
    label?: string;
  }) => (
    <button
      type="button"
      className={`h-12 rounded-md bg-card text-xl font-medium text-ink shadow-card flex items-center justify-center key-num ${className}`}
      onClick={() => (onClick ? onClick() : value && onKey(value))}
    >
      {label ?? value}
    </button>
  );

  return (
    <div className="bg-page px-3 pt-2 pb-3">
      <div className="grid grid-cols-4 gap-2">
        <Key value="1" />
        <Key value="2" />
        <Key value="3" />
        <Key label="⌫" onClick={() => onKey('backspace')} className="text-ink-secondary" />

        <Key value="4" />
        <Key value="5" />
        <Key value="6" />
        <button
          type="button"
          className="row-span-3 rounded-md bg-primary text-white text-base font-semibold shadow-fab btn-press"
          onClick={onDone}
        >
          完成
        </button>

        <Key value="7" />
        <Key value="8" />
        <Key value="9" />

        <Key value="." className="text-ink-secondary" />
        <Key value="0" />
        <Key label="📅 日期" onClick={onDateClick} className="text-sm text-ink-secondary" />
      </div>
    </div>
  );
}