import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getApprovedFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getFeedbackStats,
  getFeedbackByCategory
} from '../controllers/feedbackController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createFeedback);                    // Create feedback
router.get('/approved', getApprovedFeedback);        // Get approved feedback for public display
router.get('/stats', getFeedbackStats);              // Get feedback statistics
router.get('/category/:category', getFeedbackByCategory); // Get feedback by service category

// Admin routes (authentication required)
router.get('/', authenticate, isAdmin, getAllFeedback);           // Get all feedback
router.get('/:id', authenticate, isAdmin, getFeedbackById);       // Get feedback by ID
router.patch('/:id/status', authenticate, isAdmin, updateFeedbackStatus); // Update feedback status
router.delete('/:id', authenticate, isAdmin, deleteFeedback);     // Delete feedback

export default router;
