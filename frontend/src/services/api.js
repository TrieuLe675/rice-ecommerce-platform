import axios from 'axios';

// baseURL ưu tiên lấy từ ENV nếu có, mặc định trỏ về backend port 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Tự động đính kèm Token JWT nếu có trong localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi toàn cục (ví dụ Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu API trả về 401 (Unauthorized) và không phải là request đăng nhập/đăng ký
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/register')
    ) {
      // Xóa token hết hạn và thông tin user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
