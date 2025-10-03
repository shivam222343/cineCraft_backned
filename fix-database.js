import { query } from './config/db.js';

const fixDatabase = async () => {
  try {
    console.log('🔧 Fixing CineCraft Media database schema...');
    
    // Check current table structure
    console.log('📊 Checking current tables...');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', tables.rows.map(r => r.table_name));
    
    // Check services table columns
    try {
      const servicesCols = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'services'
      `);
      console.log('Services columns:', servicesCols.rows.map(r => r.column_name));
    } catch (e) {
      console.log('Services table may not exist');
    }
    
    // Drop and recreate all tables with correct schema
    console.log('🗑️ Dropping existing tables...');
    await query('DROP TABLE IF EXISTS bookings CASCADE');
    await query('DROP TABLE IF EXISTS portfolio CASCADE');
    await query('DROP TABLE IF EXISTS services CASCADE');
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('🏗️ Creating tables with correct schema...');
    
    // Users table
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);
    
    // Services table with all required columns
    await query(`
      CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        price_range VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Portfolio table with all required columns
    await query(`
      CREATE TABLE portfolio (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        tags VARCHAR(255),
        media_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Bookings table
    await query(`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        message TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('📝 Inserting sample data...');
    
    // Insert admin user
    await query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin', 'admin@cinecraft.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin')
    `);
    
    // Insert services
    await query(`
      INSERT INTO services (title, description, price_range) VALUES
      ('Video Production', 'Professional video production services including cinematography, editing, and post-production', '$500 - $5000'),
      ('Photography', 'Professional event and portrait photography services with high-end equipment', '$200 - $2000'),
      ('Drone Services', 'Aerial cinematography and photography using professional drones', '$300 - $3000'),
      ('Live Streaming', 'Professional live streaming services for events and broadcasts', '$400 - $4000'),
      ('Post Production', 'Video editing, color grading, and audio mixing services', '$100 - $1000'),
      ('Brand Content', 'Creative content production for brands and marketing campaigns', '$800 - $8000')
    `);
    
    // Insert portfolio
    await query(`
      INSERT INTO portfolio (title, description, tags, media_url) VALUES
      ('Wedding Highlights', 'Cinematic wedding highlights reel showcasing the best moments', 'wedding,video,cinematic', 'https://res.cloudinary.com/demo/video/upload/wedding_highlights.mp4'),
      ('Product Photography', 'High-end product photography for e-commerce and marketing', 'product,photo,studio', 'https://res.cloudinary.com/demo/image/upload/product_shoot.jpg'),
      ('Corporate Event', 'Professional coverage of corporate events and conferences', 'corporate,event,video', 'https://res.cloudinary.com/demo/video/upload/corporate_event.mp4'),
      ('Brand Campaign', 'Creative brand campaign video for social media marketing', 'brand,marketing,social', 'https://res.cloudinary.com/demo/video/upload/brand_campaign.mp4'),
      ('Aerial Footage', 'Stunning aerial cinematography for real estate and tourism', 'drone,aerial,landscape', 'https://res.cloudinary.com/demo/video/upload/aerial_footage.mp4')
    `);
    
    // Insert sample bookings
    await query(`
      INSERT INTO bookings (service_id, name, email, phone, date, time, message, status) VALUES
      (1, 'John Smith', 'john@example.com', '+1-555-0123', '2024-02-15', '10:00 AM', 'Need video production for corporate event', 'pending'),
      (2, 'Sarah Johnson', 'sarah@example.com', '+1-555-0456', '2024-02-20', '2:00 PM', 'Wedding photography service needed', 'confirmed'),
      (3, 'Mike Davis', 'mike@example.com', '+1-555-0789', '2024-02-25', '11:30 AM', 'Drone footage for real estate project', 'completed')
    `);
    
    // Verify data
    const servicesCount = await query('SELECT COUNT(*) FROM services');
    const portfolioCount = await query('SELECT COUNT(*) FROM portfolio');
    const usersCount = await query('SELECT COUNT(*) FROM users');
    const bookingsCount = await query('SELECT COUNT(*) FROM bookings');
    
    console.log('✅ Database fixed successfully!');
    console.log(`📋 Services: ${servicesCount.rows[0].count}`);
    console.log(`🖼️  Portfolio: ${portfolioCount.rows[0].count}`);
    console.log(`👥 Users: ${usersCount.rows[0].count}`);
    console.log(`📅 Bookings: ${bookingsCount.rows[0].count}`);
    
    // Test the services query that was failing
    console.log('🧪 Testing services query...');
    const testServices = await query('SELECT id, title, description, price_range, created_at FROM services ORDER BY created_at DESC');
    console.log(`✅ Services query works! Found ${testServices.rows.length} services`);
    
    // Test the portfolio query that was failing
    console.log('🧪 Testing portfolio query...');
    const testPortfolio = await query('SELECT id, title, description, tags, media_url, created_at FROM portfolio ORDER BY created_at DESC');
    console.log(`✅ Portfolio query works! Found ${testPortfolio.rows.length} portfolio items`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

fixDatabase();
