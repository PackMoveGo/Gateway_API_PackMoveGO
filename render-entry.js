#!/usr/bin/env node

// Render entry point - JavaScript file that can be run directly
// This should be used as the start command in Render dashboard

const path = require('path');
const fs = require('fs');

console.log('🚀 PackMoveGO API - Render entry point starting...');

// Check current directory
const currentDir = __dirname;
console.log(`📁 Current directory: ${currentDir}`);

// Try multiple possible paths for the compiled server
const possiblePaths = [
  path.join(currentDir, 'dist', 'src', 'server.js'),
  path.join(currentDir, 'dist', 'server.js'),
  path.join(currentDir, 'src', 'server.js')
];

console.log('🔍 Looking for compiled server...');

let serverPath = null;

for (const serverPath of possiblePaths) {
  console.log(`  Checking: ${serverPath}`);
  if (fs.existsSync(serverPath)) {
    console.log(`✅ Found server at: ${serverPath}`);
    require(serverPath);
    return;
  }
}

console.error('❌ No compiled server found!');
console.error('Tried paths:', possiblePaths);
console.error('Please ensure the build process completed successfully.');
process.exit(1); 