import { Router } from 'express';
import { getDataFile } from '../controller/dataController';

const router = Router();

<<<<<<< HEAD
// Route: /api/data/:name
router.get('/data/:name', getDataFile);

=======
// Route: /api/data/:name (existing generic route)
router.get('/data/:name', getDataFile);

// Versioned API endpoints with /v0/ prefix
router.get('/v0/blog', (req, res) => {
  (req as any).params = { name: 'blog' };
  getDataFile(req, res);
});

router.get('/v0/about', (req, res) => {
  (req as any).params = { name: 'about' };
  getDataFile(req, res);
});

router.get('/v0/nav', (req, res) => {
  (req as any).params = { name: 'nav' };
  getDataFile(req, res);
});

router.get('/v0/contact', (req, res) => {
  (req as any).params = { name: 'contact' };
  getDataFile(req, res);
});

router.get('/v0/referral', (req, res) => {
  (req as any).params = { name: 'referral' };
  getDataFile(req, res);
});

router.get('/v0/reviews', (req, res) => {
  (req as any).params = { name: 'reviews' };
  getDataFile(req, res);
});

router.get('/v0/locations', (req, res) => {
  (req as any).params = { name: 'locations' };
  getDataFile(req, res);
});

router.get('/v0/supplies', (req, res) => {
  (req as any).params = { name: 'supplies' };
  getDataFile(req, res);
});

router.get('/v0/services', (req, res) => {
  (req as any).params = { name: 'Services' };
  getDataFile(req, res);
});

router.get('/v0/testimonials', (req, res) => {
  (req as any).params = { name: 'Testimonials' };
  getDataFile(req, res);
});

>>>>>>> b6c9270 (Initial commit: PackMoveGO API backend, ready for Render deployment with versioned endpoints and config folder support)
export default router; 