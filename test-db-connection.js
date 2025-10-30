import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  // First, connect to the default postgres database to check if cinecraft exists
  const defaultClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default database first
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Testing connection to PostgreSQL...');
    await defaultClient.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Check if cinecraft database exists
    const result = await defaultClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cinecraft'"
    );

    if (result.rows.length === 0) {
      console.log('📝 Creating cinecraft database...');
      await defaultClient.query('CREATE DATABASE cinecraft');
      console.log('✅ Database cinecraft created successfully!');
    } else {
      console.log('✅ Database cinecraft already exists!');
    }

    await defaultClient.end();

    // Now test connection to the cinecraft database
    const cinecraftClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'cinecraft',
      password: process.env.DB_PASSWORD || 'admin',
      port: process.env.DB_PORT || 5432,
    });

    console.log('🔍 Testing connection to cinecraft database...');
    await cinecraftClient.connect();
    console.log('✅ Connected to cinecraft database successfully!');
    
    // Test a simple query
    const testResult = await cinecraftClient.query('SELECT NOW()');
    console.log('✅ Database query test successful:', testResult.rows[0].now);
    
    await cinecraftClient.end();
    console.log('🎉 All database tests passed! Your application should work now.');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Please check your database credentials and ensure PostgreSQL is running.');
  }
}

testConnection();
