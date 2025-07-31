#!/usr/bin/env node

// Simple JavaScript server for Render deployment
// This bypasses TypeScript compilation issues

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_TYPE = process.env.SERVICE_TYPE || 'api';

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'https://www.packmovego.com',
    'https://packmovego.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    console.log(`${new Date().toISOString()} - Response ${res.statusCode} - ${responseTime}ms`);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: SERVICE_TYPE === 'gateway' ? 'packmovego-gateway' : 'packmovego-api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    serviceType: SERVICE_TYPE
  });
});

// API root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: SERVICE_TYPE === 'gateway' ? 'PackMoveGO Gateway' : 'PackMoveGO API',
    status: 'running',
    service: SERVICE_TYPE,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

// Basic API endpoints
app.get('/api/status', (req, res) => {
  res.status(200).json({
    message: 'API is working',
    service: SERVICE_TYPE,
    timestamp: new Date().toISOString()
  });
});

// Gateway-specific endpoints
if (SERVICE_TYPE === 'gateway') {
  app.get('/gateway/status', (req, res) => {
    res.status(200).json({
      message: 'Gateway is working',
      timestamp: new Date().toISOString(),
      privateApiUrl: process.env.PRIVATE_API_URL || 'http://localhost:3000'
    });
  });
}

// API endpoints
app.get('/api/v0/status', (req, res) => {
  res.status(200).json({
    message: 'v0 API is working',
    version: 'v0',
    timestamp: new Date().toISOString()
  });
});

// Data endpoints
app.get('/data/status', (req, res) => {
  res.status(200).json({
    message: 'Data service is working',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PackMoveGO ${SERVICE_TYPE.toUpperCase()} server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API status: http://localhost:${PORT}/api/status`);
  if (SERVICE_TYPE === 'gateway') {
    console.log(`🌐 Gateway status: http://localhost:${PORT}/gateway/status`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
}); 