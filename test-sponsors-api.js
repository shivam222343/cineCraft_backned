import pool from './config/database.js';
import { Sponsor } from './models/sponsorModel.js';

console.log('🧪 Testing Sponsors API...');

try {
  const sponsors = await Sponsor.findAll();
  console.log('✅ Sponsors found:', sponsors.length);
  
  sponsors.forEach(sponsor => {
    console.log(`  - ${sponsor.name} (Order: ${sponsor.display_order})`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await pool.end();
}
