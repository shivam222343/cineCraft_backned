import pool from './config/database.js';

console.log('🎛️ Adding sponsors sliding speed control...');

const client = await pool.connect();

try {
  // Check if sliding_speed column exists
  const columnCheck = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'sponsors' AND column_name = 'sliding_speed'
  `);
  
  if (columnCheck.rows.length === 0) {
    // Add sliding_speed column to sponsors table
    await client.query(`
      ALTER TABLE sponsors 
      ADD COLUMN sliding_speed INTEGER DEFAULT 30
    `);
    console.log('✅ Added sliding_speed column to sponsors table');
  } else {
    console.log('ℹ️ sliding_speed column already exists');
  }
  
  // Add global settings table for sponsor configuration
  const settingsTableCheck = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name = 'sponsor_settings'
  `);
  
  if (settingsTableCheck.rows.length === 0) {
    await client.query(`
      CREATE TABLE sponsor_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Created sponsor_settings table');
    
    // Insert default settings
    await client.query(`
      INSERT INTO sponsor_settings (setting_key, setting_value, description) VALUES
      ('sliding_speed', '30', 'Speed of sponsor logos sliding animation (seconds for one complete cycle)'),
      ('auto_play', 'true', 'Whether sponsors should auto-slide or be static'),
      ('pause_on_hover', 'true', 'Whether to pause sliding when user hovers over sponsors')
    `);
    console.log('✅ Inserted default sponsor settings');
  } else {
    console.log('ℹ️ sponsor_settings table already exists');
  }
  
  // Show current settings
  const settings = await client.query('SELECT * FROM sponsor_settings ORDER BY setting_key');
  console.log('\n📊 Current sponsor settings:');
  settings.rows.forEach(setting => {
    console.log(`  ${setting.setting_key}: ${setting.setting_value} (${setting.description})`);
  });
  
  // Show sponsors table structure
  const tableInfo = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'sponsors' 
    ORDER BY ordinal_position
  `);
  
  console.log('\n📋 Updated sponsors table structure:');
  tableInfo.rows.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
  });
  
  console.log('\n🎉 Sponsors speed control setup complete!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
