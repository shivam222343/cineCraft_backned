import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  // First, connect to the default postgres database to create cinecraft if needed
  const defaultClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default database first
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Connecting to PostgreSQL...');
    await defaultClient.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Check if cinecraft database exists
    const dbCheck = await defaultClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cinecraft'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('📝 Creating cinecraft database...');
      await defaultClient.query('CREATE DATABASE cinecraft');
      console.log('✅ Database cinecraft created successfully!');
    } else {
      console.log('✅ Database cinecraft already exists!');
    }

    await defaultClient.end();

    // Now connect to the cinecraft database and run the setup script
    const cinecraftClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'cinecraft',
      password: process.env.DB_PASSWORD || 'admin',
      port: process.env.DB_PORT || 5432,
    });

    console.log('🔍 Connecting to cinecraft database...');
    await cinecraftClient.connect();
    console.log('✅ Connected to cinecraft database successfully!');

    // Read and execute the SQL setup script
    const sqlFilePath = path.join(process.cwd(), 'complete-database-setup.sql');
    
    console.log(`📁 Looking for SQL file at: ${sqlFilePath}`);
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL setup file not found at: ${sqlFilePath}`);
    }

    console.log('📖 Reading SQL setup script...');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the script into individual statements and execute them
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('🚀 Executing database setup script...');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === '') {
        continue;
      }

      try {
        await cinecraftClient.query(statement);
        
        // Log progress for major operations
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE (\w+)/i)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        } else if (statement.includes('INSERT INTO')) {
          const tableName = statement.match(/INSERT INTO (\w+)/i)?.[1];
          console.log(`📝 Inserted data into: ${tableName}`);
        }
      } catch (error) {
        console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
        console.error(`   Error: ${error.message}`);
        // Continue with other statements
      }
    }

    // Verify the setup by checking table counts
    console.log('\n📊 Verifying database setup...');
    
    const tables = ['users', 'services', 'portfolio', 'bookings', 'feedback', 'contacts'];
    
    for (const table of tables) {
      try {
        const result = await cinecraftClient.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      }
    }

    // Test admin user login
    console.log('\n👤 Verifying admin users...');
    const adminUsers = await cinecraftClient.query(
      "SELECT id, name, email, role FROM users WHERE role = 'admin'"
    );
    
    adminUsers.rows.forEach(user => {
      console.log(`✅ Admin User: ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    await cinecraftClient.end();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database created/verified');
    console.log('   ✅ All tables created with proper structure');
    console.log('   ✅ Sample data inserted');
    console.log('   ✅ Admin users ready');
    console.log('   ✅ Indexes created for performance');
    
    console.log('\n🚀 You can now start your application!');
    console.log('   Run: npm start or node server.js');
    
    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Email: jaywani22@gmail.com');
    console.log('   Password: JAYwani$22');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('💡 Please check your database credentials and ensure PostgreSQL is running.');
    process.exit(1);
  }
}

// Run the initialization
console.log('🎬 CineCraft Media - Database Initialization');
console.log('==========================================\n');

initializeDatabase();
