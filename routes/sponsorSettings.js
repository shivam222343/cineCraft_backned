import express from 'express';
import { 
  getSponsorSettings, 
  updateSponsorSettings, 
  getSetting 
} from '../controllers/sponsorSettingsController.js';

const router = express.Router();

// GET /api/sponsor-settings - Get all sponsor settings
router.get('/', getSponsorSettings);

// PUT /api/sponsor-settings - Update sponsor settings
router.put('/', updateSponsorSettings);

// GET /api/sponsor-settings/:key - Get specific setting
router.get('/:key', getSetting);

export default router;
