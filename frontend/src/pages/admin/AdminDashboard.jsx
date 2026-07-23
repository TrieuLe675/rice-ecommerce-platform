import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package2, Warehouse, ShoppingCart, TrendingUp, ArrowRight, Wheat } from 'lucide-react';
import { productService } from '../../services/product.service';
import { inventoryService } from '../../services/inventory.service';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, batches: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, inventoriesRes] = await Promise.all([
          productService.getAll({ limit: 5 }),
          inventoryService.getAll(),
        ]);
        setStats({
          products: productsRes.pagination?.total || 0,
          batches: inventoriesRes.data?.length || 0,
        });
        setRecentProducts(productsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Tổng Sản Phẩm', value: stats.products, icon: Package2, color: 'amber', link: '/admin/products' },
    { label: 'Lô Hàng Trong Kho', value: stats.batches, icon: Warehouse, color: 'emerald', link: '/admin/inventory' },
    { label: 'Đơn Hàng Hôm Nay', value: '–', icon: ShoppingCart, color: 'sky', link: '/admin/orders' },
    { label: 'Doanh Thu Tháng', value: '–', icon: TrendingUp, color: 'violet', link: '/admin/orders' },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tổng Quan Hệ Thống</h1>
        <p className="text-stone-400 text-sm mt-1">Chào mừng trở lại — Nền Tảng Nông Sản Lúa Gạo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-white text-3xl font-black mt-1">
              {loading ? <span className="text-stone-600">...</span> : value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Package2 className="w-5 h-5 text-amber-400" /> Sản Phẩm Gần Đây
          </h2>
          <Link to="/admin/products" className="text-amber-400 text-sm font-semibold hover:text-amber-300 flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-stone-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Wheat className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">Chưa có sản phẩm nào.</p>
            <Link to="/admin/products/new" className="mt-4 inline-block px-4 py-2 bg-amber-600 text-white font-semibold rounded-xl text-sm hover:bg-amber-700 transition-colors">
              + Thêm Sản Phẩm Đầu Tiên
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3 hover:bg-stone-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Wheat className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{p.name}</p>
                    <p className="text-stone-500 text-xs">{p.sku} • {p.category_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-bold text-sm">{formatPrice(p.current_price)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${parseInt(p.available_qty) > 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                    {parseInt(p.available_qty) > 0 ? `Còn ${p.available_qty}` : 'Hết hàng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
