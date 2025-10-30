import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cinecraft',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully!');

    // First, check if the users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('📝 Users table does not exist. Creating table...');
      
      // Create users table
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists!');
    }

    // Check if admin user already exists
    const adminCheck = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['jaywani22@gmail.com']
    );

    if (adminCheck.rows.length > 0) {
      console.log('⚠️ Admin user already exists with email: jaywani22@gmail.com');
      
      // Update existing user
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('JAYwani$22', saltRounds);
      
      await client.query(`
        UPDATE users 
        SET name = $1, password = $2, role = $3, updated_at = NOW()
        WHERE email = $4
      `, ['Jay Wani', hashedPassword, 'admin', 'jaywani22@gmail.com']);
      
      console.log('✅ Admin user updated successfully!');
    } else {
      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('JAYwani$22', saltRounds);

      // Insert admin user
      const result = await client.query(`
        INSERT INTO users (name, email, password, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, name, email, role, created_at
      `, ['Jay Wani', 'jaywani22@gmail.com', hashedPassword, 'admin']);

      console.log('✅ Admin user created successfully!');
      console.log('📋 User Details:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Name:', result.rows[0].name);
      console.log('   Email:', result.rows[0].email);
      console.log('   Role:', result.rows[0].role);
      console.log('   Created:', result.rows[0].created_at);
    }

    // Verify the user was created/updated
    const verification = await client.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = $1',
      ['jaywani22@gmail.com']
    );

    if (verification.rows.length > 0) {
      console.log('\n🎉 Admin user verification:');
      console.log('   ID:', verification.rows[0].id);
      console.log('   Name:', verification.rows[0].name);
      console.log('   Email:', verification.rows[0].email);
      console.log('   Role:', verification.rows[0].role);
      console.log('   Created:', verification.rows[0].created_at);
      console.log('   Updated:', verification.rows[0].updated_at);
      
      console.log('\n✅ You can now login with:');
      console.log('   Email: jaywani22@gmail.com');
      console.log('   Password: JAYwani$22');
      console.log('   Role: admin');
    }

    await client.end();
    console.log('\n🔌 Database connection closed.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('💡 Make sure your database is running and credentials are correct.');
  }
}

createAdminUser();
