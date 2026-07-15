import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Số vòng salt cho bcrypt — 12 là tiêu chuẩn cân bằng giữa bảo mật và hiệu năng
const SALT_ROUNDS = 12;

/**
 * Tạo JWT token với payload chứa thông tin cơ bản của user.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// =============================================================================
// POST /auth/register — Đăng ký tài khoản mới
// =============================================================================
export const register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    // --- Validate input ---
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: họ tên, email và mật khẩu.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
      });
    }

    // --- Kiểm tra email đã tồn tại chưa ---
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được đăng ký. Vui lòng dùng email khác.',
      });
    }

    // --- Mã hóa mật khẩu và lưu vào DB ---
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, role, created_at`,
      [full_name.trim(), email.toLowerCase().trim(), password_hash]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        token,
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// POST /auth/login — Đăng nhập
// =============================================================================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // --- Validate input ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu.',
      });
    }

    // --- Tìm user theo email ---
    const result = await pool.query(
      'SELECT id, full_name, email, password_hash, role, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      // Dùng thông báo chung để tránh lộ thông tin "email không tồn tại"
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.',
      });
    }

    const user = result.rows[0];

    // --- So sánh mật khẩu ---
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.',
      });
    }

    // --- Tạo token và trả về ---
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET /auth/me — Lấy thông tin user đang đăng nhập (Cần verifyToken)
// =============================================================================
export const getMe = async (req, res, next) => {
  try {
    // req.user được gắn vào bởi verifyToken middleware
    const result = await pool.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản người dùng.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
};
