import { Router } from 'express';
import { body } from 'express-validator';
import { signup } from '../controller/userController';

const router = Router();

// Validation middleware
const validateUser = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits long')
];

// Routes
router.post('/signup', validateUser, signup);

export default router; 