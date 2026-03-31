require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const PORT = process.env.PORT || 3006;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/llc_documentdb';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lanka Land Connect - Document Service API', version: '1.0.0', description: 'Manages legal documents such as title deeds, survey plans, and notarial deeds.' },
    servers: [
      { url: 'http://localhost:3006', description: 'Direct Service' },
      { url: 'http://localhost:3000', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
});

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/documents', documentRoutes);

app.get('/health', (req, res) => res.json({ service: 'document-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[Document Service] Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Document Service] Running on port ${PORT}`);
      console.log(`[Document Service] Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => { console.error('[Document Service] MongoDB error:', err.message); process.exit(1); });

module.exports = app;
