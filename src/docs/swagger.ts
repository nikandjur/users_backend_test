// src/docs/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'User Service API',
			version: '1.0.0',
			description: 'API for managing users',
		},
		servers: [
			{
				url: 'http://localhost:3000/api/users',
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
				User: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
						},
						fullName: {
							type: 'string',
						},
						birthDate: {
							type: 'string',
							format: 'date-time',
						},
						email: {
							type: 'string',
							format: 'email',
						},
						role: {
							type: 'string',
							enum: ['USER', 'ADMIN'],
						},
						isActive: {
							type: 'boolean',
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
						},
					},
					required: [
						'id',
						'fullName',
						'birthDate',
						'email',
						'role',
						'isActive',
					],
				},
			},
		},
		security: [],
	},
	apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec
