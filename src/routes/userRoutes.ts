// src/routes/userRoutes.ts
import { Router } from 'express';
import {
  register,
  login,
  getUserById,
  getAllUsers,
  updateStatus,
} from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Публичные маршруты
router.post('/register', register);
router.post('/login', login);

// Защищённые маршруты
router.get('/:id', authenticate, getUserById);
router.put('/:id/status', authenticate, updateStatus);

// Только для админа
router.get('/', authenticate, requireAdmin, getAllUsers);

export default router;