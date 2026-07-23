import api from './api';

export const inventoryService = {
  // Lấy tất cả lô hàng (Admin) — có thể filter theo product_id
  async getAll(params = {}) {
    const response = await api.get('/inventories', { params });
    return response.data;
  },

  // Tổng tồn kho khả dụng của 1 sản phẩm (Public)
  async getProductStock(productId) {
    const response = await api.get(`/inventories/product/${productId}`);
    return response.data;
  },

  // Nhập lô hàng mới (Admin)
  async create(data) {
    const response = await api.post('/inventories', data);
    return response.data;
  },

  // Cập nhật lô hàng (Admin)
  async update(id, data) {
    const response = await api.put(`/inventories/${id}`, data);
    return response.data;
  },
};

export default inventoryService;
