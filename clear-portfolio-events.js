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

async function clearPortfolioEvents() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Starting to clear all portfolio events data...');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Delete in correct order (respecting foreign key constraints)
    console.log('📂 Deleting portfolio media...');
    const mediaResult = await client.query('DELETE FROM portfolio_media');
    console.log(`✅ Deleted ${mediaResult.rowCount} media records`);
    
    console.log('📁 Deleting portfolio categories...');
    const categoriesResult = await client.query('DELETE FROM portfolio_categories');
    console.log(`✅ Deleted ${categoriesResult.rowCount} category records`);
    
    console.log('🎬 Deleting portfolio events...');
    const eventsResult = await client.query('DELETE FROM portfolio_events');
    console.log(`✅ Deleted ${eventsResult.rowCount} event records`);
    
    // Reset auto-increment sequences
    console.log('🔄 Resetting ID sequences...');
    await client.query('ALTER SEQUENCE portfolio_events_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE portfolio_categories_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE portfolio_media_id_seq RESTART WITH 1');
    console.log('✅ ID sequences reset');
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n🎉 Successfully cleared all portfolio events data!');
    console.log('📊 Summary:');
    console.log(`   • Events deleted: ${eventsResult.rowCount}`);
    console.log(`   • Categories deleted: ${categoriesResult.rowCount}`);
    console.log(`   • Media deleted: ${mediaResult.rowCount}`);
    console.log('\n✨ Database is now clean and ready for admin to create new events!');
    
    // Verify tables are empty
    console.log('\n🔍 Verifying cleanup...');
    const eventCount = await client.query('SELECT COUNT(*) FROM portfolio_events');
    const categoryCount = await client.query('SELECT COUNT(*) FROM portfolio_categories');
    const mediaCount = await client.query('SELECT COUNT(*) FROM portfolio_media');
    
    console.log(`📊 Current counts:`);
    console.log(`   • Events: ${eventCount.rows[0].count}`);
    console.log(`   • Categories: ${categoryCount.rows[0].count}`);
    console.log(`   • Media: ${mediaCount.rows[0].count}`);
    
    if (eventCount.rows[0].count === '0' && 
        categoryCount.rows[0].count === '0' && 
        mediaCount.rows[0].count === '0') {
      console.log('\n✅ Cleanup verified successfully!');
    } else {
      console.log('\n⚠️  Warning: Some data may still exist');
    }
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('❌ Error clearing portfolio events:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the cleanup
clearPortfolioEvents()
  .then(() => {
    console.log('\n🚀 Ready to create new events through admin panel!');
    console.log('👉 Go to: http://localhost:5173/admin/portfolio-events');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });
