import { Router } from 'express';
import quoteController from '../controllers/quoteController';
import { optionalAuth } from '../middlewares/authMiddleware';

const router=Router();

/**
 * Quote Routes
 * All routes are prefixed with /v0/quotes
 */

// Public route - submit quote request
router.post('/submit', quoteController.submitQuote);

// Admin routes - require authentication
router.get('/', optionalAuth, quoteController.getAllQuotes);
router.put('/:id', optionalAuth, quoteController.updateQuoteStatus);

export default router;

