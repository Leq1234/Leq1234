import type { Category } from '@/types/category';

interface DefaultCategorySeed {
  name: string;
  icon: string;
}

const EXPENSE_SEEDS: DefaultCategorySeed[] = [
  { name: '餐饮', icon: '🍔' },
  { name: '交通', icon: '🚌' },
  { name: '购物', icon: '🛒' },
  { name: '住房', icon: '🏠' },
  { name: '通讯', icon: '📱' },
  { name: '娱乐', icon: '🎮' },
  { name: '服饰', icon: '👔' },
  { name: '医疗', icon: '💊' },
  { name: '教育', icon: '📚' },
  { name: '礼物', icon: '🎁' },
  { name: '生活缴费', icon: '💡' },
  { name: '旅行', icon: '✈️' },
  { name: '宠物', icon: '🐱' },
  { name: '其他', icon: '🔧' }
];

const INCOME_SEEDS: DefaultCategorySeed[] = [
  { name: '工资', icon: '💰' },
  { name: '兼职', icon: '💵' },
  { name: '红包', icon: '🎁' },
  { name: '投资收益', icon: '📈' },
  { name: '报销', icon: '💸' },
  { name: '其他', icon: '🔧' }
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = EXPENSE_SEEDS.map((seed, i) => ({
  id: `exp_${i}`,
  name: seed.name,
  icon: seed.icon,
  type: 'expense',
  isCustom: false,
  sort: i
}));

export const DEFAULT_INCOME_CATEGORIES: Category[] = INCOME_SEEDS.map((seed, i) => ({
  id: `inc_${i}`,
  name: seed.name,
  icon: seed.icon,
  type: 'income',
  isCustom: false,
  sort: i
}));

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES
];

export const isDefaultCategory = (category: Category): boolean => !category.isCustom;