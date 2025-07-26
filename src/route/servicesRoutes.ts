import { Router } from 'express';
import { 
  getServices, 
  getServiceById, 
  generateQuote, 
  getServiceAnalytics 
} from '../controller/servicesController';
import { validateServiceSearch, validateQuoteGeneration, validateAnalyticsQuery } from '../middleware/validation';

const router = Router();

// Enhanced services API with filtering and search
// GET /api/v1/services?search=residential&category=residential&sort=price&page=1&limit=10
router.get('/v1/services', validateServiceSearch, getServices);

// Service analytics and performance (must come before :serviceId route)
// GET /api/v1/services/analytics?period=30d&groupBy=category
router.get('/v1/services/analytics', validateAnalyticsQuery, getServiceAnalytics);

// Get specific service by ID
// GET /api/v1/services/{serviceId}
router.get('/v1/services/:serviceId', getServiceById);

// Dynamic pricing and quote generation
// POST /api/v1/services/{serviceId}/quote
router.post('/v1/services/:serviceId/quote', validateQuoteGeneration, generateQuote);

export default router; 