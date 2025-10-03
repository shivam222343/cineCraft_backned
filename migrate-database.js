import { query } from './config/db.js';

const migrateDatabase = async () => {
  try {
    console.log('🔧 Migrating CineCraft Media database schema...');
    
    // Add missing columns to services table
    console.log('📋 Adding missing columns to services table...');
    
    try {
      await query('ALTER TABLE services ADD COLUMN IF NOT EXISTS price_range VARCHAR(100)');
      console.log('✅ Added price_range column to services');
    } catch (e) {
      console.log('ℹ️ price_range column already exists or error:', e.message);
    }
    
    try {
      await query('ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT');
      console.log('✅ Added image_url column to services');
    } catch (e) {
      console.log('ℹ️ image_url column already exists or error:', e.message);
    }
    
    // Add missing columns to portfolio table
    console.log('🖼️ Adding missing columns to portfolio table...');
    
    try {
      await query('ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_url TEXT');
      console.log('✅ Added media_url column to portfolio');
    } catch (e) {
      console.log('ℹ️ media_url column already exists or error:', e.message);
    }
    
    try {
      await query('ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS tags VARCHAR(255)');
      console.log('✅ Added tags column to portfolio');
    } catch (e) {
      console.log('ℹ️ tags column already exists or error:', e.message);
    }
    
    // Update existing services with sample data if they don't have price_range
    console.log('📝 Updating existing services with price ranges...');
    
    const services = await query('SELECT id, title FROM services WHERE price_range IS NULL');
    
    if (services.rows.length > 0) {
      const priceRanges = [
        '$500 - $5000',
        '$200 - $2000', 
        '$300 - $3000',
        '$400 - $4000',
        '$100 - $1000',
        '$800 - $8000'
      ];
      
      for (let i = 0; i < services.rows.length; i++) {
        const service = services.rows[i];
        const priceRange = priceRanges[i % priceRanges.length];
        
        await query(
          'UPDATE services SET price_range = $1 WHERE id = $2',
          [priceRange, service.id]
        );
        
        console.log(`✅ Updated service "${service.title}" with price range: ${priceRange}`);
      }
    }
    
    // Test the queries that were failing
    console.log('🧪 Testing database queries...');
    
    try {
      const testServices = await query('SELECT id, title, description, price_range, image_url, created_at FROM services ORDER BY created_at DESC');
      console.log(`✅ Services query works! Found ${testServices.rows.length} services`);
    } catch (e) {
      console.log('❌ Services query still failing:', e.message);
    }
    
    try {
      const testPortfolio = await query('SELECT id, title, description, tags, media_url, created_at FROM portfolio ORDER BY created_at DESC');
      console.log(`✅ Portfolio query works! Found ${testPortfolio.rows.length} portfolio items`);
    } catch (e) {
      console.log('❌ Portfolio query still failing:', e.message);
    }
    
    console.log('✅ Database migration completed successfully!');
    console.log('🚀 You can now restart your backend server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

migrateDatabase();
