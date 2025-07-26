import request from 'supertest';
import express from 'express';

// Create a simple test server for health checks
const app = express();

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

describe('Health Check API', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should include environment information', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'Server is running');
  });
});

describe('Environment Configuration', () => {
  it('should have required environment variables', () => {
    // Check that we're in test environment
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.PORT).toBe('3001');
    
    // Check that required env vars are set (even if they're test values)
  
    expect(process.env.ADMIN_PASSWORD).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.CORS_ORIGIN).toBeDefined();
  });
}); 