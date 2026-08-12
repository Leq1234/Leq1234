import { NavLink, Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface TabItem {
  to: string;
  label: string;
  icon: string;
}

const LEFT_TABS: TabItem[] = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/stats', label: '统计', icon: '📊' }
];

const RIGHT_TABS: TabItem[] = [
  { to: '/budget', label: '预算', icon: '💰' },
  { to: '/profile', label: '我的', icon: '👤' }
];

/** 底部导航栏：4 个 Tab + 中间浮出的"+"按钮 */
export default function TabBar() {
  const location = useLocation();

  const renderTab = (tab: TabItem) => {
    const active = location.pathname === tab.to;
    return (
      <NavLink
        key={tab.to}
        to={tab.to}
        className="flex flex-col items-center justify-center flex-1 gap-0.5"
      >
        <span
          className={cn('text-[22px] leading-none transition-transform', active && 'scale-110')}
          aria-hidden="true"
        >
          {tab.icon}
        </span>
        <span
          className={cn(
            'text-[11px] leading-4',
            active ? 'text-primary font-semibold' : 'text-ink-tertiary'
          )}
        >
          {tab.label}
        </span>
      </NavLink>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      aria-label="底部导航"
    >
      <div className="mx-auto max-w-[480px] px-2 flex items-stretch bg-card shadow-tabbar rounded-t-lg h-14 relative">
          {LEFT_TABS.map(renderTab)}
          <div className="relative flex-1 flex items-center justify-center">
            <Link
              to="/add"
              className="absolute -top-3 w-12 h-12 rounded-full bg-primary text-white text-2xl flex items-center justify-center shadow-fab btn-press"
              aria-label="记一笔"
            >
              +
            </Link>
            <span className="text-[11px] text-ink-tertiary mt-6">记一笔</span>
          </div>
          {RIGHT_TABS.map(renderTab)}
        </div>
    </nav>
  );
}