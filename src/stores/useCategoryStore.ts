import { create } from 'zustand';
import { db } from '@/services/db';
import type { Category } from '@/types/category';
import { genId } from '@/utils/constants';

interface CategoryState {
  categories: Category[];
  loaded: boolean;
  load: () => Promise<void>;
  addCategory: (name: string, icon: string, type: Category['type']) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loaded: false,

  load: async () => {
    const categories = await db.categories.toArray();
    set({ categories, loaded: true });
  },

  addCategory: async (name, icon, type) => {
    const catsOfType = get().categories.filter((c) => c.type === type);
    const maxSort = catsOfType.reduce((m, c) => Math.max(m, c.sort), 0);
    const category: Category = {
      id: genId(),
      name,
      icon,
      type,
      isCustom: true,
      sort: maxSort + 1
    };
    await db.categories.add(category);
    set({ categories: [...get().categories, category] });
    return category;
  },

  deleteCategory: async (id) => {
    const used = await db.records.where('categoryId').equals(id).count();
    if (used > 0) throw new Error(`该分类下还有 ${used} 条记录，请先处理`);
    await db.categories.delete(id);
    set({ categories: get().categories.filter((c) => c.id !== id) });
  }
}));

export const useCategoryMap = (): Map<string, Category> => {
  const categories = useCategoryStore((s) => s.categories);
  return new Map(categories.map((c) => [c.id, c]));
};