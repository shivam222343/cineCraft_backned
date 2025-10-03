import express from 'express';
import { getServices, getServiceById, createService, updateService, deleteService, getServicesByCategory, uploadServiceImage } from '../controllers/serviceController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

// Admin-only routes
router.post('/', authenticate, isAdmin, createService);
router.put('/:id', authenticate, isAdmin, updateService);
router.delete('/:id', authenticate, isAdmin, deleteService);

// Image upload route
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), uploadServiceImage);

export default router;
