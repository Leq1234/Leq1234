import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  isBack?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
}

/** 页面头部：标题 + 可选返回按钮 + 右侧操作 */
export default function Header({ title, isBack = true, right, onBack }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between h-12 px-2">
        <div className="flex items-center flex-1 min-w-0">
          {isBack && (
            <button
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full active:bg-page text-ink btn-press"
              onClick={() => (onBack ? onBack() : navigate(-1))}
              aria-label="返回"
            >
              <span className="text-lg leading-none">‹</span>
            </button>
          )}
          <span className="text-base font-semibold text-ink truncate">{title}</span>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}