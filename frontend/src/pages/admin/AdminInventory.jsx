import { useState, useEffect } from 'react';
import { Warehouse, Plus, RefreshCw, AlertCircle, Loader2, X, Save, Wheat } from 'lucide-react';
import { inventoryService } from '../../services/inventory.service';
import { productService } from '../../services/product.service';

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '–';

export const AdminInventory = () => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProductId, setFilterProductId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    product_id: '',
    batch_code: '',
    mfg_date: '',
    exp_date: '',
    current_qty: '',
  });

  const fetchInventories = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filterProductId) params.product_id = filterProductId;
      const res = await inventoryService.getAll(params);
      setInventories(res.data || []);
    } catch (err) {
      setError('Không thể tải dữ liệu kho hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [filterProductId]);

  useEffect(() => {
    productService.getAll({ limit: 100 }).then((res) => setProducts(res.data || []));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFormError(null);
      await inventoryService.create(form);
      setShowForm(false);
      setForm({ product_id: '', batch_code: '', mfg_date: '', exp_date: '', current_qty: '' });
      fetchInventories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Nhập kho thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const totalAvailable = inventories.reduce((sum, inv) => sum + (inv.current_qty - inv.locked_qty), 0);
  const totalLocked = inventories.reduce((sum, inv) => sum + inv.locked_qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Quản Lý Kho Hàng</h1>
          <p className="text-stone-400 text-sm mt-1">{inventories.length} lô hàng — xuất kho theo nguyên tắc FIFO</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" /> Nhập Lô Hàng Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng Lô Hàng', value: inventories.length, color: 'amber' },
          { label: 'Khả Dụng', value: totalAvailable, color: 'emerald' },
          { label: 'Đang Giữ Chỗ', value: totalLocked, color: 'sky' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-center">
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-black text-${color}-400 mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
        >
          <option value="">Tất cả sản phẩm</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        <button onClick={fetchInventories} className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-stone-800 rounded-xl animate-pulse"></div>)}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-stone-400">{error}</p>
          </div>
        ) : inventories.length === 0 ? (
          <div className="py-16 text-center">
            <Warehouse className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-400">Kho trống. Hãy nhập lô hàng đầu tiên!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Mã Lô</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Sản Phẩm</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">NSX</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">HSD</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Tổng</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Giữ Chỗ</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Khả Dụng</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {inventories.map((inv) => {
                  const available = inv.current_qty - inv.locked_qty;
                  const expDate = new Date(inv.exp_date);
                  const daysLeft = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
                  const isExpired = daysLeft <= 0;

                  return (
                    <tr key={inv.id} className={`hover:bg-stone-800/40 transition-colors ${isExpired ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-amber-400 text-sm font-bold">{inv.batch_code}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white text-sm font-semibold">{inv.product_name}</p>
                        <p className="text-stone-500 text-xs">{inv.sku}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center text-stone-400 text-sm">{formatDate(inv.mfg_date)}</td>
                      <td className="px-4 py-3.5 text-center text-sm">
                        <span className={isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-stone-400'}>
                          {formatDate(inv.exp_date)}
                          {isExpiringSoon && !isExpired && <span className="ml-1 text-[10px]">({daysLeft}d)</span>}
                          {isExpired && <span className="ml-1 text-[10px]">(hết hạn)</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-white font-bold text-sm">{inv.current_qty}</td>
                      <td className="px-4 py-3.5 text-right text-sky-400 font-semibold text-sm">{inv.locked_qty}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-400 font-bold text-sm">{available}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isExpired ? 'bg-red-900/50 text-red-400' :
                          isExpiringSoon ? 'bg-amber-900/50 text-amber-400' :
                          available > 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-stone-800 text-stone-500'
                        }`}>
                          {isExpired ? 'Hết hạn' : isExpiringSoon ? 'Sắp hết hạn' : available > 0 ? 'Còn hàng' : 'Hết'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nhập Kho Modal/Slide-over */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-amber-400" /> Nhập Lô Hàng Mới
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Sản Phẩm *</label>
                <select name="product_id" value={form.product_id} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500">
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Mã Lô Hàng *</label>
                <input type="text" name="batch_code" value={form.batch_code} onChange={handleChange} required
                  placeholder="VD: ST25-2026-LOT001"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Ngày Sản Xuất *</label>
                  <input type="date" name="mfg_date" value={form.mfg_date} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Hạn Sử Dụng *</label>
                  <input type="date" name="exp_date" value={form.exp_date} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Số Lượng Nhập *</label>
                <input type="number" name="current_qty" value={form.current_qty} onChange={handleChange} required min="1"
                  placeholder="VD: 500"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-sm transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Đang lưu...' : 'Nhập Kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
