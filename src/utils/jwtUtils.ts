import jwt from 'jsonwebtoken'
import { User, Role } from '@prisma/client'

const getJwtSecret = (): string => {
	const secret = process.env.JWT_SECRET
	if (!secret) throw new Error('JWT_SECRET is not defined')
	return secret
}

const isValidRole = (role: string | undefined): role is Role =>
	role === Role.ADMIN || role === Role.USER

export const signToken = (user: User): string => {
	const payload = {
		id: user.id,
		role: user.role,
	}
	return jwt.sign(payload, getJwtSecret(), { expiresIn: '24h' })
}

export const verifyToken = (token: string) => {
	const decoded = jwt.verify(token, getJwtSecret()) as {
		id?: number
		role?: string
	}

	if (typeof decoded.id !== 'number' || !isValidRole(decoded.role)) {
		throw new Error('Invalid token')
	}

	return {
		id: decoded.id,
		role: decoded.role,
	}
}
