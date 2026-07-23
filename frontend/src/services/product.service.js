import api from './api';

export const productService = {
  // Danh sách sản phẩm (có filter và pagination)
  async getAll(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Chi tiết theo ID
  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Chi tiết theo Slug (SEO)
  async getBySlug(slug) {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Tạo sản phẩm mới (Admin)
  async create(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Cập nhật sản phẩm (Admin)
  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Xóa sản phẩm (Admin)
  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Lịch sử giá (Admin)
  async getPriceHistory(id) {
    const response = await api.get(`/products/${id}/price-history`);
    return response.data;
  },
};

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default productService;
