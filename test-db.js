import pool from './config/database.js';

console.log('🔄 Testing database connection...');

try {
  const client = await pool.connect();
  console.log('✅ Database connected successfully');
  
  const result = await client.query('SELECT NOW()');
  console.log('📅 Current time:', result.rows[0].now);
  
  client.release();
  await pool.end();
  console.log('🔚 Connection closed');
} catch (error) {
  console.error('❌ Database error:', error.message);
  process.exit(1);
}
