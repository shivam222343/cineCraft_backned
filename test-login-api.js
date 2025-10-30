import fetch from 'node-fetch';

async function testLoginAPI() {
  try {
    console.log('🔍 Testing login API...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jaywani22@gmail.com',
        password: 'JAYwani$22'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login API test successful!');
      console.log('✅ User data:', data.data);
      console.log('✅ Token received:', data.token ? 'Yes' : 'No');
      console.log('✅ User role:', data.data.role);
      
      if (data.data.role === 'admin') {
        console.log('🎉 Admin access confirmed!');
      }
    } else {
      console.log('❌ Login API test failed:');
      console.log('   Status:', response.status);
      console.log('   Response:', data);
    }

  } catch (error) {
    console.error('❌ Error testing login API:', error.message);
  }
}

testLoginAPI();
