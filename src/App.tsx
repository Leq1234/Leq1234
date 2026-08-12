import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ensureSeedData } from '@/services/db';
import { useBookStore } from '@/stores/useBookStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useRecordStore } from '@/stores/useRecordStore';
import { useBudgetStore } from '@/stores/useBudgetStore';

const HomePage = lazy(() => import('@/pages/home/HomePage'));
const StatsPage = lazy(() => import('@/pages/stats/StatsPage'));
const BudgetPage = lazy(() => import('@/pages/budget/BudgetPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const AddRecordPage = lazy(() => import('@/pages/add/AddRecordPage'));
const RecordDetailPage = lazy(() => import('@/pages/detail/RecordDetailPage'));
const BooksPage = lazy(() => import('@/pages/books/BooksPage'));
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'));
const ImportPage = lazy(() => import('@/pages/import/ImportPage'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-page text-ink-secondary">
      <span className="text-5xl mb-3">🐎</span>
      <span className="text-sm">加载中…</span>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    void (async () => {
      await ensureSeedData();
      await Promise.all([
        useBookStore.getState().load(),
        useCategoryStore.getState().load(),
        useRecordStore.getState().load(),
        useBudgetStore.getState().load()
      ]);
    })();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="add" element={<AddRecordPage />} />
          <Route path="detail/:id" element={<RecordDetailPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}