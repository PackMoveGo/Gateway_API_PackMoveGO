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

// Check service details
async function checkService(serviceId) {
  try {
    console.log(`Checking service details for: ${serviceId}`);
    
    // Get service details
    const serviceDetails = await makeApiRequest('GET', `/v1/services/${serviceId}`);
    console.log('Service details response:', JSON.stringify(serviceDetails, null, 2));
    
    // Try to get environment variables
    console.log('\nTrying to get environment variables...');
    try {
      const envVars = await makeApiRequest('GET', `/v1/services/${serviceId}/env-vars`);
      console.log('Environment variables response:', JSON.stringify(envVars, null, 2));
    } catch (error) {
      console.log('Error getting environment variables:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Main function
async function main() {
  const serviceId = 'srv-d1rvk9vdiees73ajsuog';
  await checkService(serviceId);
}

main(); 