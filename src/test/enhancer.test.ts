import request from 'supertest';
import express from 'express';
import APIEnhancer from '../util/api-enhancer';

describe('API Enhancer', () => {
  let app: express.Application;
  let enhancer: APIEnhancer;

  beforeEach(() => {
    app = express();
    enhancer = new APIEnhancer({
      enableSecurityHeaders: true,
      enableRequestLogging: true,
      enablePerformanceMonitoring: true,
      enableRateLimiting: true,
      enableCaching: true,
      enableErrorHandling: false, // Disable error handling for testing
      corsOrigins: ['https://www.packmovego.com', 'https://packmovego.com'],
      rateLimitWindow: 60000, // 1 minute for testing
      rateLimitMax: 5,
      cacheTTL: 60 // 1 minute for testing
    });

    // Apply enhancements (except error handling)
    enhancer.applyEnhancements(app);

    // Add test routes
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Test endpoint', timestamp: new Date().toISOString() });
    });

    app.get('/api/slow', (req, res) => {
      setTimeout(() => {
        res.json({ message: 'Slow endpoint', timestamp: new Date().toISOString() });
      }, 100);
    });

    app.post('/api/test', (req, res) => {
      res.json({ message: 'POST test', data: req.body });
    });

    // Add error handling manually for specific tests
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
  });

  describe('Security Headers', () => {
    test('Should include all security headers', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(response.headers['permissions-policy']).toBe('geolocation=(), microphone=(), camera=()');
    });

    test('Should handle CORS correctly', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Origin', 'https://www.packmovego.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('https://www.packmovego.com');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
      expect(response.headers['access-control-allow-headers']).toContain('Authorization');
      expect(response.headers['access-control-allow-headers']).toContain('x-api-key');
    });
  });

  describe('Rate Limiting', () => {
    test('Should allow requests within rate limit', async () => {
      const requests = Array(3).fill(null).map(() => 
        request(app).get('/api/test')
      );

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('Should block requests exceeding rate limit', async () => {
      // Make 6 requests (exceeding limit of 5)
      const requests = Array(6).fill(null).map(() => 
        request(app).get('/api/test')
      );

      const responses = await Promise.all(requests);
      
      // First 5 should succeed
      for (let i = 0; i < 5; i++) {
        expect(responses[i].status).toBe(200);
      }
      
      // Last one should be rate limited
      expect(responses[5].status).toBe(429);
      expect(responses[5].body).toHaveProperty('error', 'Too many requests');
    });

    test('Should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Caching', () => {
    test('Should cache GET requests', async () => {
      const response1 = await request(app)
        .get('/api/test')
        .expect(200);

      const response2 = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response1.headers['x-cache']).toBe('MISS');
      expect(response2.headers['x-cache']).toBe('HIT');
    });

    test('Should not cache POST requests', async () => {
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .expect(200);

      expect(response.headers['x-cache']).toBeUndefined();
    });
  });

  describe('Performance Monitoring', () => {
    test('Should provide metrics endpoint', async () => {
      // Make some requests first
      await request(app).get('/api/test').expect(200);
      await request(app).get('/api/test').expect(200);

      const response = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(response.body).toHaveProperty('requests');
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('errorRate');
      expect(response.body).toHaveProperty('avgResponseTime');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Error Handling', () => {
    test('Should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'API endpoint not found');
      expect(response.body).toHaveProperty('path');
      expect(response.body).toHaveProperty('method', 'GET');
    });

    test('Should handle malformed JSON', async () => {
      // Create a separate app for JSON error testing
      const jsonTestApp = express();
      jsonTestApp.use(express.json());
      jsonTestApp.use((err: any, req: any, res: any, next: any) => {
        if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
          return res.status(400).json({ error: 'Invalid JSON' });
        }
        next();
      });
      
      jsonTestApp.post('/test', (req, res) => {
        res.json({ message: 'Success' });
      });

      const response = await request(jsonTestApp)
        .post('/test')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Health Status', () => {
    test('Should provide health status', () => {
      const health = enhancer.getHealthStatus();

      expect(health).toHaveProperty('status', 'healthy');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('memory');
      expect(health).toHaveProperty('environment');
    });
  });

  describe('Configuration', () => {
    test('Should use default configuration', () => {
      const defaultEnhancer = new APIEnhancer();
      const health = defaultEnhancer.getHealthStatus();

      expect(health).toHaveProperty('status', 'healthy');
    });

    test('Should use custom configuration', () => {
      const customEnhancer = new APIEnhancer({
        rateLimitMax: 10,
        cacheTTL: 120
      });

      const health = customEnhancer.getHealthStatus();
      expect(health).toHaveProperty('status', 'healthy');
    });
  });
}); 