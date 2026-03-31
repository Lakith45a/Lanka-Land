const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lanka Land Connect - API Gateway',
      version: '1.0.0',
      description:
        'Unified API documentation for all Lanka Land Connect services exposed via the API Gateway.',
    },
    servers: [
      {
        url: process.env.GATEWAY_URL || 'http://localhost:3000',
        description: 'API Gateway',
      },
    ],
  },
  // Reuse Swagger JSDoc annotations defined in each service's route files
  apis: [
    '../user-service/src/routes/*.js',
    '../property-service/src/routes/*.js',
    '../inquiry-service/src/routes/*.js',
    '../valuation-service/src/routes/*.js',
    '../appointment-service/src/routes/*.js',
    '../document-service/src/routes/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
