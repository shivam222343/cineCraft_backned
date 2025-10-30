import express from 'express';
import {
  // Event controllers
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventOrder,
  // Category controllers
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Media controllers
  getMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  updateMediaOrder
} from '../controllers/portfolioEventsController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// =============================================
// EVENT ROUTES
// =============================================

// Public routes
router.get('/events', getEvents);
router.get('/events/:id', getEventById);

// Admin-only routes
router.post('/events', authenticate, isAdmin, createEvent);
router.put('/events/:id', authenticate, isAdmin, updateEvent);
router.delete('/events/:id', authenticate, isAdmin, deleteEvent);
router.patch('/events/reorder', authenticate, isAdmin, updateEventOrder);

// =============================================
// CATEGORY ROUTES
// =============================================

// Public routes
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);

// Admin-only routes
router.post('/categories', authenticate, isAdmin, createCategory);
router.put('/categories/:id', authenticate, isAdmin, updateCategory);
router.delete('/categories/:id', authenticate, isAdmin, deleteCategory);

// =============================================
// MEDIA ROUTES
// =============================================

// Public routes
router.get('/media', getMedia);
router.get('/media/:id', getMediaById);

// Admin-only routes
router.post('/media', authenticate, isAdmin, createMedia);
router.put('/media/:id', authenticate, isAdmin, updateMedia);
router.delete('/media/:id', authenticate, isAdmin, deleteMedia);
router.patch('/media/reorder', authenticate, isAdmin, updateMediaOrder);

// =============================================
// UPLOAD ROUTES
// =============================================

// Image/Video upload routes for portfolio events
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), uploadImage);
router.post('/upload-video', authenticate, isAdmin, upload.single('video'), uploadImage);
router.post('/upload-media', authenticate, isAdmin, upload.single('media'), uploadImage);

// Test upload without auth (for debugging)
router.post('/upload-test', upload.single('image'), uploadImage);

// Debug route to test if routes are working
router.get('/debug-routes', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio events routes are working!',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /events',
      'POST /upload-image',
      'POST /upload-video', 
      'POST /upload-media'
    ]
  });
});

// Test upload route without auth (for debugging)
router.post('/test-upload', upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files provided' 
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname
    }));

    res.json({ 
      success: true, 
      data: uploadedFiles,
      message: `${uploadedFiles.length} files uploaded successfully` 
    });
  } catch (err) {
    console.error('Test upload error:', err);
    next(err);
  }
});

// Multiple file upload for event cover images
router.post('/upload-multiple', authenticate, isAdmin, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files provided' 
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname
    }));

    res.json({ 
      success: true, 
      data: uploadedFiles,
      message: `${uploadedFiles.length} files uploaded successfully` 
    });
  } catch (err) {
    console.error('Multiple file upload error:', err);
    next(err);
  }
});

export default router;
