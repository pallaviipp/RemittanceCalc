import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateRoutes from './routes/rates.js';
import providerRoutes from './routes/providers.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RemittanceCalc Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/rates', rateRoutes);
app.use('/api/providers', providerRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RemittanceCalc API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      rates: '/api/rates',
      providers: '/api/providers'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RemittanceCalc Backend running on port ${PORT}`);
  console.log(`📊 API available at: http://localhost:${PORT}/api`);
  console.log(`💖 Health check: http://localhost:${PORT}/api/health`);
});
