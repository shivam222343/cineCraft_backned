import pool from './config/database.js';

console.log('🔄 Updating sponsor images...');

const client = await pool.connect();

try {
  // Update existing sponsors with new image URLs
  const updates = [
    { id: 1, logo_url: 'https://picsum.photos/200/100?random=1' },
    { id: 2, logo_url: 'https://picsum.photos/200/100?random=2' },
    { id: 3, logo_url: 'https://picsum.photos/200/100?random=3' },
    { id: 4, logo_url: 'https://picsum.photos/200/100?random=4' },
    { id: 5, logo_url: 'https://picsum.photos/200/100?random=5' },
    { id: 6, logo_url: 'https://picsum.photos/200/100?random=6' }
  ];
  
  for (const update of updates) {
    await client.query(
      'UPDATE sponsors SET logo_url = $1, updated_at = NOW() WHERE id = $2',
      [update.logo_url, update.id]
    );
    console.log(`✅ Updated sponsor ${update.id} with new image`);
  }
  
  console.log('🎉 All sponsor images updated successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
