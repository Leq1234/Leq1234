import { useMemo, useState } from 'react';
import { Button, Dialog, Input, Popup, Toast } from 'antd-mobile';
import { Header } from '@/components/layout';
import { CategoryGrid } from '@/components/business';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { getCategoryColor } from '@/utils/constants';
import type { RecordType } from '@/types/record';

const EMOJI_CHOICES = [
  '🍔', '🥤', '🍰', '🚌', '🚕', '⛽', '🛒', '👗', '👟', '💄',
  '🏠', '💡', '📱', '🎮', '🎬', '📚', '💊', '✈️', '🐱', '🐶',
  '💰', '💵', '💳', '📈', '🎁', '🏆', '🎨', '🧸', '⚽', '🔧'
];

const ICON_CHOICES = [...EMOJI_CHOICES, '🧾', '🍞', '☕', '🍺', '🧴', '📷', '🎧', '🖥️', '🚴', '🏋️'];

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const [type, setType] = useState<RecordType>('expense');
  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍔');

  const list = useMemo(
    () => categories.filter((c) => c.type === type).sort((a, b) => a.sort - b.sort),
    [categories, type]
  );

  const openCreate = () => {
    setName('');
    setIcon(EMOJI_CHOICES[0]);
    setFormVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ content: '请输入分类名称', duration: 1000 });
      return;
    }
    await addCategory(name.trim(), icon, type);
    setFormVisible(false);
    Toast.show({ content: '分类已添加', duration: 800 });
  };

  const handleDelete = async (id: string, categoryName: string) => {
    const confirmed = await Dialog.confirm({
      content: `删除分类「${categoryName}」？`,
      confirmText: '删除',
      cancelText: '取消'
    });
    if (!confirmed) return;
    try {
      await deleteCategory(id);
      Toast.show({ content: '分类已删除', duration: 800 });
    } catch (err) {
      Toast.show({ content: (err as Error).message, duration: 1500 });
    }
  };

  return (
    <div>
      <Header
        title="分类管理"
        isBack
        right={
          <button
            className="w-9 h-9 rounded-full bg-primary text-white text-xl shadow-fab btn-press"
            onClick={openCreate}
            aria-label="新建分类"
          >
            +
          </button>
        }
      />

      <div className="mt-3">
        <div className="flex rounded-full bg-divider p-1 mx-4">
          {(
            [
              { value: 'expense', label: '支出', active: 'bg-expense' },
              { value: 'income', label: '收入', active: 'bg-income' }
            ] as const
          ).map((item) => {
            const active = type === item.value;
            return (
              <button
                key={item.value}
                className={`flex-1 h-9 rounded-full text-sm font-medium transition-all btn-press ${
                  active ? `${item.active} text-white shadow-card` : 'text-ink-secondary'
                }`}
                onClick={() => setType(item.value)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-md bg-card p-4 shadow-card">
        <CategoryGrid
          categories={list}
          selectedId=""
          onSelect={() => {}}
        />
      </div>

      <div className="mx-4 mt-3 rounded-md bg-card p-4 shadow-card">
        <h3 className="text-sm font-semibold text-ink mb-3">自定义分类</h3>
        {list.filter((c) => c.isCustom).length === 0 ? (
          <div className="text-sm text-ink-tertiary text-center py-6">暂无自定义分类</div>
        ) : (
          <div className="space-y-2">
            {list
              .filter((c) => c.isCustom)
              .map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-3 py-2.5 rounded-md bg-page">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ backgroundColor: getCategoryColor(cat.name) }}
                    >
                      {cat.icon}
                    </span>
                    <span className="text-sm text-ink">{cat.name}</span>
                  </div>
                  <button
                    className="text-xs text-expense px-2 py-1 rounded-full bg-expense/10 btn-press"
                    onClick={() => void handleDelete(cat.id, cat.name)}
                  >
                    删除
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <Popup
        visible={formVisible}
        onMaskClick={() => setFormVisible(false)}
        bodyClassName="popup-body"
        position="bottom"
      >
        <div className="px-4 py-5 max-h-[78vh] overflow-y-auto">
          <div className="text-base font-semibold text-ink text-center mb-4">
            新建{type === 'expense' ? '支出' : '收入'}分类
          </div>
          <div className="rounded-md bg-card border border-divider p-4 mb-4">
            <div className="text-xs text-ink-tertiary mb-2">分类名称</div>
            <Input
              placeholder="例如：零食"
              value={name}
              onChange={setName}
              maxLength={6}
            />
          </div>
          <div className="rounded-md bg-card border border-divider p-4 mb-5">
            <div className="text-xs text-ink-tertiary mb-3">选择图标</div>
            <div className="grid grid-cols-6 gap-2">
              {ICON_CHOICES.map((e) => (
                <button
                  key={e}
                  className={`h-10 rounded-md flex items-center justify-center text-xl ${
                    icon === e ? 'ring-2 ring-primary' : 'bg-page'
                  }`}
                  onClick={() => setIcon(e)}
                  aria-label={e}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Button color="primary" className="w-full" onClick={() => void handleSave()}>
            保存分类
          </Button>
        </div>
      </Popup>
    </div>
  );
}