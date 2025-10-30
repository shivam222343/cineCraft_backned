import express from 'express';
import {
  getSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  updateSponsorOrder
} from '../controllers/sponsorController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES
// =============================================

// Get all active sponsors (for public display)
router.get('/', getSponsors);

// Get sponsor by ID (for public display)
router.get('/:id', getSponsorById);

// =============================================
// ADMIN ROUTES (Protected)
// =============================================

// Create new sponsor
router.post('/', authenticate, isAdmin, createSponsor);

// Update sponsor
router.put('/:id', authenticate, isAdmin, updateSponsor);

// Delete sponsor
router.delete('/:id', authenticate, isAdmin, deleteSponsor);

// Update sponsor display order
router.patch('/:id/order', authenticate, isAdmin, updateSponsorOrder);

export default router;
