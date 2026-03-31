require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/llc_appointmentdb';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lanka Land Connect - Appointment Service API', version: '1.0.0', description: 'Manages site visits and meeting scheduling.' },
    servers: [
      { url: 'http://localhost:3005', description: 'Direct Service' },
      { url: 'http://localhost:3000', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
});

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/appointments', appointmentRoutes);

app.get('/health', (req, res) => res.json({ service: 'appointment-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[Appointment Service] Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Appointment Service] Running on port ${PORT}`);
      console.log(`[Appointment Service] Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => { console.error('[Appointment Service] MongoDB error:', err.message); process.exit(1); });

module.exports = app;
