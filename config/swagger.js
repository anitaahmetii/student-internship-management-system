const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SIMS - Student Internship Management System',
            version: '1.0.0',
            description: 'REST API documentation for SIMS platform, including authentication, users, internships, and applications management.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['../routes/*.js'], 
};

module.exports = swaggerJsdoc(options);