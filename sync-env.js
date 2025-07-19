#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Get Render service ID
function getServiceId() {
  try {
    const output = execSync('render services list --format json', { encoding: 'utf8' });
    const services = JSON.parse(output);
    
    // Look for your service (you might need to adjust this logic)
    const service = services.find(s => s.name.includes('packmovego') || s.name.includes('SSD'));
    if (service) {
      return service.id;
    }
    
    console.log('Available services:');
    services.forEach(s => console.log(`- ${s.name} (${s.id})`));
    return null;
  } catch (error) {
    console.error('Error getting services:', error.message);
    return null;
  }
}

// Update environment variables
function updateEnvVars(serviceId, envVars) {
  console.log(`Updating environment variables for service: ${serviceId}`);
  
  Object.entries(envVars).forEach(([key, value]) => {
    try {
      console.log(`Setting ${key}...`);
      execSync(`render env set ${key}="${value}" --service-id ${serviceId}`, { 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.error(`Error setting ${key}:`, error.message);
    }
  });
}

// Main function
async function main() {
  try {
    console.log('Reading .env file...');
    const envVars = readEnvFile();
    console.log(`Found ${Object.keys(envVars).length} environment variables`);
    
    console.log('Getting Render service ID...');
    const serviceId = getServiceId();
    
    if (!serviceId) {
      console.log('Please provide your service ID manually:');
      console.log('render services list');
      return;
    }
    
    console.log(`Service ID: ${serviceId}`);
    console.log('Environment variables to update:');
    Object.keys(envVars).forEach(key => console.log(`- ${key}`));
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to proceed with updating these environment variables? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        updateEnvVars(serviceId, envVars);
        console.log('Environment variables updated successfully!');
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