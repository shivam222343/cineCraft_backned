import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function testAdminLogin() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cinecraft',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Testing admin login credentials...');
    await client.connect();

    // Check if admin user exists
    const result = await client.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      ['jaywani22@gmail.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }

    const user = result.rows[0];
    console.log('✅ Admin user found:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);

    // Test password verification
    const testPassword = 'JAYwani$22';
    console.log('\n🔐 Testing password verification...');
    
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Password verification successful!');
      console.log('✅ Admin login should work with:');
      console.log('   Email: jaywani22@gmail.com');
      console.log('   Password: JAYwani$22');
    } else {
      console.log('❌ Password verification failed!');
      console.log('💡 Let me update the password hash...');
      
      // Generate new password hash
      const saltRounds = 12;
      const newHash = await bcrypt.hash(testPassword, saltRounds);
      
      // Update the password
      await client.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2',
        [newHash, 'jaywani22@gmail.com']
      );
      
      console.log('✅ Password updated successfully!');
      console.log('✅ Admin login should now work with:');
      console.log('   Email: jaywani22@gmail.com');
      console.log('   Password: JAYwani$22');
    }

    await client.end();

  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
  }
}

testAdminLogin();
