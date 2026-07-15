import jwt from 'jsonwebtoken';

/**
 * Middleware xác thực JWT token từ Authorization header.
 * Sau khi verify thành công, gắn thông tin user vào req.user.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Truy cập bị từ chối. Không tìm thấy token xác thực.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Token không hợp lệ.',
    });
  }
};

/**
 * Middleware kiểm tra quyền Admin.
 * Bắt buộc dùng sau verifyToken.
 */
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Truy cập bị từ chối. Chỉ Admin mới có quyền thực hiện thao tác này.',
    });
  }
  next();
};
