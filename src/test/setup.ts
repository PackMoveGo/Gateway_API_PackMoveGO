import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../config/.env') });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console output during tests unless there's an error
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test timeout
jest.setTimeout(10000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.ALLOWED_IPS = '127.0.0.1,::1';
process.env.ADMIN_PASSWORD = 'test_password';
process.env.API_KEY_ENABLED = 'false';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.CORS_ORIGIN = 'http://localhost:3000,https://www.packmovego.com';
process.env.CORS_METHODS = 'GET,POST,PUT,DELETE,OPTIONS';
process.env.CORS_ALLOWED_HEADERS = 'Content-Type,Authorization,x-api-key'; 