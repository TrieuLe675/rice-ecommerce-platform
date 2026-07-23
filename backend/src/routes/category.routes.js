import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, createCategory);
router.put('/:id', verifyToken, verifyAdmin, updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory);

export default router;
