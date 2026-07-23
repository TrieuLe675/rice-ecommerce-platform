import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Wheat, AlertCircle, RefreshCw } from 'lucide-react';
import { productService } from '../../services/product.service';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const LIMIT = 10;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      const res = await productService.getAll(params);
      setProducts(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
    try {
      setDeleteLoading(true);
      await productService.delete(id);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa thất bại.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Quản Lý Sản Phẩm</h1>
          <p className="text-stone-400 text-sm mt-1">
            {pagination ? `${pagination.total} sản phẩm` : ''}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" /> Thêm Sản Phẩm
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Tìm theo tên hoặc SKU..."
          className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-stone-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-stone-400">{error}</p>
            <button onClick={fetchProducts} className="mt-3 px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-sm hover:bg-stone-700 flex items-center gap-2 mx-auto">
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <Wheat className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-400">{search ? 'Không tìm thấy sản phẩm.' : 'Chưa có sản phẩm nào.'}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="text-left px-6 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Sản Phẩm</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">SKU</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Danh Mục</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Giá</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Tồn Kho</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Wheat className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{p.name}</p>
                            <p className="text-stone-500 text-xs">{p.weight_kg}kg</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-stone-300 text-sm font-mono">{p.sku}</td>
                      <td className="px-4 py-4 text-stone-400 text-sm">{p.category_name || '–'}</td>
                      <td className="px-4 py-4 text-amber-400 font-bold text-sm text-right">{formatPrice(p.current_price)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${parseInt(p.available_qty) > 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                          {parseInt(p.available_qty) > 0 ? `${p.available_qty} khả dụng` : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                            className="p-2 text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deleteLoading}
                            className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-stone-800">
              {products.map((p) => (
                <div key={p.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                      <p className="text-stone-500 text-xs">{p.sku} • {p.category_name}</p>
                    </div>
                    <span className="text-amber-400 font-bold text-sm shrink-0">{formatPrice(p.current_price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${parseInt(p.available_qty) > 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                      {parseInt(p.available_qty) > 0 ? `Còn ${p.available_qty}` : 'Hết hàng'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="p-1.5 text-stone-400 hover:text-amber-400 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page === i + 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
