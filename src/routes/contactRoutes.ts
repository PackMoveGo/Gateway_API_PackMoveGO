import { Router } from 'express';
import contactController from '../controllers/contactController';
import { optionalAuth } from '../middlewares/authMiddleware';

const router=Router();

/**
 * Contact Form Routes
 * All routes are prefixed with /v0/contact
 */

// Public route - submit contact form
router.post('/submit', contactController.submitContactForm);

// Admin routes - require authentication
router.get('/submissions', optionalAuth, contactController.getAllContacts);
router.put('/submissions/:id', optionalAuth, contactController.updateContactStatus);

export default router;

