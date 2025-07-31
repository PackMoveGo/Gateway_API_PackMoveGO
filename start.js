#!/usr/bin/env node

// Startup script for Render deployment
// This ensures we run the compiled JavaScript instead of TypeScript

const path = require('path');
const fs = require('fs');

// Check if dist/server.js exists
const serverPath = path.join(__dirname, 'dist', 'src', 'server.js');

if (fs.existsSync(serverPath)) {
  console.log('🚀 Starting PackMoveGO API server...');
  console.log(`📁 Server file: ${serverPath}`);
  
  // Import and run the compiled server
  require(serverPath);
} else {
  console.error('❌ Error: Compiled server file not found!');
  console.error(`Expected: ${serverPath}`);
  console.error('Make sure to run: npm run build');
  process.exit(1);
} 