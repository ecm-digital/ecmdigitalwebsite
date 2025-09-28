// Simple test script to verify agency management panel deployment
const https = require('https');

// Test URLs
const urls = [
  'https://agency-management-panel.vercel.app/',
  'https://agency-management-panel.vercel.app/clients',
  'https://agency-management-panel.vercel.app/projects',
  'https://agency-management-panel.vercel.app/finances',
  'https://agency-management-panel.vercel.app/analytics',
  'https://agency-management-panel.vercel.app/reports',
  'https://agency-management-panel.vercel.app/settings'
];

console.log('Testing Agency Management Panel Deployment...\n');

let passed = 0;
let failed = 0;

function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${url} - Status: ${res.statusCode}`);
        passed++;
      } else {
        console.log(`❌ ${url} - Status: ${res.statusCode}`);
        failed++;
      }
      resolve();
    });

    req.on('error', (e) => {
      console.log(`❌ ${url} - Error: ${e.message}`);
      failed++;
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log(`❌ ${url} - Timeout`);
      failed++;
      req.destroy();
      resolve();
    });
  });
}

async function runTests() {
  for (const url of urls) {
    await testUrl(url);
  }

  console.log('\n--- Test Results ---');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Deployment is successful.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the deployment.');
  }
}

// Run the tests
runTests();