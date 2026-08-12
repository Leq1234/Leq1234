interface ProgressBarProps {
  percent: number;
  color: string;
  height?: number;
  className?: string;
}

/** 带动画的进度条，颜色由调用方根据预算状态传入 */
export default function ProgressBar({ percent, color, height = 8, className = '' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div
      className={`w-full bg-divider rounded-full overflow-hidden ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="progress-anim h-full rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}