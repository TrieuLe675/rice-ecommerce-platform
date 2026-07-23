import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceHistory,
} from '../controllers/product.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);  // Phải đặt TRƯỚC /:id để không bị conflict
router.get('/:id', getProductById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, createProduct);
router.put('/:id', verifyToken, verifyAdmin, updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.get('/:id/price-history', verifyToken, verifyAdmin, getPriceHistory);

export default router;
