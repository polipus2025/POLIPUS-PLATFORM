#!/bin/bash

echo "🔧 Installing AgriTrace360 Mobile Dependencies..."

# Install dependencies with legacy peer deps to resolve version conflicts
npm install --legacy-peer-deps

echo "✅ Dependencies installed successfully!"

echo "📱 Starting Expo Development Server..."

# Start Expo with tunnel for external access
npx expo start --tunnel

echo "🎯 Scan the QR code with Expo Go app on your phone!"