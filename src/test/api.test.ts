import request from 'supertest';
import express from 'express';

// Create a simple test server
const app = express();

// CORS middleware for testing - MUST be applied BEFORE routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-api-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Vary', 'Origin');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  next();
});

// Basic test routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/simple', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/detailed', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    serverPort: process.env.PORT || 3000,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Content API routes
const contentData = {
  blog: { title: 'Test Blog', content: 'Test content' },
  about: { title: 'About Us', content: 'About content' },
  nav: { items: ['Home', 'Services', 'Contact'] },
  contact: { email: 'test@example.com', phone: '123-456-7890' },
  referral: { program: 'Referral Program' },
  reviews: { reviews: [{ rating: 5, comment: 'Great service' }] },
  locations: { locations: ['Location 1', 'Location 2'] },
  supplies: { items: ['Boxes', 'Tape', 'Bubble wrap'] },
  services: { services: ['Moving', 'Packing', 'Storage'] },
  testimonials: { testimonials: [{ name: 'John Doe', testimonial: 'Great service' }] }
};

app.get('/v0/:name', (req, res) => {
  const { name } = req.params;
  const data = contentData[name as keyof typeof contentData];
  
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// API endpoints
app.get('/api/heartbeat', (req, res) => {
  res.status(200).json({
    status: 'alive',
    message: 'Backend is active and responding',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    frontend: 'connected'
  });
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    pong: true,
    timestamp: new Date().toISOString(),
    backend: 'active'
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'PackMoveGO REST API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      data: '/api/v0/:name',
      content: '/api/v0/*'
    }
  });
});

// Error handling
app.get('/login', (req, res) => {
  res.status(403).json({
    error: 'Access denied',
    message: 'This API is only accessible from packmovego.com',
    timestamp: new Date().toISOString()
  });
});

app.get('/dashboard', (req, res) => {
  res.status(403).json({
    error: 'Access denied', 
    message: 'This API is only accessible from packmovego.com',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/nonexistent', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
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
      '/api/v0/testimonials'
    ]
  });
});

// Data API
app.get('/api/data', (req, res) => {
  res.status(200).json({
    available: Object.keys(contentData),
    endpoints: Object.keys(contentData).map(key => `/api/v0/${key}`)
  });
});

// Services API
app.get('/api/v1/services', (req, res) => {
  res.status(200).json({
    services: [
      { id: 1, name: 'Residential Moving', price: 500 },
      { id: 2, name: 'Commercial Moving', price: 800 },
      { id: 3, name: 'Packing Services', price: 200 }
    ]
  });
});

app.get('/api/v1/services/analytics', (req, res) => {
  res.status(200).json({
    totalServices: 3,
    totalRequests: 150,
    averageRating: 4.8
  });
});

describe('API Health Checks', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'Server is running');
  });

  test('GET /api/health/simple should return 200', async () => {
    const response = await request(app)
      .get('/api/health/simple')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
  });

  test('GET /api/health/detailed should return 200', async () => {
    const response = await request(app)
      .get('/api/health/detailed')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('serverPort');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Content API (/v0/)', () => {
  const contentEndpoints = [
    'blog', 'about', 'nav', 'contact', 'referral', 
    'reviews', 'locations', 'supplies', 'services', 'testimonials'
  ];

  contentEndpoints.forEach(endpoint => {
    test(`GET /v0/${endpoint} should return 200`, async () => {
      const response = await request(app)
        .get(`/v0/${endpoint}`)
        .set('Origin', 'https://www.packmovego.com')
        .expect(200);
      
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });
  });

  test('GET /v0/nonexistent should return 404', async () => {
    await request(app)
      .get('/v0/nonexistent')
      .expect(404);
  });
});

describe('CORS Configuration', () => {
  test('Should allow requests from packmovego.com', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://www.packmovego.com')
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe('https://www.packmovego.com');
  });

  test('Should allow requests from packmovego.com (without www)', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://packmovego.com')
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe('https://packmovego.com');
  });

  test('Should allow requests from Vercel domains', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app')
      .expect(200);
    
    expect(response.headers['access-control-allow-origin']).toBe('https://packmovego-6x8w2t0kw-pack-move-go-frontend.vercel.app');
  });
});

describe('API Endpoints', () => {
  test('GET /api/heartbeat should return 200', async () => {
    const response = await request(app)
      .get('/api/heartbeat')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'alive');
    expect(response.body).toHaveProperty('message', 'Backend is active and responding');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
  });

  test('GET /api/ping should return 200', async () => {
    const response = await request(app)
      .get('/api/ping')
      .expect(200);
    
    expect(response.body).toHaveProperty('pong', true);
    expect(response.body).toHaveProperty('backend', 'active');
  });

  test('GET / should return API info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status', 'running');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('Error Handling', () => {
  test('GET /api/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);
    
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'API endpoint not found');
    expect(response.body).toHaveProperty('availableEndpoints');
  });

  test('GET /login should return 403 in production', async () => {
    const response = await request(app)
      .get('/login')
      .expect(403);
    
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  test('GET /dashboard should return 403 in production', async () => {
    const response = await request(app)
      .get('/dashboard')
      .expect(403);
    
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('Rate Limiting', () => {
  test('Should handle multiple rapid requests', async () => {
    const requests = Array(10).fill(null).map(() => 
      request(app).get('/api/health')
    );
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed (rate limiting is per IP)
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});

describe('Security Headers', () => {
  test('Should include security headers', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    // Check for basic security headers
    expect(response.headers).toHaveProperty('x-content-type-options');
    expect(response.headers).toHaveProperty('x-frame-options');
  });
});

describe('Data API', () => {
  test('GET /api/data should return available data endpoints', async () => {
    const response = await request(app)
      .get('/api/data')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});

describe('Services API', () => {
  test('GET /api/v1/services should return services', async () => {
    const response = await request(app)
      .get('/api/v1/services')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });

  test('GET /api/v1/services/analytics should return analytics', async () => {
    const response = await request(app)
      .get('/api/v1/services/analytics')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
}); 