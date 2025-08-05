// src/types/index.ts
import { Request } from 'express'

export type Role = 'ADMIN' | 'USER'

// Расширяем Express Request
export interface AuthRequest extends Request {
	user?: {
		id: number
		role: Role
	}
}
