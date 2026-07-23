import { Router } from 'express';
import {
  getAllInventories,
  getProductStock,
  createInventory,
  updateInventory,
} from '../controllers/inventory.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Đặt route cụ thể TRƯỚC route có parameter
router.get('/product/:productId', getProductStock); // Public: frontend dùng để check stock

// Admin only routes
router.get('/', verifyToken, verifyAdmin, getAllInventories);
router.post('/', verifyToken, verifyAdmin, createInventory);
router.put('/:id', verifyToken, verifyAdmin, updateInventory);

export default router;
