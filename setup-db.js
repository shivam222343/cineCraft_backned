import { query } from './config/db.js';
import fs from 'fs';
import path from 'path';

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up CineCraft Media database...');
    
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(process.cwd(), 'setup-database.sql'), 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sqlFile.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement.trim());
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Checking data...');
    
    // Verify data was inserted
    const services = await query('SELECT COUNT(*) FROM services');
    const portfolio = await query('SELECT COUNT(*) FROM portfolio');
    const users = await query('SELECT COUNT(*) FROM users');
    
    console.log(`📋 Services: ${services.rows[0].count}`);
    console.log(`🖼️  Portfolio: ${portfolio.rows[0].count}`);
    console.log(`👥 Users: ${users.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
