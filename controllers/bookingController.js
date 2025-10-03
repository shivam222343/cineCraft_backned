import { Booking } from '../models/bookingModel.js';

export const createBooking = async (req, res, next) => {
  try {
    const { user_id, service_id, name, email, phone, date, time, message, image } = req.body;
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, date, and time are required' });
    }
    const booking = await Booking.create({ user_id, service_id, name, email, phone, date, time, message, image });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const booking = await Booking.updateStatus(id, status);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Booking.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const id = req.params.id;
    const booking = await Booking.updateStatus(id, 'confirmed');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getBookingsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const bookings = await Booking.findByStatus(status);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingStats = async (req, res, next) => {
  try {
    const stats = await Booking.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID comes from auth middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const bookings = await Booking.findByUserId(userId);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
