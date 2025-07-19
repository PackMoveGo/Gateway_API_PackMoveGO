#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Get API key from Render CLI config
function getApiKey() {
  try {
    const configPath = path.join(process.env.HOME, '.render', 'cli.yaml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Parse YAML-like format to get API key
    const apiKeyMatch = configContent.match(/key:\s*(.+)/);
    if (apiKeyMatch) {
      return apiKeyMatch[1].trim();
    }
    
    throw new Error('API key not found in config');
  } catch (error) {
    console.error('Could not find Render API key. Please run: render login');
    process.exit(1);
  }
}

// Make API request to Render
function makeApiRequest(method, endpoint) {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    const options = {
      hostname: 'api.render.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== API RESPONSE (${res.statusCode}) ===`);
        console.log('Headers:', res.headers);
        console.log('Body:', body);
        
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Debug API calls
async function debugApi() {
  try {
    console.log('Testing API connection...');
    
    // Test 1: Get services
    console.log('\n1. Testing /v1/services endpoint...');
    const services = await makeApiRequest('GET', '/v1/services');
    console.log('Services response:', JSON.stringify(services, null, 2));
    
    // Test 2: Get specific service (if we have an ID)
    if (services && services.length > 0 && services[0].id) {
      console.log('\n2. Testing specific service endpoint...');
      const serviceId = services[0].id;
      const serviceDetails = await makeApiRequest('GET', `/v1/services/${serviceId}`);
      console.log('Service details response:', JSON.stringify(serviceDetails, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Main function
async function main() {
  await debugApi();
}

main(); 