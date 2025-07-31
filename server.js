#!/usr/bin/env node

// Root server.js file for Render deployment
// This redirects to the compiled TypeScript server

const path = require('path');
const fs = require('fs');

console.log('🚀 PackMoveGO API - Starting server...');

// Try to load the compiled server
const compiledServerPath = path.join(__dirname, 'dist', 'src', 'server.js');

if (fs.existsSync(compiledServerPath)) {
  console.log(`✅ Found compiled server at: ${compiledServerPath}`);
  require(compiledServerPath);
} else {
  console.error('❌ Compiled server not found!');
  console.error('Expected:', compiledServerPath);
  console.error('Please ensure the build process completed successfully.');
  process.exit(1);
} 