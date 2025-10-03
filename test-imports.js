// Test script to verify all imports are working correctly
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Test middleware imports
import { authenticate, isAdmin } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Test route imports
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/upload.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

// Test database import
import pool, { testConnection } from './config/database.js';

console.log('✅ All imports successful!');
console.log('✅ Express app can be created');
console.log('✅ Middleware functions available');
console.log('✅ All route modules imported');
console.log('✅ Database connection pool available');

// Test basic Express app creation
const app = express();
app.use(cors());
app.use(express.json());

console.log('✅ Basic Express app configuration successful');
console.log('🎉 Server should be able to start without import errors');

process.exit(0);
