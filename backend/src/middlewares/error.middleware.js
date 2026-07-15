/**
 * Global error-handling middleware.
 * Express nhận ra đây là error handler vì có 4 tham số (err, req, res, next).
 * Tất cả các lỗi được next(error) sẽ được xử lý tập trung tại đây.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // Lỗi vi phạm ràng buộc unique của PostgreSQL (VD: email trùng)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Dữ liệu đã tồn tại trong hệ thống.',
    });
  }

  // Lỗi vi phạm foreign key constraint của PostgreSQL
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu tham chiếu không hợp lệ.',
    });
  }

  // Lỗi JSON parse không hợp lệ (body gửi lên sai format)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON không hợp lệ.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
      : err.message || 'Lỗi máy chủ nội bộ.';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
