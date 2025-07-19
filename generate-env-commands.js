#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Generate curl commands
function generateCurlCommands(serviceId, envVars) {
  console.log('# Render Environment Variables Update Commands');
  console.log('# Service ID:', serviceId);
  console.log('# Copy and paste these commands one by one:');
  console.log('');
  
  Object.entries(envVars).forEach(([key, value]) => {
    // Escape the value for shell
    const escapedValue = value.replace(/'/g, "'\"'\"'");
    console.log(`curl -X PATCH "https://api.render.com/v1/services/${serviceId}/env-vars" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_API_KEY" \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"envVars":{"${key}":"${escapedValue}"}}'`);
    console.log('');
  });
}

// Generate manual commands for Render CLI (if available)
function generateManualCommands(serviceId, envVars) {
  console.log('# Manual Commands (if Render CLI supports env commands):');
  console.log('');
  
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`render env set ${key}="${value}" --service-id ${serviceId}`);
  });
  
  console.log('');
  console.log('# Or use the Render Dashboard:');
  console.log('# 1. Go to https://dashboard.render.com');
  console.log('# 2. Select your service: PackMoveGo-Backend');
  console.log('# 3. Go to Environment tab');
  console.log('# 4. Add each variable manually');
  console.log('');
}

// Generate a JSON file for bulk import
function generateJsonFile(envVars) {
  const jsonData = {
    envVars: envVars
  };
  
  fs.writeFileSync('render-env-vars.json', JSON.stringify(jsonData, null, 2));
  console.log('# JSON file created: render-env-vars.json');
  console.log('# You can use this for bulk import via API or dashboard');
  console.log('');
}

// Main function
function main() {
  try {
    console.log('Reading .env file...');
    const envVars = readEnvFile();
    console.log(`Found ${Object.keys(envVars).length} environment variables`);
    
    const serviceId = 'tea-d1rut06uk2gs73dv13v0';
    
    console.log('='.repeat(60));
    generateCurlCommands(serviceId, envVars);
    console.log('='.repeat(60));
    generateManualCommands(serviceId, envVars);
    console.log('='.repeat(60));
    generateJsonFile(envVars);
    
    console.log('Environment variables to update:');
    Object.keys(envVars).forEach(key => console.log(`- ${key}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 