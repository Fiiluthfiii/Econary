const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🔐 Testing login API...\n');

    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@pocket.com',
        password: 'demo123',
        csrfToken: 'test',
        callbackUrl: '/dashboard',
        json: true,
      }),
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
