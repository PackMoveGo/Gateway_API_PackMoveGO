#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const PRODUCTION_URL = 'https://api.packmovego.com';

const endpoints = [
  '/mobile/health',
  '/mobile/test',
  '/mobile/api',
  '/mobile/v0/blog',
  '/mobile/v0/services'
];

async function testEndpoint(url, endpoint) {
  try {
    const response = await fetch(`${url}${endpoint}`);
    const data = await response.json();
    console.log(`✅ ${url}${endpoint} - Status: ${response.status}`);
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ ${url}${endpoint} - Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Mobile API Endpoints\n');
  
  console.log('📱 Testing Local Server (localhost:3001)');
  console.log('='.repeat(50));
  
  for (const endpoint of endpoints) {
    await testEndpoint(BASE_URL, endpoint);
  }
  
  console.log('\n🌐 Testing Production Server (api.packmovego.com)');
  console.log('='.repeat(50));
  
  for (const endpoint of endpoints) {
    await testEndpoint(PRODUCTION_URL, endpoint);
  }
  
  console.log('\n📋 Phone Connection URLs');
  console.log('='.repeat(50));
  console.log('Try these URLs on your phone:');
  console.log(`📱 Local WiFi: http://10.1.12.50:3001/mobile/health`);
  console.log(`📱 Local WiFi: http://100.69.38.2:3001/mobile/health`);
  console.log(`🌐 Production: https://api.packmovego.com/mobile/health`);
  console.log('\nIf local doesn\'t work, use production URLs!');
}

runTests().catch(console.error); 