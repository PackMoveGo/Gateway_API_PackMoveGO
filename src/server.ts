import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import { connectDB } from './config/database';
import signupRoutes from './route/signup';
import sectionRoutes from './route/sectionRoutes';
import securityRoutes from './route/securityRoutes';
import dotenv from 'dotenv';
import path from 'path';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { securityMiddleware } from './middleware/security';
import dataRoutes from './route/dataRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === 'development';

// Connect to MongoDB (optional in development)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  if (process.env.NODE_ENV === 'development') {
    console.log('Continuing without database connection in development mode');
=======
import { connectDB } from '../config/database';
import signupRoutes from './route/signup';
import sectionRoutes from './route/sectionRoutes';
import securityRoutes from './route/securityRoutes';
import prelaunchRoutes from './route/prelaunchRoutes';
import dotenv from 'dotenv';
import path from 'path';
import { securityMiddleware } from './middleware/security';
import dataRoutes from './route/dataRoutes';

// Load environment variables from config directory
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (optional in development)
connectDB().catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️ Continuing without database connection in development mode');
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
  } else {
    process.exit(1);
  }
});

<<<<<<< HEAD
// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
=======
// CORS configuration for REST API
const corsOptions = {
  origin: [
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
    'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:5001',
    'https://www.packmovego.com',
<<<<<<< HEAD
    'https://packmovego.com'
  ],
=======
    'https://packmovego.com',
    ...(process.env.CORS_ORIGIN?.split(',') || [])
  ].filter((origin, index, arr) => arr.indexOf(origin) === index), // Remove duplicates
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
  methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(','),
  allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization').split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply security middleware first
app.use(securityMiddleware);

// Basic middleware
app.use(cors(corsOptions));
<<<<<<< HEAD
app.use(express.json());
=======
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const origin = req.get('Origin') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${path} - Origin: ${origin} - User-Agent: ${userAgent}`);
  next();
});
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
<<<<<<< HEAD
    corsOrigin: corsOptions.origin,
    corsMethods: corsOptions.methods,
    corsHeaders: corsOptions.allowedHeaders,
    port: port
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

=======
    serverPort: port,
    corsOrigin: corsOptions.origin,
    corsMethods: corsOptions.methods,
    corsHeaders: corsOptions.allowedHeaders,
    timestamp: new Date().toISOString()
  });
});

>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
// API Routes
app.use('/api', signupRoutes);
app.use('/api', sectionRoutes);
app.use('/api', securityRoutes);
<<<<<<< HEAD
app.use('/api', dataRoutes);

// Development mode: Proxy frontend requests to Vite dev server
if (isDevelopment) {
  const proxyOptions = {
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: {
      '^/api': '/api', // Don't rewrite API paths
    },
    onProxyReq: (proxyReq: express.Request, req: express.Request, res: express.Response) => {
      // Don't proxy API requests
      if (req.path.startsWith('/api/')) {
        return;
      }
    }
  };

  app.use('/', createProxyMiddleware(proxyOptions) as RequestHandler);
} else {
  // Production mode: API server only
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to PackMoveGO API',
      version: '1.0.0',
      status: 'running'
    });
  });
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
=======
app.use('/api', prelaunchRoutes);
app.use('/api', dataRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PackMoveGO REST API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      data: '/api/data/:name',
      content: {
        blog: '/api/v0/blog',
        about: '/api/v0/about',
        nav: '/api/v0/nav',
        contact: '/api/v0/contact',
        referral: '/api/v0/referral',
        reviews: '/api/v0/reviews',
        locations: '/api/v0/locations',
        supplies: '/api/v0/supplies',
        services: '/api/v0/services',
        testimonials: '/api/v0/testimonials'
      },
      signup: '/api/signup',
      sections: '/api/sections',
      security: '/api/security',
      prelaunch: '/api/prelaunch'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
    availableEndpoints: [
      '/api/health',
      '/api/data/:name',
      '/api/v0/blog',
      '/api/v0/about',
      '/api/v0/nav',
      '/api/v0/contact',
      '/api/v0/referral',
      '/api/v0/reviews',
      '/api/v0/locations',
      '/api/v0/supplies',
      '/api/v0/services',
      '/api/v0/testimonials',
      '/api/signup',
      '/api/sections',
      '/api/security',
      '/api/prelaunch'
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
  });
});

// Start server
<<<<<<< HEAD
const server = app.listen(port, () => {
  console.log('\n=== Server Configuration ===');
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n=== CORS Configuration ===');
  console.log(`🌐 CORS Origins: ${corsOptions.origin.join(', ')}`);
  console.log(`🔧 CORS Methods: ${corsOptions.methods.join(', ')}`);
  console.log(`🔑 CORS Headers: ${corsOptions.allowedHeaders.join(', ')}`);
  console.log('\n=== Database Configuration ===');
  console.log(`📦 MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  console.log(`🔗 Prisma: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log('\n=== Security Configuration ===');
  console.log(`🔒 JWT: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}`);
  console.log('\n=== Email Configuration ===');
  console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
=======
const server = app.listen(port, async () => {
  // Wait a moment for database connections to establish
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('\n🚀 === PackMoveGO REST API Server ===');
  console.log(`📡 API Server: http://localhost:${port}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  console.log('\n📋 === Available API Endpoints ===');
  console.log(`✅ Health Check: http://localhost:${port}/api/health`);
  console.log(`📊 Data API: http://localhost:${port}/api/data/:name`);
  console.log(`📝 Content APIs: /api/v0/blog, /api/v0/about, /api/v0/nav, /api/v0/contact, /api/v0/referral`);
  console.log(`📝 Content APIs: /api/v0/reviews, /api/v0/locations, /api/v0/supplies, /api/v0/services, /api/v0/testimonials`);
  console.log(`👤 User Routes: http://localhost:${port}/api/signup`);
  console.log(`📑 Section Routes: http://localhost:${port}/api/sections`);
  console.log(`🔒 Security Routes: http://localhost:${port}/api/security`);
  console.log(`🚀 Prelaunch Routes: http://localhost:${port}/api/prelaunch`);
  
  console.log('\n🌍 === CORS Configuration ===');
  console.log(`✅ Origins: ${corsOptions.origin.join(', ')}`);
  console.log(`✅ Methods: ${corsOptions.methods.join(', ')}`);
  console.log(`✅ Headers: ${corsOptions.allowedHeaders.join(', ')}`);
  
  console.log('\n⚙️ === Service Status ===');
  
  // Check MongoDB connection
  let mongoStatus = '❌ Not configured';
  if (process.env.MONGODB_URI) {
    try {
      const mongoClient = (global as any).mongoClient;
      if (mongoClient && mongoClient.topology && mongoClient.topology.isConnected()) {
        mongoStatus = '✅ Connected';
      } else {
        mongoStatus = '❌ Disconnected';
      }
    } catch (error) {
      mongoStatus = '❌ Connection failed';
    }
  }
  console.log(`📦 MongoDB: ${mongoStatus}`);
  
  // Prisma not used - MongoDB is the primary database
  console.log(`🔗 Prisma: ⚠️ Not used (MongoDB active)`);
  
  // Check JWT configuration
  const jwtStatus = process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your_super_secret_jwt_key_here_make_it_long_and_random' 
    ? '✅ Configured' 
    : '❌ Not configured';
  console.log(`🔒 JWT: ${jwtStatus}`);
  
  // Check Stripe configuration
  const stripeStatus = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
    ? '✅ Configured' 
    : '❌ Not configured';
  console.log(`💳 Stripe: ${stripeStatus}`);
  
  // Check Email configuration
  const emailStatus = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
    ? '✅ Configured' 
    : '❌ Not configured';
  console.log(`📧 Email: ${emailStatus}`);
  
  // Check IP Whitelist
  const ipWhitelistStatus = process.env.ALLOWED_IPS 
    ? '✅ Active' 
    : '⚠️ Using Vercel whitelist';
  console.log(`🔐 IP Whitelist: ${ipWhitelistStatus}`);
  
  console.log('\n🎯 === REST API Ready ===');
  console.log(`📡 All endpoints served directly from this server`);
  console.log(`🔗 Ready to accept requests from any frontend`);
  console.log('\n' + '='.repeat(50));
>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please try a different port or close the application using this port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
}); 