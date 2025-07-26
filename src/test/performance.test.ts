import request from 'supertest';
import express from 'express';

// Create a test server with performance monitoring
const app = express();

// Simple performance monitoring middleware
const performanceMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};

app.use(performanceMiddleware);

// Test routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/data', (req, res) => {
  // Simulate some processing time
  setTimeout(() => {
    res.status(200).json({
      data: 'test data',
      timestamp: new Date().toISOString()
    });
  }, 10);
});

app.get('/api/slow', (req, res) => {
  // Simulate a slow endpoint
  setTimeout(() => {
    res.status(200).json({
      message: 'Slow response',
      timestamp: new Date().toISOString()
  });
  }, 100);
});

describe('Performance Tests', () => {
  test('Health endpoint should respond quickly (< 50ms)', async () => {
    const start = Date.now();
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  test('Data endpoint should respond within reasonable time (< 100ms)', async () => {
    const start = Date.now();
    const response = await request(app)
      .get('/api/data')
      .expect(200);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
    expect(response.body).toHaveProperty('data');
  });

  test('Should handle concurrent requests efficiently', async () => {
    const start = Date.now();
    const requests = Array(10).fill(null).map(() => 
      request(app).get('/api/health')
    );
    
    const responses = await Promise.all(requests);
    const totalDuration = Date.now() - start;
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
    
    // Total time should be reasonable (not 10x individual request time)
    expect(totalDuration).toBeLessThan(500);
  });

  test('Should handle multiple rapid requests without degradation', async () => {
    const responseTimes: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await request(app).get('/api/health').expect(200);
      responseTimes.push(Date.now() - start);
    }
    
    // Response times should be consistent
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxTime = Math.max(...responseTimes);
    
    // Allow for some variance in timing
    expect(maxTime).toBeLessThan(avgTime * 3); // No request should be more than 3x average
  });

  test('Slow endpoints should still respond correctly', async () => {
    const response = await request(app)
      .get('/api/slow')
      .expect(200);
    
    expect(response.body).toHaveProperty('message', 'Slow response');
  });
});

describe('Load Testing', () => {
  test('Should handle burst of requests', async () => {
    const requests = Array(20).fill(null).map(() => 
      request(app).get('/api/health')
    );
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });

  test('Should maintain response consistency under load', async () => {
    const responseTimes: number[] = [];
    
    // Make 15 requests in quick succession
    for (let i = 0; i < 15; i++) {
      const start = Date.now();
      await request(app).get('/api/health').expect(200);
      responseTimes.push(Date.now() - start);
    }
    
    // Calculate statistics
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);
    
    // Response times should be reasonable
    expect(avgTime).toBeLessThan(100);
    expect(maxTime).toBeLessThan(200);
    expect(minTime).toBeGreaterThanOrEqual(0); // Allow 0 for very fast responses
  });
}); 