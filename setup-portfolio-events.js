import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupPortfolioEvents = async () => {
  try {
    console.log('🚀 Setting up Portfolio Events System...');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'create-portfolio-events-system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    console.log('📊 Creating portfolio events tables...');
    await query(migrationSQL);

    console.log('✅ Portfolio Events System setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   • Created portfolio_events table');
    console.log('   • Created portfolio_categories table');
    console.log('   • Created portfolio_media table');
    console.log('   • Added sample data for testing');
    console.log('   • Created database indexes for performance');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: npm run dev');
    console.log('   3. Login to admin panel: /admin/login');
    console.log('   4. Navigate to Portfolio Events management');
    console.log('   5. Create your first event!');
    console.log('\n📚 API Endpoints Available:');
    console.log('   • GET /api/portfolio-events/events - Get all events');
    console.log('   • POST /api/portfolio-events/events - Create event (Admin)');
    console.log('   • GET /api/portfolio-events/categories - Get categories');
    console.log('   • POST /api/portfolio-events/categories - Create category (Admin)');
    console.log('   • GET /api/portfolio-events/media - Get media files');
    console.log('   • POST /api/portfolio-events/media - Create media (Admin)');

  } catch (error) {
    console.error('❌ Error setting up Portfolio Events System:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your database connection in .env file');
    console.log('   3. Ensure you have proper database permissions');
    console.log('   4. Try running: npm run test-db-connection');
    process.exit(1);
  }
};

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupPortfolioEvents();
}

export default setupPortfolioEvents;
