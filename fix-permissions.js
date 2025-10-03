import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'cineuser',
  host: 'localhost',
  database: 'cinecraft',
  password: 'MH22Parbhani@',
  port: 5432,
});

async function fixPermissions() {
  try {
    console.log('Fixing PostgreSQL permissions...');
    
    await pool.query('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cineuser;');
    await pool.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cineuser;');
    await pool.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cineuser;');
    
    // Specific sequence grants
    await pool.query('GRANT ALL ON SEQUENCE bookings_id_seq TO cineuser;');
    await pool.query('GRANT ALL ON SEQUENCE users_id_seq TO cineuser;');
    await pool.query('GRANT ALL ON SEQUENCE services_id_seq TO cineuser;');
    await pool.query('GRANT ALL ON SEQUENCE portfolio_id_seq TO cineuser;');
    
    console.log('✅ Permissions fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing permissions:', error.message);
  } finally {
    await pool.end();
  }
}

fixPermissions();
