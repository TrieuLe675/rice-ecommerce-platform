import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminInventory from './pages/admin/AdminInventory';
import useAuthStore from './store/useAuthStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========= STOREFRONT (MainLayout) ========= */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Danh sách tất cả sản phẩm */}
          <Route path="products" element={<CategoryPage />} />
          {/* Danh mục cụ thể theo slug */}
          <Route path="categories/:slug" element={<CategoryPage />} />
          {/* Chi tiết sản phẩm theo slug */}
          <Route path="products/:slug" element={<ProductDetailPage />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="profile"
              element={
                <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                  <h1 className="text-2xl font-bold">Trang Hồ Sơ Khách Hàng</h1>
                  <p className="text-stone-500 mt-2">Sẽ được hoàn thiện ở Giai Đoạn 4.</p>
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* ========= ADMIN DASHBOARD (AdminLayout) ========= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route
            path="orders"
            element={
              <div className="text-stone-400 text-center py-16">
                <p className="text-lg font-semibold">Quản Lý Đơn Hàng — Giai Đoạn 4</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
