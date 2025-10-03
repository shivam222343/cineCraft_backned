import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Setting up database...');

    // Run services table migration
    const servicesSQL = fs.readFileSync(
      path.join(__dirname, '../migrations/create_services_table.sql'),
      'utf8'
    );
    
    console.log('📋 Creating services table...');
    await query(servicesSQL);
    console.log('✅ Services table created successfully');

    // Check if bookings table has image column
    const bookingImageSQL = fs.readFileSync(
      path.join(__dirname, '../migrations/add_booking_image_column.sql'),
      'utf8'
    );
    
    console.log('📋 Adding image column to bookings table...');
    await query(bookingImageSQL);
    console.log('✅ Bookings table updated successfully');

    // Test the database connection
    const testResult = await query('SELECT COUNT(*) as count FROM services');
    console.log(`📊 Services in database: ${testResult.rows[0].count}`);

    const bookingResult = await query('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Bookings in database: ${bookingResult.rows[0].count}`);

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

runMigrations();
