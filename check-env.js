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

// Check environment variables
async function checkEnvVars(serviceId) {
  try {
    console.log(`Checking environment variables for service: ${serviceId}`);
    
    // Get current environment variables
    const currentEnv = await makeApiRequest('GET', `/v1/services/${serviceId}/env-vars`);
    
    console.log('\n=== CURRENT ENVIRONMENT VARIABLES ===');
    console.log(`Total variables: ${Object.keys(currentEnv.envVars || {}).length}`);
    
    if (currentEnv.envVars) {
      Object.entries(currentEnv.envVars).forEach(([key, value]) => {
        // Mask sensitive values
        const displayValue = key.toLowerCase().includes('password') || 
                           key.toLowerCase().includes('secret') || 
                           key.toLowerCase().includes('key') ? 
                           '***MASKED***' : value;
        console.log(`${key}: ${displayValue}`);
      });
    } else {
      console.log('No environment variables found');
    }
    
    // Also check service details
    const serviceDetails = await makeApiRequest('GET', `/v1/services/${serviceId}`);
    console.log('\n=== SERVICE DETAILS ===');
    console.log(`Name: ${serviceDetails.service.name}`);
    console.log(`Status: ${serviceDetails.service.status || 'N/A'}`);
    console.log(`Environment: ${serviceDetails.service.serviceDetails?.env || 'N/A'}`);
    console.log(`URL: ${serviceDetails.service.serviceDetails?.url || 'N/A'}`);
    
  } catch (error) {
    console.error('Error checking environment variables:', error.message);
  }
}

// Main function
async function main() {
  const serviceId = 'srv-d1rvk9vdiees73ajsuog'; // Correct service ID
  await checkEnvVars(serviceId);
}

main(); 