import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cinecraft',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
});

async function checkMediaData() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking media data in database...\n');
    
    // Check events
    const eventsResult = await client.query('SELECT id, title FROM portfolio_events ORDER BY id');
    console.log('📊 Events in database:');
    eventsResult.rows.forEach(event => {
      console.log(`  - Event ${event.id}: ${event.title}`);
    });
    console.log(`Total events: ${eventsResult.rows.length}\n`);
    
    // Check categories
    const categoriesResult = await client.query(`
      SELECT c.id, c.name, c.event_id, e.title as event_title 
      FROM portfolio_categories c 
      LEFT JOIN portfolio_events e ON c.event_id = e.id 
      ORDER BY c.event_id, c.id
    `);
    console.log('📁 Categories in database:');
    categoriesResult.rows.forEach(cat => {
      console.log(`  - Category ${cat.id}: ${cat.name} (Event: ${cat.event_title})`);
    });
    console.log(`Total categories: ${categoriesResult.rows.length}\n`);
    
    // Check media
    const mediaResult = await client.query(`
      SELECT m.id, m.title, m.media_url, m.media_type, m.category_id, 
             c.name as category_name, e.title as event_title
      FROM portfolio_media m
      LEFT JOIN portfolio_categories c ON m.category_id = c.id
      LEFT JOIN portfolio_events e ON c.event_id = e.id
      ORDER BY e.id, c.id, m.id
    `);
    console.log('🎬 Media in database:');
    if (mediaResult.rows.length === 0) {
      console.log('  ❌ No media found in database!');
    } else {
      mediaResult.rows.forEach(media => {
        console.log(`  - Media ${media.id}: ${media.title || 'Untitled'}`);
        console.log(`    Type: ${media.media_type}, URL: ${media.media_url}`);
        console.log(`    Category: ${media.category_name} (Event: ${media.event_title})`);
        console.log('');
      });
    }
    console.log(`Total media files: ${mediaResult.rows.length}\n`);
    
    // Test API endpoint
    console.log('🔗 Testing API endpoints...');
    
    if (categoriesResult.rows.length > 0) {
      const testCategoryId = categoriesResult.rows[0].id;
      console.log(`Testing media API for category ${testCategoryId}...`);
      
      const mediaApiResult = await client.query(`
        SELECT id, category_id, title, description, media_url, media_type, thumbnail_url, 
               display_order, is_active, created_at, updated_at 
        FROM portfolio_media 
        WHERE category_id = $1 AND is_active = TRUE 
        ORDER BY display_order ASC, created_at DESC
      `, [testCategoryId]);
      
      console.log(`API query result: ${mediaApiResult.rows.length} media files`);
      mediaApiResult.rows.forEach(media => {
        console.log(`  - ${media.title}: ${media.media_url} (active: ${media.is_active})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking media data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the check
checkMediaData()
  .then(() => {
    console.log('\n✅ Database check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });
