#!/bin/bash

# Red Hat Developer Hub YouTube Video Plugin Build Script
# This script helps build and test the plugin

set -e

echo "🚀 Building Red Hat Developer Hub YouTube Video Plugin..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the plugin root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test

# Build the plugin
echo "🏗️ Building plugin..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Plugin built in 'dist' directory."
    echo ""
    echo "📁 Build contents:"
    ls -la dist/
    echo ""
    echo "🚀 Plugin is ready for deployment!"
    echo ""
    echo "To integrate with Red Hat Developer Hub:"
    echo "1. Copy the 'dist' directory to your Red Hat Developer Hub instance"
    echo "2. Add the plugin to your dynamic plugins configuration"
    echo "3. Restart the service"
    echo ""
    echo "See README.md and deployment/plugin-config.yaml for detailed instructions."
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi