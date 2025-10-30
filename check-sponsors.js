import pool from './config/database.js';

async function checkSponsors() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking sponsors table...');
    
    // Check if table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sponsors'
      );
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Count sponsors
      const count = await client.query('SELECT COUNT(*) FROM sponsors');
      console.log('Total sponsors:', count.rows[0].count);
      
      // Get all sponsors
      const sponsors = await client.query('SELECT id, name, logo_url FROM sponsors ORDER BY display_order');
      console.log('Sponsors:');
      sponsors.rows.forEach(sponsor => {
        console.log(`  - ${sponsor.id}: ${sponsor.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSponsors();
