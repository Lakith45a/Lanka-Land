require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/llc_propertydb';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lanka Land Connect - Property Service API', version: '1.0.0', description: 'Manages property listings for the Lanka Land Connect platform.' },
    servers: [
      { url: 'http://localhost:3002', description: 'Direct Service' },
      { url: 'http://localhost:3000', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
});

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/properties', propertyRoutes);

app.get('/health', (req, res) => res.json({ service: 'property-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[Property Service] Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Property Service] Running on port ${PORT}`);
      console.log(`[Property Service] Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => { console.error('[Property Service] MongoDB error:', err.message); process.exit(1); });

module.exports = app;
