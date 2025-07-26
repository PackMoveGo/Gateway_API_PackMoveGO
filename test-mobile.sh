#!/bin/bash

# Mobile API Test Script
# This script helps you test your API from your phone

echo "📱 === Mobile API Test Script ==="
echo ""

# Get the current IP address
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 Your IP Address: $IP_ADDRESS"
echo "🔧 Server Port: 3001"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 3001"
else
    echo "❌ Server is not running on port 3001"
    echo "   Start your server with: PORT=3001 npx ts-node src/server.ts"
    exit 1
fi

echo ""
echo "📱 === Mobile Testing Instructions ==="
echo "1. Make sure your phone is on the same WiFi network"
echo "2. Open your phone's browser"
echo "3. Navigate to: http://$IP_ADDRESS:3001/mobile-debug.html"
echo "4. Or scan the QR code on the debug page"
echo "5. Test the endpoints from your phone"
echo ""

echo "🔗 === Quick Test URLs ==="
echo "Health Check: http://$IP_ADDRESS:3001/health"
echo "API Health: http://$IP_ADDRESS:3001/api/health"
echo "Mobile Health: http://$IP_ADDRESS:3001/mobile/health"
echo "Blog Data: http://$IP_ADDRESS:3001/api/v0/blog"
echo "Services: http://$IP_ADDRESS:3001/api/v0/services"
echo "About: http://$IP_ADDRESS:3001/api/v0/about"
echo ""

echo "🧪 === Running API Tests ==="
node test-mobile-api.js

echo ""
echo "🎯 === Next Steps ==="
echo "• Open http://$IP_ADDRESS:3001/mobile-debug.html on your phone"
echo "• Test the endpoints using the debug interface"
echo "• Check the console for any errors"
echo "• If tests fail, check your firewall settings"
echo "" 