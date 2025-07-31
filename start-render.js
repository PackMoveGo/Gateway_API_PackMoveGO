#!/usr/bin/env node

// Render start script
// This should be used as the start command in Render dashboard

const path = require('path');
const fs = require('fs');

console.log('🚀 PackMoveGO API - Starting from Render start script...');

// Check if we're in the right directory
const currentDir = __dirname;
console.log(`📁 Current directory: ${currentDir}`);

// Try multiple possible paths for the compiled server
const possiblePaths = [
  path.join(currentDir, 'dist', 'src', 'server.js'),
  path.join(currentDir, 'dist', 'server.js'),
  path.join(currentDir, 'src', 'server.js')
];

let serverPath = null;

for (const path of possiblePaths) {
  if (fs.existsSync(path)) {
    serverPath = path;
    console.log(`✅ Found server at: ${path}`);
    break;
  }
}

if (serverPath) {
  console.log('🚀 Loading server...');
  require(serverPath);
} else {
  console.error('❌ No compiled server found!');
  console.error('Tried paths:', possiblePaths);
  console.error('Please ensure the build process completed successfully.');
  process.exit(1);
} 