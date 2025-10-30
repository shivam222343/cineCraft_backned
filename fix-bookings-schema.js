import pool from './config/database.js';

console.log('🔧 Fixing bookings table schema...');

const client = await pool.connect();

try {
  // Check current table structure
  const tableInfo = await client.query(`
    SELECT column_name, is_nullable, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    ORDER BY ordinal_position;
  `);
  
  console.log('📊 Current bookings table structure:');
  tableInfo.rows.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
  });
  
  // Alter table to allow NULL values for date and time columns
  console.log('\n🔄 Updating schema to allow NULL dates for enquiries...');
  
  await client.query('ALTER TABLE bookings ALTER COLUMN date DROP NOT NULL');
  console.log('✅ Made date column nullable');
  
  await client.query('ALTER TABLE bookings ALTER COLUMN time DROP NOT NULL');
  console.log('✅ Made time column nullable');
  
  // Add a type column if it doesn't exist
  try {
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'booking'
    `);
    console.log('✅ Added type column');
  } catch (error) {
    console.log('ℹ️ Type column already exists or error:', error.message);
  }
  
  // Update existing records to have proper type
  await client.query(`
    UPDATE bookings 
    SET type = CASE 
      WHEN date IS NULL OR time IS NULL THEN 'enquiry'
      ELSE 'booking'
    END
    WHERE type IS NULL OR type = ''
  `);
  console.log('✅ Updated existing records with proper type');
  
  // Show updated structure
  const updatedTableInfo = await client.query(`
    SELECT column_name, is_nullable, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    ORDER BY ordinal_position;
  `);
  
  console.log('\n📊 Updated bookings table structure:');
  updatedTableInfo.rows.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
  });
  
  console.log('\n🎉 Bookings table schema updated successfully!');
  
} catch (error) {
  console.error('❌ Error updating schema:', error.message);
} finally {
  client.release();
  await pool.end();
}
