import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Auth verification endpoint
router.get('/verify', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Token is valid' 
  });
});

// Admin verification endpoint
router.get('/verify-admin', authenticate, isAdmin, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Admin access verified' 
  });
});

export default router;
