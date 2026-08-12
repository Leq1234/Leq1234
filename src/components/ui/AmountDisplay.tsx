import type { RecordType } from '@/types/record';
import { formatCurrency, formatSigned } from '@/utils/amount';

interface AmountDisplayProps {
  fen: number;
  type?: RecordType;
  showSign?: boolean;
  showSymbol?: boolean;
  className?: string;
}

/** 金额显示组件：根据收支类型着色，可选正负号 */
export default function AmountDisplay({
  fen,
  type,
  showSign = false,
  showSymbol = true,
  className = ''
}: AmountDisplayProps) {
  const color = type === 'income' ? 'text-income' : type === 'expense' ? 'text-expense' : 'text-ink';
  const text = showSymbol
    ? formatCurrency(Math.abs(fen))
    : `${Math.abs(fen) / 100}`;
  const signed = showSign && type ? formatSigned(fen, type === 'income') : text;
  return <span className={`${color} ${className}`}>{signed}</span>;
}