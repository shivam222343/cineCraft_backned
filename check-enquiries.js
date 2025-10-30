import pool from './config/database.js';

console.log('🔍 Checking enquiries in database...');

const client = await pool.connect();

try {
  // Check all bookings/enquiries
  const allBookings = await client.query(`
    SELECT id, name, email, phone, type, status, service_id, message, created_at 
    FROM bookings 
    ORDER BY created_at DESC
  `);
  
  console.log(`📊 Total records in bookings table: ${allBookings.rows.length}`);
  
  if (allBookings.rows.length > 0) {
    console.log('\n📋 All records:');
    allBookings.rows.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}`);
      console.log(`   Name: ${record.name}`);
      console.log(`   Email: ${record.email}`);
      console.log(`   Type: ${record.type || 'NULL'}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Service ID: ${record.service_id}`);
      console.log(`   Created: ${record.created_at}`);
      console.log(`   Message: ${record.message ? record.message.substring(0, 50) + '...' : 'No message'}`);
      console.log('');
    });
  }
  
  // Check specifically for enquiries
  const enquiries = await client.query(`
    SELECT * FROM bookings 
    WHERE type = 'enquiry' 
    ORDER BY created_at DESC
  `);
  
  console.log(`💬 Enquiries found: ${enquiries.rows.length}`);
  
  if (enquiries.rows.length > 0) {
    console.log('\n📝 Enquiry details:');
    enquiries.rows.forEach((enquiry, index) => {
      console.log(`${index + 1}. ${enquiry.name} (${enquiry.email})`);
      console.log(`   Status: ${enquiry.status}`);
      console.log(`   Services: ${enquiry.service_id}`);
      console.log(`   Submitted: ${enquiry.created_at}`);
    });
  } else {
    console.log('⚠️ No enquiries found with type = "enquiry"');
    
    // Check for records without type
    const noType = await client.query(`
      SELECT * FROM bookings 
      WHERE type IS NULL OR type = '' 
      ORDER BY created_at DESC
    `);
    
    console.log(`🔍 Records without type: ${noType.rows.length}`);
    if (noType.rows.length > 0) {
      console.log('These might be enquiries that weren\'t properly typed:');
      noType.rows.forEach(record => {
        console.log(`  - ${record.name} (${record.email}) - Status: ${record.status}`);
      });
    }
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
