import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package2, Tag, SlidersHorizontal } from 'lucide-react';
import { productService, categoryService } from '../services/product.service';
import { Wheat, AlertCircle } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const LIMIT = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allCategoriesRes = await categoryService.getAll();
        const cats = allCategoriesRes.data || [];
        setCategories(cats);

        let categoryId = null;
        if (slug) {
          const found = cats.find((c) => c.slug === slug);
          setCategory(found || null);
          categoryId = found?.id;
        }

        const params = { page, limit: LIMIT };
        if (categoryId) params.category_id = categoryId;

        const productsRes = await productService.getAll(params);
        setProducts(productsRes.data || []);
        setPagination(productsRes.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, page]);

  const title = category ? category.name : 'Tất Cả Sản Phẩm';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link to="/" className="hover:text-amber-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-semibold">{title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Categories */}
        <aside className="lg:w-64 shrink-0">
          <div className="glass-panel rounded-2xl p-5 border border-amber-200/80">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-amber-600" /> Danh Mục
            </h3>
            <div className="space-y-1">
              <Link
                to="/products"
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!slug ? 'bg-amber-600 text-white' : 'text-stone-700 hover:bg-amber-50'}`}
              >
                Tất cả sản phẩm
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${cat.slug === slug ? 'bg-amber-600 text-white' : 'text-stone-700 hover:bg-amber-50'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
              <Package2 className="w-6 h-6 text-amber-600" /> {title}
            </h1>
            {pagination && (
              <span className="text-sm text-stone-500">{pagination.total} sản phẩm</span>
            )}
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                  <div className="w-full h-36 bg-stone-200 rounded-xl mb-3"></div>
                  <div className="h-4 bg-stone-200 rounded mb-2"></div>
                  <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="py-20 text-center">
              <Wheat className="w-14 h-14 text-amber-300 mx-auto mb-4" />
              <p className="text-stone-600 font-semibold text-lg">Không có sản phẩm nào trong danh mục này.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
                  >
                    <div className="w-full h-40 bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center relative">
                      <Wheat className="w-14 h-14 text-amber-300 group-hover:scale-110 transition-transform duration-300" />
                      {parseInt(product.available_qty) === 0 && (
                        <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                          <span className="text-white font-bold text-xs px-3 py-1 bg-red-600 rounded-full">Hết hàng</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{product.category_name}</p>
                      <h2 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">{product.name}</h2>
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

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors ${page === i + 1 ? 'bg-amber-600 text-white' : 'bg-white border border-stone-300 text-stone-700 hover:bg-amber-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
