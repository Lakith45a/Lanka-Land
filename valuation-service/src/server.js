require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const valuationRoutes = require('./routes/valuationRoutes');

const app = express();
const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/llc_valuationdb';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lanka Land Connect - Valuation Service API', version: '1.0.0', description: 'Manages professional land valuations.' },
    servers: [
      { url: 'http://localhost:3004', description: 'Direct Service' },
      { url: 'http://localhost:3000', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
});

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/valuations', valuationRoutes);

app.get('/health', (req, res) => res.json({ service: 'valuation-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[Valuation Service] Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Valuation Service] Running on port ${PORT}`);
      console.log(`[Valuation Service] Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => { console.error('[Valuation Service] MongoDB error:', err.message); process.exit(1); });

module.exports = app;
