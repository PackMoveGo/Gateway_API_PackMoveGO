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

// List all services
async function listServices() {
  try {
    console.log('Fetching all services...');
    
    const services = await makeApiRequest('GET', '/v1/services');
    
    console.log('\n=== AVAILABLE SERVICES ===');
    console.log(`Total services: ${services.length}`);
    
    services.forEach((service, index) => {
      console.log(`\n${index + 1}. Service ID: ${service.id}`);
      console.log(`   Name: ${service.name}`);
      console.log(`   Type: ${service.type}`);
      console.log(`   Status: ${service.status}`);
      console.log(`   Environment: ${service.env}`);
      console.log(`   URL: ${service.serviceDetails?.url || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error listing services:', error.message);
  }
}

// Main function
async function main() {
  await listServices();
}

main(); 