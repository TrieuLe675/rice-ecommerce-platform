import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/useAuthStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Tự động xác thực token JWT khi tải ứng dụng
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected Customer Routes (Dành cho người dùng đã đăng nhập) */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="profile"
              element={
                <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                  <h1 className="text-2xl font-bold">Trang Hồ Sơ Khách Hàng</h1>
                </div>
              }
            />
          </Route>

          {/* Protected Admin Routes (Dành cho Admin) */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route
              path="admin"
              element={
                <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
