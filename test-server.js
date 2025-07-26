const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Testing server startup...');

// Kill any existing processes on port 3001
const killProcess = spawn('lsof', ['-ti:3001']);
killProcess.stdout.on('data', (data) => {
  const pids = data.toString().trim().split('\n').filter(pid => pid);
  if (pids.length > 0) {
    console.log(`🔪 Killing processes on port 3001: ${pids.join(', ')}`);
    spawn('kill', ['-9', ...pids]);
  }
});

// Wait a moment then start the server
setTimeout(() => {
  console.log('📡 Starting server on port 3001...');
  
  const server = spawn('npm', ['run', 'dev:backend'], {
    env: { ...process.env, PORT: '3001' },
    stdio: 'pipe'
  });

  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Check for successful startup
    if (output.includes('Server is running on port 3001')) {
      console.log('✅ Server started successfully!');
      setTimeout(() => {
        console.log('🛑 Stopping server...');
        server.kill('SIGTERM');
        process.exit(0);
      }, 5000);
    }
  });

  server.stderr.on('data', (data) => {
    console.error('❌ Server error:', data.toString());
  });

  server.on('close', (code) => {
    console.log(`📴 Server process exited with code ${code}`);
  });

  // Timeout after 30 seconds
  setTimeout(() => {
    console.log('⏰ Test timeout reached');
    server.kill('SIGTERM');
    process.exit(1);
  }, 30000);

}, 2000); 