export const MAX_NOTE_LENGTH = 50;

export const genId = (): string => {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const CATEGORY_COLORS: Record<string, string> = {
  餐饮: '#FF6B6B',
  交通: '#6C9BCF',
  购物: '#FFD93D',
  住房: '#A084DC',
  通讯: '#74B9FF',
  娱乐: '#FF9FF3',
  服饰: '#FECA57',
  医疗: '#4ECDC4',
  教育: '#48DBFB',
  礼物: '#FF6348',
  生活缴费: '#A29BFE',
  旅行: '#55E6C1',
  宠物: '#FDCB6E',
  工资: '#51CF66',
  兼职: '#FF922B',
  红包: '#FF6348',
  投资收益: '#6C9BCF',
  报销: '#A084DC'
};

export const FALLBACK_COLOR = '#B2BEC3';

export const CATEGORY_PALETTE = [
  '#FF6B6B',
  '#6C9BCF',
  '#FFD93D',
  '#A084DC',
  '#74B9FF',
  '#FF9FF3',
  '#FECA57',
  '#4ECDC4',
  '#48DBFB',
  '#FF6348',
  '#A29BFE',
  '#55E6C1',
  '#FDCB6E',
  '#636E72'
];

export function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLOR;
}

export const BOOK_TEMPLATES = [
  { icon: '📒', name: '日常记账', color: '#FF6B6B' },
  { icon: '✈️', name: '旅行账本', color: '#6C9BCF' },
  { icon: '🏠', name: '家庭开支', color: '#A084DC' },
  { icon: '📋', name: '项目专用', color: '#55E6C1' },
  { icon: '🎓', name: '学习开支', color: '#FFD93D' },
  { icon: '🛍️', name: '购物专属', color: '#FF9FF3' }
];

export const AVATAR_LIST = [
  '🐎', '🐱', '🐶', '🐰', '🐼', '🦊', '🐻', '🐸',
  '🦁', '🐯', '🐮', '🐷', '🐹', '🐨', '🦄', '🐙',
  '🍉', '🍓', '⭐', '🌈', '🌸', '🔥', '💎', '😊'
];

export const EMOJI_LIST = [
  '📒', '✈️', '🏠', '📋', '🎓', '🛍️', '🍽️', '🐱', '🐶', '🎁',
  '💼', '🚗', '🏥', '🎮', '📱', '👶', '💍', '🎵', '⚽', '🌊'
];

export const CURRENCIES = [
  { value: 'CNY', label: '¥ 人民币' },
  { value: 'USD', label: '$ 美元' },
  { value: 'EUR', label: '€ 欧元' },
  { value: 'JPY', label: '¥ 日元' }
];

export const CURRENCY_SYMBOL: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥'
};