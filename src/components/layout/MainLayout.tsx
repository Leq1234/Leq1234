import { Outlet } from 'react-router-dom';
import TabBar from '@/components/layout/TabBar';

/** 主布局：内容区 + 底部导航（含底部安全区） */
export default function MainLayout() {
  return (
    <div className="app-container">
      <main className="pb-24">{<Outlet />}</main>
      <TabBar />
    </div>
  );
}