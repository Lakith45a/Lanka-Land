require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

const SERVICES = {
  users:        process.env.USER_SERVICE_URL        || 'http://localhost:3001',
  properties:   process.env.PROPERTY_SERVICE_URL    || 'http://localhost:3002',
  inquiries:    process.env.INQUIRY_SERVICE_URL      || 'http://localhost:3003',
  valuations:   process.env.VALUATION_SERVICE_URL   || 'http://localhost:3004',
  appointments: process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3005',
  documents:    process.env.DOCUMENT_SERVICE_URL    || 'http://localhost:3006',
};

// Middleware (do NOT parse JSON here so proxy can stream body)
app.use(cors());
app.use(morgan('combined'));

// ─── Swagger UI (Aggregated Docs) ───────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
}));

// ─── Gateway Info ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'Lanka Land Connect - API Gateway',
    version: '1.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
    routes: Object.entries(SERVICES).map(([name, url]) => ({
      path: `/api/${name}`,
      target: url,
    })),
  });
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString(),
    downstreamServices: SERVICES,
  });
});

// ─── Proxy helper ────────────────────────────────────────────────────────────
const makeProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`[Gateway] Proxy error → ${target}: ${err.message}`);
        res.status(502).json({
          success: false,
          message: `Service unavailable: ${target}`,
          error: err.message,
        });
      },
      proxyReq: (proxyReq, req) => {
        console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${target}${req.url}`);
      },
    },
  });

// ─── Route Proxies ───────────────────────────────────────────────────────────
app.use('/api/users',        makeProxy(SERVICES.users));
app.use('/api/properties',   makeProxy(SERVICES.properties));
app.use('/api/inquiries',    makeProxy(SERVICES.inquiries));
app.use('/api/valuations',   makeProxy(SERVICES.valuations));
app.use('/api/appointments', makeProxy(SERVICES.appointments));
app.use('/api/documents',    makeProxy(SERVICES.documents));

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found on API Gateway`,
    availableRoutes: Object.keys(SERVICES).map(s => `/api/${s}`),
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║        Lanka Land Connect — API Gateway              ║');
  console.log(`║        Running on http://localhost:${PORT}               ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  Object.entries(SERVICES).forEach(([name, url]) => {
    const padded = `/api/${name}`.padEnd(20);
    console.log(`║  ${padded} → ${url}`);
  });
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
