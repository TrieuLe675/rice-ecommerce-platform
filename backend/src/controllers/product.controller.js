import pool from '../config/db.js';
import { slugify } from '../utils/slugify.js';

// Helper: Lấy tồn kho khả dụng của sản phẩm
const getAvailableQty = async (productId) => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(current_qty - locked_qty), 0) AS available_qty
     FROM inventories
     WHERE product_id = $1`,
    [productId]
  );
  return parseInt(result.rows[0].available_qty);
};

// =============================================================================
// GET /api/products — Danh sách sản phẩm (Public, có filter + pagination)
// Query params: ?category_id=1&page=1&limit=12&search=gao
// =============================================================================
export const getAllProducts = async (req, res, next) => {
  try {
    const { category_id, page = 1, limit = 12, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (category_id) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(parseInt(category_id));
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Lấy total count cho pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Lấy danh sách sản phẩm kèm tên danh mục và tồn kho khả dụng
    const result = await pool.query(
      `SELECT p.id, p.name, p.sku, p.slug, p.current_price,
              p.weight_kg, p.certificates, p.meta_title, p.meta_description,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
              COALESCE(SUM(i.current_qty - i.locked_qty), 0) AS available_qty
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN inventories i ON i.product_id = p.id
       ${whereClause}
       GROUP BY p.id, c.id
       ORDER BY p.id DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, parseInt(limit), offset]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /api/products/:id — Chi tiết sản phẩm theo ID
// =============================================================================
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              COALESCE(SUM(i.current_qty - i.locked_qty), 0) AS available_qty
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN inventories i ON i.product_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, c.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /api/products/slug/:slug — Chi tiết sản phẩm theo Slug (SEO-friendly)
// =============================================================================
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              COALESCE(SUM(i.current_qty - i.locked_qty), 0) AS available_qty
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN inventories i ON i.product_id = p.id
       WHERE p.slug = $1
       GROUP BY p.id, c.id`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// POST /api/products — Tạo sản phẩm mới (Admin only)
// =============================================================================
export const createProduct = async (req, res, next) => {
  try {
    const {
      category_id, name, sku, description,
      certificates, weight_kg, current_price,
      meta_title, meta_description,
    } = req.body;

    if (!category_id || !name || !sku || !weight_kg || current_price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu các trường bắt buộc: category_id, name, sku, weight_kg, current_price.',
      });
    }

    const slug = slugify(name);

    // Kiểm tra SKU và slug trùng
    const duplicateCheck = await pool.query(
      'SELECT id FROM products WHERE sku = $1 OR slug = $2',
      [sku.trim(), slug]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Mã SKU hoặc tên sản phẩm (slug) đã tồn tại trong hệ thống.',
      });
    }

    const result = await pool.query(
      `INSERT INTO products
         (category_id, name, sku, slug, description, certificates, weight_kg, current_price, meta_title, meta_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        parseInt(category_id), name.trim(), sku.trim().toUpperCase(), slug,
        description || null, certificates || null,
        parseFloat(weight_kg), parseFloat(current_price),
        meta_title || null, meta_description || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// PUT /api/products/:id — Cập nhật sản phẩm (Admin only)
// QUAN TRỌNG: Ghi price_history nếu current_price thay đổi
// =============================================================================
export const updateProduct = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      category_id, name, description, certificates,
      weight_kg, current_price, meta_title, meta_description,
    } = req.body;

    // Lấy sản phẩm hiện tại để so sánh giá
    const current = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    const currentProduct = current.rows[0];
    const slug = name ? slugify(name) : currentProduct.slug;

    // Kiểm tra slug trùng với sản phẩm khác
    if (name && name.trim() !== currentProduct.name) {
      const slugCheck = await client.query(
        'SELECT id FROM products WHERE slug = $1 AND id != $2',
        [slug, id]
      );
      if (slugCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Tên sản phẩm tạo ra slug "${slug}" đã tồn tại.`,
        });
      }
    }

    await client.query('BEGIN');

    // Ghi lịch sử giá nếu current_price thay đổi (Logic nghiệp vụ PHASE 2)
    const newPrice = current_price !== undefined ? parseFloat(current_price) : parseFloat(currentProduct.current_price);
    const oldPrice = parseFloat(currentProduct.current_price);

    if (Math.abs(newPrice - oldPrice) > 0.001) {
      await client.query(
        `INSERT INTO price_history (product_id, old_price, new_price, changed_by)
         VALUES ($1, $2, $3, $4)`,
        [id, oldPrice, newPrice, req.user.id]
      );
    }

    // Cập nhật sản phẩm
    const result = await client.query(
      `UPDATE products SET
         category_id = COALESCE($1, category_id),
         name = COALESCE($2, name),
         slug = $3,
         description = COALESCE($4, description),
         certificates = COALESCE($5, certificates),
         weight_kg = COALESCE($6, weight_kg),
         current_price = $7,
         meta_title = COALESCE($8, meta_title),
         meta_description = COALESCE($9, meta_description)
       WHERE id = $10
       RETURNING *`,
      [
        category_id ? parseInt(category_id) : null,
        name ? name.trim() : null,
        slug,
        description || null,
        certificates || null,
        weight_kg ? parseFloat(weight_kg) : null,
        newPrice,
        meta_title || null,
        meta_description || null,
        id,
      ]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: result.rows[0],
      priceChanged: Math.abs(newPrice - oldPrice) > 0.001,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// =============================================================================
// DELETE /api/products/:id — Xóa sản phẩm (Admin only)
// =============================================================================
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sản phẩm có trong order_items nào không (RESTRICT)
    const orderCheck = await pool.query(
      'SELECT COUNT(*) FROM order_items WHERE product_id = $1',
      [id]
    );
    if (parseInt(orderCheck.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa sản phẩm đã có trong đơn hàng. Hãy tắt sản phẩm thay vì xóa.',
      });
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id, name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa sản phẩm "${result.rows[0].name}" thành công.`,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /api/products/:id/price-history — Lịch sử thay đổi giá (Admin only)
// =============================================================================
export const getPriceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ph.*, u.full_name AS changed_by_name
       FROM price_history ph
       LEFT JOIN users u ON ph.changed_by = u.id
       WHERE ph.product_id = $1
       ORDER BY ph.effective_date DESC`,
      [id]
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};
