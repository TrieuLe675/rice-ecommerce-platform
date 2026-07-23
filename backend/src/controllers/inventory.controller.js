import pool from '../config/db.js';

// =============================================================================
// GET /api/inventories — Toàn bộ lô hàng (Admin only)
// Query params: ?product_id=1
// =============================================================================
export const getAllInventories = async (req, res, next) => {
  try {
    const { product_id } = req.query;

    let query = `
      SELECT i.*, p.name AS product_name, p.sku,
             (i.current_qty - i.locked_qty) AS available_qty
      FROM inventories i
      LEFT JOIN products p ON i.product_id = p.id
    `;
    const params = [];

    if (product_id) {
      query += ' WHERE i.product_id = $1';
      params.push(parseInt(product_id));
    }

    query += ' ORDER BY i.exp_date ASC'; // FIFO: hạn gần nhất lên đầu

    const result = await pool.query(query, params);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /api/inventories/product/:productId — Tổng tồn kho khả dụng của 1 sản phẩm
// =============================================================================
export const getProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT
         product_id,
         COALESCE(SUM(current_qty), 0) AS total_qty,
         COALESCE(SUM(locked_qty), 0) AS total_locked,
         COALESCE(SUM(current_qty - locked_qty), 0) AS available_qty,
         COUNT(*) AS batch_count
       FROM inventories
       WHERE product_id = $1
       GROUP BY product_id`,
      [productId]
    );

    const stockInfo = result.rows[0] || {
      product_id: parseInt(productId),
      total_qty: 0,
      total_locked: 0,
      available_qty: 0,
      batch_count: 0,
    };

    return res.status(200).json({ success: true, data: stockInfo });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// POST /api/inventories — Nhập lô hàng mới (Admin only)
// =============================================================================
export const createInventory = async (req, res, next) => {
  try {
    const { product_id, batch_code, mfg_date, exp_date, current_qty } = req.body;

    if (!product_id || !batch_code || !mfg_date || !exp_date || current_qty === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu các trường bắt buộc: product_id, batch_code, mfg_date, exp_date, current_qty.',
      });
    }

    if (parseInt(current_qty) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng nhập kho phải lớn hơn 0.',
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await pool.query('SELECT id, name FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    // Kiểm tra mã lô trùng
    const batchCheck = await pool.query(
      'SELECT id FROM inventories WHERE batch_code = $1',
      [batch_code.trim()]
    );
    if (batchCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Mã lô "${batch_code}" đã tồn tại. Vui lòng sử dụng mã lô khác.`,
      });
    }

    const result = await pool.query(
      `INSERT INTO inventories (product_id, batch_code, mfg_date, exp_date, current_qty, locked_qty)
       VALUES ($1, $2, $3, $4, $5, 0)
       RETURNING *`,
      [
        parseInt(product_id),
        batch_code.trim().toUpperCase(),
        mfg_date,
        exp_date,
        parseInt(current_qty),
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Nhập lô hàng thành công cho sản phẩm "${product.rows[0].name}".`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// PUT /api/inventories/:id — Cập nhật số lượng lô hàng (Admin only)
// =============================================================================
export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { current_qty, mfg_date, exp_date } = req.body;

    const existing = await pool.query('SELECT * FROM inventories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lô hàng.' });
    }

    const inv = existing.rows[0];

    // Đảm bảo current_qty không được nhỏ hơn locked_qty
    const newQty = current_qty !== undefined ? parseInt(current_qty) : inv.current_qty;
    if (newQty < inv.locked_qty) {
      return res.status(400).json({
        success: false,
        message: `Số lượng tồn kho (${newQty}) không được nhỏ hơn số lượng đang giữ chỗ (${inv.locked_qty}).`,
      });
    }

    const result = await pool.query(
      `UPDATE inventories
       SET current_qty = $1, mfg_date = COALESCE($2, mfg_date), exp_date = COALESCE($3, exp_date)
       WHERE id = $4
       RETURNING *`,
      [newQty, mfg_date || null, exp_date || null, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật lô hàng thành công!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
