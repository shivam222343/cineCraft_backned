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

// Public: create booking
router.post('/', createBooking);

// Public routes (no authentication required)
router.get('/', getBookings);
router.get('/stats', getBookingStats);
router.get('/status/:status', getBookingsByStatus);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/confirm', confirmBooking);
router.delete('/:id', deleteBooking);

// User routes (authenticated)
router.get('/user/bookings', authenticate, getUserBookings);

export default router;
