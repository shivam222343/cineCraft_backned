import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function testDatabaseStatus() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cinecraft',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Testing database connection...');
    await client.connect();
    console.log('✅ Database connection successful!');

    // Check if tables exist
    const tables = ['users', 'services', 'portfolio', 'bookings', 'feedback', 'contacts'];
    console.log('\n📊 Checking table status:');
    
    for (const table of tables) {
      try {
        const result = await client.query(`
          SELECT COUNT(*) as count, 
                 (SELECT COUNT(*) FROM information_schema.tables 
                  WHERE table_name = $1 AND table_schema = 'public') as exists
          FROM ${table}
        `, [table]);
        
        if (result.rows[0].exists > 0) {
          console.log(`✅ ${table}: ${result.rows[0].count} records`);
        } else {
          console.log(`❌ ${table}: Table does not exist`);
        }
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

    // Check admin users
    console.log('\n👤 Admin users:');
    try {
      const adminResult = await client.query("SELECT name, email, role FROM users WHERE role = 'admin'");
      if (adminResult.rows.length > 0) {
        adminResult.rows.forEach(user => {
          console.log(`✅ ${user.name} (${user.email})`);
        });
      } else {
        console.log('❌ No admin users found');
      }
    } catch (error) {
      console.log(`❌ Error checking admin users: ${error.message}`);
    }

    await client.end();
    console.log('\n🎉 Database test completed!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Next steps:');
    console.log('1. Run: node initialize-database.js');
    console.log('2. Or run: psql -U postgres -d cinecraft -f complete-database-setup.sql');
  }
}

testDatabaseStatus();
