import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function setupTables() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cinecraft',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Connecting to cinecraft database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Create tables one by one
    console.log('📝 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        phone VARCHAR(20),
        avatar TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    console.log('📝 Creating services table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        min_price DECIMAL(10,2),
        max_price DECIMAL(10,2),
        duration VARCHAR(100),
        features TEXT[],
        category VARCHAR(50) DEFAULT 'photography',
        icon VARCHAR(10),
        image TEXT,
        deliverables TEXT[],
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Services table created');

    console.log('📝 Creating portfolio table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'videography',
        client VARCHAR(150),
        year VARCHAR(4),
        date DATE,
        location VARCHAR(200),
        thumbnail TEXT,
        images TEXT[],
        tags TEXT[],
        services TEXT[],
        duration VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Portfolio table created');

    console.log('📝 Creating bookings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service VARCHAR(100),
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        message TEXT,
        image TEXT,
        attachments TEXT[],
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
        estimated_price VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Bookings table created');

    console.log('📝 Creating feedback table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        message TEXT NOT NULL,
        service_category VARCHAR(50),
        booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        admin_response TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Feedback table created');

    console.log('📝 Creating contacts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(200),
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
        admin_notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Contacts table created');

    // Insert admin user
    console.log('👤 Creating admin user...');
    await client.query(`
      INSERT INTO users (name, email, password, role, phone, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        updated_at = NOW()
    `, ['Jay Wani', 'jaywani22@gmail.com', '$2b$12$K8.QzOvQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin', '+91-9876543210']);
    console.log('✅ Admin user created/updated');

    // Verify setup
    console.log('\n📊 Verifying setup...');
    const tables = ['users', 'services', 'portfolio', 'bookings', 'feedback', 'contacts'];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`✅ ${table}: ${result.rows[0].count} records`);
    }

    // Check admin user
    const adminCheck = await client.query("SELECT name, email, role FROM users WHERE role = 'admin'");
    console.log('\n👤 Admin users:');
    adminCheck.rows.forEach(user => {
      console.log(`✅ ${user.name} (${user.email})`);
    });

    await client.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔐 Admin Login:');
    console.log('   Email: jaywani22@gmail.com');
    console.log('   Password: JAYwani$22');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Full error:', error);
  }
}

setupTables();
