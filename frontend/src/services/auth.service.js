import api from './api';

export const authService = {
  // Đăng ký tài khoản
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Đăng nhập
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Lấy thông tin user hiện tại
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
