import { getCategoryColor } from '@/utils/constants';

interface CategoryIconProps {
  icon: string;
  name: string;
  size?: number;
  className?: string;
}

/** 分类图标：emoji + 分类色圆形背景 */
export default function CategoryIcon({ icon, name, size = 40, className = '' }: CategoryIconProps) {
  const bg = getCategoryColor(name);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: bg }}
      aria-hidden="true"
    >
      <span style={{ fontSize: Math.round(size * 0.48) }}>{icon}</span>
    </span>
  );
}