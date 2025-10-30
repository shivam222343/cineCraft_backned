import pool from './config/database.js';

console.log('🔧 Fixing existing enquiry records...');

const client = await pool.connect();

try {
  // First, let's see what we have
  const allRecords = await client.query(`
    SELECT id, name, email, type, status, date, time, created_at 
    FROM bookings 
    ORDER BY created_at DESC
  `);
  
  console.log(`📊 Found ${allRecords.rows.length} total records`);
  
  // Look for records that might be enquiries (no date/time or recent submissions)
  const potentialEnquiries = allRecords.rows.filter(record => 
    !record.date || !record.time || record.type !== 'booking'
  );
  
  console.log(`🔍 Found ${potentialEnquiries.length} potential enquiries to fix`);
  
  if (potentialEnquiries.length > 0) {
    console.log('\n📝 Potential enquiries:');
    potentialEnquiries.forEach(record => {
      console.log(`  - ID ${record.id}: ${record.name} (${record.email})`);
      console.log(`    Type: ${record.type}, Status: ${record.status}`);
      console.log(`    Date: ${record.date}, Time: ${record.time}`);
      console.log(`    Created: ${record.created_at}`);
      console.log('');
    });
    
    // Ask user which ones to convert (for now, let's convert records without date/time)
    const enquiriesToFix = potentialEnquiries.filter(record => !record.date || !record.time);
    
    if (enquiriesToFix.length > 0) {
      console.log(`🔄 Converting ${enquiriesToFix.length} records to enquiries...`);
      
      for (const record of enquiriesToFix) {
        await client.query(`
          UPDATE bookings 
          SET type = 'enquiry', status = 'pending', updated_at = NOW()
          WHERE id = $1
        `, [record.id]);
        
        console.log(`✅ Updated record ${record.id} (${record.name}) to enquiry`);
      }
    }
  }
  
  // Show final results
  const finalResults = await client.query(`
    SELECT type, COUNT(*) as count 
    FROM bookings 
    GROUP BY type 
    ORDER BY type
  `);
  
  console.log('\n📊 Final counts by type:');
  finalResults.rows.forEach(row => {
    console.log(`  ${row.type}: ${row.count} records`);
  });
  
  // Show enquiries specifically
  const enquiries = await client.query(`
    SELECT id, name, email, status, created_at 
    FROM bookings 
    WHERE type = 'enquiry' 
    ORDER BY created_at DESC
  `);
  
  console.log(`\n💬 Enquiries now in system: ${enquiries.rows.length}`);
  enquiries.rows.forEach(enquiry => {
    console.log(`  - ${enquiry.name} (${enquiry.email}) - Status: ${enquiry.status}`);
  });
  
  console.log('\n🎉 Enquiry records fixed successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
