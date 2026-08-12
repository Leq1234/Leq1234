import { Button } from 'antd-mobile';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  desc?: string;
  actionText?: string;
  onAction?: () => void;
}

/** 空状态占位：插画 + 文字 + 引导按钮 */
export default function EmptyState({
  emoji = '🐱',
  title,
  desc,
  actionText,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-[56px] leading-none mb-4">{emoji}</div>
      <div className="text-lg font-semibold text-ink mb-1">{title}</div>
      {desc && <div className="text-sm text-ink-tertiary mb-6">{desc}</div>}
      {actionText && onAction && (
        <Button color="primary" fill="outline" size="small" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}