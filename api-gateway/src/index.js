const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const winston = require('winston');

const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Proxy middleware configuration
// In production, use environment variables for service URLs
// In development, use local docker service names
const services = {
  '/api/users': isProduction 
    ? process.env.USER_SERVICE_URL || 'http://user-service:3001'
    : 'http://user-service:3001',
  '/api/products': isProduction
    ? process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002'
    : 'http://product-service:3002',
  '/api/cart': isProduction
    ? process.env.CART_SERVICE_URL || 'http://cart-service:3003'
    : 'http://cart-service:3003',
  '/api/orders': isProduction
    ? process.env.ORDER_SERVICE_URL || 'http://order-service:3004'
    : 'http://order-service:3004',
  '/api/payments': isProduction
    ? process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005'
    : 'http://payment-service:3005',
  '/api/notifications': isProduction
    ? process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006'
    : 'http://notification-service:3006'
};

// Set up proxy for each service
Object.entries(services).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: ''
      },
      onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying request to ${target}${req.url}`);
      },
      onError: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({ error: 'Service temporarily unavailable' });
      }
    })
  );
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
}); 