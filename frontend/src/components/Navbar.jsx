import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wheat, ShoppingBag, User, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Wheat className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight gold-gradient-text block">
                NÔNG SẢN LÚA GẠO
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-emerald-700 uppercase block">
                Gạo Việt Thượng Hạng • FIFO Standard
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-stone-700 text-sm">
            <Link to="/" className="hover:text-amber-600 transition-colors py-1">
              Trang Chủ
            </Link>
            <a href="#products" className="hover:text-amber-600 transition-colors py-1">
              Sản Phẩm Lúa Gạo
            </a>
            <a href="#about" className="hover:text-amber-600 transition-colors py-1">
              Nguồn Gốc & Chất Lượng
            </a>
            <a href="#contact" className="hover:text-amber-600 transition-colors py-1">
              Liên Hệ
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Giỏ hàng Quick Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-amber-100/50 text-stone-700 hover:text-amber-600 transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-amber-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-300">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-stone-800 leading-tight">
                      {user?.full_name}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      {user?.role || 'Khách hàng'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-amber-600 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition-all duration-300"
                >
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-amber-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-amber-200/60 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium text-stone-800 hover:text-amber-600"
          >
            Trang Chủ
          </Link>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium text-stone-800 hover:text-amber-600"
          >
            Sản Phẩm Lúa Gạo
          </a>
          
          <div className="pt-4 border-t border-amber-200/60">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-300">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{user?.full_name}</p>
                    <p className="text-xs text-stone-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-stone-700 border border-stone-300 rounded-xl"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-white bg-amber-600 rounded-xl shadow"
                >
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
