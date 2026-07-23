import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Wheat, ShoppingCart, Tag, Package2,
  Weight, Award, AlertCircle, CheckCircle2, Loader2,
  History, ChevronRight,
} from 'lucide-react';
import { productService } from '../services/product.service';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(dateStr));

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getBySlug(slug);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Không tìm thấy sản phẩm.' : 'Lỗi tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-stone-700 font-semibold text-lg">{error}</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-colors">
          Quay lại
        </button>
      </div>
    );
  }

  const isAvailable = parseInt(product.available_qty) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-600">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        {product.category_name && (
          <>
            <Link to={`/categories/${product.category_slug}`} className="hover:text-amber-600">{product.category_name}</Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-stone-800 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-emerald-50 rounded-3xl flex items-center justify-center shadow-inner border border-amber-200/60 relative overflow-hidden">
            <Wheat className="w-36 h-36 text-amber-300" />
            {!isAvailable && (
              <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center rounded-3xl">
                <span className="text-white font-black text-2xl bg-red-600 px-6 py-3 rounded-2xl shadow-lg">Hết Hàng</span>
              </div>
            )}
          </div>
          {product.certificates && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.certificates.split(',').map((cert) => (
                <span key={cert} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3" /> {cert.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category_name && (
              <Link to={`/categories/${product.category_slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 hover:text-amber-800">
                <Tag className="w-4 h-4" /> {product.category_name}
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-stone-500 mt-1">SKU: <span className="font-semibold text-stone-700">{product.sku}</span></p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 py-4 border-y border-amber-200/60">
            <span className="text-4xl font-black text-amber-700">{formatPrice(product.current_price)}</span>
          </div>

          {/* Stock Status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${isAvailable ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-sm">Còn hàng</p>
                  <p className="text-xs text-emerald-600">{product.available_qty} sản phẩm khả dụng</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-sm">Hết hàng</p>
                  <p className="text-xs text-red-600">Sản phẩm tạm thời không khả dụng</p>
                </div>
              </>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel rounded-2xl p-4 border border-amber-200/60">
              <Weight className="w-5 h-5 text-amber-600 mb-1" />
              <p className="text-xs text-stone-500">Trọng lượng</p>
              <p className="font-bold text-stone-900">{product.weight_kg} kg</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-amber-200/60">
              <Package2 className="w-5 h-5 text-amber-600 mb-1" />
              <p className="text-xs text-stone-500">Mã SKU</p>
              <p className="font-bold text-stone-900 text-sm">{product.sku}</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            disabled={!isAvailable}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-lg rounded-2xl shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-6 h-6" />
            {isAvailable ? 'Thêm Vào Giỏ Hàng' : 'Hết Hàng'}
          </button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 glass-panel rounded-2xl p-8 border border-amber-200/80">
          <h2 className="text-xl font-extrabold text-stone-900 mb-4 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-amber-600" /> Mô Tả Sản Phẩm
          </h2>
          <div className="prose prose-stone max-w-none text-stone-700 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
