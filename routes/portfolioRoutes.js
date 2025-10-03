import express from 'express';
import { getPortfolio, getPortfolioById, getPortfolioByCategory, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../controllers/portfolioController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPortfolio);
router.get('/category/:category', getPortfolioByCategory);
router.get('/:id', getPortfolioById);

// Admin-only routes
router.post('/', authenticate, isAdmin, createPortfolioItem);
router.put('/:id', authenticate, isAdmin, updatePortfolioItem);
router.delete('/:id', authenticate, isAdmin, deletePortfolioItem);

// Image upload route for portfolio
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), uploadImage);

export default router;
