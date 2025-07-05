#!/bin/bash

# Inventory Hub Frontend Deployment Script
# This script builds and prepares the React application for deployment

echo "🚀 Starting Inventory Hub Frontend Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
CI=true npm test -- --coverage --watchAll=false

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'build' directory"
echo "🌐 You can now deploy the contents of the 'build' directory to your web server"

# Optional: Create a simple server for testing
echo "🔧 Creating simple test server..."
cat > serve.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
});
EOF

echo "💡 To test the production build locally:"
echo "   npm install -g express"
echo "   node serve.js"

echo "🎉 Deployment preparation complete!"
