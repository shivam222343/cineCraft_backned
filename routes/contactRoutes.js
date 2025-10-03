import express from 'express';
import { submitContactForm, getContactInfo } from '../controllers/contactController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', submitContactForm);           // Submit contact form
router.get('/info', getContactInfo);           // Get contact information

export default router;
