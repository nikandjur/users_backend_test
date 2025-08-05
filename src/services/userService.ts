// src/services/userService.ts
import { PrismaClient, User } from '@prisma/client'
import { hashPassword } from '../utils/passwordUtils'
import { verifyPassword } from '../utils/passwordUtils'

const prisma = new PrismaClient()

// Чистые функции
const register = async (
	fullName: string,
	birthDate: Date,
	email: string,
	password: string,
	role: 'ADMIN' | 'USER' = 'USER'
): Promise<User> => {
	const hashedPassword = await hashPassword(password)
	return prisma.user.create({
		data: {
			fullName,
			birthDate,
			email,
			password: hashedPassword,
			role,
			isActive: true,
		},
	})
}

const findByEmail = async (email: string): Promise<User | null> => {
	return prisma.user.findUnique({
		where: { email },
	})
}

const findById = async (id: number): Promise<User | null> => {
	return prisma.user.findUnique({
		where: { id },
	})
}

const getAll = async (): Promise<User[]> => {
	return prisma.user.findMany()
}

const updateStatus = async (id: number, isActive: boolean): Promise<User> => {
	return prisma.user.update({
		where: { id },
		data: { isActive },
	})
}

const validatePassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return await verifyPassword(password, hashedPassword)
}


export const UserService = {
	register,
	findByEmail,
	findById,
	getAll,
	updateStatus,
	validatePassword,
}

export default UserService
