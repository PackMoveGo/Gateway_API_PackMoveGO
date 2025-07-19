#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env file
function readEnvFile() {
  const envPath = path.join(__dirname, 'config', '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const envVars = {};
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join('=');
      }
    }
  });
  
  return envVars;
}

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
function makeApiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    const options = {
      hostname: 'api.render.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Update environment variables
async function updateEnvVars(serviceId, envVars) {
  console.log(`Updating environment variables for service: ${serviceId}`);
  
  try {
    // First, get current environment variables
    const currentEnv = await makeApiRequest('GET', `/v1/services/${serviceId}/env-vars`);
    console.log('Current environment variables retrieved');
    
    // Prepare the update data
    const updateData = {
      envVars: {}
    };
    
    // Add all variables from .env file
    Object.entries(envVars).forEach(([key, value]) => {
      updateData.envVars[key] = value;
    });
    
    // Update the environment variables
    await makeApiRequest('PATCH', `/v1/services/${serviceId}/env-vars`, updateData);
    console.log('Environment variables updated successfully!');
    
  } catch (error) {
    console.error('Error updating environment variables:', error.message);
  }
}

// Main function
async function main() {
  try {
    console.log('Reading .env file...');
    const envVars = readEnvFile();
    console.log(`Found ${Object.keys(envVars).length} environment variables`);
    
    const serviceId = 'srv-d1rvk9vdiees73ajsuog'; // Correct service ID
    
    console.log(`Service ID: ${serviceId}`);
    console.log('Environment variables to update:');
    Object.keys(envVars).forEach(key => console.log(`- ${key}`));
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to proceed with updating these environment variables? (y/N): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await updateEnvVars(serviceId, envVars);
      } else {
        console.log('Operation cancelled.');
      }
      rl.close();
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 