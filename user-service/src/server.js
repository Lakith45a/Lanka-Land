require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/llc_userdb';

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[User Service] Connected to MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[User Service] Running on port ${PORT}`);
      console.log(`[User Service] Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('[User Service] MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
