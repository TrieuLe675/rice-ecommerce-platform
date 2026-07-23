import pool from '../config/db.js';
import { slugify } from '../utils/slugify.js';

// =============================================================================
// GET /api/categories — Lấy toàn bộ danh mục
// =============================================================================
export const getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, meta_title, meta_description FROM categories ORDER BY name ASC'
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /api/categories/:id — Lấy chi tiết 1 danh mục
// =============================================================================
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// POST /api/categories — Tạo danh mục mới (Admin only)
// =============================================================================
export const createCategory = async (req, res, next) => {
  try {
    const { name, meta_title, meta_description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc.' });
    }

    const slug = slugify(name);

    // Kiểm tra slug trùng
    const existing = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Danh mục với slug "${slug}" đã tồn tại. Hãy chọn tên khác.`,
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, slug, meta_title, meta_description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), slug, meta_title || null, meta_description || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// PUT /api/categories/:id — Cập nhật danh mục (Admin only)
// =============================================================================
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, meta_title, meta_description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc.' });
    }

    const slug = slugify(name);

    // Kiểm tra slug trùng với category khác
    const existing = await pool.query(
      'SELECT id FROM categories WHERE slug = $1 AND id != $2',
      [slug, id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Slug "${slug}" đã được dùng bởi danh mục khác.`,
      });
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = $1, slug = $2, meta_title = $3, meta_description = $4
       WHERE id = $5
       RETURNING *`,
      [name.trim(), slug, meta_title || null, meta_description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// DELETE /api/categories/:id — Xóa danh mục (Admin only)
// PostgreSQL sẽ tự RESTRICT nếu còn sản phẩm tham chiếu (theo schema)
// =============================================================================
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra trước xem có sản phẩm nào thuộc danh mục này không
    const products = await pool.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [id]
    );
    if (parseInt(products.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển hoặc xóa các sản phẩm trước.',
      });
    }

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id, name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa danh mục "${result.rows[0].name}" thành công.`,
    });
  } catch (error) {
    next(error);
  }
};
