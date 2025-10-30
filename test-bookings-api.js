import express from 'express';
import { getBookings } from './controllers/bookingController.js';

// Test the bookings API endpoint directly
console.log('🧪 Testing bookings API endpoint...');

// Create a mock request and response
const mockReq = {};
const mockRes = {
  json: (data) => {
    console.log('📊 API Response:', JSON.stringify(data, null, 2));
    process.exit(0);
  },
  status: (code) => ({
    json: (data) => {
      console.log(`❌ API Error (${code}):`, JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
};
const mockNext = (error) => {
  console.error('💥 API Error:', error);
  process.exit(1);
};

// Call the API function directly
getBookings(mockReq, mockRes, mockNext);
