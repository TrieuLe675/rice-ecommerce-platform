import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================================================
// Middleware toàn cục
// =============================================================================

// Bảo mật HTTP headers (ngăn chặn XSS, Clickjacking, MIME sniffing...)
app.use(helmet());

// Cho phép Cross-Origin requests từ Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body (form data)
app.use(express.urlencoded({ extended: true }));

// =============================================================================
// Routes
// =============================================================================

// Health check endpoint — dùng để kiểm tra server có sống không
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running 🚀' });
});

// Auth routes — tiền tố /api/auth
app.use('/api/auth', authRoutes);

// 404 handler — các route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
  });
});

// =============================================================================
// Global Error Handler (phải đặt CUỐI CÙNG)
// =============================================================================
app.use(errorHandler);

// =============================================================================
// Khởi động server
// =============================================================================
const startServer = async () => {
  // Kết nối DB trước, sau đó mới bắt đầu lắng nghe request
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
};

startServer();
