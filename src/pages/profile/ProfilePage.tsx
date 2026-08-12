import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Popup, Toast } from 'antd-mobile';
import { Header } from '@/components/layout';
import { useRecordStore } from '@/stores/useRecordStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useSettingStore } from '@/stores/useSettingStore';
import { exportRecordsToCsv } from '@/services/exportService';
import { CURRENCIES } from '@/utils/constants';

interface MenuEntry {
  icon: string;
  label: string;
  desc: string;
  action?: () => void;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const records = useRecordStore((s) => s.records);
  const categories = useCategoryStore((s) => s.categories);
  const currency = useSettingStore((s) => s.currency);
  const setCurrency = useSettingStore((s) => s.setCurrency);
  const [currencyVisible, setCurrencyVisible] = useState(false);

  const menu: MenuEntry[] = [
    {
      icon: '📒',
      label: '账本管理',
      desc: '创建、切换与管理账本',
      action: () => navigate('/books')
    },
    {
      icon: '🗂️',
      label: '分类管理',
      desc: '自定义你的收支分类',
      action: () => navigate('/categories')
    },
    {
      icon: '📥',
      label: '账单导入',
      desc: '从支付宝 / 微信导入账单',
      action: () => navigate('/import')
    },
    {
      icon: '📤',
      label: '数据导出',
      desc: `导出 ${records.length} 条记录为 CSV`,
      action: () => {
        if (records.length === 0) {
          Toast.show({ content: '暂无记录可导出', duration: 1000 });
          return;
        }
        exportRecordsToCsv(records, categories);
        Toast.show({ content: '已导出 CSV 文件', duration: 1000 });
      }
    },
    {
      icon: '💱',
      label: '货币单位',
      desc: `当前使用 ${currency}`,
      action: () => setCurrencyVisible(true)
    },
    {
      icon: '🐎',
      label: '关于黑马记账',
      desc: 'v1.0.0 · 本地数据 · 无需登录',
      action: () =>
        void Dialog.alert({
          content: '黑马记账 v1.0.0\n面向个人的轻量级 H5 记账应用，数据仅保存在本机浏览器中。',
          confirmText: '好的'
        })
    }
  ];

  return (
    <div>
      <Header title="我的" isBack={false} />

      <div className="mx-4 mt-3 rounded-lg bg-card p-5 shadow-card flex items-center gap-4">
        <span
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-peach flex items-center justify-center text-3xl shadow-card"
          aria-hidden="true"
        >
          🐎
        </span>
        <div>
          <div className="text-lg font-bold text-ink">记账小能手</div>
          <div className="text-xs text-ink-tertiary mt-1">
            已记录 {records.length} 笔 · 坚持记账每一天
          </div>
        </div>
      </div>

      <section className="mx-4 mt-3 rounded-lg bg-card shadow-card divide-y divide-divider overflow-hidden">
        {menu.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-page btn-press"
            onClick={item.action}
          >
            <span className="text-xl w-8 text-center shrink-0" aria-hidden="true">
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink">{item.label}</div>
              <div className="text-xs text-ink-tertiary mt-0.5 truncate">{item.desc}</div>
            </div>
            <span className="text-ink-tertiary text-lg leading-none">›</span>
          </button>
        ))}
      </section>

      <p className="text-center text-xs text-ink-tertiary mt-6 pb-6">
        黑马记账 · 你的私人小金库
      </p>

      <Popup
        visible={currencyVisible}
        onMaskClick={() => setCurrencyVisible(false)}
        bodyClassName="popup-body"
        position="bottom"
      >
        <div className="px-4 py-5">
          <div className="text-base font-semibold text-ink text-center mb-4">选择货币单位</div>
          <div className="divide-y divide-divider rounded-md bg-card border border-divider overflow-hidden">
            {CURRENCIES.map((item) => (
              <button
                key={item.value}
                className="w-full flex items-center justify-between px-4 py-3.5 btn-press active:bg-page"
                onClick={() => {
                  setCurrency(item.value);
                  setCurrencyVisible(false);
                  Toast.show({ content: `已切换为 ${item.label}`, duration: 800 });
                }}
              >
                <span className="text-sm text-ink">{item.label}</span>
                <span
                  className={`text-base ${
                    currency === item.value ? 'text-primary' : 'text-ink-tertiary'
                  }`}
                >
                  {currency === item.value ? '●' : '○'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  );
}