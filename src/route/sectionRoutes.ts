import express from 'express';
import { verifySections } from '../controller/sectionController';

const router = express.Router();

router.post('/verify-sections', verifySections);

export default router; 