const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lanka Land Connect - User Service API',
      version: '1.0.0',
      description: 'Manages user accounts, profiles, and authentication for the Lanka Land Connect platform.',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Direct Service' },
      { url: 'http://localhost:3000', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
