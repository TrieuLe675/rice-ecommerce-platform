import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wheat, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 hero-gradient">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-xl shadow-amber-900/5 relative overflow-hidden border border-amber-200/80">
          
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30 mb-4 transform hover:scale-105 transition-transform duration-300">
              <Wheat className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Đăng Nhập
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Chào mừng bạn trở lại với <span className="font-semibold text-amber-700">Nông Sản Lúa Gạo</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/90 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <a href="#forgot" className="text-xs text-amber-700 hover:text-amber-800 font-semibold">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/90 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 group cursor-pointer"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Đăng Nhập Nghay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Features Highlights */}
          <div className="mt-8 pt-6 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-center text-xs text-stone-600 font-medium">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Gạo Sạch FIFO
            </div>
            <div className="flex items-center justify-center gap-1.5 text-amber-700">
              <CheckCircle2 className="w-4 h-4" /> Bảo Mật JWT
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm text-stone-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-amber-700 hover:text-amber-800 underline">
              Tạo tài khoản mới
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
