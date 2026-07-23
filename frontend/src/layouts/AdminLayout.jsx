import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  Wheat, LayoutDashboard, Package2, Warehouse,
  ShoppingCart, Users, LogOut, ChevronRight, X, Menu
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tổng Quan', end: true },
  { to: '/admin/products', icon: Package2, label: 'Sản Phẩm' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Quản Lý Kho' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Đơn Hàng' },
];

export const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Wheat className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <p className="text-white font-extrabold text-base leading-tight">Admin Panel</p>
            <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider">Nông Sản Lúa Gạo</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center text-sm">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{user?.full_name}</p>
            <p className="text-stone-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-stone-900 border-r border-stone-800 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            className="lg:hidden text-stone-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-stone-400 text-sm">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <span className="hidden sm:block">Xin chào,</span>
            <span className="text-amber-400 font-bold">{user?.full_name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-stone-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
