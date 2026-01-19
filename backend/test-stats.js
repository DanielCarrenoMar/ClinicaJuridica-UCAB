const fetch = require('node-fetch');

async function testStatsEndpoint() {
  try {
    console.log('Testing /api/v1/stats/cases/by-subject-scope...');
    const response = await fetch('http://localhost:3000/api/v1/stats/cases/by-subject-scope');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('✅ SUCCESS: Data found!');
      console.log(`Found ${data.data.length} records`);
    } else {
      console.log('❌ ISSUE: No data found or error in response');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 3000');
    }
  }
}

testStatsEndpoint();
