import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function addSampleData() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cinecraft',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Add services
    console.log('📝 Adding sample services...');
    const services = [
      ['Photography Services', 'Professional photography services for events, products, and portraits.', 1900.00, 800.00, 3000.00, '1 day - 1 week', ['Event Photography', 'Product Shots', 'Portraits', 'Commercial'], 'photography', '📸', ['High-res Images', 'Edited Photos', 'Print-ready Files']],
      ['Videography Services', 'High-quality video production for various needs and platforms.', 2600.00, 1200.00, 4000.00, '1-4 weeks', ['Event Coverage', 'Promotional Videos', 'Documentaries', 'Social Media'], 'videography', '🎬', ['Final Video', 'Raw Footage', 'Multiple Formats']],
      ['Cinematography', 'Cinematic storytelling through professional film production.', 5000.00, 2000.00, 8000.00, '2-8 weeks', ['Film Production', 'Music Videos', 'Short Films', 'Commercials'], 'cinematography', '🎭', ['Master File', 'Color Graded Version', 'Behind-the-scenes']],
      ['Commercial Drone Services', 'Aerial photography and videography for commercial projects.', 2250.00, 1000.00, 3500.00, '1-2 weeks', ['Aerial Shots', 'Real Estate', 'Construction', 'Mapping'], 'drone-services', '🚁', ['4K Footage', 'Still Images', 'Flight Logs']],
      ['VFX & Post Production', 'Complete post-production services from editing to final delivery.', 3250.00, 1500.00, 5000.00, '2-6 weeks', ['Motion Graphics', 'Compositing', '3D Effects', 'Color Grading'], 'vfx-post', '✨', ['Final Video', 'Project Files', 'Asset Library']],
      ['Commercial Production', 'Professional commercial video production for businesses.', 4000.00, 2000.00, 6000.00, '1-4 weeks', ['Commercial Videos', 'Brand Films', 'Product Launches', 'Corporate Content'], 'commercial', '🎯', ['Final Commercial', 'Multiple Formats', 'Usage Rights']]
    ];

    for (const service of services) {
      await client.query(`
        INSERT INTO services (title, description, price, min_price, max_price, duration, features, category, icon, deliverables, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, service);
    }
    console.log('✅ Sample services added');

    // Add portfolio items
    console.log('📝 Adding sample portfolio...');
    const portfolioItems = [
      ['Corporate Brand Film', 'A compelling brand story for a leading tech company, showcasing their innovation and values through cinematic storytelling.', 'videography', 'TechCorp Inc.', '2024', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop', ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop'], ['Corporate', 'Branding', 'Commercial'], ['Cinematography', 'Post Production'], '3 weeks', true, 'published'],
      ['Product Photography', 'Clean, professional product photography for e-commerce and marketing materials with perfect lighting and composition.', 'photography', 'Fashion Brand', '2024', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop', ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop'], ['Product', 'Commercial', 'E-commerce'], ['Photography', 'Retouching'], '2 weeks', true, 'published'],
      ['Aerial Real Estate', 'Stunning aerial footage showcasing luxury properties with cinematic drone work and smooth camera movements.', 'drone', 'Luxury Estates', '2024', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop'], ['Real Estate', 'Aerial', 'Commercial'], ['Drone Photography', 'Video Editing'], '1 week', true, 'published']
    ];

    for (const item of portfolioItems) {
      await client.query(`
        INSERT INTO portfolio (title, description, category, client, year, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      `, item);
    }
    console.log('✅ Sample portfolio added');

    // Add sample bookings
    console.log('📝 Adding sample bookings...');
    const bookings = [
      [1, 'John Smith', 'john@example.com', '+1 (555) 123-4567', 'videography', '2024-02-15', '10:00', 'Need a corporate video for our product launch.', 'pending', '$2,500 - $4,000'],
      [2, 'Sarah Johnson', 'sarah@company.com', '+1 (555) 987-6543', 'photography', '2024-02-20', '14:00', 'Product photography for our e-commerce website.', 'confirmed', '$1,200 - $2,000'],
      [4, 'Mike Davis', 'mike@startup.com', '+1 (555) 456-7890', 'drone-services', '2024-02-25', '09:00', 'Aerial shots of our new facility.', 'completed', '$1,500 - $3,000']
    ];

    for (const booking of bookings) {
      await client.query(`
        INSERT INTO bookings (service_id, name, email, phone, service, date, time, message, status, estimated_price, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      `, booking);
    }
    console.log('✅ Sample bookings added');

    // Add sample feedback
    console.log('📝 Adding sample feedback...');
    const feedbackItems = [
      ['Alice Cooper', 'alice@example.com', 5, 'Absolutely amazing photography! Professional and captured every moment beautifully.', 'photography', 'approved'],
      ['Bob Wilson', 'bob@example.com', 4, 'Great videography service for our corporate event. High quality work and timely delivery.', 'videography', 'approved'],
      ['Carol Martinez', 'carol@example.com', 5, 'Outstanding drone footage for our real estate project. The aerial shots were breathtaking!', 'drone-services', 'approved']
    ];

    for (const feedback of feedbackItems) {
      await client.query(`
        INSERT INTO feedback (name, email, rating, message, service_category, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, feedback);
    }
    console.log('✅ Sample feedback added');

    // Verify the data
    console.log('\n📊 Final verification:');
    const tables = ['users', 'services', 'portfolio', 'bookings', 'feedback', 'contacts'];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`✅ ${table}: ${result.rows[0].count} records`);
    }

    await client.end();
    console.log('\n🎉 Sample data added successfully!');
    console.log('\n🚀 Your CineCraft Media database is now ready!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  }
}

addSampleData();
