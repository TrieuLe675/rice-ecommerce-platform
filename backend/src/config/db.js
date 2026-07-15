import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL connection pool.
 * Dùng Pool thay vì Client để tái sử dụng kết nối và handle concurrent requests hiệu quả.
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'rice_ecommerce',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  // Giữ tối đa 10 kết nối, timeout sau 30s nếu không dùng
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Lắng nghe lỗi bất ngờ trên các idle client để tránh crash server
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

/**
 * Kiểm tra kết nối DB khi server khởi động.
 */
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log(`✅ PostgreSQL connected at: ${result.rows[0].now}`);
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
};

export default pool;
