// src/routes/userRoutes.ts
import { Router } from 'express'
import {
	register,
	login,
	getUserById,
	getAllUsers,
	updateStatus,
} from '../controllers/userController'
import { authenticate, requireAdmin } from '../middleware/authMiddleware'

const router = Router()

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user (role = USER)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - birthDate
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Иван Иванов"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fullName:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date-time
 *                 email:
 *                   type: string
 *                   format: email
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN]
 *                 isActive:
 *                   type: boolean
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already in use
 */
router.post('/register', register)

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Bearer token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Invalid credentials or account blocked
 */
router.post('/login', login)

/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Get user by ID (self or admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, getUserById)

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get list of all users (admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admins only.
 */
router.get('/', authenticate, requireAdmin, getAllUsers)

/**
 * @openapi
 * /{id}/status:
 *   put:
 *     summary: Update user status (activate/deactivate) - self or admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or admin cannot block themselves
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot update another user's status
 *       404:
 *         description: User not found
 */
router.put('/:id/status', authenticate, updateStatus)

export default router
