import express from 'express';
import { 
  createBooking, 
  getBookings, 
  updateBookingStatus, 
  deleteBooking,
  getBookingById,
  confirmBooking,
  getBookingsByStatus,
  getBookingStats,
  getUserBookings
} from '../controllers/bookingController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: create booking (no auth required for enquiries/bookings)
router.post('/', createBooking);

// Public routes (no authentication required)
router.get('/stats', getBookingStats);

// Admin routes (authentication + admin role required)
router.get('/', authenticate, isAdmin, getBookings);
router.get('/status/:status', authenticate, isAdmin, getBookingsByStatus);
router.get('/:id', authenticate, isAdmin, getBookingById);
router.put('/:id', authenticate, isAdmin, updateBookingStatus);
router.patch('/:id/status', authenticate, isAdmin, updateBookingStatus);
router.patch('/:id/confirm', authenticate, isAdmin, confirmBooking);
router.delete('/:id', authenticate, isAdmin, deleteBooking);

// User routes (authenticated)
router.get('/user/bookings', authenticate, getUserBookings);

export default router;
