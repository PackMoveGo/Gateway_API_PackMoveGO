import request from 'supertest';
import express from 'express';
import { validateServiceSearch, validateQuoteGeneration } from '../middleware/validation';
import { sendSuccess, sendError, sendValidationError } from '../util/response-formatter';
import { errorHandler, requestIdMiddleware, asyncHandler } from '../middleware/error-handler';
import { apiPerformanceMonitor } from '../util/api-performance';

const app = express();

// Test middleware setup
app.use(express.json());
app.use(requestIdMiddleware);
app.use(apiPerformanceMonitor.monitorRequest());
app.use(errorHandler);

// Test routes
app.get('/test/success', (req: any, res: any) => {
  sendSuccess(res, { message: 'Test successful' }, 'Test completed');
});

app.get('/test/error', (req: any, res: any) => {
  sendError(res, 'Test error', 400, 'TEST_ERROR');
});

app.get('/test/validation', validateServiceSearch, (req: any, res: any) => {
  sendSuccess(res, { query: req.query }, 'Validation passed');
});

app.post('/test/quote', validateQuoteGeneration, (req: any, res: any) => {
  sendSuccess(res, { quote: req.body }, 'Quote generated');
});

app.get('/test/async', asyncHandler(async (req: any, res: any) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  sendSuccess(res, { async: true }, 'Async test completed');
}));

app.get('/test/throw', asyncHandler(async (req: any, res: any) => {
  throw new Error('Test error');
}));

describe('API Improvements', () => {
  describe('Response Formatter', () => {
    it('should format successful responses correctly', async () => {
      const response = await request(app)
        .get('/test/success')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Test completed',
        data: { message: 'Test successful' },
        timestamp: expect.any(String),
        path: '/test/success',
        requestId: expect.any(String),
        meta: {
          version: expect.any(String),
          environment: expect.any(String)
        }
      });
    });

    it('should format error responses correctly', async () => {
      const response = await request(app)
        .get('/test/error')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        message: 'Test error',
        error: {
          code: 'TEST_ERROR'
        },
        timestamp: expect.any(String),
        path: '/test/error',
        requestId: expect.any(String)
      });
    });
  });

  describe('Request ID Middleware', () => {
    it('should generate request ID if not provided', async () => {
      const response = await request(app)
        .get('/test/success')
        .expect(200);

      expect(response.body.requestId).toBeDefined();
      expect(response.headers['x-request-id']).toBeDefined();
    });

    it('should use provided request ID', async () => {
      const customRequestId = 'custom-req-123';
      const response = await request(app)
        .get('/test/success')
        .set('x-request-id', customRequestId)
        .expect(200);

      expect(response.body.requestId).toBe(customRequestId);
      expect(response.headers['x-request-id']).toBe(customRequestId);
    });
  });

  describe('Validation Middleware', () => {
    it('should pass validation for valid service search', async () => {
      const response = await request(app)
        .get('/test/validation')
        .query({
          search: 'residential',
          category: 'moving',
          sort: 'price',
          page: '1',
          limit: '10'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid service search parameters', async () => {
      const response = await request(app)
        .get('/test/validation')
        .query({
          sort: 'invalid_sort',
          page: '-1',
          limit: '1000'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate quote generation request', async () => {
      const response = await request(app)
        .post('/test/quote')
        .send({
          fromZip: '12345',
          toZip: '67890',
          moveDate: '2024-12-25',
          rooms: 3,
          urgency: 'standard'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid quote request', async () => {
      const response = await request(app)
        .post('/test/quote')
        .send({
          fromZip: 'invalid',
          toZip: '67890',
          moveDate: 'invalid-date'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Error Handler', () => {
    it('should handle async errors correctly', async () => {
      const response = await request(app)
        .get('/test/throw')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .get('/test/validation')
        .query({ page: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(() => {
      apiPerformanceMonitor.resetMetrics();
    });

    it('should track request metrics', async () => {
      await request(app).get('/test/success');
      await request(app).get('/test/success');
      await request(app).get('/test/error');

      const metrics = apiPerformanceMonitor.getMetrics();
      
      expect(metrics.requestCount).toBe(3);
      expect(metrics.errorRate).toBeGreaterThan(0);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });

    it('should detect slow queries', async () => {
      await request(app).get('/test/async');

      const metrics = apiPerformanceMonitor.getMetrics();
      expect(metrics.slowQueries.length).toBeGreaterThan(0);
    });

    it('should track errors', async () => {
      await request(app).get('/test/error');

      const metrics = apiPerformanceMonitor.getMetrics();
      expect(metrics.errors.length).toBeGreaterThan(0);
    });

    it('should provide health status', () => {
      const health = apiPerformanceMonitor.getHealthStatus();
      
      expect(health).toMatchObject({
        status: expect.stringMatching(/healthy|degraded|unhealthy/),
        score: expect.any(Number),
        issues: expect.any(Array)
      });
    });
  });

  describe('API Endpoints', () => {
    it('should handle services endpoint with validation', async () => {
      const response = await request(app)
        .get('/api/v1/services')
        .query({
          search: 'residential',
          category: 'moving',
          sort: 'price',
          page: '1',
          limit: '10'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should handle quote generation with validation', async () => {
      const response = await request(app)
        .post('/api/v1/services/residential-moving/quote')
        .send({
          fromZip: '12345',
          toZip: '67890',
          moveDate: '2024-12-25',
          rooms: 3,
          urgency: 'standard'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Response Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/test/success')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/test/success')
        .set('Origin', 'https://www.packmovego.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('https://www.packmovego.com');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/test/quote')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle timeout scenarios', async () => {
      // This would require a longer timeout test
      const response = await request(app)
        .get('/test/async')
        .timeout(5000)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
}); 