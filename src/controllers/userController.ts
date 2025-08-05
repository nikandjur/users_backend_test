// src/controllers/userController.ts
import { Request, Response } from 'express';
import { signToken } from '../utils/jwtUtils';
import { UserService } from '../services/userService';
import { AuthRequest } from '../types';

// 1. Регистрация пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, birthDate, email, password } = req.body;

  if (!fullName || !birthDate || !email || !password) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (isNaN(new Date(birthDate).getTime())) {
    res.status(400).json({ error: 'Invalid birthDate format' });
    return;
  }

  try {
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const user = await UserService.register(fullName, new Date(birthDate), email, password);

    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      birthDate: user.birthDate,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
};

// 2. Авторизация (логин)
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await UserService.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'User is blocked' });
      return;
    }

    const isValid = await UserService.validatePassword(password, user.password);
    
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
};

// 3. Получение пользователя по ID (сам или админ)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const requestingUser = (req as AuthRequest).user;

  if (!requestingUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const targetUser = await UserService.findById(id);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Разрешаем: если админ или это свой ID
    if (requestingUser.role !== 'ADMIN' && requestingUser.id !== targetUser.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({
      id: targetUser.id,
      fullName: targetUser.fullName,
      birthDate: targetUser.birthDate,
      email: targetUser.email,
      role: targetUser.role,
      isActive: targetUser.isActive,
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get user' });
  }
};

// 4. Получение списка пользователей (только админ)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const requestingUser = (req as AuthRequest).user;

  if (!requestingUser || requestingUser.role !== 'ADMIN') {
    res.status(403).json({ error: 'Access denied: Admins only' });
    return;
  }

  try {
    const users = await UserService.getAll();
    const response = users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      birthDate: u.birthDate,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get users' });
  }
};

// 5. Блокировка пользователя (админ или сам)
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { isActive } = req.body;
  const requestingUser = (req as AuthRequest).user;

  if (!requestingUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(id) || typeof isActive !== 'boolean') {
    res.status(400).json({ error: 'Valid ID and isActive boolean are required' });
    return;
  }

  try {
    const targetUser = await UserService.findById(id);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Проверка: админ не может заблокировать себя
    if (requestingUser.role === 'ADMIN' && requestingUser.id === id && !isActive) {
      res.status(400).json({ error: 'Admin cannot block themselves' });
      return;
    }

    // Проверка: пользователь может блокировать только себя
    if (requestingUser.role !== 'ADMIN' && requestingUser.id !== id) {
      res.status(403).json({ error: 'You can only update your own status' });
      return;
    }

    const updatedUser = await UserService.updateStatus(id, isActive);

    res.json({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update status' });
  }
};