const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'A RESTful API for user management with MS SQL Server. To use protected endpoints, first register or login to get a JWT token, then click the Authorize button at the top and enter your token in the format: Bearer your_token_here',
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
                    description: 'Enter your JWT token in the format: Bearer your_token_here'
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./src/controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs; 