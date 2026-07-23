import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { productService, categoryService } from '../../services/product.service';

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-stone-600 mt-1">{hint}</p>}
  </div>
);

const inputClass =
  'w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-all';

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    sku: '',
    description: '',
    certificates: '',
    weight_kg: '',
    current_price: '',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const catsRes = await categoryService.getAll();
        setCategories(catsRes.data || []);

        if (isEdit) {
          const prodRes = await productService.getById(id);
          const p = prodRes.data;
          setForm({
            category_id: p.category_id || '',
            name: p.name || '',
            sku: p.sku || '',
            description: p.description || '',
            certificates: p.certificates || '',
            weight_kg: p.weight_kg || '',
            current_price: p.current_price || '',
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
          });
        }
      } catch (err) {
        setError('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (isEdit) {
        await productService.update(id, form);
      } else {
        await productService.create(form);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            {isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h1>
          <p className="text-stone-400 text-sm mt-0.5">
            {isEdit ? `Đang chỉnh sửa sản phẩm #${id}` : 'Điền đầy đủ thông tin sản phẩm bên dưới'}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800 rounded-2xl text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-stone-800 pb-3">📦 Thông Tin Cơ Bản</h2>

          <Field label="Danh Mục" required>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Tên Sản Phẩm" required hint="Slug URL SEO sẽ được tự động tạo từ tên này">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="VD: Gạo ST25 Ông Cua 5kg"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Mã SKU" required hint="Mã duy nhất, không thể thay đổi sau khi tạo">
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                disabled={isEdit}
                placeholder="VD: ST25-OCUA-05KG"
                className={`${inputClass} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </Field>
            <Field label="Trọng Lượng (kg)" required>
              <input
                type="number"
                name="weight_kg"
                value={form.weight_kg}
                onChange={handleChange}
                required
                min="0.1"
                step="0.01"
                placeholder="VD: 5.00"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Giá Bán (VNĐ)" required>
            <input
              type="number"
              name="current_price"
              value={form.current_price}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              placeholder="VD: 195000"
              className={inputClass}
            />
            {isEdit && <p className="text-xs text-amber-500/80 mt-1">⚠️ Thay đổi giá sẽ tự động ghi vào lịch sử giá (price_history).</p>}
          </Field>

          <Field label="Chứng Nhận" hint="Các chứng nhận chất lượng, phân cách bằng dấu phẩy">
            <input
              type="text"
              name="certificates"
              value={form.certificates}
              onChange={handleChange}
              placeholder="VD: VietGAP, HACCP, Organic"
              className={inputClass}
            />
          </Field>

          <Field label="Mô Tả Sản Phẩm">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Mô tả chi tiết về sản phẩm..."
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {/* SEO Section */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-stone-800 pb-3">🔍 Thông Tin SEO</h2>

          <Field label="Meta Title" hint="Tối đa 60 ký tự — Hiển thị trên thanh tiêu đề trình duyệt">
            <input
              type="text"
              name="meta_title"
              value={form.meta_title}
              onChange={handleChange}
              maxLength={60}
              placeholder="VD: Gạo ST25 Ông Cua 5kg | Nông Sản Lúa Gạo"
              className={inputClass}
            />
            <p className="text-xs text-stone-600 mt-1 text-right">{form.meta_title.length}/60 ký tự</p>
          </Field>

          <Field label="Meta Description" hint="Tối đa 160 ký tự — Google hiển thị đoạn này trong kết quả tìm kiếm">
            <textarea
              name="meta_description"
              value={form.meta_description}
              onChange={handleChange}
              rows={3}
              maxLength={160}
              placeholder="VD: Gạo ST25 Ông Cua 5kg đạt chuẩn VietGAP, thơm ngon, bảo quản FIFO. Giao hàng toàn quốc."
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-stone-600 mt-1 text-right">{form.meta_description.length}/160 ký tự</p>
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link to="/admin/products" className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-sm transition-colors">
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : isEdit ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
