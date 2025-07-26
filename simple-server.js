const http = require('http');

const server = http.createServer((req, res) => {
  // Set CORS headers for mobile
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log(`📱 Request: ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Simple server working!',
      timestamp: new Date().toISOString(),
      ip: req.socket.remoteAddress
    }));
  } else if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Mobile test successful',
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: req.socket.remoteAddress
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Simple API Server',
      endpoints: ['/health', '/test'],
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = 9000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📱 Test on your phone: http://100.69.38.2:${PORT}/health`);
}); 