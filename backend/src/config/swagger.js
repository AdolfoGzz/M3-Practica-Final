import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'A simple user management API with authentication',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        idUser: {
                            type: 'integer',
                            description: 'The user ID',
                        },
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                        password: {
                            type: 'string',
                            description: 'The password',
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                        password: {
                            type: 'string',
                            description: 'The password',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

export default specs; 