import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Award, Truck, RefreshCw, ArrowRight, ShieldCheck, Tag, Package2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { productService, categoryService } from '../services/product.service';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll({ limit: 8 }),
          categoryService.getAll(),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra kết nối backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Wheat className="w-4 h-4 text-amber-600" />
                <span>Nông Sản Gạo Sạch Thượng Hạng</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.15] tracking-tight">
                Tinh Hoa Lúa Gạo Việt <br />
                <span className="gold-gradient-text">Giao Tận Tay Mỗi Ngày</span>
              </h1>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Cung cấp các dòng gạo ngon nhất Việt Nam (ST25, Hương Lài, Nếp Nương). Áp dụng hệ thống quản lý kho nghiêm ngặt theo phương pháp{' '}
                <strong className="text-amber-700 font-bold">FIFO</strong> bảo đảm hạt gạo luôn tươi mới nhất.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#products" className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  Khám Phá Sản Phẩm <ArrowRight className="w-5 h-5" />
                </a>
                {!isAuthenticated && (
                  <Link to="/register" className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-300">
                    Đăng Ký Thành Viên
                  </Link>
                )}
              </div>
              <div className="pt-6 border-t border-amber-200/60 grid grid-cols-3 gap-4 text-xs font-semibold text-stone-700">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /><span>Chuẩn VietGAP</span></div>
                <div className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-amber-600 shrink-0" /><span>Kho FIFO</span></div>
                <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-emerald-600 shrink-0" /><span>Giao Tận Nơi</span></div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="w-full h-80 sm:h-[420px] rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-700 p-1 shadow-2xl">
                <div className="w-full h-full bg-stone-900/90 rounded-[22px] p-8 flex flex-col justify-between text-white overflow-hidden relative">
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl"></div>
                  <div className="space-y-4 relative z-10">
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">Sản Phẩm Nổi Bật</span>
                    <h3 className="text-3xl font-black text-amber-400">Gạo ST25 Ông Cua (Túi 5kg)</h3>
                    <p className="text-sm text-stone-300 leading-relaxed">Gạo ngon nhất thế giới — hạt dài, trong, cơm dẻo thơm hương lá dứa tự nhiên.</p>
                  </div>
                  <div className="relative z-10 pt-6 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Giá niêm yết</span>
                      <span className="text-2xl font-black text-amber-400">195.000đ</span>
                      <span className="text-xs text-stone-400 ml-1">/ túi 5kg</span>
                    </div>
                    <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-md">
                      Thêm Vào Giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-stone-900 mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-600" /> Danh Mục Sản Phẩm
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-semibold text-sm shadow hover:bg-amber-700 transition-colors">
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="px-5 py-2.5 rounded-2xl bg-white border border-amber-200 text-stone-700 font-semibold text-sm hover:bg-amber-50 hover:border-amber-400 transition-colors glass-panel"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <Package2 className="w-6 h-6 text-amber-600" /> Sản Phẩm Lúa Gạo
          </h2>
          <Link to="/products" className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="w-full h-40 bg-stone-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-stone-200 rounded mb-2"></div>
                <div className="h-4 bg-stone-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <p className="text-stone-600 font-medium">{error}</p>
            <p className="text-sm text-stone-500 mt-1">Hãy đảm bảo backend đang chạy tại port 5000</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center">
            <Wheat className="w-14 h-14 text-amber-300 mx-auto mb-4" />
            <p className="text-stone-600 font-semibold text-lg">Chưa có sản phẩm nào</p>
            <p className="text-stone-500 text-sm mt-1">Admin hãy thêm sản phẩm trong trang quản trị.</p>
            <Link to="/admin/products/new" className="mt-4 inline-block px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl text-sm hover:bg-amber-700 transition-colors">
              Thêm Sản Phẩm
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
              >
                <div className="w-full h-44 bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center relative overflow-hidden">
                  <Wheat className="w-16 h-16 text-amber-300 group-hover:scale-110 transition-transform duration-300" />
                  {parseInt(product.available_qty) === 0 && (
                    <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                      <span className="text-white font-bold text-xs px-3 py-1 bg-red-600 rounded-full">Hết hàng</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{product.category_name}</p>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">{product.name}</h3>
                  <p className="text-xs text-stone-500">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-extrabold text-amber-700">{formatPrice(product.current_price)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${parseInt(product.available_qty) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {parseInt(product.available_qty) > 0 ? `Còn ${product.available_qty}` : 'Hết'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-stone-900">Tại Sao Chọn Chúng Tôi?</h2>
          <p className="text-stone-600 mt-2">Cam kết gạo sạch, dịch vụ minh bạch và ưu đãi hấp dẫn.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Award, color: 'amber', title: 'Nguồn Gốc Cụ Thể', desc: 'Mỗi sản phẩm đều có SKU, thông tin vùng trồng và chứng nhận VietGAP/HACCP minh bạch.' },
            { icon: RefreshCw, color: 'emerald', title: 'Thuật Toán Kho FIFO', desc: 'Đơn hàng tự động xuất kho từ lô hạn sử dụng gần nhất, đảm bảo gạo không lưu kho quá hạn.' },
            { icon: Truck, color: 'amber', title: 'Giao Hàng Tận Nơi', desc: 'Vận chuyển chuyên nghiệp, đóng gói túi chống ẩm nguyên vẹn trên toàn quốc.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-panel p-6 rounded-2xl space-y-4 border border-amber-200/80 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-${color}-100 text-${color}-700 flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">{title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
