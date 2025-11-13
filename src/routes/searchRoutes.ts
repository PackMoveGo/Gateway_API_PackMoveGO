import { Router } from 'express';
import { searchAll } from '../controllers/searchController';

const router = Router();

// Unified search endpoint
// GET /v0/search?q=query&type=service|location|review|blog|supply|all&limit=10
router.get('/', searchAll);

export default router;

