import { create } from 'zustand';
import { storageGet, storageSet } from '@/utils/storage';

type ThemeMode = 'light' | 'dark';

interface SettingState {
  theme: ThemeMode;
  currency: string;
  firstDayOfWeek: 0 | 1;
  setTheme: (theme: ThemeMode) => void;
  setCurrency: (currency: string) => void;
  setFirstDayOfWeek: (day: 0 | 1) => void;
}

const KEY = 'heima-settings';

export const useSettingStore = create<SettingState>((set) => {
  const saved = storageGet<Partial<SettingState>>(KEY, {});
  return {
    theme: saved.theme ?? 'light',
    currency: saved.currency ?? 'CNY',
    firstDayOfWeek: saved.firstDayOfWeek ?? 1,
    setTheme: (theme) => {
      set({ theme });
      storageSet(KEY, { ...useSettingStore.getState(), theme });
    },
    setCurrency: (currency) => {
      set({ currency });
      storageSet(KEY, { ...useSettingStore.getState(), currency });
    },
    setFirstDayOfWeek: (firstDayOfWeek) => {
      set({ firstDayOfWeek });
      storageSet(KEY, { ...useSettingStore.getState(), firstDayOfWeek });
    }
  };
});