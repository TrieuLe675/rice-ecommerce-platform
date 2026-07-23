import { create } from 'zustand';
import authService from '../services/auth.service';

// Lấy thông tin khởi tạo từ localStorage nếu có
const initialToken = localStorage.getItem('token') || null;
let initialUser = null;
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error('Error parsing stored user:', e);
}

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,

  // Đăng nhập
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login({ email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Đăng ký
  register: async (full_name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register({ full_name, email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Kiểm tra / khôi phục auth state từ token khi reload ứng dụng
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await authService.getMe();
      const user = res.data.user;

      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      // Nếu token hết hạn hoặc không hợp lệ, xóa thông tin đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
